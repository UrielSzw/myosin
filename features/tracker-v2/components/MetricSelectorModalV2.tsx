import {
  useAddMetricFromTemplate,
  useAvailableTemplates,
  useDeletedMetrics,
  useRestoreMetric,
} from "@/features/tracker-v2/hooks/use-tracker-data";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { useHaptic } from "@/shared/services/haptic-service";
import {
  getMetricName,
  getMetricUnit,
  trackerTranslations,
} from "@/shared/translations/tracker";
import { Typography } from "@/shared/ui/typography";
import { BlurView } from "expo-blur";
import * as Icons from "lucide-react-native";
import {
  ChevronRight,
  Layout,
  Plus,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";

type Props = {
  visible: boolean;
  onClose: () => void;
  lang?: "es" | "en";
};

export const MetricSelectorModalV2: React.FC<Props> = ({
  visible,
  onClose,
  lang = "es",
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const { user } = useAuth();
  const prefs = useUserPreferences();
  const weightUnit = prefs?.weight_unit ?? "kg";
  const haptic = useHaptic();
  const t = trackerTranslations;

  const [showDeleted, setShowDeleted] = useState(false);
  const [addingSlug, setAddingSlug] = useState<string | null>(null);

  // Data hooks
  const { data: availableTemplates = [], isLoading } = useAvailableTemplates(
    user?.id || ""
  );
  const { data: deletedMetrics = [] } = useDeletedMetrics(user?.id || "");
  const addMetricMutation = useAddMetricFromTemplate();
  const restoreMetricMutation = useRestoreMetric();

  const handleAddMetric = async (templateSlug: string) => {
    if (!user) return;

    setAddingSlug(templateSlug);
    try {
      await addMetricMutation.mutateAsync({
        templateSlug,
        userId: user.id,
      });
      haptic.success();
      onClose();
    } catch (error) {
      console.error("Error adding metric from template:", error);
    } finally {
      setAddingSlug(null);
    }
  };

  const handleRestoreMetric = async (metricId: string) => {
    try {
      await restoreMetricMutation.mutateAsync(metricId);
      haptic.success();
    } catch (error) {
      console.error("Error restoring metric:", error);
    }
  };

  if (isLoading) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.background,
          }}
        >
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Typography
            variant="body2"
            color="textMuted"
            style={{ marginTop: 16 }}
          >
            {t.loadingMetrics[lang]}
          </Typography>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Premium Header */}
        <Animated.View entering={FadeInDown.duration(300)}>
          {Platform.OS === "ios" ? (
            <BlurView
              intensity={80}
              tint={isDarkMode ? "dark" : "light"}
              style={{
                paddingTop: 8,
                paddingBottom: 16,
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: colors.border + "40",
              }}
            >
              <HeaderContent
                colors={colors}
                isDarkMode={isDarkMode}
                onClose={onClose}
                lang={lang}
              />
            </BlurView>
          ) : (
            <View
              style={{
                paddingTop: 8,
                paddingBottom: 16,
                paddingHorizontal: 20,
                backgroundColor: colors.background,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <HeaderContent
                colors={colors}
                isDarkMode={isDarkMode}
                onClose={onClose}
                lang={lang}
              />
            </View>
          )}
        </Animated.View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Available Templates Section */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(300)}
            style={{ marginBottom: 24 }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <Sparkles size={18} color={colors.primary[500]} />
              <Typography variant="h6" weight="semibold">
                {t.predefinedMetrics[lang]}
              </Typography>
            </View>

            {availableTemplates.length > 0 ? (
              <View style={{ gap: 10 }}>
                {availableTemplates.map((template, index) => {
                  const IconComponent = (Icons as any)[template.icon];
                  const displayUnit = getMetricUnit(template, lang, weightUnit);
                  const isAdding = addingSlug === template.slug;

                  return (
                    <Animated.View
                      key={template.slug}
                      entering={FadeInDown.delay(150 + index * 40).duration(
                        300
                      )}
                    >
                      <TouchableOpacity
                        onPress={() => handleAddMetric(template.slug)}
                        disabled={isAdding || addMetricMutation.isPending}
                        activeOpacity={0.8}
                      >
                        <View
                          style={{
                            borderRadius: 16,
                            overflow: "hidden",
                            borderWidth: 1,
                            borderColor: colors.border + "60",
                          }}
                        >
                          {Platform.OS === "ios" ? (
                            <BlurView
                              intensity={20}
                              tint={isDarkMode ? "dark" : "light"}
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                padding: 16,
                                gap: 14,
                              }}
                            >
                              <TemplateContent
                                template={template}
                                IconComponent={IconComponent}
                                displayUnit={displayUnit}
                                isAdding={isAdding}
                                colors={colors}
                                lang={lang}
                              />
                            </BlurView>
                          ) : (
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                padding: 16,
                                gap: 14,
                                backgroundColor: colors.surface,
                              }}
                            >
                              <TemplateContent
                                template={template}
                                IconComponent={IconComponent}
                                displayUnit={displayUnit}
                                isAdding={isAdding}
                                colors={colors}
                                lang={lang}
                              />
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}
              </View>
            ) : (
              <Animated.View
                entering={FadeIn.delay(200).duration(300)}
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: colors.border + "60",
                }}
              >
                {Platform.OS === "ios" ? (
                  <BlurView
                    intensity={20}
                    tint={isDarkMode ? "dark" : "light"}
                    style={{
                      alignItems: "center",
                      paddingVertical: 40,
                      paddingHorizontal: 20,
                    }}
                  >
                    <View
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 20,
                        backgroundColor: colors.gray[100],
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 16,
                      }}
                    >
                      <Layout size={28} color={colors.textMuted} />
                    </View>
                    <Typography
                      variant="body2"
                      color="textMuted"
                      align="center"
                    >
                      {t.noTemplatesAvailable[lang]}
                    </Typography>
                  </BlurView>
                ) : (
                  <View
                    style={{
                      alignItems: "center",
                      paddingVertical: 40,
                      paddingHorizontal: 20,
                      backgroundColor: colors.surface,
                    }}
                  >
                    <View
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 20,
                        backgroundColor: colors.gray[100],
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 16,
                      }}
                    >
                      <Layout size={28} color={colors.textMuted} />
                    </View>
                    <Typography
                      variant="body2"
                      color="textMuted"
                      align="center"
                    >
                      {t.noTemplatesAvailable[lang]}
                    </Typography>
                  </View>
                )}
              </Animated.View>
            )}
          </Animated.View>

          {/* Deleted Metrics Section */}
          {deletedMetrics.length > 0 && (
            <Animated.View
              entering={FadeInDown.delay(300).duration(300)}
              style={{ marginTop: 8 }}
            >
              <TouchableOpacity
                onPress={() => {
                  haptic.light();
                  setShowDeleted(!showDeleted);
                }}
                activeOpacity={0.8}
              >
                <View
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: colors.border + "60",
                    marginBottom: 16,
                  }}
                >
                  {Platform.OS === "ios" ? (
                    <BlurView
                      intensity={20}
                      tint={isDarkMode ? "dark" : "light"}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 16,
                      }}
                    >
                      <DeletedHeaderContent
                        count={deletedMetrics.length}
                        showDeleted={showDeleted}
                        colors={colors}
                        lang={lang}
                      />
                    </BlurView>
                  ) : (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: 16,
                        backgroundColor: colors.surface,
                      }}
                    >
                      <DeletedHeaderContent
                        count={deletedMetrics.length}
                        showDeleted={showDeleted}
                        colors={colors}
                        lang={lang}
                      />
                    </View>
                  )}
                </View>
              </TouchableOpacity>

              {showDeleted && (
                <Animated.View
                  entering={FadeInUp.duration(300)}
                  style={{ gap: 10 }}
                >
                  {deletedMetrics.map((metric, index) => {
                    const IconComponent = (Icons as any)[metric.icon];
                    const displayUnit = getMetricUnit(metric, lang, weightUnit);

                    return (
                      <Animated.View
                        key={metric.id}
                        entering={FadeInDown.delay(index * 50).duration(300)}
                      >
                        <TouchableOpacity
                          onPress={() => handleRestoreMetric(metric.id)}
                          disabled={restoreMetricMutation.isPending}
                          activeOpacity={0.8}
                        >
                          <View
                            style={{
                              borderRadius: 16,
                              overflow: "hidden",
                              borderWidth: 1,
                              borderColor: colors.border + "40",
                              opacity: 0.85,
                            }}
                          >
                            {Platform.OS === "ios" ? (
                              <BlurView
                                intensity={15}
                                tint={isDarkMode ? "dark" : "light"}
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  padding: 16,
                                  gap: 14,
                                }}
                              >
                                <DeletedMetricContent
                                  metric={metric}
                                  IconComponent={IconComponent}
                                  displayUnit={displayUnit}
                                  colors={colors}
                                  lang={lang}
                                />
                              </BlurView>
                            ) : (
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  padding: 16,
                                  gap: 14,
                                  backgroundColor: colors.surface,
                                }}
                              >
                                <DeletedMetricContent
                                  metric={metric}
                                  IconComponent={IconComponent}
                                  displayUnit={displayUnit}
                                  colors={colors}
                                  lang={lang}
                                />
                              </View>
                            )}
                          </View>
                        </TouchableOpacity>
                      </Animated.View>
                    );
                  })}
                </Animated.View>
              )}
            </Animated.View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

