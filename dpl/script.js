// Constants
const SPEED_OF_LIGHT = 299792458 // m/s
const k = 0.9515 // Basic coefficient

// Get DOM elements
const frequencyInput = document.getElementById("dplFrequency")
const antLengthInput = document.getElementById("antLength")
const legLengthInput = document.getElementById("legLength")

// Add event listeners
frequencyInput.addEventListener("input", calculateFromFrequency)
antLengthInput.addEventListener("input", calculateFromLength)
legLengthInput.addEventListener("input", calculateFromLegLength)

function calculateFromFrequency() {
  const frequency = parseFloat(frequencyInput.value)

  if (isNaN(frequency)) return

  const wavelength = SPEED_OF_LIGHT / (frequency * 1e6)
  const fullLength = calculateDipoleLength(wavelength)

  antLengthInput.value = (fullLength * 100).toFixed(2) // Convert to cm
  legLengthInput.value = (fullLength * 50).toFixed(2) // Half length in cm
}

function calculateFromLength() {
  const length = parseFloat(antLengthInput.value) / 100 // Convert from cm to m

  if (isNaN(length)) return

  const frequency = calculateFrequency(length)

  frequencyInput.value = frequency.toFixed(2)
  legLengthInput.value = (length * 50).toFixed(2) // Half length in cm
}

function calculateFromLegLength() {
  const legLength = parseFloat(legLengthInput.value) / 100 // Convert from cm to m

  if (isNaN(legLength)) return

  const fullLength = legLength * 2
  const frequency = calculateFrequency(fullLength)

  frequencyInput.value = frequency.toFixed(2)
  antLengthInput.value = (fullLength * 100).toFixed(2) // Full length in cm
}

function calculateDipoleLength(wavelength) {
  return (wavelength * k) / 2
}

function calculateFrequency(length) {
  const wavelength = (length * 2) / k
  return SPEED_OF_LIGHT / wavelength / 1e6 // Convert to MHz
}

function recalculate() {
  if (frequencyInput.value) {
    calculateFromFrequency()
  } else if (antLengthInput.value) {
    calculateFromLength()
  } else if (legLengthInput.value) {
    calculateFromLegLength()
  }
}

// Initial calculation
calculateFromFrequency()
