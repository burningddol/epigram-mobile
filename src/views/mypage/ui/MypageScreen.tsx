import { type ReactElement } from "react";
import { ScrollView, Text, View } from "react-native";

import { useMe } from "~/entities/user";
import { LogoutButton } from "~/features/auth";
import { EmotionSelector } from "~/features/emotion-select";
import { ProfileImageUploadButton } from "~/features/profile-image-upload";
import { LoadingState, ScreenLayout } from "~/shared/ui";
import { MypageActivity } from "~/widgets/mypage-activity";

export function MypageScreen(): ReactElement | null {
  const { user, isLoading } = useMe();

  if (isLoading || !user) return <LoadingState />;

  return (
    <ScreenLayout showBackButton={false} withKeyboardAvoiding={false}>
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
          <LogoutButton />
        </View>
        <View className="mt-8">
          <EmotionSelector />
        </View>
        <View className="mt-4">
          <MypageActivity userId={user.id} />
        </View>
      </ScrollView>
    </ScreenLayout>
  );
}