// ===== SUB-COMPONENTS =====

const HeaderContent: React.FC<{
  colors: any;
  isDarkMode: boolean;
  onClose: () => void;
  lang: "es" | "en";
}> = ({ colors, isDarkMode, onClose, lang }) => {
  const t = trackerTranslations;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: colors.primary[500] + "20",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: colors.primary[500] + "30",
          }}
        >
          <Plus size={22} color={colors.primary[500]} />
        </View>
        <View>
          <Typography variant="h5" weight="bold">
            {t.addMetrics[lang]}
          </Typography>
          <Typography variant="caption" color="textMuted">
            {lang === "es"
              ? "Personaliza tu seguimiento"
              : "Customize your tracking"}
          </Typography>
        </View>
      </View>

      <TouchableOpacity
        onPress={onClose}
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: isDarkMode ? colors.gray[800] : colors.gray[100],
          alignItems: "center",
          justifyContent: "center",
        }}
        activeOpacity={0.7}
      >
        <X size={20} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
};

const TemplateContent: React.FC<{
  template: any;
  IconComponent: any;
  displayUnit: string;
  isAdding: boolean;
  colors: any;
  lang: "es" | "en";
}> = ({ template, IconComponent, displayUnit, isAdding, colors, lang }) => {
  const t = trackerTranslations;

  return (
    <>
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          backgroundColor: template.color + "20",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: template.color + "30",
        }}
      >
        {IconComponent && <IconComponent size={22} color={template.color} />}
      </View>

      <View style={{ flex: 1 }}>
        <Typography
          variant="body1"
          weight="semibold"
          style={{ marginBottom: 2 }}
        >
          {getMetricName(template, lang)}
        </Typography>
        <Typography variant="caption" color="textMuted">
          {template.default_target
            ? `${t.goal[lang]}: ${template.default_target} ${displayUnit}`
            : displayUnit}
        </Typography>
      </View>

      {isAdding ? (
        <ActivityIndicator size="small" color={template.color} />
      ) : (
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            backgroundColor: template.color + "15",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: template.color + "30",
          }}
        >
          <Plus size={18} color={template.color} />
        </View>
      )}
    </>
  );
};

