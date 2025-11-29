import {
  getInputConfig,
  PREDEFINED_QUICK_ACTION_TEMPLATES,
} from "@/features/tracker/constants/templates";
import {
  useAddEntry,
  useDayData,
  useDeleteEntry,
  useDeleteMetric,
  useUpdateMetric,
} from "@/features/tracker/hooks/use-tracker-data";
import { formatTime, formatValue } from "@/features/tracker/utils/helpers";
import { MainMetric } from "@/shared/db/schema";
import { TrackerMetricWithQuickActions } from "@/shared/db/schema/tracker";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { useHaptic } from "@/shared/services/haptic-service";
import {
  getMetricName,
  getQuickActionLabel,
  trackerTranslations,
  trackerUiTranslations,
} from "@/shared/translations/tracker";
import { Typography } from "@/shared/ui/typography";
import { fromKg, toKg, WeightUnit } from "@/shared/utils/weight-conversion";
import { BlurView } from "expo-blur";
import * as Icons from "lucide-react-native";
import {
  Check,
  Clock,
  Minus,
  Plus,
  Settings,
  Target,
  Trash2,
  X,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";

type Props = {
  selectedMetric: MainMetric | null;
  setSelectedMetric: (metric: MainMetric | null) => void;
  selectedDate: string;
  lang: "es" | "en";
};

export const MetricModalV2: React.FC<Props> = ({
  selectedMetric,
  setSelectedMetric,
  selectedDate,
  lang,
}) => {
  const t = trackerTranslations;
  const tUi = trackerUiTranslations;
  const { colors, isDarkMode } = useColorScheme();
  const { user } = useAuth();
  const haptic = useHaptic();
  const prefs = useUserPreferences();
  const weightUnit = (prefs?.weight_unit ?? "kg") as WeightUnit;

  const addEntryMutation = useAddEntry();
  const { data: dayData } = useDayData(selectedDate, user?.id || "");
  const updateMetricMutation = useUpdateMetric();
  const deleteMetricMutation = useDeleteMetric();

  // States
  const [inputValue, setInputValue] = useState("");
  const [quickActionCounts, setQuickActionCounts] = useState<{
    [index: number]: number;
  }>({});
  const [showSettings, setShowSettings] = useState(false);
  const [targetValue, setTargetValue] = useState("");

  // Computed values
  const currentMetricData = dayData?.metrics.find(
    (m) => m.id === selectedMetric?.id
  );
  const currentValue = currentMetricData?.aggregate?.sum_normalized || 0;

  const isWeightMetric = selectedMetric?.slug === "weight";
  const displayUnit = isWeightMetric ? weightUnit : selectedMetric?.unit || "";

  const displayValue = isWeightMetric
    ? fromKg(currentValue, weightUnit, 1)
    : currentValue;

  const handleCloseModal = () => {
    setSelectedMetric(null);
    setInputValue("");
    setQuickActionCounts({});
    setShowSettings(false);
  };

  // ===== MANUAL INPUT =====
  const handleAddValue = async () => {
    if (!selectedMetric || !user?.id) return;

    const numValue = parseFloat(inputValue);
    if (isNaN(numValue) || numValue <= 0) return;

    try {
      const valueToStore = isWeightMetric
        ? toKg(numValue, weightUnit)
        : numValue;

      await addEntryMutation.mutateAsync({
        metricId: selectedMetric.id,
        value: valueToStore,
        userId: user.id,
        recordedAt: selectedDate,
        notes: tUi.manualEntry[lang],
      });
      haptic.success();
      handleCloseModal();
    } catch (error) {
      console.error("Error adding entry:", error);
    }
  };

  // ===== QUICK ACTIONS =====
  const getQuickActions = () => {
    if (!selectedMetric) return [];
    const metricWithQuickActions =
      selectedMetric as TrackerMetricWithQuickActions;
    if (
      metricWithQuickActions.quick_actions &&
      metricWithQuickActions.quick_actions.length
    ) {
      return metricWithQuickActions.quick_actions;
    }
    return PREDEFINED_QUICK_ACTION_TEMPLATES[selectedMetric.slug || ""] || [];
  };

  const quickActions = getQuickActions();

  const handleQuickActionIncrement = (index: number) => {
    haptic.light();
    setQuickActionCounts((prev) => ({
      ...prev,
      [index]: (prev[index] || 0) + 1,
    }));
  };

  const handleQuickActionDecrement = (index: number) => {
    haptic.light();
    setQuickActionCounts((prev) => ({
      ...prev,
      [index]: Math.max(0, (prev[index] || 0) - 1),
    }));
  };

  const handleConfirmQuickActions = async () => {
    if (!selectedMetric || !user?.id) return;

    try {
      for (const [indexStr, count] of Object.entries(quickActionCounts)) {
        const actionIndex = parseInt(indexStr);
        const action = quickActions?.[actionIndex];

        if (action && count > 0) {
          for (let i = 0; i < count; i++) {
            await addEntryMutation.mutateAsync({
              metricId: selectedMetric.id,
              value: action.value,
              userId: user.id,
              notes: `Quick: ${getQuickActionLabel(action, lang)}`,
              recordedAt: selectedDate,
              displayValue: (action as any).display_value || `${action.value}`,
            });
          }
        }
      }
      setQuickActionCounts({});
      haptic.success();
      handleCloseModal();
    } catch (error) {
      console.error("Error adding quick actions:", error);
    }
  };

  const getTotalQuickActionValue = () => {
    return Object.entries(quickActionCounts).reduce(
      (total, [indexStr, count]) => {
        const actionIndex = parseInt(indexStr);
        const action = quickActions?.[actionIndex];
        return total + (action ? action.value * count : 0);
      },
      0
    );
  };

  const hasQuickActionSelections = () => {
    return Object.values(quickActionCounts).some((count) => count > 0);
  };

  // ===== SCALE INPUT =====
  const handleScaleSelect = async (value: number, displayVal: string) => {
    if (!selectedMetric || !user?.id) return;

    try {
      await addEntryMutation.mutateAsync({
        metricId: selectedMetric.id,
        value,
        userId: user.id,
        displayValue: displayVal,
        recordedAt: selectedDate,
        notes: tUi.scaleInputEntry[lang],
      });
      haptic.success();
      handleCloseModal();
    } catch (error) {
      console.error("Error adding scale entry:", error);
    }
  };

  // ===== BOOLEAN INPUT =====
  const handleBooleanSelect = async (value: number, displayVal: string) => {
    if (!selectedMetric || !user?.id) return;

    try {
      await addEntryMutation.mutateAsync({
        metricId: selectedMetric.id,
        value,
        userId: user.id,
        displayValue: displayVal,
        recordedAt: selectedDate,
        notes: tUi.booleanInputEntry[lang],
      });
      haptic.success();
      handleCloseModal();
    } catch (error) {
      console.error("Error adding boolean entry:", error);
    }
  };

  // ===== SETTINGS =====
  const handleSaveTarget = async () => {
    if (!selectedMetric) return;

    const target = targetValue.trim() === "" ? null : parseFloat(targetValue);
    if (target !== null && (isNaN(target) || target < 0)) return;

    try {
      await updateMetricMutation.mutateAsync({
        metricId: selectedMetric.id,
        data: { default_target: target },
      });
      haptic.success();
      setShowSettings(false);
    } catch (error) {
      console.error("Error saving target:", error);
    }
  };

  const handleDeleteMetric = () => {
    if (!selectedMetric) return;

    Alert.alert(
      t.targetEditor.deleteConfirmTitle[lang],
      `${t.targetEditor.deleteConfirmMessage[lang]} "${getMetricName(
        selectedMetric,
        lang
      )}"? ${t.targetEditor.deleteConfirmNote[lang]}`,
      [
        { text: t.cancel[lang], style: "cancel" },
        {
          text: t.targetEditor.deleteMetric[lang],
          style: "destructive",
          onPress: async () => {
            await deleteMetricMutation.mutateAsync(selectedMetric.id);
            handleCloseModal();
          },
        },
      ]
    );
  };

  // ===== HISTORY =====
  const todayEntries = useMemo(() => {
    if (!dayData || !selectedMetric?.id) return [];
    const metricData = dayData.metrics.find((m) => m.id === selectedMetric.id);
    return metricData?.entries || [];
  }, [dayData, selectedMetric?.id]);

  if (!selectedMetric) return null;

  const IconComponent = (Icons as any)[selectedMetric.icon];
  const metricColor = selectedMetric.color;

  // Determine input type
  const inputType = selectedMetric.input_type || "numeric_accumulative";
  const isNumericType =
    inputType === "numeric_accumulative" || inputType === "numeric_single";
  const isScaleType = inputType === "scale_discrete";
  const isBooleanType = inputType === "boolean_toggle";

  return (
    <Modal
      visible={!!selectedMetric}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCloseModal}
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
                selectedMetric={selectedMetric}
                IconComponent={IconComponent}
                metricColor={metricColor}
                displayValue={displayValue}
                displayUnit={displayUnit}
                showSettings={showSettings}
                setShowSettings={setShowSettings}
                onClose={handleCloseModal}
                colors={colors}
                isDarkMode={isDarkMode}
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
                selectedMetric={selectedMetric}
                IconComponent={IconComponent}
                metricColor={metricColor}
                displayValue={displayValue}
                displayUnit={displayUnit}
                showSettings={showSettings}
                setShowSettings={setShowSettings}
                onClose={handleCloseModal}
                colors={colors}
                isDarkMode={isDarkMode}
                lang={lang}
              />
            </View>
          )}
        </Animated.View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {showSettings ? (
              <SettingsSection
                selectedMetric={selectedMetric}
                targetValue={targetValue}
                setTargetValue={setTargetValue}
                displayUnit={displayUnit}
                onSave={handleSaveTarget}
                onDelete={handleDeleteMetric}
                colors={colors}
                isDarkMode={isDarkMode}
                lang={lang}
              />
            ) : (
              <>
                {/* Numeric Input Type */}
                {isNumericType && (
                  <>
                    {/* Quick Actions */}
                    {quickActions.length > 0 && (
                      <QuickActionsSection
                        quickActions={quickActions}
                        quickActionCounts={quickActionCounts}
                        metricColor={metricColor}
                        isWeightMetric={isWeightMetric}
                        weightUnit={weightUnit}
                        displayUnit={displayUnit}
                        onIncrement={handleQuickActionIncrement}
                        onDecrement={handleQuickActionDecrement}
                        onConfirm={handleConfirmQuickActions}
                        hasSelections={hasQuickActionSelections()}
                        totalValue={getTotalQuickActionValue()}
                        colors={colors}
                        isDarkMode={isDarkMode}
                        lang={lang}
                      />
                    )}

                    {/* Manual Input */}
                    <ManualInputSection
                      inputValue={inputValue}
                      setInputValue={setInputValue}
                      displayUnit={displayUnit}
                      metricColor={metricColor}
                      onSubmit={handleAddValue}
                      isPending={addEntryMutation.isPending}
                      colors={colors}
                      isDarkMode={isDarkMode}
                      lang={lang}
                    />
                  </>
                )}

                {/* Scale Input Type */}
                {isScaleType && (
                  <ScaleInputSection
                    metric={selectedMetric}
                    currentEntry={todayEntries[0]?.value}
                    onSelect={handleScaleSelect}
                    colors={colors}
                    isDarkMode={isDarkMode}
                    lang={lang}
                  />
                )}

                {/* Boolean Input Type */}
                {isBooleanType && (
                  <BooleanInputSection
                    metric={selectedMetric}
                    onSelect={handleBooleanSelect}
                    colors={colors}
                    lang={lang}
                  />
                )}

                {/* Daily History */}
                {todayEntries.length > 0 && (
                  <HistorySection
                    entries={todayEntries}
                    isWeightMetric={isWeightMetric}
                    weightUnit={weightUnit}
                    displayUnit={displayUnit}
                    metricColor={metricColor}
                    colors={colors}
                    isDarkMode={isDarkMode}
                    lang={lang}
                  />
                )}

                {/* Daily Summary */}
                {currentValue > 0 && selectedMetric.default_target && (
                  <SummarySection
                    currentValue={displayValue}
                    target={
                      isWeightMetric
                        ? fromKg(selectedMetric.default_target, weightUnit, 1)
                        : selectedMetric.default_target
                    }
                    displayUnit={displayUnit}
                    metricColor={metricColor}
                    colors={colors}
                    isDarkMode={isDarkMode}
                    lang={lang}
                  />
                )}
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

// ===== SUB-COMPONENTS =====

const HeaderContent: React.FC<{
  selectedMetric: MainMetric;
  IconComponent: any;
  metricColor: string;
  displayValue: number;
  displayUnit: string;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  onClose: () => void;
  colors: any;
  isDarkMode: boolean;
  lang: "es" | "en";
}> = ({
  selectedMetric,
  IconComponent,
  metricColor,
  displayValue,
  displayUnit,
  showSettings,
  setShowSettings,
  onClose,
  colors,
  isDarkMode,
  lang,
}) => {
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
            width: 48,
            height: 48,
            borderRadius: 16,
            backgroundColor: metricColor + "20",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: metricColor + "30",
          }}
        >
          {IconComponent && <IconComponent size={24} color={metricColor} />}
        </View>
        <View>
          <Typography variant="h5" weight="bold">
            {getMetricName(selectedMetric, lang)}
          </Typography>
          {displayValue > 0 && (
            <Typography variant="caption" color="textMuted">
              {t.modalHeader.current[lang]}: {formatValue(displayValue)}{" "}
              {displayUnit}
            </Typography>
          )}
        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {/* Settings Toggle */}
        <TouchableOpacity
          onPress={() => setShowSettings(!showSettings)}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: showSettings
              ? metricColor + "20"
              : isDarkMode
              ? colors.gray[800]
              : colors.gray[100],
            alignItems: "center",
            justifyContent: "center",
          }}
          activeOpacity={0.7}
        >
          <Settings
            size={20}
            color={showSettings ? metricColor : colors.textMuted}
          />
        </TouchableOpacity>

        {/* Close Button */}
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
    </View>
  );
};

