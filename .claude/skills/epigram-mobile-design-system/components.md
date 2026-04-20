# Epigram Mobile Components

Epigram 웹(`src/shared/ui/*`)의 컴포넌트를 React Native + NativeWind v4로 변환한 스펙.
각 컴포넌트는 `웹 Props 시그니처를 최대한 유지`하되, 모바일 네이티브 패턴에 맞춰 조정했다.

**공통 규칙** (모든 컴포넌트에 적용 — 헌법 준수):
- `function` 키워드로 선언 (화살표 함수 금지)
- Props는 `interface`로 정의, 반환 타입은 `ReactElement`
- 불리언 prop은 `is/has/can` 접두사, 이벤트는 `handle` 접두사
- `any` 금지, 중첩 깊이 2단계 초과 시 헬퍼 추출
- 아이콘은 `lucide-react-native`만 사용
- 터치 타겟 최소 `44×44pt` (Button, IconButton 등 `hitSlop`이나 패딩으로 확보)

---

## Button

웹 원본: `src/shared/ui/Button.tsx`

### 언제 쓰는가

- 폼 제출 (로그인·회원가입·에피그램 작성)
- 모달 확인/취소
- 목록 "더보기" · 빈 상태의 CTA

### Variants

| variant | 용도 | 스타일 요약 |
|---|---|---|
| `primary` | 주요 액션 (제출·확인) | `bg-black-500`, `text-white` |
| `secondary` | 보조 액션 (취소·뒤로) | `border-black-500`, `text-black-500` |
| `ghost` | 인라인 텍스트 버튼 | `text-blue-400` |

### Props

```ts
interface ButtonProps extends PressableProps {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
  children: ReactNode;
}
```

### 구현 예시

```tsx
import { Pressable, Text, ActivityIndicator } from "react-native";
import type { PressableProps } from "react-native";
import type { ReactElement, ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

interface ButtonProps extends PressableProps {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES = {
  primary: "bg-black-500 active:bg-black-600 disabled:bg-blue-300",
  secondary: "border border-black-500 active:bg-blue-200 disabled:border-blue-300",
  ghost: "active:opacity-60",
} as const;

const TEXT_CLASSES = {
  primary: "text-white",
  secondary: "text-black-500",
  ghost: "text-blue-400",
} as const;

export function Button({
  variant = "primary",
  isLoading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps): ReactElement {
  return (
    <Pressable
      disabled={disabled || isLoading}
      accessibilityRole="button"
      className={cn(
        "min-h-[44px] flex-row items-center justify-center rounded-lg px-4 py-2",
        VARIANT_CLASSES[variant],
        className
      )}
      {...props}
    >
      {isLoading ? <ActivityIndicator size="small" className="mr-2" /> : null}
      <Text className={cn("text-sm font-semibold", TEXT_CLASSES[variant])}>
        {children}
      </Text>
    </Pressable>
  );
}
```

### 모바일 변환 포인트

- 웹 `hover:bg-black-600` → `active:bg-black-600` (NativeWind v4 `active:` prefix 사용)
- 웹 `active:scale-95` → iOS는 자연스러운 opacity 피드백(opacity 0.7)이 더 네이티브다. 강조 시에만 `active:scale-95` 유지.
- `min-h-[44px]`로 터치 타겟 확보

---

## Input

웹 원본: `src/shared/ui/Input.tsx`

### 언제 쓰는가

- 이메일·비밀번호·닉네임 등 한 줄 입력

### Props

```ts
interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}
```

### 구현 예시

```tsx
import { View, Text, TextInput } from "react-native";
import type { TextInputProps } from "react-native";
import type { ReactElement } from "react";

import { cn } from "@/shared/lib/cn";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps): ReactElement {
  const hasError = Boolean(error);

  return (
    <View className="flex flex-col gap-2">
      {label ? (
        <Text className="text-sm font-medium text-blue-900">{label}</Text>
      ) : null}
      <TextInput
        placeholderTextColor="#abb8ce" // blue-400
        accessibilityLabel={label}
        className={cn(
          "h-11 w-full rounded-lg bg-blue-200 px-4 text-sm text-black-950",
          "focus:bg-white", // NativeWind v4 focus:
          hasError && "bg-white border-2 border-error",
          className
        )}
        {...props}
      />
      {error ? (
        <Text className="text-xs text-error">{error}</Text>
      ) : null}
    </View>
  );
}
```

