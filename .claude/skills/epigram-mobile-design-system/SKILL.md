---
name: epigram-mobile-design-system
description: Use this skill when styling or building any UI component, screen, or layout for the Epigram mobile app (React Native + Expo + NativeWind). Contains design tokens (colors, typography, spacing, radius), component specs with Props signatures matching the web project, and mobile-native UX patterns (touch targets, gestures, bottom sheets). Reference this whenever implementing screens, components, or applying styles.
---

# Epigram Mobile Design System

Epigram 웹 프로젝트(Next.js 15 + Tailwind v4)에서 추출한 디자인 토큰과 컴포넌트 스펙을, React Native + Expo SDK 54 + NativeWind v4 + Tailwind 3.4 환경에 맞게 변환한 자기완결적 디자인 시스템이다.

## 언제 이 스킬을 쓰는가

- 새 화면을 만들거나 기존 화면을 수정할 때
- shared/ui 컴포넌트를 구현할 때 (Button, Input, Modal 등)
- 색·타입·간격·라디우스 같은 디자인 토큰을 적용할 때
- 모바일 UX 패턴(바텀시트, Pull-to-refresh, 터치 영역 등)을 적용할 때

## 파일 구성

| 파일 | 용도 |
|---|---|
| `SKILL.md` | 이 파일 — 전체 개요와 사용 순서 |
| `tokens.ts` | `tailwind.config.js`의 `theme.extend`에 바로 spread할 수 있는 NativeWind 토큰 |
| `tokens.json` | 순수 데이터(JSON). 비개발 도구나 다른 자동화에서 참고용 |
| `components.md` | shared/ui 컴포넌트 변환 스펙 (Props + variant + NativeWind 클래스 예시) |
| `patterns.md` | 모바일 UX 패턴 (터치 영역, 제스처, 바텀시트, 네비게이션, 애니메이션) |

## 사용 순서 (Claude Code가 UI 작업 시작 시)

1. **`tokens.ts` 먼저 읽고** 프로젝트 `tailwind.config.js`에 병합한다.
   ```ts
   // tailwind.config.js
   import { colors, fontSize, spacing, borderRadius, fontFamily } from "./src/shared/config/tokens";
   module.exports = {
     content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
     presets: [require("nativewind/preset")],
     theme: {
       extend: { colors, fontSize, spacing, borderRadius, fontFamily },
     },
   };
   ```
2. **`components.md`에서 필요한 컴포넌트 스펙을 확인**하고 `src/shared/ui/`에 구현한다.
3. **`patterns.md`를 참고**해서 터치 영역(44pt)·바텀시트·Pull-to-refresh 등 네이티브 패턴을 적용한다.
4. 웹 프로젝트의 Props 시그니처·네이밍 컨벤션(`is/has/can`, `handle` 접두사)을 그대로 유지한다.

## 헌법(Constitution) 준수 요약

- **네이밍**: 불리언은 `is/has/can`, 이벤트 핸들러는 `handle` 접두사
- **타입**: Props는 `interface`로 정의, `any` 금지
- **중첩 깊이**: 최대 2단계 (초과 시 헬퍼 함수로 추출)
- **컴포넌트**: `function` 키워드 선언(화살표 금지), 명시적 반환 타입 `ReactElement`
- **아이콘**: `lucide-react-native`만 사용. SVG 인라인·이미지 파일 아이콘 금지
- **폼**: React Hook Form + Zod
- **접근성**: `accessible`, `accessibilityRole`, `accessibilityLabel` 명시. 터치 타겟 최소 44×44pt

## 웹 → 모바일 변환 요약

| 웹 | 모바일 |
|---|---|
| `hover:` | `active:` (Pressed) — NativeWind v4 지원 |
| `cursor: pointer` | `Pressable` 컴포넌트로 감싸기 |
| `<button>` | `Pressable` + `Text` |
| Dropdown / Select | BottomSheet (`@gorhom/bottom-sheet`) |
| 풀스크린 Modal | BottomSheet 또는 `Modal` (`presentationStyle="pageSheet"`) |
| 목록 | `FlatList` + Pull-to-refresh + Infinite scroll |
| `lucide-react` | `lucide-react-native` (API 동일) |
| `next/image` | `expo-image` 또는 `Image` |
| `next/link` | `Link` from `expo-router` |

## 웹 프로젝트 원본 토큰 경로

- 원본 CSS: `src/app/globals.css` (Tailwind v4 `@theme` 블록)
- 원본 컴포넌트: `src/shared/ui/*.tsx`
- 원본 헌법: `.specify/memory/constitution.md`
