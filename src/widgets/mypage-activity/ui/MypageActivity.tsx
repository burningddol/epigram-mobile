import { type ReactElement } from "react";
import { View } from "react-native";

import { EmotionCalendar } from "./EmotionCalendar";
import { EmotionPieChart } from "./EmotionPieChart";
import { TabbedSection } from "./TabbedSection";

interface MypageActivityProps {
  userId: number;
}

export function MypageActivity({ userId }: MypageActivityProps): ReactElement {
  return (
    <View className="gap-4">
      <EmotionCalendar userId={userId} />
      <EmotionPieChart userId={userId} />
      <View className="mt-4">
        <TabbedSection userId={userId} />
      </View>
    </View>
  );
}
