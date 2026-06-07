import { categoryMeta } from "../../constants/categoryMeta.js"
import { strings } from "../../constants/strings.js"
import { amountText } from "../../utils/formatters.js"
import { escapeHtml, icon } from "../../utils/html.js"
import { renderDataTable } from "../shared/dataTable.js"
import { renderEmptyState } from "../shared/emptyState.js"
import { renderBudgetHistoryTable } from "./budgetHistoryTable.js"

export function renderHistoryTable(viewModel) {
  const selected = viewModel.selectedCategory
  const title = selected === "all" ? strings.portKeys.allEntries : `${categoryMeta[selected].label} ${strings.portKeys.historySuffix}`
  return `
    <h2 class="section-heading">${escapeHtml(title)}</h2>
    <section class="history-card" data-component-uid="CMP-0230">
      ${selected === "budget" ? renderBudgetHistoryTable(viewModel.budgetRows) : renderEntryHistoryTable(viewModel)}
    </section>
  `
}

function renderEntryHistoryTable(viewModel) {
  const rows = viewModel.rows
  if (!rows.length) return renderEmptyState()
  const hasActions = rows.some((entry) => viewModel.canDeleteEntry(entry))
  return renderDataTable({
    componentUid: "CMP-0230",
    headers: [
      { label: strings.common.date },
      { label: "Category" },
      { label: strings.portKeys.description },
      { label: strings.common.store },
      { label: strings.common.amount, className: "amount" },
      ...(hasActions ? [{ label: "" }] : []),
    ],
    rows: rows.map((entry) => renderEntryRow(entry, viewModel, hasActions)),
    footer: `
      <tfoot>
        <tr>
          <td colspan="4">${strings.common.total}</td>
          <td class="amount">${amountText(rows.reduce((sum, entry) => sum + Number(entry.amount || 0), 0))}</td>
          ${hasActions ? "<td></td>" : ""}
        </tr>
      </tfoot>
    `,
  })
}

function renderEntryRow(entry, viewModel, hasActions) {
  return `
    <tr>
      <td>${escapeHtml(entry.date)}</td>
      <td>${escapeHtml(categoryMeta[entry.category]?.label || entry.category)}</td>
      <td>${escapeHtml(entry.label)}</td>
      <td>${entry.category === "food" ? "" : escapeHtml(entry.store || "")}</td>
      <td class="amount">${amountText(entry.amount)}</td>
      ${
        hasActions
          ? `
            <td>
              ${
                viewModel.canDeleteEntry(entry)
                  ? `
                    <button class="icon-button" type="button" data-delete-entry="${escapeHtml(entry.id)}" aria-label="${strings.common.delete}" title="${strings.common.delete}" data-component-uid="CMP-0231" data-action-uid="ACT-0211">
                      ${icon("trash-2")}
                    </button>
                  `
                  : ""
              }
            </td>
          `
          : ""
      }
    </tr>
  `
}
