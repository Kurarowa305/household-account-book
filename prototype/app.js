const STORAGE_KEY = "household-ledger.prototype.v3"
const SAVINGS_CARRYOVER = 584958
const DEFICIT_SAMPLE_OVERRIDES = {
  "2026-02": { oldSpent: 211950, spent: 333400, comment: "Daily goods stock-up exceeded budget" },
  "2026-04": { oldSpent: 208900, spent: 346800, comment: "Utility spike exceeded budget" },
}

const categoryMeta = {
  budget: { label: "Budget", portKey: "BUDGET", color: "#247a73", icon: "coins" },
  savings: { label: "Bank", portKey: "BANK", color: "#2f8f5b", icon: "landmark" },
  food: { label: "Food", portKey: "FOOD", color: "#c85e4a", icon: "utensils" },
  daily: { label: "Daily Goods", portKey: "DAILY", color: "#b97818", icon: "shopping-bag" },
  special: { label: "Special", portKey: "SPECIAL", color: "#505aa8", icon: "gift" },
  fixed: { label: "Fixed", portKey: "FIXED", color: "#3d8050", icon: "house" },
  variable: { label: "Variable", portKey: "VARIABLE", color: "#7d5c2f", icon: "zap" },
}

const app = document.querySelector("#app")
const toast = document.querySelector("#toast")
const activeWalletLabel = document.querySelector("#activeWalletLabel")

let toastTimer = null
let state = loadState()

function uid(prefix = "id") {
  if (window.crypto?.randomUUID) return `${prefix}-${window.crypto.randomUUID()}`
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function seedState() {
  const year = 2026
  const records = Array.from({ length: 12 }, (_, index) => {
    const month = `${year}-${String(index + 1).padStart(2, "0")}`
    const budgets = [320000, 320000, 320000, 320000, 320000, 320000, 320000, 320000, 320000, 320000, 320000, 320000]
    const expenses = [205300, 333400, 219480, 346800, 228118, 0, 0, 0, 0, 0, 0, 0]
    const food = [31800, 33400, 35120, 32680, 38240, 0, 0, 0, 0, 0, 0, 0]
    const savings = [35000, 40000, 28000, 30000, 45000, 0, 0, 0, 0, 0, 0, 0]
    return {
      month,
      budget: budgets[index],
      spent: expenses[index],
      food: food[index],
      savings: savings[index],
      savingsDeposits: savings[index],
      savingsWithdrawals: 0,
      budgetGoal: ["Keep food spending stable", "Buy daily goods in bulk", "Reduce utility waste", "Hold variable costs down", "Protect bank transfer"][index] || "",
      dailyItems: {
        Detergent: [980, 760, 820, 790, 498, 0, 0, 0, 0, 0, 0, 0][index],
        Shampoo: [1280, 0, 1180, 0, 980, 0, 0, 0, 0, 0, 0, 0][index],
        "Toilet Paper": [620, 598, 640, 620, 598, 0, 0, 0, 0, 0, 0, 0][index],
      },
      minPrices: [
        { item: "Detergent", price: [980, 760, 820, 790, 498, 0, 0, 0, 0, 0, 0, 0][index], store: ["South Market", "Drug A", "South Market", "Drug A", "Drug A"][index] || "" },
        { item: "Shampoo", price: [1280, 0, 1180, 0, 980, 0, 0, 0, 0, 0, 0, 0][index], store: ["Drug A", "", "East Market", "", "Drug A"][index] || "" },
        { item: "Toilet Paper", price: [620, 598, 640, 620, 598, 0, 0, 0, 0, 0, 0, 0][index], store: ["South Market", "East Market", "South Market", "South Market", "East Market"][index] || "" },
      ],
      special: index === 4 ? [{ label: "Gift", amount: 8200 }] : [],
      comment: ["Fixed costs reviewed", "Daily goods stock-up exceeded budget", "Food cost increased", "Utility spike exceeded budget", "Special spending month"][index] || "",
    }
  })

  return {
    route: "home",
    selectedMonth: "2026-05",
    activeMonth: "2026-05",
    inputDate: "2026-05-16",
    historyCategory: "all",
    fiscalYear: 2026,
    wallets: [
      {
        id: "MAIN-WALLET",
        name: "Main Wallet",
        role: "edit",
        deletedAt: "",
        budget: 320000,
        fixedSettings: {
          rent: { day: 1, amount: 92000 },
          internet: { day: 1, amount: 5200 },
        },
        householdItems: ["Detergent", "Shampoo", "Toilet Paper", "Tissues", "Wrap", "Softener"],
        deletedHouseholdItems: [],
        entries: [
          { id: uid("entry"), date: "2026-05-01", category: "budget", label: "Monthly Budget", amount: 320000, store: "", comment: "Protect bank transfer" },
          { id: uid("entry"), date: "2026-05-02", category: "savings", label: "Deposit", amount: 45000, store: "" },
          { id: uid("entry"), date: "2026-05-18", category: "savings", label: "Withdrawal", amount: -8000, store: "" },
          { id: uid("entry"), date: "2026-05-03", category: "food", label: "Rice", amount: 4580, store: "South Market" },
          { id: uid("entry"), date: "2026-05-04", category: "food", label: "Milk", amount: 240, store: "South Market" },
          { id: uid("entry"), date: "2026-05-07", category: "food", label: "Vegetables", amount: 1800, store: "Green Shop" },
          { id: uid("entry"), date: "2026-05-08", category: "daily", label: "Detergent", amount: 498, store: "Drug A" },
          { id: uid("entry"), date: "2026-05-08", category: "daily", label: "Toilet Paper", amount: 598, store: "East Market" },
          { id: uid("entry"), date: "2026-05-10", category: "special", label: "Gift", amount: 8200, store: "" },
          { id: uid("entry"), date: "2026-05-01", category: "fixed", label: "Rent", amount: 92000, store: "" },
          { id: uid("entry"), date: "2026-05-01", category: "fixed", label: "Internet", amount: 5200, store: "" },
          { id: uid("entry"), date: "2026-05-12", category: "variable", label: "Electricity", amount: 8600, store: "" },
          { id: uid("entry"), date: "2026-05-12", category: "variable", label: "Gas", amount: 6200, store: "" },
          { id: uid("entry"), date: "2026-05-12", category: "variable", label: "Water", amount: 4100, store: "" },
        ],
      },
      {
        id: "WLT-2026-TRIP",
        name: "Trip Fund",
        role: "edit",
        deletedAt: "",
        budget: 50000,
        fixedSettings: {
          rent: { day: 1, amount: 0 },
          internet: { day: 1, amount: 0 },
        },
        householdItems: ["Transit", "Hotel", "Meals"],
        deletedHouseholdItems: [],
        entries: [
          { id: uid("entry"), date: "2026-05-01", category: "budget", label: "Monthly Budget", amount: 50000, store: "", comment: "Keep trip costs predictable" },
          { id: uid("entry"), date: "2026-05-15", category: "special", label: "Hotel Booking", amount: 24000, store: "Travel Site" },
        ],
      },
      {
        id: "WLT-FAMILY-VIEW",
        name: "Shared View",
        role: "view",
        deletedAt: "",
        budget: 120000,
        fixedSettings: {
          rent: { day: 1, amount: 0 },
          internet: { day: 1, amount: 0 },
        },
        householdItems: ["Medicine", "Care Goods"],
        deletedHouseholdItems: [],
        entries: [
          { id: uid("entry"), date: "2026-05-01", category: "budget", label: "Monthly Budget", amount: 120000, store: "", comment: "Prioritize essential care costs" },
          { id: uid("entry"), date: "2026-05-06", category: "daily", label: "Medicine", amount: 2200, store: "Pharmacy" },
        ],
      },
    ],
    currentWalletId: "MAIN-WALLET",
    shoppingList: [
      { id: uid("shop"), type: "Food", label: "Eggs", store: "", price: null, done: false },
      { id: uid("shop"), type: "Daily Goods", label: "Detergent", store: "Drug A", price: 498, done: false },
      { id: uid("shop"), type: "Food", label: "Milk", store: "", price: null, done: true },
    ],
    lineSchedule: false,
    monthlyComment: "Use the lowest-price store for daily goods this month.",
    archives: [],
    annualRecords: records,
  }
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return saved ? normalizeState(saved) : seedState()
  } catch {
    return seedState()
  }
}

