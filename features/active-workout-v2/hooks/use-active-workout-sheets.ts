import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef } from "react";

export type IActiveToggleSheet =
  | "setType"
  | "restTime"
  | "blockOptions"
  | "exerciseOptions"
  | "restTimer"
  | "rpeSelector"
  | "tempoMetronome";

export const useActiveWorkoutSheets = () => {
  const setTypeBottomSheetRef = useRef<BottomSheetModal>(null);
  const restTimeBottomSheetRef = useRef<BottomSheetModal>(null);
  const blockOptionsBottomSheetRef = useRef<BottomSheetModal>(null);
  const exerciseOptionsBottomSheetRef = useRef<BottomSheetModal>(null);
  const restTimerSheetRef = useRef<BottomSheetModal>(null);
  const rpeSelectorBottomSheetRef = useRef<BottomSheetModal>(null);
  const tempoMetronomeRef = useRef<BottomSheetModal>(null);

  const handleCloseSheets = () => {
    setTypeBottomSheetRef.current?.close();
    restTimeBottomSheetRef.current?.close();
    blockOptionsBottomSheetRef.current?.close();
    exerciseOptionsBottomSheetRef.current?.close();
    restTimerSheetRef.current?.close();
    rpeSelectorBottomSheetRef.current?.close();
    tempoMetronomeRef.current?.close();
  };

  const handleToggleSheet = (sheet?: IActiveToggleSheet) => {
    switch (sheet) {
      case "setType":
        setTypeBottomSheetRef.current?.present();
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
      case "restTimer":
        restTimerSheetRef.current?.present();
        break;
      case "rpeSelector":
        rpeSelectorBottomSheetRef.current?.present();
        break;
      case "tempoMetronome":
        tempoMetronomeRef.current?.present();
        break;
      default:
        handleCloseSheets();
        break;
    }
  };

  return {
    handleToggleSheet,
    setTypeBottomSheetRef,
    restTimeBottomSheetRef,
    blockOptionsBottomSheetRef,
    exerciseOptionsBottomSheetRef,
    restTimerSheetRef,
    rpeSelectorBottomSheetRef,
    tempoMetronomeRef,
  };
};
