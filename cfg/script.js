let checkboxState = true;

function getValue(id) {
  return document.getElementById(id).value;
}

function generateResult() {
  const auxSelect = getValue("aux-select");
  const powerState1 = getValue("power-state-1");
  const powerState1LevelFrom = getValue("power-state-1-level-from");
  const powerState1LevelTo = getValue("power-state-1-level-to");

  const powerState2 = getValue("power-state-2");
  const powerState2LevelFrom = getValue("power-state-2-level-from");
  const powerState2LevelTo = getValue("power-state-2-level-to");

  const powerState3 = getValue("power-state-3");
  const powerState3LevelFrom = getValue("power-state-3-level-from");
  const powerState3LevelTo = getValue("power-state-3-level-to");

  const portSelect = getValue("port-select");
  const protocolSelect = getValue("protocol-select");

  const confirmationCheckbox = document.getElementById("confirmation-checkbox");

  const vtxTable = getValue("vtxTable");

  var temlateSelector = document.getElementById("template-select");
  var vtxName = temlateSelector.options[temlateSelector.selectedIndex].text;

  const defaultBand = getValue("default_band_select");
  const defaultChannel = getValue("default_channel_select");

  // Band control part
  const bandSelect = getValue("band-select");

  const bandState1 = getValue("band-state-1");
  const channelState1 = getValue("channel-state-1");
  const bandState1LevelFrom = getValue("band-state-1-level-from");
  const bandState1LevelTo = getValue("band-state-1-level-to");

  const bandState2 = getValue("band-state-2");
  const channelState2 = getValue("channel-state-2");
  const bandState2LevelFrom = getValue("band-state-2-level-from");
  const bandState2LevelTo = getValue("band-state-2-level-to");

  const bandState3 = getValue("band-state-3");
  const channelState3 = getValue("channel-state-3");
  const bandState3LevelFrom = getValue("band-state-3-level-from");
  const bandState3LevelTo = getValue("band-state-3-level-to");

  const bandState4 = getValue("band-state-4");
  const channelState4 = getValue("channel-state-4");
  const bandState4LevelFrom = getValue("band-state-4-level-from");
  const bandState4LevelTo = getValue("band-state-4-level-to");

  const bandState5 = getValue("band-state-5");
  const channelState5 = getValue("channel-state-5");
  const bandState5LevelFrom = getValue("band-state-5-level-from");
  const bandState5LevelTo = getValue("band-state-5-level-to");

  const bandState6 = getValue("band-state-6");
  const channelState6 = getValue("channel-state-6");
  const bandState6LevelFrom = getValue("band-state-6-level-from");
  const bandState6LevelTo = getValue("band-state-6-level-to");

  const bandCheckbox = document.getElementById("band-checkbox");
  const sixBandCheckbox = document.getElementById("6-band-checkbox");

  let results = ``;
  results += `# serial
serial ${portSelect} ${protocolSelect} 115200 57600 0 115200`;

  if (confirmationCheckbox.checked) {
    results += `

# vtxtable (${vtxName})
${vtxTable}`;
  }

  results += `
  
# Slava Ukraini! putin huilo!

# vtx
vtx 0 ${auxSelect} 0 0 ${powerState1} ${powerState1LevelFrom} ${powerState1LevelTo}
vtx 1 ${auxSelect} 0 0 ${powerState2} ${powerState2LevelFrom} ${powerState2LevelTo}
vtx 2 ${auxSelect} 0 0 ${powerState3} ${powerState3LevelFrom} ${powerState3LevelTo}`;

  if (bandCheckbox.checked) {
    results += `
vtx 3 ${bandSelect} ${bandState1} ${channelState1} 0 ${bandState1LevelFrom} ${bandState1LevelTo}
vtx 4 ${bandSelect} ${bandState2} ${channelState2} 0 ${bandState2LevelFrom} ${bandState2LevelTo}
vtx 5 ${bandSelect} ${bandState3} ${channelState3} 0 ${bandState3LevelFrom} ${bandState3LevelTo}`;
  }

  if (sixBandCheckbox.checked) {
    results += `
vtx 6 ${bandSelect} ${bandState4} ${channelState4} 0 ${bandState4LevelFrom} ${bandState4LevelTo}
vtx 7 ${bandSelect} ${bandState5} ${channelState5} 0 ${bandState5LevelFrom} ${bandState5LevelTo}
vtx 8 ${bandSelect} ${bandState6} ${channelState6} 0 ${bandState6LevelFrom} ${bandState6LevelTo}`;
  }
  results += `

# master
set vtx_band = ${defaultBand}
set vtx_channel = ${defaultChannel}
# Slava Ukraini! putin huilo!

save`;

  document.getElementById("result-output").textContent = results;
  document.getElementById("result").style.display = "block";
  document.getElementById("result").scrollIntoView({ behavior: "smooth" });
}

