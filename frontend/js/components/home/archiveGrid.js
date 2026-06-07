import { strings } from "../../constants/strings.js"
import { escapeHtml } from "../../utils/html.js"
import { formatShortMonth } from "../../utils/formatters.js"

export function renderArchiveGrid(viewModel) {
  return `
    <section class="archive-section" data-component-uid="CMP-0112">
      <header>
        <h2>${strings.home.archive}</h2>
      </header>
      <div class="archive-grid">
        ${viewModel.archiveRows.map(renderArchiveCard).join("")}
      </div>
    </section>
  `
}

function renderArchiveCard(row) {
  const enabledAttributes = row.recorded ? `data-report-month="${escapeHtml(row.month)}" data-action-uid="ACT-0103"` : "disabled"
  return `
    <button class="archive-card month-card ${row.recorded ? "" : "is-disabled"}" type="button" data-component-uid="CMP-0113" ${enabledAttributes}>
      <span>${escapeHtml(formatShortMonth(row.month))}</span>
    </button>
  `
}
