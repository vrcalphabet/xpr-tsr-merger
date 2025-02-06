import * as vscode from 'vscode';
import path from 'path';
import Console from './common/Console';
import { IndexDefinition } from './common/IndexDefinition';
import IndexValidator from './common/IndexValidator';
import FileReader from './common/FileReader';
import XprConverter from './xpr/XprConverter';
import * as XprTypes from './common/Xpr';

/** .xprファイルと翻訳定義ファイルをそれぞれ統合するクラス */
export default class MergeFiles {
  /** アクティブなテキストエディタ */
  private editor!: vscode.TextEditor;
  /** `index.json`のパス */
  private indexFilePath: string = '';
  /** `index.json`の内容 */
  private index!: IndexDefinition;
  /** 入力フォルダ名の配列 */
  private directories!: Array<string>;
  /** 入力フォルダのパス */
  private inputPath: string = '';
  /** 出力フォルダのパス */
  private outputPath: string = '';

  /** シングルトンのインスタンス */
  private static readonly INSTANCE = new MergeFiles();
  private constructor() {}

  /** インスタンスを取得します */
  public static getInstance(): MergeFiles {
    return this.INSTANCE;
  }

  /**
   * .xprファイルと翻訳定義ファイルをそれぞれ統合します。
   */
  public merge(): void {
    let success;
    success = this.setActiveEditor();
    if (!success) return;
    success = this.setIndex();
    if (!success) return;
    success = this.setPath();
    success = this.mergeRule();
    if (!success) return;
    success = this.mergeTrans();
    if (!success) return;
    success = this.updateTimestamp();
    if (!success) return;
    Console.log('統合が完了しました');
  }

  /**
   * `index.json`の内容を設定します。
   * @returns 設定に成功したか
   */
  private setIndex(): boolean {
    this.indexFilePath = this.editor.document.uri.fsPath;
    /** ファイル名 */
    const fileName = path.basename(this.indexFilePath);
    if (fileName !== 'index.json') {
      Console.error('`index.json`を開いた上で実行してください');
      return false;
    }

    /** index.jsonファイルの中身 */
    const index = this.getIndex(this.indexFilePath);
    if (index === null) return false;

    this.index = index;
    return true;
  }

  /**
   * `index.json`の内容から入力ファイルと出力ファイルのパスを設定します。
   */
  private setPath(): void {
    /** index.jsonが存在するフォルダパス */
    const basePath = path.dirname(this.indexFilePath);

    const directories = FileReader.getSubdirectories(basePath);
    this.directories = this.filterDirectories(directories);

    this.inputPath = path.join(basePath, this.index.input);
    this.outputPath = path.join(basePath, this.index.output);
  }

  /**
   * ignoreに含まれているフォルダと隠しフォルダを除外します。
   * @param directories ディレクトリのフォルダ名の配列
   * @returns 特定のフォルダが除外されたフォルダ名の配列
   */
  private filterDirectories(directories: Array<string>): Array<string> {
    return directories.filter((directory) => {
      return !this.index.ignore.includes(directory) && !directory.startsWith('.');
    });
  }

  /**
   * アクティブなエディターを設定します。
   * @returns 設定に成功したか
   */
  private setActiveEditor(): boolean {
    /** アクティブなテキストエディタ */
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor === undefined) {
      /* コマンドを実行するにはテキストエディタをアクティブにしなければいけないため、
         通常はこの処理に入ることはない */
      Console.error('アクティブなテキストエディタが見つかりません');
      return false;
    }

    this.editor = activeEditor;
    return true;
  }

  /**
   * `index.json`の内容をバリデートした上で取得します。
   * @param path `index.json`のパス
   * @returns バリデートした`index.json`の内容。バリデートに失敗した場合はnull
   */
  private getIndex(path: string): IndexDefinition | null {
    // index.jsonの中身を取得
    const index = FileReader.readFileContent(path);
    if (index === null) return null;

    // スキーマを検証
    const validatedIndex = IndexValidator.validate(index);
    if (validatedIndex === null) return null;

    return validatedIndex;
  }

  /**
   * basePath直下のディレクトリの全てのrule.xprを統合し、rule.jsonを作成します。
   * @returns 正常に書き込めたか
   */
  private mergeRule(): boolean {
    /** 各rule.xprファイルの配列 */
    const files = this.readRule();
    if (files === null) return false;

    /** フォーマットされたjson */
    const content = this.stringifyJSON(files);
    return this.writeFile('rule.json', content);
  }

  /**
   * 指定したフォルダ内の全てのrule.xprファイルを読み込みます。
   * @returns rule.xprファイルの配列、エラーの場合はnull
   */
  private readRule(): XprTypes.Xpr | null {
    /** 各rule.xprファイルの配列 */
    const files = FileReader.readFileInFolders(
      this.inputPath,
      this.directories,
      'rule.xpr',
      (content, folder) => {
        if (content === null) {
          Console.error(`フォルダ ${folder} に \`trans.json\` が存在しません`);
          return null;
        }
        return XprConverter.convert(content);
      }
    ) as XprTypes.Xpr | null;

    if (files === null) return null;
    return files;
  }

  /**
   * ファイルを出力します。
   * @param fileName ファイル名
   * @param content ファイルの内容
   * @returns 正常に書き込めたか
   */
  private writeFile(fileName: string, content: string): boolean {
    const rulePath = path.join(this.outputPath, fileName);
    const success = FileReader.writeFileContent(rulePath, content);
    if (!success) {
      Console.error(`\`${fileName}\`に書き込めませんでした`);
    }
    return success;
  }

  /**
   * basePath直下のディレクトリの全てのtrans.jsonを統合し、新たなtrans.jsonを作成します。
   * @returns 正常に書き込めたか
   */
  private mergeTrans(): boolean {
    const files = this.readTrans();
    if (files === null) return false;

    const content = this.stringifyJSON(files);
    return this.writeFile('trans.json', content);
  }

  /**
   * 指定したフォルダ内の全てのtrans.jsonファイルを読み込みます。
   * @returns trans.jsonファイルの配列、エラーの場合はnull
   */
  private readTrans(): any {
    const files = FileReader.readFileInFolders(
      this.inputPath,
      this.directories,
      'trans.json',
      (content, folder) => {
        if (content === null) {
          Console.error(`フォルダ ${folder} に \`trans.json\` が存在しません`);
          return null;
        }
        try {
          return [folder, JSON.parse(content)];
        } catch (e) {
          Console.error(`フォルダ ${folder} の \`trans.json\` の構文が不正です。`);
          return null;
        }
      }
    );

    if (files === null) return null;
    return Object.fromEntries(files);
  }

  /**
   * 現在のタイムスタンプを出力します。
   * @returns 正常に出力できたか
   */
  private updateTimestamp(): boolean {
    return this.writeFile('lastUpdate.txt', Date.now().toString());
  }

  /**
   * オブジェクトをJSON文字列に変換します。
   * @param json 変換対象のデータ
   * @returns JSON文字列
   */
  private stringifyJSON(json: any): string {
    if (this.index.format) {
      return JSON.stringify(json, null, 2);
    } else {
      return JSON.stringify(json);
    }
  }
}
