## VS Code Korean Translator (Lightweight Edition)

Note: 본 프로젝트는 Original Repository Name의 작업을 기반으로 하드 포크(Hard-fork)된 결과물입니다.
원본 프로젝트의 아키텍처를 기반으로 하되, 응답 지연 시간(Latency) 최소화 및 특정 개발 환경에 대한 최적화를 목적으로 재설계되었습니다.

VS Code 환경에서 영문 주석, 변수명, 그리고 Python Docstring을 한국어로 번역하는 기능을 제공하는 확장 프로그램입니다.

## 🎯 개발 배경 및 주요 수정 사항 (Project Context & Modifications)

본 프로젝트는 원본 리포지토리의 기능을 바탕으로, 특정 개발 환경에서의 요구 사항을 충족하고 성능을 효율화하기 위해 수정되었습니다.

1. 아키텍처 경량화 및 최적화 (Architectural Streamlining)

- 원본 프로젝트에 적용된 전략 패턴(Strategy Pattern)은 다수의 번역 엔진을 지원하는 높은 확장성을 제공합니다.

- 본 수정판은 DeepL API 단일 엔진에 집중하여 구조를 단순화함으로써, 실행 시 발생하는 오버헤드(Overhead)를 절감하고 코드의 직관성을 확보하였습니다.

2. Python Docstring 지원 확장 (Enhanced Documentation Support)

- Python 개발 환경에서 빈번히 사용되는 멀티라인 Docstring("""...""")의 인식률을 제고하기 위해, 전역 정규 표현식(Global RegExp) 스캔 방식을 도입하여 번역 적용 범위를 확장하였습니다.

## 🛠️ 설치 및 환경 설정 (Installation & Configuration)

본 확장 프로그램의 사용을 위해서는 DeepL API Key가 요구됩니다. 설치 및 설정 절차는 다음과 같습니다.

1. 리포지토리 클론 (Clone Repository)

```
git clone [https://github.com/YOUR_GITHUB_ID/vscode-korean-translator.git](https://github.com/YOUR_GITHUB_ID/vscode-korean-translator.git)
cd vscode-korean-translator
npm install
```

2. API Key 보안 설정 (Security Configuration)

- 보안상의 이유로 API Key는 소스 코드에 직접 포함되지 않도록 관리합니다.

- src/ 디렉터리 내에 secrets.ts 파일을 생성하고, 아래의 양식에 따라 키를 입력해 주십시오.

```
// src/secrets.ts
export const DEEPL_API_KEY = "YOUR_DEEPL_API_KEY_HERE:fx";
```

3. 빌드 및 실행 (Build & Run)

```
npm run compile
F5 (VS Code Debugging)
```

## 📖 주요 기능 (Key Features)

- 스마트 호버 (Smart Hover): Python, JS/TS 파일 내 주석에 마우스 커서를 위치시킬 경우, 해당 영문 텍스트에 대한 한국어 번역을 제공합니다.

- 선택 영역 번역 (Manual Translation): 텍스트를 선택한 후 Ctrl + Shift + T 단축키를 입력하면 즉시 번역 기능을 수행합니다.

## ⚖️ 라이선스 (License)

본 프로젝트는 MIT 라이선스 하에 배포됩니다. 원본 프로젝트의 저작권 및 라이선스 규정을 준수합니다.