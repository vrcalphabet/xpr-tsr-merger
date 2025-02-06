import * as XprTypes from '../common/Xpr';
import XprBuilder from './XprBuilder';
import XprTokenizer from './XprTokenizer';

/** .xprファイルをjsonに変換するクラス */
export default class XprConverter {
  public static convert(input: string): XprTypes.XprGroup | null {
    const tokens = XprTokenizer.tokenize(input);
    return XprBuilder.buildTree(tokens);
  }
}
