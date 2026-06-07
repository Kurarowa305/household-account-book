import { strings } from "../../constants/strings.js"
import { icon } from "../../utils/html.js"
import { renderEmptyState } from "../shared/emptyState.js"
import { renderShoppingRow } from "./shoppingRow.js"

export function renderShoppingListPanel(viewModel) {
  return `
    <section class="shopping-card" data-component-uid="CMP-0410">
      <header>
        <h2>${strings.shopping.shoppingList}</h2>
        <div class="inline-actions">
          <label class="summary-line" data-component-uid="CMP-0411">
            <span>${strings.shopping.scheduledSend}</span>
            <input type="checkbox" id="lineSchedule" data-action-uid="ACT-0403" ${viewModel.lineSchedule ? "checked" : ""} />
          </label>
          <button class="secondary-button" type="button" data-action="send-line" data-component-uid="CMP-0412" data-action-uid="ACT-0404">
            ${icon("send")}
            <span>${strings.shopping.sendToLine}</span>
          </button>
        </div>
      </header>
      ${renderShoppingList(viewModel)}
    </section>
  `
}

function renderShoppingList(viewModel) {
  if (!viewModel.shoppingList.length) return renderEmptyState("No shopping items")
  return `
    <ul class="shopping-list">
      ${viewModel.shoppingList.map(renderShoppingRow).join("")}
    </ul>
  `
}
