#!/usr/bin/env python3
"""Import SQL Q&A from Data_Engineering_Interview_Guide.html into markdown."""

import html as htmlmod
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML_PATH = ROOT / "Data_Engineering_Interview_Guide.html"
OUT_PATH = ROOT / "content" / "topics" / "sql-interview-guide.md"


def html_to_md(text: str) -> str:
    if not text:
        return ""

    s = (
        text.replace("\u2014", "—")
        .replace("\u2019", "'")
        .replace("\u201c", '"')
        .replace("\u201d", '"')
    )
    s = re.sub(r"<br\s*/?>", "\n", s, flags=re.I)
    s = re.sub(r"</p>\s*<p>", "\n\n", s, flags=re.I)
    s = re.sub(r"<p>", "", s, flags=re.I)
    s = re.sub(r"</p>", "\n", s, flags=re.I)
    s = re.sub(r"<strong>(.*?)</strong>", r"**\1**", s, flags=re.I | re.DOTALL)
    s = re.sub(r"<em>(.*?)</em>", r"*\1*", s, flags=re.I | re.DOTALL)
    s = re.sub(r"<code>(.*?)</code>", r"`\1`", s, flags=re.I | re.DOTALL)
    s = re.sub(
        r"<pre><code>(.*?)</code></pre>",
        r"\n```sql\n\1\n```\n",
        s,
        flags=re.I | re.DOTALL,
    )
    s = re.sub(r"<[^>]+>", "", s)
    s = htmlmod.unescape(s)
    s = re.sub(r"\n{3,}", "\n\n", s)

    # Fix inline SQL statements merged into prose
    s = re.sub(
        r"(:\s*)(SELECT|CREATE|ALTER|WITH|DELETE|UPDATE|INSERT|DROP)\b",
        r"\1\n\n```sql\n\2",
        s,
        flags=re.I,
    )
    s = re.sub(
        r"([.!?])\s*((?:ALTER|CREATE|SELECT|INSERT|UPDATE|DELETE)\s+.+)$",
        r"\1\n\n```sql\n\2\n```",
        s,
        flags=re.I | re.M,
    )
    s = re.sub(
        r"(row\.)((?:ALTER|CREATE|SELECT|INSERT|UPDATE|DELETE)\s+.+)$",
        r"\1\n\n```sql\n\2\n```",
        s,
        flags=re.I | re.M,
    )
    if "```sql" in s and s.count("```") % 2 == 1:
        s = s.rstrip() + "\n```"

    # Wrap full SQL-only answers
    if re.search(r"^\s*(SELECT|CREATE|WITH|DELETE|UPDATE|INSERT|ALTER|DROP)\b", s, re.I | re.M):
        if "```" not in s:
            s = f"```sql\n{s.strip()}\n```"

    s = re.sub(r"\be\.\s*g\.", "e.g.", s, flags=re.I)
    s = re.sub(r" {2,}", " ", s)
    s = re.sub(r"\n{3,}", "\n\n", s)

    return s.strip()


def load_sql_items():
    raw = HTML_PATH.read_text(encoding="utf-8")
    match = re.search(r"const DATA = (\[.*\]);", raw, re.DOTALL)
    data = json.loads(match.group(1))
    return next(category for category in data if category["name"] == "SQL")["items"]


def build_markdown(items: list[dict]) -> str:
    lines = [
        "---",
        "title: DE Interview Guide — SQL",
        "description: 69 real SQL interview questions from ADF, SQL Server, and Azure DE interviews",
        "order: 1.4",
        "parent: sql",
        "hidden: true",
        "difficulty: interview",
        "---",
        "",
        "## About this module",
        "",
        "These **69 questions** are extracted from your personal **Data Engineering Interview Guide**",
        "(ADF · SQL · Databricks). They reflect questions asked in real interviews — primary keys,",
        "joins, window functions, stored procedures, indexes, SCD, and practical coding scenarios.",
        "",
        "> Syntax: **SQL Server** unless noted. Includes Azure Synapse / MPP distribution concepts.",
        "",
    ]

    current_section = None
    for index, item in enumerate(items, 1):
        section = item.get("sub")
        if section and section != current_section:
            current_section = section
            lines.extend(["", f"## {section}", ""])

        lines.extend(
            [
                f"### {index}. {item['q']}",
                "",
                html_to_md(item.get("a_html", "")),
                "",
                "---",
                "",
            ]
        )

    lines.extend(
        [
            "## Related modules",
            "",
            "- [200 SQL Interview Questions](/topics/sql-interview) — expanded question bank",
            "- [SQL Practice Set](/topics/sql-practice) — 150 hands-on coding problems",
            "- [Interview Traps](/topics/sql-traps) — common mistakes",
        ]
    )

    return "\n".join(lines)


def main():
    items = load_sql_items()
    OUT_PATH.write_text(build_markdown(items), encoding="utf-8")
    print(f"Wrote {OUT_PATH} ({len(items)} questions)")


if __name__ == "__main__":
    main()
