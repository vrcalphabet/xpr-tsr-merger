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
      // jsonの構文が正しいかを確認するため、一旦JSON.parseする必要がある
      return [directory.toUpperCase(), JSON.parse(input)] satisfies TsrTypes.TsrEntry;
    } catch (e) {
      Console.error(`フォルダ'${directory}'の\`trans.json\`の構文が不正です。`);
      return null;
    }
  }
}
