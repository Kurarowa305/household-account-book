import { strings } from "../../constants/strings.js"
import { escapeHtml } from "../../utils/html.js"

export function renderEmptyState(message = strings.common.noData) {
  return `<div class="empty-state" data-component-uid="CMP-9001">${escapeHtml(message)}</div>`
}
