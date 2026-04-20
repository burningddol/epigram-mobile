# Epigram Mobile UX Patterns

웹(`hover`, `cursor`, `<button>`, `<a>`)에서 모바일(`Pressable`, `FlatList`, `BottomSheet`)로 인터랙션을 변환할 때 지켜야 할 패턴 모음.

---

## 1. 터치 영역 (Touch Targets)

### 원칙

모든 인터랙티브 요소는 **최소 44×44pt (iOS HIG) / 48×48dp (Material)** 의 터치 영역을 확보한다.

### 적용 방법

- **버튼**: `min-h-[44px]` 클래스 또는 `padding`으로 확보
- **아이콘 버튼**: `Pressable`에 `hitSlop` prop으로 시각적 크기 없이 터치 영역만 확장

```tsx
<Pressable
  onPress={handlePress}
  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
  // 시각적으로는 28×28이어도 실제 터치는 44×44
>
  <X size={28} color="#454545" />
</Pressable>
```

### 간격

인접한 터치 요소 사이 **최소 8pt** 간격 확보 — 실수 터치 방지.

---

## 2. Pressed / Active 상태

### 웹 → 모바일 매핑

| 웹 | 모바일 (NativeWind v4) |
|---|---|
| `hover:bg-blue-100` | `active:bg-blue-100` |
| `hover:opacity-80` | `active:opacity-80` |
| `active:scale-95` | `active:scale-95` (동일) |
| `focus:ring-2` | RN은 미지원 — `active:border-2 active:border-black-500` 로 대체 |

### 기본 피드백 패턴

- **주요 버튼**: 배경색 변화 (`active:bg-black-600`)
- **보조 버튼**: 배경색 연하게 (`active:bg-blue-200`)
- **아이콘 버튼**: `active:opacity-60` 또는 원형 배경 (`active:bg-blue-200`)
- **카드 탭**: `active:opacity-80` (과도한 스케일 변화는 피함)
- **텍스트 링크**: `active:opacity-60`

### iOS 느낌 vs Android 느낌

- iOS 네이티브는 **opacity**가 자연스럽다 → `Pressable` 기본 동작(`android_ripple`은 Android만)
- Android는 **Ripple Effect** 사용 권장
  ```tsx
  <Pressable
    onPress={handlePress}
    android_ripple={{ color: "#cbd3e1" /* blue-300 */ }}
  >
  ```

---

## 3. 웹 컴포넌트 → 모바일 네이티브 UI 매핑

| 웹 패턴 | 모바일 대체 | 이유 |
|---|---|---|
| `<select>` / Dropdown | **BottomSheet** 또는 **ActionSheet** | 작은 화면에서 선택지가 시각적으로 더 명확 |
| 풀스크린 Modal | **BottomSheet** (짧은 콘텐츠) / **`presentationStyle="pageSheet"`** (긴 콘텐츠) | iOS 제스처 친화적 |
| 드롭다운 메뉴 (more) | **ActionSheet** | 모바일 네이티브 패턴 |
| 호버 Tooltip | **LongPress** 시 바텀시트 또는 Toast | 호버가 불가능 |
| `<a>` 앵커 네비 | `Link` from `expo-router` 또는 `router.push()` | Expo Router 파일 기반 라우팅 |
| 페이지네이션 "더보기" 버튼 | **Infinite Scroll** (`onEndReached`) | 스크롤 연속성 |

---

## 4. 리스트 (FlatList) 패턴

### 원칙

- **`FlatList`를 기본으로 사용** (`ScrollView` + `map`은 성능 문제)
- 아이템이 100개 이상이면 `initialNumToRender`, `windowSize` 튜닝

### 표준 리스트 구성

