import { prRepository } from "@/shared/db/repository/pr";
import { sharedUiTranslations } from "@/shared/translations/shared-ui";
import {
  DEFAULT_LANGUAGE,
  type SupportedLanguage,
} from "@/shared/types/language";
import { IExerciseMuscle } from "@/shared/types/workout";
import { useQuery } from "@tanstack/react-query";

// Tipos que coinciden exactamente con lo que devuelve el repository
export type CurrentPR = {
  id: string;
  user_id: string;
  exercise_id: string;
  best_weight: number;
  best_reps: number;
  estimated_1rm: number;
  achieved_at: string;
  source: "auto" | "manual";
  created_at: string | null;
  updated_at: string | null;
  exercise_name: string;
  exercise_muscle: IExerciseMuscle;
};

export type PRHistoryItem = {
  id: string;
  user_id: string;
  exercise_id: string;
  weight: number;
  reps: number;
  estimated_1rm: number;
  workout_session_id: string | null;
  workout_set_id: string | null;
  source: "auto" | "manual" | "import";
  created_at: string | null;
  updated_at: string | null;
};

export type ExerciseInfo = {
  name: string;
  muscleGroup: IExerciseMuscle;
};

// Tipo que procesamos para la UI (con stats calculados)
export type PRDetailData = {
  currentPR: CurrentPR;
  history: PRHistoryItem[];
  exerciseInfo: ExerciseInfo;
  progressStats: {
    totalProgress: number;
    timeSpan: string;
    averageIncrease: number;
    bestStreak: number;
  };
};

export const PR_DETAIL_QUERY_KEY = ["prDetail"];

export const usePRDetail = (
  exerciseId: string,
  userId?: string,
  lang: SupportedLanguage = DEFAULT_LANGUAGE
) => {
  const t = sharedUiTranslations;
  const query = useQuery<PRDetailData>({
    queryKey: [...PR_DETAIL_QUERY_KEY, exerciseId, userId, lang],
    queryFn: async (): Promise<PRDetailData> => {
      if (!userId) {
        throw new Error("userId is required");
      }
      const repositoryData = await prRepository.getPRHistoryDetailed(
        userId,
        exerciseId
      );

      // Validar que tenemos datos
      if (!repositoryData.currentPR || !repositoryData.exerciseInfo) {
        throw new Error(
          `No se encontraron datos para el ejercicio ${exerciseId}`
        );
      }

      // Calcular stats de progreso
      let progressStats = {
        totalProgress: 0,
        timeSpan: `0 ${t.days[lang]}`,
        averageIncrease: 0,
        bestStreak: 0,
      };

      if (repositoryData.history.length > 1) {
        const firstPR =
          repositoryData.history[repositoryData.history.length - 1]; // Más antiguo
        const currentPR = repositoryData.currentPR;

        const weightProgress = currentPR.best_weight - firstPR.weight;

        // Calcular tiempo transcurrido
        const firstDate = new Date(firstPR.created_at || new Date());
        const currentDate = new Date(currentPR.achieved_at);

        const diffTime = Math.abs(currentDate.getTime() - firstDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffMonths = Math.floor(diffDays / 30);

        const timeSpan =
          diffMonths > 0
            ? `${diffMonths} ${
                diffMonths === 1 ? t.month[lang] : t.months[lang]
              }`
            : `${diffDays} ${t.days[lang]}`;

        const averageIncrease =
          diffMonths > 0 ? weightProgress / diffMonths : 0;

        progressStats = {
          totalProgress: weightProgress,
          timeSpan,
          averageIncrease,
          bestStreak: repositoryData.history.length, // Simplificado por ahora
        };
      }

      return {
        currentPR: repositoryData.currentPR,
        history: repositoryData.history,
        exerciseInfo: repositoryData.exerciseInfo,
        progressStats,
      };
    },
    enabled: !!exerciseId && !!userId,
    staleTime: 1000 * 60 * 2, // 2 minutos
    gcTime: 1000 * 60 * 5, // 5 minutos en cache
    refetchOnWindowFocus: false,
    retry: (failureCount) => failureCount < 2,
  });

  return {
    ...query,
    data: query.data || null,
  };
};
