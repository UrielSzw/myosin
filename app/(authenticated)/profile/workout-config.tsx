import { ProfileWorkoutConfigFeature } from "@/features/profile-workout-config";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default function ProfileWorkoutConfigScreen() {
  return (
    <BottomSheetModalProvider>
      <ProfileWorkoutConfigFeature />
    </BottomSheetModalProvider>
  );
}