const DeletedHeaderContent: React.FC<{
  count: number;
  showDeleted: boolean;
  colors: any;
  lang: "es" | "en";
}> = ({ count, showDeleted, colors, lang }) => {
  const t = trackerTranslations;

  return (
    <>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: colors.gray[200],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RotateCcw size={18} color={colors.textMuted} />
        </View>
        <View>
          <Typography variant="body1" weight="semibold">
            {t.customMetrics[lang]}
          </Typography>
          <Typography variant="caption" color="textMuted">
            {count}{" "}
            {lang === "es"
              ? count === 1
                ? "métrica eliminada"
                : "métricas eliminadas"
              : count === 1
              ? "deleted metric"
              : "deleted metrics"}
          </Typography>
        </View>
      </View>

      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          backgroundColor: colors.gray[100],
          alignItems: "center",
          justifyContent: "center",
          transform: [{ rotate: showDeleted ? "90deg" : "0deg" }],
        }}
      >
        <ChevronRight size={18} color={colors.textMuted} />
      </View>
    </>
  );
};

const DeletedMetricContent: React.FC<{
  metric: any;
  IconComponent: any;
  displayUnit: string;
  colors: any;
  lang: "es" | "en";
}> = ({ metric, IconComponent, displayUnit, colors, lang }) => {
  const t = trackerTranslations;

  return (
    <>
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: metric.color + "15",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.8,
        }}
      >
        {IconComponent && <IconComponent size={20} color={metric.color} />}
      </View>

      <View style={{ flex: 1, opacity: 0.8 }}>
        <Typography variant="body1" weight="medium" style={{ marginBottom: 2 }}>
          {getMetricName(metric, lang)}
        </Typography>
        <Typography variant="caption" color="textMuted">
          {metric.default_target
            ? `${t.goal[lang]}: ${metric.default_target} ${displayUnit}`
            : displayUnit}
        </Typography>
      </View>

      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 12,
          backgroundColor: colors.primary[500] + "15",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: colors.primary[500] + "30",
        }}
      >
        <RotateCcw size={16} color={colors.primary[500]} />
      </View>
    </>
  );
};
