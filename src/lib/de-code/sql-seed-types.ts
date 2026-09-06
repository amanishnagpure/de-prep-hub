import type {
  JudgeComparisonConfig,
  JudgeFixture,
  JudgeResourceLimits,
} from "@/lib/judge/types";
import type { SqlPracticeSeed } from "@/data/sql-practice-problem-seeds";

/** SQL judge seed — multi-fixture contract aligned with PySpark */
export type SqlFixture = Omit<JudgeFixture, "tables"> & {
  /** Row data per table — omitted when initSql supplies DDL + INSERTs */
  tables?: Record<string, Record<string, unknown>[]>;
  /** When set, used directly instead of building DDL from `tables` rows */
  initSql?: string;
};

export type SqlProblemSeed = {
  /** Reference query executed on each fixture to derive expected output */
  referenceQuery: string;
  fixtures: SqlFixture[];
  /** Schema metadata for UI (public fixture shape) */
  tables: SqlPracticeSeed["tables"];
  allowMutations?: boolean;
  comparison?: JudgeComparisonConfig;
  limits?: JudgeResourceLimits;
};

export type SqlJudgePayload = {
  userQuery: string;
  referenceQuery: string;
  fixtures: SqlFixture[];
  mode: "run" | "submit";
  tableSchemas: SqlPracticeSeed["tables"];
  allowMutations?: boolean;
  comparison?: JudgeComparisonConfig;
  limits?: JudgeResourceLimits;
};
