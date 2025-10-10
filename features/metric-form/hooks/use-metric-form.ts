import {
  useCreateMetric,
  useCreateQuickAction,
  useUpdateMetric,
} from "@/features/tracker/hooks/use-tracker-data";
import { METRIC_COLORS } from "@/shared/constants/metric-colors";
import { MetricIconKey } from "@/shared/constants/metric-icons";
import { generateUUID } from "@/shared/db/utils/uuid";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  MetricFormFeatureProps,
  MetricValidationResult,
  QuickActionFormItem,
} from "../types";
import {
  generateSlugFromName,
  validateMetricName,
  validateMetricSlug,
  validateMetricTarget,
  validateMetricUnit,
} from "../utils/validation";

export const useMetricForm = ({
  isEditMode = false,
  existingMetricId,
}: MetricFormFeatureProps) => {
  // Basic info state
  const [metricName, setMetricName] = useState("");
  const [metricSlug, setMetricSlug] = useState("");
  const [metricType, setMetricType] = useState<"counter" | "value">("counter");
  const [unit, setUnit] = useState("");
  const [defaultTarget, setDefaultTarget] = useState<number | undefined>();

  // Style state
  const [metricIcon, setMetricIcon] = useState<MetricIconKey>("Activity");
  const [metricColor, setMetricColor] = useState<string>(METRIC_COLORS.BLUE);

  // Quick actions state
  const [quickActions, setQuickActions] = useState<QuickActionFormItem[]>([]);
  const [showQuickActionsSection, setShowQuickActionsSection] = useState(false);

  // Form state
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting] = useState(false);

  // Auto-generate slug from name
  useEffect(() => {
    if (!isEditMode && metricName) {
      const generatedSlug = generateSlugFromName(metricName);
      setMetricSlug(generatedSlug);
    }
  }, [metricName, isEditMode]);

  // Validation
  const nameValidation: MetricValidationResult = {
    isValid:
      validateMetricName(metricName) === null &&
      validateMetricSlug(metricSlug) === null,
    isValidating: false,
    errors: {
      name: validateMetricName(metricName) || undefined,
      slug: validateMetricSlug(metricSlug) || undefined,
      unit: validateMetricUnit(unit) || undefined,
      target: validateMetricTarget(defaultTarget) || undefined,
    },
  };

  // Mutations
  const createMetricMutation = useCreateMetric();
  const updateMetricMutation = useUpdateMetric();
  const createQuickActionMutation = useCreateQuickAction();

  // Helper to create quick actions for a metric
  const createQuickActionsForMetric = async (
    metricId: string,
    actions: QuickActionFormItem[]
  ) => {
    for (const action of actions) {
      await createQuickActionMutation.mutateAsync({
        metric_id: metricId,
        label: action.label,
        value: action.value,
        value_normalized: action.value, // Will be calculated by the repository
        icon: action.icon || null,
        position: action.position,
      });
    }
  };

  // Save handler
  const handleSaveMetric = async () => {
    if (!nameValidation.isValid) return;

    setIsSaving(true);
    try {
      const metricData = {
        name: metricName.trim(),
        slug: metricSlug.trim(),
        type: metricType,
        unit: unit.trim(),
        canonical_unit: unit.trim(), // Default to same as unit
        conversion_factor: 1,
        default_target: defaultTarget || null,
        color: metricColor,
        icon: metricIcon,
        settings: null,
        deleted_at: null,
      };

      let metricId: string;

      if (isEditMode && existingMetricId) {
        const updatedMetric = await updateMetricMutation.mutateAsync({
          metricId: existingMetricId,
          data: metricData,
        });
        metricId = updatedMetric.id;
      } else {
        const newMetric = await createMetricMutation.mutateAsync({
          data: metricData,
        });
        metricId = newMetric.id;

        // Create quick actions if any
        if (quickActions.length > 0) {
          await createQuickActionsForMetric(metricId, quickActions);
        }
      }

      // Navigate back
      router.back();
    } catch (error) {
      console.error("Error saving metric:", error);
      // TODO: Show error toast/alert
    } finally {
      setIsSaving(false);
    }
  };

  // Quick action helpers
  const addQuickAction = () => {
    const newQA: QuickActionFormItem = {
      id: generateUUID(),
      label: "",
      value: 0,
      icon: "Plus",
      position: quickActions.length + 1,
    };
    setQuickActions([...quickActions, newQA]);
    setShowQuickActionsSection(true);
  };

  const updateQuickAction = (
    id: string,
    updates: Partial<QuickActionFormItem>
  ) => {
    const updated = quickActions.map((qa) =>
      qa.id === id ? { ...qa, ...updates } : qa
    );
    setQuickActions(updated);
  };

  const removeQuickAction = (id: string) => {
    const filtered = quickActions.filter((qa) => qa.id !== id);
    // Reorder positions
    const reordered = filtered.map((qa, index) => ({
      ...qa,
      position: index + 1,
    }));
    setQuickActions(reordered);
  };

  // Form validation
  const isFormValid =
    nameValidation.isValid &&
    unit.trim().length > 0 &&
    !nameValidation.isValidating;

  return {
    // Basic info
    metricName,
    metricSlug,
    metricType,
    unit,
    defaultTarget,
    setMetricName,
    setMetricSlug,
    setMetricType,
    setUnit,
    setDefaultTarget,

    // Style
    metricIcon,
    metricColor,
    setMetricIcon,
    setMetricColor,

    // Quick actions
    quickActions,
    showQuickActionsSection,
    setShowQuickActionsSection,
    addQuickAction,
    updateQuickAction,
    removeQuickAction,

    // Validation & state
    nameValidation,
    isSaving,
    isDeleting,
    isFormValid,

    // Actions
    handleSaveMetric,
  };
};
