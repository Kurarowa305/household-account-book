const styleFields = [
  "width",
  "height",
  "padding",
  "margin",
  "color",
  "background-color",
  "font-size",
  "font-weight",
  "border-radius",
  "display",
  "gap",
]

export function renderStyleInspector(container, element) {
  if (!element) {
    container.innerHTML = `<p class="empty-inspector">Select an element to inspect computed styles.</p>`
    return
  }
  const styles = getComputedStyle(element)
  container.innerHTML = `
    <div class="style-grid">
      ${styleFields.map((field) => renderRow(field, styles.getPropertyValue(field))).join("")}
    </div>
  `
}

function renderRow(label, value) {
  return `
    <div class="style-row">
      <span class="meta-label">${label}</span>
      <span class="style-value">${escapeHtml(value)}</span>
    </div>
  `
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}
