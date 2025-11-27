import { WEEK_DAYS } from "@/shared/constants/analytics";
import { RoutineFull } from "@/shared/db/schema";
import { Typography } from "@/shared/ui/typography";
import { StyleSheet, View } from "react-native";

export const DayIndicator: React.FC<{
  day: (typeof WEEK_DAYS)[0];
  routines: RoutineFull[];
  colors: any;
}> = ({ day, routines, colors }) => {
  const isActive = routines.length > 0;
  const isToday = new Date().getDay() === getDayNumber(day.key);

  // Get first routine name, truncated
  const routineName = isActive ? truncateName(routines[0].name) : "—";
  const hasMultiple = routines.length > 1;

  return (
    <View style={styles.container}>
      {/* Day letter */}
      <View
        style={[
          styles.dayBadge,
          {
            backgroundColor: isToday
              ? colors.primary[500]
              : isActive
              ? colors.primary[100]
              : colors.gray[100],
          },
        ]}
      >
        <Typography
          variant="caption"
          weight="bold"
          style={{
            color: isToday
              ? "#ffffff"
              : isActive
              ? colors.primary[700]
              : colors.gray[500],
            fontSize: 11,
          }}
        >
          {day.short.charAt(0)}
        </Typography>
      </View>

      {/* Routine name */}
      <Typography
        variant="caption"
        weight={isActive ? "medium" : "regular"}
        numberOfLines={1}
        style={[
          styles.routineName,
          {
            color: isActive ? colors.text : colors.gray[400],
          },
        ]}
      >
        {routineName}
      </Typography>

      {/* Multiple indicator */}
      {hasMultiple && (
        <Typography
          variant="caption"
          style={{ color: colors.primary[500], fontSize: 9 }}
        >
          +{routines.length - 1}
        </Typography>
      )}
    </View>
  );
};

const truncateName = (name: string): string => {
  if (name.length <= 6) return name;
  return name.slice(0, 5) + "…";
};

const getDayNumber = (dayKey: string): number => {
  const days: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };
  return days[dayKey] ?? -1;
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    gap: 6,
  },
  dayBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  routineName: {
    fontSize: 10,
    textAlign: "center",
    minHeight: 14,
  },
});
