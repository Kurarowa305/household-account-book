export const categoryMeta = {
  budget: { label: "Budget", portKey: "BUDGET", color: "#247a73", icon: "coins" },
  savings: { label: "Bank", portKey: "BANK", color: "#2f8f5b", icon: "landmark" },
  food: { label: "Food", portKey: "FOOD", color: "#c85e4a", icon: "utensils" },
  daily: { label: "Daily Goods", portKey: "DAILY", color: "#b97818", icon: "shopping-bag" },
  special: { label: "Special", portKey: "SPECIAL", color: "#505aa8", icon: "gift" },
  fixed: { label: "Fixed", portKey: "FIXED", color: "#3d8050", icon: "house" },
  variable: { label: "Variable", portKey: "VARIABLE", color: "#7d5c2f", icon: "zap" },
}

export const categoryOrder = Object.keys(categoryMeta)
