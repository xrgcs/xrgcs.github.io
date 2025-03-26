const FirmwareConfigurationBlockSize = {
  Product: 128,
  LuaName: 16,
  Defined: 512,
  HardwareLayout: 2048,
}

const elements = {}
;[
  "title-display",
  "info-display-wifi",
  "info-display",
  "layout-display",
  "device-type",
  "radio-type",
  "target-info",
  "target-path",
  "target-url",
].forEach((id) => {
  elements[id.replace(/-/g, "")] = document.getElementById(id)
})

const decoder = new TextDecoder()
const encoder = new TextEncoder()

const targetsJsonPath =
  "https://raw.githubusercontent.com/BUSHA/targets/refs/heads/mafia-targets/targets.json"
const layoutFolder =
  "https://raw.githubusercontent.com/BUSHA/targets/refs/heads/mafia-targets"

let targetsData = []

async function loadTargetsJson() {
  try {
    const response = await fetch(targetsJsonPath)
    if (!response.ok) {
      throw new Error(`Failed to load targets.json: ${response.statusText}`)
    }
    targetsData = await response.json()
    console.log("Targets JSON loaded:", targetsData)
  } catch (error) {
    toast("Error loading targets.json: " + error.message, "error")
    targetsData = null
  }
}

async function findMatchingTarget(
  firmware,
  deviceLayout,
  deviceType,
  productName
) {
  console.log("Starting findMatchingTarget with:", {
    firmware,
    deviceType,
    deviceLayout,
    productName,
  })

  function normalizeJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString)
      return JSON.stringify(parsed)
    } catch (error) {
      console.error("Error normalizing JSON:", error)
      return jsonString
    }
  }

  async function fetchLayout(layoutPath) {
    const encodedPath = layoutPath.split(" ").join("%20")
    const fullPath = `${layoutFolder}/${deviceType}/${encodedPath}`
    console.log("Trying to fetch layout from:", fullPath)

    try {
      const response = await fetch(fullPath)
      if (!response.ok)
        throw new Error(`Failed to load layout: ${response.statusText}`)
      const layoutText = await response.text()
      return layoutText.trim()
    } catch (error) {
      console.error(`Error loading layout ${fullPath}:`, error)
      return null
    }
  }

  function checkConfigObject(obj, path) {
    // Перевіряємо чи об'єкт має потрібні нам властивості
    if (
      obj &&
      obj.product_name?.toLowerCase() === productName.toLowerCase() &&
      obj.firmware?.toLowerCase() === firmware.toLowerCase()
    ) {
      return {
        path: path,
        layoutFile: obj.layout_file,
        productName: obj.product_name,
      }
    }
    return null
  }

  function findMatchingTargets(targetsData) {
    let results = []

    // Перебираємо виробників
    for (const manufacturer in targetsData) {
      const manufacturerData = targetsData[manufacturer]

      // Шукаємо категорії, які починаються з rx_ або tx_
      const deviceCategories = Object.keys(manufacturerData).filter((key) =>
        key.toLowerCase().startsWith(deviceType.toLowerCase())
      )

      for (const category of deviceCategories) {
        const categoryData = manufacturerData[category]

        // Перевіряємо різні можливі конфігурації
        for (const configType in categoryData) {
          const configData = categoryData[configType]

          // Якщо це об'єкт з конфігурацією
          if (configData && typeof configData === "object") {
            // Перевіряємо сам об'єкт
            const match = checkConfigObject(configData, [
              manufacturer,
              category,
              configType,
            ])
            if (match) {
              results.push(match)
              continue
            }

            // Перевіряємо вкладені об'єкти (для випадків як dual-core, nano тощо)
            for (const subKey in configData) {
              const subConfig = configData[subKey]
              if (subConfig && typeof subConfig === "object") {
                const subMatch = checkConfigObject(subConfig, [
                  manufacturer,
                  category,
                  configType,
                  subKey,
                ])
                if (subMatch) {
                  results.push(subMatch)
                }
              }
            }
          }
        }
      }
    }

    return results
  }

  try {
    const matchingTargets = findMatchingTargets(targetsData)
    console.log("Found matching targets:", matchingTargets)

    if (matchingTargets.length === 0) {
      console.log(
        `No targets found for product: ${productName} and firmware: ${firmware}`
      )
      return null
    }

    // Перевіряємо layout кожного знайденого таргету
    for (const target of matchingTargets) {
      console.log("Checking target:", target)
      const layoutContent = await fetchLayout(target.layoutFile)

      if (layoutContent) {
        const normalizedLayout = normalizeJSON(layoutContent)
        const normalizedDeviceLayout = normalizeJSON(deviceLayout)

        if (normalizedLayout === normalizedDeviceLayout) {
          return {
            path: target.path,
            productName: target.productName,
          }
        }
      }
    }

    console.log("No matching layout found")
    return null
  } catch (error) {
    console.error("Error in findMatchingTarget:", error)
    return null
  }
}

