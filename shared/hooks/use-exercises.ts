import { useEffect, useState } from "react";
import { exercisesRepository } from "../db/repository/exercises";
import { BaseExercise } from "../db/schema";

export const useExercises = () => {
  const [exercises, setExercises] = useState<BaseExercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const getRoutines = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await exercisesRepository.findAll();
        if (mounted) setExercises(data);
      } catch (err: any) {
        if (mounted)
          setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    getRoutines();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    exercises,
    loading,
    error,
  };
};