function copyToClipboard() {
  const resultOutput = document.getElementById("result-output");
  navigator.clipboard.writeText(resultOutput.textContent).then(() => {
    toast(getTranslation("copied_to_clipboard"));
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const vtxForm = document.getElementById("vtx-form");
  const bandForm = document.getElementById("band-form");

  const auxTemplate = document.getElementById("aux-template-select");
  const portProtocolTemplate = document.getElementById("port-protocol-select");
  const bandChannelSelect = document.getElementById("band_channel_select");

  vtxForm.addEventListener("input", hideResult);
  bandForm.addEventListener("input", hideResult);
  auxTemplate.addEventListener("input", hideResult);
  portProtocolTemplate.addEventListener("input", hideResult);
  bandChannelSelect.addEventListener("input", hideResult);

  const checkbox = document.getElementById("confirmation-checkbox");
  checkbox.checked = true;
  checkbox.addEventListener("input", function () {
    checkboxState = this.checked;
  });
});

function hideResult() {
  document.getElementById("result").style.display = "none";
}
document.addEventListener("DOMContentLoaded", function () {
  const templateSelect = document.getElementById("template-select");
  templateSelect.addEventListener("change", applyTemplate);
  applyTemplate();
});

const bandCheckbox = document.getElementById("band-checkbox");
const bandControl = document.getElementById("band-control");
const auxselector = document.getElementById("aux-select");
const bandSelector = document.getElementById("band-select");

const sixBandCheckbox = document.getElementById("6-band-checkbox");
const sixBandForm = document.getElementById("6_band_form");

bandCheckbox.addEventListener("change", function () {
  if (this.checked) {
    bandControl.style.display = "block";
  } else {
    bandControl.style.display = "none";
    sixBandCheckbox.checked = false;
  }
  updateBandOptions();
});

sixBandCheckbox.addEventListener("change", function () {
  if (this.checked) {
    sixBandForm.style.display = "flex";
    document.getElementById("band-state-1-level-from").value = "950";
    document.getElementById("band-state-1-level-to").value = "1050";
    document.getElementById("band-state-2-level-from").value = "1225";
    document.getElementById("band-state-2-level-to").value = "1325";
    document.getElementById("band-state-3-level-from").value = "1375";
    document.getElementById("band-state-3-level-to").value = "1475";
  } else {
    sixBandForm.style.display = "none";
    document.getElementById("band-state-1-level-from").value = "900";
    document.getElementById("band-state-1-level-to").value = "1100";
    document.getElementById("band-state-2-level-from").value = "1400";
    document.getElementById("band-state-2-level-to").value = "1600";
    document.getElementById("band-state-3-level-from").value = "1900";
    document.getElementById("band-state-3-level-to").value = "2100";
  }
});

function updateBandOptions() {
  const disableOptions = (select, otherValue) => {
    for (const option of select.options) {
      option.disabled =
        (option.value === "" && select.value !== "") ||
        (option.value === otherValue && bandCheckbox.checked);
    }
  };

  if (bandSelector.value == auxselector.value) {
    // reset bandSelector if it has the same value as aux selector to avoid
    // the selection of the same band
    bandSelector.value = "";
  }
  disableOptions(auxselector, bandSelector.value);
  disableOptions(bandSelector, auxselector.value);
}

let port;
let writer;
let reader;
let isConnected = false;

async function connectToFC() {
  try {
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 420000 });

    const encoder = new TextEncoderStream();
    const writableStreamClosed = encoder.readable.pipeTo(port.writable);
    writer = encoder.writable.getWriter();

    const decoder = new TextDecoderStream();
    const readableStreamClosed = port.readable.pipeTo(decoder.writable);
    reader = decoder.readable.getReader();

    isConnected = true;
    readFromPort();
    return true;
  } catch (error) {
    toast(getTranslation("connection_failed"), "error");
    return false;
  }
}