```tsx
import { FlatList, RefreshControl, View } from "react-native";

function EpigramFeedList(): ReactElement {
  const {
    data,
    isLoading,
    isRefreshing,
    hasNextPage,
    refetch,
    fetchNextPage,
  } = useEpigrams({ limit: 10 });

  const epigrams = data?.pages.flatMap((p) => p.list) ?? [];

  if (isLoading) return <FeedSkeleton />;
  if (epigrams.length === 0) return <FeedEmpty />;

  return (
    <FlatList
      data={epigrams}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <EpigramCard epigram={item} />}
      ItemSeparatorComponent={() => <View className="h-4" />}
      contentContainerClassName="px-6 py-4"
      onEndReached={() => hasNextPage && fetchNextPage()}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refetch}
          tintColor="#52698e" // blue-700
        />
      }
      ListFooterComponent={hasNextPage ? <ListLoadingFooter /> : null}
    />
  );
}
```

### Pull-to-Refresh

- **모든 피드·리스트 화면**에 적용한다
- `tintColor`를 `blue-700` (`#52698e`)로 통일

### Infinite Scroll

- `onEndReached` + `onEndReachedThreshold={0.5}` 조합
- React Query의 `useInfiniteQuery`로 서버 상태 관리 (웹 헌법 VI 참고)
- 로딩 중 푸터에 `ActivityIndicator` 또는 Skeleton 노출

---

## 5. 키보드 & 입력

### 원칙

- 입력 중 키보드가 인풋을 가리지 않게 **`KeyboardAvoidingView`** 또는 **`react-native-keyboard-controller`** 사용
- 입력 필드 밖 탭 시 키보드 dismiss

### 표준 패턴

```tsx
import { KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";

<KeyboardAvoidingView
  behavior={Platform.OS === "ios" ? "padding" : "height"}
  className="flex-1"
>
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <ScrollView keyboardShouldPersistTaps="handled">
      {/* 폼 */}
    </ScrollView>
  </TouchableWithoutFeedback>
</KeyboardAvoidingView>
```

### 인풋 타입별 설정

| 용도 | props |
|---|---|
| 이메일 | `keyboardType="email-address"`, `autoCapitalize="none"`, `autoComplete="email"` |
| 비밀번호 | `secureTextEntry`, `autoCapitalize="none"`, `autoComplete="password"` |
| 닉네임 | `autoCapitalize="none"`, `autoComplete="username"` |
| 숫자 | `keyboardType="number-pad"` |
| 본문 (Textarea) | `multiline`, `textAlignVertical="top"` |

### 제출 흐름

- Input의 `returnKeyType="next"` + `onSubmitEditing={() => nextRef.current?.focus()}`
- 마지막 Input은 `returnKeyType="done"` + `onSubmitEditing={handleSubmit}`

---

## 6. 네비게이션 (Expo Router)

### 구조

```
app/
├── (auth)/                 # 인증 전 플로우 그룹
│   ├── _layout.tsx         # Stack
│   ├── login.tsx
│   └── signup.tsx
├── (tabs)/                 # 인증 후 메인 플로우
│   ├── _layout.tsx         # Tabs (BottomTabBar)
│   ├── feeds.tsx
│   ├── search.tsx
│   ├── addepigram.tsx
│   └── mypage.tsx
├── epigrams/
│   ├── [id]/
│   │   ├── index.tsx       # 상세
│   │   └── edit.tsx        # 수정 (모달 스타일)
└── _layout.tsx             # 루트
```

### 화면 전환 스타일

- **일반 화면**: Stack의 `animation: "slide_from_right"` (iOS 기본)
- **모달성 화면** (작성·수정): `presentation: "modal"` + 상단 "취소" / "저장" 헤더
- **바텀시트**: Expo Router 제공 `presentation: "formSheet"` 또는 `@gorhom/bottom-sheet` 라이브러리

### 딥링크

- Expo의 `scheme` 설정 + `expo-router`가 자동 처리
- 카카오 OAuth 콜백은 `epigram://oauth/callback/kakao`로 받음

---

## 7. Safe Area

### 원칙

- 모든 화면은 **`SafeAreaView`** 또는 **`useSafeAreaInsets`** 로 노치·홈 인디케이터 영역 보호
- 헤더·탭바가 있는 화면은 Expo Router가 자동 처리 — 추가 작업 불필요
- 모달·전체화면 콘텐츠는 수동 처리

