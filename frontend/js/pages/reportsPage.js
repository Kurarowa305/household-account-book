import { renderAnnualReport } from "../components/reports/annualReport.js"
import { renderMonthlyCloseReport } from "../components/reports/monthlyCloseReport.js"
import { renderReportMonthGrid } from "../components/reports/reportMonthGrid.js"
import { drawBar, drawLine, drawPie } from "../utils/charts.js"

export function renderReportsPage(viewModel) {
  return `
    <main class="page page-reports section-stack" data-screen-uid="SCR-0003">
      ${renderReportMonthGrid(viewModel)}
      ${renderMonthlyCloseReport(viewModel)}
      ${renderAnnualReport(viewModel)}
    </main>
  `
}

export function mountReportsPage(root, viewModel) {
  requestAnimationFrame(() => {
    drawPie(root, "reportPie", viewModel.breakdown)
    drawLine(
      root,
      "foodLine",
      viewModel.annualRows.map((row) => ({ label: row.month.slice(5), value: row.food })),
    )
    drawBar(root, "dailyBar", viewModel.annualRows)
  })
}
