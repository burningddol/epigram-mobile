import { User } from "lucide-react-native";
import type { ReactElement } from "react";
import { Image, View } from "react-native";

interface UserAvatarProps {
  image: string | null;
  nickname: string;
  size?: number;
}

export function UserAvatar({
  image,
  nickname,
  size = 36,
}: UserAvatarProps): ReactElement {
  if (image) {
    return (
      <Image
        source={{ uri: image }}
        accessibilityLabel={nickname}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  }

  return (
    <View
      className="items-center justify-center rounded-full bg-blue-200"
      style={{ width: size, height: size }}
    >
      <User size={Math.round(size * 0.45)} color="#2b6cb0" />
    </View>
  );
}
