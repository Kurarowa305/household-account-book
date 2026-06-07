import { strings } from "../../constants/strings.js"
import { amountText, formatMonth } from "../../utils/formatters.js"
import { escapeHtml } from "../../utils/html.js"
import { renderDataTable } from "../shared/dataTable.js"
import { renderEmptyState } from "../shared/emptyState.js"

export function renderBudgetHistoryTable(rows) {
  if (!rows.length) return renderEmptyState()
  return renderDataTable({
    componentUid: "CMP-0232",
    headers: [
      { label: "Month" },
      { label: strings.portKeys.goalComment },
      { label: strings.common.amount, className: "amount" },
      { label: strings.portKeys.result, className: "amount" },
    ],
    rows: rows.map((row) => {
      const resultTone = row.isDeficit ? "is-deficit" : ""
      return `
        <tr>
          <td>${escapeHtml(formatMonth(row.month))}</td>
          <td>${escapeHtml(row.comment || "")}</td>
          <td class="amount">${amountText(row.amount)}</td>
          <td class="amount ${resultTone}">${amountText(row.expenses)}</td>
        </tr>
      `
    }),
  })
}