const QuickActionsSection: React.FC<{
  quickActions: any[];
  quickActionCounts: { [index: number]: number };
  metricColor: string;
  isWeightMetric: boolean;
  weightUnit: WeightUnit;
  displayUnit: string;
  onIncrement: (index: number) => void;
  onDecrement: (index: number) => void;
  onConfirm: () => void;
  hasSelections: boolean;
  totalValue: number;
  colors: any;
  isDarkMode: boolean;
  lang: "es" | "en";
}> = ({
  quickActions,
  quickActionCounts,
  metricColor,
  isWeightMetric,
  weightUnit,
  displayUnit,
  onIncrement,
  onDecrement,
  onConfirm,
  hasSelections,
  totalValue,
  colors,
  isDarkMode,
  lang,
}) => {
  const t = trackerTranslations;

  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(300)}
      style={{ marginBottom: 24 }}
    >
      <Typography variant="h6" weight="semibold" style={{ marginBottom: 16 }}>
        {t.quickActions.title[lang]}
      </Typography>

      <View style={{ gap: 10 }}>
        {quickActions.map((action, index) => {
          const ActionIcon = action.icon ? (Icons as any)[action.icon] : null;
          const count = quickActionCounts[index] || 0;
          const isSelected = count > 0;

          return (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(150 + index * 50).duration(300)}
            >
              <View
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: isSelected ? metricColor : colors.border + "60",
                }}
              >
                {Platform.OS === "ios" ? (
                  <BlurView
                    intensity={isSelected ? 40 : 20}
                    tint={isDarkMode ? "dark" : "light"}
                    style={{
                      padding: 16,
                      backgroundColor: isSelected
                        ? metricColor + "15"
                        : "transparent",
                    }}
                  >
                    <QuickActionContent
                      action={action}
                      ActionIcon={ActionIcon}
                      count={count}
                      isSelected={isSelected}
                      metricColor={metricColor}
                      isWeightMetric={isWeightMetric}
                      weightUnit={weightUnit}
                      displayUnit={displayUnit}
                      onIncrement={() => onIncrement(index)}
                      onDecrement={() => onDecrement(index)}
                      colors={colors}
                      lang={lang}
                    />
                  </BlurView>
                ) : (
                  <View
                    style={{
                      padding: 16,
                      backgroundColor: isSelected
                        ? metricColor + "15"
                        : colors.surface,
                    }}
                  >
                    <QuickActionContent
                      action={action}
                      ActionIcon={ActionIcon}
                      count={count}
                      isSelected={isSelected}
                      metricColor={metricColor}
                      isWeightMetric={isWeightMetric}
                      weightUnit={weightUnit}
                      displayUnit={displayUnit}
                      onIncrement={() => onIncrement(index)}
                      onDecrement={() => onDecrement(index)}
                      colors={colors}
                      lang={lang}
                    />
                  </View>
                )}
              </View>
            </Animated.View>
          );
        })}

        {/* Confirm Button */}
        {hasSelections && (
          <Animated.View entering={FadeInUp.duration(200)}>
            <TouchableOpacity
              onPress={onConfirm}
              style={{
                marginTop: 8,
                paddingVertical: 16,
                borderRadius: 16,
                backgroundColor: metricColor,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
              activeOpacity={0.8}
            >
              <Plus size={20} color="#ffffff" />
              <Typography
                variant="body1"
                weight="bold"
                style={{ color: "#ffffff" }}
              >
                {t.quickActions.addSelection[lang]} (+
                {formatValue(
                  isWeightMetric
                    ? fromKg(totalValue, weightUnit, 1)
                    : totalValue
                )}{" "}
                {displayUnit})
              </Typography>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
};

const QuickActionContent: React.FC<{
  action: any;
  ActionIcon: any;
  count: number;
  isSelected: boolean;
  metricColor: string;
  isWeightMetric: boolean;
  weightUnit: WeightUnit;
  displayUnit: string;
  onIncrement: () => void;
  onDecrement: () => void;
  colors: any;
  lang: "es" | "en";
}> = ({
  action,
  ActionIcon,
  count,
  isSelected,
  metricColor,
  isWeightMetric,
  weightUnit,
  displayUnit,
  onIncrement,
  onDecrement,
  colors,
  lang,
}) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <View
      style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}
    >
      {ActionIcon && (
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: metricColor + "20",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActionIcon size={18} color={metricColor} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Typography variant="body2" weight="medium">
          {getQuickActionLabel(action, lang)}
        </Typography>
        <Typography variant="caption" color="textMuted">
          +
          {formatValue(
            isWeightMetric ? fromKg(action.value, weightUnit, 1) : action.value
          )}{" "}
          {displayUnit}
          {count > 0 &&
            ` × ${count} = +${formatValue(
              isWeightMetric
                ? fromKg(action.value * count, weightUnit, 1)
                : action.value * count
            )}`}
        </Typography>
      </View>
    </View>

    {/* Counter Controls */}
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <TouchableOpacity
        onPress={onDecrement}
        disabled={count === 0}
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: count > 0 ? colors.gray[300] : colors.gray[100],
          alignItems: "center",
          justifyContent: "center",
          opacity: count === 0 ? 0.5 : 1,
        }}
        activeOpacity={0.7}
      >
        <Minus size={18} color={colors.text} />
      </TouchableOpacity>

      <Typography
        variant="h6"
        weight="bold"
        style={{
          minWidth: 28,
          textAlign: "center",
          color: isSelected ? metricColor : colors.textMuted,
        }}
      >
        {count}
      </Typography>

      <TouchableOpacity
        onPress={onIncrement}
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: metricColor + "30",
          alignItems: "center",
          justifyContent: "center",
        }}
        activeOpacity={0.7}
      >
        <Plus size={18} color={metricColor} />
      </TouchableOpacity>
    </View>
  </View>
);

