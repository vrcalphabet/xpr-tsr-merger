import { IndexDefinition } from '../common/IndexDefinition';
import FileManager from './FileManager';

export default class DirectoryFilter {
  /**
   * パス直下のディレクトリから、隠しフォルダと`ignore`で除いたフォルダを除いたものを返します。
   * @param index インデックスファイル
   * @returns パス直下のディレクトリ
   */
  public static get(index: IndexDefinition): Array<string> {
    const directories = FileManager.directories(index.input);
    return directories.filter(
      (directory) => !directory.startsWith('.') && !index.ignore.includes(directory)
    );
  }
}
