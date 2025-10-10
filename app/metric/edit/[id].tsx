import { MetricFormFeature } from "@/features/metric-form";
import { useLocalSearchParams } from "expo-router";

export default function EditMetricScreen() {
  const { id } = useLocalSearchParams();

  return <MetricFormFeature isEditMode existingMetricId={id as string} />;
}
