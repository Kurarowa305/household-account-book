import { renderHistoryTable } from "../components/portKeys/historyTable.js"
import { renderInputSection } from "../components/portKeys/inputSection.js"
import { renderPortKeyNav } from "../components/portKeys/portKeyNav.js"

export function renderPortKeysPage(viewModel) {
  return `
    <main class="page page-port-keys section-stack" data-screen-uid="SCR-0002">
      ${renderPortKeyNav(viewModel)}
      ${renderInputSection(viewModel)}
      ${renderHistoryTable(viewModel)}
    </main>
  `
}
