import { strings } from "../../constants/strings.js"
import { icon } from "../../utils/html.js"
import { renderInputCardHeading } from "./inputSection.js"

export function renderVariableForm(_viewModel, title = "") {
  return `
    <section class="panel" data-component-uid="CMP-0224">
      ${renderInputCardHeading(title)}
      <form data-entry-form="variable" data-action-uid="ACT-0210">
        <div class="form-grid two">
          <label class="field"><span class="field-label">${strings.portKeys.electricity}</span><input name="electricity" type="number" min="0" inputmode="numeric" /></label>
          <label class="field"><span class="field-label">${strings.portKeys.variableGas}</span><input name="gas" type="number" min="0" inputmode="numeric" /></label>
          <label class="field"><span class="field-label">${strings.portKeys.variableWater}</span><input name="water" type="number" min="0" inputmode="numeric" /></label>
        </div>
        <div class="form-actions">
          <button class="primary-button" type="submit" data-component-uid="CMP-0225" data-action-uid="ACT-0210">
            ${icon("plus")}
            <span>${strings.common.add}</span>
          </button>
        </div>
      </form>
    </section>
  `
}