const ManualInputSection: React.FC<{
  inputValue: string;
  setInputValue: (value: string) => void;
  displayUnit: string;
  metricColor: string;
  onSubmit: () => void;
  isPending: boolean;
  colors: any;
  isDarkMode: boolean;
  lang: "es" | "en";
}> = ({
  inputValue,
  setInputValue,
  displayUnit,
  metricColor,
  onSubmit,
  isPending,
  colors,
  isDarkMode,
  lang,
}) => {
  const t = trackerTranslations;
  const numValue = parseFloat(inputValue) || 0;
  const isValid = numValue > 0;

  return (
    <Animated.View
      entering={FadeInDown.delay(200).duration(300)}
      style={{ marginBottom: 24 }}
    >
      <Typography variant="h6" weight="semibold" style={{ marginBottom: 16 }}>
        {t.manualInput.title[lang]}
      </Typography>

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
              paddingHorizontal: 16,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                paddingVertical: 18,
                fontSize: 20,
                fontWeight: "600",
                color: colors.text,
              }}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={`${t.manualInput.placeholder[lang]} ${displayUnit}`}
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={onSubmit}
            />
            <Typography
              variant="body2"
              color="textMuted"
              style={{ marginLeft: 8 }}
            >
              {displayUnit}
            </Typography>
          </BlurView>
        ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              backgroundColor: colors.surface,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                paddingVertical: 18,
                fontSize: 20,
                fontWeight: "600",
                color: colors.text,
              }}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={`${t.manualInput.placeholder[lang]} ${displayUnit}`}
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              returnKeyType="done"
              onSubmitEditing={onSubmit}
            />
            <Typography
              variant="body2"
              color="textMuted"
              style={{ marginLeft: 8 }}
            >
              {displayUnit}
            </Typography>
          </View>
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={onSubmit}
        disabled={!isValid || isPending}
        style={{
          marginTop: 12,
          paddingVertical: 16,
          borderRadius: 16,
          backgroundColor: isValid ? metricColor : colors.gray[300],
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: isValid ? 1 : 0.5,
        }}
        activeOpacity={0.8}
      >
        <Plus size={20} color="#ffffff" />
        <Typography variant="body1" weight="bold" style={{ color: "#ffffff" }}>
          {t.manualInput.addButton[lang]} {formatValue(numValue)} {displayUnit}
        </Typography>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ScaleInputSection: React.FC<{
  metric: MainMetric;
  currentEntry?: number;
  onSelect: (value: number, displayValue: string) => void;
  colors: any;
  isDarkMode: boolean;
  lang: "es" | "en";
}> = ({ metric, currentEntry, onSelect, colors, isDarkMode, lang }) => {
  const t = trackerTranslations;
  const inputConfig = getInputConfig(metric.slug);

  if (!inputConfig || !("scaleLabels" in inputConfig)) {
    return null;
  }

  const { scaleLabels, scaleIcons = [], min = 1 } = inputConfig as any;

  const getTranslatedLabel = (value: number): string => {
    const metricSlug = metric.slug;
    if (metricSlug && (t.scaleLabels as any)[metricSlug]) {
      const scaleLabelsForMetric = (t.scaleLabels as any)[metricSlug];
      return (
        scaleLabelsForMetric[value]?.[lang] || scaleLabels[value - min] || ""
      );
    }
    return scaleLabels[value - min] || "";
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(300)}
      style={{ marginBottom: 24 }}
    >
      <Typography variant="h6" weight="semibold" style={{ marginBottom: 16 }}>
        {lang === "es" ? "Selecciona un valor" : "Select a value"}
      </Typography>

      <View style={{ gap: 10 }}>
        {scaleLabels.map((label: any, index: number) => {
          const value = min + index;
          const isSelected = currentEntry === value;
          const iconName = scaleIcons[index] || "";
          const IconComponent = iconName ? (Icons as any)[iconName] : null;
          const translatedLabel = getTranslatedLabel(value);

          return (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(150 + index * 50).duration(300)}
            >
              <TouchableOpacity
                onPress={() =>
                  onSelect(value, `${iconName} ${translatedLabel}`)
                }
                activeOpacity={0.8}
              >
                <View
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    borderWidth: isSelected ? 2 : 1,
                    borderColor: isSelected
                      ? metric.color
                      : colors.border + "60",
                  }}
                >
                  {Platform.OS === "ios" ? (
                    <BlurView
                      intensity={isSelected ? 40 : 20}
                      tint={isDarkMode ? "dark" : "light"}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 16,
                        gap: 12,
                        backgroundColor: isSelected
                          ? metric.color + "15"
                          : "transparent",
                      }}
                    >
                      {IconComponent && (
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            backgroundColor: metric.color + "20",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IconComponent size={20} color={metric.color} />
                        </View>
                      )}
                      <View style={{ flex: 1 }}>
                        <Typography variant="body1" weight="semibold">
                          {translatedLabel}
                        </Typography>
                        <Typography variant="caption" color="textMuted">
                          {t.states.level[lang]} {value}
                        </Typography>
                      </View>
                      {isSelected && (
                        <View
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 14,
                            backgroundColor: metric.color,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Check size={16} color="#ffffff" />
                        </View>
                      )}
                    </BlurView>
                  ) : (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 16,
                        gap: 12,
                        backgroundColor: isSelected
                          ? metric.color + "15"
                          : colors.surface,
                      }}
                    >
                      {IconComponent && (
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            backgroundColor: metric.color + "20",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IconComponent size={20} color={metric.color} />
                        </View>
                      )}
                      <View style={{ flex: 1 }}>
                        <Typography variant="body1" weight="semibold">
                          {translatedLabel}
                        </Typography>
                        <Typography variant="caption" color="textMuted">
                          {t.states.level[lang]} {value}
                        </Typography>
                      </View>
                      {isSelected && (
                        <View
                          style={{
                            width: 28,
                            height: 28,
                            borderRadius: 14,
                            backgroundColor: metric.color,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Check size={16} color="#ffffff" />
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </Animated.View>
  );
};

const BooleanInputSection: React.FC<{
  metric: MainMetric;
  onSelect: (value: number, displayValue: string) => void;
  colors: any;
  lang: "es" | "en";
}> = ({ metric, onSelect, colors, lang }) => {
  const t = trackerTranslations;
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const inputConfig = getInputConfig(metric.slug);

  const getTrueLabel = () => {
    if (inputConfig && "booleanLabels" in inputConfig) {
      const labels = (inputConfig as any).booleanLabels;
      return labels?.true || (lang === "es" ? "Sí" : "Yes");
    }
    if (metric.slug && (t.booleanLabels as any)[metric.slug]) {
      return (
        (t.booleanLabels as any)[metric.slug].true?.[lang] ||
        (lang === "es" ? "Sí" : "Yes")
      );
    }
    return lang === "es" ? "Sí" : "Yes";
  };

  const getFalseLabel = () => {
    if (inputConfig && "booleanLabels" in inputConfig) {
      const labels = (inputConfig as any).booleanLabels;
      return labels?.false || "No";
    }
    if (metric.slug && (t.booleanLabels as any)[metric.slug]) {
      return (t.booleanLabels as any)[metric.slug].false?.[lang] || "No";
    }
    return "No";
  };

  const handleSelect = (value: number) => {
    setSelectedValue(value);
  };

  const handleConfirm = () => {
    if (selectedValue !== null) {
      const label = selectedValue === 1 ? getTrueLabel() : getFalseLabel();
      onSelect(selectedValue, label);
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(300)}
      style={{ marginBottom: 24 }}
    >
      <Typography variant="h6" weight="semibold" style={{ marginBottom: 16 }}>
        {lang === "es" ? "¿Cómo te fue hoy?" : "How did it go today?"}
      </Typography>

      <View style={{ flexDirection: "row", gap: 12 }}>
        {/* TRUE Option */}
        <TouchableOpacity
          onPress={() => handleSelect(1)}
          style={{ flex: 1 }}
          activeOpacity={0.8}
        >
          <Animated.View
            entering={FadeInDown.delay(150).duration(300)}
            style={{
              padding: 20,
              borderRadius: 16,
              backgroundColor:
                selectedValue === 1 ? "#10B981" + "20" : colors.surface,
              borderWidth: 2,
              borderColor: selectedValue === 1 ? "#10B981" : colors.border,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "#10B981" + "20",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Check size={28} color="#10B981" />
            </View>
            <Typography
              variant="body1"
              weight="bold"
              style={{ color: "#10B981" }}
            >
              {getTrueLabel()}
            </Typography>
          </Animated.View>
        </TouchableOpacity>

        {/* FALSE Option */}
        <TouchableOpacity
          onPress={() => handleSelect(0)}
          style={{ flex: 1 }}
          activeOpacity={0.8}
        >
          <Animated.View
            entering={FadeInDown.delay(200).duration(300)}
            style={{
              padding: 20,
              borderRadius: 16,
              backgroundColor:
                selectedValue === 0 ? "#EF4444" + "20" : colors.surface,
              borderWidth: 2,
              borderColor: selectedValue === 0 ? "#EF4444" : colors.border,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: "#EF4444" + "20",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <X size={28} color="#EF4444" />
            </View>
            <Typography
              variant="body1"
              weight="bold"
              style={{ color: "#EF4444" }}
            >
              {getFalseLabel()}
            </Typography>
          </Animated.View>
        </TouchableOpacity>
      </View>

      {/* Confirm Button */}
      {selectedValue !== null && (
        <Animated.View entering={FadeInUp.duration(200)}>
          <TouchableOpacity
            onPress={handleConfirm}
            style={{
              marginTop: 16,
              paddingVertical: 16,
              borderRadius: 16,
              backgroundColor: metric.color,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            activeOpacity={0.8}
          >
            <Check size={20} color="#ffffff" />
            <Typography
              variant="body1"
              weight="bold"
              style={{ color: "#ffffff" }}
            >
              {lang === "es" ? "Confirmar" : "Confirm"}
            </Typography>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const HistorySection: React.FC<{
  entries: any[];
  isWeightMetric: boolean;
  weightUnit: WeightUnit;
  displayUnit: string;
  metricColor: string;
  colors: any;
  isDarkMode: boolean;
  lang: "es" | "en";
}> = ({
  entries,
  isWeightMetric,
  weightUnit,
  displayUnit,
  metricColor,
  colors,
  isDarkMode,
  lang,
}) => {
  const t = trackerTranslations;
  const deleteEntryMutation = useDeleteEntry();

  const handleDelete = async (entryId: string) => {
    try {
      await deleteEntryMutation.mutateAsync(entryId);
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(300).duration(300)}
      style={{ marginBottom: 24 }}
    >
      <Typography variant="h6" weight="semibold" style={{ marginBottom: 16 }}>
        {t.dailyHistory.title[lang]}
      </Typography>

      <View
        style={{
          borderRadius: 16,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: colors.border + "60",
        }}
      >
        {Platform.OS === "ios" ? (
          <BlurView intensity={20} tint={isDarkMode ? "dark" : "light"}>
            {entries.map((entry, index) => (
              <View
                key={entry.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  borderBottomWidth: index < entries.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border + "40",
                }}
              >
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 4,
                    }}
                  >
                    <Clock size={12} color={colors.textMuted} />
                    <Typography variant="caption" color="textMuted">
                      {formatTime(entry.recorded_at)}
                    </Typography>
                  </View>
                  <Typography variant="body1" weight="semibold">
                    +
                    {formatValue(
                      isWeightMetric
                        ? fromKg(entry.value, weightUnit, 1)
                        : entry.value
                    )}{" "}
                    {displayUnit}
                  </Typography>
                  {entry.notes && (
                    <Typography variant="caption" color="textMuted">
                      {entry.notes}
                    </Typography>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => handleDelete(entry.id)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: colors.error[50],
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  activeOpacity={0.7}
                >
                  <Trash2 size={16} color={colors.error[500]} />
                </TouchableOpacity>
              </View>
            ))}
          </BlurView>
        ) : (
          <View style={{ backgroundColor: colors.surface }}>
            {entries.map((entry, index) => (
              <View
                key={entry.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  borderBottomWidth: index < entries.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border,
                }}
              >
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 4,
                    }}
                  >
                    <Clock size={12} color={colors.textMuted} />
                    <Typography variant="caption" color="textMuted">
                      {formatTime(entry.recorded_at)}
                    </Typography>
                  </View>
                  <Typography variant="body1" weight="semibold">
                    +
                    {formatValue(
                      isWeightMetric
                        ? fromKg(entry.value, weightUnit, 1)
                        : entry.value
                    )}{" "}
                    {displayUnit}
                  </Typography>
                  {entry.notes && (
                    <Typography variant="caption" color="textMuted">
                      {entry.notes}
                    </Typography>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => handleDelete(entry.id)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: colors.error[50],
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  activeOpacity={0.7}
                >
                  <Trash2 size={16} color={colors.error[500]} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const SummarySection: React.FC<{
  currentValue: number;
  target: number;
  displayUnit: string;
  metricColor: string;
  colors: any;
  isDarkMode: boolean;
  lang: "es" | "en";
}> = ({
  currentValue,
  target,
  displayUnit,
  metricColor,
  colors,
  isDarkMode,
  lang,
}) => {
  const progress = Math.min((currentValue / target) * 100, 100);

  return (
    <Animated.View
      entering={FadeInDown.delay(400).duration(300)}
      style={{ marginBottom: 24 }}
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
            style={{ padding: 20 }}
          >
            <SummaryContent
              currentValue={currentValue}
              target={target}
              displayUnit={displayUnit}
              metricColor={metricColor}
              progress={progress}
              colors={colors}
              lang={lang}
            />
          </BlurView>
        ) : (
          <View style={{ padding: 20, backgroundColor: colors.surface }}>
            <SummaryContent
              currentValue={currentValue}
              target={target}
              displayUnit={displayUnit}
              metricColor={metricColor}
              progress={progress}
              colors={colors}
              lang={lang}
            />
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const SummaryContent: React.FC<{
  currentValue: number;
  target: number;
  displayUnit: string;
  metricColor: string;
  progress: number;
  colors: any;
  lang: "es" | "en";
}> = ({
  currentValue,
  target,
  displayUnit,
  metricColor,
  progress,
  colors,
  lang,
}) => {
  const t = trackerTranslations;

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
        }}
      >
        <Target size={18} color={metricColor} />
        <Typography variant="h6" weight="semibold">
          {t.dailySummary.title[lang]}
        </Typography>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Typography variant="body2" color="textMuted">
          {t.dailySummary.current[lang]}
        </Typography>
        <Typography variant="body2" weight="semibold">
          {formatValue(currentValue)} {displayUnit}
        </Typography>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Typography variant="body2" color="textMuted">
          {t.dailySummary.goal[lang]}
        </Typography>
        <Typography variant="body2" weight="semibold">
          {formatValue(target)} {displayUnit}
        </Typography>
      </View>

      {/* Progress Bar */}
      <View
        style={{
          height: 10,
          backgroundColor: colors.gray[200],
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            backgroundColor: metricColor,
            width: `${progress}%`,
            borderRadius: 5,
          }}
        />
      </View>

      <Typography
        variant="caption"
        color="textMuted"
        style={{ marginTop: 10, textAlign: "center" }}
      >
        {Math.round(progress)}% {t.dailySummary.completed[lang]}
      </Typography>
    </>
  );
};

const SettingsSection: React.FC<{
  selectedMetric: MainMetric;
  targetValue: string;
  setTargetValue: (value: string) => void;
  displayUnit: string;
  onSave: () => void;
  onDelete: () => void;
  colors: any;
  isDarkMode: boolean;
  lang: "es" | "en";
}> = ({
  selectedMetric,
  targetValue,
  setTargetValue,
  displayUnit,
  onSave,
  onDelete,
  colors,
  isDarkMode,
  lang,
}) => {
  const t = trackerTranslations;

  return (
    <Animated.View entering={FadeIn.duration(300)}>
      {/* Metric Info Card */}
      <View
        style={{
          marginBottom: 24,
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
            style={{ padding: 20 }}
          >
            <Typography
              variant="caption"
              color="textMuted"
              style={{ marginBottom: 4 }}
            >
              {t.selectMetric[lang]}
            </Typography>
            <Typography variant="h6" weight="semibold">
              {getMetricName(selectedMetric, lang)}
            </Typography>
          </BlurView>
        ) : (
          <View style={{ padding: 20, backgroundColor: colors.surface }}>
            <Typography
              variant="caption"
              color="textMuted"
              style={{ marginBottom: 4 }}
            >
              {t.selectMetric[lang]}
            </Typography>
            <Typography variant="h6" weight="semibold">
              {getMetricName(selectedMetric, lang)}
            </Typography>
          </View>
        )}
      </View>

      {/* Target Editor */}
      <View style={{ marginBottom: 32 }}>
        <Typography variant="h6" weight="semibold" style={{ marginBottom: 16 }}>
          {t.targetEditor.targetGoal[lang]}
        </Typography>

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
                paddingHorizontal: 16,
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  paddingVertical: 18,
                  fontSize: 18,
                  fontWeight: "600",
                  color: colors.text,
                }}
                value={targetValue}
                onChangeText={setTargetValue}
                placeholder={t.targetEditor.enterTarget[lang]}
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
              />
              <Typography
                variant="body2"
                color="textMuted"
                style={{ marginLeft: 8 }}
              >
                {displayUnit}
              </Typography>
            </BlurView>
          ) : (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                backgroundColor: colors.surface,
              }}
            >
              <TextInput
                style={{
                  flex: 1,
                  paddingVertical: 18,
                  fontSize: 18,
                  fontWeight: "600",
                  color: colors.text,
                }}
                value={targetValue}
                onChangeText={setTargetValue}
                placeholder={t.targetEditor.enterTarget[lang]}
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
              />
              <Typography
                variant="body2"
                color="textMuted"
                style={{ marginLeft: 8 }}
              >
                {displayUnit}
              </Typography>
            </View>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={{ gap: 12 }}>
        <TouchableOpacity
          onPress={onSave}
          style={{
            paddingVertical: 16,
            borderRadius: 16,
            backgroundColor: selectedMetric.color,
            alignItems: "center",
            justifyContent: "center",
          }}
          activeOpacity={0.8}
        >
          <Typography
            variant="body1"
            weight="bold"
            style={{ color: "#ffffff" }}
          >
            {t.targetEditor.saveChanges[lang]}
          </Typography>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDelete}
          style={{
            paddingVertical: 16,
            borderRadius: 16,
            backgroundColor: colors.error[50],
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            borderWidth: 1,
            borderColor: colors.error[200],
          }}
          activeOpacity={0.8}
        >
          <Trash2 size={18} color={colors.error[500]} />
          <Typography
            variant="body1"
            weight="semibold"
            style={{ color: colors.error[500] }}
          >
            {t.targetEditor.deleteMetric[lang]}
          </Typography>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};
