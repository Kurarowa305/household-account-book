import { strings } from "../../constants/strings.js"
import { icon } from "../../utils/html.js"
import { renderInputCardHeading } from "./inputSection.js"

export function renderFoodForm(_viewModel, title = "") {
  return `
    <section class="panel" data-component-uid="CMP-0214">
      ${renderInputCardHeading(title)}
      <form data-entry-form="food" data-action-uid="ACT-0203">
        <div class="form-grid two">
          <label class="field">
            <span class="field-label">${strings.portKeys.foodItem}</span>
            <input name="label" type="text" placeholder="Rice" />
          </label>
          <label class="field">
            <span class="field-label">${strings.common.amount}</span>
            <input name="amount" type="number" min="0" inputmode="numeric" />
          </label>
        </div>
        <div class="form-actions">
          <button class="primary-button" type="submit" data-component-uid="CMP-0215" data-action-uid="ACT-0203">
            ${icon("plus")}
            <span>${strings.common.add}</span>
          </button>
        </div>
      </form>
    </section>
  `
}