function normalizeState(saved) {
  const seeded = seedState()
  const route = ["input", "history"].includes(saved.route) ? "portkeys" : saved.route || seeded.route
  const wallets = saved.wallets?.length ? saved.wallets : seeded.wallets
  const normalizedWallets = wallets.map((wallet) => ({
    ...wallet,
    deletedAt: wallet.deletedAt || "",
    deletedHouseholdItems: wallet.deletedHouseholdItems || [],
    fixedSettings: normalizeFixedSettings(wallet.fixedSettings),
  }))
  if (normalizedWallets.length && !normalizedWallets.some((wallet) => !wallet.deletedAt)) {
    normalizedWallets[0].deletedAt = ""
  }
  const currentWalletId = normalizedWallets.some((wallet) => !wallet.deletedAt && wallet.id === saved.currentWalletId)
    ? saved.currentWalletId
    : normalizedWallets.find((wallet) => !wallet.deletedAt)?.id || seeded.currentWalletId
  return {
    ...seeded,
    ...saved,
    route,
    currentWalletId,
    activeMonth: saved.activeMonth || seeded.activeMonth,
    wallets: normalizedWallets,
    shoppingList: saved.shoppingList || seeded.shoppingList,
    archives: saved.archives || [],
    annualRecords: normalizeAnnualRecords(saved.annualRecords?.length ? saved.annualRecords : seeded.annualRecords),
  }
}

function normalizeAnnualRecords(records) {
  return records.map((record) => {
    const override = DEFICIT_SAMPLE_OVERRIDES[record.month]
    if (!override || Number(record.spent || 0) !== override.oldSpent) return record
    return {
      ...record,
      spent: override.spent,
      comment: override.comment,
    }
  })
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function activeWallets() {
  return state.wallets.filter((wallet) => !wallet.deletedAt)
}

function currentWallet() {
  const wallets = activeWallets()
  return wallets.find((wallet) => wallet.id === state.currentWalletId) || wallets[0] || state.wallets[0]
}

function activeHouseholdItems(wallet = currentWallet()) {
  const deletedItems = new Set(wallet.deletedHouseholdItems || [])
  return wallet.householdItems.filter((item) => !deletedItems.has(item))
}

function isActiveMonth(month) {
  return month === (state.activeMonth || state.selectedMonth)
}

function canDeletePortKeyEntry(entry, wallet = currentWallet()) {
  return canEdit(wallet) && entry.date.startsWith(state.activeMonth || state.selectedMonth)
}

function defaultFixedSettings() {
  return {
    rent: { day: 1, amount: 0 },
    internet: { day: 1, amount: 0 },
  }
}

function normalizeFixedSettings(settings = {}) {
  const defaults = defaultFixedSettings()
  return {
    rent: {
      day: normalizeDay(settings.rent?.day ?? defaults.rent.day),
      amount: Number(settings.rent?.amount || defaults.rent.amount),
    },
    internet: {
      day: normalizeDay(settings.internet?.day ?? defaults.internet.day),
      amount: Number(settings.internet?.amount || defaults.internet.amount),
    },
  }
}

function normalizeDay(value) {
  const day = Number(value || 1)
  if (!Number.isFinite(day)) return 1
  return Math.min(Math.max(Math.round(day), 1), 31)
}

function monthStartDate(month = state.selectedMonth) {
  return `${month}-01`
}

function canEdit(wallet = currentWallet()) {
  return wallet.role === "edit"
}

function monthEntries(wallet = currentWallet(), month = state.selectedMonth) {
  return wallet.entries.filter((entry) => entry.date.startsWith(month))
}

function expenseEntries(wallet = currentWallet(), month = state.selectedMonth) {
  return monthEntries(wallet, month).filter((entry) => !["budget", "savings"].includes(entry.category))
}

function budgetEntryFor(wallet = currentWallet(), month = state.selectedMonth) {
  const entries = monthEntries(wallet, month).filter((entry) => entry.category === "budget")
  return entries[entries.length - 1] || null
}

function budgetFor(wallet = currentWallet(), month = state.selectedMonth) {
  const budgetEntry = budgetEntryFor(wallet, month)
  if (budgetEntry) return Number(budgetEntry.amount || 0)
  const annualRecord = state.annualRecords.find((record) => record.month === month)
  return Number(annualRecord?.budget || 0)
}

function budgetGoalFor(wallet = currentWallet(), month = state.selectedMonth) {
  const budgetEntry = budgetEntryFor(wallet, month)
  if (budgetEntry?.comment) return budgetEntry.comment
  const annualRecord = state.annualRecords.find((record) => record.month === month)
  return annualRecord?.budgetGoal || ""
}

function spentFor(wallet = currentWallet(), month = state.selectedMonth) {
  return expenseEntries(wallet, month).reduce((sum, entry) => sum + Number(entry.amount || 0), 0)
}

function categoryTotal(category, wallet = currentWallet(), month = state.selectedMonth) {
  if (category === "budget") return budgetFor(wallet, month)
  return monthEntries(wallet, month)
    .filter((entry) => category === "all" || entry.category === category)
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0)
}

function selectedDate() {
  if (state.inputDate?.startsWith(state.selectedMonth)) return state.inputDate
  return `${state.selectedMonth}-15`
}

function amountText(value) {
  return `${new Intl.NumberFormat("en-US").format(Math.round(Number(value || 0)))} yen`
}

function shortAmount(value) {
  return new Intl.NumberFormat("en-US").format(Math.round(Number(value || 0)))
}

function formatMonth(month) {
  const [year, monthNumber] = month.split("-").map(Number)
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(year, monthNumber - 1, 1))
}

function formatShortMonth(month) {
  const [, monthNumber] = month.split("-").map(Number)
  return new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(2000, monthNumber - 1, 1))
}

function nextMonth(month) {
  const [year, monthNumber] = month.split("-").map(Number)
  const next = new Date(year, monthNumber, 1)
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function showToast(message) {
  toast.textContent = message
  toast.classList.add("is-visible")
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600)
}

function setRoute(route) {
  state.route = route
  saveState()
  render()
}

function addEntry(entry) {
  const wallet = currentWallet()
  wallet.entries.push({
    id: uid("entry"),
    date: selectedDate(),
    store: "",
    ...entry,
    amount: Number(entry.amount || 0),
  })
  if (entry.category === "budget") wallet.budget = Number(entry.amount || wallet.budget)
  saveState()
}

function setMonthlyBudget(amount, comment) {
  const wallet = currentWallet()
  const budgetEntry = budgetEntryFor(wallet)
  const normalizedAmount = Number(amount || 0)
  if (budgetEntry) {
    budgetEntry.amount = normalizedAmount
    budgetEntry.comment = comment
    budgetEntry.label = "Monthly Budget"
  } else {
    wallet.entries.push({
      id: uid("entry"),
      date: `${state.selectedMonth}-01`,
      category: "budget",
      label: "Monthly Budget",
      amount: normalizedAmount,
      comment,
      store: "",
    })
  }
  wallet.budget = normalizedAmount
}

function setFixedMonthlyEntries(settings) {
  const wallet = currentWallet()
  wallet.fixedSettings = normalizeFixedSettings(settings)
  const rows = [
    ["Rent", wallet.fixedSettings.rent],
    ["Internet", wallet.fixedSettings.internet],
  ]
  let created = 0

  rows.forEach(([label, setting]) => {
    const existing = monthEntries(wallet).find((entry) => entry.category === "fixed" && entry.label === label)
    if (setting.amount > 0) {
      const entryDate = monthStartDate()
      if (existing) {
        existing.date = entryDate
        existing.amount = setting.amount
        existing.store = ""
      } else {
        wallet.entries.push({
          id: uid("entry"),
          date: entryDate,
          category: "fixed",
          label,
          amount: setting.amount,
          store: "",
        })
      }
      created += 1
    } else if (existing) {
      wallet.entries = wallet.entries.filter((entry) => entry.id !== existing.id)
    }
  })

  return created
}

function getFormNumber(form, name) {
  return Number(form.elements[name]?.value || 0)
}

function getFormText(form, name) {
  return String(form.elements[name]?.value || "").trim()
}

function getBreakdownData(wallet = currentWallet(), month = state.selectedMonth) {
  return Object.entries(categoryMeta)
    .filter(([key]) => !["budget", "savings"].includes(key))
    .map(([key, meta]) => ({
      key,
      label: meta.label,
      value: categoryTotal(key, wallet, month),
      color: meta.color,
    }))
    .filter((item) => item.value > 0)
}

function getMinPrices(wallet = currentWallet()) {
  const prices = new Map()
  wallet.entries
    .filter((entry) => entry.category === "daily" && entry.store && Number(entry.amount) > 0)
    .forEach((entry) => {
      const current = prices.get(entry.label)
      if (!current || Number(entry.amount) < current.price) {
        prices.set(entry.label, {
          item: entry.label,
          price: Number(entry.amount),
          store: entry.store,
          month: entry.date.slice(0, 7),
        })
      }
    })
  return Array.from(prices.values()).sort((a, b) => a.item.localeCompare(b.item))
}

function annualSavingsFor(wallet = currentWallet()) {
  return buildAnnualRows(wallet)
    .filter((row) => row.month.startsWith(`${state.fiscalYear}-`) && shouldCountSavingsRow(row))
    .reduce((sum, row) => sum + savingsAmountForRow(row), 0)
}

function totalSavingsFor(wallet = currentWallet()) {
  return SAVINGS_CARRYOVER + annualSavingsFor(wallet)
}

