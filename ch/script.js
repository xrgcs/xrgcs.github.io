// Отримуємо елемент кнопки за ID
const calculateButton = document.getElementById("calculateChannelsButton")

// Додаємо обробник подій
calculateButton.addEventListener("click", calculateChannels)

let activeRanges = ["A", "B", "E", "F", "R"]
let selectedChannels = []

function populateRanges() {
  const includeXBand = document.getElementById("includeXBand").checked
  const includeLBand = document.getElementById("includeLBand").checked

  // Оновлюємо активні діапазони
  activeRanges = ["A", "B", "E", "F", "R"]
  if (includeXBand) activeRanges.push("X")
  if (includeLBand) activeRanges.push("L")

  const rangeSelect = document.getElementById("range")
  rangeSelect.innerHTML = ""

  activeRanges.forEach((range) => {
    const option = document.createElement("option")
    option.value = range
    option.textContent = range
    rangeSelect.appendChild(option)
  })

  populateChannels()
}

function populateChannels() {
  const rangeSelect = document.getElementById("range").value
  const channelSelect = document.getElementById("channel")
  const availableChannels = channelsData[rangeSelect]

  channelSelect.innerHTML = ""

  availableChannels.forEach((channelData) => {
    const option = document.createElement("option")
    option.value = channelData.channel
    option.textContent = channelData.channel
    channelSelect.appendChild(option)
  })
}

function addChannel() {
  if (userSelectedChannels.length >= 5) {
    toast(getTranslation("ch_max_toast"))
    return
  }

  const range = document.getElementById("range").value
  const channel = document.getElementById("channel").value
  const frequency = channelsData[range].find(
    (c) => c.channel == channel
  ).frequency

  const newChannel = { range, channel: parseInt(channel), frequency }

  if (
    !userSelectedChannels.some(
      (ch) => ch.range === range && ch.channel === parseInt(channel)
    )
  ) {
    userSelectedChannels.push(newChannel)
    updateSelectedChannelsDisplay()

    // Оновлюємо кількість пілотів тільки якщо поточна кількість менша за кількість каналів + 1
    const pilotsInput = document.getElementById("pilots")
    const currentPilots = parseInt(pilotsInput.value)
    if (currentPilots <= userSelectedChannels.length) {
      const newPilotsValue = Math.min(6, userSelectedChannels.length + 1)
      pilotsInput.value = newPilotsValue
    }
  } else {
    toast(getTranslation("ch_selected_toast"))
  }
  document.getElementById("selected-channels-title").classList.remove("hidden")
}

function onPilotsChange() {
  const pilotsInput = document.getElementById("pilots")
  let newPilotsValue = parseInt(pilotsInput.value)

  // Обмежуємо кількість пілотів від 1 до 6
  newPilotsValue = Math.max(1, Math.min(6, newPilotsValue))
  pilotsInput.value = newPilotsValue

  // Видаляємо зайві канали, якщо потрібно
  while (userSelectedChannels.length >= newPilotsValue) {
    userSelectedChannels.pop()
  }

  // Оновлюємо відображення каналів
  updateSelectedChannelsDisplay()
}

document.getElementById("pilots").addEventListener("change", onPilotsChange)

function updateSelectedChannelsDisplay() {
  const container = document.getElementById("selected-channels")
  container.innerHTML = ""

  userSelectedChannels.forEach((ch, index) => {
    const channelElement = document.createElement("span")
    channelElement.className = "selected-channel"
    channelElement.innerHTML = `
            <b>${ch.range}-${ch.channel}</b> (${ch.frequency} ${getTranslation(
      "mhz"
    )})
            <span class="remove-channel">&times;</span>
        `
    channelElement.onclick = function () {
      removeChannel(index)
    }
    container.appendChild(channelElement)
  })
}

function removeChannel(index) {
  userSelectedChannels.splice(index, 1)
  updateSelectedChannelsDisplay()

  // Оновлюємо кількість пілотів
  // const pilotsInput = document.getElementById("pilots")
  // const newPilotsValue = Math.max(1, userSelectedChannels.length + 1)
  // pilotsInput.value = newPilotsValue
}

let userSelectedChannels = [] // Канали, обрані користувачем
let calculatedChannels = [] // Канали, розраховані алгоритмом

