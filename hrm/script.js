const resultsDiv = document.getElementById("resultsDiv")
const hrm_result = document.getElementById("hrm_result")

const rangeStyles = {
  X: "bg-x",
  "1.3G": "bg-1-3",
  "3.3G-A": "bg-3-3",
  "3.3G-B": "bg-3-3",
  "3.3G-C": "bg-3-3",
  "3.3G-D": "bg-3-3",
  // додайте інші діапазони та їхні відповідні класи, якщо необхідно
}

document
  .getElementById("controlFrequency")
  .addEventListener("input", updateRangeFromCentral)
document
  .getElementById("channelWidth")
  .addEventListener("input", updateRangeFromCentral)

document
  .getElementById("startFrequency")
  .addEventListener("input", updateCentralFromRange)
document
  .getElementById("endFrequency")
  .addEventListener("input", updateCentralFromRange)

function updateRangeFromCentral() {
  const centralFrequency = parseFloat(
    document.getElementById("controlFrequency").value
  )
  const width = parseFloat(document.getElementById("channelWidth").value)
  const halfWidth = width / 2

  const startFrequency = centralFrequency - halfWidth
  const endFrequency = centralFrequency + halfWidth

  document.getElementById("startFrequency").value = startFrequency.toFixed(2)
  document.getElementById("endFrequency").value = endFrequency.toFixed(2)
  outdatedResults()
}

function updateCentralFromRange() {
  const startFrequency = parseFloat(
    document.getElementById("startFrequency").value
  )
  const endFrequency = parseFloat(document.getElementById("endFrequency").value)

  const centralFrequency = (startFrequency + endFrequency) / 2
  const width = endFrequency - startFrequency

  document.getElementById("controlFrequency").value =
    centralFrequency.toFixed(2)
  document.getElementById("channelWidth").value = width.toFixed(2)
  outdatedResults()
}

function showTab(tabId) {
  // Сховати всі вкладки
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active")
  })

  // Показати потрібну вкладку
  document.getElementById(tabId).classList.add("active")

  // Підсвітити потрібну кнопку вкладки
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.remove("active")
  })
  document.getElementById(`${tabId}-tab`).classList.add("active")
}

