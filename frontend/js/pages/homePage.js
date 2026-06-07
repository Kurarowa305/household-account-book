import { renderArchiveGrid } from "../components/home/archiveGrid.js"
import { renderHomeShoppingCard } from "../components/home/homeShoppingCard.js"
import { renderMonthlySummary } from "../components/home/monthlySummary.js"
import { renderPortKeyGrid } from "../components/home/portKeyGrid.js"
import { renderSavingsOverview } from "../components/home/savingsOverview.js"
import { drawDoublePie } from "../utils/charts.js"

export function renderHomePage(viewModel) {
  return `
    <main class="page page-home section-stack" data-screen-uid="SCR-0001">
      ${renderSavingsOverview(viewModel)}
      ${renderMonthlySummary(viewModel)}
      ${renderPortKeyGrid(viewModel)}
      ${renderHomeShoppingCard(viewModel)}
      ${renderArchiveGrid(viewModel)}
    </main>
  `
}

export function mountHomePage(root, viewModel) {
  requestAnimationFrame(() => drawDoublePie(root, "monthlyDoublePie", viewModel))
}
