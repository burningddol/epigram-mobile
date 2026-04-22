import type { ReactElement } from "react";
import { Text, View } from "react-native";

const WRITING_TIPS = [
  "500자 이내의 짧고 인상적인 문장을 담아보세요.",
  "출처가 있다면 함께 기록해두면 좋습니다.",
  "태그를 활용하면 비슷한 글귀를 찾기 쉬워집니다.",
];

export function WritingTips(): ReactElement {
  return (
    <View className="gap-2 rounded-2xl bg-blue-100 p-4">
      <Text className="font-sans text-sm font-semibold text-blue-800">
        작성 팁
      </Text>
      {WRITING_TIPS.map((tip) => (
        <Text key={tip} className="font-sans text-sm text-blue-700">
          • {tip}
        </Text>
      ))}
    </View>
  );
}