function savingsFlowForRow(row) {
  const hasFlow = row.savingsDeposits !== undefined || row.savingsWithdrawals !== undefined
  const netSavings = Number(row.savings || 0)
  return {
    deposits: hasFlow ? Number(row.savingsDeposits || 0) : Math.max(netSavings, 0),
    withdrawals: hasFlow ? Number(row.savingsWithdrawals || 0) : Math.max(-netSavings, 0),
  }
}

function savingsAmountForRow(row) {
  const flow = savingsFlowForRow(row)
  return Number(row.budget || 0) + flow.deposits - (Number(row.spent || 0) + flow.withdrawals)
}

function shouldCountSavingsRow(row) {
  const selectedYear = state.selectedMonth.slice(0, 4)
  const rowYear = row.month.slice(0, 4)
  const hasSavingsActivity = Number(row.savings || 0) !== 0 || savingsFlowForRow(row).deposits > 0 || savingsFlowForRow(row).withdrawals > 0
  const hasBudgetEntry = monthEntries(currentWallet(), row.month).some((entry) => entry.category === "budget")
  const hasRecordedActivity = Number(row.spent || 0) > 0 || hasSavingsActivity || state.archives.some((archive) => archive.month === row.month)
  if (rowYear === selectedYear) return row.month <= state.selectedMonth && (hasBudgetEntry || hasRecordedActivity)
  return hasRecordedActivity
}

function hasRecordedMonth(row) {
  const flow = savingsFlowForRow(row)
  return Number(row.spent || 0) > 0 || Number(row.savings || 0) !== 0 || flow.deposits > 0 || flow.withdrawals > 0 || state.archives.some((archive) => archive.month === row.month)
}

function render() {
  const wallet = currentWallet()
  activeWalletLabel.textContent = wallet.name

  document.querySelectorAll("[data-route]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.route === state.route)
  })

  if (state.route === "home") renderHome()
  if (state.route === "portkeys" || state.route === "history") renderHistory()
  if (state.route === "reports") renderReports()
  if (state.route === "shopping") renderShopping()
  if (state.route === "wallets") renderWallets()

  bindCurrentView()
  requestAnimationFrame(drawCurrentCharts)
  if (window.lucide) window.lucide.createIcons()
}

function renderHome() {
  const wallet = currentWallet()
  const budget = budgetFor(wallet)
  const spent = spentFor(wallet)
  const remaining = budget - spent
  const totalSavings = totalSavingsFor(wallet)
  const annualSavings = annualSavingsFor(wallet)
  const goalComment = budgetGoalFor(wallet)

  app.innerHTML = `
    <section class="section-stack">
      <section class="savings-overview-section">
        <h2>Savings</h2>
        <div class="savings-overview-grid">
          <article class="savings-overview-card">
            <p class="metric-meta">Total Savings</p>
            <strong>${amountText(totalSavings)}</strong>
          </article>
          <article class="savings-overview-card">
            <p class="metric-meta">Annual Savings</p>
            <strong>${amountText(annualSavings)}</strong>
          </article>
        </div>
      </section>

      <section class="summary-section">
        <header>
          <h2>Monthly Summary</h2>
        </header>
        <div class="summary-grid">
          <div class="chart-box chart-shell">
            <canvas id="monthlyDoublePie" aria-label="Monthly expenditure chart"></canvas>
            ${chartLegend()}
          </div>
          <div class="summary-copy">
            <div class="goal-comment">
              <p class="metric-meta">Goal Comment</p>
              <strong>${escapeHtml(goalComment || "No goal comment")}</strong>
            </div>
            <div>
              <div class="summary-line"><span>Budgets</span><strong>${amountText(budget)}</strong></div>
              <div class="summary-line"><span>Expenses</span><strong>${amountText(spent)}</strong></div>
              <hr class="summary-rule" />
              <div class="summary-line"><span>Remaining</span><strong>${amountText(remaining)}</strong></div>
            </div>
          </div>
        </div>
      </section>

      <section class="portkeys-section">
        <header>
          <h2>Port Keys</h2>
        </header>
        <div class="portkey-grid">
          ${Object.entries(categoryMeta)
            .map(([key, meta]) => portKeyCard(key, meta, categoryTotal(key, wallet), budget))
            .join("")}
        </div>
      </section>

      <section class="shopping-section">
        <h2>Shopping List</h2>
        <button class="shopping-entry-card" type="button" data-route-target="shopping" aria-label="Open shopping list">
          <i data-lucide="shopping-cart" aria-hidden="true"></i>
        </button>
      </section>

      <section class="archive-section">
        <header>
          <h2>Archive</h2>
        </header>
        <div class="archive-grid">
          ${archiveCards().join("")}
        </div>
      </section>
    </section>
  `
}

function chartLegend() {
  const primaryItems = [
    { label: "Budget", color: categoryMeta.budget.color },
    { label: "Expenses", color: categoryMeta.food.color },
  ]
  const detailItems = Object.entries(categoryMeta)
    .filter(([key]) => !["budget", "savings"].includes(key))
    .map(([, meta]) => ({ label: meta.label, color: meta.color }))

  return `
    <div class="chart-legend" aria-label="Chart legend">
      <div class="chart-legend-primary">
        <div class="chart-legend-card chart-legend-summary">
          ${primaryItems
            .map(
              (item) => `
            <div class="chart-legend-row">
              <span class="legend-swatch" style="background:${item.color}"></span>
              <strong>${escapeHtml(item.label)}</strong>
            </div>
          `,
            )
            .join("")}
          </div>
      </div>
      <ul class="chart-legend-list">
        ${detailItems
          .map(
            (item) => `
          <li><span class="legend-swatch" style="background:${item.color}"></span>${escapeHtml(item.label)}</li>
        `,
          )
          .join("")}
      </ul>
    </div>
  `
}

function inputCardHeading(title) {
  return title ? `<h3 class="input-card-heading">${escapeHtml(title)}</h3>` : ""
}

function portKeyCard(key, meta, total, budget) {
  return `
    <button class="portkey-card" type="button" data-history-category="${escapeHtml(key)}" style="--card-color:${meta.color}">
      <span class="portkey-icon">
        <i data-lucide="${escapeHtml(meta.icon)}" aria-hidden="true"></i>
      </span>
      <h3>${escapeHtml(meta.label)}</h3>
    </button>
  `
}

function homeShoppingList() {
  const activeItems = state.shoppingList.filter((item) => !item.done).slice(0, 6)
  if (!activeItems.length) return `<div class="empty-state">No shopping items</div>`
  return `
    <ul class="home-list">
      ${activeItems
        .map(
          (item) => `
        <li>
          <span>
            <strong>${escapeHtml(item.label)}</strong>
            <span class="muted-text">${escapeHtml(item.type)}${item.store ? ` / ${escapeHtml(item.store)}` : ""}</span>
          </span>
          <span class="money-pill">${item.price ? amountText(item.price) : "Pending"}</span>
        </li>
      `,
        )
        .join("")}
    </ul>
  `
}

function archiveCards() {
  const rows = buildAnnualRows()
  return rows.map((row) => {
    const recorded = hasRecordedMonth(row)
    return `
      <button class="archive-card month-card ${recorded ? "" : "is-disabled"}" type="button" ${recorded ? `data-report-month="${escapeHtml(row.month)}"` : "disabled"}>
        <span>${escapeHtml(formatShortMonth(row.month))}</span>
      </button>
    `
  })
}

function budgetForm(disabled, title = "") {
  const wallet = currentWallet()
  const goalComment = budgetGoalFor(wallet)
  return `
    <section class="panel">
      ${inputCardHeading(title)}
      <form data-entry-form="budget">
        <div class="form-grid two">
          <label class="field">
            <span class="field-label">Amount</span>
            <input name="amount" type="number" min="0" step="1000" inputmode="numeric" value="${budgetFor(wallet)}" ${disabled} />
          </label>
          <label class="field full">
            <span class="field-label">Goal Comment</span>
            <textarea name="comment" rows="3" placeholder="Monthly spending goal" ${disabled}>${escapeHtml(goalComment)}</textarea>
          </label>
        </div>
        <div class="form-actions">
          <button class="primary-button" type="submit" ${disabled}>
            <i data-lucide="save" aria-hidden="true"></i>
            <span>Save Budget</span>
          </button>
        </div>
      </form>
    </section>
  `
}

function foodForm(disabled, title = "") {
  return `
    <section class="panel">
      ${inputCardHeading(title)}
      <form data-entry-form="food">
        <div class="form-grid two">
          <label class="field">
            <span class="field-label">Item</span>
            <input name="label" type="text" placeholder="Rice" ${disabled} />
          </label>
          <label class="field">
            <span class="field-label">Amount</span>
            <input name="amount" type="number" min="0" inputmode="numeric" ${disabled} />
          </label>
        </div>
        <div class="form-actions">
          <button class="primary-button" type="submit" ${disabled}>
            <i data-lucide="plus" aria-hidden="true"></i>
            <span>Add</span>
          </button>
        </div>
      </form>
    </section>
  `
}

