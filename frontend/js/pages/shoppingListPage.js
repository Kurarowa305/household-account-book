import { renderShoppingForms } from "../components/shopping/shoppingForms.js"
import { renderShoppingListPanel } from "../components/shopping/shoppingListPanel.js"

export function renderShoppingListPage(viewModel) {
  return `
    <main class="page page-shopping-list section-stack" data-screen-uid="SCR-0004">
      ${renderShoppingForms(viewModel)}
      ${renderShoppingListPanel(viewModel)}
    </main>
  `
}
