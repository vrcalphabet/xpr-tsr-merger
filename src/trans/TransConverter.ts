import Console from '../common/Console';
import * as TsrTypes from '../common/Tsr';

export default class TransConverter {
  /**
   * `trans.json`を[フォルダ名, trans.json]に変換します。
   * @param input 変換するJSON形式の文字列
   * @param directory フォルダ名
   * @returns 変換されたエントリ、構文エラーが発生した場合はnull
   */
  public static convert(input: string, directory: string): TsrTypes.TsrEntry | null {
    try {
      // 翻訳ソースを小文字にするため、一旦JSON.parseする必要がある
      const tsr = JSON.parse(input);
      this.recursive(tsr);
      return [directory.toUpperCase(), tsr] satisfies TsrTypes.TsrEntry;
    } catch (e) {
      Console.error(`フォルダ'${directory}'の\`trans.json\`の構文が不正です。`);
      return null;
    }
  }

  private static recursive(tsr: TsrTypes.Tsr): void {
    for (const prop in tsr) {
      if (typeof tsr[prop] === 'string') {
        const source = prop.trim().toLowerCase();
        const trans = tsr[prop];
        delete tsr[prop];
        tsr[source] = trans;
      } else {
        this.recursive(tsr[prop]);
      }
    }
  }
}
