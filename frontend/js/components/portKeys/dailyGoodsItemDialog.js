import { strings } from "../../constants/strings.js"
import { escapeHtml, icon } from "../../utils/html.js"

export function renderDailyGoodsItemDialog(viewModel) {
  return `
    <dialog class="item-dialog" data-daily-item-dialog data-component-uid="CMP-0218">
      <form class="dialog-card" data-daily-item-form data-action-uid="ACT-0206">
        <header>
          <h3>${strings.portKeys.dailyGoodsItems}</h3>
          <button class="icon-button" type="button" data-close-dialog aria-label="${strings.common.close}" title="${strings.common.close}" data-component-uid="CMP-0218">
            ${icon("x")}
          </button>
        </header>
        <label class="field">
          <span class="field-label">${strings.portKeys.item}</span>
          <input name="newDailyItem" type="text" placeholder="Kitchen Paper" />
        </label>
        <section class="dialog-section" aria-label="Registered items">
          <h4>Registered Items</h4>
          ${renderDailyItemManagementList(viewModel)}
        </section>
        <div class="form-actions">
          <button class="primary-button" type="submit" data-component-uid="CMP-0218" data-action-uid="ACT-0206">
            ${icon("plus")}
            <span>${strings.common.add}</span>
          </button>
        </div>
      </form>
    </dialog>
  `
}

function renderDailyItemManagementList(viewModel) {
  if (!viewModel.dailyItems.length) return `<div class="dialog-empty-state" data-daily-item-list>No items</div>`
  return `
    <div class="dialog-item-list-wrap" data-daily-item-list>
      <ul class="dialog-item-list">
        ${viewModel.dailyItems
          .map(
            (item) => `
              <li>
                <span>${escapeHtml(item)}</span>
                <button class="icon-button" type="button" data-delete-daily-item="${escapeHtml(item)}" aria-label="Delete ${escapeHtml(item)}" title="Delete" data-component-uid="CMP-0218" data-action-uid="ACT-0207">
                  ${icon("trash-2")}
                </button>
              </li>
            `,
          )
          .join("")}
      </ul>
    </div>
  `
}
