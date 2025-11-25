import { MainMetric } from "@/shared/db/schema";
import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { useUserPreferences } from "@/shared/hooks/use-user-preferences-store";
import { useAuth } from "@/shared/providers/auth-provider";
import { trackerTranslations } from "@/shared/translations/tracker";
import { Button } from "@/shared/ui/button";
import { LoadingScreen } from "@/shared/ui/loading-screen";
import { ScreenWrapper } from "@/shared/ui/screen-wrapper";
import { Typography } from "@/shared/ui/typography";
import { getDayKey } from "@/shared/utils/date-utils";
import { AlertCircle, Plus } from "lucide-react-native";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DatePicker } from "./elements/date-picker";
import { EmptyMetrics } from "./elements/empty-metrics";
import { MetricCard } from "./elements/metric-card";
import { MetricModal } from "./elements/metric-modal";
import { MetricSelectorModal } from "./elements/metric-selector-modal";
import { TrackerHeader } from "./elements/tracker-header";
import { useDayData } from "./hooks/use-tracker-data";

export const TrackerFeature = () => {
  const { colors } = useColorScheme();
  const { user } = useAuth();
  const prefs = useUserPreferences();
  const lang = prefs?.language ?? "es";
  const t = trackerTranslations;

  // UI State
  const [metricSelectorVisible, setMetricSelectorVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => getDayKey());
  const [selectedMetric, setSelectedMetric] = useState<MainMetric | null>(null);

  // Data fetching con React Query - Trae datos completos del día seleccionado
  const {
    data: dayData,
    isLoading: dayDataLoading,
    error: dayDataError,
  } = useDayData(selectedDate, user?.id || "");

  const handleAddMetric = () => {
    setMetricSelectorVisible(true);
  };

  // Authentication check
  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            gap: 16,
          }}
        >
          <AlertCircle size={48} color={colors.primary[500]} />
          <Typography variant="h6" weight="semibold" align="center">
            {t.authRequired[lang]}
          </Typography>
          <Typography variant="body2" color="textMuted" align="center">
            {t.authDescription[lang]}
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  // Loading state durante inicialización
  if (dayDataLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <LoadingScreen withGradient={false} message={t.loading[lang]} />
      </SafeAreaView>
    );
  }

  // Error state
  if (dayDataError) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
            gap: 16,
          }}
        >
          <AlertCircle size={48} color={colors.primary[500]} />
          <Typography variant="h6" weight="semibold" align="center">
            {t.errorLoading[lang]}
          </Typography>
          <Typography variant="body2" color="textMuted" align="center">
            {dayDataError?.message || t.unexpectedError[lang]}
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ScreenWrapper withGradient fullscreen>
      <TrackerHeader selectedDate={selectedDate} />

      <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        <DatePicker
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          lang={lang}
        />

        <View style={{ marginBottom: 32 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Typography variant="h5" weight="semibold">
              {t.dailyMetrics[lang]}
            </Typography>
            <Button
              variant="ghost"
              size="sm"
              onPress={handleAddMetric}
              icon={<Plus size={16} color={colors.primary[500]} />}
            >
              {t.add[lang]}
            </Button>
          </View>

          {/* Metrics Grid */}
          {dayData && dayData.metrics.length > 0 ? (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 24,
              }}
            >
              {dayData.metrics.map((metric) => (
                <MetricCard
                  key={metric.id}
                  metric={metric}
                  date={selectedDate}
                  onPress={() => setSelectedMetric(metric)}
                  lang={lang}
                />
              ))}
            </View>
          ) : (
            <EmptyMetrics onAddMetric={handleAddMetric} lang={lang} />
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Metric Input Modal */}
      <MetricModal
        selectedDate={selectedDate}
        selectedMetric={selectedMetric}
        setSelectedMetric={setSelectedMetric}
        lang={lang}
      />

      {/* Metric Selector Modal */}
      <MetricSelectorModal
        visible={metricSelectorVisible}
        onClose={() => setMetricSelectorVisible(false)}
        lang={lang}
      />
    </ScreenWrapper>
  );
};
