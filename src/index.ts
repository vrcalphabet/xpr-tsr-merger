import * as vscode from 'vscode';
import Console from './common/Console';
import IndexReader from './utils/IndexReader';
import DirectoryFilter from './utils/DirectoryFilter';
import HashGenerator from './utils/HashGenerator';
import RuleMerger from './utils/RuleMerger';
import TransMerger from './utils/TransMerger';
import FileManager from './utils/FileManager';

export function activate() {
  vscode.commands.registerCommand('extension.mergeXprAndTsrFiles', async () => {
    try {
      const editor = vscode.window.activeTextEditor!;
      const indexPath = editor.document.uri.fsPath;
      const index = IndexReader.read(indexPath);
      const directories = DirectoryFilter.get(index);

      const ruleOldHash = await HashGenerator.generateFromFile(index.output, 'rule.json');
      const transOldHash = await HashGenerator.generateFromFile(index.output, 'trans.json');

      const rule = RuleMerger.merge(index.input, directories, index.pretty);
      const trans = TransMerger.merge(index.input, directories, index.pretty);

      const ruleNewHash = HashGenerator.generate(rule);
      const transNewHash = HashGenerator.generate(trans);

      const isRuleChanged = ruleOldHash !== ruleNewHash;
      const isTransChanged = transOldHash !== transNewHash;

      if (isRuleChanged || isTransChanged) {
        const timestamp = Date.now().toString();

        FileManager.writeFile([index.output, 'rule.json'], rule);
        FileManager.writeFile([index.output, 'trans.json'], trans);
        FileManager.writeFile([index.output, 'lastUpdate.txt'], timestamp);

        Console.log('統合が完了しました');
      } else {
        Console.log('更新の必要はありません');
      }
    } catch (e: any) {
      Console.error(e.stack);
    }
  });
}

export function deactivate() {}