function calculate() {
  const controlFrequency = parseFloat(
    document.getElementById("controlFrequency").value
  )
  const channelWidth = parseFloat(document.getElementById("channelWidth").value)
  const halfWidth = channelWidth / 2

  const harmonics = []
  for (let i = 2; i <= Math.ceil(7000 / controlFrequency); i++) {
    harmonics.push({
      harmonic: i,
      min: i * (controlFrequency - halfWidth),
      max: i * (controlFrequency + halfWidth),
    })
  }

  const affectedChannels = {}
  const unaffectedChannels = {}

  for (const [range, channels] of Object.entries(channelsData)) {
    channels.forEach((ch) => {
      let videoBandWidth = 30

      if (range === "1.3G" || range === "3.3G-A" || range === "3.3G-B") {
        videoBandWidth = 20
      }

      const videoMinFreq = ch.frequency - videoBandWidth / 2
      const videoMaxFreq = ch.frequency + videoBandWidth / 2

      let isAffected = false
      harmonics.forEach((h) => {
        if (videoMinFreq <= h.max && h.min <= videoMaxFreq && h.max <= 7000) {
          isAffected = true
          if (!affectedChannels[h.harmonic]) {
            affectedChannels[h.harmonic] = []
          }
          affectedChannels[h.harmonic].push({
            range,
            channel: ch.channel,
            frequency: ch.frequency,
          })
        }
      })

      if (!isAffected) {
        if (!unaffectedChannels[range]) {
          unaffectedChannels[range] = []
        }
        unaffectedChannels[range].push({
          channel: ch.channel,
          frequency: ch.frequency,
        })
      }
    })
  }

  resultsDiv.innerHTML = ""

  const tabsDiv = document.createElement("div")
  tabsDiv.classList.add("tabs")

  const affectedTab = document.createElement("div")
  affectedTab.classList.add("tab-button", "active")
  affectedTab.id = "affected-tab"
  affectedTab.textContent = getTranslation("hrm_tab_affected")
  affectedTab.addEventListener("click", () => showTab("affected"))

  const unaffectedTab = document.createElement("div")
  unaffectedTab.classList.add("tab-button")
  unaffectedTab.id = "unaffected-tab"
  unaffectedTab.textContent = getTranslation("hrm_tab_unaffected")
  unaffectedTab.addEventListener("click", () => showTab("unaffected"))

  tabsDiv.appendChild(affectedTab)
  tabsDiv.appendChild(unaffectedTab)
  resultsDiv.appendChild(tabsDiv)

  const affectedDiv = document.createElement("div")
  affectedDiv.classList.add("tab-content", "active")
  affectedDiv.id = "affected"

  const unaffectedDiv = document.createElement("div")
  unaffectedDiv.classList.add("tab-content")
  unaffectedDiv.id = "unaffected"

  if (Object.keys(affectedChannels).length === 0) {
    affectedDiv.innerHTML = `<p>${getTranslation("hrm_no_result")}</p>`
  } else {
    for (const [harmonic, channels] of Object.entries(affectedChannels)) {
      const containerDiv = document.createElement("div")
      containerDiv.classList.add("harmonic-container")

      const harmonicTitleDiv = document.createElement("div")
      harmonicTitleDiv.classList.add("harmonic-title")

      const harmonicTitle = document.createElement("h3")
      const harmonicMinFreq = (
        harmonic *
        (controlFrequency - halfWidth)
      ).toFixed(2)
      const harmonicMaxFreq = (
        harmonic *
        (controlFrequency + halfWidth)
      ).toFixed(2)
      harmonicTitle.innerText = `${getTranslation(
        "hrm_harmonic"
      )} #${harmonic} (${harmonicMinFreq} - ${harmonicMaxFreq} MHz)`
      harmonicTitleDiv.appendChild(harmonicTitle)
      containerDiv.appendChild(harmonicTitleDiv)

      const harmonicSection = document.createElement("div")
      harmonicSection.classList.add("harmonic-section")

      channels.forEach((c) => {
        const channelElem = document.createElement("div")
        channelElem.classList.add("hrm_result_item")

        if (rangeStyles[c.range]) {
          channelElem.classList.add(rangeStyles[c.range])
        }

        channelElem.innerHTML = `
          <b>${c.range}-${c.channel}</b> (${c.frequency} MHz)
        `
        harmonicSection.appendChild(channelElem)
      })

      containerDiv.appendChild(harmonicSection)
      affectedDiv.appendChild(containerDiv)
    }
  }

  if (Object.keys(unaffectedChannels).length === 0) {
    unaffectedDiv.innerHTML =
      "All channels are affected by the calculated harmonics."
  } else {
    for (const [range, channels] of Object.entries(unaffectedChannels)) {
      const containerDiv = document.createElement("div")
      containerDiv.classList.add("harmonic-container")

      const harmonicTitleDiv = document.createElement("div")
      harmonicTitleDiv.classList.add("harmonic-title")

      const harmonicTitle = document.createElement("h3")
      harmonicTitle.innerText = `${getTranslation("ch_band")} ${range}`
      harmonicTitleDiv.appendChild(harmonicTitle)
      containerDiv.appendChild(harmonicTitleDiv)

      const harmonicSection = document.createElement("div")
      harmonicSection.classList.add("harmonic-section")

      channels.forEach((c) => {
        const channelElem = document.createElement("div")
        channelElem.classList.add("hrm_result_item")

        if (rangeStyles[range]) {
          channelElem.classList.add(rangeStyles[range])
        }

        channelElem.innerHTML = `
          <b>${range}-${c.channel}</b> (${c.frequency} MHz)
        `
        harmonicSection.appendChild(channelElem)
      })

      containerDiv.appendChild(harmonicSection)
      unaffectedDiv.appendChild(containerDiv)
    }
  }
  resultsDiv.appendChild(affectedDiv)
  resultsDiv.appendChild(unaffectedDiv)

  hrm_result.classList.remove("hidden")
  resultsDiv.classList.remove("outdated")
}

function outdatedResults() {
  resultsDiv.classList.add("outdated")
}
