import { LogOut } from "lucide-react-native";
import { type ReactElement } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useMe } from "~/entities/user";
import { useLogout } from "~/features/auth";
import { EmotionSelector } from "~/features/emotion-select";
import { ProfileImageUploadButton } from "~/features/profile-image-upload";
import { LoadingState } from "~/shared/ui";
import { MypageActivity } from "~/widgets/mypage-activity";

interface LogoutButtonProps {
  onPress: () => void;
}

function LogoutButton({ onPress }: LogoutButtonProps): ReactElement {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="로그아웃"
      className="flex-row items-center gap-1.5 rounded-full border border-line-200 px-4 py-1.5 active:bg-blue-100"
    >
      <LogOut size={14} color="#7b8caf" />
      <Text className="font-sans text-xs text-black-400">로그아웃</Text>
    </Pressable>
  );
}

export function MypageScreen(): ReactElement | null {
  const { user, isLoading } = useMe();
  const { handleLogout } = useLogout();

  if (isLoading || !user) return <LoadingState />;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        contentContainerClassName="px-screen-x pb-10 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center gap-3">
          <ProfileImageUploadButton
            image={user.image}
            nickname={user.nickname}
          />
          <Text className="font-sans text-xl font-bold text-black-800">
            {user.nickname}
          </Text>
          <LogoutButton onPress={handleLogout} />
        </View>
        <View className="mt-8">
          <EmotionSelector />
        </View>
        <View className="mt-4">
          <MypageActivity userId={user.id} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
