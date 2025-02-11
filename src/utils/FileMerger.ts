import FileManager from './FileManager';

export default class FileMerger {
  /**
   * 各フォルダの特定のファイルを読み込み、変換したものを返します。
   * @param dirPath ディレクトリパス
   * @param directories ディレクトリの名前
   * @param fileName ファイル名
   * @param converter コンバータ
   * @returns 各ファイルをコンバータを通して変換されたもの
   */
  public static readFileInFolders<T>(
    dirPath: string,
    directories: string[],
    fileName: string,
    converter: any
  ): T[] {
    const result: T[] = [];

    for (const directory of directories) {
      const filePath = FileManager.join(dirPath, directory, fileName);

      const content = FileManager.readFile(filePath);
      if (content === null) {
        throw new Error(`'/${directory}'に\`${fileName}\`が存在しません`);
      }

      const convertedContent = converter.convert(content, directory);
      if (convertedContent === null) {
        throw new Error(`\`/${directory}/${fileName}\`でエラーが発生しました`);
      }
      result.push(convertedContent);
    }

    return result;
  }
}
