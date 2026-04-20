/**
 * Epigram Mobile Design Tokens
 *
 * NativeWind v4 + Tailwind CSS 3.4 호환.
 * tailwind.config.js의 theme.extend에 spread해서 사용한다.
 *
 * @example
 * // tailwind.config.js
 * const { colors, fontSize, spacing, borderRadius, fontFamily, fontWeight } = require("./tokens");
 * module.exports = {
 *   theme: {
 *     extend: { colors, fontSize, spacing, borderRadius, fontFamily, fontWeight },
 *   },
 * };
 *
 * 원본: epigram 웹 프로젝트 src/app/globals.css @theme 블록
 */

/* ============================================================
 * Colors
 * 웹 globals.css의 --color-* 변수를 그대로 매핑한다.
 * 웹은 라이트 모드 중심 — 모바일도 동일하지만 dark 변형 토큰을 준비했다.
 * ============================================================ */
export const colors = {
  // Neutral gray scale (브랜드의 기본 텍스트/UI 색)
  black: {
    100: "#787878",
    200: "#6b6b6b",
    300: "#5e5e5e",
    400: "#525252",
    500: "#454545", // Primary text & Button primary bg
    600: "#373737", // Button primary hover
    700: "#2b2b2b",
    800: "#1f1f1f",
    900: "#121212", // Heading 강조
    950: "#050505", // Input text
  },

  // Blue (brand primary) — 피그마 시안의 파란 톤
  blue: {
    100: "#ffffff", // 실제로는 흰색으로 사용됨 (web 원본 그대로)
    200: "#eceff4", // Input bg, Tag bg light
    300: "#cbd3e1", // Disabled, divider
    400: "#abb8ce", // Placeholder, secondary text
    500: "#8b9dbc", // Calendar weekday
    600: "#6a82a9", // Tag text, accent
    700: "#52698e", // Active nav text
    800: "#40516e",
    900: "#2d394e", // Label text
    950: "#1a212d", // Selection text
  },

  // Gray (보조 회색, 아이콘·비활성 텍스트)
  gray: {
    100: "#dedede",
    200: "#c4c4c4",
    300: "#ababab",
    400: "#919191",
  },

  // Background — 화면 배경색
  background: {
    DEFAULT: "#f5f7fa", // 라이트 모드 기본
    dark: "#1a212d", // 다크 모드용 (blue-950)
  },

  // Surface — 카드·시트·모달의 표면 색
  surface: {
    DEFAULT: "#ffffff",
    dark: "#2d394e", // 다크 모드 (blue-900)
  },

  // Line (border)
  line: {
    100: "#f2f2f2", // Subtle divider (카드 테두리)
    200: "#cfdbea", // Regular divider
  },

  // State
  error: "#ff6577",

  // Illustration (감정 로그·차트 용)
  illust: {
    yellow: "#fbc85b",
    green: "#48bb98",
    purple: "#8e80e3",
    blue: "#5195ee",
    red: "#e46e80",
    brown: "#9a695e",
  },

  // Sub (보조 색상 — 다크 배경·섹션 구분 등)
  sub: {
    yellow: "#e8aa26",
    "blue-1": "#3e3e3e",
    "blue-2": "#3e414d",
    "blue-3": "#494d59",
    "gray-1": "#c7d1e0",
    "gray-2": "#e3e9f1",
    "gray-3": "#eff3f8",
  },
} as const;

/* ============================================================
 * Typography
 * 웹은 `text-xs` ~ `text-xl` 등 Tailwind 기본 스케일을 쓴다.
 * 모바일에서도 동일 스케일 + PX 단위를 명시해 NativeWind가 정확히 해석하도록 한다.
 * ============================================================ */
export const fontSize = {
  // [fontSize, { lineHeight }]
  xs: ["12px", { lineHeight: "16px" }],
  sm: ["14px", { lineHeight: "20px" }],
  base: ["16px", { lineHeight: "24px" }],
  lg: ["18px", { lineHeight: "28px" }],
  xl: ["20px", { lineHeight: "28px" }],
  "2xl": ["24px", { lineHeight: "32px" }],
  "3xl": ["30px", { lineHeight: "36px" }],
  "4xl": ["36px", { lineHeight: "40px" }],

  // Serif 본문용 커스텀 스케일 (에피그램 카드)
  "epigram-sm": ["16px", { lineHeight: "26px" }],
  "epigram-base": ["18px", { lineHeight: "30px" }],
  "epigram-lg": ["20px", { lineHeight: "34px" }],
} as const;

