import fs from 'fs';
import path from 'path';

export default class FileManager {
  /**
   * パスからファイル名を取得します。
   * @param filePath ファイルパス
   * @returns ファイル名
   */
  public static fileName(filePath: string): string {
    return path.basename(filePath);
  }

  /**
   * パスからファイルを除いたディレクトリパスを取得します。
   * @param filePath ファイルパス
   * @returns ディレクトリパス
   */
  public static dirPath(filePath: string): string {
    return path.extname(filePath) ? path.dirname(filePath) : filePath;
  }

  /**
   * パスを結合します。
   * @param path 結合するパス
   * @returns 結合されたパス
   */
  public static join(...paths: string[]): string {
    return path.join(...paths);
  }

  /**
   * パス直下のディレクトリを取得します。
   * @param filePath ファイルパス
   * @returns ディレクトリの名前
   */
  public static directories(filePath: string): string[] {
    const dirPath = this.dirPath(filePath);
    return fs
      .readdirSync(dirPath)
      .filter((directory) => fs.statSync(this.join(dirPath, directory)).isDirectory());
  }

  /**
   * ファイルが存在するかを確認します。
   * @param filePath ファイルのパス
   * @returns true: 存在する場合、false: 存在しない場合
   */
  public static isFileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  /**
   * ディレクトリが存在しない場合にディレクトリを作成します。
   * @param dirPath ディレクトリパス
   */
  public static makeDir(dirPath: string): void {
    const dir = path.dirname(dirPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * 指定されたファイルパスからストリームを読み込み、データ処理と終了処理を実行します。
   * @param filePath 読み込むファイルのパス
   * @param initialValue データ処理の初期値
   * @param onDataHandler ストリームデータ受信時の処理関数
   * @param onDataHandler.chunk 受信したデータ
   * @param onEndHandler ストリーム終了時の処理関数
   * @returns Promise<T> ストリーム終了時の処理関数の戻り値
   */
  public static async readFileAsStream<T>(
    filePath: string,
    onDataHandler: (chunk: Buffer | string) => void,
    onEndHandler: () => T
  ): Promise<T> {
    return new Promise((resolve) => {
      const stream = fs.createReadStream(filePath);
      stream.on('data', (stream) => onDataHandler(stream));
      stream.on('end', () => resolve(onEndHandler()));
    });
  }

  /**
   * 指定したパスのファイルの内容を取得します。
   *
   * **注: ファイルが存在するかを確認するためにこのメソッドを使用しないでください。**
   * @param filePath 内容を取得するファイルのパス
   * @returns ファイルの中身。ファイルが存在しない場合はnull
   */
  public static readFile(filePath: string): string | null {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      // ファイルが存在しない場合
      return null;
    }
  }

  /**
   * 指定したファイルに内容を書き込みます。
   * @param filePath 書き込むファイルのパス
   * @param content 内容
   * @returns 正常に書き込めればtrue、書き込めなければfalse
   */
  public static writeFile(filePath: string | Array<string>, content: string): boolean {
    try {
      // [a].flat() => aがstringでもstring[]であっても常にstring[]で扱う
      filePath = this.join(...[filePath].flat());
      // ディレクトリが存在しない場合はディレクトリを作成
      this.makeDir(filePath);
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    } catch (error) {
      return false;
    }
  }
}
