import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import type { ThemeColors } from "@/shared/types/theme";
import { Typography } from "@/shared/ui/typography";
import { getDayKey } from "@/shared/utils/date-utils";
import { useQueryClient } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { trackerQueryKeys } from "../hooks/use-tracker-data";
import { trackerService } from "../service/tracker";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DAY_WIDTH = (SCREEN_WIDTH - 40 - 24) / 7; // 7 days, 20px padding each side, 24px internal padding

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
  es: ["D", "L", "M", "X", "J", "V", "S"],
  en: ["S", "M", "T", "W", "T", "F", "S"],
};

export const WeekStripV2: React.FC<Props> = ({
  selectedDate,
  onDateChange,
  userId,
  lang,
}) => {
  const { colors, isDarkMode } = useColorScheme();
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

      // Prefetch in background
      queryClient.prefetchQuery({
        queryKey: trackerQueryKeys.dayData(userId, yesterdayKey),
        queryFn: () => trackerService.getDayData(yesterdayKey, userId),
        staleTime: Infinity,
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
      if (date > getDayKey()) return;

      // Reset animation
      selectionAnim.setValue(0);

      // Change date immediately
      onDateChange(date);
    },
    [onDateChange, selectionAnim]
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? "rgba(255,255,255,0.04)"
            : "rgba(255,255,255,0.7)",
          borderColor: isDarkMode
            ? "rgba(255,255,255,0.08)"
            : "rgba(0,0,0,0.06)",
        },
      ]}
    >
      {Platform.OS === "ios" && (
        <BlurView
          intensity={isDarkMode ? 15 : 30}
          tint={isDarkMode ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
      )}

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {weekDays.map((day) => (
          <DayItemV2
            key={day.date}
            day={day}
            onPress={handleDayPress}
            colors={colors}
            isDarkMode={isDarkMode}
            selectionAnim={day.isSelected ? selectionAnim : undefined}
          />
        ))}
      </ScrollView>
    </View>
  );
};

// Separate component for day item (performance)
const DayItemV2: React.FC<{
  day: DayInfo;
  onPress: (date: string) => void;
  colors: ThemeColors;
  isDarkMode: boolean;
  selectionAnim?: Animated.Value;
}> = React.memo(({ day, onPress, colors, isDarkMode, selectionAnim }) => {
  const scale = selectionAnim
    ? selectionAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1],
      })
    : 1;

  return (
    <Pressable
      onPress={() => onPress(day.date)}
      disabled={day.isFuture}
      style={({ pressed }) => [
        styles.dayItem,
        {
          width: DAY_WIDTH,
          opacity: day.isFuture ? 0.3 : pressed ? 0.7 : 1,
        },
      ]}
    >
      {/* Day name */}
      <Typography
        variant="caption"
        weight={day.isToday ? "bold" : "medium"}
        style={{
          color: day.isToday ? colors.primary[500] : colors.textMuted,
          marginBottom: 8,
          fontSize: 11,
        }}
      >
        {day.dayName}
      </Typography>

      {/* Day number with selection indicator */}
      <Animated.View
        style={[
          styles.dayCircle,
          {
            backgroundColor: day.isSelected
              ? colors.primary[500]
              : day.isToday
              ? `${colors.primary[500]}15`
              : "transparent",
            transform: [{ scale }],
            // Shadow for selected
            ...(day.isSelected
              ? {
                  shadowColor: colors.primary[500],
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 4,
                }
              : {}),
          },
        ]}
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
            fontSize: 15,
          }}
        >
          {day.dayNumber}
        </Typography>
      </Animated.View>

      {/* Today indicator dot */}
      {day.isToday && !day.isSelected && (
        <View
          style={[styles.todayDot, { backgroundColor: colors.primary[500] }]}
        />
      )}
    </Pressable>
  );
});

DayItemV2.displayName = "DayItemV2";

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 16,
  },
  scrollContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  dayItem: {
    alignItems: "center",
    paddingVertical: 4,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 6,
  },
});
