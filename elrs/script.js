const targetsJsonPath =
  "https://raw.githubusercontent.com/BUSHA/targets/refs/heads/mafia-targets/targets.json";
const layoutFolder =
  "https://raw.githubusercontent.com/BUSHA/targets/refs/heads/mafia-targets";
const baseFirmwarePath = "firmware";
var FirmwareVersion = "1_2_2";
const availableFirmwares = [
  //RX 900
  "Unified_ESP8285_900_RX",
  "Unified_ESP32_900_RX",
  "Unified_ESP8285_LR1121_900_RX",
  "Unified_ESP32_LR1121_RX",
  "Unified_ESP32C3_LR1121_RX",
  // "Unified_ESP32C3_900_RX",

  //RX 2400
  "Unified_ESP8285_2400_RX",
  "Unified_ESP32C3_2400_RX",
  "Unified_ESP32_2400_RX",

  //TX 900
  "Unified_ESP32_LR1121_TX",
  "Unified_ESP32_900_TX",

  //TX 2400
  "Unified_ESP32_2400_TX",
];

let targetsData = null;
let layoutData = null;

function countAvailableTargets() {
  let rxCount = 0;
  let txCount = 0;

  if (!targetsData) return { rxCount, txCount };

  for (const brand in targetsData) {
    for (const key in targetsData[brand]) {
      const devices = targetsData[brand][key];
      if (devices) {
        const validDevices = Object.values(devices).filter((device) =>
          availableFirmwares.includes(device.firmware)
        );

        if (key.includes("rx")) {
          rxCount += validDevices.length;
        } else if (key.includes("tx")) {
          txCount += validDevices.length;
        }
      }
    }
  }

  return { rxCount, txCount };
}

function displayTargetAndVersion() {
  const { rxCount, txCount } = countAvailableTargets();
  const targetCountElement = document.getElementById("targetCounts");
  const displayVersionElement = document.getElementById("frwVersion");
  const firmwareVersionWeb = FirmwareVersion.replace(/_/g, ".");

  if (targetCountElement) {
    targetCountElement.textContent = `${rxCount} RX, ${txCount} TX`;
  }
  displayVersionElement.textContent = `${firmwareVersionWeb}`;
}

async function loadTargetsJson() {
  try {
    const response = await fetch(targetsJsonPath);
    if (!response.ok) {
      throw new Error(`Failed to load targets.json: ${response.statusText}`);
    }
    targetsData = await response.json();
    console.log("Targets JSON loaded:", targetsData);
    loadFromURLParams();
    displayTargetAndVersion();
  } catch (error) {
    toast("Error loading targets.json: " + error.message, "error");
    targetsData = null;
  }
  updateURLParams();
  updateGenerateButtonState();
}

function populateFrequencies() {
  const deviceType = document.getElementById("deviceType").value.toLowerCase();
  const frequencySelect = document.getElementById("frequency");
  frequencySelect.disabled = !deviceType;
  frequencySelect.innerHTML =
    '<option data-i18n="elrs_opt_frq" value="">Select frequency</option>';

  if (deviceType && targetsData) {
    const frequencies = ["900", "2400", "dual"];
    frequencies.forEach((freq) => {
      const hasValidDevices = Object.keys(targetsData).some((brand) => {
        const devices = targetsData[brand][`${deviceType}_${freq}`];
        return (
          devices &&
          Object.values(devices).some((device) =>
            availableFirmwares.includes(device.firmware)
          )
        );
      });

      if (hasValidDevices) {
        const option = document.createElement("option");
        option.value = freq;
        if (freq === "900") {
          option.textContent = `900 (700/500/400) ${getTranslation("mhz")}`;
        } else {
          option.textContent =
            freq === "dual"
              ? "Dual 900/2400"
              : `${freq} ${getTranslation("mhz")}`;
        }
        frequencySelect.appendChild(option);
      }
    });
  }
  populateBrands();
  translatePage(localStorage.getItem("language") || "en");
}

