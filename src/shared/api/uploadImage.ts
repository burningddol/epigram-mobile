import { apiClient } from "./client";

const ALLOWED_IMAGE_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
]);

const ASCII_ONLY = /^[\x20-\x7E]+$/;

export interface UploadImageFile {
  uri: string;
  name: string;
  mimeType: string;
}

function extractFileName(uri: string): string {
  const parts = uri.split("/");
  return parts[parts.length - 1] ?? "upload";
}

export async function uploadImage(file: UploadImageFile): Promise<string> {
  if (!ALLOWED_IMAGE_MIME.has(file.mimeType)) {
    throw new Error(
      "jpg, png, gif, webp 형식의 이미지만 업로드할 수 있습니다.",
    );
  }

  if (!ASCII_ONLY.test(file.name)) {
    throw new Error("파일명은 영문만 사용할 수 있습니다.");
  }

  const formData = new FormData();
  formData.append("image", {
    uri: file.uri,
    name: file.name,
    type: file.mimeType,
  } as unknown as Blob);

  const response = await apiClient.post<{ url: string }>(
    "/images/upload",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );

  return response.data.url;
}

export function toUploadImageFile(asset: {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
}): UploadImageFile {
  const name = asset.fileName ?? extractFileName(asset.uri);
  const mimeType = asset.mimeType ?? "image/jpeg";
  return { uri: asset.uri, name, mimeType };
}
