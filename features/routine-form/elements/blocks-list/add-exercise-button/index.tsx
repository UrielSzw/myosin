import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { Plus } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { useMainActions } from "../../../hooks/use-routine-form-store";

export const AddExerciseButton = () => {
  const { colors } = useColorScheme();
  const { setIsExerciseModalOpen, setExerciseModalMode } = useMainActions();

  const handleOpenModal = () => {
    setIsExerciseModalOpen(true);
    setExerciseModalMode("add-new");
  };

  return (
    <TouchableOpacity
      onPress={handleOpenModal}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        marginTop: 16,
        borderWidth: 2,
        borderColor: colors.primary[500],
        borderStyle: "dashed",
        borderRadius: 8,
        backgroundColor: colors.primary[500] + "10",
      }}
    >
      <Plus size={20} color={colors.primary[500]} />
      <Typography
        variant="body1"
        weight="medium"
        style={{ color: colors.primary[500], marginLeft: 8 }}
      >
        Agregar Ejercicio
      </Typography>
    </TouchableOpacity>
  );
};
