import { Camera } from "lucide-react-native";
import { type ReactElement } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";

import { UserAvatar } from "~/shared/ui";

import { useProfileImageUpload } from "../model/useProfileImageUpload";

const AVATAR_SIZE = 100;

interface ProfileImageUploadButtonProps {
  image: string | null;
  nickname: string;
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
      style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
    >
      <UserAvatar image={image} nickname={nickname} size={AVATAR_SIZE} />

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
