import { WeightUnit } from "@/shared/utils/weight-conversion";
import React, { createContext, useCallback, useContext, useState } from "react";

type PlateCalculatorContextType = {
  // Floating button state
  isButtonVisible: boolean;
  // Sheet state
  isSheetVisible: boolean;
  // Data
  currentWeightKg: number | null;
  weightUnit: WeightUnit;
  onApplyWeight: ((weightKg: number) => void) | null;

  // Actions
  showFloatingButton: (params: {
    currentWeightKg: number | null;
    weightUnit: WeightUnit;
    onApply: (weightKg: number) => void;
  }) => void;
  hideFloatingButton: () => void;
  openSheet: () => void;
  closeSheet: () => void;
};

const PlateCalculatorContext = createContext<PlateCalculatorContextType | null>(
  null
);

export const PlateCalculatorProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [currentWeightKg, setCurrentWeightKg] = useState<number | null>(null);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [onApplyWeight, setOnApplyWeight] = useState<
    ((weightKg: number) => void) | null
  >(null);

  const showFloatingButton = useCallback(
    (params: {
      currentWeightKg: number | null;
      weightUnit: WeightUnit;
      onApply: (weightKg: number) => void;
    }) => {
      setCurrentWeightKg(params.currentWeightKg);
      setWeightUnit(params.weightUnit);
      setOnApplyWeight(() => params.onApply);
      setIsButtonVisible(true);
    },
    []
  );

  const hideFloatingButton = useCallback(() => {
    setIsButtonVisible(false);
  }, []);

  const openSheet = useCallback(() => {
    setIsSheetVisible(true);
  }, []);

  const closeSheet = useCallback(() => {
    setIsSheetVisible(false);
  }, []);

  return (
    <PlateCalculatorContext.Provider
      value={{
        isButtonVisible,
        isSheetVisible,
        currentWeightKg,
        weightUnit,
        onApplyWeight,
        showFloatingButton,
        hideFloatingButton,
        openSheet,
        closeSheet,
      }}
    >
      {children}
    </PlateCalculatorContext.Provider>
  );
};

export const usePlateCalculator = () => {
  const context = useContext(PlateCalculatorContext);
  if (!context) {
    throw new Error(
      "usePlateCalculator must be used within PlateCalculatorProvider"
    );
  }
  return context;
};
