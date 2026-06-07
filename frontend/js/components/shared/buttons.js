import { escapeHtml, icon } from "../../utils/html.js"

export function renderIconButton({ className = "icon-button", label, iconName, componentUid, actionUid = "", attributes = "" }) {
  return `
    <button class="${escapeHtml(className)}" type="button" data-component-uid="${escapeHtml(componentUid)}" ${actionUid ? `data-action-uid="${escapeHtml(actionUid)}"` : ""} aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}" ${attributes}>
      ${icon(iconName)}
    </button>
  `
}

export function renderActionButton({ className = "primary-button", label, iconName, componentUid, actionUid, type = "button", attributes = "" }) {
  return `
    <button class="${escapeHtml(className)}" type="${escapeHtml(type)}" data-component-uid="${escapeHtml(componentUid)}" data-action-uid="${escapeHtml(actionUid)}" ${attributes}>
      ${icon(iconName)}
      <span>${escapeHtml(label)}</span>
    </button>
  `
}
