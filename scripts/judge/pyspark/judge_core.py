"""Shared PySpark judge logic — used by one-shot runner and persistent worker."""
from __future__ import annotations

import json
import os
import time
from typing import Any

MAX_CODE_CHARS = 50_000
MAX_PAYLOAD_BYTES = 512_000


def is_security_hardened() -> bool:
    return os.environ.get("SECURITY_HARDENED") == "1"

SAFE_BUILTINS = {
    "True": True,
    "False": False,
    "None": None,
    "int": int,
    "float": float,
    "str": str,
    "bool": bool,
    "list": list,
    "dict": dict,
    "tuple": tuple,
    "set": set,
    "len": len,
    "range": range,
    "min": min,
    "max": max,
    "sum": sum,
    "abs": abs,
    "round": round,
    "sorted": sorted,
    "enumerate": enumerate,
    "zip": zip,
    "map": map,
    "filter": filter,
    "any": any,
    "all": all,
    "isinstance": isinstance,
    "print": lambda *a, **k: None,
}

BLOCKED_TOKENS = (
    "import os",
    "import subprocess",
    "import shutil",
    "import socket",
    "import sys",
    "open(",
    "eval(",
    "exec(",
    "compile(",
    "globals(",
    "locals(",
)

HARDENED_TOKENS = (
    "__import__",
    "importlib",
    "_jvm",
    "sparkcontext._gateway",
    ".__subclasses__(",
    "getattr(",
    "setattr(",
    "delattr(",
    "breakpoint(",
    "help(",
)

DEFAULT_COMPARISON = {
    "schema": True,
    "columnOrder": False,
    "rowOrder": False,
    "allowExtraColumns": False,
    "ignoreColumnCase": True,
}

DEFAULT_LIMITS = {
    "timeLimitMs": 15000,
    "maxInputRows": 5000,
    "maxOutputRows": 10000,
    "maxFixtureCount": 8,
}


def merge_config(defaults: dict, override: dict | None) -> dict:
    out = dict(defaults)
    if override:
        out.update({k: v for k, v in override.items() if v is not None})
    return out


def normalize_col(name: str, ignore_case: bool) -> str:
    return name.lower() if ignore_case else name


def schema_signature(df, ignore_case: bool) -> list[tuple[str, str]]:
    return [(normalize_col(f.name, ignore_case), str(f.dataType)) for f in df.schema.fields]


def cell_str(value: Any) -> str:
    if value is None:
        return "NULL"
    return str(value)


def row_dict(row, cols: list[str]) -> dict[str, str]:
    data = row.asDict()
    return {c: cell_str(data.get(c)) for c in cols}


def sort_rows(rows: list[dict[str, str]], cols: list[str]) -> list[dict[str, str]]:
    return sorted(rows, key=lambda r: "|".join(f"{c}:{r[c]}" for c in cols))


def preview_df(df, limit: int = 5) -> str:
    rows = df.limit(limit).collect()
    cols = df.columns
    if not cols:
        return "empty schema — 0 rows"
    if not rows:
        return f"({', '.join(cols)}) — 0 rows"
    count = df.count()
    lines = [f"({', '.join(cols)}) — {count} row(s)"]
    for row in rows:
        lines.append(str(row.asDict()))
    return "\n".join(lines)


def validate_code(code: str) -> None:
    if not code.strip():
        raise ValueError("Write PySpark code before submitting.")
    lowered = code.lower()
    for token in BLOCKED_TOKENS:
        if token in lowered:
            raise ValueError(f"Blocked construct: {token}")
    if is_security_hardened():
        for token in HARDENED_TOKENS:
            if token in lowered:
                raise ValueError(f"Blocked construct: {token}")


def validate_payload_limits(payload: dict) -> dict | None:
    """Return an error verdict dict when hardened limits are exceeded."""
    if not is_security_hardened():
        return None

    raw = json.dumps(payload)
    if len(raw) > MAX_PAYLOAD_BYTES:
        return {
            "status": "compilation_error",
            "passed": 0,
            "total": 0,
            "cases": [],
            "message": f"Payload exceeds maximum size ({MAX_PAYLOAD_BYTES} bytes).",
            "pysparkAvailable": True,
        }

    user_code = payload.get("userCode") or ""
    if len(user_code) > MAX_CODE_CHARS:
        return {
            "status": "compilation_error",
            "passed": 0,
            "total": 0,
            "cases": [],
            "message": f"Code exceeds maximum length ({MAX_CODE_CHARS} characters).",
            "pysparkAvailable": True,
        }

    return None


