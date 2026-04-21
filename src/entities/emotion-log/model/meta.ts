import type { Emotion } from "./schema";

export interface EmotionMeta {
  label: string;
  emoji: string;
  color: string;
}

export const EMOTION_META: Record<Emotion, EmotionMeta> = {
  MOVED: { label: "감동", emoji: "🥰", color: "#48bb98" },
  HAPPY: { label: "기쁨", emoji: "😊", color: "#fbc85b" },
  WORRIED: { label: "고민", emoji: "🤔", color: "#8e80e3" },
  SAD: { label: "슬픔", emoji: "😢", color: "#5195ee" },
  ANGRY: { label: "분노", emoji: "😠", color: "#e46e80" },
};

export const EMOTION_ORDER: readonly Emotion[] = [
  "MOVED",
  "HAPPY",
  "WORRIED",
  "SAD",
  "ANGRY",
];
