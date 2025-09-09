import { useQuery } from "@tanstack/react-query";
import { exercisesRepository } from "../db/repository/exercises";

export const useExercises = () => {
  const {
    data: exercises = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["exercises"],
    queryFn: () => exercisesRepository.findAll(),
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
  });

  return {
    exercises,
    loading,
    error: error as Error | null,
  };
};
