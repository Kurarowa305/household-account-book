export function renderComponentInspector(container, component, uid) {
  if (!uid) {
    container.innerHTML = `<p class="empty-inspector">Select a component in the preview.</p>`
    return
  }
  if (!component) {
    container.innerHTML = `
      <div class="meta-grid">
        ${renderRow("uid", uid)}
        ${renderRow("status", "Not registered")}
      </div>
    `
    return
  }
  container.innerHTML = `
    <div class="meta-grid">
      ${renderRow("uid", component.uid)}
      ${renderRow("key", component.key)}
      ${renderRow("screenUid", component.screenUid)}
      ${renderRow("source", component.source)}
      ${renderRow("description", component.description)}
    </div>
  `
}

function renderRow(label, value) {
  return `
    <div class="meta-row">
      <span class="meta-label">${label}</span>
      <span class="meta-value">${escapeHtml(value)}</span>
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
