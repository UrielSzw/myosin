import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { routineFormTranslations } from "@/shared/translations/routine-form";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Minus, Plus, Timer } from "lucide-react-native";
import React, { forwardRef, useCallback, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Typography } from "../../typography";

type Props = {
  currentRestTime: number; // in seconds
  onSelectRestTime: (seconds: number) => void;
};

export const RestTimeBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ currentRestTime, onSelectRestTime }, ref) => {
    const { colors } = useColorScheme();
    const prefs = useUserPreferences();
    const lang = prefs?.language ?? "es";
    const t = routineFormTranslations;

    const [selectedTime, setSelectedTime] = useState<number | null>(null);

    const showSelectedTime =
      selectedTime !== null ? selectedTime : currentRestTime;

    // Predefined rest time options (in seconds)
    const quickOptions = [
      { label: t.noRest[lang], value: 0 },
      { label: "30 seg", value: 30 },
      { label: "45 seg", value: 45 },
      { label: "1 min", value: 60 },
      { label: "1:30 min", value: 90 },
      { label: "2 min", value: 120 },
      { label: "2:30 min", value: 150 },
      { label: "3 min", value: 180 },
      { label: "4 min", value: 240 },
      { label: "5 min", value: 300 },
    ];

    const formatTime = (seconds: number) => {
      if (seconds === 0) return "Sin descanso";
      if (seconds < 60) return `${seconds}s`;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return secs > 0
        ? `${mins}:${secs.toString().padStart(2, "0")} min`
        : `${mins} min`;
    };

    const handleIncrease = () => {
      const newTime = showSelectedTime + 5; // Increment by 5 seconds
      if (newTime <= 600) {
        // Max 10 minutes
        setSelectedTime(newTime);
      }
    };

    const handleDecrease = () => {
      const newTime = showSelectedTime - 5; // Decrement by 5 seconds
      if (newTime >= 0) {
        setSelectedTime(newTime);
      }
    };

    const handleSave = () => {
      onSelectRestTime(showSelectedTime);
      setSelectedTime(null);
    };

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={["60%"]}
        enablePanDownToClose
        backgroundStyle={{
          backgroundColor: colors.surface,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8, // Para Android
        }}
        handleIndicatorStyle={{ backgroundColor: colors.textMuted }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={{ padding: 16, paddingBottom: 40 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <Timer size={20} color={colors.primary[500]} />
            <Typography
              variant="h3"
              weight="semibold"
              style={{ marginLeft: 8 }}
            >
              {t.restTime[lang]}
            </Typography>
          </View>

          {/* Custom Time Selector */}
          <View style={{ marginBottom: 24 }}>
            <Typography
              variant="body2"
              color="textMuted"
              style={{ marginBottom: 12 }}
            >
              {t.customTime[lang]}
            </Typography>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.background,
                borderRadius: 12,
                padding: 16,
                borderWidth: 2,
                borderColor: colors.primary[500] + "30",
              }}
            >
              <TouchableOpacity
                onPress={handleDecrease}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: colors.primary[500],
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Minus size={20} color="white" />
              </TouchableOpacity>

              <View
                style={{ flex: 1, alignItems: "center", marginHorizontal: 24 }}
              >
                <Typography
                  variant="h2"
                  weight="bold"
                  style={{ color: colors.primary[500] }}
                >
                  {formatTime(showSelectedTime)}
                </Typography>
              </View>

              <TouchableOpacity
                onPress={handleIncrease}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: colors.primary[500],
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Plus size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Options */}
          <Typography
            variant="body2"
            color="textMuted"
            style={{ marginBottom: 12 }}
          >
            Opciones rápidas
          </Typography>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 24 }}
            contentContainerStyle={{ paddingHorizontal: 4 }}
          >
            {quickOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => setSelectedTime(option.value)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  marginRight: 8,
                  borderRadius: 20,
                  backgroundColor:
                    selectedTime === option.value
                      ? colors.primary[500]
                      : colors.border + "40",
                  borderWidth: 1,
                  borderColor:
                    selectedTime === option.value
                      ? colors.primary[500]
                      : colors.border,
                }}
              >
                <Typography
                  variant="caption"
                  weight="medium"
                  style={{
                    color:
                      selectedTime === option.value ? "white" : colors.text,
                  }}
                >
                  {option.label}
                </Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            style={{
              backgroundColor: colors.primary[500],
              paddingVertical: 16,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Typography
              variant="body1"
              weight="semibold"
              style={{ color: "white" }}
            >
              Aplicar Tiempo
            </Typography>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

RestTimeBottomSheet.displayName = "RestTimeBottomSheet";
