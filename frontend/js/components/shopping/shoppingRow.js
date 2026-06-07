import { strings } from "../../constants/strings.js"
import { amountText } from "../../utils/formatters.js"
import { escapeHtml, icon } from "../../utils/html.js"

export function renderShoppingRow(item) {
  return `
    <li class="shopping-row ${item.done ? "is-done" : ""}" data-component-uid="CMP-0413">
      <label>
        <input type="checkbox" data-shopping-done="${escapeHtml(item.id)}" data-component-uid="CMP-0414" data-action-uid="ACT-0405" ${item.done ? "checked" : ""} />
        <span>
          <strong>${escapeHtml(item.label)}</strong>
          <span class="muted-text">${escapeHtml(item.type)}${item.store ? ` / ${escapeHtml(item.store)} ${amountText(item.price)}` : ""}</span>
        </span>
      </label>
      <button class="icon-button" type="button" data-shopping-delete="${escapeHtml(item.id)}" aria-label="${strings.common.delete}" title="${strings.common.delete}" data-component-uid="CMP-0415" data-action-uid="ACT-0406">
        ${icon("trash-2")}
      </button>
    </li>
  `
}