### 모바일 변환 포인트

- 웹 `placeholder:text-blue-400` → RN `placeholderTextColor` prop으로 전달 (NativeWind 불가)
- 웹 `focus:ring-2 focus:ring-black-500` → RN은 ring 미지원. `focus:border-2 focus:border-black-500`으로 대체
- `secureTextEntry`, `keyboardType`, `autoCapitalize="none"` 등 RN 전용 props 활용

---

## Textarea

웹 원본: `src/shared/ui/Textarea.tsx`

### 언제 쓰는가

- 에피그램 본문 입력, 댓글 입력

### Props

```ts
interface TextareaProps extends TextInputProps {
  label?: string;
  error?: string;
  minRows?: number;
}
```

### 구현 예시

```tsx
import { View, Text, TextInput } from "react-native";
import type { TextInputProps } from "react-native";

interface TextareaProps extends TextInputProps {
  label?: string;
  error?: string;
  minRows?: number;
}

export function Textarea({
  label,
  error,
  minRows = 4,
  className,
  ...props
}: TextareaProps): ReactElement {
  return (
    <View className="flex flex-col gap-2">
      {label ? (
        <Text className="text-sm font-medium text-blue-900">{label}</Text>
      ) : null}
      <TextInput
        multiline
        textAlignVertical="top"
        numberOfLines={minRows}
        placeholderTextColor="#abb8ce"
        className={cn(
          "w-full rounded-lg bg-blue-200 px-4 py-3 text-sm text-black-950",
          `min-h-[${minRows * 24}px]`,
          error && "bg-white border-2 border-error",
          className
        )}
        {...props}
      />
      {error ? <Text className="text-xs text-error">{error}</Text> : null}
    </View>
  );
}
```

### 모바일 변환 포인트

- `multiline`, `textAlignVertical="top"` 필수 (Android에서 텍스트가 가운데 정렬되는 것 방지)
- `returnKeyType="default"`로 줄바꿈 허용

---

## Tag / Chip

웹 원본: `src/shared/ui/Tag.tsx`

### 언제 쓰는가

- 에피그램에 붙는 해시태그
- 최근 검색어 chip
- 카테고리 필터

### Props

```ts
interface TagProps {
  label: string;
  onPress?: (label: string) => void;
}
```

### 구현 예시

```tsx
import { Pressable, Text } from "react-native";

interface TagProps {
  label: string;
  onPress?: (label: string) => void;
}

export function Tag({ label, onPress }: TagProps): ReactElement {
  const baseClass =
    "flex-row items-center rounded-full bg-blue-200 px-3 py-1.5";

  if (!onPress) {
    return (
      <View className={baseClass}>
        <Text className="text-sm font-medium text-blue-600">#{label}</Text>
      </View>
    );
  }

  return (
    <Pressable
      onPress={() => onPress(label)}
      accessibilityRole="button"
      accessibilityLabel={`태그 ${label}`}
      className={cn(baseClass, "active:bg-blue-300")}
      hitSlop={8}
    >
      <Text className="text-sm font-medium text-blue-600">#{label}</Text>
    </Pressable>
  );
}
```

### 모바일 변환 포인트

- 웹 `onClick` → RN `onPress`로 네이밍 변경 (프로젝트 컨벤션에 따라 `handleTagPress` 같은 형태)
- `hitSlop`으로 실질 터치 영역 확대

---

## Modal

웹 원본: `src/shared/ui/Modal.tsx`

### 언제 쓰는가

- 확인/취소가 필요한 다이얼로그 (`ConfirmModal`)
- 프로필·상세 정보 팝업

### Props

```ts
interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
}

interface ConfirmModalProps {
  isVisible: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}
```

### 구현 예시