function dailyForm(wallet, disabled, title = "") {
  return `
    <div class="daily-input-shell">
      <section class="panel daily-input-card">
        ${inputCardHeading(title)}
        <form data-entry-form="daily">
          <div class="form-grid two">
            <label class="field">
              <span class="field-label">Item</span>
              <select name="label" ${disabled}>
                ${dailyItemOptions(wallet)}
              </select>
            </label>
            <label class="field">
              <span class="field-label">Amount</span>
              <input name="amount" type="number" min="0" inputmode="numeric" ${disabled} />
            </label>
            <label class="field">
              <span class="field-label">Store</span>
              <input name="store" type="text" placeholder="Drug A" ${disabled} />
            </label>
          </div>
          <div class="form-actions">
            <button class="primary-button" type="submit" ${disabled}>
              <i data-lucide="plus" aria-hidden="true"></i>
              <span>Add</span>
            </button>
          </div>
        </form>
      </section>
      <button class="icon-button daily-item-button" type="button" data-open-daily-item-dialog aria-label="Manage daily goods items" title="Manage items" ${disabled}>
        <i data-lucide="settings" aria-hidden="true"></i>
      </button>
      <dialog class="item-dialog" data-daily-item-dialog>
        <form class="dialog-card" data-daily-item-form>
          <header>
            <h3>Daily Goods Items</h3>
            <button class="icon-button" type="button" data-close-dialog aria-label="Close" title="Close">
              <i data-lucide="x" aria-hidden="true"></i>
            </button>
          </header>
          <label class="field">
            <span class="field-label">Item</span>
            <input name="newDailyItem" type="text" placeholder="Kitchen Paper" />
          </label>
          <section class="dialog-section" aria-label="Registered items">
            <h4>Registered Items</h4>
            ${dailyItemManagementList(wallet, disabled)}
          </section>
          <div class="form-actions">
            <button class="primary-button" type="submit">
              <i data-lucide="plus" aria-hidden="true"></i>
              <span>Add</span>
            </button>
          </div>
        </form>
      </dialog>
    </div>
  `
}

function dailyItemOptions(wallet) {
  return activeHouseholdItems(wallet).map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("")
}

function dailyItemManagementList(wallet, disabled) {
  const items = activeHouseholdItems(wallet)
  if (!items.length) {
    return `<div class="dialog-empty-state" data-daily-item-list>No items</div>`
  }

  return `
    <div class="dialog-item-list-wrap" data-daily-item-list>
      <ul class="dialog-item-list">
        ${items
          .map(
            (item) => `
              <li>
                <span>${escapeHtml(item)}</span>
                <button class="icon-button" type="button" data-delete-daily-item="${escapeHtml(item)}" aria-label="Delete ${escapeHtml(item)}" title="Delete" ${disabled}>
                  <i data-lucide="trash-2" aria-hidden="true"></i>
                </button>
              </li>
            `,
          )
          .join("")}
      </ul>
    </div>
  `
}

function savingsForm(disabled, title = "") {
  return `
    <section class="panel">
      ${inputCardHeading(title)}
      <form data-entry-form="savings">
        <div class="form-grid two">
          <label class="field">
            <span class="field-label">Type</span>
            <select name="direction" ${disabled}>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
            </select>
          </label>
          <label class="field">
            <span class="field-label">Amount</span>
            <input name="amount" type="number" min="0" inputmode="numeric" ${disabled} />
          </label>
        </div>
        <div class="form-actions">
          <button class="primary-button" type="submit" ${disabled}>
            <i data-lucide="plus" aria-hidden="true"></i>
            <span>Add</span>
          </button>
        </div>
      </form>
    </section>
  `
}

function specialForm(disabled, title = "") {
  return `
    <section class="panel">
      ${inputCardHeading(title)}
      <form data-entry-form="special">
        <div class="form-grid two">
          <label class="field">
            <span class="field-label">Event</span>
            <input name="label" type="text" placeholder="Birthday" ${disabled} />
          </label>
          <label class="field">
            <span class="field-label">Amount</span>
            <input name="amount" type="number" min="0" inputmode="numeric" ${disabled} />
          </label>
        </div>
        <div class="form-actions">
          <button class="primary-button" type="submit" ${disabled}>
            <i data-lucide="plus" aria-hidden="true"></i>
            <span>Add</span>
          </button>
        </div>
      </form>
    </section>
  `
}

function fixedForm(disabled, title = "") {
  const settings = normalizeFixedSettings(currentWallet().fixedSettings)
  return `
    <section class="panel">
      ${inputCardHeading(title)}
      <form data-entry-form="fixed">
        <h3 class="input-subheading">Rent</h3>
        <div class="form-grid two">
          <label class="field"><span class="field-label">Amount</span><input name="rentAmount" type="number" min="0" inputmode="numeric" value="${settings.rent.amount || ""}" ${disabled} /></label>
        </div>
        <h3 class="input-subheading">Internet</h3>
        <div class="form-grid two">
          <label class="field"><span class="field-label">Amount</span><input name="internetAmount" type="number" min="0" inputmode="numeric" value="${settings.internet.amount || ""}" ${disabled} /></label>
        </div>
        <div class="form-actions">
          <button class="primary-button" type="submit" ${disabled}>
            <i data-lucide="save" aria-hidden="true"></i>
            <span>Save Fixed</span>
          </button>
        </div>
      </form>
    </section>
  `
}

function variableForm(disabled, title = "") {
  return `
    <section class="panel">
      ${inputCardHeading(title)}
      <form data-entry-form="variable">
        <div class="form-grid two">
          <label class="field"><span class="field-label">Electricity</span><input name="electricity" type="number" min="0" inputmode="numeric" ${disabled} /></label>
          <label class="field"><span class="field-label">Gas</span><input name="gas" type="number" min="0" inputmode="numeric" ${disabled} /></label>
          <label class="field"><span class="field-label">Water</span><input name="water" type="number" min="0" inputmode="numeric" ${disabled} /></label>
        </div>
        <div class="form-actions">
          <button class="primary-button" type="submit" ${disabled}>
            <i data-lucide="plus" aria-hidden="true"></i>
            <span>Add</span>
          </button>
        </div>
      </form>
    </section>
  `
}

function renderHistory() {
  const wallet = currentWallet()
  const disabled = canEdit(wallet) ? "" : "disabled"
  const disabledNote = canEdit(wallet) ? "" : `<p class="muted-text">This wallet is view only.</p>`
  const selected = state.historyCategory || "all"
  const rows =
    selected === "budget"
      ? budgetHistoryRows(wallet)
      : monthEntries(wallet)
          .filter((entry) => selected === "all" || entry.category === selected)
          .sort((a, b) => b.date.localeCompare(a.date))

  app.innerHTML = `
    <section class="section-stack">
      <nav class="portkey-nav" aria-label="Port Key navigation">
        <button class="tab-button ${selected === "all" ? "is-active" : ""}" type="button" data-category-tab="all">All</button>
        ${Object.entries(categoryMeta)
          .map(
            ([key, meta]) => `
          <button class="tab-button ${selected === key ? "is-active" : ""}" type="button" data-category-tab="${escapeHtml(key)}">
            <i data-lucide="${escapeHtml(meta.icon)}" aria-hidden="true"></i>
            <span>${escapeHtml(meta.label)}</span>
          </button>
        `,
          )
          .join("")}
      </nav>
      ${inputSection(wallet, disabled, disabledNote, selected)}
      <h2 class="section-heading">${selected === "all" ? "All Entries" : `${categoryMeta[selected].label} Entries`}</h2>
      <section class="history-card">
        ${selected === "budget" ? budgetHistoryTable(rows) : historyTable(rows, canEdit(wallet))}
      </section>
    </section>
  `
}

function inputSection(wallet, disabled, disabledNote, selected) {
  const dateField = ["budget", "fixed"].includes(selected)
    ? ""
    : `
      <div class="form-grid two">
        <label class="field">
          <span class="field-label">Date</span>
          <input id="batchDate" type="date" value="${escapeHtml(selectedDate())}" ${disabled} />
        </label>
      </div>
    `
  return `
    <h2 class="section-heading">Input</h2>
    <section class="input-section">
      ${dateField}
      ${disabledNote}
      <div class="input-grid">
        ${inputFormsFor(selected, wallet, disabled)}
      </div>
    </section>
  `
}

function inputFormsFor(selected, wallet, disabled) {
  const forms = {
    budget: (title = "") => budgetForm(disabled, title),
    savings: (title = "") => savingsForm(disabled, title),
    food: (title = "") => foodForm(disabled, title),
    daily: (title = "") => dailyForm(wallet, disabled, title),
    special: (title = "") => specialForm(disabled, title),
    fixed: (title = "") => fixedForm(disabled, title),
    variable: (title = "") => variableForm(disabled, title),
  }

  if (selected && selected !== "all" && forms[selected]) return forms[selected]()
  return Object.keys(categoryMeta)
    .map((key) => forms[key](categoryMeta[key].label))
    .join("")
}

