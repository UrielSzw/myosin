import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { ArrowLeft, Calendar } from "lucide-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

type Props = {
  routineName: string;
  date: string;
  lang: string;
};

export const SessionDetailHeaderV2: React.FC<Props> = ({
  routineName,
  date,
  lang,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const formatDate = (dateString: string) => {
    const dateObj = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return dateObj.toLocaleDateString(
      lang === "es" ? "es-ES" : "en-US",
      options
    );
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

        {/* Title */}
        <View style={styles.titleContainer}>
          <Typography
            variant="h4"
            weight="bold"
            style={{ color: colors.text }}
            numberOfLines={1}
          >
            {routineName}
          </Typography>
        </View>

        {/* Date Badge */}
        <Animated.View entering={FadeIn.duration(400).delay(200)}>
          <View
            style={[
              styles.dateBadge,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.04)",
              },
            ]}
          >
            <Calendar size={12} color={colors.textMuted} />
            <Typography
              variant="caption"
              style={{ color: colors.textMuted, marginLeft: 4, fontSize: 10 }}
            >
              {formatDate(date)}
            </Typography>
          </View>
        </Animated.View>
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
  dateBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
});
