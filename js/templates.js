let templates = {}

async function loadTemplates() {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${CONFIG.SP_ID}/gviz/tq?tqx=out:json&tq&gid=${CONFIG.SH_ID}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = await response.text()
    const jsonData = data.substring(47).slice(0, -2)
    const parsedData = JSON.parse(jsonData)

    templates = parseShData(parsedData)
  } catch (error) {
    console.error("Error loading templates:", error)
  }
}

function parseShData(data) {
  const parsedTemplates = {}
  const rows = data.table.rows

  console.log("Total rows:", rows.length)

  rows.forEach((row, index) => {
    const cells = row.c
    if (cells && cells.length >= 10) {
      const label = cells[0] && cells[0].v != null ? cells[0].v : null
      const name = cells[1] && cells[1].v != null ? cells[1].v : null

      if (label && name) {
        const template = {
          displayName: name,
          group: cells[2] && cells[2].v != null ? cells[2].v : "Other",
          protocol: cells[3] && cells[3].v != null ? cells[3].v : "",
          "power-states": [
            cells[4] && cells[4].v != null ? cells[4].v : "",
            cells[5] && cells[5].v != null ? cells[5].v : "",
            cells[6] && cells[6].v != null ? cells[6].v : "",
          ],
          port: cells[7] && cells[7].v != null ? cells[7].v.toString() : "",
          notice: cells[8] && cells[8].v != null ? cells[8].v.toString() : "",
          vtxTable: cells[9] && cells[9].v != null ? cells[9].v : "",
        }

        const missingFields = Object.entries(template)
          .filter(([key, value]) => {
            if (key === "power-states") {
              return value.some((state) => state === "")
            }
            return value === ""
          })
          .map(([key]) => key)

        if (missingFields.length === 0) {
          parsedTemplates[label] = template
        } else {
          console.warn(
            `Ignoring incomplete template data for label: ${label}. Missing fields: ${missingFields.join(
              ", "
            )}`
          )
        }
      } else {
        console.warn(`Ignoring row ${index + 1}: Missing label or name`)
      }
    } else {
      console.warn(`Ignoring row ${index + 1}: Insufficient number of cells`)
    }
  })

  console.log(`Total parsed templates: ${Object.keys(parsedTemplates).length}`)
  return parsedTemplates
}

async function applyTemplate() {
  const templateKey = document.getElementById("template-select").value
  const form = document.getElementById("vtx-form")
  const currentCheckboxState = document.getElementById("band-checkbox").checked
  const currentVtxCheckboxState = document.getElementById(
    "confirmation-checkbox"
  ).checked

  if (Object.keys(templates).length === 0) {
    await loadTemplates()
  }
  const template = templates[templateKey]
  form.reset()

  document.getElementById("confirmation-checkbox").checked =
    currentVtxCheckboxState

  document.getElementById("band-checkbox").checked = currentCheckboxState

  if (template) {
    document.getElementById("power-state-1").value = template["power-states"][0]
    document.getElementById("power-state-2").value = template["power-states"][1]
    document.getElementById("power-state-3").value = template["power-states"][2]
    document.getElementById("protocol-select").value = template.protocol
    document.getElementById("port-select").value = template.port
    document.getElementById("vtxTable").value = template.vtxTable
    // Показувати чи приховувати елемент "notice" залежно від значення template.notice
    const noticeElement = document.getElementById("notice")
    if (template.notice === "1") {
      noticeElement.style.display = "block"
      noticeElement.setAttribute("data-i18n", "vtx_notice")
      noticeElement.textContent = getTranslation("vtx_notice")
    } else if (template.notice === "2") {
      noticeElement.style.display = "block"
      noticeElement.setAttribute("data-i18n", "vtx_notice_2")
      noticeElement.textContent = getTranslation("vtx_notice_2")
    } else {
      noticeElement.style.display = "none"
    }
  }
}

async function populateTemplateSelect() {
  const select = document.getElementById("template-select")
  select.innerHTML = ""

  if (Object.keys(templates).length === 0) {
    await loadTemplates()
  }

  if (Object.keys(templates).length === 0) {
    console.error("Templates are still empty after loading.")
    return
  }

  const groups = {}

  Object.keys(templates).forEach((key) => {
    const template = templates[key]
    const groupName = template.group || "Other"

    if (!groups[groupName]) {
      groups[groupName] = []
    }

    groups[groupName].push({ key, displayName: template.displayName })
  })

  const otherGroup = groups["Other"]
  delete groups["Other"]

  Object.keys(groups).forEach((groupName) => {
    const optgroup = document.createElement("optgroup")
    optgroup.label = groupName
    groups[groupName].forEach((template) => {
      const option = document.createElement("option")
      option.value = template.key
      option.textContent = template.displayName
      optgroup.appendChild(option)
    })
    select.appendChild(optgroup)
  })

  if (otherGroup) {
    const optgroup = document.createElement("optgroup")
    optgroup.label = "Other"
    otherGroup.forEach((template) => {
      const option = document.createElement("option")
      option.value = template.key
      option.textContent = template.displayName
      optgroup.appendChild(option)
    })
    select.appendChild(optgroup)
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await populateTemplateSelect()
  applyTemplate()
})
