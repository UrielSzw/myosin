import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import {
  Heart,
  MessageCircle,
  Quote,
  Star,
  Swords,
  Target,
} from "lucide-react-native";
import React, { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type Props = {
  lang: "es" | "en";
  hasPRs: boolean;
  hasImprovements: boolean;
  streak: number;
  baseDelay?: number;
};

// Motivational quotes/messages
const MESSAGES = {
  withPRs: {
    es: [
      { text: "¡Rompiste tus límites hoy!", icon: "star" },
      { text: "¡Nuevo record, nueva versión de vos!", icon: "target" },
      { text: "Los PRs no mienten, creciste 💪", icon: "swords" },
    ],
    en: [
      { text: "You broke your limits today!", icon: "star" },
      { text: "New record, new version of you!", icon: "target" },
      { text: "PRs don't lie, you've grown 💪", icon: "swords" },
    ],
  },
  withImprovements: {
    es: [
      { text: "Cada rep te acerca a tu mejor versión", icon: "heart" },
      { text: "La consistencia siempre gana", icon: "target" },
      { text: "Progreso es progreso, sin importar el tamaño", icon: "star" },
    ],
    en: [
      { text: "Every rep brings you closer to your best", icon: "heart" },
      { text: "Consistency always wins", icon: "target" },
      { text: "Progress is progress, no matter the size", icon: "star" },
    ],
  },
  withStreak: {
    es: [
      { text: "¡La disciplina supera al talento!", icon: "swords" },
      { text: "Un hábito se construye día a día", icon: "target" },
      { text: "Tu futuro yo te lo agradecerá", icon: "heart" },
    ],
    en: [
      { text: "Discipline beats talent!", icon: "swords" },
      { text: "A habit is built day by day", icon: "target" },
      { text: "Your future self will thank you", icon: "heart" },
    ],
  },
  default: {
    es: [
      { text: "Otro día, otra victoria", icon: "star" },
      { text: "El único mal entreno es el que no se hace", icon: "quote" },
      { text: "Estás más cerca de tus metas", icon: "target" },
    ],
    en: [
      { text: "Another day, another victory", icon: "star" },
      {
        text: "The only bad workout is the one that didn't happen",
        icon: "quote",
      },
      { text: "You're closer to your goals", icon: "target" },
    ],
  },
};

const IconMap = {
  star: Star,
  target: Target,
  heart: Heart,
  swords: Swords,
  quote: Quote,
  message: MessageCircle,
};

export const MotivationalCardV2: React.FC<Props> = ({
  lang,
  hasPRs,
  hasImprovements,
  streak,
  baseDelay = 2000,
}) => {
  const { colors, isDarkMode } = useColorScheme();

  // Select message category based on workout results
  const message = useMemo(() => {
    let category: keyof typeof MESSAGES;

    if (hasPRs) {
      category = "withPRs";
    } else if (hasImprovements) {
      category = "withImprovements";
    } else if (streak >= 3) {
      category = "withStreak";
    } else {
      category = "default";
    }

    const messages = MESSAGES[category][lang];
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  }, [hasPRs, hasImprovements, streak, lang]);

  const IconComponent = IconMap[message.icon as keyof typeof IconMap] || Star;

  // Gradient colors based on message type
  const gradientColors: [string, string, string] = hasPRs
    ? ["rgba(245, 158, 11, 0.08)", "rgba(234, 179, 8, 0.04)", "transparent"]
    : hasImprovements
    ? ["rgba(16, 185, 129, 0.08)", "rgba(16, 185, 129, 0.04)", "transparent"]
    : ["rgba(139, 92, 246, 0.08)", "rgba(139, 92, 246, 0.04)", "transparent"];

  const accentColor = hasPRs
    ? "#f59e0b"
    : hasImprovements
    ? colors.success[500]
    : "#8b5cf6";

  return (
    <Animated.View
      entering={FadeInDown.duration(500).delay(baseDelay)}
      style={styles.container}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.03)"
              : "rgba(255,255,255,0.8)",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.04)",
          },
        ]}
      >
        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDarkMode ? 12 : 25}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Gradient overlay */}
        <LinearGradient
          colors={gradientColors}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        <View style={styles.content}>
          {/* Quote marks decorative */}
          <View style={styles.quoteMarks}>
            <Typography
              variant="h1"
              style={{
                color: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.04)",
                fontSize: 60,
                lineHeight: 60,
              }}
            >
              {'"'}
            </Typography>
          </View>

          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${accentColor}15` },
            ]}
          >
            <IconComponent size={20} color={accentColor} />
          </View>

          {/* Message */}
          <Typography
            variant="body1"
            weight="medium"
            align="center"
            style={{ color: colors.text, marginTop: 12, paddingHorizontal: 16 }}
          >
            {message.text}
          </Typography>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  content: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  quoteMarks: {
    position: "absolute",
    top: -5,
    left: 15,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