function populateBrands() {
  const deviceType = document.getElementById("deviceType").value.toLowerCase();
  const frequency = document.getElementById("frequency").value;
  const brandSelect = document.getElementById("brandSelect");
  brandSelect.disabled = !(deviceType && frequency);
  brandSelect.innerHTML =
    '<option data-i18n="elrs_opt_brnd" value="">Select brand</option>';

  if (targetsData && deviceType && frequency) {
    const brandOptions = [];

    for (const brand in targetsData) {
      const devices = targetsData[brand][`${deviceType}_${frequency}`];
      if (devices) {
        const hasValidFirmware = Object.values(devices).some((device) =>
          availableFirmwares.includes(device.firmware)
        );

        if (hasValidFirmware) {
          const option = document.createElement("option");
          option.value = brand;
          option.textContent = targetsData[brand].name;
          brandOptions.push(option);
        }
      }
    }

    brandOptions.sort((a, b) => {
      if (a.value.toLowerCase() === "mafia") return -1;
      if (b.value.toLowerCase() === "mafia") return 1;
      return a.textContent.localeCompare(b.textContent);
    });

    brandOptions.forEach((option) => brandSelect.appendChild(option));
  }
  populateTargets();
  translatePage(localStorage.getItem("language") || "en");
}

function populateTargets() {
  const brand = document.getElementById("brandSelect").value;
  const deviceType = document.getElementById("deviceType").value.toLowerCase();
  const frequency = document.getElementById("frequency").value;
  const targetSelect = document.getElementById("target");
  targetSelect.disabled = !(brand && deviceType && frequency);
  targetSelect.innerHTML =
    '<option data-i18n="elrs_opt_trgt" value="">Select target</option>';

  let targets = [];
  if (targetsData && brand && deviceType && frequency) {
    targets = getFilteredTargets(brand, deviceType, frequency);
    targets.forEach((target) => {
      const option = document.createElement("option");
      option.value = target.product_name.replace(/\s+/g, "_");
      option.textContent = target.product_name;
      targetSelect.appendChild(option);
    });
  }

  // Читання параметра з URL і порівняння з підкресленнями
  const params = new URLSearchParams(window.location.search);
  const targetParam = params.get("target");
  if (targetParam) {
    const matchingOption = Array.from(targetSelect.options).find(
      (option) => option.value === targetParam
    );
    if (matchingOption) {
      targetSelect.value = matchingOption.value;
      updateFirmwareInfo();
    }
  }
  translatePage(localStorage.getItem("language") || "en");
}

function getFilteredTargets(brand, deviceType, frequency) {
  if (!targetsData || !targetsData[brand]) return [];
  const devices = targetsData[brand][`${deviceType}_${frequency}`];
  if (!devices) return [];

  // Фільтрувати тільки ті цілі, у яких firmware є в списку availableFirmwares
  return Object.values(devices).filter((device) =>
    availableFirmwares.includes(device.firmware)
  );
}

function updateURLParams() {
  const deviceType = document.getElementById("deviceType").value;
  const frequency = document.getElementById("frequency").value;
  const brand = document.getElementById("brandSelect").value;
  const target = document.getElementById("target").value;

  const params = new URLSearchParams(window.location.search);

  if (deviceType) params.set("dt", deviceType);
  else params.delete("dt");

  if (frequency) params.set("f", frequency);
  else params.delete("f");

  if (brand) params.set("b", brand);
  else params.delete("b");

  if (target) params.set("t", target);
  else params.delete("t");

  window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
}

function loadFromURLParams() {
  const params = new URLSearchParams(window.location.search);
  const deviceType = params.get("dt");
  const frequency = params.get("f");
  const brand = params.get("b");
  const target = params.get("t");

  if (deviceType) {
    document.getElementById("deviceType").value = deviceType;
    populateFrequencies();
  }
  if (frequency) {
    document.getElementById("frequency").value = frequency;
    populateBrands();
  }
  if (brand) {
    document.getElementById("brandSelect").value = brand;
    populateTargets();
  }
  if (target) {
    const targetSelect = document.getElementById("target");
    if (targetSelect.querySelector(`option[value="${target}"]`)) {
      targetSelect.value = target;
      updateFirmwareInfo();
    }
  }

  updateURLParams();
  updateGenerateButtonState();
}