def count_input_rows(tables: dict[str, list[dict[str, Any]]]) -> int:
    return sum(len(rows) for rows in tables.values())


def parse_schema_int_columns(schema_str: str) -> set[str]:
    cols: set[str] = set()
    for part in schema_str.split(","):
        part = part.strip()
        if not part:
            continue
        name, typ = part.rsplit(" ", 1)
        if typ.strip().upper() == "INT":
            cols.add(name.strip())
    return cols


def normalize_fixture_row(row: dict[str, Any], int_columns: set[str] | None = None) -> dict[str, Any]:
    id_keys = {"id", "user_id", "order_id", "customer_id", "employee_id", "event_id", "entity_id", "payment_id"}
    int_columns = int_columns or set()
    out: dict[str, Any] = {}
    for key, value in row.items():
        if value is None:
            out[key] = None
        elif isinstance(value, bool):
            out[key] = value
        elif isinstance(value, int) and not isinstance(value, bool):
            if key in id_keys or key.endswith("_id") or key.endswith("_flag") or key in int_columns:
                out[key] = int(value)
            else:
                out[key] = float(value)
        elif isinstance(value, float):
            if key in int_columns and value == int(value):
                out[key] = int(value)
            else:
                out[key] = float(value)
        else:
            out[key] = value
    return out


TABLE_SCHEMAS: dict[str, str] = {
    "orders": "order_id INT, customer_id INT, amount DOUBLE, status STRING, order_date STRING",
    "customers": "customer_id INT, name STRING, region STRING, email STRING, created_date STRING",
    "customers_today": "customer_id INT, name STRING, city STRING",
    "customers_yesterday": "customer_id INT, name STRING, city STRING",
    "customers_current": "customer_id INT, name STRING, city STRING",
    "customers_previous": "customer_id INT, name STRING, city STRING, effective_from STRING, effective_to STRING, current_flag INT",
    "pipeline_config": "as_of_date STRING, max_lateness_minutes INT",
    "orders_snapshot": "order_id INT, customer_id INT, amount DOUBLE, status STRING",
    "orders_cdc_events": "event_id STRING, order_id INT, operation STRING, event_timestamp STRING, customer_id INT, amount DOUBLE, status STRING",
    "state_snapshot": "entity_id INT, value INT, event_timestamp STRING",
    "events": "event_id STRING, entity_id INT, value INT, event_timestamp STRING, processing_timestamp STRING",
    "customer_events_v1": "customer_id INT, name STRING, city STRING",
    "customer_events_v2": "customer_id INT, city STRING, name STRING, email STRING, phone STRING",
    "orders_source": "order_id INT, customer_id INT, status STRING",
    "payments_source": "payment_id INT, order_id INT, amount DOUBLE",
    "orders_target": "order_id INT, amount DOUBLE",
    "items": "id INT, name STRING, amount DOUBLE",
    "payments": "payment_id INT, order_id INT, amount DOUBLE, payment_date STRING",
    "sales": "region STRING, amount DOUBLE, category STRING",
    "df": "user_id INT, status STRING, event_date STRING, event_id STRING, event_time STRING, event_type STRING, name STRING, amount DOUBLE, fx_rate DOUBLE, region STRING, category STRING, k STRING",
}


def build_tables(spark, tables: dict[str, list[dict[str, Any]]], limits: dict):
    max_input = int(limits.get("maxInputRows") or DEFAULT_LIMITS["maxInputRows"])
    total = count_input_rows(tables)
    if total > max_input:
        raise ValueError(f"Input exceeds limit ({total} rows > {max_input}).")

    out: dict[str, Any] = {}
    for name, rows in tables.items():
        schema_str = TABLE_SCHEMAS.get(name)
        int_columns = parse_schema_int_columns(schema_str) if schema_str else set()
        normalized = [normalize_fixture_row(row, int_columns) for row in rows]
        if schema_str:
            out[name] = (
                spark.createDataFrame(normalized, schema_str)
                if normalized
                else spark.createDataFrame([], schema_str)
            )
        elif normalized:
            out[name] = spark.createDataFrame(normalized)
        else:
            out[name] = spark.createDataFrame([], "value STRING")
    return out