export const fontWeight = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  black: "900",
} as const;

/**
 * Font Family
 *
 * RN에서는 expo-font로 폰트를 로드해야 NativeWind의 font-sans / font-serif가 작동한다.
 * expo-font 로드 예시:
 *   useFonts({
 *     "Pretendard": require("./assets/fonts/PretendardVariable.ttf"),
 *     "NanumMyeongjo": require("./assets/fonts/NanumMyeongjo-Regular.ttf"),
 *     "NanumMyeongjo-Bold": require("./assets/fonts/NanumMyeongjo-Bold.ttf"),
 *   });
 */
export const fontFamily = {
  sans: ["Pretendard", "System"],
  serif: ["NanumMyeongjo", "serif"],
  "serif-bold": ["NanumMyeongjo-Bold", "serif"],
} as const;

/* ============================================================
 * Spacing
 * Tailwind 기본 4px 스케일을 따른다. 웹 프로젝트도 기본값 사용.
 * 추가로 모바일 safe-area·터치-타겟용 토큰을 추가한다.
 * ============================================================ */
export const spacing = {
  // 기본 스케일 유지 (0 ~ 96 등은 tailwind 기본값이라 생략)

  // 모바일 전용
  "touch-sm": "40px", // 권장 최소 터치 타겟 (아이콘 전용)
  "touch-md": "44px", // iOS HIG 최소 권장 (Apple)
  "touch-lg": "48px", // Material Design 최소 (Android)

  // 레이아웃 상수
  "screen-x": "24px", // 기본 좌우 패딩 (px-6)
  "screen-x-sm": "16px", // 좁은 화면용 (px-4)

  // 헤더·탭바 높이
  "header-h": "52px", // 웹 모바일 헤더 높이
  "tab-h": "56px", // BottomTabBar 높이 (safe-area 제외)

  // 카드 내부 패딩
  "card-p": "24px", // p-6 (웹 EpigramListCard)
  "card-p-sm": "16px", // p-4 (조밀한 카드)
} as const;

/* ============================================================
 * Border Radius
 * 웹에서는 rounded-xl(12px), rounded-2xl(16px), rounded-full을 주로 사용.
 * ============================================================ */
export const borderRadius = {
  none: "0",
  sm: "4px",
  DEFAULT: "8px", // rounded
  md: "10px",
  lg: "12px", // rounded-lg (Button, Input — 웹 rounded-xl)
  xl: "16px", // rounded-xl (Card — 웹 rounded-2xl)
  "2xl": "20px",
  "3xl": "24px",
  full: "9999px", // Chip, Tag, Avatar
} as const;

/* ============================================================
 * Shadow
 * RN은 iOS: shadow* props / Android: elevation 으로 동작한다.
 * NativeWind v4는 shadow-* 유틸리티를 iOS/Android에 적절히 매핑해준다.
 *
 * 아래 값은 참고용 — 실제 사용은 className="shadow-sm" 등 Tailwind 기본 클래스로 한다.
 * ============================================================ */
export const boxShadow = {
  // 웹 카드: shadow-[0px_3px_12px_0_rgba(0,0,0,0.04)]
  card: "0px 3px 12px rgba(0, 0, 0, 0.04)",
  sm: "0px 1px 2px rgba(0, 0, 0, 0.05)",
  md: "0px 4px 6px rgba(0, 0, 0, 0.07)",
  lg: "0px 10px 15px rgba(0, 0, 0, 0.10)",
  xl: "0px 20px 25px rgba(0, 0, 0, 0.12)",
} as const;

/* ============================================================
 * Animation Duration (RN Animated·Reanimated용 상수)
 * NativeWind v4는 transition-duration-* 도 지원하지만, RN Animated에는 ms 상수가 더 쓰기 편하다.
 * ============================================================ */
export const duration = {
  fast: 150, // 웹 transition-all duration-150 (버튼)
  base: 200, // 웹 duration-200 (카드, input)
  slow: 350, // 웹 slideUp (0.35s)
  slower: 550, // 웹 fadeInUp (0.55s)
} as const;

/**
 * 편의용: 전체 토큰 한 번에 export
 * tailwind.config.js에서 `...tokens.colors`처럼 쓰려면 default export도 유용하다.
 */
export const tokens = {
  colors,
  fontSize,
  fontWeight,
  fontFamily,
  spacing,
  borderRadius,
  boxShadow,
  duration,
} as const;

export default tokens;
