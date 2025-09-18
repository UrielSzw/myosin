import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef } from "react";

export type IToogleSheet =
  | "setType"
  | "repsType"
  | "restTime"
  | "blockOptions"
  | "exerciseOptions"
  | "rpeSelector"
  | "tempoSelector";

export const useFormRoutineSheets = () => {
  const setTypeBottomSheetRef = useRef<BottomSheetModal>(null);
  const repsTypeBottomSheetRef = useRef<BottomSheetModal>(null);
  const restTimeBottomSheetRef = useRef<BottomSheetModal>(null);
  const blockOptionsBottomSheetRef = useRef<BottomSheetModal>(null);
  const exerciseOptionsBottomSheetRef = useRef<BottomSheetModal>(null);
  const rpeSelectorBottomSheetRef = useRef<BottomSheetModal>(null);
  const tempoSelectorBottomSheetRef = useRef<BottomSheetModal>(null);

  const handleCloseSheets = () => {
    setTypeBottomSheetRef.current?.close();
    repsTypeBottomSheetRef.current?.close();
    restTimeBottomSheetRef.current?.close();
    blockOptionsBottomSheetRef.current?.close();
    exerciseOptionsBottomSheetRef.current?.close();
    rpeSelectorBottomSheetRef.current?.close();
    tempoSelectorBottomSheetRef.current?.close();
  };

  const handleToggleSheet = (sheet?: IToogleSheet) => {
    switch (sheet) {
      case "setType":
        setTypeBottomSheetRef.current?.present();
        break;
      case "repsType":
        repsTypeBottomSheetRef.current?.present();
        break;
      case "restTime":
        restTimeBottomSheetRef.current?.present();
        break;
      case "blockOptions":
        blockOptionsBottomSheetRef.current?.present();
        break;
      case "exerciseOptions":
        exerciseOptionsBottomSheetRef.current?.present();
        break;
      case "rpeSelector":
        rpeSelectorBottomSheetRef.current?.present();
        break;
      case "tempoSelector":
        tempoSelectorBottomSheetRef.current?.present();
        break;
      default:
        handleCloseSheets();
        break;
    }
  };

  return {
    handleToggleSheet,
    setTypeBottomSheetRef,
    repsTypeBottomSheetRef,
    restTimeBottomSheetRef,
    blockOptionsBottomSheetRef,
    exerciseOptionsBottomSheetRef,
    rpeSelectorBottomSheetRef,
    tempoSelectorBottomSheetRef,
  };
};
