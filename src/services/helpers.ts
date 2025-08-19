// src/services/helpers.ts
import { Metric } from "./parseMetrics";
export function getMetricValue(metrics: Metric[], name: string): number[] {
  const metric = metrics.find((m) => m.name === name);
  if (!metric) return [];
  return metric.values.map((v) => v.value);
}
