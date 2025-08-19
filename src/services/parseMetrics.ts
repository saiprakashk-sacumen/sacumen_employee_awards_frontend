// src/services/parseMetrics.ts
export type MetricValue = {
  labels: Record<string, string>;
  value: number;
};

export type Metric = {
  name: string;
  help: string;
  type: string;
  values: MetricValue[];
};

export function parsePrometheusMetrics(metricsText: string): Metric[] {
  const metrics: Metric[] = [];
  const lines = metricsText.split("\n");
  let currentMetric: Metric | null = null;

  for (const line of lines) {
    if (!line) continue;

    if (line.startsWith("# HELP")) {
      const [, name, help] = line.match(/^# HELP (\S+) (.+)$/) || [];
      if (name && help) {
        currentMetric = { name, help, type: "", values: [] };
        metrics.push(currentMetric);
      }
    } else if (line.startsWith("# TYPE")) {
      const [, name, type] = line.match(/^# TYPE (\S+) (\S+)$/) || [];
      const metric = metrics.find((m) => m.name === name);
      if (metric) metric.type = type;
    } else {
      // Example: metric_name{label="value"} 123
      // or      metric_name 123
      const match = line.match(/^(\S+?)(\{([^}]*)\})?\s+(\S+)$/);
      if (match && currentMetric) {
        const [, name, , labelStr, valueStr] = match;
        const labels: Record<string, string> = {};

        if (labelStr) {
          labelStr.split(",").forEach((l) => {
            const [k, v] = l.split("=");
            if (k && v) {
              labels[k.trim()] = v.replace(/^"|"$/g, "");
            }
          });
        }

        currentMetric.values.push({
          labels,
          value: parseFloat(valueStr),
        });
      }
    }
  }

  return metrics;
}