```tsx
import { Modal as RNModal, View, Text, Pressable } from "react-native";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ isVisible, onClose, children }: ModalProps): ReactElement {
  return (
    <RNModal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        onPress={onClose}
        accessible={false}
        className="flex-1 items-center justify-center bg-black/50 px-6"
      >
        <Pressable
          accessibilityRole="none"
          className="w-full max-w-md rounded-2xl bg-white p-6"
          // 자식 터치가 배경으로 전파되지 않도록 Pressable로 감쌈
        >
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
}
```

### 모바일 변환 포인트

- 웹 backdrop click → RN은 바깥 `Pressable`로 처리
- `onRequestClose`는 Android 뒤로가기 버튼 대응 (필수)
- 긴 콘텐츠나 선택지가 많으면 → `BottomSheet` 사용 권장 (patterns.md 참고)

---

## BottomSheet

웹에는 없음 — 모바일 전용. 드롭다운·액션시트·긴 콘텐츠 선택 UI를 대체한다.

### 언제 쓰는가

- 정렬 옵션 선택, 필터
- 공유·삭제 등 컨텍스트 액션 시트
- 에피그램 상세의 감정 선택

### 추천 라이브러리

`@gorhom/bottom-sheet` (제스처·스냅 포인트 지원)

### Props

```ts
interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  snapPoints?: string[]; // e.g. ["40%", "80%"]
  children: ReactNode;
}
```

### 구현 예시 (간이 — Modal + 슬라이드 애니메이션)

```tsx
import { Modal, View, Pressable, Animated } from "react-native";

export function BottomSheet({
  isVisible,
  onClose,
  children,
}: BottomSheetProps): ReactElement {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        onPress={onClose}
        className="flex-1 justify-end bg-black/50"
      >
        <Pressable className="rounded-t-2xl bg-white px-6 pt-6 pb-10">
          {/* 드래그 핸들 (시각적 힌트) */}
          <View className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />
          {children}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
```

---

## Toast

웹에는 명시된 컴포넌트 없음. 모바일은 성공/에러 피드백이 필수.

### 언제 쓰는가

- 에피그램 생성·수정·삭제 성공 피드백
- API 에러 전역 알림
- 좋아요 토글 같은 짧은 피드백

### 추천 라이브러리

`react-native-toast-message` 또는 `sonner-native`

### 디자인 스펙

- 위치: 상단 또는 하단 (Safe Area 고려)
- 배경:
  - success → `bg-illust-green` + `text-white`
  - error → `bg-error` + `text-white`
  - info → `bg-black-700` + `text-white`
- `rounded-xl`, `px-4 py-3`, `text-sm font-medium`
- 자동 닫힘 2.5초

---

## Skeleton

웹은 `animate-pulse` + `bg-blue-200` 조합(`EpigramFeed`의 `h-28 animate-pulse rounded-2xl bg-blue-200`).

### 언제 쓰는가

- 초기 로딩 시 카드·리스트 플레이스홀더
- 프로필·통계 등 개별 데이터 로드 중

### Props

```ts
interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}
```

### 구현 예시

```tsx
import { View } from "react-native";
import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export function Skeleton({
  width = "100%",
  height = 16,
  className,
}: SkeletonProps): ReactElement {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{ width, height, opacity }}
      className={cn("rounded-lg bg-blue-200", className)}
    />
  );
}
```

---

## Avatar

웹의 유저 프로필 아이콘 자리. 원본은 `next/image` + `<User />` fallback.

### Props

```ts
interface AvatarProps {
  imageUrl?: string | null;
  nickname: string;
  size?: 24 | 32 | 48 | 64;
}
```

### 구현 예시

```tsx
import { Image, View } from "react-native";
import { User } from "lucide-react-native";

export function Avatar({ imageUrl, nickname, size = 32 }: AvatarProps): ReactElement {
  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        accessibilityLabel={`${nickname} 프로필`}
        style={{ width: size, height: size }}
        className="rounded-full bg-blue-200"
      />
    );
  }

  return (
    <View
      style={{ width: size, height: size }}
      className="items-center justify-center rounded-full bg-blue-200"
    >
      <User size={size * 0.6} color="#ababab" />
    </View>
  );
}
```