function calculateChannels() {
  const pilots = parseInt(document.getElementById("pilots").value)

  // Якщо не вибрано жодного каналу, автоматично додаємо поточний вибраний канал
  if (userSelectedChannels.length === 0) {
    const range = document.getElementById("range").value
    const channel = document.getElementById("channel").value
    const frequency = channelsData[range].find(
      (c) => c.channel == channel
    ).frequency

    const newChannel = { range, channel: parseInt(channel), frequency }
    userSelectedChannels.push(newChannel)
    updateSelectedChannelsDisplay()
  }

  // Обмежуємо кількість пілотів до 5 або кількості вибраних каналів, якщо їх менше 5
  const maxPilots = Math.min(6, Math.max(userSelectedChannels.length, pilots))

  // Починаємо з каналів, обраних користувачем
  calculatedChannels = [...userSelectedChannels]

  // Створюємо єдиний список каналів ТІЛЬКИ з активних діапазонів
  let allChannels = []
  activeRanges.forEach((range) => {
    channelsData[range].forEach((c) => {
      allChannels.push({
        range: range,
        channel: c.channel,
        frequency: c.frequency,
      })
    })
  })

  // Видаляємо вже обрані користувачем канали зі списку доступних
  allChannels = allChannels.filter(
    (c) =>
      !userSelectedChannels.some(
        (sc) => sc.range === c.range && sc.channel === c.channel
      )
  )

  // Функція для розрахунку відстані між двома каналами
  function calculateDistance(a, b) {
    return Math.abs(a.frequency - b.frequency)
  }

  // Допоміжна функція для знаходження каналу, який збільшує мінімальну відстань між усіма обраними каналами
  function findBestNextChannel() {
    let bestChannel = null
    let maxMinDistance = -1

    allChannels.forEach((channel) => {
      const minDistance = Math.min(
        ...calculatedChannels.map((c) => calculateDistance(c, channel))
      )

      if (minDistance > maxMinDistance) {
        maxMinDistance = minDistance
        bestChannel = channel
      }
    })

    return bestChannel
  }

  // Вибираємо канал з максимальною мінімальною відстанню на кожному кроці
  while (calculatedChannels.length < maxPilots) {
    const nextChannel = findBestNextChannel()
    if (nextChannel) {
      calculatedChannels.push(nextChannel)
      allChannels = allChannels.filter((c) => c !== nextChannel)
    } else {
      break
    }
  }

  // Виводимо результат
  const resultsDiv = document.getElementById("results")
  resultsDiv.innerHTML = calculatedChannels
    .map(
      (c) =>
        `<span class="ch_result_item"><b>${c.range}-${c.channel}</b> (${
          c.frequency
        } ${getTranslation("mhz")})</span>`
    )
    .join("")
  document.getElementById("ch_result").style.display = "block"
  generateVisualization(calculatedChannels)
  document.getElementById("selected-channels-title").classList.remove("hidden")
}

// Додаємо обробники подій
document.getElementById("add-channel").addEventListener("click", addChannel)
document
  .getElementById("calculateChannelsButton")
  .addEventListener("click", calculateChannels)

// Викликаємо функцію для початкового заповнення діапазонів
populateRanges()

