document.addEventListener("DOMContentLoaded", function () {
  const toolGroups = document.querySelectorAll(".tool-group-header")

  toolGroups.forEach((header) => {
    header.addEventListener("click", toggleGroup)
    header.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        toggleGroup.call(header)
      }
    })
  })
})

function toggleGroup() {
  const content = this.nextElementSibling
  const toggle = this.querySelector(".group-toggle")
  content.classList.toggle("expanded")
  toggle.classList.toggle("expanded")
}
