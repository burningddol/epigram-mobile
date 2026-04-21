import { useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert } from "react-native";

import { updateMe, userKeys } from "~/entities/user";
import { toUploadImageFile, uploadImage } from "~/shared/api";

interface UseProfileImageUploadReturn {
  isUploading: boolean;
  pickAndUpload: () => Promise<void>;
}

export function useProfileImageUpload(): UseProfileImageUploadReturn {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  async function ensurePermission(): Promise<boolean> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "권한 필요",
        "프로필 이미지 업로드를 위해 사진 접근 권한이 필요합니다.",
      );
      return false;
    }
    return true;
  }

  async function pickAndUpload(): Promise<void> {
    if (isUploading) return;

    const allowed = await ensurePermission();
    if (!allowed) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;
    const asset = result.assets[0];
    if (!asset) return;

    setIsUploading(true);
    try {
      const file = toUploadImageFile(asset);
      const imageUrl = await uploadImage(file);
      await updateMe({ image: imageUrl });
      await queryClient.invalidateQueries({ queryKey: userKeys.me() });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "이미지 업로드에 실패했습니다. 다시 시도해주세요.";
      Alert.alert("업로드 실패", message);
    } finally {
      setIsUploading(false);
    }
  }

  return { isUploading, pickAndUpload };
}
