import { generateUUID } from "@/shared/db/utils/uuid";
import {
  IDailyAggregate,
  IEntry,
  IMetricDefinition,
  UUID,
} from "../../tracker-v2/types";

export const getTodayKey = (): string => {
  return new Date().toISOString().split("T")[0];
};

const isoForDayWithNowTime = (dayKey: string): string => {
  const now = new Date();
  const parts = String(dayKey)
    .split("-")
    .map((p) => Number(p));

  if (parts.length === 3 && parts.every((n) => Number.isFinite(n))) {
    const [y, m, d] = parts;
    // new Date(...) usa zona local, luego toISOString() devuelve el instante en UTC (formato ISO)
    const date = new Date(
      y,
      m - 1,
      d,
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds()
    );
    return date.toISOString();
  }

  return now.toISOString();
};

export const createEntry = (
  metric: IMetricDefinition,
  value: number,
  unit: string,
  dayKey: string,
  notes?: string
): IEntry => {
  const id = generateUUID();
  const now = isoForDayWithNowTime(dayKey);

  const normalized = metric.conversionFactor
    ? value * metric.conversionFactor
    : value;

  return {
    id,
    metricId: metric.id,
    value,
    valueNormalized: normalized,
    unit,
    notes,
    createdAt: now,
    updatedAt: now,
    dayKey,
    source: "manual",
  };
};

export const updateAggregateWithEntry = (
  agg: IDailyAggregate | undefined,
  entry: IEntry
): IDailyAggregate => {
  if (!agg) {
    return {
      metricId: entry.metricId,
      dayKey: entry.dayKey,
      sumNormalized: entry.valueNormalized,
      count: 1,
      minNormalized: entry.valueNormalized,
      maxNormalized: entry.valueNormalized,
    };
  }
  return {
    ...agg,
    sumNormalized: agg.sumNormalized + entry.valueNormalized,
    count: agg.count + 1,
    minNormalized:
      agg.minNormalized != null
        ? Math.min(agg.minNormalized, entry.valueNormalized)
        : entry.valueNormalized,
    maxNormalized:
      agg.maxNormalized != null
        ? Math.max(agg.maxNormalized, entry.valueNormalized)
        : entry.valueNormalized,
  };
};

export const recalcAggregateFromEntries = (
  entries: IEntry[]
): IDailyAggregate => {
  if (entries.length === 0) {
    return {
      metricId: "" as UUID,
      dayKey: "",
      sumNormalized: 0,
      count: 0,
    };
  }
  const { metricId, dayKey } = entries[0];
  const values = entries.map((e) => e.valueNormalized);
  return {
    metricId,
    dayKey,
    sumNormalized: values.reduce((a, b) => a + b, 0),
    count: values.length,
    minNormalized: Math.min(...values),
    maxNormalized: Math.max(...values),
  };
};
