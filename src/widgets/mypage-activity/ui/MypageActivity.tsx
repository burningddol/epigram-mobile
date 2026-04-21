import { type ReactElement } from "react";
import { View } from "react-native";

import { ErrorBoundary, SectionErrorFallback } from "~/shared/ui";

import { EmotionCalendar } from "./EmotionCalendar";
import { EmotionPieChart } from "./EmotionPieChart";
import { TabbedSection } from "./TabbedSection";

interface MypageActivityProps {
  userId: number;
}

export function MypageActivity({ userId }: MypageActivityProps): ReactElement {
  return (
    <View className="gap-4">
      <ErrorBoundary
        fallback={(_, reset) => <SectionErrorFallback reset={reset} />}
      >
        <EmotionCalendar userId={userId} />
      </ErrorBoundary>
      <ErrorBoundary
        fallback={(_, reset) => <SectionErrorFallback reset={reset} />}
      >
        <EmotionPieChart userId={userId} />
      </ErrorBoundary>
      <ErrorBoundary
        fallback={(_, reset) => <SectionErrorFallback reset={reset} />}
      >
        <TabbedSection userId={userId} />
      </ErrorBoundary>
    </View>
  );
}
