import { routineFormTranslations } from "@/shared/translations/routine-form";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { View } from "react-native";
import { useMainActions } from "../../../hooks/use-routine-form-store";

type Props = {
  exercisesInBlockCount: number;
  lang: "es" | "en";
};

export const ExerciseListTop = ({ exercisesInBlockCount, lang }: Props) => {
  const t = routineFormTranslations;
  const { setIsExerciseModalOpen, setExerciseModalMode } = useMainActions();

  const handleOpenModal = () => {
    setIsExerciseModalOpen(true);
    setExerciseModalMode("add-new");
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
      }}
    >
      <Typography variant="h6" weight="semibold">
        {t.exercisesCount[lang].replace(
          "{count}",
          exercisesInBlockCount.toString()
        )}
      </Typography>

      <Button variant="ghost" size="sm" onPress={handleOpenModal}>
        {t.addExercise[lang]}
      </Button>
    </View>
  );
};
