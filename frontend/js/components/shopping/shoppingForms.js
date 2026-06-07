import { strings } from "../../constants/strings.js"
import { amountText } from "../../utils/formatters.js"
import { escapeHtml, icon } from "../../utils/html.js"

export function renderShoppingForms(viewModel) {
  return `
    <div class="content-grid">
      <section class="shopping-card" data-component-uid="CMP-0401">
        <header><h2>${strings.shopping.food}</h2></header>
        <form data-shopping-form="food" data-action-uid="ACT-0401">
          <label class="field">
            <span class="field-label">${strings.shopping.foodItem}</span>
            <input name="label" type="text" placeholder="Eggs" />
          </label>
          <div class="form-actions">
            <button class="primary-button" type="submit" data-component-uid="CMP-0402" data-action-uid="ACT-0401">
              ${icon("plus")}
              <span>${strings.common.add}</span>
            </button>
          </div>
        </form>
      </section>

      <section class="shopping-card" data-component-uid="CMP-0403">
        <header><h2>${strings.shopping.dailyGoods}</h2></header>
        <form data-shopping-form="daily" data-action-uid="ACT-0402">
          <label class="field">
            <span class="field-label">${strings.portKeys.item}</span>
            <select name="label">
              ${viewModel.dailyOptions
                .map((option) => {
                  const suffix = option.minPrice ? ` / ${option.minPrice.store} ${amountText(option.minPrice.price)}` : ""
                  return `<option value="${escapeHtml(option.item)}">${escapeHtml(option.item + suffix)}</option>`
                })
                .join("")}
            </select>
          </label>
          <div class="form-actions">
            <button class="primary-button" type="submit" data-component-uid="CMP-0404" data-action-uid="ACT-0402">
              ${icon("plus")}
              <span>${strings.common.add}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  `
}