function budgetHistoryRows(wallet = currentWallet()) {
  const annualRows = buildAnnualRows(wallet)
  const rowsByMonth = new Map()

  annualRows
    .filter((row) => Number(row.budget || 0) > 0 && (row.month <= state.selectedMonth || state.archives.some((archive) => archive.month === row.month)))
    .forEach((row) => {
      rowsByMonth.set(row.month, {
        month: row.month,
        amount: Number(row.budget || 0),
        comment: budgetGoalFor(wallet, row.month),
        expenses: Number(row.spent || 0),
        isDeficit: Number(row.spent || 0) > Number(row.budget || 0),
      })
    })

  wallet.entries
    .filter((entry) => entry.category === "budget")
    .forEach((entry) => {
      const month = entry.date.slice(0, 7)
      const annualRow = annualRows.find((row) => row.month === month)
      const spent = annualRow ? Number(annualRow.spent || 0) : spentFor(wallet, month)
      rowsByMonth.set(month, {
        month,
        amount: Number(entry.amount || 0),
        comment: entry.comment || budgetGoalFor(wallet, month),
        expenses: spent,
        isDeficit: spent > Number(entry.amount || 0),
      })
    })

  return Array.from(rowsByMonth.values()).sort((a, b) => b.month.localeCompare(a.month))
}

function budgetHistoryTable(rows) {
  if (!rows.length) return `<div class="empty-state">No data</div>`
  return `
    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Goal Comment</th>
            <th class="amount">Amount</th>
            <th class="amount">Result</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map((row) => {
              const resultTone = row.isDeficit ? "is-deficit" : ""
              return `
            <tr>
              <td>${escapeHtml(formatMonth(row.month))}</td>
              <td>${escapeHtml(row.comment || "")}</td>
              <td class="amount">${amountText(row.amount)}</td>
              <td class="amount ${resultTone}">${amountText(row.expenses)}</td>
            </tr>
          `
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `
}

function historyTable(rows, editable) {
  if (!rows.length) return `<div class="empty-state">No data</div>`
  const hasActions = editable && rows.some((entry) => canDeletePortKeyEntry(entry))
  return `
    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Store</th>
            <th class="amount">Amount</th>
            ${hasActions ? "<th></th>" : ""}
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (entry) => `
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
                    canDeletePortKeyEntry(entry)
                      ? `
                    <button class="icon-button" type="button" data-delete-entry="${escapeHtml(entry.id)}" aria-label="Delete" title="Delete">
                      <i data-lucide="trash-2" aria-hidden="true"></i>
                    </button>
                  `
                      : ""
                  }
                </td>
              `
                  : ""
              }
            </tr>
          `,
            )
            .join("")}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4">Total</td>
            <td class="amount">${amountText(rows.reduce((sum, entry) => sum + Number(entry.amount || 0), 0))}</td>
            ${hasActions ? "<td></td>" : ""}
          </tr>
        </tfoot>
      </table>
    </div>
  `
}

function renderReports() {
  const wallet = currentWallet()
  const budget = budgetFor(wallet)
  const spent = spentFor(wallet)
  const remaining = budget - spent
  const annualRows = buildAnnualRows(wallet)
  const annualBudget = annualRows.reduce((sum, row) => sum + row.budget, 0)
  const annualSpent = annualRows.reduce((sum, row) => sum + row.spent, 0)
  const annualSavings = annualSavingsFor(wallet)

  app.innerHTML = `
    <section class="section-stack">
      <section class="report-months">
        <header>
          <h2>Monthly Reports</h2>
        </header>
        <div class="report-month-grid">
          ${reportMonthButtons(annualRows)}
        </div>
      </section>

      <h2 class="report-heading">Monthly Close Report</h2>
      <section class="report-card">
        <div class="annual-grid">
          ${miniCard("Budget", amountText(budget))}
          ${miniCard("Expenses", amountText(spent))}
          ${miniCard("Remaining", amountText(remaining))}
        </div>
        <div class="content-grid">
          <div class="chart-box">
            <h2>Breakdown</h2>
            <canvas id="reportPie" aria-label="Report breakdown chart"></canvas>
          </div>
          <div>
            <h2>Category Totals</h2>
            ${categoryTotalsTable()}
          </div>
        </div>
        <label class="field">
          <span class="field-label">Comment</span>
          <textarea id="monthlyComment" rows="3">${escapeHtml(state.monthlyComment)}</textarea>
        </label>
        <div class="panel-actions no-print">
          <button class="primary-button" type="button" data-action="monthly-print-close">
            <i data-lucide="file-down" aria-hidden="true"></i>
            <span>Export PDF and Close</span>
          </button>
          <button class="secondary-button" type="button" data-action="save-monthly-comment">
            <i data-lucide="save" aria-hidden="true"></i>
            <span>Save Comment</span>
          </button>
        </div>
      </section>

      <h2 class="report-heading">Annual Report</h2>
      <section class="report-card">
        <div class="annual-grid">
          ${miniCard("Total Budgets", amountText(annualBudget))}
          ${miniCard("Total Expenses", amountText(annualSpent))}
          ${miniCard("Total Savings", amountText(annualSavings))}
        </div>
        <div class="content-grid">
          <div class="chart-box">
            <h2>Food Trend</h2>
            <canvas id="foodLine" aria-label="Food trend chart"></canvas>
          </div>
          <div class="chart-box">
            <h2>Daily Goods Stack</h2>
            <canvas id="dailyBar" aria-label="Daily goods chart"></canvas>
          </div>
        </div>
        <div>
          <h2>Monthly Comments</h2>
          <div class="month-comments">
            ${annualRows
              .map(
                (row) => `
              <textarea class="month-comment" data-annual-comment="${escapeHtml(row.month)}" aria-label="${escapeHtml(formatMonth(row.month))} comment">${escapeHtml(row.comment || "")}</textarea>
            `,
              )
              .join("")}
          </div>
        </div>
        <div class="panel-actions no-print">
          <button class="primary-button" type="button" data-action="annual-print">
            <i data-lucide="file-down" aria-hidden="true"></i>
            <span>Export Annual PDF</span>
          </button>
          <button class="danger-button" type="button" data-action="delete-year">
            <i data-lucide="trash-2" aria-hidden="true"></i>
            <span>Delete Data</span>
          </button>
          <button class="secondary-button" type="button" data-action="new-fiscal-year">
            <i data-lucide="calendar-plus" aria-hidden="true"></i>
            <span>Start New Year</span>
          </button>
        </div>
      </section>
    </section>
  `
}

function reportMonthButtons(rows) {
  return rows
    .map((row) => {
      const recorded = hasRecordedMonth(row)
      return `
      <button class="report-month-button month-card ${row.month === state.selectedMonth ? "is-active" : ""} ${recorded ? "" : "is-disabled"}" type="button" ${recorded ? `data-report-month="${escapeHtml(row.month)}"` : "disabled"}>
        <span>${escapeHtml(formatShortMonth(row.month))}</span>
      </button>
    `
    })
    .join("")
}

function categoryTotalsTable() {
  const rows = Object.entries(categoryMeta).flatMap(([key, meta]) => {
    if (key !== "variable") {
      return [{ portKey: meta.portKey, label: meta.label, value: categoryTotal(key) }]
    }
    return ["Electricity", "Gas", "Water"].map((label) => ({
      portKey: meta.portKey,
      label,
      value: categoryLabelTotal("variable", label),
    }))
  })
  return `
    <div class="data-table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Port Key</th>
            <th class="amount">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) => `
            <tr>
              <td>${escapeHtml(row.label)}</td>
              <td>${escapeHtml(row.portKey)}</td>
              <td class="amount">${amountText(row.value)}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `
}

function categoryLabelTotal(category, label, wallet = currentWallet(), month = state.selectedMonth) {
  return monthEntries(wallet, month)
    .filter((entry) => entry.category === category && entry.label === label)
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0)
}

function miniCard(label, value) {
  return `
    <article class="mini-card">
      <p class="metric-meta">${escapeHtml(label)}</p>
      <strong>${escapeHtml(value)}</strong>
    </article>
  `
}

