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

  const { data: epigramsData } = useEpigrams({
    limit: MYPAGE_LIST_PAGE_SIZE,
    writerId: userId,
  });
  const { data: commentsData } = useMyComments({
    userId,
    limit: MYPAGE_LIST_PAGE_SIZE,
  });
  const epigramCount = epigramsData?.pages[0]?.totalCount ?? 0;
  const commentCount = commentsData?.pages[0]?.totalCount ?? 0;

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

      <View style={{ display: activeTab === "epigrams" ? "flex" : "none" }}>
        <MyEpigramList userId={userId} />
      </View>
      <View style={{ display: activeTab === "comments" ? "flex" : "none" }}>
        <MyCommentList userId={userId} />
      </View>
    </View>
  );
}
