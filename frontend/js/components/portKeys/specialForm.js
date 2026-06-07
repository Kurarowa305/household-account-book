import { strings } from "../../constants/strings.js"
import { icon } from "../../utils/html.js"
import { renderInputCardHeading } from "./inputSection.js"

export function renderSpecialForm(_viewModel, title = "") {
  return `
    <section class="panel" data-component-uid="CMP-0220">
      ${renderInputCardHeading(title)}
      <form data-entry-form="special" data-action-uid="ACT-0208">
        <div class="form-grid two">
          <label class="field">
            <span class="field-label">${strings.portKeys.event}</span>
            <input name="label" type="text" placeholder="Birthday" />
          </label>
          <label class="field">
            <span class="field-label">${strings.common.amount}</span>
            <input name="amount" type="number" min="0" inputmode="numeric" />
          </label>
        </div>
        <div class="form-actions">
          <button class="primary-button" type="submit" data-component-uid="CMP-0221" data-action-uid="ACT-0208">
            ${icon("plus")}
            <span>${strings.common.add}</span>
          </button>
        </div>
      </form>
    </section>
  `
}
