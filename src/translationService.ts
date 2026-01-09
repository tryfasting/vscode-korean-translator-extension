import axios from "axios";
import { DEEPL_API_KEY } from "./secrets";

export class TranslationService {
  private cache: Map<string, string> = new Map();

  constructor() {}

  async translate(text: string): Promise<string> {
    if (!text || !text.trim()) return "";

    if (this.cache.has(text)) {
      return this.cache.get(text)!;
    }

    // [수정] 복잡한 설정 로직 제거하고 상수 직접 사용
    const apiKey = DEEPL_API_KEY;

    if (!apiKey || apiKey.trim() === "" || apiKey.includes("여기에_발급받은")) {
      return "DeepL API 키가 설정되지 않았습니다 (secrets.ts 확인 필요)";
    }

    try {
      const isFreeTier = apiKey.endsWith(":fx");
      const baseUrl = isFreeTier 
        ? "https://api-free.deepl.com/v2/translate" 
        : "https://api.deepl.com/v2/translate";

      const response = await axios.post(
        baseUrl,
        {
            text: [text],
            target_lang: "KO"
        },
        {
          headers: {
            'Authorization': `DeepL-Auth-Key ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      );

      if (response.data && response.data.translations && response.data.translations[0]) {
        const translatedText = response.data.translations[0].text;
        this.cache.set(text, translatedText);
        return translatedText;
      }

    } catch (error: any) {
      console.error("DeepL Translation Failed:", error);
      if (error.response?.status === 403) {
        return "API 키 오류 (secrets.ts 확인)";
      }
      return `${text} (번역 실패)`;
    }

    return text;
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public logCacheStatus(): void {
    console.log(`Cache Size: ${this.cache.size}`);
  }

  public extractEnglishFromComment(comment: string): string {
    return comment
      .replace(/^\/\/\s*/, "")        
      .replace(/^\/\*\*?\s*/, "")     
      .replace(/\*\/\s*$/, "")        
      .replace(/^\*\s*/gm, "")        
      .replace(/^['"]{3}/, "")        
      .replace(/['"]{3}$/, "")        
      .trim();
  }
}