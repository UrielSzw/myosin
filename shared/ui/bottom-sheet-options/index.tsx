import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useMemo } from "react";
import { TouchableOpacity } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
  options: {
    type: string;
    label: string;
    method: () => void;
    icon?: React.ReactNode;
  }[];
  warningOption?: { label: string; method: () => void; icon?: React.ReactNode };
};

export const BottomSheetOptions = forwardRef<BottomSheetModal, Props>(
  ({ title, subtitle, options, warningOption }, ref) => {
    const { colors } = useColorScheme();

    const snapPoints = useMemo(() => ["50%"], []);

    const handleOptionPress = (type: string) => {
      const option = options.find((opt) => opt.type === type);
      option?.method();
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
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDynamicSizing={false}
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
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              {option.icon && option.icon}
              <Typography variant="body1">{option.label}</Typography>
            </TouchableOpacity>
          ))}

          {warningOption && (
            <TouchableOpacity
              onPress={warningOption.method}
              style={{
                paddingVertical: 16,
                paddingHorizontal: 16,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              {warningOption.icon && warningOption.icon}
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
