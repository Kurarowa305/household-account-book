export function renderScreenInspector(container, screen, uid) {
  if (!uid) {
    container.innerHTML = `<p class="empty-inspector">Select a screen root in the preview.</p>`
    return
  }
  if (!screen) {
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
      ${renderRow("uid", screen.uid)}
      ${renderRow("key", screen.key)}
      ${renderRow("title", screen.title)}
      ${renderRow("route", screen.route)}
      ${renderRow("source", screen.source)}
      ${renderRow("description", screen.description)}
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