function formatTargetURL(matchingTarget) {
  if (!matchingTarget) return null

  // Отримуємо базові параметри з шляху
  const brand = matchingTarget.path[0] // radiomaster
  const freqType = matchingTarget.path[1].split("_")[1] // 900 з rx_900
  const deviceType = matchingTarget.path[1].split("_")[0].toUpperCase() // RX з rx_900

  // Форматуємо назву таргету (замінюємо пробіли на підкреслення)
  const targetName = matchingTarget.productName.split(" ").join("_")

  // Формуємо URL
  return `https://vtx.in.ua/elrs/?dt=${deviceType}&f=${freqType}&b=${brand}&t=${targetName}`
}

// Функція для обробки результатів пошуку
function formatTargetPath(matchingTarget) {
  if (!matchingTarget) return null
  return matchingTarget.path.join(", ") + ", " + matchingTarget.productName
}

function updateDisplay(element, value) {
  element.textContent = `${value}`
}

function readNullTerminatedString(dataView, start, maxLength) {
  let result = ""
  let offset = 0

  while (offset < maxLength) {
    const byte = dataView.getUint8(start + offset)
    if (byte === 0) break
    result += String.fromCharCode(byte)
    offset++
  }

  return result.trim()
}

async function readFileAsArrayBuffer(file) {
  const arrayBuffer = await file.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)

  if (uint8Array[0] === 0x1f && uint8Array[1] === 0x8b) {
    return new Uint8Array(pako.ungzip(uint8Array))
  }
  return uint8Array
}

function compareBytes(data, start, bytes) {
  return bytes.every((byte, index) => data[start + index] === byte)
}

function getESPMemoryTypes(memoryOffset, isEsp8285) {
  const MEMORY_MAP_ESP32 = [
    [0x3f400000, 0x3f800000, "DROM"],
    [0x3ffae000, 0x40000000, "DRAM"],
  ]

  const MEMORY_MAP_ESP8266 = [[0x3ffe8000, 0x40000000, "DRAM"]]

  const MAP = isEsp8285 ? MEMORY_MAP_ESP8266 : MEMORY_MAP_ESP32

  return MAP.filter(
    (mapRange) => mapRange[0] <= memoryOffset && memoryOffset < mapRange[1]
  ).map((mapRange) => mapRange[2])
}

function getAppSegments(dataView) {
  let baseAddress = 0x0
  let magic = dataView.getUint16(0)

  if (magic === 0xffff) {
    if (dataView.getUint8(0x10000) === 0xe9) {
      baseAddress = 0x10000
    } else {
      throw new Error("Не знайдено заголовок, ймовірно це не файл прошивки!")
    }
  } else if (magic === 0xe903) {
    if (dataView.getUint8(0x10000 - 0x1000) === 0xe9) {
      baseAddress = 0x10000 - 0x1000
    } else {
      throw new Error("Не знайдено заголовок, ймовірно це не файл прошивки!")
    }
  }

  let offset = baseAddress
  magic = dataView.getUint8(offset)
  let segmentsCount = dataView.getUint8(offset + 1)
  let is8285 = false

  if (segmentsCount === 2) {
    offset = baseAddress + 0x1000
    magic = dataView.getUint8(offset)
    offset += 1
    segmentsCount = dataView.getUint8(offset)
    offset += 7
    is8285 = true
  } else {
    offset = baseAddress + 24
  }

  const segments = []
  for (let i = 0; i < segmentsCount; i++) {
    const segmentAddress = offset
    const memoryOffset = dataView.getUint32(offset, true)
    offset += 4
    const segmentSize = dataView.getUint32(offset, true)
    offset += 4 + segmentSize

    segments.push({
      segmentNum: i,
      memoryOffset,
      segmentSize,
      segmentAddress,
      memoryTypes: getESPMemoryTypes(memoryOffset, is8285),
    })
  }

  offset = (offset + 16) & ~15
  if (!is8285) {
    offset += 32
  }

  return {
    is8285,
    segmentsCount,
    segments,
    firmwareEndAddress: offset,
  }
}