function buildAnnualRows(wallet = currentWallet()) {
  const byMonth = new Map(state.annualRecords.map((record) => [record.month, { ...record }]))
  Array.from({ length: 12 }, (_, index) => `${state.fiscalYear}-${String(index + 1).padStart(2, "0")}`).forEach((month) => {
    if (!byMonth.has(month)) {
      byMonth.set(month, {
        month,
        budget: 0,
        spent: 0,
        food: 0,
        savings: 0,
        savingsDeposits: 0,
        savingsWithdrawals: 0,
        dailyItems: {},
        minPrices: [],
        special: [],
        budgetGoal: "",
        comment: "",
      })
    }
  })

  const live = byMonth.get(state.selectedMonth)
  live.budget = budgetFor(wallet)
  live.budgetGoal = budgetGoalFor(wallet)
  live.spent = spentFor(wallet)
  live.food = categoryTotal("food", wallet)
  const savingsEntries = monthEntries(wallet).filter((entry) => entry.category === "savings")
  live.savingsDeposits = savingsEntries.reduce((sum, entry) => sum + Math.max(Number(entry.amount || 0), 0), 0)
  live.savingsWithdrawals = savingsEntries.reduce((sum, entry) => sum + Math.max(-Number(entry.amount || 0), 0), 0)
  live.savings = live.savingsDeposits - live.savingsWithdrawals
  live.dailyItems = expenseEntries(wallet)
    .filter((entry) => entry.category === "daily")
    .reduce((items, entry) => {
      items[entry.label] = (items[entry.label] || 0) + Number(entry.amount || 0)
      return items
    }, {})
  live.minPrices = getMinPrices(wallet)
  live.special = expenseEntries(wallet)
    .filter((entry) => entry.category === "special")
    .map((entry) => ({ label: entry.label, amount: entry.amount }))
  live.comment = state.monthlyComment

  return Array.from(byMonth.values()).sort((a, b) => a.month.localeCompare(b.month))
}

function renderShopping() {
  const wallet = currentWallet()
  const minPrices = getMinPrices(wallet)
  const dailyOptions = activeHouseholdItems(wallet).map((item) => {
    const min = minPrices.find((price) => price.item === item)
    const suffix = min ? ` / ${min.store} ${amountText(min.price)}` : ""
    return `<option value="${escapeHtml(item)}">${escapeHtml(item + suffix)}</option>`
  })

  app.innerHTML = `
    <section class="section-stack">
      <div class="content-grid">
        <section class="shopping-card">
          <header><h2>Food</h2></header>
          <form data-shopping-form="food">
            <label class="field">
              <span class="field-label">Food Item</span>
              <input name="label" type="text" placeholder="Eggs" />
            </label>
            <div class="form-actions">
              <button class="primary-button" type="submit">
                <i data-lucide="plus" aria-hidden="true"></i>
                <span>Add</span>
              </button>
            </div>
          </form>
        </section>

        <section class="shopping-card">
          <header><h2>Daily Goods</h2></header>
          <form data-shopping-form="daily">
            <label class="field">
              <span class="field-label">Item</span>
              <select name="label">${dailyOptions.join("")}</select>
            </label>
            <div class="form-actions">
              <button class="primary-button" type="submit">
                <i data-lucide="plus" aria-hidden="true"></i>
                <span>Add</span>
              </button>
            </div>
          </form>
        </section>
      </div>

      <section class="shopping-card">
        <header>
          <h2>Shopping List</h2>
          <div class="inline-actions">
            <label class="summary-line">
              <span>Scheduled Send</span>
              <input type="checkbox" id="lineSchedule" ${state.lineSchedule ? "checked" : ""} />
            </label>
            <button class="secondary-button" type="button" data-action="send-line">
              <i data-lucide="send" aria-hidden="true"></i>
              <span>Send to LINE</span>
            </button>
          </div>
        </header>
        ${shoppingList()}
      </section>
    </section>
  `
}

function shoppingList() {
  if (!state.shoppingList.length) return `<div class="empty-state">No shopping items</div>`
  return `
    <ul class="shopping-list">
      ${state.shoppingList
        .map(
          (item) => `
        <li class="shopping-row ${item.done ? "is-done" : ""}">
          <label>
            <input type="checkbox" data-shopping-done="${escapeHtml(item.id)}" ${item.done ? "checked" : ""} />
            <span>
              <strong>${escapeHtml(item.label)}</strong>
              <span class="muted-text">${escapeHtml(item.type)}${item.store ? ` / ${escapeHtml(item.store)} ${amountText(item.price)}` : ""}</span>
            </span>
          </label>
          <button class="icon-button" type="button" data-shopping-delete="${escapeHtml(item.id)}" aria-label="Delete" title="Delete">
            <i data-lucide="trash-2" aria-hidden="true"></i>
          </button>
        </li>
      `,
        )
        .join("")}
    </ul>
  `
}

