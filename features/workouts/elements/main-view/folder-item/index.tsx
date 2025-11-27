import { FolderWithMetrics } from "@/shared/db/repository/folders";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { workoutsTranslations } from "@/shared/translations/workouts";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { ChevronRight } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, Vibration, View } from "react-native";

type Props = {
  folder: FolderWithMetrics;
  drag: () => void;
  isActive: boolean;
  onSelect: () => void;
};

export const FolderItem: React.FC<Props> = ({
  folder,
  drag,
  isActive,
  onSelect,
}) => {
  const { colors } = useColorScheme();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = workoutsTranslations;

  return (
    <TouchableOpacity
      onLongPress={() => {
        Vibration.vibrate(50);
        drag();
      }}
      onPress={onSelect}
      delayLongPress={300}
      activeOpacity={0.8}
    >
      <Card
        variant="outlined"
        padding="md"
        pressable
        style={[
          styles.card,
          {
            backgroundColor: isActive ? colors.primary[100] : colors.surface,
            borderColor: isActive ? colors.primary[300] : colors.border,
          },
        ]}
      >
        <View style={styles.content}>
          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: folder.color + "20" },
            ]}
          >
            <Typography variant="body1">{folder.icon}</Typography>
          </View>

          {/* Info */}
          <View style={styles.info}>
            <Typography
              variant="body1"
              weight="semibold"
              numberOfLines={1}
            >
              {folder.name}
            </Typography>
            <Typography variant="caption" color="textMuted">
              {folder.routineCount === 1
                ? `1 ${t.routine[lang]}`
                : `${folder.routineCount} ${t.routinesPlural[lang]}`}
            </Typography>
          </View>

          {/* Chevron */}
          <ChevronRight size={20} color={colors.textMuted} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
});
