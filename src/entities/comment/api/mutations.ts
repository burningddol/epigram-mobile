import { apiClient } from "~/shared/api/client";

import type { Comment } from "../model/schema";

export interface CreateCommentBody {
  epigramId: number;
  isPrivate: boolean;
  content: string;
}

export interface UpdateCommentBody {
  isPrivate?: boolean;
  content?: string;
}

export async function createComment(body: CreateCommentBody): Promise<Comment> {
  const response = await apiClient.post<Comment>("/comments", body);
  return response.data;
}

export async function updateComment(
  commentId: number,
  body: UpdateCommentBody,
): Promise<Comment> {
  const response = await apiClient.patch<Comment>(
    `/comments/${commentId}`,
    body,
  );
  return response.data;
}

export async function deleteComment(commentId: number): Promise<void> {
  await apiClient.delete(`/comments/${commentId}`);
}
