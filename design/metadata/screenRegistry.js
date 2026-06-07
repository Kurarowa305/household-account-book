import { homeMockViewModel } from "../../frontend/js/mocks/homeMock.js"
import { portKeysMockViewModel } from "../../frontend/js/mocks/portKeysMock.js"
import { reportsMockViewModel } from "../../frontend/js/mocks/reportsMock.js"
import { shoppingListMockViewModel } from "../../frontend/js/mocks/shoppingListMock.js"
import { walletsMockViewModel } from "../../frontend/js/mocks/walletsMock.js"
import { renderHomePage, mountHomePage } from "../../frontend/js/pages/homePage.js"
import { renderPortKeysPage } from "../../frontend/js/pages/portKeysPage.js"
import { renderReportsPage, mountReportsPage } from "../../frontend/js/pages/reportsPage.js"
import { renderShoppingListPage } from "../../frontend/js/pages/shoppingListPage.js"
import { renderWalletsPage } from "../../frontend/js/pages/walletsPage.js"

export const screenRegistry = [
  {
    uid: "SCR-0001",
    key: "home",
    title: "Home",
    route: "#/home",
    source: "frontend/js/pages/homePage.js",
    description: "家計状況の概要、月次サマリー、ポートキー、買い物リスト導線、月別アーカイブを確認するホーム画面。",
    render: renderHomePage,
    mount: mountHomePage,
    mock: homeMockViewModel,
  },
  {
    uid: "SCR-0002",
    key: "portKeys",
    title: "Port Keys",
    route: "#/port-keys",
    source: "frontend/js/pages/portKeysPage.js",
    description: "予算、銀行、食費、日用品、特別費、固定費、変動費の入力と履歴確認を行う画面。",
    render: renderPortKeysPage,
    mock: portKeysMockViewModel,
  },
  {
    uid: "SCR-0003",
    key: "reports",
    title: "Reports",
    route: "#/reports",
    source: "frontend/js/pages/reportsPage.js",
    description: "月次締めレポートと年間レポートを確認し、コメント保存や出力モックを実行する画面。",
    render: renderReportsPage,
    mount: mountReportsPage,
    mock: reportsMockViewModel,
  },
  {
    uid: "SCR-0004",
    key: "shoppingList",
    title: "Shopping List",
    route: "#/shopping-list",
    source: "frontend/js/pages/shoppingListPage.js",
    description: "食材と日用品の買い物リストを追加、完了、削除し、LINE送信モックを確認する画面。",
    render: renderShoppingListPage,
    mock: shoppingListMockViewModel,
  },
  {
    uid: "SCR-0005",
    key: "wallets",
    title: "Wallets",
    route: "#/wallets",
    source: "frontend/js/pages/walletsPage.js",
    description: "利用するお財布の選択、追加モック、削除モックを行う画面。",
    render: renderWalletsPage,
    mock: walletsMockViewModel,
  },
]