function getDeviceInfo(firmware) {
  const deviceType = firmware.includes("_TX") ? "TX" : "RX"
  const mcu = firmware.includes("ESP32")
    ? "ESP32"
    : firmware.includes("ESP8285")
    ? "ESP8285"
    : firmware.includes("STM32")
    ? "STM32"
    : "??"
  const lora = firmware.includes("2400")
    ? "SX1280"
    : firmware.includes("LR1121")
    ? "LR1121"
    : firmware.includes("900")
    ? "SX1276"
    : firmware.includes("868")
    ? "SX1276"
    : "??"

  return { deviceType, mcu, lora }
}

async function processFile(file) {
  const data = await readFileAsArrayBuffer(file)
  const dataView = new DataView(data.buffer)

  const appSegments = getAppSegments(dataView)

  const productPos = appSegments.firmwareEndAddress
  const product = readNullTerminatedString(
    dataView,
    productPos,
    FirmwareConfigurationBlockSize.Product
  )

  const luaNamePos = productPos + FirmwareConfigurationBlockSize.Product
  const luaName = readNullTerminatedString(
    dataView,
    luaNamePos,
    FirmwareConfigurationBlockSize.LuaName
  )

  const definesPos = luaNamePos + FirmwareConfigurationBlockSize.LuaName
  const defines = readNullTerminatedString(
    dataView,
    definesPos,
    FirmwareConfigurationBlockSize.Defined
  )
  let uid = "не знайдено"

  try {
    console.clear()
    console.log("Raw defines:", defines)

    const uidMatch = defines.match(/"uid":\s*\[(.*?)\]/)
    if (uidMatch) {
      try {
        const uidArray = JSON.parse(`[${uidMatch[1]}]`)
        uid = Array.isArray(uidArray)
          ? uidArray.join(", ")
          : uidArray.toString()
        console.log("[UID]:", uid)
      } catch (e) {
        console.log("Error parsing UID array:", e)
      }
    } else {
      const jsonDefines = JSON.parse(defines)
      if (jsonDefines.uid) {
        uid = Array.isArray(jsonDefines.uid)
          ? jsonDefines.uid.join(", ")
          : jsonDefines.uid.toString()
        console.log("Found UID through JSON parse:", uid)
      }
    }
  } catch (e) {
    console.log("Error parsing defines:", e)
    console.log("Defines content:", defines)
  }

  const credentials = findWiFiCredentials(data.buffer, appSegments.segments)
  if (credentials) {
    const { firmware } = credentials
    const deviceInfo = getDeviceInfo(firmware)

    elements.titledisplay.innerHTML = `${product}`
    elements.devicetype.innerHTML = `${deviceInfo.deviceType}`
    elements.radiotype.innerHTML = `${deviceInfo.mcu} + ${deviceInfo.lora}`

    elements.infodisplaywifi.innerHTML = `
    WiFi SSID: <strong>${credentials.ssid}</strong>, ${getTranslation(
      "inf_password"
    )}: <strong>${credentials.password}</strong>
  `

    elements.infodisplay.innerHTML = `
        ${getTranslation("version")}: <strong>${credentials.version} (${
      credentials.info
    })</strong><br>
        ${getTranslation("inf_lua_name")}: <strong>${luaName}</strong><br>
        ${getTranslation("inf_firmware")}: <strong>${firmware}</strong><br>
        UID: <strong>${uid}</strong>
      `
  }

  const layout = await findLayout(data)

  if (layout && layout.startsWith("{")) {
    elements.layoutdisplay.textContent = layout
    elements.layoutdisplay.style.display = "block"

    if (credentials && credentials.firmware) {
      const deviceType = credentials.firmware.includes("_TX") ? "TX" : "RX"
      const matchingTarget = await findMatchingTarget(
        credentials.firmware,
        layout,
        deviceType,
        product
      )

      if (matchingTarget) {
        console.log("Matching target path:", formatTargetPath(matchingTarget))

        const targetUrl = formatTargetURL(matchingTarget)
        elements.targeturl.dataset.url = targetUrl
        elements.targeturl.classList.remove("hidden")
      } else {
        elements.targeturl.classList.add("hidden")
      }
    } else {
      elements.targeturl.classList.add("hidden")
    }
  } else {
    elements.layoutdisplay.style.display = "none"
  }
}

