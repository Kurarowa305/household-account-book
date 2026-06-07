import { strings } from "../../constants/strings.js"
import { escapeHtml, icon } from "../../utils/html.js"
import { renderInputCardHeading } from "./inputSection.js"

export function renderFixedForm(viewModel, title = "") {
  return `
    <section class="panel" data-component-uid="CMP-0222">
      ${renderInputCardHeading(title)}
      <form data-entry-form="fixed" data-action-uid="ACT-0209">
        <h3 class="input-subheading">${strings.portKeys.fixedRent}</h3>
        <div class="form-grid two">
          <label class="field"><span class="field-label">${strings.common.amount}</span><input name="rentAmount" type="number" min="0" inputmode="numeric" value="${escapeHtml(viewModel.fixedSettings.rent.amount || "")}" /></label>
        </div>
        <h3 class="input-subheading">${strings.portKeys.fixedInternet}</h3>
        <div class="form-grid two">
          <label class="field"><span class="field-label">${strings.common.amount}</span><input name="internetAmount" type="number" min="0" inputmode="numeric" value="${escapeHtml(viewModel.fixedSettings.internet.amount || "")}" /></label>
        </div>
        <div class="form-actions">
          <button class="primary-button" type="submit" data-component-uid="CMP-0223" data-action-uid="ACT-0209">
            ${icon("save")}
            <span>${strings.portKeys.saveFixed}</span>
          </button>
        </div>
      </form>
    </section>
  `
}
