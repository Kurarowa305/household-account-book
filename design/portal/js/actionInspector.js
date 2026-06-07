export function renderActionInspector(container, action, uid) {
  if (!uid) {
    container.innerHTML = `<p class="empty-inspector">Select an actionable element.</p>`
    return
  }
  if (!action) {
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
      ${renderRow("uid", action.uid)}
      ${renderRow("key", action.key)}
      ${renderRow("label", action.label)}
      ${renderRow("description", action.description)}
      ${renderRow("triggerComponentUid", action.triggerComponentUid)}
      ${renderRow("screenUid", action.screenUid)}
      ${renderRow("status", action.status)}
      ${renderRow("note", action.note)}
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