function renderWallets() {
  app.innerHTML = `
    <section class="section-stack">
      <section class="panel">
        <header>
          <h2>Wallets</h2>
          <button class="secondary-button" type="button" data-open-wallet-dialog>
            <i data-lucide="plus" aria-hidden="true"></i>
            <span>Add Wallet</span>
          </button>
        </header>
        <div class="wallet-grid">
          ${activeWallets()
            .map(
              (wallet) => `
                <article class="wallet-card ${wallet.id === state.currentWalletId ? "is-active" : ""}">
                  <button class="wallet-select" type="button" data-wallet-id="${escapeHtml(wallet.id)}">
                    <h3>${escapeHtml(wallet.name)}</h3>
                  </button>
                  <details class="wallet-menu">
                    <summary aria-label="Wallet actions" title="Wallet actions">
                      <i data-lucide="more-vertical" aria-hidden="true"></i>
                    </summary>
                    <button class="danger-menu-button" type="button" data-delete-wallet="${escapeHtml(wallet.id)}">Delete</button>
                  </details>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>
      <dialog class="item-dialog" data-wallet-dialog>
        <form class="dialog-card" data-wallet-form>
          <header>
            <h3>Add Wallet</h3>
            <button class="icon-button" type="button" data-close-wallet-dialog aria-label="Close" title="Close">
              <i data-lucide="x" aria-hidden="true"></i>
            </button>
          </header>
          <label class="field">
            <span class="field-label">Wallet Name</span>
            <input name="walletName" type="text" placeholder="New Wallet" />
          </label>
          <div class="form-actions">
            <button class="secondary-button" type="button" data-close-wallet-dialog>Cancel</button>
            <button class="primary-button" type="submit">
              <i data-lucide="plus" aria-hidden="true"></i>
              <span>Create</span>
            </button>
          </div>
        </form>
      </dialog>
    </section>
  `
}

function bindCurrentView() {
  app.querySelectorAll("[data-route-target]").forEach((button) => {
    button.addEventListener("click", () => setRoute(button.dataset.routeTarget))
  })

  app.querySelectorAll("[data-history-category]").forEach((button) => {
    button.addEventListener("click", () => {
      state.historyCategory = button.dataset.historyCategory
      setRoute("portkeys")
    })
  })

  app.querySelectorAll("[data-report-month]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedMonth = button.dataset.reportMonth
      state.inputDate = `${state.selectedMonth}-15`
      setRoute("reports")
    })
  })

  if (state.route === "portkeys" || state.route === "history") {
    bindInput()
    bindHistory()
  }
  if (state.route === "reports") bindReports()
  if (state.route === "shopping") bindShopping()
  if (state.route === "wallets") bindWallets()
}

function bindInput() {
  const batchDate = app.querySelector("#batchDate")
  if (batchDate) {
    batchDate.addEventListener("change", () => {
      state.inputDate = batchDate.value
      state.selectedMonth = batchDate.value.slice(0, 7)
      saveState()
      render()
    })
  }

  bindDailyItemDialogs()

  app.querySelectorAll("[data-entry-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault()
      if (!canEdit()) return showToast("This wallet is view only")

      const type = form.dataset.entryForm
      if (type === "budget") {
        if (!isActiveMonth(state.selectedMonth)) return showToast("Only current month budget can be edited")
        const amount = getFormNumber(form, "amount")
        const comment = getFormText(form, "comment")
        if (!amount) return showToast("Enter an amount")
        setMonthlyBudget(amount, comment)
      }

      if (type === "food") {
        const label = getFormText(form, "label")
        const amount = getFormNumber(form, "amount")
        if (!label || !amount) return showToast("Enter item and amount")
        addEntry({ category: "food", label, amount })
      }

      if (type === "daily") {
        const label = getFormText(form, "label")
        const amount = getFormNumber(form, "amount")
        const store = getFormText(form, "store")
        if (!label || !amount) return showToast("Enter item and amount")
        addEntry({ category: "daily", label, amount, store })
      }

      if (type === "savings") {
        const direction = getFormText(form, "direction")
        const amount = getFormNumber(form, "amount")
        if (!amount) return showToast("Enter an amount")
        addEntry({
          category: "savings",
          label: direction === "withdrawal" ? "Withdrawal" : "Deposit",
          amount: direction === "withdrawal" ? -amount : amount,
        })
      }

      if (type === "special") {
        const label = getFormText(form, "label")
        const amount = getFormNumber(form, "amount")
        if (!label || !amount) return showToast("Enter event and amount")
        addEntry({ category: "special", label, amount })
      }

      if (type === "fixed") {
        const settings = {
          rent: {
            amount: getFormNumber(form, "rentAmount"),
          },
          internet: {
            amount: getFormNumber(form, "internetAmount"),
          },
        }
        if (!settings.rent.amount && !settings.internet.amount) return showToast("Enter an amount")
        setFixedMonthlyEntries(settings)
      }

      if (type === "variable") {
        const created = addMultipleEntries(form, "variable", [
          ["electricity", "Electricity"],
          ["gas", "Gas"],
          ["water", "Water"],
        ])
        if (!created) return showToast("Enter an amount")
      }

      saveState()
      showToast("Saved")
      render()
    })
  })
}

function bindDailyItemDialogs() {
  app.querySelectorAll("[data-open-daily-item-dialog]").forEach((button) => {
    button.addEventListener("click", () => {
      const dialog = button.closest(".daily-input-shell")?.querySelector("[data-daily-item-dialog]")
      if (!dialog) return
      dialog.querySelector("input[name='newDailyItem']").value = ""
      if (dialog.showModal) dialog.showModal()
      else dialog.setAttribute("open", "")
    })
  })

  bindDailyItemDeleteButtons(app)

  app.querySelectorAll("[data-close-dialog]").forEach((button) => {
    button.addEventListener("click", () => {
      const dialog = button.closest("dialog")
      if (dialog?.close) dialog.close()
      else dialog?.removeAttribute("open")
    })
  })

  app.querySelectorAll("[data-daily-item-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault()
      if (!canEdit()) return showToast("This wallet is view only")
      const item = getFormText(form, "newDailyItem")
      if (!item) return showToast("Enter an item")

      const wallet = currentWallet()
      let added = false
      let restored = false
      if (!wallet.householdItems.includes(item)) {
        wallet.householdItems.push(item)
        wallet.householdItems.sort((a, b) => a.localeCompare(b))
        added = true
      }
      if ((wallet.deletedHouseholdItems || []).includes(item)) {
        wallet.deletedHouseholdItems = wallet.deletedHouseholdItems.filter((value) => value !== item)
        restored = true
      }
      saveState()
      form.reset()
      showToast(added ? "Item added" : restored ? "Item restored" : "Item already exists")
      refreshDailyItemControls(form.closest("dialog"), wallet, item)
    })
  })
}

function bindDailyItemDeleteButtons(root = app) {
  root.querySelectorAll("[data-delete-daily-item]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!canEdit()) return showToast("This wallet is view only")
      const wallet = currentWallet()
      const item = button.dataset.deleteDailyItem
      wallet.deletedHouseholdItems = wallet.deletedHouseholdItems || []
      if (!wallet.deletedHouseholdItems.includes(item)) wallet.deletedHouseholdItems.push(item)
      saveState()
      showToast("Item deleted")
      refreshDailyItemControls(button.closest("dialog"), wallet)
    })
  })
}

function refreshDailyItemControls(dialog, wallet, preferredValue = "") {
  const itemList = dialog?.querySelector("[data-daily-item-list]")
  if (itemList) itemList.outerHTML = dailyItemManagementList(wallet, canEdit(wallet) ? "" : "disabled")

  app.querySelectorAll('form[data-entry-form="daily"] select[name="label"], form[data-shopping-form="daily"] select[name="label"]').forEach((select) => {
    const previousValue = select.value
    select.innerHTML = dailyItemOptions(wallet)
    const nextValue = preferredValue && wallet.householdItems.includes(preferredValue) ? preferredValue : previousValue
    if (activeHouseholdItems(wallet).includes(nextValue)) select.value = nextValue
  })

  if (dialog) bindDailyItemDeleteButtons(dialog)
  if (window.lucide) window.lucide.createIcons()
}

function addMultipleEntries(form, category, fields) {
  let created = 0
  fields.forEach(([name, label]) => {
    const amount = getFormNumber(form, name)
    if (amount > 0) {
      addEntry({ category, label, amount })
      created += 1
    }
  })
  return created
}

function bindHistory() {
  app.querySelectorAll("[data-category-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.historyCategory = button.dataset.categoryTab
      saveState()
      render()
    })
  })

  app.querySelectorAll("[data-delete-entry]").forEach((button) => {
    button.addEventListener("click", () => {
      const wallet = currentWallet()
      const entry = wallet.entries.find((item) => item.id === button.dataset.deleteEntry)
      if (!entry || !canDeletePortKeyEntry(entry, wallet)) return showToast("Only current month entries can be deleted")
      wallet.entries = wallet.entries.filter((item) => item.id !== entry.id)
      saveState()
      showToast("Deleted")
      render()
    })
  })

}

function bindReports() {
  const monthlyComment = app.querySelector("#monthlyComment")
  app.querySelector('[data-action="save-monthly-comment"]')?.addEventListener("click", () => {
    state.monthlyComment = monthlyComment.value.trim()
    saveState()
    showToast("Comment saved")
  })

  app.querySelector('[data-action="monthly-print-close"]')?.addEventListener("click", () => {
    state.monthlyComment = monthlyComment.value.trim()
    closeMonth()
    window.print()
    showToast("Month archived")
    render()
  })

  app.querySelectorAll("[data-annual-comment]").forEach((textarea) => {
    textarea.addEventListener("change", () => {
      const record = state.annualRecords.find((item) => item.month === textarea.dataset.annualComment)
      if (record) record.comment = textarea.value.trim()
      saveState()
    })
  })

  app.querySelector('[data-action="annual-print"]')?.addEventListener("click", () => window.print())

  app.querySelector('[data-action="delete-year"]')?.addEventListener("click", () => {
    currentWallet().entries = []
    state.archives = []
    state.annualRecords = []
    saveState()
    showToast("Year data deleted")
    render()
  })

  app.querySelector('[data-action="new-fiscal-year"]')?.addEventListener("click", () => {
    state.fiscalYear += 1
    state.selectedMonth = `${state.fiscalYear}-01`
    state.activeMonth = state.selectedMonth
    state.inputDate = `${state.fiscalYear}-01-15`
    state.archives = []
    state.annualRecords = []
    currentWallet().entries = [{ id: uid("entry"), date: state.inputDate, category: "budget", label: "Monthly Budget", amount: currentWallet().budget, comment: "", store: "" }]
    saveState()
    showToast("New year started")
    render()
  })
}

function closeMonth() {
  const wallet = currentWallet()
  const month = state.selectedMonth
  const budget = budgetFor(wallet, month)
  const spent = spentFor(wallet, month)
  const record = buildAnnualRows(wallet).find((row) => row.month === month)
  state.archives.push({
    id: uid("archive"),
    month,
    walletId: wallet.id,
    walletName: wallet.name,
    budget,
    spent,
    remaining: budget - spent,
    budgetGoal: budgetGoalFor(wallet, month),
    comment: state.monthlyComment,
    createdAt: new Date().toLocaleDateString("en-US"),
  })
  state.annualRecords = state.annualRecords.filter((item) => item.month !== month)
  if (record) state.annualRecords.push(record)
  const next = nextMonth(month)
  state.selectedMonth = next
  state.activeMonth = next
  state.inputDate = `${next}-15`
  state.monthlyComment = ""
  saveState()
}

function bindShopping() {
  app.querySelectorAll("[data-shopping-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault()
      const type = form.dataset.shoppingForm
      const label = getFormText(form, "label")
      if (!label) return showToast("Enter an item")

      if (type === "food") {
        state.shoppingList.push({ id: uid("shop"), type: "Food", label, store: "", price: null, done: false })
      }

      if (type === "daily") {
        const min = getMinPrices().find((item) => item.item === label)
        state.shoppingList.push({
          id: uid("shop"),
          type: "Daily Goods",
          label,
          store: min?.store || "",
          price: min?.price || null,
          done: false,
        })
      }

      saveState()
      showToast("Added")
      render()
    })
  })

  app.querySelector("#lineSchedule")?.addEventListener("change", (event) => {
    state.lineSchedule = event.target.checked
    saveState()
    showToast(state.lineSchedule ? "Scheduled send enabled" : "Scheduled send disabled")
  })

  app.querySelector('[data-action="send-line"]')?.addEventListener("click", () => {
    const count = state.shoppingList.filter((item) => !item.done).length
    showToast(`LINE send queued: ${count} items`)
  })

  app.querySelectorAll("[data-shopping-done]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const item = state.shoppingList.find((row) => row.id === checkbox.dataset.shoppingDone)
      if (item) item.done = checkbox.checked
      saveState()
      render()
    })
  })

  app.querySelectorAll("[data-shopping-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      state.shoppingList = state.shoppingList.filter((item) => item.id !== button.dataset.shoppingDelete)
      saveState()
      showToast("Deleted")
      render()
    })
  })
}

function bindWallets() {
  app.querySelectorAll("[data-wallet-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.currentWalletId = button.dataset.walletId
      saveState()
      showToast("Wallet selected")
      render()
    })
  })

  app.querySelectorAll("[data-delete-wallet]").forEach((button) => {
    button.addEventListener("click", () => {
      if (activeWallets().length <= 1) return showToast("Keep at least one wallet")
      const walletId = button.dataset.deleteWallet
      const wallet = state.wallets.find((item) => item.id === walletId)
      if (!wallet) return
      wallet.deletedAt = new Date().toISOString()
      if (state.currentWalletId === walletId) state.currentWalletId = activeWallets()[0]?.id
      saveState()
      showToast("Wallet deleted")
      render()
    })
  })

  const walletDialog = app.querySelector("[data-wallet-dialog]")
  app.querySelector("[data-open-wallet-dialog]")?.addEventListener("click", () => {
    if (!walletDialog) return
    walletDialog.querySelector("input[name='walletName']").value = ""
    if (walletDialog.showModal) walletDialog.showModal()
    else walletDialog.setAttribute("open", "")
  })

  app.querySelectorAll("[data-close-wallet-dialog]").forEach((button) => {
    button.addEventListener("click", () => {
      if (walletDialog?.close) walletDialog.close()
      else walletDialog?.removeAttribute("open")
    })
  })

  app.querySelector("[data-wallet-form]")?.addEventListener("submit", (event) => {
    event.preventDefault()
    const name = getFormText(event.currentTarget, "walletName")
    if (!name) return showToast("Enter a wallet name")

    const wallet = {
      id: uid("wallet"),
      name,
      role: "edit",
      deletedAt: "",
      budget: 0,
      fixedSettings: defaultFixedSettings(),
      householdItems: [],
      deletedHouseholdItems: [],
      entries: [],
    }
    state.wallets.push(wallet)
    state.currentWalletId = wallet.id
    saveState()
    showToast("Wallet created")
    if (walletDialog?.close) walletDialog.close()
    render()
  })
}

function drawCurrentCharts() {
  if (state.route === "home") drawDoublePie("monthlyDoublePie")
  if (state.route === "reports") {
    drawPie("reportPie", getBreakdownData(), "")
    const annualRows = buildAnnualRows()
    drawLine("foodLine", annualRows.map((row) => ({ label: row.month.slice(5), value: row.food })))
    drawBar("dailyBar", annualRows)
  }
}

function setupCanvas(id) {
  const canvas = document.querySelector(`#${id}`)
  if (!canvas) return null
  const rect = canvas.getBoundingClientRect()
  const dpr = window.devicePixelRatio || 1
  canvas.width = Math.max(320, Math.floor(rect.width * dpr))
  canvas.height = Math.max(260, Math.floor(rect.height * dpr))
  const ctx = canvas.getContext("2d")
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return { canvas, ctx, width: canvas.width / dpr, height: canvas.height / dpr }
}

