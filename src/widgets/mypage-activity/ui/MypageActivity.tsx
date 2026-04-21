import { type ReactElement } from "react";
import { View } from "react-native";

import { useMonthlyEmotions } from "~/entities/emotion-log";

import { EmotionCalendar } from "./EmotionCalendar";
import { EmotionPieChart } from "./EmotionPieChart";

const NOW = new Date();

interface MypageActivityProps {
  userId: number;
}

export function MypageActivity({ userId }: MypageActivityProps): ReactElement {
  const { data: monthlyLogs = [] } = useMonthlyEmotions({
    userId,
    year: NOW.getFullYear(),
    month: NOW.getMonth() + 1,
  });

  return (
    <View className="gap-4">
      <EmotionCalendar userId={userId} />
      <EmotionPieChart emotionLogs={monthlyLogs} />
    </View>
  );
}
