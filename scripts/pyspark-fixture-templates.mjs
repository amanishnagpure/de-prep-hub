/** Curated PySpark fixture templates — hidden cases target common wrong solutions */

const EVENTS_DF = [
  { user_id: 1, status: "active", event_date: "2024-01-01", event_id: "e1", event_time: "2024-01-01T10:00:00", event_type: "click", name: "Alice", amount: 150.0, fx_rate: 1.1, region: "US", category: "A", k: "x" },
  { user_id: 2, status: "inactive", event_date: "2024-01-01", event_id: "e2", event_time: "2024-01-01T11:00:00", event_type: "view", name: "Bob", amount: 50.0, fx_rate: 1.0, region: "EU", category: "B", k: "x" },
  { user_id: 3, status: "active", event_date: "2024-01-02", event_id: "e3", event_time: "2024-01-02T09:00:00", event_type: "click", name: "Carol", amount: 200.0, fx_rate: 1.2, region: "US", category: "A", k: "y" },
];

const ORDERS = [
  { order_id: 1, customer_id: 10, amount: 100.0, status: "shipped" },
  { order_id: 2, customer_id: 20, amount: 50.0, status: "pending" },
];

const CUSTOMERS = [
  { customer_id: 10, name: "Ada", region: "US" },
  { customer_id: 20, name: "Bob", region: "EU" },
];

const SALES = [
  { region: "US", amount: 100.0, category: "A" },
  { region: "EU", amount: 75.0, category: "B" },
  { region: "US", amount: 25.0, category: "A" },
];

export function inferCategory(problem) {
  const slug = problem.slug;
  const topic = problem.topic ?? "";
  const text = `${slug} ${topic} ${problem.solution}`;

  if (/dedupe|duplicate|drop-duplicates|spark-drill-1[234]/.test(text)) return "dedupe";
  if (/join|left-join/.test(slug) || topic === "joins") return "join";
  if (/groupby|group-by|sum-amount|daily-event|count-by|spark-drill-1[015]/.test(text)) return "agg";
  if (/sort-events|orderBy.*desc/.test(text)) return "sort";
  if (/window|rank-events/.test(text)) return "window";
  if (/filter|select-filter|threshold/.test(text)) return "filter";
  if (/coalesce|repartition|persist|cache/.test(text)) return "ops";
  return "default";
}

export function defaultComparison(category) {
  if (category === "sort") {
    return { schema: true, columnOrder: true, rowOrder: true, allowExtraColumns: false, ignoreColumnCase: true };
  }
  return { schema: true, columnOrder: false, rowOrder: false, allowExtraColumns: false, ignoreColumnCase: true };
}

function pickTables(problem, tableNames) {
  const pool = {
    df: EVENTS_DF,
    orders: ORDERS,
    customers: CUSTOMERS,
    sales: SALES,
  };
  return Object.fromEntries(
    tableNames.map((name) => [name, (pool[name] ?? [{ id: 1, value: "A" }]).map((r) => ({ ...r }))])
  );
}

function inferTables(problem) {
  const names = new Set(["df"]);
  const text = `${problem.description}\n${problem.solution}`;
  for (const name of ["orders", "customers", "sales"]) {
    if (new RegExp(`\\b${name}\\b`).test(text)) names.add(name);
  }
  return [...names];
}

