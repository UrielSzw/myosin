import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { getDayKey } from "@/shared/utils/date-utils";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type Props = {
  selectedDate: string;
  onDateChange: (date: string) => void;
};

export const DatePicker: React.FC<Props> = ({ selectedDate, onDateChange }) => {
  const { colors } = useColorScheme();

  const formatDate = (dateString: string) => {
    // Usar el dateString directamente para evitar problemas de timezone
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day); // month es 0-indexed

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Format for comparison (YYYY-MM-DD)
    const todayString = getDayKey(today);
    const yesterdayString = getDayKey(yesterday);

    if (dateString === todayString) return "Hoy";
    if (dateString === yesterdayString) return "Ayer";

    return date.toLocaleDateString("es-ES", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const goToPreviousDay = () => {
    // Crear fecha correctamente evitando problemas de timezone
    const [year, month, day] = selectedDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() - 1);
    onDateChange(getDayKey(date));
  };

  const goToNextDay = () => {
    // Crear fecha correctamente evitando problemas de timezone
    const [year, month, day] = selectedDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    const today = getDayKey();

    // Don't go beyond today
    if (selectedDate < today) {
      date.setDate(date.getDate() + 1);
      onDateChange(getDayKey(date));
    }
  };

  const goToToday = () => {
    const today = getDayKey();
    onDateChange(today);
  };

  const isToday = selectedDate === getDayKey();

  return (
    <Card variant="outlined" padding="lg" style={{ marginBottom: 24 }}>
      {/* Date Navigation */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          onPress={goToPreviousDay}
          style={{ padding: 8 }}
          activeOpacity={0.7}
        >
          <ChevronLeft size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goToToday}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
          }}
          activeOpacity={0.7}
        >
          <Calendar
            size={16}
            color={isToday ? colors.text : colors.textMuted}
          />
          <Typography
            variant="h6"
            weight="semibold"
            style={{ color: isToday ? colors.text : colors.textMuted }}
          >
            {formatDate(selectedDate)}
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goToNextDay}
          style={{
            padding: 8,
            opacity: isToday ? 0.3 : 1,
          }}
          activeOpacity={isToday ? 0.3 : 0.7}
          disabled={isToday}
        >
          <ChevronRight size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </Card>
  );
};