---

## Header (화면별 네이티브 헤더)

웹 원본: `src/widgets/header/ui/Header.tsx` (전역 헤더).
모바일에서는 **Expo Router의 화면 옵션**으로 제어하는 게 일반적.

### 구현 방식

```tsx
// app/(tabs)/feeds.tsx
import { Stack } from "expo-router";

export default function FeedsScreen(): ReactElement {
  return (
    <>
      <Stack.Screen
        options={{
          title: "피드",
          headerTitleStyle: {
            fontFamily: "NanumMyeongjo-Bold",
            fontSize: 20,
            color: "#1a212d", // blue-950
          },
          headerStyle: { backgroundColor: "rgba(255,255,255,0.95)" },
          headerShadowVisible: false,
        }}
      />
      {/* ... */}
    </>
  );
}
```

### 스펙

- 높이: 52pt (모바일 웹과 동일)
- 배경: `bg-white/95` + 아래 `border-b border-line-100`
- 로고(Epigram): 랜딩·탭 루트에서만 표시. 나머지는 화면 타이틀 + 뒤로가기

---

## BottomTabBar

웹에는 없음 — 모바일 네이티브 전용. Expo Router의 Tabs 레이아웃으로 구현.

### 탭 구성 (웹의 네비게이션 + 추가 화면 기준)

| 탭 | 라우트 | 아이콘 (lucide-react-native) |
|---|---|---|
| 피드 | `/(tabs)/feeds` | `Home` |
| 검색 | `/(tabs)/search` | `Search` |
| 작성 | `/(tabs)/addepigram` | `PlusCircle` |
| 마이 | `/(tabs)/mypage` | `User` |

### 구현 예시

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Home, Search, PlusCircle, User } from "lucide-react-native";