async function closeConnection() {
  try {
    if (reader) {
      await reader.cancel();
      reader = null;
    }
    if (writer) {
      await writer.close();
      writer = null;
    }
    if (port) {
      await port.close();
      port = null;
    }
    isConnected = false;
  } catch (error) {
    // Ignore errors during closing
  }
}

async function sendCommand(command) {
  return new Promise((resolve, reject) => {
    if (!writer) {
      reject(new Error("Not connected to FC"));
      return;
    }

    setTimeout(async () => {
      try {
        await writer.write(command + "\n");
        resolve();
      } catch (error) {
        reject(error);
      }
    }, 50);
  });
}

async function sendConfigCommands() {
  const button = document.getElementById("send-command-button");

  try {
    button.disabled = true;
    button.textContent = getTranslation("send_button_progress");

    if (!isConnected) {
      const connected = await connectToFC();
      if (!connected) return;
    }

    await sendCommand("#\n");
    await new Promise((resolve) => setTimeout(resolve, 50));

    const commands = document
      .getElementById("result-output")
      .textContent.split("\n")
      .filter((cmd) => cmd.trim() !== "");

    for (const cmd of commands) {
      await sendCommand(cmd);
      await new Promise((resolve) => setTimeout(resolve, 10));
      console.log(cmd);
    }

    await sendCommand("save");
    await new Promise((resolve) => setTimeout(resolve, 20));

    await closeConnection();
    toast(getTranslation("config_sent_successfully"));
  } catch (error) {
    console.error("Помилка при відправленні команд:", error);
    isConnected = false;
    await closeConnection();
    if (!error.message.includes("The device has been lost")) {
      toast(getTranslation("failed_to_send_commands"), "error");
    }
  } finally {
    button.disabled = false;
    button.textContent = getTranslation("send_button");
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await closeConnection();
    console.log("Connection closed after reconnecting");
  }
}
async function readFromPort() {
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
    }
  } catch (error) {
    isConnected = false;
  }
}

document
  .getElementById("send-command-button")
  .addEventListener("click", sendConfigCommands);

auxselector.addEventListener("change", updateBandOptions);
bandSelector.addEventListener("change", updateBandOptions);

updateBandOptions();

const generateButton = document.getElementById("generate-button");

function updateButtonState() {
  generateButton.disabled = bandSelector.value === "" && bandCheckbox.checked;
}

document.addEventListener("DOMContentLoaded", function () {
  const templateSelect = document.getElementById("template-select");

  templateSelect.addEventListener("change", function () {
    const selectedValue = templateSelect.value;
    const url = new URL(window.location);
    url.searchParams.set("tmpl", selectedValue);
    window.history.replaceState({}, "", url);
  });

  const templateValue = getQueryParam("tmpl");
  if (templateValue) {
    const observer = new MutationObserver(() => {
      if (templateSelect.options.length > 0) {
        templateSelect.value = templateValue;
        observer.disconnect();
      }
    });

    observer.observe(templateSelect, { childList: true });
  }

  applyTemplate();
});

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

bandSelector.addEventListener("change", updateButtonState);
bandCheckbox.addEventListener("change", updateButtonState);

updateButtonState();
