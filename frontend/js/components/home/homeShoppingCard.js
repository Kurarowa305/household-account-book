import { strings } from "../../constants/strings.js"
import { icon } from "../../utils/html.js"

export function renderHomeShoppingCard() {
  return `
    <section class="shopping-section" data-component-uid="CMP-0110">
      <h2>${strings.home.shoppingList}</h2>
      <button class="shopping-entry-card" type="button" data-route-target="#/shopping-list" data-component-uid="CMP-0111" data-action-uid="ACT-0101" aria-label="Open shopping list">
        ${icon("shopping-cart")}
      </button>
    </section>
  `
}
