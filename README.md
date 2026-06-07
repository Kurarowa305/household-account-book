# 家計簿アプリケーション

`frontend/` がアプリ本体、`design/portal/` が画面・コンポーネント・Actionのメタデータを確認する設計ポータルです。

## 起動方法

リポジトリルートでローカルサーバーを起動します。

```sh
python3 -m http.server --bind 127.0.0.1 --directory . 4174
```

起動後、以下のURLを開きます。

- Frontend: http://127.0.0.1:4174/frontend/index.html
- Design Portal: http://127.0.0.1:4174/design/portal/index.html

詳細は [ローカルサーバー起動方法](design/docs/ローカルサーバー.md) を参照してください。

## 設計ポータル

[Design Portal](design/portal/index.html) は、`frontend/js/pages/` の描画関数を直接読み込み、実装中の画面をプレビューします。

左ペインで画面を選択し、中央ペインで画面を確認します。プレビュー内の要素をクリックすると、右ペインにScreen、Component、Action、Computed Styleの詳細が表示されます。

## 設計資料

- [要件](design/docs/要件.md): 家計簿アプリケーションの機能要件と将来要件。
- [画面設計](design/docs/画面設計.md): 対象画面、hash route、画面描画方針、コンポーネント管理方針、Action管理方針。
- [設計ポータル](design/docs/設計ポータル.md): 設計ポータルの3ペイン構成、プレビュー、インスペクタ、Computed Style表示。
- [ローカルサーバー起動方法](design/docs/ローカルサーバー.md): ローカルHTTPサーバーの起動、確認URL、停止方法。

## テスト資料

- [フロントエンドテスト観点](docs/test/フロントエンドテスト観点.md): 現状の画面実装、mock ViewModel、Action、Design Portal同期をCIで確認するためのテスト観点。

## テスト実行

優先度P0のフロントエンドテストを実行します。

```sh
npm run test:frontend:p0
```

## ディレクトリ構成

```text
frontend/          アプリ本体
docs/test/         テスト観点
design/docs/       設計資料
design/metadata/   設計ポータルが参照するScreen/Component/Action registry
design/portal/     設計ポータル
prototype/         参照用プロトタイプ
```

## 開発ルール

作業ルールは [AGENTS.md](AGENTS.md) を参照してください。
