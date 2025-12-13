import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useUserProfile } from "@/shared/hooks/use-user-profile";
import { useAuth } from "@/shared/providers/auth-provider";
import { profileTranslations as t } from "@/shared/translations/profile";
import { toSupportedLanguage } from "@/shared/types/language";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { Calendar, Edit3 } from "lucide-react-native";
import React from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

export const ProfileHeroCard = () => {
  const { colors, isDarkMode } = useColorScheme();
  const { user } = useAuth();
  const { profile } = useUserProfile(user);
  const prefs = useUserPreferences();
  const lang = toSupportedLanguage(prefs?.language);

  const displayName =
    profile.displayName ||
    user?.email?.split("@")[0] ||
    t.defaultUserName[lang];
  const initial = displayName.charAt(0).toUpperCase();

  const getMemberSince = () => {
    if (!user?.created_at) return "2025";
    const date = new Date(user.created_at);
    const monthNames = t.monthNames[lang];
    return `${monthNames[date.getMonth()]?.slice(0, 3)} ${date.getFullYear()}`;
  };

  const handleEditProfile = () => {
    router.push("/profile/edit");
  };

  return (
    <Animated.View entering={FadeIn.duration(400).delay(100)}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.04)"
              : "rgba(255,255,255,0.85)",
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
          },
        ]}
      >
        {Platform.OS === "ios" && (
          <BlurView
            intensity={isDarkMode ? 20 : 40}
            tint={isDarkMode ? "dark" : "light"}
            style={StyleSheet.absoluteFill}
          />
        )}

        {/* Decorative glow */}
        <View
          style={[
            styles.decorativeGlow,
            { backgroundColor: profile.avatarColor },
          ]}
        />

        <View style={styles.content}>
          {/* Avatar */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(200)}
            style={styles.avatarContainer}
          >
            <View
              style={[
                styles.avatarOuter,
                {
                  borderColor: isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                },
              ]}
            >
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: profile.avatarColor },
                ]}
              >
                <Typography
                  style={{
                    fontSize: 48,
                    lineHeight: 56,
                    color: "#fff",
                    fontWeight: "700",
                    textAlignVertical: "center",
                    includeFontPadding: false,
                  }}
                >
                  {initial}
                </Typography>
              </View>
            </View>

            {/* Edit button overlay */}
            <Pressable
              onPress={handleEditProfile}
              style={({ pressed }) => [
                styles.editButton,
                {
                  backgroundColor: colors.primary[500],
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                },
              ]}
            >
              <Edit3 size={14} color="#fff" strokeWidth={2.5} />
            </Pressable>
          </Animated.View>

          {/* Name & Email */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(300)}
            style={styles.infoContainer}
          >
            <Typography
              variant="h3"
              weight="bold"
              style={{ color: colors.text, textAlign: "center" }}
            >
              {displayName}
            </Typography>

            <Typography
              variant="body2"
              color="textMuted"
              style={{ marginTop: 4, textAlign: "center", opacity: 0.7 }}
            >
              {user?.email || t.defaultEmail[lang]}
            </Typography>
          </Animated.View>

          {/* Member badge */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(400)}
            style={[
              styles.badge,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.04)",
              },
            ]}
          >
            <Calendar size={12} color={colors.primary[500]} />
            <Typography
              variant="caption"
              style={{
                color: colors.primary[500],
                marginLeft: 6,
                fontSize: 11,
              }}
            >
              {t.memberSince[lang]} {getMemberSince()}
            </Typography>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: "hidden",
    marginHorizontal: 20,
  },
  decorativeGlow: {
    position: "absolute",
    top: -80,
    left: "50%",
    marginLeft: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.15,
  },
  content: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 20,
  },
  avatarOuter: {
    padding: 4,
    borderRadius: 60,
    borderWidth: 2,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  statsContainer: {
    width: "100%",
  },
  statDivider: {
    height: 1,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  statItem: {
    alignItems: "center",
    minWidth: 100,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
