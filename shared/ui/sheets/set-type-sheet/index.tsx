import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { setTypeTranslations } from "@/shared/translations/set-type";
import { ISetType } from "@/shared/types/workout";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { Check, ChevronRight, Layers, Trash2, X } from "lucide-react-native";
import React, { forwardRef, useCallback, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from "react-native-reanimated";
import { Typography } from "../../typography";
import { SetTypeDetail } from "./set-type-detail";

type Props = {
  onSelectSetType: (type: ISetType) => void;
  onDeleteSet: () => void;
  currentSetType?: ISetType | null;
};

export const SetTypeBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ onSelectSetType, onDeleteSet, currentSetType }, ref) => {
    const { colors, isDarkMode } = useColorScheme();
    const prefs = useUserPreferences();
    const lang = prefs?.language ?? "es";
    const t = setTypeTranslations;

    const [viewMode, setViewMode] = useState<"selection" | "info">("selection");
    const [selectedInfoType, setSelectedInfoType] = useState<ISetType | null>(
      null
    );

    const setTypes = [
      { type: "normal" as const, label: "normal" },
      { type: "warmup" as const, label: "warmup" },
      { type: "failure" as const, label: "failure" },
      { type: "drop" as const, label: "drop" },
      { type: "cluster" as const, label: "cluster" },
      { type: "rest-pause" as const, label: "restPause" },
      { type: "mechanical" as const, label: "mechanical" },
      { type: "eccentric" as const, label: "eccentric" },
      { type: "partial" as const, label: "partial" },
      { type: "isometric" as const, label: "isometric" },
    ];

    const handleShowInfo = (setType: ISetType, event: any) => {
      event.stopPropagation();
      setSelectedInfoType(setType);
      setViewMode("info");
    };

    const handleBackToSelection = () => {
      setViewMode("selection");
    };

    const handleSelectFromInfo = (setType: ISetType) => {
      onSelectSetType(setType);
    };

    const handleDismiss = useCallback(() => {
      if (ref && "current" in ref && ref.current) {
        ref.current.dismiss();
      }
    }, [ref]);

    const slideInFromRight = SlideInRight.duration(300).easing(
      Easing.bezier(0.25, 0.1, 0.25, 1)
    );
    const slideInFromLeft = SlideInLeft.duration(300).easing(
      Easing.bezier(0.25, 0.1, 0.25, 1)
    );
    const slideOutToLeft = SlideOutLeft.duration(300).easing(
      Easing.bezier(0.25, 0.1, 0.25, 1)
    );
    const slideOutToRight = SlideOutRight.duration(300).easing(
      Easing.bezier(0.25, 0.1, 0.25, 1)
    );

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
        snapPoints={viewMode === "selection" ? ["60%"] : ["80%"]}
        enablePanDownToClose
        onDismiss={handleBackToSelection}
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
        <BottomSheetScrollView style={styles.container}>
          {Platform.OS === "ios" && (
            <BlurView
              intensity={isDarkMode ? 40 : 60}
              tint={isDarkMode ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          )}

          {viewMode === "selection" ? (
            <Animated.View
              key="selection-view"
              entering={slideInFromLeft}
              exiting={slideOutToLeft}
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerInfo}>
                  <View
                    style={[
                      styles.headerIcon,
                      { backgroundColor: `${colors.primary[500]}20` },
                    ]}
                  >
                    <Layers size={22} color={colors.primary[500]} />
                  </View>
                  <View style={styles.headerText}>
                    <Typography variant="h4" weight="bold">
                      {lang === "es" ? "Tipo de Serie" : "Set Type"}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textMuted"
                      style={{ marginTop: 4 }}
                    >
                      {lang === "es"
                        ? "Selecciona el método de entrenamiento"
                        : "Select training method"}
                    </Typography>
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

              {/* Set Types Grid */}
              <View style={styles.optionsContainer}>
                {setTypes.map((option) => {
                  const isSelected = currentSetType === option.type;
                  return (
                    <Pressable
                      key={option.type}
                      onPress={() => onSelectSetType(option.type)}
                      style={({ pressed }) => [
                        styles.optionCard,
                        {
                          backgroundColor: isSelected
                            ? `${colors.primary[500]}15`
                            : isDarkMode
                            ? "rgba(255,255,255,0.04)"
                            : "rgba(0,0,0,0.02)",
                          borderColor: isSelected
                            ? colors.primary[500]
                            : isDarkMode
                            ? "rgba(255,255,255,0.08)"
                            : "rgba(0,0,0,0.06)",
                          opacity: pressed ? 0.7 : 1,
                          transform: [{ scale: pressed ? 0.98 : 1 }],
                        },
                      ]}
                    >
                      <View style={styles.optionContent}>
                        {isSelected && (
                          <View
                            style={[
                              styles.checkIcon,
                              { backgroundColor: colors.primary[500] },
                            ]}
                          >
                            <Check size={12} color="#fff" strokeWidth={3} />
                          </View>
                        )}
                        <Typography
                          variant="body1"
                          weight={isSelected ? "semibold" : "medium"}
                          style={{
                            color: isSelected
                              ? colors.primary[500]
                              : colors.text,
                            flex: 1,
                          }}
                        >
                          {
                            t.types[option.label as keyof typeof t.types].label[
                              lang
                            ]
                          }
                        </Typography>
                      </View>
                      <Pressable
                        onPress={(event) => handleShowInfo(option.type, event)}
                        hitSlop={8}
                        style={({ pressed }) => [
                          styles.infoButton,
                          {
                            backgroundColor: isDarkMode
                              ? "rgba(255,255,255,0.08)"
                              : "rgba(0,0,0,0.05)",
                            opacity: pressed ? 0.6 : 1,
                          },
                        ]}
                      >
                        <ChevronRight size={16} color={colors.textMuted} />
                      </Pressable>
                    </Pressable>
                  );
                })}

                {/* Delete Option */}
                <Pressable
                  onPress={onDeleteSet}
                  style={({ pressed }) => [
                    styles.optionCard,
                    styles.deleteCard,
                    {
                      backgroundColor: `${colors.error[500]}10`,
                      borderColor: `${colors.error[500]}30`,
                      opacity: pressed ? 0.7 : 1,
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                  ]}
                >
                  <View style={styles.optionContent}>
                    <View
                      style={[
                        styles.deleteIcon,
                        { backgroundColor: `${colors.error[500]}20` },
                      ]}
                    >
                      <Trash2 size={18} color={colors.error[500]} />
                    </View>
                    <Typography
                      variant="body1"
                      weight="medium"
                      style={{ color: colors.error[500] }}
                    >
                      {t.deleteSet[lang]}
                    </Typography>
                  </View>
                </Pressable>
              </View>
            </Animated.View>
          ) : (
            <Animated.View
              key="info-view"
              entering={slideInFromRight}
              exiting={slideOutToRight}
            >
              <SetTypeDetail
                setType={selectedInfoType!}
                onBack={handleBackToSelection}
                onSelectMethod={handleSelectFromInfo}
              />
            </Animated.View>
          )}

          <View style={{ height: 50 }} />
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    gap: 8,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  infoButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteCard: {
    marginTop: 12,
  },
  deleteIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

SetTypeBottomSheet.displayName = "SetTypeBottomSheet";
