/**
 * Epigram Mobile Design Tokens
 *
 * 원본: .claude/skills/epigram-mobile-design-system/tokens.ts
 * 이 파일은 tailwind.config.js가 require할 수 있도록 CommonJS로 관리한다.
 * 토큰 변경 시 스킬 문서와 동기화 필요.
 */

const colors = {
  black: {
    100: "#787878",
    200: "#6b6b6b",
    300: "#5e5e5e",
    400: "#525252",
    500: "#454545",
    600: "#373737",
    700: "#2b2b2b",
    800: "#1f1f1f",
    900: "#121212",
    950: "#050505",
  },
  blue: {
    100: "#ffffff",
    200: "#eceff4",
    300: "#cbd3e1",
    400: "#abb8ce",
    500: "#8b9dbc",
    600: "#6a82a9",
    700: "#52698e",
    800: "#40516e",
    900: "#2d394e",
    950: "#1a212d",
  },
  gray: {
    100: "#dedede",
    200: "#c4c4c4",
    300: "#ababab",
    400: "#919191",
  },
  background: {
    DEFAULT: "#f5f7fa",
    dark: "#1a212d",
  },
  surface: {
    DEFAULT: "#ffffff",
    dark: "#2d394e",
  },
  line: {
    100: "#f2f2f2",
    200: "#cfdbea",
  },
  error: "#ff6577",
  illust: {
    yellow: "#fbc85b",
    green: "#48bb98",
    purple: "#8e80e3",
    blue: "#5195ee",
    red: "#e46e80",
    brown: "#9a695e",
  },
  sub: {
    yellow: "#e8aa26",
    "blue-1": "#3e3e3e",
    "blue-2": "#3e414d",
    "blue-3": "#494d59",
    "gray-1": "#c7d1e0",
    "gray-2": "#e3e9f1",
    "gray-3": "#eff3f8",
  },
};

const fontSize = {
  xs: ["12px", { lineHeight: "16px" }],
  sm: ["14px", { lineHeight: "20px" }],
  base: ["16px", { lineHeight: "24px" }],
  lg: ["18px", { lineHeight: "28px" }],
  xl: ["20px", { lineHeight: "28px" }],
  "2xl": ["24px", { lineHeight: "32px" }],
  "3xl": ["30px", { lineHeight: "36px" }],
  "4xl": ["36px", { lineHeight: "40px" }],
  "epigram-sm": ["16px", { lineHeight: "26px" }],
  "epigram-base": ["18px", { lineHeight: "30px" }],
  "epigram-lg": ["20px", { lineHeight: "34px" }],
};

const fontWeight = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  black: "900",
};

const fontFamily = {
  sans: ["Pretendard", "System"],
  serif: ["NanumMyeongjo", "serif"],
  "serif-bold": ["NanumMyeongjo-Bold", "serif"],
};

const spacing = {
  "touch-sm": "40px",
  "touch-md": "44px",
  "touch-lg": "48px",
  "screen-x": "24px",
  "screen-x-sm": "16px",
  "header-h": "52px",
  "tab-h": "56px",
  "card-p": "24px",
  "card-p-sm": "16px",
};

const borderRadius = {
  none: "0",
  sm: "4px",
  DEFAULT: "8px",
  md: "10px",
  lg: "12px",
  xl: "16px",
  "2xl": "20px",
  "3xl": "24px",
  full: "9999px",
};

const boxShadow = {
  card: "0px 3px 12px rgba(0, 0, 0, 0.04)",
  sm: "0px 1px 2px rgba(0, 0, 0, 0.05)",
  md: "0px 4px 6px rgba(0, 0, 0, 0.07)",
  lg: "0px 10px 15px rgba(0, 0, 0, 0.10)",
  xl: "0px 20px 25px rgba(0, 0, 0, 0.12)",
};

const duration = {
  fast: 150,
  base: 200,
  slow: 350,
  slower: 550,
};

module.exports = {
  colors,
  fontSize,
  fontWeight,
  fontFamily,
  spacing,
  borderRadius,
  boxShadow,
  duration,
};
