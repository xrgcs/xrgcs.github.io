const ch_result = document.getElementById("ch_result");
const startFrequencyInput = document.getElementById("startFrequencyInput");
const endFrequencyInput = document.getElementById("endFrequencyInput");
const channelCountSelect = document.getElementById("channelCountSelect");
const findClosestButton = document.getElementById("findClosestButton");
const resultsDiv = document.getElementById("results");

function findChannels(startFrequency, endFrequency) {
  const channels = Object.keys(channelsData).flatMap((range) => {
    return channelsData[range].map((c) => ({
      range: range,
      channel: c.channel,
      frequency: c.frequency,
    }));
  });

  const selectedChannelCount = parseInt(channelCountSelect.value);

  if (startFrequency && endFrequency) {
    const filteredChannels = channels.filter(
      (c) => c.frequency >= startFrequency && c.frequency <= endFrequency
    );

    filteredChannels.sort((a, b) => a.frequency - b.frequency);

    const requiredCount = Math.min(
      selectedChannelCount,
      filteredChannels.length
    );
    const step = Math.floor(filteredChannels.length / requiredCount);
    const distributedChannels = [];

    for (let i = 0; i < requiredCount; i++) {
      const index = Math.min(i * step, filteredChannels.length - 1);
      distributedChannels.push(filteredChannels[index]);
    }

    return distributedChannels;
  } else if (startFrequency) {
    return channels
      .sort(
        (a, b) =>
          Math.abs(a.frequency - startFrequency) -
          Math.abs(b.frequency - startFrequency)
      )
      .slice(0, selectedChannelCount);
  }
  return [];
}

function outdatedResults() {
  resultsDiv.classList.add("outdated");
}

[startFrequencyInput, endFrequencyInput, channelCountSelect].forEach(
  (input) => {
    input.addEventListener("input", (e) => {
      findClosestButton.disabled = startFrequencyInput.value.trim() === "";
      outdatedResults();
    });
  }
);

findClosestButton.addEventListener("click", () => {
  const startFrequency = parseInt(startFrequencyInput.value);
  const endFrequency = endFrequencyInput.value.trim()
    ? parseInt(endFrequencyInput.value)
    : null;
  const resultChannels = findChannels(startFrequency, endFrequency);

  resultsDiv.innerHTML = resultChannels
    .map(
      (c) =>
        `<span class="ch_result_item"><b>${c.range}-${c.channel}</b> (${
          c.frequency
        } ${getTranslation("mhz")})</span>`
    )
    .join("");
  ch_result.classList.remove("hidden");
  resultsDiv.classList.remove("outdated");
});
