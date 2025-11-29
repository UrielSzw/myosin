import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { X } from "lucide-react-native";
import React, { forwardRef, useCallback, useMemo } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";

type Props = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  options: {
    type: string;
    label: string;
    method: () => void;
    icon?: React.ReactNode;
    description?: string;
  }[];
  warningOption?: {
    label: string;
    method: () => void;
    icon?: React.ReactNode;
    description?: string;
  };
  enableDynamicSizing?: boolean;
  snapPoints?: string[];
};

export const BottomSheetOptions = forwardRef<BottomSheetModal, Props>(
  (
    {
      title,
      subtitle,
      icon,
      options,
      warningOption,
      enableDynamicSizing = true,
      snapPoints = ["50%"],
    },
    ref
  ) => {
    const { colors, isDarkMode } = useColorScheme();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const snapPointsMemo = useMemo(() => snapPoints, []);

    const handleOptionPress = (type: string) => {
      const option = options.find((opt) => opt.type === type);
      option?.method();
    };

    const handleDismiss = useCallback(() => {
      if (ref && "current" in ref && ref.current) {
        ref.current.dismiss();
      }
    }, [ref]);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
          style={[props.style, { backgroundColor: "rgba(0,0,0,0.6)" }]}
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
          backgroundColor: isDarkMode
            ? "rgba(20, 20, 25, 0.95)"
            : "rgba(255, 255, 255, 0.98)",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
        handleIndicatorStyle={{
          backgroundColor: isDarkMode
            ? "rgba(255,255,255,0.2)"
            : "rgba(0,0,0,0.15)",
          width: 40,
          height: 4,
        }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={styles.container}>
          {Platform.OS === "ios" && (
            <BlurView
              intensity={isDarkMode ? 40 : 60}
              tint={isDarkMode ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          )}

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              {icon && (
                <View
                  style={[
                    styles.headerIcon,
                    { backgroundColor: `${colors.primary[500]}20` },
                  ]}
                >
                  {icon}
                </View>
              )}
              <View style={[styles.headerText, !icon && { marginLeft: 0 }]}>
                <Typography
                  variant="h4"
                  weight="bold"
                  style={{ color: colors.text }}
                >
                  {title}
                </Typography>
                {subtitle && (
                  <Typography
                    variant="caption"
                    color="textMuted"
                    style={{ marginTop: 4 }}
                    numberOfLines={1}
                  >
                    {subtitle}
                  </Typography>
                )}
              </View>
            </View>
            <Pressable
              onPress={handleDismiss}
              style={({ pressed }) => [
                styles.closeButton,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <X size={20} color={colors.textMuted} />
            </Pressable>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {options.map((option, index) => (
              <Pressable
                key={option.type}
                onPress={() => handleOptionPress(option.type)}
                style={({ pressed }) => [
                  styles.optionCard,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(0,0,0,0.02)",
                    borderColor: isDarkMode
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.06)",
                    opacity: pressed ? 0.7 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                {option.icon && (
                  <View
                    style={[
                      styles.optionIcon,
                      {
                        backgroundColor: isDarkMode
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(0,0,0,0.04)",
                      },
                    ]}
                  >
                    {option.icon}
                  </View>
                )}
                <View style={styles.optionText}>
                  <Typography variant="body1" weight="medium">
                    {option.label}
                  </Typography>
                  {option.description && (
                    <Typography
                      variant="caption"
                      color="textMuted"
                      style={{ marginTop: 2 }}
                    >
                      {option.description}
                    </Typography>
                  )}
                </View>
              </Pressable>
            ))}

            {/* Warning Option */}
            {warningOption && (
              <Pressable
                onPress={warningOption.method}
                style={({ pressed }) => [
                  styles.optionCard,
                  styles.warningCard,
                  {
                    backgroundColor: `${colors.error[500]}10`,
                    borderColor: `${colors.error[500]}30`,
                    opacity: pressed ? 0.7 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                {warningOption.icon && (
                  <View
                    style={[
                      styles.optionIcon,
                      { backgroundColor: `${colors.error[500]}15` },
                    ]}
                  >
                    {warningOption.icon}
                  </View>
                )}
                <View style={styles.optionText}>
                  <Typography
                    variant="body1"
                    weight="medium"
                    style={{ color: colors.error[500] }}
                  >
                    {warningOption.label}
                  </Typography>
                  {warningOption.description && (
                    <Typography
                      variant="caption"
                      style={{ color: colors.error[400], marginTop: 2 }}
                    >
                      {warningOption.description}
                    </Typography>
                  )}
                </View>
              </Pressable>
            )}
          </View>

          {/* Bottom spacing */}
          <View style={{ height: 34 }} />
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
    marginLeft: 14,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  optionsContainer: {
    paddingHorizontal: 16,
    gap: 10,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  warningCard: {
    marginTop: 8,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    flex: 1,
    marginLeft: 14,
  },
});

BottomSheetOptions.displayName = "BottomSheetOptions";