def sanitize_spark_code(code: str) -> str:
    lines = []
    for line in code.splitlines():
        stripped = line.strip()
        if stripped.startswith("from pyspark") or stripped.startswith("import pyspark"):
            continue
        lines.append(line)
    return "\n".join(lines)


def exec_user_code(code: str, spark, tables: dict[str, Any], result_var: str):
    from pyspark.sql import SparkSession
    from pyspark.sql import functions as F
    from pyspark.sql.window import Window

    validate_code(code)

    g: dict[str, Any] = {
        "__builtins__": SAFE_BUILTINS,
        "spark": spark,
        "SparkSession": SparkSession,
        "F": F,
        "Window": Window,
        "functions": F,
        "row_number": F.row_number,
        "rank": F.rank,
        "col": F.col,
        "upper": F.upper,
        "unix_timestamp": F.unix_timestamp,
        "trim": F.trim,
    }
    g.update(tables)

    exec(compile(sanitize_spark_code(code), "<user>", "exec"), g, g)

    if result_var not in g:
        raise ValueError(f"Expected a DataFrame variable named `{result_var}`.")

    result = g[result_var]
    if result is None:
        raise ValueError(f"`{result_var}` is None — assign a DataFrame.")
    if not hasattr(result, "columns"):
        raise ValueError(f"`{result_var}` must be a DataFrame.")

    return result


def enforce_output_limit(df, limits: dict) -> int:
    max_output = int(limits.get("maxOutputRows") or DEFAULT_LIMITS["maxOutputRows"])
    count = df.count()
    if count > max_output:
        raise ValueError(f"Output exceeds limit ({count} rows > {max_output}).")
    return count


def compare_dataframes(expected, actual, comparison: dict | None) -> tuple[bool, str, str, str]:
    cfg = merge_config(DEFAULT_COMPARISON, comparison or {})
    ignore_case = bool(cfg.get("ignoreColumnCase", True))
    allow_extra = bool(cfg.get("allowExtraColumns", False))
    row_order = bool(cfg.get("rowOrder", False))
    column_order = bool(cfg.get("columnOrder", False))
    check_schema = bool(cfg.get("schema", True))

    exp_cols_raw = list(expected.columns)
    act_cols_raw = list(actual.columns)

    if column_order:
        exp_cols = [normalize_col(c, ignore_case) for c in exp_cols_raw]
        act_cols = [normalize_col(c, ignore_case) for c in act_cols_raw]
        if exp_cols != act_cols:
            return (
                False,
                f"Column order mismatch — expected ({', '.join(exp_cols_raw)}), got ({', '.join(act_cols_raw)}).",
                ", ".join(exp_cols_raw),
                ", ".join(act_cols_raw),
            )
        selected_cols = exp_cols_raw
    else:
        exp_set = {normalize_col(c, ignore_case) for c in exp_cols_raw}
        act_set = {normalize_col(c, ignore_case) for c in act_cols_raw}
        if not allow_extra and exp_set != act_set:
            return (
                False,
                f"Column mismatch — expected ({', '.join(exp_cols_raw)}), got ({', '.join(act_cols_raw)}).",
                ", ".join(exp_cols_raw),
                ", ".join(act_cols_raw),
            )
        if allow_extra and not exp_set.issubset(act_set):
            missing = exp_set - act_set
            return (
                False,
                f"Missing columns: {', '.join(sorted(missing))}.",
                ", ".join(exp_cols_raw),
                ", ".join(act_cols_raw),
            )
        selected_cols = exp_cols_raw

    if check_schema:
        exp_sig = schema_signature(expected.select(*selected_cols), ignore_case)
        act_sig = schema_signature(actual.select(*selected_cols), ignore_case)
        if exp_sig != act_sig:
            return (
                False,
                f"Schema type mismatch — expected {exp_sig}, got {act_sig}.",
                str(exp_sig),
                str(act_sig),
            )

    exp_rows_raw = [row_dict(r, selected_cols) for r in expected.select(*selected_cols).collect()]
    act_rows_raw = [row_dict(r, selected_cols) for r in actual.select(*selected_cols).collect()]

    exp_rows = exp_rows_raw if row_order else sort_rows(exp_rows_raw, selected_cols)
    act_rows = act_rows_raw if row_order else sort_rows(act_rows_raw, selected_cols)

    if len(exp_rows) != len(act_rows):
        return (
            False,
            f"Row count mismatch — expected {len(exp_rows)}, got {len(act_rows)}.",
            f"{len(exp_rows)} row(s)",
            f"{len(act_rows)} row(s)",
        )

    for i, (e, a) in enumerate(zip(exp_rows, act_rows)):
        if e != a:
            return (
                False,
                f"Row {i + 1} differs from reference output.",
                json.dumps(e),
                json.dumps(a),
            )

    return True, "Correct result.", f"{len(exp_rows)} matching row(s)", f"{len(act_rows)} row(s)"


