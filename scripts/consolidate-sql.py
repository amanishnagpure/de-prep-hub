#!/usr/bin/env python3
"""Consolidate SQL modules into 3 flat pages: notes, interview, practice."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TOPICS = ROOT / "content" / "topics"

NOTE_SOURCES = [
    ("Basic", "sql-basic.md"),
    ("Medium", "sql-medium.md"),
    ("Advanced", "sql-advanced.md" if (TOPICS / "sql-advanced.md").exists() else "sql-advance.md"),
    ("Data Engineering", "sql-de-topics.md"),
    ("Patterns & Traps", None),  # patterns + traps combined section title
]

PATTERN_TRAP_FILES = ["sql-patterns.md", "sql-traps.md"]

REMOVE_FILES = [
    "sql-basic.md",
    "sql-medium.md",
    "sql-advance.md",
    "sql-interview-guide.md",
    "sql-patterns.md",
    "sql-de-topics.md",
    "sql-traps.md",
]


def strip_frontmatter(text: str) -> str:
    if text.startswith("---"):
        end = text.find("---", 3)
        if end != -1:
            return text[end + 3 :].lstrip()
    return text


def flatten_content(text: str) -> str:
    text = strip_frontmatter(text)

    # Remove part headers and overview noise
    text = re.sub(r"^## PART \d+[^\n]*\n+", "", text, flags=re.M)
    text = re.sub(r"^## About this module\n+.*?(?=\n## |\n### |\Z)", "", text, flags=re.M | re.S)
    text = re.sub(r"^## Next steps\n+.*", "", text, flags=re.M | re.S)
    text = re.sub(r"^## Related modules\n+.*", "", text, flags=re.M | re.S)
    text = re.sub(r"^Below is the \*\*.*?\n+", "", text, flags=re.M)
    text = re.sub(r"^I've grouped it by difficulty\.\n+", "", text, flags=re.M)

    # Demote headings one level (cap at ###); #### become bold labels (not TOC entries)
    lines = []
    for line in text.splitlines():
        if line.startswith("####"):
            title = line[4:].strip()
            lines.append(f"**{title}**")
        elif line.startswith("###"):
            lines.append("####" + line[3:])
        elif line.startswith("##"):
            lines.append("###" + line[2:])
        elif line.startswith("# "):
            lines.append("##" + line[1:])
        else:
            lines.append(line)
    text = "\n".join(lines)

    # Remove numbered prefixes from headings: ### 1. Title -> ### Title
    text = re.sub(r"^(#{2,4}) \d+\.\s*", r"\1 ", text, flags=re.M)
    text = re.sub(r"^(#{2,4}) \[Basic\]\s*", r"\1 ", text, flags=re.M)
    text = re.sub(r"^(#{2,4}) \[Medium\]\s*", r"\1 ", text, flags=re.M)
    text = re.sub(r"^(#{2,4}) \[Hard\]\s*", r"\1 ", text, flags=re.M)
    text = re.sub(r"^#{2,4} A\. BASIC[^\n]*\n", "", text, flags=re.M)
    text = re.sub(r"^#{2,4} B\. MEDIUM[^\n]*\n", "", text, flags=re.M)
    text = re.sub(r"^#{2,4} C\. ADVANCED[^\n]*\n", "", text, flags=re.M)
    text = re.sub(r"^#{2,4} D\. HARD[^\n]*\n", "", text, flags=re.M)
    text = re.sub(r"^#{2,4} 2a\. SQL[^\n]*\n", "", text, flags=re.M)

    # Collapse excessive horizontal rules
    text = re.sub(r"\n---\n(?:\n---\n)+", "\n\n", text)
    text = re.sub(r"\n---\n(?=\n#### )", "\n\n", text)
    text = re.sub(r"\n{4,}", "\n\n\n", text)

    return text.strip()


def build_notes() -> str:
    sections = []

    for title, filename in NOTE_SOURCES[:4]:
        if filename:
            body = flatten_content((TOPICS / filename).read_text(encoding="utf-8"))
            sections.append(f"## {title}\n\n{body}")

    # patterns + traps under one heading
    combined = []
    for filename in PATTERN_TRAP_FILES:
        path = TOPICS / filename
        if path.exists():
            combined.append(flatten_content(path.read_text(encoding="utf-8")))
    sections.append("## Patterns & Traps\n\n" + "\n\n".join(combined))

    body = "\n\n".join(sections)

    return f"""---
title: SQL Notes
description: Complete SQL reference — basics through advanced, data engineering topics, patterns and traps
order: 1.1
parent: sql
hidden: true
difficulty: basic
---

