import { WEEK_DAYS } from "@/shared/constants/analytics";
import { RoutineFull } from "@/shared/db/schema";
import { Typography } from "@/shared/ui/typography";
import { View } from "react-native";

export const DayIndicator: React.FC<{
  day: (typeof WEEK_DAYS)[0];
  routines: RoutineFull[];
  colors: any;
}> = ({ day, routines, colors }) => {
  const isActive = routines.length > 0;
  const firstRoutine = routines[0];
  const hasMultiple = routines.length > 1;

  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <Typography
        variant="caption"
        color="textMuted"
        style={{ marginBottom: 6 }}
      >
        {day.short}
      </Typography>

      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: isActive ? colors.primary[500] : colors.gray[200],
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {isActive ? (
          <Typography
            variant="caption"
            weight="bold"
            style={{ color: colors.white }}
          >
            {routines.length}
          </Typography>
        ) : (
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.gray[400],
            }}
          />
        )}

        {hasMultiple && (
          <View
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.warning[500],
            }}
          />
        )}
      </View>

      {isActive && firstRoutine && (
        <Typography
          variant="caption"
          color="textMuted"
          numberOfLines={1}
          style={{
            marginTop: 4,
            maxWidth: 40,
            textAlign: "center",
            fontSize: 9,
          }}
        >
          {firstRoutine.name}
        </Typography>
      )}
    </View>
  );
};
