# xpr-tsr

.xpr ファイルと翻訳ファイルをそれぞれ統合するための拡張機能です。\
実行は`index.json`をフォーカスした上で、`extension.mergeXprAndTsrFiles`（翻訳用ファイルの統合）コマンドで行います。

`index.json`は以下のプロパティが設定可能です：

`input?: string` - 入力の相対的なフォルダパス。デフォルトは`./`です。\
`output?: string` - 出力先の相対的なフォルダパス。デフォルトは`./`です。\
`ignore?: string[]` - 無視する入力フォルダ名。パスではありません。デフォルトは`[]`です。\
`format?: boolean` - 出力される JSON をフォーマットするか。`true`の場合、半角スペース 2 つをインデントとしてフォーマットします。デフォルトは`false`で、minify されて出力されます。注: これはデバッグ用のオプションです。

ディレクトリ例：

```
out/
src/
- index.json
- home/
  - rule.xpr
  - trans.json
- settings/
  - rule.xpr
  - trans.json
```

各フォルダ内は`rule.xpr`と`trans.json`を配置します。前者は翻訳対象要素の xpath が定義されたファイル、後者は翻訳前テキストと翻訳後テキストの対応表を定義したファイルです。この 2 つのファイル名は変更してはいけません。\
このフォルダは、各ページごとや各機能ごとなどに分けることができます。

統合方法（例）：
`../out/`に出力したいため、`index.json`に以下を記述します。

```json
{
  "output": "../out/"
}
```

`index.json`を開きフォーカスした上で、`extension.mergeXprAndTsrFiles`（翻訳用ファイルの統合）を実行します。

`../out/`に統合された`rule.json`と`translations.json`、コマンドを実行した時間`lastUpdate.txt`が作成されます。
