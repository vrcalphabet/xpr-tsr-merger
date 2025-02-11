import { XprTypes } from '../common';
import XprConverter from '../xpr/XprConverter';
import FileMerger from './FileMerger';
import JsonFormatter from './JsonFormatter';

export default class RuleMerger extends FileMerger {
  public static merge(dirPath: string, directories: string[], pretty: boolean): string {
    const data = FileMerger.readFileInFolders<XprTypes.XprGroup>(
      dirPath,
      directories,
      'rule.xpr',
      XprConverter
    );
    return this.stringify(data, pretty);
  }

  private static stringify(data: XprTypes.Xpr, pretty: boolean): string {
    return JsonFormatter.stringify(data, pretty);
  }
}
