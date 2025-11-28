import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { getDayKey } from "@/shared/utils/date-utils";
import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { trackerQueryKeys } from "../../hooks/use-tracker-data";
import { trackerService } from "../../service/tracker";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DAY_WIDTH = (SCREEN_WIDTH - 40) / 7; // 7 days, 20px padding each side

type Props = {
  selectedDate: string;
  onDateChange: (date: string) => void;
  userId: string;
  lang: "es" | "en";
};

type DayInfo = {
  date: string;
  dayNumber: number;
  dayName: string;
  isToday: boolean;
  isSelected: boolean;
  isFuture: boolean;
};

const DAY_NAMES = {
  es: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

export const WeekStrip: React.FC<Props> = ({
  selectedDate,
  onDateChange,
  userId,
  lang,
}) => {
  const { colors } = useColorScheme();
  const queryClient = useQueryClient();
  const scrollViewRef = useRef<ScrollView>(null);

  // Animation for selection indicator
  const selectionAnim = useRef(new Animated.Value(0)).current;

  // Generate current week days (centered on today, showing past days)
  const weekDays = useMemo((): DayInfo[] => {
    const today = getDayKey();
    const todayDate = new Date(today + "T12:00:00");
    const days: DayInfo[] = [];

    // Show 7 days: 6 past days + today
    for (let i = -6; i <= 0; i++) {
      const date = new Date(todayDate);
      date.setDate(todayDate.getDate() + i);
      const dateKey = getDayKey(date);

      days.push({
        date: dateKey,
        dayNumber: date.getDate(),
        dayName: DAY_NAMES[lang][date.getDay()],
        isToday: dateKey === today,
        isSelected: dateKey === selectedDate,
        isFuture: dateKey > today,
      });
    }

    return days;
  }, [selectedDate, lang]);

  // Prefetch adjacent days when date changes
  useEffect(() => {
    if (!userId) return;

    const prefetchDays = async () => {
      const [year, month, day] = selectedDate.split("-").map(Number);
      const currentDate = new Date(year, month - 1, day);

      // Prefetch yesterday
      const yesterday = new Date(currentDate);
      yesterday.setDate(currentDate.getDate() - 1);
      const yesterdayKey = getDayKey(yesterday);

      // Prefetch day before yesterday
      const dayBefore = new Date(currentDate);
      dayBefore.setDate(currentDate.getDate() - 2);
      const dayBeforeKey = getDayKey(dayBefore);

      // Prefetch in background (don't await)
      queryClient.prefetchQuery({
        queryKey: trackerQueryKeys.dayData(userId, yesterdayKey),
        queryFn: () => trackerService.getDayData(yesterdayKey, userId),
        staleTime: Infinity, // Past data doesn't change
      });

      queryClient.prefetchQuery({
        queryKey: trackerQueryKeys.dayData(userId, dayBeforeKey),
        queryFn: () => trackerService.getDayData(dayBeforeKey, userId),
        staleTime: Infinity,
      });
    };

    prefetchDays();
  }, [selectedDate, userId, queryClient]);

  // Animate selection when it changes
  useEffect(() => {
    Animated.spring(selectionAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  }, [selectedDate, selectionAnim]);

  const handleDayPress = useCallback(
    (date: string) => {
      if (date > getDayKey()) return; // Don't allow future dates

      // Reset animation
      selectionAnim.setValue(0);

      // Change date immediately (optimistic)
      onDateChange(date);
    },
    [onDateChange, selectionAnim]
  );

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 4,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {weekDays.map((day) => (
          <DayItem
            key={day.date}
            day={day}
            onPress={handleDayPress}
            colors={colors}
            selectionAnim={day.isSelected ? selectionAnim : undefined}
          />
        ))}
      </ScrollView>
    </View>
  );
};

// Separate component for day item (performance)
const DayItem: React.FC<{
  day: DayInfo;
  onPress: (date: string) => void;
  colors: any;
  selectionAnim?: Animated.Value;
}> = React.memo(({ day, onPress, colors, selectionAnim }) => {
  const scale = selectionAnim
    ? selectionAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1],
      })
    : 1;

  return (
    <TouchableOpacity
      onPress={() => onPress(day.date)}
      disabled={day.isFuture}
      activeOpacity={0.7}
      style={{
        width: DAY_WIDTH,
        alignItems: "center",
        paddingVertical: 8,
        opacity: day.isFuture ? 0.3 : 1,
      }}
    >
      {/* Day name */}
      <Typography
        variant="caption"
        weight={day.isToday ? "semibold" : "normal"}
        style={{
          color: day.isToday ? colors.primary[500] : colors.textMuted,
          marginBottom: 6,
        }}
      >
        {day.dayName}
      </Typography>

      {/* Day number with selection indicator */}
      <Animated.View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: day.isSelected
            ? colors.primary[500]
            : day.isToday
            ? colors.primary[500] + "15"
            : "transparent",
          transform: [{ scale }],
        }}
      >
        <Typography
          variant="body1"
          weight={day.isSelected || day.isToday ? "bold" : "medium"}
          style={{
            color: day.isSelected
              ? "#FFFFFF"
              : day.isToday
              ? colors.primary[500]
              : colors.text,
          }}
        >
          {day.dayNumber}
        </Typography>
      </Animated.View>

      {/* Today indicator dot */}
      {day.isToday && !day.isSelected && (
        <View
          style={{
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: colors.primary[500],
            marginTop: 4,
          }}
        />
      )}
    </TouchableOpacity>
  );
});

DayItem.displayName = "DayItem";
