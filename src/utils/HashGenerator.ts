import crypto from 'crypto';
import FileManager from './FileManager';

export default class HashGenerator {
  /**
   * ファイルの内容からMD5を生成します。\
   * ファイルが存在しない場合は空文字をMD5にした値を返します。
   * @param paths ファイルパス
   * @returns ファイルの内容のMD5値
   */
  public static async generateFromFile(...paths: string[]): Promise<string> {
    const filePath = FileManager.join(...paths);
    const hash = crypto.createHash('md5');

    // ファイルが存在しない場合は空文字をMD5にした値を返す
    if (!FileManager.isFileExists(filePath)) {
      return Promise.resolve(hash.digest('hex'));
    }

    return FileManager.readFileAsStream(
      filePath,
      (chunk) => hash.update(chunk),
      () => hash.digest('hex')
    );
  }

  /**
   * 文字列からMD5を生成します。
   * @param data 文字列
   * @returns 文字列のMD5値
   */
  public static generate(data: string) {
    const hash = crypto.createHash('md5');
    return hash.update(data).digest('hex');
  }
}
