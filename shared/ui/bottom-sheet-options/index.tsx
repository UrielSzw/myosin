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
  enableDynamicSizing?: boolean;
  snapPoints?: string[];
};

export const BottomSheetOptions = forwardRef<BottomSheetModal, Props>(
  (
    {
      title,
      subtitle,
      options,
      warningOption,
      enableDynamicSizing = true,
      snapPoints = ["50%"],
    },
    ref
  ) => {
    const { colors } = useColorScheme();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const snapPointsMemo = useMemo(() => snapPoints, []);

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
        snapPoints={snapPointsMemo}
        enablePanDownToClose
        enableDynamicSizing={enableDynamicSizing}
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
