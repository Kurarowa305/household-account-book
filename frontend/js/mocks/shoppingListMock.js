import { appMockState } from "./appMockState.js"
import { activeHouseholdItems, currentWallet, getMinPrices } from "../utils/ledgerCalculations.js"

export function createShoppingListViewModel(state = appMockState) {
  const wallet = currentWallet(state)
  const minPrices = getMinPrices(state, wallet)
  return {
    screenUid: "SCR-0004",
    lineSchedule: state.lineSchedule,
    dailyOptions: activeHouseholdItems(wallet).map((item) => ({
      item,
      minPrice: minPrices.find((price) => price.item === item) || null,
    })),
    shoppingList: state.shoppingList,
  }
}

export const shoppingListMockViewModel = createShoppingListViewModel(appMockState)