export default function TabLayout(): ReactElement {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#52698e", // blue-700
        tabBarInactiveTintColor: "#abb8ce", // blue-400
        tabBarStyle: {
          height: 56,
          borderTopColor: "#f2f2f2", // line-100
          backgroundColor: "#ffffff",
        },
        tabBarLabelStyle: {
          fontFamily: "Pretendard",
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="feeds"
        options={{
          title: "피드",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      {/* 나머지 탭 동일 패턴 */}
    </Tabs>
  );
}
```

---

## IconButton

### 언제 쓰는가

- 헤더 우측 액션 (공유·삭제)
- 카드 내부 좋아요·북마크 버튼
- 인풋 초기화 X 버튼

### Props

```ts
interface IconButtonProps {
  icon: LucideIcon;
  label: string; // accessibility용 (시각적 미표시)
  onPress: () => void;
  size?: number;
  variant?: "default" | "ghost";
  disabled?: boolean;
}
```

### 구현 예시

```tsx
import { Pressable } from "react-native";
import type { LucideIcon } from "lucide-react-native";

export function IconButton({
  icon: Icon,
  label,
  onPress,
  size = 24,
  variant = "default",
  disabled,
}: IconButtonProps): ReactElement {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      className={cn(
        "min-h-[44px] min-w-[44px] items-center justify-center rounded-full",
        variant === "default" && "active:bg-blue-200",
        variant === "ghost" && "active:opacity-60",
        disabled && "opacity-40"
      )}
    >
      <Icon size={size} color="#454545" />
    </Pressable>
  );
}
```

---

## EpigramCard

웹 원본: `src/entities/epigram/ui/EpigramListCard.tsx`.
모바일의 핵심 콘텐츠 블록 — 에피그램 한 편을 카드로 표시.

### Props

```ts
interface EpigramCardProps {
  epigram: Epigram; // entities/epigram/model/schema의 타입
  onPress?: (id: number) => void;
}
```

### 시각적 스펙

- 배경: `bg-white`
- 테두리: `border border-line-100`
- 라디우스: `rounded-xl` (16px)
- 패딩: `p-6`
- 섀도: `shadow-card` (토큰 참고)
- 본문: `font-serif text-epigram-base text-black-600` (18/30)
- 저자: `font-serif text-base text-blue-400` (오른쪽 정렬, `- 이름 -` 포맷)
- 태그: 하단, 오른쪽 정렬, `font-serif text-sm text-blue-400` (`#tag` 텍스트 형태)
- **Decorative ruled lines** (옵션 — 웹 원본 디테일):
  - `repeating-linear-gradient`로 24px 간격의 옅은 가로선. RN에서는 `react-native-svg`의 `<Pattern>`이나 24px 간격 `<View>` 반복으로 구현 가능. 없어도 무방.

### 구현 예시 (간소화)

```tsx
import { View, Text, Pressable } from "react-native";

export function EpigramCard({ epigram, onPress }: EpigramCardProps): ReactElement {
  return (
    <Pressable
      onPress={() => onPress?.(epigram.id)}
      accessibilityRole="button"
      accessibilityLabel={`${epigram.author}의 에피그램`}
      className="overflow-hidden rounded-xl border border-line-100 bg-white p-6 active:opacity-80"
      style={{
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
      }}
    >
      <View className="gap-5">
        <Text className="font-serif text-epigram-base text-black-600">
          {epigram.content}
        </Text>
        <Text className="text-right font-serif text-base text-blue-400">
          - {epigram.author} -
        </Text>
      </View>

      {epigram.tags.length > 0 ? (
        <View className="mt-3 flex-row flex-wrap justify-end gap-3">
          {epigram.tags.map((tag) => (
            <Text key={tag.id} className="font-serif text-sm text-blue-400">
              #{tag.name}
            </Text>
          ))}
        </View>
      ) : null}
    </Pressable>
  );
}
```

---

## EmptyState

웹 원본: `src/shared/ui/EmptyState.tsx`.

### 언제 쓰는가

- 검색 결과 없음, 피드 비어있음, 댓글 없음 등

### Props

```ts
interface EmptyStateProps {
  icon: ReactElement; // lucide-react-native 아이콘
  title: string;
  description?: string;
  action?: ReactElement; // Button 등
}
```

### 구현 예시

```tsx
import { View, Text } from "react-native";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps): ReactElement {
  return (
    <View className="flex items-center gap-5 py-16">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-blue-200/40">
        {icon}
      </View>
      <View className="items-center gap-1.5">
        <Text className="text-sm font-semibold text-black-600">{title}</Text>
        {description ? (
          <Text className="text-xs text-black-300">{description}</Text>
        ) : null}
      </View>
      {action}
    </View>
  );
}
```

---

## LikeButton

웹 원본: `src/features/epigram-like/ui/LikeButton.tsx`.

### Props

```ts
interface LikeButtonProps {
  epigramId: number;
  likeCount: number;
  isLiked: boolean;
  onToggle: () => void;
  isPending?: boolean;
}
```

### 구현 포인트

- `Heart` 아이콘 (lucide-react-native) — `fill={isLiked ? "#ffffff" : "none"}`
- `isLiked` true → `bg-black-500 text-white`
- `isLiked` false → `border border-blue-300 text-blue-600`
- `active:scale-95`로 피드백

---

## 컴포넌트 네이밍·파일 구조 규칙

웹의 FSD 구조와 컨벤션을 그대로 유지:

```
src/
├── shared/
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Textarea.tsx
│       ├── Tag.tsx
│       ├── Modal.tsx
│       ├── BottomSheet.tsx        # 모바일 전용 추가
│       ├── Toast.tsx              # 모바일 전용 추가
│       ├── Skeleton.tsx           # 모바일 전용 추가
│       ├── Avatar.tsx             # 모바일 전용 추가
│       ├── IconButton.tsx         # 모바일 전용 추가
│       └── EmptyState.tsx
├── entities/
│   └── epigram/
│       └── ui/
│           └── EpigramCard.tsx
└── widgets/
    └── bottom-tab-bar/            # 모바일 전용 추가
```

웹 `shared/ui/Modal.tsx`의 `Modal` + `ConfirmModal` 같이 **관련 헬퍼 컴포넌트는 같은 파일에** 두는 관행을 모바일에서도 유지한다 (헌법 III 원칙).
