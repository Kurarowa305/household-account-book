import { strings } from "../../constants/strings.js"
import { escapeHtml } from "../../utils/html.js"
import { renderBudgetForm } from "./budgetForm.js"
import { renderDailyGoodsForm } from "./dailyGoodsForm.js"
import { renderFixedForm } from "./fixedForm.js"
import { renderFoodForm } from "./foodForm.js"
import { renderSavingsForm } from "./savingsForm.js"
import { renderSpecialForm } from "./specialForm.js"
import { renderVariableForm } from "./variableForm.js"

export function renderInputSection(viewModel) {
  const selected = viewModel.selectedCategory
  const dateField = ["budget", "fixed"].includes(selected)
    ? ""
    : `
      <div class="form-grid two" data-component-uid="CMP-0203">
        <label class="field">
          <span class="field-label">${strings.common.date}</span>
          <input id="batchDate" type="date" value="${escapeHtml(viewModel.selectedDate)}" data-action-uid="ACT-0200" />
        </label>
      </div>
    `
  return `
    <h2 class="section-heading">${strings.portKeys.input}</h2>
    <section class="input-section" data-component-uid="CMP-0204">
      ${dateField}
      <div class="input-grid">
        ${renderFormsForSelection(viewModel)}
      </div>
    </section>
  `
}

function renderFormsForSelection(viewModel) {
  const forms = {
    budget: (title = "") => renderBudgetForm(viewModel, title),
    savings: (title = "") => renderSavingsForm(viewModel, title),
    food: (title = "") => renderFoodForm(viewModel, title),
    daily: (title = "") => renderDailyGoodsForm(viewModel, title),
    special: (title = "") => renderSpecialForm(viewModel, title),
    fixed: (title = "") => renderFixedForm(viewModel, title),
    variable: (title = "") => renderVariableForm(viewModel, title),
  }
  const selected = viewModel.selectedCategory
  if (selected && selected !== "all" && forms[selected]) return forms[selected]()
  return viewModel.categories.map((category) => forms[category.key](category.label)).join("")
}

export function renderInputCardHeading(title) {
  return title ? `<h3 class="input-card-heading">${escapeHtml(title)}</h3>` : ""
}
