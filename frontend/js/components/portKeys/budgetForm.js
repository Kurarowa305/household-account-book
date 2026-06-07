import { strings } from "../../constants/strings.js"
import { escapeHtml, icon } from "../../utils/html.js"
import { renderInputCardHeading } from "./inputSection.js"

export function renderBudgetForm(viewModel, title = "") {
  return `
    <section class="panel" data-component-uid="CMP-0210">
      ${renderInputCardHeading(title)}
      <form data-entry-form="budget" data-action-uid="ACT-0201">
        <div class="form-grid two">
          <label class="field">
            <span class="field-label">${strings.common.amount}</span>
            <input name="amount" type="number" min="0" step="1000" inputmode="numeric" value="${escapeHtml(viewModel.budgetAmount)}" />
          </label>
          <label class="field full">
            <span class="field-label">${strings.portKeys.goalComment}</span>
            <textarea name="comment" rows="3" placeholder="${escapeHtml(strings.portKeys.monthlySpendingGoal)}">${escapeHtml(viewModel.goalComment)}</textarea>
          </label>
        </div>
        <div class="form-actions">
          <button class="primary-button" type="submit" data-component-uid="CMP-0211" data-action-uid="ACT-0201">
            ${icon("save")}
            <span>${strings.portKeys.saveBudget}</span>
          </button>
        </div>
      </form>
    </section>
  `
}
