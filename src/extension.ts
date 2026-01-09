import * as vscode from "vscode";
import { TranslationService } from "./translationService";
import { HoverProvider } from "./hoverProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log("🚀 Korean Translator Extension Activated! (Real Mode)");

  const translationService = new TranslationService();
  translationService.clearCache();

  const hoverProvider = new HoverProvider(translationService);

  // [핵심] 가장 단순하고 강력한 연결 방식 (Simple Mode)
  // scheme이나 패턴을 따지지 않고, 언어 ID가 맞으면 무조건 실행합니다.
  const hoverDisposable = vscode.languages.registerHoverProvider(
    ['python', 'javascript', 'typescript', 'vue', 'html'], 
    hoverProvider
  );

  console.log("✅ Real Hover Provider Registered!");

  // 2. 단축키 명령어 등록
  const translateCommand = vscode.commands.registerCommand(
    "korean-translator.translateSelection",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;

      const selection = editor.selection;
      const text = editor.document.getText(selection);
      let wordRange: vscode.Range;
      let targetText: string;

      if (!text) {
        const wordRangeAtPosition = editor.document.getWordRangeAtPosition(
          selection.start
        );
        if (!wordRangeAtPosition) return;
        wordRange = wordRangeAtPosition;
        targetText = editor.document.getText(wordRange);
      } else {
        wordRange = new vscode.Range(selection.start, selection.end);
        targetText = text;
      }

      const translation = await translationService.translate(targetText);
      await showInlineTranslation(editor, wordRange, targetText, translation);
    }
  );

  // 3. 토글 명령어
  const toggleCommand = vscode.commands.registerCommand(
    "korean-translator.toggle",
    () => {
      const config = vscode.workspace.getConfiguration("korean-translator");
      const enabled = config.get("enabled", true);
      config.update("enabled", !enabled, true);

      vscode.window.showInformationMessage(
        `Korean Translator: ${!enabled ? "Enabled" : "Disabled"}`
      );
    }
  );

  // 나머지 명령어들 (캐시 관리 등)
  const cacheStatusCommand = vscode.commands.registerCommand("korean-translator.cacheStatus", () => {
      translationService.logCacheStatus();
      vscode.window.showInformationMessage("Cache status logged to console");
  });

  const clearCacheCommand = vscode.commands.registerCommand("korean-translator.clearCache", () => {
      translationService.clearCache();
      vscode.window.showInformationMessage("Translation cache cleared!");
  });
  
  const setupGPTCommand = vscode.commands.registerCommand("korean-translator.setupGPT", async () => {
      const config = vscode.workspace.getConfiguration("korean-translator");
      const apiKey = config.get<string>("openaiApiKey", "");
      if (!apiKey || apiKey.trim() === "") {
        vscode.window.showWarningMessage("⚠️ OpenAI API 키가 설정되지 않았습니다.");
        return;
      }
      vscode.window.showInformationMessage("✅ GPT 설정 완료! 재시작합니다...");
      setTimeout(() => { vscode.commands.executeCommand("workbench.action.reloadWindow"); }, 2000);
  });

  context.subscriptions.push(
    hoverDisposable,
    translateCommand,
    toggleCommand,
    cacheStatusCommand,
    clearCacheCommand,
    setupGPTCommand
  );
}

// 인라인 번역 표시 함수
async function showInlineTranslation(
  editor: vscode.TextEditor,
  range: vscode.Range,
  originalText: string,
  translation: string
) {
  const decorationType = vscode.window.createTextEditorDecorationType({
    after: {
      contentText: ` → ${translation}`,
      color: "#00ff00",
      fontStyle: "italic",
      fontWeight: "bold",
      margin: "0 0 0 10px",
    },
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
  });

  editor.setDecorations(decorationType, [range]);
  setTimeout(() => { decorationType.dispose(); }, 3000);
}

export function deactivate() {}