def reset_spark_state(spark) -> None:
    spark.catalog.clearCache()
    for view in list(spark.catalog.listTables()):
        if view.isTemporary:
            spark.catalog.dropTempView(view.name)


def sanitize_case_for_client(case: dict) -> dict:
    """Remove hidden fixture row data before returning to API clients."""
    is_hidden = bool(case.get("isHidden")) or (
        case.get("testCaseId") not in ("public", "run")
    )
    if not is_hidden:
        return case

    out = dict(case)
    out["expectedOutput"] = ""
    out["actualOutput"] = ""

    err = out.get("error") or ""
    if err and ("{" in err or "row(s):" in err):
        if not out.get("pass"):
            out["error"] = "Result differs from reference on this hidden scenario."

    return out


def fixture_case_fields(fixture: dict) -> dict:
    out = {
        "testCaseId": fixture.get("id", "case"),
        "input": fixture.get("label") or fixture.get("id", "dataset"),
    }
    if fixture.get("purpose"):
        out["purpose"] = fixture["purpose"]
    tests = fixture.get("tests")
    if tests:
        out["tests"] = tests
    if fixture.get("isHidden") is not None:
        out["isHidden"] = bool(fixture["isHidden"])
    return out


def run_fixture(spark, payload: dict, fixture: dict, user_code: str, reference_code: str):
    limits = merge_config(DEFAULT_LIMITS, payload.get("limits") or {})
    comparison = payload.get("comparison") or {}
    tables = fixture.get("tables") or {}
    result_var = payload["resultVar"]
    started = time.time()
    input_rows = count_input_rows(tables)

    try:
        table_dfs = build_tables(spark, tables, limits)
        expected = exec_user_code(reference_code, spark, table_dfs, result_var)
        expected_rows = enforce_output_limit(expected, limits)
        actual = exec_user_code(user_code, spark, table_dfs, result_var)
        output_rows = enforce_output_limit(actual, limits)
        ok, msg, exp_preview, act_preview = compare_dataframes(expected, actual, comparison)
        runtime_ms = int((time.time() - started) * 1000)
        return sanitize_case_for_client(
            {
                **fixture_case_fields(fixture),
                "pass": ok,
                "expectedOutput": exp_preview,
                "actualOutput": act_preview,
                "error": None if ok else msg,
                "runtimeMs": runtime_ms,
                "metrics": {
                    "inputRows": input_rows,
                    "outputRows": output_rows,
                    "expectedOutputRows": expected_rows,
                },
            }
        )
    except Exception as exc:  # noqa: BLE001
        runtime_ms = int((time.time() - started) * 1000)
        return sanitize_case_for_client(
            {
                **fixture_case_fields(fixture),
                "pass": False,
                "expectedOutput": "Reference execution",
                "actualOutput": "",
                "error": str(exc),
                "runtimeMs": runtime_ms,
                "metrics": {"inputRows": input_rows},
            }
        )


def run_preview(spark, payload: dict, fixture: dict, user_code: str):
    limits = merge_config(DEFAULT_LIMITS, payload.get("limits") or {})
    tables = fixture.get("tables") or {}
    result_var = payload["resultVar"]
    started = time.time()
    input_rows = count_input_rows(tables)

    try:
        table_dfs = build_tables(spark, tables, limits)
        actual = exec_user_code(user_code, spark, table_dfs, result_var)
        output_rows = enforce_output_limit(actual, limits)
        runtime_ms = int((time.time() - started) * 1000)
        return {
            "testCaseId": "run",
            "pass": True,
            "input": fixture.get("label") or "public dataset",
            "expectedOutput": "Sample execution",
            "actualOutput": preview_df(actual),
            "runtimeMs": runtime_ms,
            "metrics": {"inputRows": input_rows, "outputRows": output_rows},
        }
    except Exception as exc:  # noqa: BLE001
        runtime_ms = int((time.time() - started) * 1000)
        return {
            "testCaseId": "run",
            "pass": False,
            "input": fixture.get("label") or "public dataset",
            "expectedOutput": "Valid PySpark code",
            "actualOutput": "",
            "error": str(exc),
            "runtimeMs": runtime_ms,
            "metrics": {"inputRows": input_rows},
        }


