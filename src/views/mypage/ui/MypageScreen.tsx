import { Redirect } from "expo-router";
import { LogOut, User as UserIcon } from "lucide-react-native";
import { type ReactElement } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useMe } from "~/entities/user";
import { useLogout } from "~/features/auth";
import { LoadingState } from "~/shared/ui";

const AVATAR_SIZE = 100;

interface ProfileAvatarProps {
  image: string | null;
  nickname: string;
}

function ProfileAvatar({ image, nickname }: ProfileAvatarProps): ReactElement {
  if (image) {
    return (
      <Image
        source={{ uri: image }}
        accessibilityLabel={nickname}
        style={{
          width: AVATAR_SIZE,
          height: AVATAR_SIZE,
          borderRadius: AVATAR_SIZE / 2,
        }}
      />
    );
  }

  return (
    <View
      className="items-center justify-center rounded-full bg-blue-200"
      style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
    >
      <UserIcon size={44} color="#2b6cb0" />
    </View>
  );
}

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

  if (isLoading) return <LoadingState />;
  if (!user) return <Redirect href="/login" />;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        contentContainerClassName="px-screen-x pb-10 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center gap-3">
          <ProfileAvatar image={user.image} nickname={user.nickname} />
          <Text className="font-sans text-xl font-bold text-black-800">
            {user.nickname}
          </Text>
          <LogoutButton onPress={handleLogout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
