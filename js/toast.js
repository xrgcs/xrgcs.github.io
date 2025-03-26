function toast(message, type = "success") {
  const toast = document.createElement("div")
  toast.classList.add("toast")

  if (type === "error") {
    toast.classList.add("toast-error")
  }

  toast.textContent = message
  document.body.appendChild(toast)
  setTimeout(() => {
    toast.remove()
  }, 3000)
}
