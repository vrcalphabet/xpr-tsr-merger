import { TsrTypes } from '../common';
import TransConverter from '../trans/TransConverter';
import FileMerger from './FileMerger';
import JsonFormatter from './JsonFormatter';

export default class TransMerger extends FileMerger {
  public static merge(dirPath: string, directories: string[], pretty: boolean): string {
    const data = FileMerger.readFileInFolders<TsrTypes.TsrEntry>(
      dirPath,
      directories,
      'trans.json',
      TransConverter
    );
    return this.stringify(data, pretty);
  }

  private static stringify(data: TsrTypes.TsrEntry[], pretty: boolean): string {
    return JsonFormatter.stringify(Object.fromEntries(data), pretty);
  }
}
