import * as XprTypes from '../common/Xpr';
import XprBuilder from './XprBuilder';
import XprTokenizer from './XprTokenizer';

/** .xprファイルをjsonに変換するクラス */
export default class XprConverter {
  /**
   * xpr記法のテキストをオブジェクトに変換します。
   * @param input
   * @param _directory 使用しません
   * @returns 変換されたオブジェクト
   */
  public static convert(input: string, _directory: string): XprTypes.XprGroup | null {
    const tokens = XprTokenizer.tokenize(input);
    return XprBuilder.buildTree(tokens);
  }
}
