;(function () {
  if (!localStorage.getItem("putinHuilo")) {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "../styles/overlay.css"
    document.head.appendChild(link)

    const overlay = document.createElement("div")
    overlay.id = "overlay"

    const messageBox = document.createElement("div")
    messageBox.id = "message-box"

    const title = document.createElement("h1")
    title.textContent = "Маленькая формальность"

    const message = document.createElement("p")
    message.textContent =
      "Чтобы продолжить пользоваться сайтом, вам требуется подтвердить, что вы поддерживаете Силы Обороны Украины и считаете владимира путина долбоебом. В кэш вашего браузера будет записана информация, наличие которой на компьютере считается уголовным преступлением в россии и карается заключением в тюрьму."

    const checkboxContainer = document.createElement("div")
    checkboxContainer.classList.add("checkbox-container")

    const confirmCheckbox = document.createElement("input")
    confirmCheckbox.type = "checkbox"
    confirmCheckbox.id = "confirm-read"

    const checkboxText = document.createElement("span")
    checkboxText.textContent =
      "Я официально подтверждаю, что поддерживаю Силы Обороны Украины, и что я считаю владимира путина долбоебом"

    const button = document.createElement("button")
    button.textContent = "Принять и продолжить"
    button.disabled = true

    confirmCheckbox.addEventListener("change", () => {
      button.disabled = !confirmCheckbox.checked
      button.classList.toggle("active", confirmCheckbox.checked)
    })

    button.addEventListener("click", () => {
      if (confirmCheckbox.checked) {
        localStorage.setItem(
          "putinHuilo",
          "Я согласен помогать СБУ, ГУР и другим спецслужбам Украины и выполнять их указания на территории россии. Риск для жизни и здоровья принимаю. Я официально подтверждаю, что поддерживаю Силы Обороны Украины, и что я считаю владимира путина долбоебом. россия должна быть разделена на независимые страны."
        )
      }
      overlay.style.display = "none"
    })

    checkboxContainer.appendChild(confirmCheckbox)
    checkboxContainer.appendChild(checkboxText)

    messageBox.appendChild(title)
    messageBox.appendChild(message)
    messageBox.appendChild(checkboxContainer)
    messageBox.appendChild(button)

    overlay.appendChild(messageBox)
    document.body.appendChild(overlay)
  }
})()
