import { Camera, User as UserIcon } from "lucide-react-native";
import { type ReactElement } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  View,
  type ImageStyle,
} from "react-native";

import { useProfileImageUpload } from "../model/useProfileImageUpload";

const AVATAR_SIZE = 100;

interface ProfileImageUploadButtonProps {
  image: string | null;
  nickname: string;
}

function AvatarContent({
  image,
  nickname,
}: ProfileImageUploadButtonProps): ReactElement {
  const baseStyle: ImageStyle = {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  };

  if (image) {
    return (
      <Image
        source={{ uri: image }}
        accessibilityLabel={nickname}
        style={baseStyle}
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

export function ProfileImageUploadButton({
  image,
  nickname,
}: ProfileImageUploadButtonProps): ReactElement {
  const { isUploading, pickAndUpload } = useProfileImageUpload();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="프로필 이미지 변경"
      accessibilityState={{ disabled: isUploading }}
      disabled={isUploading}
      onPress={() => {
        void pickAndUpload();
      }}
      className="overflow-hidden rounded-full"
      style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
    >
      <AvatarContent image={image} nickname={nickname} />

      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          right: 2,
          bottom: 2,
          width: 32,
          height: 32,
          borderRadius: 16,
        }}
        className="items-center justify-center bg-blue-500"
      >
        {isUploading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Camera size={16} color="#ffffff" />
        )}
      </View>
    </Pressable>
  );
}
