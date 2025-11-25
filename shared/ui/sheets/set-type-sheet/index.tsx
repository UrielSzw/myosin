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
import { InfoIcon } from "lucide-react-native";
import React, { forwardRef, useCallback, useState } from "react";
import { TouchableOpacity, View } from "react-native";
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
    const { colors } = useColorScheme();
    const prefs = useUserPreferences();
    const lang = prefs?.language ?? "es";
    const t = setTypeTranslations;

    // Estados para la navegación
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

    // Función para mostrar información
    const handleShowInfo = (setType: ISetType, event: any) => {
      event.stopPropagation(); // Evitar que se seleccione el tipo
      setSelectedInfoType(setType);
      setViewMode("info");
    };

    // Función para volver a la selección
    const handleBackToSelection = () => {
      setViewMode("selection");
    };

    // Función para seleccionar desde la vista de info
    const handleSelectFromInfo = (setType: ISetType) => {
      onSelectSetType(setType);
      // El sheet se cerrará automáticamente por el componente padre
    };

    // Configuración de animaciones
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
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={viewMode === "selection" ? ["50%"] : ["75%"]}
        enablePanDownToClose
        onDismiss={handleBackToSelection}
        backgroundStyle={{
          backgroundColor: colors.surface,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        }}
        handleIndicatorStyle={{ backgroundColor: colors.textMuted }}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetScrollView
          style={{ padding: 16, paddingBottom: 60, flex: 1 }}
        >
          {viewMode === "selection" ? (
            <Animated.View
              key="selection-view"
              entering={slideInFromLeft}
              exiting={slideOutToLeft}
              style={{ flex: 1 }}
            >
              <Typography
                variant="h3"
                weight="semibold"
                style={{ marginBottom: 16 }}
              >
                Tipo de Serie
              </Typography>

              {setTypes.map((option) => (
                <TouchableOpacity
                  key={option.type}
                  onPress={() => onSelectSetType(option.type)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 16,
                    paddingHorizontal: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                    backgroundColor:
                      currentSetType === option.type
                        ? colors.primary[500] + "20"
                        : "transparent",
                  }}
                >
                  <Typography variant="body1">
                    {t.types[option.label as keyof typeof t.types].label[lang]}
                  </Typography>

                  <TouchableOpacity
                    onPress={(event) => handleShowInfo(option.type, event)}
                    style={{
                      padding: 4,
                      borderRadius: 12,
                      backgroundColor: colors.primary[500] + "20",
                    }}
                  >
                    <InfoIcon size={16} color={colors.primary[500]} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                onPress={onDeleteSet}
                style={{ paddingVertical: 16, paddingHorizontal: 16 }}
              >
                <Typography
                  variant="body1"
                  style={{ color: colors.error[500] }}
                >
                  {t.deleteSet[lang]}
                </Typography>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <Animated.View
              key="info-view"
              entering={slideInFromRight}
              exiting={slideOutToRight}
              style={{ flex: 1 }}
            >
              <SetTypeDetail
                setType={selectedInfoType!}
                onBack={handleBackToSelection}
                onSelectMethod={handleSelectFromInfo}
              />
            </Animated.View>
          )}

          <View style={{ height: 100 }} />
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  }
);

SetTypeBottomSheet.displayName = "SetTypeBottomSheet";
