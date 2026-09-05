import { AIRFLOW_PROGRESS_KEY } from "@/lib/airflow-progress";
import { CLOUD_PROGRESS_KEY } from "@/lib/cloud-progress";
import { DATABRICKS_PROGRESS_KEY } from "@/lib/databricks-progress";
import { INTERVIEW_PREP_PROGRESS_KEY } from "@/lib/interview-prep-progress";
import { PROGRESS_STORAGE_KEY } from "@/lib/progress";
import { PYTHON_PROGRESS_KEY } from "@/lib/python-progress";
import { SPARK_PROGRESS_KEY } from "@/lib/spark-progress";
import { SQL_DIALECT_KEY, SQL_DIALECT_MANUAL_KEY } from "@/lib/sql-dialect";
import { SQL_PROGRESS_KEY } from "@/lib/sql-progress";
import { SYSTEM_DESIGN_PROGRESS_KEY } from "@/lib/system-design-progress";
import { importSqlProgress } from "@/lib/sql-progress";
import { importPythonProgress } from "@/lib/python-progress";
import { importSparkProgress } from "@/lib/spark-progress";
import { importDatabricksProgress } from "@/lib/databricks-progress";
import { importAirflowProgress } from "@/lib/airflow-progress";
import { importCloudProgress } from "@/lib/cloud-progress";
import { importSystemDesignProgress } from "@/lib/system-design-progress";
import { importInterviewPrepProgress } from "@/lib/interview-prep-progress";

export const ALL_PROGRESS_STORAGE_KEYS = [
  SQL_PROGRESS_KEY,
  PYTHON_PROGRESS_KEY,
  SPARK_PROGRESS_KEY,
  DATABRICKS_PROGRESS_KEY,
  AIRFLOW_PROGRESS_KEY,
  CLOUD_PROGRESS_KEY,
  SYSTEM_DESIGN_PROGRESS_KEY,
  INTERVIEW_PREP_PROGRESS_KEY,
  PROGRESS_STORAGE_KEY,
  SQL_DIALECT_KEY,
  SQL_DIALECT_MANUAL_KEY,
  "de-prep-hub-study-schedule",
] as const;

const PROGRESS_EVENTS = [
  "sql-progress-updated",
  "python-progress-updated",
  "spark-progress-updated",
  "databricks-progress-updated",
  "airflow-progress-updated",
  "cloud-progress-updated",
  "system-design-progress-updated",
  "interview-prep-progress-updated",
  "study-schedule-updated",
  "progress-updated",
  "sql-dialect-updated",
] as const;

export type FullProgressBackup = {
  version: 1;
  app: "de-prep-hub";
  exportedAt: string;
  storage: Record<string, string | null>;
};

function dispatchProgressRefresh(): void {
  if (typeof window === "undefined") return;
  for (const event of PROGRESS_EVENTS) {
    window.dispatchEvent(new CustomEvent(event));
  }
}

export function exportAllProgress(): string {
  const storage: Record<string, string | null> = {};
  for (const key of ALL_PROGRESS_STORAGE_KEYS) {
    storage[key] = localStorage.getItem(key);
  }

  const payload: FullProgressBackup = {
    version: 1,
    app: "de-prep-hub",
    exportedAt: new Date().toISOString(),
    storage,
  };

  return JSON.stringify(payload, null, 2);
}

function importFullBackup(payload: FullProgressBackup): { ok: boolean; message: string } {
  for (const key of ALL_PROGRESS_STORAGE_KEYS) {
    const value = payload.storage[key];
    if (value != null) {
      localStorage.setItem(key, value);
    }
  }
  dispatchProgressRefresh();
  return { ok: true, message: "All progress restored from backup." };
}

const LAB_IMPORTERS = [
  importSqlProgress,
  importPythonProgress,
  importSparkProgress,
  importDatabricksProgress,
  importAirflowProgress,
  importCloudProgress,
  importSystemDesignProgress,
  importInterviewPrepProgress,
] as const;

export function importAllProgress(raw: string): { ok: boolean; message: string } {
  try {
    const payload = JSON.parse(raw) as Partial<FullProgressBackup> & { progress?: unknown };

    if (payload.app === "de-prep-hub" && payload.storage) {
      return importFullBackup(payload as FullProgressBackup);
    }

    if (payload.progress) {
      for (const importer of LAB_IMPORTERS) {
        const result = importer(raw);
        if (result.ok) return result;
      }
    }

    return {
      ok: false,
      message: "Unrecognized backup file. Export from the home page or a lab dashboard.",
    };
  } catch {
    return { ok: false, message: "Could not read backup file." };
  }
}

export function hasAnySavedProgress(): boolean {
  if (typeof window === "undefined") return false;
  return ALL_PROGRESS_STORAGE_KEYS.some((key) => localStorage.getItem(key) != null);
}
