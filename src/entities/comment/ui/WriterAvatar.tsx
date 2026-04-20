import { User } from "lucide-react-native";
import type { ReactElement } from "react";
import { Image, View } from "react-native";

interface WriterAvatarProps {
  writer: { image: string | null; nickname: string };
  size?: number;
}

export function WriterAvatar({
  writer,
  size = 36,
}: WriterAvatarProps): ReactElement {
  if (writer.image) {
    return (
      <Image
        source={{ uri: writer.image }}
        accessibilityLabel={writer.nickname}
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