function generateVisualization(selectedChannels) {
  const resultsDiv = document.getElementById("visualization")
  resultsDiv.innerHTML = "" // Очищення

  // Визначаємо розміри контейнера
  const rect = resultsDiv.getBoundingClientRect()
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const radius = 130
  const totalChannels = 6 // Загальна кількість кіл
  const angleIncrement = (2 * Math.PI) / (totalChannels - 1)

  // Створення центрального кола
  const centralCircle = document.createElement("div")
  centralCircle.className = "circle central-circle"
  centralCircle.style.position = "absolute"
  centralCircle.style.left = `${centerX - 15}px`
  centralCircle.style.top = `${centerY - 15}px`
  if (selectedChannels.length > 0) {
    // centralCircle.classList.add('active-circle');
    centralCircle.textContent = `${selectedChannels[0].range}${selectedChannels[0].channel}`
  } else {
    centralCircle.classList.add("inactive-circle")
  }
  resultsDiv.appendChild(centralCircle)

  // Створення решти кіл
  for (let i = 1; i < totalChannels; i++) {
    const angle = angleIncrement * (i - 1)
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)

    const circle = document.createElement("div")
    circle.className = "circle"

    if (i < selectedChannels.length) {
      // Активні кола
      const channel = selectedChannels[i]
      // circle.classList.add('active-circle');
      circle.textContent = `${channel.range}${channel.channel}`
      // Малювання ліній для активних кіл
      drawLine(
        resultsDiv,
        centerX,
        centerY,
        x,
        y,
        true,
        selectedChannels[0].frequency,
        channel.frequency
      )

      // Лінія від попереднього кола до поточного (якщо є принаймні 3 кола)
      if (selectedChannels.length >= 3 && i > 1) {
        const prevAngle = angleIncrement * (i - 2)
        const prevX = centerX + radius * Math.cos(prevAngle)
        const prevY = centerY + radius * Math.sin(prevAngle)
        drawLine(
          resultsDiv,
          prevX,
          prevY,
          x,
          y,
          true,
          selectedChannels[i - 1].frequency,
          channel.frequency
        )
      }
    } else {
      // Неактивні кола
      circle.classList.add("inactive-circle")
      // Малювання ліній для неактивних кіл
      drawLine(resultsDiv, centerX, centerY, x, y, false)

      // Малювання неактивних ліній між неактивними колами
      if (i > 1) {
        const prevAngle = angleIncrement * (i - 2)
        const prevX = centerX + radius * Math.cos(prevAngle)
        const prevY = centerY + radius * Math.sin(prevAngle)
        drawLine(resultsDiv, prevX, prevY, x, y, false)
      }
    }

    circle.style.position = "absolute"
    circle.style.left = `${x - 15}px`
    circle.style.top = `${y - 15}px`
    resultsDiv.appendChild(circle)
  }

  // Після створення всіх кіл і ліній
  const lastAngle = angleIncrement * (totalChannels - 2)
  const secondAngle = angleIncrement * 0 // Другий канал завжди на 0 градусів

  const lastX = centerX + radius * Math.cos(lastAngle)
  const lastY = centerY + radius * Math.sin(lastAngle)
  const secondX = centerX + radius * Math.cos(secondAngle)
  const secondY = centerY + radius * Math.sin(secondAngle)

  if (selectedChannels.length >= 6) {
    // Якщо є достатньо вибраних каналів, малюємо активну лінію
    drawLine(
      resultsDiv,
      lastX,
      lastY,
      secondX,
      secondY,
      true,
      selectedChannels[selectedChannels.length - 1].frequency,
      selectedChannels[1].frequency
    )
  } else {
    // Інакше малюємо неактивну лінію
    drawLine(resultsDiv, lastX, lastY, secondX, secondY, false)
  }
}

function drawLine(container, x1, y1, x2, y2, isActive, freq1 = 0, freq2 = 0) {
  const dx = x2 - x1
  const dy = y2 - y1
  const distance = Math.sqrt(dx * dx + dy * dy)
  const angle = Math.atan2(dy, dx)

  const line = document.createElement("div")
  line.className = "line"
  if (isActive) {
    line.classList.add("active-line")
    const freqDifference = Math.abs(freq1 - freq2)
    const lineSpan = document.createElement("span")
    lineSpan.textContent = `${freqDifference} ${getTranslation("mhz")}`
    lineSpan.style.position = "absolute"
    lineSpan.style.left = "50%"
    lineSpan.style.top = "50%"
    lineSpan.style.transform = "translate(-50%, -50%) rotate(" + -angle + "rad)"
    line.appendChild(lineSpan)
  } else {
    line.classList.add("inactive-line")
  }

  line.style.left = `${x1}px`
  line.style.top = `${y1}px`
  line.style.width = `${distance}px`
  line.style.transform = `rotate(${angle}rad)`
  line.style.transformOrigin = "0 0"

  container.appendChild(line)
}

// Додаємо обробники подій для чекбоксів
document
  .getElementById("includeXBand")
  .addEventListener("change", populateRanges)
document
  .getElementById("includeLBand")
  .addEventListener("change", populateRanges)

// Початкова ініціалізація
populateRanges()
