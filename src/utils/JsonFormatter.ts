export default class JsonFormatter {
  /**
   * オブジェクトをJSON文字列に変換します。
   * @param json 変換対象のデータ
   * @param pretty インデントをするか
   * @returns JSON文字列
   */
  public static stringify(json: any, pretty: boolean): string {
    if (pretty) {
      return JSON.stringify(json, null, 2);
    } else {
      return JSON.stringify(json);
    }
  }
}