function findWiFiCredentials(arrayBuffer, segments) {
  for (let segment of segments) {
    if (
      segment.memoryTypes.includes("DRAM") ||
      segment.memoryTypes.includes("DROM")
    ) {
      const segmentData = new Uint8Array(
        arrayBuffer.slice(
          segment.segmentAddress,
          segment.segmentAddress + segment.segmentSize
        )
      )

      const credentials = findWiFiCredentialsInSegment(segmentData)
      if (credentials) {
        return credentials
      }
    }
  }

  return null
}

function findWiFiCredentialsInSegment(segmentData) {
  const ipPattern = new TextEncoder().encode("10.0.0.1\0")

  for (let i = 0; i < segmentData.length - ipPattern.length; i++) {
    if (compareBytes(segmentData, i, ipPattern)) {
      let pos = i + ipPattern.length

      const password = extractNullTerminatedString(segmentData, pos)
      pos += password.length + 1

      const ssid = extractNullTerminatedString(segmentData, pos)
      pos += ssid.length + 1

      pos += extractNullTerminatedString(segmentData, pos).length + 1

      const version = extractNullTerminatedString(segmentData, pos)
      pos += version.length + 1

      const info = extractNullTerminatedString(segmentData, pos)
      pos += info.length + 6

      const firmware = extractNullTerminatedString(segmentData, pos)

      if (password && ssid) {
        return { password, ssid, version, info, firmware }
      }
    }
  }

  return null
}

function extractNullTerminatedString(data, start) {
  let end = start
  while (end < data.length && data[end] !== 0) end++
  return decoder.decode(data.slice(start, end))
}

async function findLayout(data) {
  const dataView = new DataView(data.buffer)
  const appSegments = getAppSegments(dataView)

  const productPos = appSegments.firmwareEndAddress
  const luaNamePos = productPos + FirmwareConfigurationBlockSize.Product
  const definesPos = luaNamePos + FirmwareConfigurationBlockSize.LuaName
  const hardwareLayoutPos = definesPos + FirmwareConfigurationBlockSize.Defined

  const layout = readNullTerminatedString(
    dataView,
    hardwareLayoutPos,
    FirmwareConfigurationBlockSize.HardwareLayout
  )

  if (layout && layout.startsWith("{")) {
    elements.layoutdisplay.textContent = layout
    elements.layoutdisplay.style.display = "block"
  } else {
    elements.layoutdisplay.style.display = "none"
  }
  return layout
}

function copyToClipboard() {
  const resultOutput = document.getElementById("layout-display")
  navigator.clipboard.writeText(resultOutput.textContent).then(() => {
    toast(getTranslation("copied_to_clipboard"))
  })
}

document.getElementById("sourcefile").addEventListener("change", (e) => {
  const file = e.target.files[0]
  document.getElementById("main_container").classList.remove("hidden")
  processFile(file)
})

document.getElementById("target-url").addEventListener("click", function () {
  const url = this.dataset.url
  if (url) {
    window.open(url, "_blank")
  }
})

document.addEventListener("DOMContentLoaded", function () {
  loadTargetsJson()
})
