import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef } from "react";
import { Platform, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  title: string;
  subtitle?: string;
  options: { type: string; label: string; method: () => void }[];
  warningOption?: { label: string; method: () => void };
  addBottomInset?: boolean;
};

export const BottomSheetOptions = forwardRef<BottomSheetModal, Props>(
  ({ title, subtitle, options, warningOption, addBottomInset }, ref) => {
    const { colors } = useColorScheme();
    const insets = useSafeAreaInsets();

    // Calcular el bottomInset considerando el tab bar
    const tabBarHeight = Platform.OS === "ios" ? 49 : 56;
    const bottomInset = insets.bottom + tabBarHeight;

    const handleOptionPress = (type: string) => {
      const option = options.find((opt) => opt.type === type);
      option?.method();
    };

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={["50%"]}
        enablePanDownToClose
        bottomInset={addBottomInset ? bottomInset : 0}
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
      >
        <BottomSheetView style={{ padding: 16, paddingBottom: 40 }}>
          <Typography
            variant="h3"
            weight="semibold"
            style={{ marginBottom: 16 }}
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography
              variant="caption"
              color="textMuted"
              style={{ marginBottom: 16 }}
            >
              {subtitle}
            </Typography>
          )}

          {options.map((option) => (
            <TouchableOpacity
              key={option.type}
              onPress={() => handleOptionPress(option.type)}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <Typography variant="body1">{option.label}</Typography>
            </TouchableOpacity>
          ))}

          {warningOption && (
            <TouchableOpacity
              onPress={warningOption.method}
              style={{ paddingVertical: 16, paddingHorizontal: 16 }}
            >
              <Typography variant="body1" style={{ color: colors.error[500] }}>
                {warningOption.label}
              </Typography>
            </TouchableOpacity>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

BottomSheetOptions.displayName = "BottomSheetOptions";
