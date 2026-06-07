import { strings } from "../../constants/strings.js"
import { escapeHtml, icon } from "../../utils/html.js"

export function renderPortKeyGrid(viewModel) {
  return `
    <section class="portkeys-section" data-component-uid="CMP-0108">
      <header>
        <h2>${strings.home.portKeys}</h2>
      </header>
      <div class="portkey-grid">
        ${viewModel.categories.map(renderPortKeyCard).join("")}
      </div>
    </section>
  `
}

function renderPortKeyCard(category) {
  return `
    <button class="portkey-card" type="button" data-history-category="${escapeHtml(category.key)}" data-component-uid="CMP-0109" data-action-uid="ACT-0102" style="--card-color:${escapeHtml(category.color)}">
      <span class="portkey-icon">
        ${icon(category.icon)}
      </span>
      <h3>${escapeHtml(category.label)}</h3>
    </button>
  `
}
