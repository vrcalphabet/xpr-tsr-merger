import { IndexDefinition } from '../common/IndexDefinition';
import IndexValidator from './IndexValidator';
import FileManager from './FileManager';

export default class IndexReader {
  /**
   * ファイルパスから`index.json`の内容を取得し、バリデートしたものを返します。
   * @param filePath ファイルパス
   * @returns バリデートした`index.json`の内容
   */
  public static read(filePath: string): IndexDefinition {
    this.checkFileName(filePath);
    return this.readIndex(filePath);
  }

  /**
   * ファイル名が`index.json`であるかを確認し、そうでなければエラーを出します。
   * @param filePath ファイルパス
   */
  private static checkFileName(filePath: string): void {
    const fileName = FileManager.fileName(filePath);
    if (fileName !== 'index.json') {
      throw new Error('`index.json`を開いたうえで実行してください');
    }
  }

  /**
   * ファイルパスから`index.json`の内容を取得し、バリデートしたものを返します。
   * @param filePath ファイルパス
   * @returns バリデートした`index.json`の内容
   */
  private static readIndex(filePath: string): IndexDefinition {
    const index = FileManager.readFile(filePath);
    if (index === null) {
      throw new Error('`index.json`が見つかりません');
    }

    const validatedIndex = IndexValidator.validate(index);
    return this.setPath(filePath, validatedIndex);
  }

  /**
   * `input`と`output`を絶対パスに変換します。
   * @param filePath ファイルパス
   * @param index `index.json`の内容
   * @returns 絶対パスに変換された`index.json`の内容
   */
  private static setPath(filePath: string, index: IndexDefinition): IndexDefinition {
    const basePath = FileManager.dirPath(filePath);
    index.input = FileManager.join(basePath, index.input);
    index.output = FileManager.join(basePath, index.output);
    return index;
  }
}
