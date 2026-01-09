import * as vscode from "vscode";
import { TranslationService } from "./translationService";

export class HoverProvider implements vscode.HoverProvider {
  private lastHoverTime = 0;
  private lastHoverText = "";

  constructor(private translationService: TranslationService) {}

  async provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): Promise<vscode.Hover | null> {
    
    // 1. 설정 확인
    const config = vscode.workspace.getConfiguration("korean-translator");
    if (!config.get("enabled", true)) return null;

    // 2. 주석 범위 감지 (개선된 로직)
    const commentRange = this.getCommentRangeAtPosition(document, position);

    if (commentRange) {
      const commentText = document.getText(commentRange);
      
      // 주석 기호 제거
      const englishText = this.translationService.extractEnglishFromComment(commentText);

      if (englishText) {
        // 속도 최적화 (50ms)
        if (!this.shouldTranslate(englishText, 50)) return null;

        const translation = await this.translationService.translate(englishText);
        return this.createHoverMarkdown(englishText, translation, "주석/Docstring");
      }
    }

    // 3. (주석이 아닐 때만) 변수명/함수명 감지
    const wordRange = document.getWordRangeAtPosition(position);
    if (wordRange) {
      const word = document.getText(wordRange);

      // 영어 단어이고 3글자 이상인 경우
      if (this.isEnglishWord(word) && word.length >= 3) {
        if (!this.shouldTranslate(word, 100)) return null;
        
        const translation = await this.translationService.translate(word);
        if (translation !== word) {
          return this.createHoverMarkdown(word, translation, "변수/함수명");
        }
      }
    }

    return null;
  }

  /**
   * 주석 범위 탐지 로직 (Global Regex)
   */
  private getCommentRangeAtPosition(
    document: vscode.TextDocument, 
    position: vscode.Position
  ): vscode.Range | null {
    const docText = document.getText();
    const offset = document.offsetAt(position);

    // 정규식: """...""" | '''...''' | #... | //... | /*...*/
    const regex = /("""[\s\S]*?"""|'''[\s\S]*?'''|#[^\n]*|\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g;

    let match;
    while ((match = regex.exec(docText)) !== null) {
        const start = match.index;
        const end = match.index + match[0].length;

        // 현재 커서(offset)가 이 주석 범위 안에 포함되는지 확인
        if (offset >= start && offset <= end) {
            return new vscode.Range(
                document.positionAt(start),
                document.positionAt(end)
            );
        }
    }

    return null;
  }

  // 디바운싱 체크
  private shouldTranslate(text: string, delay: number = 300): boolean {
    const now = Date.now();
    
    if (this.lastHoverText === text && now - this.lastHoverTime < delay) {
      return false;
    }

    this.lastHoverTime = now;
    this.lastHoverText = text;
    return true;
  }

  private isEnglishWord(word: string): boolean {
    return /^[a-zA-Z][a-zA-Z0-9]*$/.test(word);
  }

  private createHoverMarkdown(original: string, translation: string, type: string): vscode.Hover {
    const markdown = new vscode.MarkdownString();
    markdown.appendMarkdown(`**🇰🇷 ${type} 번역**\n\n`);
    markdown.appendMarkdown(`${translation}\n\n`); 
    markdown.isTrusted = true;
    return new vscode.Hover(markdown);
  }
}