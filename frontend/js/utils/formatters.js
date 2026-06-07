export function amountText(value) {
  return `${new Intl.NumberFormat("en-US").format(Math.round(Number(value || 0)))} yen`
}

export function shortAmount(value) {
  return new Intl.NumberFormat("en-US").format(Math.round(Number(value || 0)))
}

export function formatMonth(month) {
  const [year, monthNumber] = month.split("-").map(Number)
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(year, monthNumber - 1, 1))
}

export function formatShortMonth(month) {
  const [, monthNumber] = month.split("-").map(Number)
  return new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(2000, monthNumber - 1, 1))
}
