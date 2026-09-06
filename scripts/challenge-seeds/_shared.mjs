export const DEFAULT_CHALLENGE_LIMITS = {
  timeLimitMs: 20000,
  maxInputRows: 5000,
  maxOutputRows: 10000,
  maxFixtureCount: 8,
};

export function sqlFixturesFromPyspark(fixtures) {
  return fixtures.map((f) => ({
    id: f.id,
    label: f.label,
    isHidden: f.isHidden,
    tables: f.tables,
    ...(f.purpose ? { purpose: f.purpose } : {}),
    ...(f.tests?.length ? { tests: f.tests } : {}),
  }));
}

/** Build a fixture with optional evaluation metadata */
export function fx(id, label, isHidden, tables, meta = {}) {
  return { id, label, isHidden, tables, ...meta };
}
