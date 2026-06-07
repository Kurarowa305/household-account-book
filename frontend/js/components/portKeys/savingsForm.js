import { strings } from "../../constants/strings.js"
import { icon } from "../../utils/html.js"
import { renderInputCardHeading } from "./inputSection.js"

export function renderSavingsForm(_viewModel, title = "") {
  return `
    <section class="panel" data-component-uid="CMP-0212">
      ${renderInputCardHeading(title)}
      <form data-entry-form="savings" data-action-uid="ACT-0202">
        <div class="form-grid two">
          <label class="field">
            <span class="field-label">${strings.portKeys.type}</span>
            <select name="direction">
              <option value="deposit">${strings.portKeys.bankDeposit}</option>
              <option value="withdrawal">${strings.portKeys.bankWithdrawal}</option>
            </select>
          </label>
          <label class="field">
            <span class="field-label">${strings.common.amount}</span>
            <input name="amount" type="number" min="0" inputmode="numeric" />
          </label>
        </div>
        <div class="form-actions">
          <button class="primary-button" type="submit" data-component-uid="CMP-0213" data-action-uid="ACT-0202">
            ${icon("plus")}
            <span>${strings.common.add}</span>
          </button>
        </div>
      </form>
    </section>
  `
}
