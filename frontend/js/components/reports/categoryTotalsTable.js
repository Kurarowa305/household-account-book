import { strings } from "../../constants/strings.js"
import { amountText } from "../../utils/formatters.js"
import { escapeHtml } from "../../utils/html.js"
import { renderDataTable } from "../shared/dataTable.js"

export function renderCategoryTotalsTable(viewModel) {
  return renderDataTable({
    componentUid: "CMP-0313",
    headers: [
      { label: strings.reports.category },
      { label: strings.reports.portKey },
      { label: strings.common.amount, className: "amount" },
    ],
    rows: viewModel.categoryTotals.map(
      (row) => `
        <tr>
          <td>${escapeHtml(row.label)}</td>
          <td>${escapeHtml(row.portKey)}</td>
          <td class="amount">${amountText(row.value)}</td>
        </tr>
      `,
    ),
  })
}
