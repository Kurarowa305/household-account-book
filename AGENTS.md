# AGENTS.md

## 目次

- [AGENTS.md](#agentsmd)
  - [目次](#目次)
  - [このファイルの目的](#このファイルの目的)
  - [共通原則](#共通原則)
  - [Frontend と Design Portal の同期](#frontend-と-design-portal-の同期)
  - [変更種別ごとの確認事項](#変更種別ごとの確認事項)
    - [画面を追加・削除・名称変更した場合](#画面を追加削除名称変更した場合)
    - [コンポーネントを追加・削除・分割した場合](#コンポーネントを追加削除分割した場合)
    - [Actionを追加・削除・変更した場合](#actionを追加削除変更した場合)
    - [設計資料を追加・更新した場合](#設計資料を追加更新した場合)
    - [文言を変更した場合](#文言を変更した場合)
    - [Mock ViewModelを変更した場合](#mock-viewmodelを変更した場合)
    - [CSSを変更・分割した場合](#cssを変更分割した場合)
  - [動作確認](#動作確認)
  - [PR作成ルール](#pr作成ルール)
    - [PRサマリーに含める内容](#prサマリーに含める内容)
    - [PR発行時にチェックする内容](#pr発行時にチェックする内容)
  - [今後の追記ルール](#今後の追記ルール)

## このファイルの目的

このファイルは、このリポジトリで作業するAgent向けの作業ルールをまとめる。

今後ルールを追加する場合は、既存章の中に追記するか、目次に新しい章を追加してから本文を追加する。

## 共通原則

- 現行プロトタイプ由来の画面構成を優先する。
- 対象は素の HTML / CSS / JavaScript とする。
- React / Vue / Angular / TypeScript / Tailwind CSS / Vite / Next.js などは導入しない。
- `prototype/` は参照用として扱う。
- CSSの設計値はmetadataへ転記しない。必要な値は `getComputedStyle()` で確認する。

## Frontend と Design Portal の同期

`frontend/` 配下を修正した場合は、同じ変更が `design/portal/` から確認できる状態を維持する。

設計ポータルの前提:

- `design/portal/` は `frontend/js/pages/` の描画関数を直接importしてプレビューする。
- ポータル専用の画面コピーは作らない。
- `design/metadata/screenRegistry.js` が画面プレビューの入口になる。
- `design/metadata/screenRegistry.js` が `data-screen-uid` の詳細情報を管理する。
- `design/metadata/componentRegistry.js` が `data-component-uid` の詳細情報を管理する。
- `design/metadata/actionRegistry.js` が `data-action-uid` の詳細情報を管理する。
- ポータル固有の見た目だけが必要な場合は `design/portal/css/portal.css` に閉じる。
- 設計資料を追加・更新した場合は、`README.md` の設計資料一覧、説明、リンクも更新する。

## 変更種別ごとの確認事項

### 画面を追加・削除・名称変更した場合

- `frontend/js/pages/` の描画関数とexport名を確認する。
- `frontend/js/router.js` と `frontend/js/constants/routes.js` を更新する。
- `design/metadata/screenRegistry.js` を更新する。
- `design/docs/画面設計.md` を更新する。
- 設計ポータルの画面一覧に表示され、プレビューできることを確認する。

### コンポーネントを追加・削除・分割した場合

- 対象DOMに `data-component-uid` を付与する。
- `design/metadata/componentRegistry.js` にUID、key、screenUid、source、descriptionを登録または更新する。
- `design/docs/画面設計.md` を必要に応じて更新する。
- 設計ポータルでクリックしたときにコンポーネント詳細が表示されることを確認する。

### Actionを追加・削除・変更した場合

- 操作を持つ要素に `data-action-uid` を付与する。
- `frontend/js/actions/` のAction実装と `actionDispatcher.js` を更新する。
- `design/metadata/actionRegistry.js` にUID、key、label、description、triggerComponentUid、screenUid、status、noteを登録または更新する。
- `design/docs/画面設計.md` を必要に応じて更新する。
- 設計ポータルで対象要素をクリックしたときにAction詳細が表示されることを確認する。

### 設計資料を追加・更新した場合

- `design/docs/` 配下のファイル名が日本語ベースになっていることを確認する。
- `README.md` の設計資料一覧、説明、リンクを更新する。
- 設計ポータルに関わる資料を更新した場合は、`design/portal/` と `design/metadata/` の前提と矛盾しないことを確認する。

### 文言を変更した場合

- 表示文言は `frontend/js/constants/strings.js` に集約する。
- HTML文字列へ直接文言を埋め込まない。
- ポータル上のプレビューでも同じ文言が表示されることを確認する。

### Mock ViewModelを変更した場合

- `frontend/js/mocks/` と、必要に応じて `frontend/js/utils/ledgerCalculations.js` を更新する。
- `design/metadata/screenRegistry.js` が参照するmockに破綻がないことを確認する。
- frontend本体と設計ポータルの両方で同じ画面が描画できることを確認する。

### CSSを変更・分割した場合

- `frontend/css/app.css` のimport順を確認する。
- `design/portal/index.html` は `../../frontend/css/app.css` を参照しているため、frontendのCSS変更がポータルプレビューにも反映される。
- ポータル側固有のレイアウト変更だけが必要な場合は `design/portal/css/portal.css` に閉じる。
- デザイン値をmetadataへ転記しない。

## 動作確認

ローカルサーバーを起動する。

```sh
python3 -m http.server --bind 127.0.0.1 --directory . 4174
```

確認URL:

```text
Frontend:
http://127.0.0.1:4174/frontend/index.html

Design Portal:
http://127.0.0.1:4174/design/portal/index.html
```

最低限、以下を確認する。

- frontendの対象routeが描画できる。
- design portalの画面一覧から対象画面をプレビューできる。
- 対象コンポーネントクリックでComponent詳細が表示される。
- `data-action-uid` 付き要素クリックでAction詳細が表示される。
- Computed Style欄にCSS値が表示される。

## PR作成ルール

### PRサマリーに含める内容

- チェック結果や作業に不足している可能性がある場合は、PRサマリーの冒頭に警告として不足内容、未確認項目、理由を記載する。
- 変更目的を記載する。
- 変更範囲を記載する。
- 主な変更内容を記載する。
- Frontend と Design Portal の同期状況を記載する。
- 動作確認結果を記載する。
- 更新した設計資料を記載する。
- 未対応事項や制約を記載する。

### PR発行時にチェックする内容

- `frontend/` 配下を変更した場合、同じ変更が `design/portal/` から確認できること。
- 変更種別ごとの確認事項に該当するファイル、metadata、設計資料が更新されていること。
- 設計資料を追加・更新した場合、`README.md` の設計資料一覧、説明、リンクが更新されていること。
- 表示文言を変更した場合、`frontend/js/constants/strings.js` に集約されていること。
- Mock ViewModelを変更した場合、`frontend/js/mocks/` と計算系utils、metadataの参照に破綻がないこと。
- CSSを変更・分割した場合、`frontend/css/app.css` のimport順とDesign Portalへの反映に問題がないこと。
- CSSの設計値をmetadataへ転記していないこと。
- `prototype/` が参照用途として扱われ、実装対象として不要に変更されていないこと。
- React / Vue / Angular / TypeScript / Tailwind CSS / Vite / Next.js などを導入していないこと。
- ローカルサーバーでfrontend本体とDesign Portalの対象画面を確認していること。
- 対象コンポーネントとActionの詳細がDesign Portalで表示されること。
- Computed Style欄にCSS値が表示されること。
- PR差分に不要なファイル、生成物、一時ファイル、個人環境由来の変更が含まれていないこと。
- 変更内容とPRサマリーの説明が一致していること。
- 未実施のチェックや不確かな項目がある場合、PRサマリー冒頭の警告に記載されていること。

## 今後の追記ルール

- 新しい作業領域のルールを追加する場合は、目次に章を追加する。
- 既存領域の詳細を追加する場合は、該当章に小見出しを追加する。
- チェックリストは「何を変更するか」ではなく「何を確認するか」を中心に書く。
- 特定ファイルに依存するルールは、対象ファイルパスを明記する。
- 一時的な作業メモや個人環境だけの事情は書かない。
