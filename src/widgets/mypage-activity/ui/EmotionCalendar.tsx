import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useMemo, useState, type ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

import {
  EMOTION_META,
  useMonthlyEmotions,
  type Emotion,
} from "~/entities/emotion-log";

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
const TODAY = new Date();
const TODAY_YEAR = TODAY.getFullYear();
const TODAY_MONTH = TODAY.getMonth() + 1;
const TODAY_DATE = TODAY.getDate();

interface CalendarCell {
  day: number;
  isCurrentMonth: boolean;
  dateKey: string;
}

function padZero(n: number): string {
  return String(n).padStart(2, "0");
}

function buildCalendarCells(year: number, month: number): CalendarCell[] {
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysInPrevMonth = new Date(year, month - 1, 0).getDate();
  const cells: CalendarCell[] = [];

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    cells.push({
      day,
      isCurrentMonth: false,
      dateKey: `${prevYear}-${padZero(prevMonth)}-${padZero(day)}`,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
      isCurrentMonth: true,
      dateKey: `${year}-${padZero(month)}-${padZero(d)}`,
    });
  }

  const remainder = cells.length % 7;
  if (remainder !== 0) {
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const toAdd = 7 - remainder;
    for (let i = 1; i <= toAdd; i++) {
      cells.push({
        day: i,
        isCurrentMonth: false,
        dateKey: `${nextYear}-${padZero(nextMonth)}-${padZero(i)}`,
      });
    }
  }

  return cells;
}

interface MonthHeaderProps {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}

function MonthHeader({
  year,
  month,
  onPrev,
  onNext,
}: MonthHeaderProps): ReactElement {
  return (
    <View className="mb-4 flex-row items-center justify-between">
      <Text className="font-sans text-base font-semibold text-black-600">
        {year}년 {month}월
      </Text>
      <View className="flex-row items-center gap-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="이전 달"
          onPress={onPrev}
          className="h-8 w-8 items-center justify-center rounded-full active:bg-background"
        >
          <ChevronLeft size={18} color="#42526e" />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="다음 달"
          onPress={onNext}
          className="h-8 w-8 items-center justify-center rounded-full active:bg-background"
        >
          <ChevronRight size={18} color="#42526e" />
        </Pressable>
      </View>
    </View>
  );
}

interface DayCellProps {
  cell: CalendarCell;
  emotion: Emotion | undefined;
  isToday: boolean;
}

function DayCell({ cell, emotion, isToday }: DayCellProps): ReactElement {
  const borderClass = isToday ? "border-blue-500" : "border-line-200";
  const bgClass = cell.isCurrentMonth ? "bg-white" : "bg-background/60";
  const dayTextClass = cell.isCurrentMonth ? "text-black-500" : "text-gray-200";

  return (
    <View
      className={`aspect-square flex-1 items-center justify-center border ${borderClass} ${bgClass}`}
      style={{ minWidth: 0 }}
    >
      {emotion ? (
        <>
          <Text className="font-sans text-[10px] font-semibold text-gray-300">
            {cell.day}
          </Text>
          <Text style={{ fontSize: 18, marginTop: 2 }}>
            {EMOTION_META[emotion].emoji}
          </Text>
        </>
      ) : (
        <Text className={`font-sans text-sm font-medium ${dayTextClass}`}>
          {cell.day}
        </Text>
      )}
    </View>
  );
}

interface EmotionCalendarProps {
  userId: number;
}

export function EmotionCalendar({
  userId,
}: EmotionCalendarProps): ReactElement {
  const [year, setYear] = useState(TODAY_YEAR);
  const [month, setMonth] = useState(TODAY_MONTH);

  const { data: emotionLogs = [] } = useMonthlyEmotions({
    userId,
    year,
    month,
  });

  const emotionByDate = useMemo(() => {
    const map = new Map<string, Emotion>();
    for (const log of emotionLogs) {
      const d = new Date(log.createdAt);
      const key = `${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(d.getDate())}`;
      map.set(key, log.emotion);
    }
    return map;
  }, [emotionLogs]);

  const cells = useMemo(() => buildCalendarCells(year, month), [year, month]);

  function handlePrevMonth(): void {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
      return;
    }
    setMonth((m) => m - 1);
  }

  function handleNextMonth(): void {
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
      return;
    }
    setMonth((m) => m + 1);
  }

  function isCellToday(cell: CalendarCell): boolean {
    return (
      cell.isCurrentMonth &&
      year === TODAY_YEAR &&
      month === TODAY_MONTH &&
      cell.day === TODAY_DATE
    );
  }

  return (
    <View className="rounded-2xl bg-white px-4 py-5">
      <MonthHeader
        year={year}
        month={month}
        onPrev={handlePrevMonth}
        onNext={handleNextMonth}
      />

      <View className="flex-row">
        {WEEKDAY_LABELS.map((label) => (
          <View key={label} className="flex-1 items-center py-2">
            <Text className="font-sans text-xs font-semibold text-gray-300">
              {label}
            </Text>
          </View>
        ))}
      </View>

      <View className="flex-row flex-wrap">
        {cells.map((cell, index) => (
          <View
            key={`${cell.dateKey}-${index}`}
            style={{ width: `${100 / 7}%` }}
          >
            <DayCell
              cell={cell}
              emotion={emotionByDate.get(cell.dateKey)}
              isToday={isCellToday(cell)}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
