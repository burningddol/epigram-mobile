import { useState, type ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

import { useMyComments } from "~/entities/comment";
import { useEpigrams } from "~/entities/epigram";

import { MYPAGE_LIST_PAGE_SIZE } from "./constants";
import { MyCommentList } from "./MyCommentList";
import { MyEpigramList } from "./MyEpigramList";

type ActiveTab = "epigrams" | "comments";

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

function TabButton({ label, isActive, onPress }: TabButtonProps): ReactElement {
  const textClass = isActive ? "text-black-600" : "text-gray-300";

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      onPress={onPress}
    >
      <Text className={`font-sans text-base font-semibold ${textClass}`}>
        {label}
      </Text>
    </Pressable>
  );
}

interface TabbedSectionProps {
  userId: number;
}

export function TabbedSection({ userId }: TabbedSectionProps): ReactElement {
  const [activeTab, setActiveTab] = useState<ActiveTab>("epigrams");

  const { totalCount: epigramCount = 0 } = useEpigrams({
    limit: MYPAGE_LIST_PAGE_SIZE,
    writerId: userId,
  });
  const { totalCount: commentCount = 0 } = useMyComments({
    userId,
    limit: MYPAGE_LIST_PAGE_SIZE,
  });

  return (
    <View className="gap-5">
      <View className="flex-row items-center gap-5">
        <TabButton
          label={`내 에피그램(${epigramCount})`}
          isActive={activeTab === "epigrams"}
          onPress={() => setActiveTab("epigrams")}
        />
        <TabButton
          label={`내 댓글(${commentCount})`}
          isActive={activeTab === "comments"}
          onPress={() => setActiveTab("comments")}
        />
      </View>

      {activeTab === "epigrams" ? (
        <MyEpigramList userId={userId} />
      ) : (
        <MyCommentList userId={userId} />
      )}
    </View>
  );
}
