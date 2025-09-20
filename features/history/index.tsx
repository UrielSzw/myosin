import { useColorScheme } from "@/shared/hooks/use-color-scheme";
import { Card } from "@/shared/ui/card";
import { Typography } from "@/shared/ui/typography";
import { Calendar, Clock, TrendingUp, Trophy } from "lucide-react-native";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WorkoutHistoryItem } from "./workout-history-item";

const StatCard: React.FC<{
  label: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  color: string;
}> = ({ label, value, change, icon, color }) => {
  return (
    <Card variant="outlined" padding="md" style={{ flex: 1 }}>
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: color + "20",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          {icon}
        </View>
        <Typography
          variant="h5"
          weight="bold"
          align="center"
          style={{ marginBottom: 2 }}
        >
          {value}
        </Typography>
        <Typography
          variant="caption"
          color="textMuted"
          align="center"
          style={{ marginBottom: 2 }}
        >
          {label}
        </Typography>
        {change && (
          <Typography variant="caption" color="success" align="center">
            {change}
          </Typography>
        )}
      </View>
    </Card>
  );
};

export const HistoryFeature = () => {
  const { colors } = useColorScheme();

  // Mock data
  const workoutHistory = [
    {
      date: "Hoy • 8:30 AM",
      name: "Push Day - Pecho y Hombros",
      duration: "45 min",
      volume: "8.4K kg",
      exercises: 6,
    },
    {
      date: "Ayer • 9:15 AM",
      name: "Pull Day - Espalda y Bíceps",
      duration: "52 min",
      volume: "9.2K kg",
      exercises: 5,
    },
    {
      date: "Lun 29 Jul • 8:45 AM",
      name: "Leg Day - Piernas Completas",
      duration: "68 min",
      volume: "12.1K kg",
      exercises: 7,
    },
    {
      date: "Sáb 27 Jul • 10:00 AM",
      name: "Upper Body Power",
      duration: "50 min",
      volume: "7.8K kg",
      exercises: 4,
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <Typography variant="h2" weight="bold" style={{ marginBottom: 4 }}>
            Historial
          </Typography>
          <Typography variant="body2" color="textMuted">
            Progreso y estadísticas de entrenamientos
          </Typography>
        </View>

        {/* Weekly Stats */}
        <View style={{ marginBottom: 24 }}>
          <Typography
            variant="h5"
            weight="semibold"
            style={{ marginBottom: 16 }}
          >
            Esta Semana
          </Typography>
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
            <StatCard
              label="Entrenamientos"
              value="4"
              change="+1 vs anterior"
              icon={<Calendar size={20} color={colors.primary[500]} />}
              color={colors.primary[500]}
            />
            <StatCard
              label="Tiempo Total"
              value="3.6h"
              change="+15min vs anterior"
              icon={<Clock size={20} color={colors.secondary[500]} />}
              color={colors.secondary[500]}
            />
          </View>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <StatCard
              label="Volumen Total"
              value="37.5K kg"
              change="+2.1K vs anterior"
              icon={<TrendingUp size={20} color={colors.success[500]} />}
              color={colors.success[500]}
            />
            <StatCard
              label="Nuevos PRs"
              value="3"
              change="+2 vs anterior"
              icon={<Trophy size={20} color={colors.warning[500]} />}
              color={colors.warning[500]}
            />
          </View>
        </View>

        {/* Monthly Overview */}
        <View style={{ marginBottom: 24 }}>
          <Typography
            variant="h5"
            weight="semibold"
            style={{ marginBottom: 16 }}
          >
            Este Mes (Julio)
          </Typography>
          <Card variant="outlined" padding="lg">
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <View>
                <Typography variant="h4" weight="bold" color="primary">
                  16
                </Typography>
                <Typography variant="body2" color="textMuted">
                  Entrenamientos
                </Typography>
              </View>
              <View>
                <Typography variant="h4" weight="bold" color="success">
                  13.2h
                </Typography>
                <Typography variant="body2" color="textMuted">
                  Tiempo Total
                </Typography>
              </View>
              <View>
                <Typography variant="h4" weight="bold" color="warning">
                  148K kg
                </Typography>
                <Typography variant="body2" color="textMuted">
                  Volumen Total
                </Typography>
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <View
                style={{
                  flex: 1,
                  height: 8,
                  backgroundColor: colors.gray[200],
                  borderRadius: 4,
                }}
              >
                <View
                  style={{
                    width: "80%",
                    height: "100%",
                    backgroundColor: colors.primary[500],
                    borderRadius: 4,
                  }}
                />
              </View>
              <Typography variant="caption" color="textMuted">
                80% del objetivo
              </Typography>
            </View>
          </Card>
        </View>

        {/* Recent Workouts */}
        <View style={{ marginBottom: 24 }}>
          <Typography
            variant="h5"
            weight="semibold"
            style={{ marginBottom: 16 }}
          >
            Entrenamientos Recientes
          </Typography>
          {workoutHistory.map((workout, index) => (
            <WorkoutHistoryItem
              key={index}
              date={workout.date}
              name={workout.name}
              duration={workout.duration}
              volume={workout.volume}
              exercises={workout.exercises}
            />
          ))}
        </View>

        {/* Personal Records */}
        <View style={{ marginBottom: 32 }}>
          <Typography
            variant="h5"
            weight="semibold"
            style={{ marginBottom: 16 }}
          >
            Records Personales Recientes
          </Typography>

          <Card variant="outlined" padding="md" style={{ marginBottom: 12 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  weight="semibold"
                  style={{ marginBottom: 2 }}
                >
                  Press de Banca
                </Typography>
                <Typography variant="body2" color="textMuted">
                  Hoy • 8:30 AM
                </Typography>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Typography variant="h6" weight="bold" color="success">
                  85kg × 5
                </Typography>
                <Typography variant="caption" color="success">
                  +5kg
                </Typography>
              </View>
            </View>
          </Card>

          <Card variant="outlined" padding="md" style={{ marginBottom: 12 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  weight="semibold"
                  style={{ marginBottom: 2 }}
                >
                  Dominadas
                </Typography>
                <Typography variant="body2" color="textMuted">
                  Lun 29 Jul • 9:15 AM
                </Typography>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Typography variant="h6" weight="bold" color="success">
                  12 reps
                </Typography>
                <Typography variant="caption" color="success">
                  +2 reps
                </Typography>
              </View>
            </View>
          </Card>

          <Card variant="outlined" padding="md">
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  weight="semibold"
                  style={{ marginBottom: 2 }}
                >
                  Sentadillas
                </Typography>
                <Typography variant="body2" color="textMuted">
                  Sáb 27 Jul • 10:00 AM
                </Typography>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Typography variant="h6" weight="bold" color="success">
                  105kg × 6
                </Typography>
                <Typography variant="caption" color="success">
                  +5kg
                </Typography>
              </View>
            </View>
          </Card>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};
