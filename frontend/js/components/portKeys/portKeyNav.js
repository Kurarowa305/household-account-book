import { strings } from "../../constants/strings.js"
import { escapeHtml, icon } from "../../utils/html.js"

export function renderPortKeyNav(viewModel) {
  const selected = viewModel.selectedCategory
  return `
    <nav class="portkey-nav" aria-label="Port Key navigation" data-component-uid="CMP-0201">
      <button class="tab-button ${selected === "all" ? "is-active" : ""}" type="button" data-category-tab="all" data-component-uid="CMP-0202" data-action-uid="ACT-0102">${strings.portKeys.all}</button>
      ${viewModel.categories
        .map(
          (category) => `
            <button class="tab-button ${selected === category.key ? "is-active" : ""}" type="button" data-category-tab="${escapeHtml(category.key)}" data-component-uid="CMP-0202" data-action-uid="ACT-0102">
              ${icon(category.icon)}
              <span>${escapeHtml(category.label)}</span>
            </button>
          `,
        )
        .join("")}
    </nav>
  `
}