export function buildFixtures(problem) {
  const category = inferCategory(problem);
  const tables = inferTables(problem);
  const publicTables = pickTables(problem, tables);

  switch (category) {
    case "dedupe":
      return [
        { id: "public", label: "Normal event stream", isHidden: false, tables: { df: [
          { user_id: 1, event_time: "2024-01-01T10:00:00", event_type: "click" },
          { user_id: 1, event_time: "2024-01-01T10:05:00", event_type: "click" },
          { user_id: 2, event_time: "2024-01-01T11:00:00", event_type: "view" },
        ] } },
        { id: "hidden-dup-ids", label: "Duplicate IDs same timestamp", isHidden: true, tables: { df: [
          { user_id: 1, event_time: "2024-01-01T10:00:00", event_type: "click" },
          { user_id: 1, event_time: "2024-01-01T10:00:00", event_type: "click" },
          { user_id: 1, event_time: "2024-01-01T10:00:00", event_type: "view" },
        ] } },
        { id: "hidden-single-partition", label: "Single user many duplicates", isHidden: true, tables: { df: [
          { user_id: 9, event_time: "2024-01-02T08:00:00", event_type: "purchase" },
          { user_id: 9, event_time: "2024-01-02T08:00:00", event_type: "purchase" },
          { user_id: 9, event_time: "2024-01-02T09:00:00", event_type: "purchase" },
        ] } },
      ];

    case "join":
      return [
        { id: "public", label: "Matched and unmatched orders", isHidden: false, tables: pickTables(problem, ["orders", "customers"]) },
        { id: "hidden-null-key", label: "NULL join key on order", isHidden: true, tables: {
          orders: [{ order_id: 1, customer_id: null, amount: 10.0, status: "shipped" }, { order_id: 2, customer_id: 10, amount: 20.0, status: "shipped" }],
          customers: CUSTOMERS,
        } },
        { id: "hidden-duplicate-keys", label: "Duplicate customer_id rows", isHidden: true, tables: {
          orders: [{ order_id: 1, customer_id: 10, amount: 10.0, status: "shipped" }],
          customers: [{ customer_id: 10, name: "Ada", region: "US" }, { customer_id: 10, name: "Ada-dup", region: "US" }],
        } },
        { id: "hidden-empty-orders", label: "Empty orders table", isHidden: true, tables: { orders: [], customers: CUSTOMERS } },
      ];

    case "agg":
      return [
        { id: "public", label: "Standard aggregation input", isHidden: false, tables: publicTables },
        { id: "hidden-null-measure", label: "NULL amounts in facts", isHidden: true, tables: {
          df: [{ event_date: "2024-01-01", amount: null }, { event_date: "2024-01-01", amount: 10.0 }, { event_date: "2024-01-02", amount: 5.0 }],
          sales: [{ region: "US", amount: null, category: "A" }, { region: "US", amount: 20.0, category: "A" }],
        } },
        { id: "hidden-zero-rows-group", label: "Sparse grouping keys", isHidden: true, tables: {
          df: [{ event_date: "2024-01-01", status: "active" }],
          sales: [{ region: "APAC", amount: 0.0, category: "Z" }],
        } },
        { id: "hidden-duplicate-facts", label: "Duplicate fact rows", isHidden: true, tables: {
          sales: [{ region: "US", amount: 10.0, category: "A" }, { region: "US", amount: 10.0, category: "A" }],
        } },
      ];

    case "sort":
      return [
        { id: "public", label: "Events to sort", isHidden: false, tables: { df: [
          { user_id: 1, event_time: "2024-01-01T12:00:00" },
          { user_id: 2, event_time: "2024-01-01T08:00:00" },
          { user_id: 3, event_time: "2024-01-01T10:00:00" },
        ] } },
        { id: "hidden-tie-times", label: "Tied timestamps", isHidden: true, tables: { df: [
          { user_id: 1, event_time: "2024-01-01T10:00:00" },
          { user_id: 2, event_time: "2024-01-01T10:00:00" },
        ] } },
        { id: "hidden-single-row", label: "Single row input", isHidden: true, tables: { df: [{ user_id: 1, event_time: "2024-01-01T10:00:00" }] } },
      ];

    case "window":
      return [
        { id: "public", label: "Per-user ranking", isHidden: false, tables: { df: [
          { user_id: 1, event_time: "2024-01-01T10:00:00", amount: 10.0 },
          { user_id: 1, event_time: "2024-01-01T11:00:00", amount: 20.0 },
          { user_id: 2, event_time: "2024-01-01T09:00:00", amount: 5.0 },
        ] } },
        { id: "hidden-tie-rank", label: "Tied rank values", isHidden: true, tables: { df: [
          { user_id: 1, event_time: "2024-01-01T10:00:00", amount: 10.0 },
          { user_id: 1, event_time: "2024-01-01T11:00:00", amount: 10.0 },
        ] } },
        { id: "hidden-single-partition", label: "Single row partition", isHidden: true, tables: { df: [{ user_id: 7, event_time: "2024-01-01T10:00:00", amount: 1.0 }] } },
      ];

    case "filter":
      return [
        { id: "public", label: "Mixed active/inactive", isHidden: false, tables: { df: EVENTS_DF } },
        { id: "hidden-all-active", label: "All rows active", isHidden: true, tables: { df: EVENTS_DF.map((r) => ({ ...r, status: "active" })) } },
        { id: "hidden-none-active", label: "No active rows", isHidden: true, tables: { df: EVENTS_DF.map((r) => ({ ...r, status: "inactive" })) } },
      ];

    case "ops":
      return [
        { id: "public", label: "Standard dataframe", isHidden: false, tables: publicTables },
        { id: "hidden-small", label: "Small partition count", isHidden: true, tables: { df: [{ user_id: 1, name: "A" }] } },
        { id: "hidden-wide", label: "Wide row set", isHidden: true, tables: { df: Array.from({ length: 12 }, (_, i) => ({ user_id: i + 1, name: `U${i + 1}`, k: "batch" })) } },
      ];

    default:
      return [
        { id: "public", label: "Public dataset", isHidden: false, tables: publicTables },
        { id: "hidden-edge", label: "Hidden edge case", isHidden: true, tables: { df: [{ user_id: 1, status: "active", event_date: "2024-01-01", amount: 0.0 }] } },
        { id: "hidden-nulls", label: "Hidden NULL values", isHidden: true, tables: { df: [{ user_id: 1, status: null, event_date: null, amount: null, name: null }] } },
      ];
  }
}