def execute_payload(spark, payload: dict, *, cold_start_ms: int = 0, worker_reused: bool = False) -> dict:
    limit_error = validate_payload_limits(payload)
    if limit_error:
        return limit_error

    limits = merge_config(DEFAULT_LIMITS, payload.get("limits") or {})
    time_limit_ms = int(limits.get("timeLimitMs") or DEFAULT_LIMITS["timeLimitMs"])
    mode = payload.get("mode") or "submit"
    fixtures = list(payload.get("fixtures") or [])
    max_fixtures = int(limits.get("maxFixtureCount") or DEFAULT_LIMITS["maxFixtureCount"])

    if not fixtures:
        return {
            "status": "runtime_error",
            "message": "No test fixtures configured.",
            "passed": 0,
            "total": 0,
            "cases": [],
            "pysparkAvailable": True,
        }

    if len(fixtures) > max_fixtures:
        fixtures = fixtures[:max_fixtures]

    if mode == "run":
        fixtures = [f for f in fixtures if not f.get("isHidden")][:1] or fixtures[:1]

    user_code = payload.get("userCode") or ""
    reference_code = payload.get("referenceCode") or ""
    started = time.time()
    cases: list[dict] = []

    for fixture in fixtures:
        elapsed_ms = int((time.time() - started) * 1000)
        if elapsed_ms > time_limit_ms:
            cases.append(
                {
                    **fixture_case_fields(fixture),
                    "pass": False,
                    "expectedOutput": "Within time limit",
                    "actualOutput": "",
                    "error": "Time limit exceeded",
                }
            )
            break

        if mode == "run":
            cases.append(run_preview(spark, payload, fixture, user_code))
        else:
            cases.append(run_fixture(spark, payload, fixture, user_code, reference_code))

        reset_spark_state(spark)

    passed = sum(1 for c in cases if c.get("pass"))
    total = len(cases)
    runtime_ms = int((time.time() - started) * 1000)
    total_input = sum((c.get("metrics") or {}).get("inputRows") or 0 for c in cases)
    total_output = sum((c.get("metrics") or {}).get("outputRows") or 0 for c in cases)

    if total == 0:
        status = "runtime_error"
    elif passed == total:
        status = "accepted"
    elif any(c.get("error") == "Time limit exceeded" for c in cases):
        status = "time_limit_exceeded"
    elif any("exceeds limit" in (c.get("error") or "") for c in cases):
        status = "memory_limit_exceeded"
    elif any(c.get("error") for c in cases) and mode == "run":
        status = "runtime_error"
    elif passed > 0:
        status = "wrong_answer"
    else:
        status = "wrong_answer"

    message = None
    if status == "accepted" and mode == "run":
        message = "Code executed on public dataset. Submit to run hidden tests."
    elif status == "accepted":
        message = f"All {total} test case(s) passed."
    else:
        failed = next((c for c in cases if not c.get("pass")), None)
        message = failed.get("error") if failed and failed.get("error") else "Wrong Answer — output differs from reference."

    return {
        "status": status,
        "passed": passed,
        "total": total,
        "cases": cases,
        "message": message,
        "runtimeMs": runtime_ms,
        "metrics": {
            "runtimeMs": runtime_ms,
            "coldStartMs": cold_start_ms,
            "workerReused": worker_reused,
            "inputRows": total_input,
            "outputRows": total_output,
        },
        "pysparkAvailable": True,
    }


def create_spark_session(warehouse: str):
    from pyspark.sql import SparkSession

    return (
        SparkSession.builder.master("local[1]")
        .appName("de-code-pyspark-judge")
        .config("spark.ui.enabled", "false")
        .config("spark.sql.shuffle.partitions", "2")
        .config("spark.driver.memory", "512m")
        .config("spark.sql.warehouse.dir", warehouse)
        .config("spark.driver.host", "127.0.0.1")
        .config("spark.sql.adaptive.enabled", "false")
        .getOrCreate()
    )
