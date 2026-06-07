import { escapeHtml } from "../../utils/html.js"

export function renderMetricCard({ label, value, componentUid = "CMP-9002", className = "mini-card" }) {
  return `
    <article class="${escapeHtml(className)}" data-component-uid="${escapeHtml(componentUid)}">
      <p class="metric-meta">${escapeHtml(label)}</p>
      <strong>${escapeHtml(value)}</strong>
    </article>
  `
}
