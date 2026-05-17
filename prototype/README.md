# Household Book Prototype

This is a static SPA prototype. Open `index.html` in a browser to use it.

## Files

- `index.html`: App shell and sidebar navigation
- `styles.css`: Layout, responsive styles, and print styles
- `app.js`: Routing, sample data, input flows, history, reports, shopping list, and wallet switching

## Current Scope

- English-only UI copy
- Sidebar navigation without profile controls or exit actions
- Separate Wallets screen linked from the lower-left sidebar with name-only wallet cards and a name-only add-wallet dialog
- Wallet cards include a top-right actions menu with logical delete
- Home savings overview with annual savings based on `(Budgets + Bank Deposits) - (Expenses + Bank Withdrawals)` and total savings that adds a 584,958 yen carryover
- Home monthly summary with one double-ring chart and grouped Budget/Expenses legend
- Budget and expenses outer chart ring with inner spending breakdown
- Seven icon-first Port Key cards, including Bank
- Port Keys screen with navigation, an Input heading, matching input forms, monthly Budget setting with goal comment, Fixed Rent/Internet month-start auto-entry settings, All-view input card headings, Daily Goods item dialog with registered-item logical deletion, Bank deposit/withdrawal input, and entry history
- Budget and Fixed individual input views hide the shared Date field
- Budget Entries list with month-level budget settings and deficit-only Result coloring
- Port Key row deletion is available only for active-month entries; previous months show no delete controls
- Registered data has no edit controls, except active-month Budget setting updates
- Wallets and Daily Goods Items are logically deleted; other deletable data is physically deleted
- Sample annual data includes two past deficit months for Budget Entries validation
- Simple Home Shopping List card that opens the shopping list screen
- Home Archive section with month-name cards and disabled future months
- Reports screen with month-name cards and disabled future months
- Monthly Close Report Category Totals split Variable into Electricity, Gas, and Water
- Monthly close resets only Monthly Summary by moving to the next month; Port Key entries are not deleted
- Category input forms, history tables, reports, PDF print flow, and shopping list actions

Data is stored in browser `localStorage`.
