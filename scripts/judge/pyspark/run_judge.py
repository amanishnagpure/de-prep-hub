#!/usr/bin/env python3
"""One-shot PySpark judge — fallback when persistent worker is unavailable."""
from __future__ import annotations

import json
import sys
import tempfile
import time
import traceback

from judge_core import create_spark_session, execute_payload


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except json.JSONDecodeError as exc:
        print(json.dumps({"status": "compilation_error", "message": f"Invalid payload: {exc}", "passed": 0, "total": 0, "cases": []}))
        return 1

    try:
        from pyspark.sql import SparkSession  # noqa: F401
    except ImportError:
        print(
            json.dumps(
                {
                    "status": "runtime_error",
                    "message": "PySpark is not installed on the judge host. Install with: pip install -r requirements-judge.txt",
                    "passed": 0,
                    "total": 0,
                    "cases": [],
                    "pysparkAvailable": False,
                }
            )
        )
        return 0

    warehouse = tempfile.mkdtemp(prefix="de-code-spark-")
    started = time.time()
    try:
        spark = create_spark_session(warehouse)
        spark.sparkContext.setLogLevel("ERROR")
        cold_start_ms = int((time.time() - started) * 1000)
        result = execute_payload(spark, payload, cold_start_ms=cold_start_ms, worker_reused=False)
        spark.stop()
        print(json.dumps(result))
    except Exception as exc:  # noqa: BLE001
        print(
            json.dumps(
                {
                    "status": "runtime_error",
                    "message": str(exc),
                    "passed": 0,
                    "total": 0,
                    "cases": [],
                    "trace": traceback.format_exc()[-800:],
                    "runtimeMs": int((time.time() - started) * 1000),
                    "pysparkAvailable": True,
                }
            )
        )
    finally:
        try:
            import shutil

            shutil.rmtree(warehouse, ignore_errors=True)
        except Exception:  # noqa: BLE001
            pass

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
