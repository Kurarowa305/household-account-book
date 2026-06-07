import { strings } from "../../constants/strings.js"
import { escapeHtml, icon } from "../../utils/html.js"
import { renderDailyGoodsItemDialog } from "./dailyGoodsItemDialog.js"
import { renderInputCardHeading } from "./inputSection.js"

export function renderDailyGoodsForm(viewModel, title = "") {
  return `
    <div class="daily-input-shell">
      <section class="panel daily-input-card" data-component-uid="CMP-0216">
        ${renderInputCardHeading(title)}
        <form data-entry-form="daily" data-action-uid="ACT-0204">
          <div class="form-grid two">
            <label class="field">
              <span class="field-label">${strings.portKeys.item}</span>
              <select name="label">
                ${viewModel.dailyItems.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("")}
              </select>
            </label>
            <label class="field">
              <span class="field-label">${strings.common.amount}</span>
              <input name="amount" type="number" min="0" inputmode="numeric" />
            </label>
            <label class="field">
              <span class="field-label">${strings.common.store}</span>
              <input name="store" type="text" placeholder="Drug A" />
            </label>
          </div>
          <div class="form-actions">
            <button class="primary-button" type="submit" data-component-uid="CMP-0217" data-action-uid="ACT-0204">
              ${icon("plus")}
              <span>${strings.common.add}</span>
            </button>
          </div>
        </form>
      </section>
      <button class="icon-button daily-item-button" type="button" data-open-daily-item-dialog aria-label="${strings.portKeys.manageItems}" title="${strings.portKeys.manageItems}" data-component-uid="CMP-0219" data-action-uid="ACT-0205">
        ${icon("settings")}
      </button>
      ${renderDailyGoodsItemDialog(viewModel)}
    </div>
  `
}
