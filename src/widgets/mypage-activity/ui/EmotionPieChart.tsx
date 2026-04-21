import { useMemo, type ReactElement } from "react";
import { Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

import type { Emotion, EmotionLog } from "~/entities/emotion-log";

interface EmotionMeta {
  label: string;
  emoji: string;
  color: string;
}

const EMOTION_META: Record<Emotion, EmotionMeta> = {
  MOVED: { label: "감동", emoji: "🥰", color: "#48bb98" },
  HAPPY: { label: "기쁨", emoji: "😊", color: "#fbc85b" },
  WORRIED: { label: "고민", emoji: "🤔", color: "#8e80e3" },
  SAD: { label: "슬픔", emoji: "😢", color: "#5195ee" },
  ANGRY: { label: "분노", emoji: "😠", color: "#e46e80" },
};

const EMOTION_ORDER: Emotion[] = ["MOVED", "HAPPY", "WORRIED", "SAD", "ANGRY"];

const CHART_SIZE = 140;
const RADIUS = 55;
const STROKE_WIDTH = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface ChartDatum {
  emotion: Emotion;
  count: number;
  percentage: number;
}

function buildChartData(emotionLogs: EmotionLog[]): ChartDatum[] {
  const counts = new Map<Emotion, number>();
  for (const log of emotionLogs) {
    counts.set(log.emotion, (counts.get(log.emotion) ?? 0) + 1);
  }

  const total = emotionLogs.length;
  if (total === 0) return [];

  return EMOTION_ORDER.filter((e) => counts.has(e)).map((emotion) => {
    const count = counts.get(emotion) ?? 0;
    return {
      emotion,
      count,
      percentage: Math.round((count / total) * 100),
    };
  });
}

interface DonutChartProps {
  data: ChartDatum[];
  total: number;
}

function DonutChart({ data, total }: DonutChartProps): ReactElement {
  let cumulative = 0;
  const center = CHART_SIZE / 2;

  return (
    <Svg width={CHART_SIZE} height={CHART_SIZE}>
      <G rotation="-90" origin={`${center}, ${center}`}>
        {data.map(({ emotion, count }) => {
          const dashLength = (count / total) * CIRCUMFERENCE;
          const offset = -cumulative;
          cumulative += dashLength;
          return (
            <Circle
              key={emotion}
              cx={center}
              cy={center}
              r={RADIUS}
              fill="none"
              stroke={EMOTION_META[emotion].color}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={`${dashLength} ${CIRCUMFERENCE - dashLength}`}
              strokeDashoffset={offset}
            />
          );
        })}
      </G>
    </Svg>
  );
}

interface LegendRowProps {
  datum: ChartDatum;
}

function LegendRow({ datum }: LegendRowProps): ReactElement {
  const meta = EMOTION_META[datum.emotion];

  return (
    <View className="flex-row items-center gap-2">
      <Text style={{ fontSize: 16 }}>{meta.emoji}</Text>
      <Text className="w-8 font-sans text-xs text-black-400">{meta.label}</Text>
      <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-blue-200">
        <View
          className="h-full rounded-full"
          style={{
            width: `${datum.percentage}%`,
            backgroundColor: meta.color,
          }}
        />
      </View>
      <Text className="w-9 text-right font-sans text-xs font-semibold text-black-600">
        {datum.percentage}%
      </Text>
    </View>
  );
}

interface EmotionPieChartProps {
  emotionLogs: EmotionLog[];
}

export function EmotionPieChart({
  emotionLogs,
}: EmotionPieChartProps): ReactElement {
  const chartData = useMemo(() => buildChartData(emotionLogs), [emotionLogs]);

  if (chartData.length === 0) {
    return (
      <View className="rounded-2xl bg-white px-4 py-5">
        <Text className="mb-3 font-sans text-base font-semibold text-black-600">
          감정 차트
        </Text>
        <View className="items-center py-8">
          <Text style={{ fontSize: 36, opacity: 0.3 }}>😊</Text>
          <Text className="mt-2 font-sans text-sm text-gray-300">
            이번 달 감정 기록이 없어요
          </Text>
        </View>
      </View>
    );
  }

  const total = chartData.reduce((sum, d) => sum + d.count, 0);
  const topEmotion = chartData.reduce((max, d) =>
    d.count > max.count ? d : max,
  );
  const topMeta = EMOTION_META[topEmotion.emotion];

  return (
    <View className="rounded-2xl bg-white px-4 py-5">
      <Text className="mb-4 font-sans text-base font-semibold text-black-600">
        감정 차트
      </Text>

      <View className="flex-row items-center gap-5">
        <View
          style={{ width: CHART_SIZE, height: CHART_SIZE }}
          className="items-center justify-center"
        >
          <DonutChart data={chartData} total={total} />
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              width: CHART_SIZE,
              height: CHART_SIZE,
            }}
            className="items-center justify-center"
          >
            <Text style={{ fontSize: 28 }}>{topMeta.emoji}</Text>
            <Text className="font-sans text-xs font-semibold text-black-500">
              {topMeta.label}
            </Text>
          </View>
        </View>

        <View className="flex-1 gap-2">
          {chartData.map((datum) => (
            <LegendRow key={datum.emotion} datum={datum} />
          ))}
        </View>
      </View>
    </View>
  );
}
