import type { ReactElement } from "react";
import { Text, View } from "react-native";

export function SearchInitialState(): ReactElement {
  return (
    <View className="items-center gap-4 py-24">
      <Text
        className="select-none font-serif text-7xl text-blue-300"
        accessibilityElementsHidden
      >
        {"“"}
      </Text>
      <View className="items-center gap-1.5 px-screen-x">
        <Text className="text-center font-serif text-base text-black-500">
          검색어를 입력해 에피그램을 찾아보세요
        </Text>
        <Text className="text-center font-sans text-xs text-black-300">
          작가 이름, 글귀, 태그 모두 검색 가능합니다
        </Text>
      </View>
    </View>
  );
}