async function loadLayoutFile(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load layout file: ${filePath}`);
    }
    layoutData = await response.json();
    // console.log("[Layout file]:", filePath.split('/').pop())
    // console.log("[Layout]:", layoutData)
  } catch (error) {
    toast("Error loading layout file: " + error.message, "error");
    layoutData = null;
  }
}

function updateFirmwareInfo() {
  const targetValue = document.getElementById("target").value;
  const brand = document.getElementById("brandSelect").value;
  const deviceType = document.getElementById("deviceType").value.toLowerCase();
  const freq = document.getElementById("frequency").value;

  const filteredTargets = getFilteredTargets(brand, deviceType, freq);
  const selectedTarget = filteredTargets.find(
    (item) => item.product_name.replace(/\s+/g, "_") === targetValue
  );

  if (selectedTarget) {
    const layoutFilePath = `${layoutFolder}/${deviceType.toUpperCase()}/${
      selectedTarget.layout_file
    }`;
    loadLayoutFile(layoutFilePath);

    // console.log("[Data to be written to firmware]:")
    // console.log("  Product Name:", selectedTarget.product_name || "Unified")
    // console.log("  Lua Name:", selectedTarget.lua_name || "Unified")

    // if (layoutData) {
    //   console.log("  Layout Data:", JSON.stringify(layoutData))
    // }

    // console.log("[Firmware name]:", selectedTarget.firmware)

    // if (selectedTarget.config && selectedTarget.config.logo_file) {
    //   console.log("Logo File:", selectedTarget.config.logo_file)
    // }

    // if (selectedTarget.config && selectedTarget.config.prior_target_name) {
    //   console.log("Prior Target Name:", selectedTarget.config.prior_target_name)
    // }
  } else {
    layoutData = null;
  }
}
async function downloadBaseFirmware(firmwareName) {
  const response = await fetch(
    `${baseFirmwarePath}/${FirmwareVersion}/${firmwareName}.bin`
  );
  if (!response.ok) {
    throw new Error("Failed to download base firmware.");
  }
  return await response.arrayBuffer();
}

async function downloadFirmware() {
  if (!layoutData) {
    toast("Layout file not loaded. Please check your selection.", "error");
    return;
  }

  try {
    const selectedTarget = document.getElementById("target").value;
    const brand = document.getElementById("brandSelect").value;
    const deviceType = document
      .getElementById("deviceType")
      .value.toLowerCase();
    const frequency = document.getElementById("frequency").value;

    const filteredTargets = getFilteredTargets(brand, deviceType, frequency);
    const targetDetails = filteredTargets.find(
      (item) => item.product_name.replace(/\s+/g, "_") === selectedTarget
    );
    console.clear();
    console.log("[Product]:", targetDetails.product_name);
    console.log("[Firmware]:", targetDetails.firmware);
    console.log("[Layout]:", targetDetails.layout_file);
    // console.log("[Target details]:", targetDetails)

    if (!targetDetails || !targetDetails.firmware) {
      throw new Error("Firmware name not found in selected target.");
    }

    const firmwareName = targetDetails.firmware;
    const arrayBuffer = await downloadBaseFirmware(firmwareName);

    let modifiedBuffer = modifyFirmware(arrayBuffer, layoutData, targetDetails);

    // Перевіряємо, чи потрібен GZIP для ESP8285
    const isEsp8285 = firmwareName.includes("ESP8285");

    let blob, fileName;
    if (isEsp8285) {
      // Стиснення у формат GZIP для ESP8285
      const compressed = pako.gzip(new Uint8Array(modifiedBuffer));
      blob = new Blob([compressed], { type: "application/gzip" });
      fileName = `${targetDetails.product_name.replace(
        /\s+/g,
        "_"
      )}_mafia_${FirmwareVersion}.bin.gz`;
    } else {
      // Для інших зберігаємо як простий BIN файл
      blob = new Blob([modifiedBuffer], { type: "application/octet-stream" });
      fileName = `${targetDetails.product_name.replace(
        /\s+/g,
        "_"
      )}_mafia_${FirmwareVersion}.bin`;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading or modifying firmware:", error);
  }
}

function modifyFirmware(buffer, layoutData, selectedTarget) {
  const byteArray = new Uint8Array(buffer);
  const dataView = new DataView(byteArray.buffer);

  const firmwareData = getAppSegments(dataView);
  const firmwareEnd = firmwareData.firmwareEndAddress;

  // Генеруємо випадкове число для flash-discriminator
  function getRandomFlashDiscriminator() {
    return Math.floor(Math.random() * (2 ** 32 - 1) + 1);
  }

  let domainValue = 1;
  if (selectedTarget.firmware.includes("2400")) {
    domainValue = 0;
  }

  const defines = {
    "flash-discriminator": getRandomFlashDiscriminator(),
    "wifi-on-interval": 60,
    uid: [55, 217, 56, 117, 18, 178],
    "lock-on-first-connection": true,
    domain: domainValue,
  };

  const productName = selectedTarget.product_name || "UnifiedM";
  const luaName = selectedTarget.lua_name || "UnifiedM";

  writeStringToBuffer(byteArray, firmwareEnd, productName, 128);

  writeStringToBuffer(byteArray, firmwareEnd + 128, luaName, 16);

  const definesString = JSON.stringify(defines)
    .replace(/,/g, ", ")
    .replace(/:/g, ": ");

  writeStringToBuffer(byteArray, firmwareEnd + 128 + 16, definesString, 512);

  if (layoutData) {
    let finalLayout = layoutData;
    if (selectedTarget.overlay) {
      finalLayout = { ...layoutData, ...selectedTarget.overlay };
    }
    const layoutString = JSON.stringify(finalLayout);
    const formattedLayoutString = layoutString
      .replace(/,/g, ", ")
      .replace(/:/g, ": ");

    // console.log("  Initial layout:", JSON.stringify(layoutData))
    // console.log("  Updated layout:", JSON.stringify(finalLayout))

    writeStringToBuffer(
      byteArray,
      firmwareEnd + 128 + 16 + 512,
      formattedLayoutString,
      2048
    );
  }

  if (selectedTarget.config && selectedTarget.config.logo_file) {
    const logoOffset = firmwareEnd + 128 + 16 + 512 + 2048;
    // Виконайте необхідні дії з logoOffset, якщо треба
  }

  if (selectedTarget.config && selectedTarget.config.prior_target_name) {
    const priorOffset = firmwareEnd + 128 + 16 + 2048;
    byteArray.set([0xbe, 0xef, 0xca, 0xfe], priorOffset);
    writeStringToBuffer(
      byteArray,
      priorOffset + 4,
      selectedTarget.config.prior_target_name,
      selectedTarget.config.prior_target_name.length + 1
    );
  }

  return byteArray.buffer;
}

document.addEventListener("DOMContentLoaded", function () {
  const eCombo = "bWFrZW1lcHJv";
  const combo = atob(eCombo).split("");

  let inputSequence = [];
  let source = 0;
  let timeout;

  function insertSeq() {
    document.getElementById("pl").innerHTML = `
          <div id="pro">
              <form onsubmit="login(); return false;">
                  <label for="password">Введіть персональний пароль</label>
                  <input type="password" id="passwordInput" placeholder="Введіть пароль">
                  <button type="submit">Увійти</button>
              </form>
          </div><br>
      `;
    toast("Секретний режим активовано");
  }

  document.getElementById("logo").addEventListener("touchstart", function () {
    source++;
    clearTimeout(timeout);
    timeout = setTimeout(() => (source = 0), 800);
    if (source === 7) {
      insertSeq();
    }
  });

  document.addEventListener("keydown", function (event) {
    inputSequence.push(event.key);
    inputSequence = inputSequence.slice(-combo.length);

    if (inputSequence.join("") === combo.join("")) {
      insertSeq();
    }
  });
});

function prefsValidator() {
  const check = String.fromCharCode(97, 112, 112, 108, 101);
  const checked = String.fromCharCode(1103, 1073, 1083, 1086, 1082, 1086);
  const checker = document.createElement("div");
  checker.id = "prefs-checker";
  checker.textContent = check;
  checker.style.display = "none";
  document.body.appendChild(checker);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.id === "prefs-checker") {
        const currentText = mutation.target.textContent;
        if (currentText === checked) {
          const extraChecker = document.getElementById("generateFirmware");
          if (extraChecker) {
            extraChecker.onclick = "gen()";
            extraChecker.disabled = true;
          }
        }
      }
    });
  });

  observer.observe(checker, {
    characterData: true,
    childList: true,
    subtree: true,
  });
}

function writeStringToBuffer(buffer, startIndex, string, maxLength) {
  let i = 0;
  for (; i < string.length && i < maxLength; i++) {
    buffer[startIndex + i] = string.charCodeAt(i);
  }
  // Заповнюємо залишок нулями, якщо потрібно
  for (; i < maxLength; i++) {
    buffer[startIndex + i] = 0;
  }
}

function getAppSegments(dataView) {
  let baseAddress = 0x0;

  let magic = dataView.getUint16(0);
  if (magic === 0xffff) {
    // if ESP32 dumped from 0, then first 0x1000 bytes are 0xff, skipping them
    if (dataView.getUint8(0x10000) === 0xe9) {
      baseAddress = 0x10000;
    } else {
      throw new Error("Не знайдено заголовок, ймовірно це не файл прошивки!");
    }
  } else if (magic === 0xe903) {
    // if ESP32 dumped from 0x1000
    if (dataView.getUint8(0x10000 - 0x1000) === 0xe9) {
      baseAddress = 0x10000 - 0x1000;
    } else {
      throw new Error("Не знайдено заголовок, ймовірно це не файл прошивки!");
    }
  }

  let offset = baseAddress;
  magic = dataView.getUint8(offset);
  let segmentsCount = dataView.getUint8(offset + 1);

  if (magic !== 0xe9) {
    throw new Error("Не знайдено заголовок, ймовірно це не файл прошивки!");
  }

  let is8285 = false;
  if (segmentsCount === 2) {
    offset = baseAddress + 0x1000;
    magic = dataView.getUint8(offset);
    offset += 1;

    segmentsCount = dataView.getUint8(offset);
    offset += 1;

    offset += 6;

    is8285 = true;
  } else {
    offset = baseAddress + 24;
  }

  const segments = [];
  for (let i = 0; i < segmentsCount; i++) {
    const segmentAddress = offset;
    const memoryOffset = dataView.getUint32(offset, true);
    offset += 4;
    const segmentSize = dataView.getUint32(offset, true);
    offset += 4 + segmentSize;

    segments.push({
      segmentNum: i,
      memoryOffset,
      segmentSize,
      segmentAddress,
    });
  }

  offset = (offset + 16) & ~15;
  if (!is8285) {
    offset += 32;
  }
  console.log("[BIN details]:");
  console.log("  [is8285]:", is8285);
  console.log("  [Firmware end]:", offset);

  return {
    is8285,
    segmentsCount,
    segments,
    firmwareEndAddress: offset,
  };
}

function addEventListeners() {
  const selectors = ["deviceType", "frequency", "brandSelect", "target"];
  selectors.forEach((id) => {
    document.getElementById(id).addEventListener("change", function () {
      if (this.id === "deviceType") {
        populateFrequencies();
      } else if (this.id === "frequency") {
        populateBrands();
      } else if (this.id === "brandSelect") {
        populateTargets();
      } else if (this.id === "target") {
        updateFirmwareInfo();
      }
      updateURLParams();
      updateGenerateButtonState();
    });
  });
}

function updateGenerateButtonState() {
  const deviceType = document.getElementById("deviceType").value;
  const frequency = document.getElementById("frequency").value;
  const brand = document.getElementById("brandSelect").value;
  const target = document.getElementById("target").value;
  const generateButton = document.getElementById("generateFirmware");

  if (deviceType && frequency && brand && target) {
    generateButton.disabled = false;
  } else {
    generateButton.disabled = true;
  }
}

function getUID(phrase) {
  const fullPhrase = `-DMY_BINDING_PHRASE="${phrase}"`;
  const hash = CryptoJS.MD5(CryptoJS.enc.Utf8.parse(fullPhrase));
  let uid = "";

  for (let i = 0; i < 6; i++) {
    const byte = (hash.words[Math.floor(i / 4)] >>> (24 - 8 * (i % 4))) & 0xff;
    uid += byte.toString();
  }

  return Number(uid);
}

document.addEventListener("DOMContentLoaded", function () {
  loadTargetsJson();
  addEventListeners();
  prefsValidator();
});

async function login() {
  const password = document.getElementById("passwordInput").value;
  const passwordUID = String(getUID(password));

  const response = await fetch("https://auth.vtx.in.ua", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ passwordUID }),
  });

  if (response.ok) {
    const data = await response.json();
    window.FirmwareVersion = data.secret;
    displayTargetAndVersion();
    toast("Pro версія активована");
    document.getElementById("pl").innerHTML = ``;
    document.getElementById("frwVersion").classList.add("highlight-bg");
  } else {
    toast("Невірний пароль", "error");
    document.getElementById("pl").innerHTML = ``;
  }
}