```tsx
import { SafeAreaView } from "react-native-safe-area-context";

<SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background">
  {/* 콘텐츠 */}
</SafeAreaView>
```

---

## 8. 애니메이션

### 웹 애니메이션 토큰 → RN 매핑

웹 `globals.css`에 정의된 키프레임:

| 웹 이름 | 용도 | 모바일 구현 |
|---|---|---|
| `fade-in-up` | 카드 등장 | `Animated.parallel([opacity 0→1, translateY 16→0])`, 550ms |
| `fade-in` | 에러 메시지 | `Animated.timing(opacity, 400ms)` |
| `slide-up` | 모달·시트 | 라이브러리 기본 `animationType="slide"` 사용 |
| `scale-in` | 칩·토스트 | `Animated.spring` 또는 `Reanimated` |
| `float` | 장식 | `Animated.loop` |

### 추천 스택

- **단순 전환**: RN 기본 `Animated` API
- **복잡한 제스처/인터랙티브**: `react-native-reanimated` + `react-native-gesture-handler`

### 성능 원칙

- `useNativeDriver: true` 필수 (opacity, transform 계열)
- 리스트 아이템 등장 애니메이션은 과도하면 스크롤 버벅임 → 화면 초기 진입 시에만 적용

---

## 9. Loading / Empty / Error 상태

### 3가지 상태를 항상 명시적으로 처리

```tsx
function FeedScreen(): ReactElement {
  const { data, isLoading, error, refetch } = useEpigrams();

  if (isLoading) return <FeedSkeleton />;
  if (error) return <ErrorView onRetry={refetch} />;
  if (!data || data.length === 0) return <FeedEmpty />;

  return <FeedList epigrams={data} />;
}
```

### Skeleton 우선

- **스피너보다 Skeleton을 우선** (헌법 VI 참고)
- 실제 레이아웃과 같은 크기·위치로 배치해 레이아웃 시프트 방지

### Error

- 네트워크 에러 → 재시도 버튼이 있는 에러 뷰
- 에러 UI는 `EmptyState` 컴포넌트를 재사용하며 `icon={<WifiOff />}` 같이 상황에 맞는 아이콘 지정

---

## 10. 접근성 (Accessibility)

### 필수 체크

- `accessibilityRole` — `button`, `link`, `header`, `image` 등
- `accessibilityLabel` — 시각적 텍스트가 없는 요소(아이콘 버튼, 이미지)
- `accessibilityHint` — 행동의 결과가 명확하지 않을 때
- `accessibilityState` — `{ disabled, selected, expanded }`

### Modal / BottomSheet

```tsx
<Modal
  accessible
  accessibilityViewIsModal
  accessibilityRole="alert"
  accessibilityLabel="확인 대화상자"
>
```

### 폼 에러

- Input의 `accessibilityLiveRegion="polite"` 또는 에러 텍스트에 `accessibilityRole="alert"`

### 충분한 대비

- 토큰상 텍스트는 `black-500` 이상(`#454545` → 대비 ≥ 9:1)을 배경 위에 사용
- 비활성 텍스트는 `gray-300`(`#ababab`) 이상 사용 (`gray-400`은 보조 정보에만)

---

## 11. 폼 (React Hook Form + Zod)

웹 헌법 IV의 패턴을 그대로 사용. RN에서는 `Input`과 연결할 때 `Controller`를 사용한다.

```tsx
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
  resolver: zodResolver(loginSchema),
  mode: "onBlur",
});

<Controller
  control={control}
  name="email"
  render={({ field: { onChange, onBlur, value } }) => (
    <Input
      placeholder="이메일"
      value={value}
      onChangeText={onChange}
      onBlur={onBlur}
      error={errors.email?.message}
      keyboardType="email-address"
      autoCapitalize="none"
    />
  )}
/>
```

---

## 12. 제스처 패턴

| 제스처 | 사용처 | 구현 |
|---|---|---|
| Swipe to go back | 모든 Stack 화면 | Expo Router 기본 (iOS) |
| Swipe to delete | 내 에피그램·댓글 목록 | `react-native-gesture-handler`의 `Swipeable` |
| Pull to refresh | 피드·검색 결과 | `FlatList`의 `refreshControl` |
| Long press | 공유·삭제 메뉴 | `Pressable`의 `onLongPress` + BottomSheet |
| Pinch to zoom | 이미지 뷰어 (있는 경우) | `react-native-gesture-handler` + `react-native-reanimated` |