function drawDoublePie(id) {
  const setup = setupCanvas(id)
  if (!setup) return
  const { ctx, width, height } = setup
  const wallet = currentWallet()
  const budget = budgetFor(wallet)
  const spent = spentFor(wallet)
  const breakdown = getBreakdownData(wallet)
  const cx = width / 2
  const cy = height / 2
  const outerRadius = Math.min(width, height) * 0.36
  const innerRadius = outerRadius * 0.69
  const ringWidth = Math.max(22, outerRadius * 0.16)

  ctx.clearRect(0, 0, width, height)
  drawRingBackground(ctx, cx, cy, outerRadius, ringWidth, categoryMeta.budget.color)
  drawRingBackground(ctx, cx, cy, innerRadius, ringWidth, "#eef3ef")

  if (budget > 0) {
    const expenseAngle = Math.min(spent / budget, 1) * Math.PI * 2
    drawRingSlice(ctx, cx, cy, outerRadius, ringWidth, -Math.PI / 2, -Math.PI / 2 + expenseAngle, categoryMeta.food.color)
    if (spent > budget) drawRingSlice(ctx, cx, cy, outerRadius, ringWidth, -Math.PI / 2, Math.PI * 1.5, "#b7353d")
  }

  const breakdownTotal = breakdown.reduce((sum, item) => sum + item.value, 0)
  if (breakdownTotal > 0) {
    let start = -Math.PI / 2
    breakdown.forEach((item) => {
      const angle = (item.value / breakdownTotal) * Math.PI * 2
      drawRingSlice(ctx, cx, cy, innerRadius, ringWidth, start, start + angle, item.color)
      start += angle
    })
  }

  ctx.fillStyle = "#fff"
  ctx.beginPath()
  ctx.arc(cx, cy, innerRadius - ringWidth * 0.72, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = "#1f2428"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.font = "700 16px sans-serif"
  ctx.fillText("Expenditure", cx, cy - 14)
  ctx.font = "800 25px sans-serif"
  ctx.fillText(`${shortAmount(spent)} yen`, cx, cy + 18)
}

function drawRingBackground(ctx, cx, cy, radius, width, color = "#eef3ef") {
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.lineCap = "butt"
  ctx.stroke()
}

function drawRingSlice(ctx, cx, cy, radius, width, start, end, color) {
  if (end <= start) return
  ctx.beginPath()
  ctx.arc(cx, cy, radius, start, end)
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.lineCap = "butt"
  ctx.stroke()
}

function drawPie(id, data, centerText) {
  const setup = setupCanvas(id)
  if (!setup) return
  const { ctx, width, height } = setup
  const total = data.reduce((sum, item) => sum + Number(item.value || 0), 0)
  const cx = width / 2
  const cy = height / 2
  const radius = Math.min(width, height) * 0.34
  ctx.clearRect(0, 0, width, height)

  ctx.fillStyle = "#f0f4ef"
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.fill()

  if (!total) {
    ctx.fillStyle = "#66706a"
    ctx.font = "700 16px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("No data", cx, cy)
    return
  }

  let start = -Math.PI / 2
  data.forEach((item) => {
    const angle = (Number(item.value || 0) / total) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, radius, start, start + angle)
    ctx.closePath()
    ctx.fillStyle = item.color
    ctx.fill()
    start += angle
  })

  if (centerText) {
    ctx.fillStyle = "#fff"
    ctx.beginPath()
    ctx.arc(cx, cy, radius * 0.56, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "#1f2428"
    ctx.font = "800 22px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(centerText, cx, cy)
  }
}

function drawLine(id, data) {
  const setup = setupCanvas(id)
  if (!setup) return
  const { ctx, width, height } = setup
  const padding = 38
  const values = data.map((item) => item.value)
  const max = Math.max(...values, 1000)
  const plotW = width - padding * 2
  const plotH = height - padding * 2
  ctx.clearRect(0, 0, width, height)

  ctx.strokeStyle = "#d9ded8"
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, height - padding)
  ctx.lineTo(width - padding, height - padding)
  ctx.stroke()

  ctx.strokeStyle = categoryMeta.food.color
  ctx.lineWidth = 3
  ctx.beginPath()
  data.forEach((item, index) => {
    const x = padding + (plotW / Math.max(data.length - 1, 1)) * index
    const y = height - padding - (item.value / max) * plotH
    if (index === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  })
  ctx.stroke()

  ctx.fillStyle = "#1f2428"
  ctx.font = "12px sans-serif"
  ctx.textAlign = "center"
  data.forEach((item, index) => {
    const x = padding + (plotW / Math.max(data.length - 1, 1)) * index
    const y = height - padding - (item.value / max) * plotH
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fillStyle = categoryMeta.food.color
    ctx.fill()
    if (index % 2 === 0) {
      ctx.fillStyle = "#66706a"
      ctx.fillText(item.label, x, height - 14)
    }
  })
}

function drawBar(id, annualRows) {
  const setup = setupCanvas(id)
  if (!setup) return
  const { ctx, width, height } = setup
  const totals = new Map()
  annualRows.forEach((row) => {
    Object.entries(row.dailyItems || {}).forEach(([item, amount]) => {
      totals.set(item, (totals.get(item) || 0) + Number(amount || 0))
    })
  })
  const rows = Array.from(totals.entries())
    .map(([item, amount]) => ({ item, amount }))
    .filter((row) => row.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8)

  ctx.clearRect(0, 0, width, height)
  if (!rows.length) {
    ctx.fillStyle = "#66706a"
    ctx.font = "700 16px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("No data", width / 2, height / 2)
    return
  }

  const padding = 42
  const max = Math.max(...rows.map((row) => row.amount), 1000)
  const barGap = 12
  const barW = Math.max(22, (width - padding * 2 - barGap * (rows.length - 1)) / rows.length)
  const colors = ["#247a73", "#c85e4a", "#b97818", "#505aa8", "#3d8050", "#7d5c2f", "#7a5875", "#4d6f86"]

  rows.forEach((row, index) => {
    const x = padding + index * (barW + barGap)
    const barH = ((height - padding * 2) * row.amount) / max
    const y = height - padding - barH
    ctx.fillStyle = colors[index % colors.length]
    ctx.fillRect(x, y, barW, barH)
    ctx.fillStyle = "#66706a"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(row.item.slice(0, 8), x + barW / 2, height - 14)
  })
}

document.querySelectorAll("[data-route]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.route === "portkeys") state.historyCategory = "all"
    setRoute(button.dataset.route)
  })
})

window.addEventListener("resize", () => {
  clearTimeout(window.__chartResizeTimer)
  window.__chartResizeTimer = setTimeout(drawCurrentCharts, 120)
})

render()