One consolidated reference for SQL interview prep. Use the table of contents sidebar to jump within each area.

{body}
"""


def build_interview() -> str:
    guide_path = TOPICS / "sql-interview-guide.md"
    if guide_path.exists():
        raw = strip_frontmatter(guide_path.read_text(encoding="utf-8"))
    else:
        raw = strip_frontmatter((TOPICS / "sql-interview.md").read_text(encoding="utf-8"))
        raw = re.sub(r"^Answer each question.*?\n\n", "", raw, flags=re.S)
        raw = re.sub(r"^Real questions from.*?\n\n", "", raw, flags=re.S)

    lines = []
    q_num = 0
    for line in raw.splitlines():
        if line.startswith("### ") or line.startswith("#### "):
            q_num += 1
            title = re.sub(r"^\d+\.\s*", "", line.lstrip("#").strip())
            lines.append(f"### {q_num}. {title}")
        elif line.startswith("## 2a."):
            continue
        elif line.startswith("## "):
            continue
        elif line.strip() == "---":
            lines.append("")
        else:
            lines.append(line)

    body = "\n".join(lines)
    body = re.sub(r"\n{4,}", "\n\n\n", body)

    return f"""---
title: SQL Interview Q&A
description: 69 real SQL interview questions from your Data Engineering interview guide
order: 1.2
parent: sql
hidden: true
difficulty: interview
---

Answer each question out loud before reading the solution.

{body.strip()}
"""


def build_practice_frontmatter() -> None:
    path = TOPICS / "sql-practice.md"
    text = path.read_text(encoding="utf-8")
    text = re.sub(r"^order: [\d.]+", "order: 1.3", text, flags=re.M)
    text = re.sub(
        r"^title:.*$",
        "title: SQL Practice — 150 Problems",
        text,
        flags=re.M,
        count=1,
    )
    # Flatten practice section headers
    body = strip_frontmatter(text)
    body = re.sub(r"^## How to use this practice set\n+.*?(?=\n## Basic)", "", body, flags=re.M | re.S)
    body = re.sub(r"^## Basic — Problems.*\n", "## Basic\n\n", body, flags=re.M)
    body = re.sub(r"^## Medium — Problems.*\n", "## Medium\n\n", body, flags=re.M)
    body = re.sub(r"^## Hard — Problems.*\n", "## Hard\n\n", body, flags=re.M)
    body = re.sub(r"^### \d+\. \[(Basic|Medium|Hard)\] ", "### ", body, flags=re.M)
    body = re.sub(r"^## Next steps\n+.*", "", body, flags=re.M | re.S)
    path.write_text(
        """---
title: SQL Practice — 150 Problems
description: Hands-on SQL coding problems with quiz and timed modes
order: 1.3
parent: sql
hidden: true
difficulty: practice
---

Write your query first, then reveal the solution. Use the **quiz panel** above for random 10 or 20-minute timed practice.

"""
        + body.strip()
        + "\n",
        encoding="utf-8",
    )


def build_hub() -> None:
    (TOPICS / "sql.md").write_text(
        """---
title: SQL & Databases
description: SQL preparation for Data Engineer, Azure DE, and Databricks interviews
order: 1
---

## SQL Prep — 3 modules

Everything is consolidated into three focused pages:

| Module | What's inside |
|--------|----------------|
| [SQL Notes](/topics/sql-notes) | Basics → Advanced → DE topics → patterns & traps (one reference) |
| [Interview Q&A](/topics/sql-interview) | 69 real interview questions from your interview guide |
| [Practice](/topics/sql-practice) | 150 coding problems + random quiz & timed mode |

### Study order

```text
Notes → Practice → Interview Q&A
```

Read **Notes** first, drill with **Practice**, then test yourself with **Interview Q&A**.
""",
        encoding="utf-8",
    )


def main():
    (TOPICS / "sql-notes.md").write_text(build_notes(), encoding="utf-8")
    print("Wrote sql-notes.md")

    (TOPICS / "sql-interview.md").write_text(build_interview(), encoding="utf-8")
    print("Wrote sql-interview.md (69 questions)")

    build_practice_frontmatter()
    print("Updated sql-practice.md")

    # Remove old sql-interview 200q is overwritten; delete obsolete files
    for name in REMOVE_FILES:
        path = TOPICS / name
        if path.exists() and name != "sql-interview.md":
            path.unlink()
            print(f"Removed {name}")

    build_hub()
    print("Updated sql.md hub")


if __name__ == "__main__":
    main()
