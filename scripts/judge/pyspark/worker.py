#!/usr/bin/env python3
"""Persistent PySpark judge worker — keeps SparkSession warm across submissions."""
from __future__ import annotations

import json
import sys
import tempfile
import time
import traceback

from judge_core import create_spark_session, execute_payload


def emit(message: dict) -> None:
    print(json.dumps(message), flush=True)


def main() -> int:
    try:
        from pyspark.sql import SparkSession  # noqa: F401
    except ImportError:
        emit(
            {
                "type": "error",
                "message": "PySpark is not installed. pip install -r requirements-judge.txt",
                "pysparkAvailable": False,
            }
        )
        return 1

    warehouse = tempfile.mkdtemp(prefix="de-code-spark-worker-")
    cold_started = time.time()
    spark = create_spark_session(warehouse)
    spark.sparkContext.setLogLevel("ERROR")
    cold_start_ms = int((time.time() - cold_started) * 1000)

    emit({"type": "ready", "coldStartMs": cold_start_ms, "pysparkAvailable": True})

    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue

        try:
            request = json.loads(line)
        except json.JSONDecodeError as exc:
            emit({"type": "error", "id": None, "message": f"Invalid JSON: {exc}"})
            continue

        req_id = request.get("id")
        req_type = request.get("type")

        if req_type == "ping":
            emit({"type": "response", "id": req_id, "ok": True, "result": {"status": "ready", "coldStartMs": cold_start_ms}})
            continue

        if req_type == "shutdown":
            spark.stop()
            emit({"type": "response", "id": req_id, "ok": True, "result": {"status": "stopped"}})
            break

        if req_type != "judge":
            emit({"type": "response", "id": req_id, "ok": False, "error": f"Unknown request type: {req_type}"})
            continue

        payload = request.get("payload") or {}
        try:
            result = execute_payload(spark, payload, cold_start_ms=0, worker_reused=True)
            emit({"type": "response", "id": req_id, "ok": True, "result": result})
        except Exception as exc:  # noqa: BLE001
            emit(
                {
                    "type": "response",
                    "id": req_id,
                    "ok": False,
                    "error": str(exc),
                    "trace": traceback.format_exc()[-800:],
                }
            )

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