---

## 13. 아이콘 규칙 (헌법 준수)

- **`lucide-react-native`만 사용.** SVG 인라인 / 이미지 파일 / 폰트 아이콘 금지
- 기본 size: `24`, 작은 곳 `16` 또는 `20`, 큰 장식 `32`~`40`
- `color`는 토큰 색상 hex 값으로 전달 (`"#454545"` 등)
- `strokeWidth={2}`가 기본, 얇은 라인이 필요하면 `{1.5}`

```tsx
import { Heart, Search, User } from "lucide-react-native";

<Heart size={20} color="#52698e" strokeWidth={2} fill="#52698e" />
```

---

## 14. 상태 저장 (웹 ↔ 모바일 차이)

### 웹
- OAuth 토큰: HttpOnly 쿠키 + BFF 프록시

### 모바일
- OAuth 토큰: **`expo-secure-store`** (iOS Keychain / Android EncryptedSharedPreferences)
- 백엔드 API 직접 호출 + `Authorization: Bearer <accessToken>` 헤더

```ts
import * as SecureStore from "expo-secure-store";

await SecureStore.setItemAsync("accessToken", token);
const token = await SecureStore.getItemAsync("accessToken");
```

- **localStorage / AsyncStorage에 토큰 저장 금지** (헌법 VII 준수)
- 비민감 데이터(최근 검색어 등)는 `@react-native-async-storage/async-storage` 사용

---

## 15. 화면별 레이아웃 원칙

| 화면 | 헤더 | 탭바 | 주요 패턴 |
|---|---|---|---|
| 랜딩 | 없음 (로고만) | 없음 | 풀스크린 + CTA 버튼 |
| 로그인·회원가입 | 뒤로가기만 | 없음 | `KeyboardAvoidingView` + 폼 |
| 피드 | 로고 + 검색 아이콘 | 표시 | `FlatList` + Pull-to-refresh |
| 에피그램 상세 | 뒤로가기 + 더보기 | 숨김 | `ScrollView` + 하단 고정 좋아요 바 |
| 작성·수정 | 취소 / 저장 | 숨김 | 풀스크린 modal, `KeyboardAvoidingView` |
| 검색 | 검색바 | 표시 | 최근 검색 Chip + 결과 `FlatList` |
| 마이 | 프로필 헤더 | 표시 | 탭 전환 (감정 캘린더 / 내 글 / 내 댓글) |

---

## 16. 다크 모드 (준비만)

- 현재 목표는 **라이트 모드 우선**. 토큰에 `background.dark`, `surface.dark`가 준비돼 있음
- 적용 시점엔 `useColorScheme`과 NativeWind의 `dark:` variant 사용
- 감정 illustration 색(yellow/green/purple/…)은 다크모드에서도 채도 유지 가능 — 변환 불필요

```tsx
<View className="bg-background dark:bg-background-dark">
```

---

## 체크리스트 (화면 구현 시)

- [ ] 모든 터치 요소가 44×44pt 이상인가? (`hitSlop` 또는 `min-h-[44px]`)
- [ ] 리스트는 `FlatList`를 사용했는가?
- [ ] Pull-to-refresh가 동작하는가?
- [ ] 키보드가 입력 필드를 가리지 않는가? (`KeyboardAvoidingView`)
- [ ] Loading / Empty / Error 3가지 상태가 모두 구현됐는가?
- [ ] 접근성 props(`accessibilityRole`, `accessibilityLabel`)가 지정됐는가?
- [ ] Safe Area가 고려됐는가?
- [ ] 아이콘은 `lucide-react-native`에서 가져왔는가?
- [ ] 토큰이 올바르게 사용됐는가? (임의 hex 없음)
- [ ] 웹과 동일한 Props 시그니처·네이밍 컨벤션을 유지했는가?
