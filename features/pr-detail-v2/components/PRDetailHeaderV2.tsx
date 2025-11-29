import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { prDetailTranslations as t } from "@/shared/translations/pr-detail";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { ArrowLeft, Trophy } from "lucide-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";

type Props = {
  exerciseName: string;
  lang: "es" | "en";
};

export const PRDetailHeaderV2: React.FC<Props> = ({ exerciseName, lang }) => {
  const { colors, isDarkMode } = useColorScheme();
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={[styles.header, { paddingTop: 8 }]}>
      {Platform.OS === "ios" && (
        <BlurView
          intensity={isDarkMode ? 25 : 40}
          tint={isDarkMode ? "dark" : "light"}
          style={StyleSheet.absoluteFill}
        />
      )}

      <View style={styles.headerContent}>
        {/* Back Button */}
        <Pressable
          onPress={handleGoBack}
          style={({ pressed }) => [
            styles.backButton,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.04)",
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <ArrowLeft size={20} color={colors.text} />
        </Pressable>

        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Typography
            variant="h5"
            weight="bold"
            style={{ color: colors.text }}
            numberOfLines={1}
          >
            {exerciseName}
          </Typography>
          <Typography variant="caption" color="textMuted">
            {t.prHistory[lang]}
          </Typography>
        </View>

        {/* Trophy Icon */}
        <View
          style={[
            styles.trophyContainer,
            { backgroundColor: "rgba(245, 158, 11, 0.15)" },
          ]}
        >
          <Trophy size={18} color="#f59e0b" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
  },
  trophyContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
