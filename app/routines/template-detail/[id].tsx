import { TemplateDetailScreen } from "@/features/routine-templates/views/template-detail-screen";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function TemplateDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return null;
  }

  return <TemplateDetailScreen templateId={id} />;
}
