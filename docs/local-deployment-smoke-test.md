# Local Deployment + Smoke Test

Before starting P1.16 (#008), verify the platform works end-to-end in a **production-like local environment** — through the browser, not only via regression scripts.

## Roadmap position

```text
P1.15 Sandbox          ✅ implementation closed
       └─ Docker/CI    ⏳ hard gate (production verification)

LOCAL DEPLOYMENT       ✅ API (13/13) + browser (3/3) — see npm run smoke:local / smoke:browser
       ↓
   smoke test clean
       ↓
P1.16 #008 Performance ⏸ blocked until above is clean
```

See [local-deployment-smoke-test.md](./local-deployment-smoke-test.md) for the local deployment step **before** the Docker gate.

---

## 1. Start local production-like server

```bash
npm install
npm run judge:setup          # PySpark + Java required for PySpark judge
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000).

Development mode (`npm run dev`) is fine for iteration, but run **`npm run build && npm start`** at least once before treating local deployment as verified.

### Stack under test

```text
Frontend (Next.js)
   ↓
/api/code/judge
   ↓
SQL Judge          (sql.js + multi-fixture)
PySpark Judge      (host Python fallback locally)
Challenge Engine   (de-challenge-judge)
   ↓
Verdict sanitization → browser
   ↓
localStorage       (submissions, solved state, draft code, skills)
```

**Local note:** Without Docker, PySpark runs via the **in-process host fallback**. That is acceptable for local smoke testing. Do **not** treat it as production verification — see [P1.15-sandbox-hardening.md](./P1.15-sandbox-hardening.md).

Optional env for local dev (defaults are fine):

```bash
# Do NOT set SECURITY_HARDENED=1 locally unless testing hardening behavior
# Do NOT set PYSPARK_JUDGE_CONTAINER=1 without Docker
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64   # if auto-detect fails
```

---

## 2. Automated smoke tests

With the server running:

```bash
npm run smoke:local      # API layer (13 checks) — same paths the browser uses
npm run smoke:browser    # Browser layer (3 checks) — localStorage, UI, submissions
```

`smoke:browser` requires Playwright (`npm install --save-dev playwright`) and Chrome/Chromium on the host. It uses system Chrome by default (`/usr/bin/google-chrome`).

### API smoke (`smoke:local`)

This exercises the same `/api/code/judge` path the browser uses:

| Check | Expectation |
|-------|-------------|
| Pages load | `/`, `/code`, `/code/challenges`, challenge workspace |
| SQL Run | `accepted`, 1 public fixture |
| SQL Submit (reference) | `accepted` |
| SQL Submit (wrong) | `wrong_answer` |
| PySpark Run + Submit | execution + verdict |
| Challenge #007 SQL reference | `accepted` |
| Challenge #007 adversarial SQL | failure + **hidden output sanitized** |
| Unknown problem | HTTP 404 |

---

## 3. Manual browser smoke test (optional)

If you prefer to click through yourself instead of `npm run smoke:browser`, use a **fresh browser profile** or clear site data first.

### Coding — SQL

Navigate: **Code → SQL → any problem** (e.g. Filter Active Employees)

```text
Open problem
 → edit query
 → Run        (public fixture preview)
 → Submit     (full fixtures)
 → see accepted or wrong_answer verdict
 → open Submissions tab → history entry appears
```

### Coding — PySpark

Navigate: **Code → PySpark → Filter Active Users**

```text
Run → Submit → verdict with runtime metrics
```

If PySpark shows unavailable, run `npm run judge:setup` and ensure `JAVA_HOME` is set.

### DE Challenge #007 — Pipeline Reconciliation

Navigate: **Code → Challenges → Pipeline Reconciliation**

```text
Select SQL language
 → submit intentionally wrong solution
 → verdict shows failed concepts (not raw hidden rows)
 → hidden test cases: no row payloads in UI
 → Submissions tab: attempt recorded with concepts
 → /code/challenges hub: skill profile reflects progress after accepted solve
```

### Fresh-browser / localStorage behavior

| Action | Expected |
|--------|----------|
| Refresh page | Draft code restored from `de-prep-hub-de-code-solutions` |
| New tab | Same origin → same submissions/solved state |
| Browser restart | Persistence survives (localStorage) |
| Clear site data | Submissions + solved state reset; app still works |
| Accept a problem | `de-prep-hub-de-code` → `solved[]` includes problem id |
| Challenge attempt | Submission in `de-prep-hub-de-code` → `submissions[]` |

**Storage keys:**

| Key | Purpose |
|-----|---------|
| `de-prep-hub-de-code` | Submissions + solved problem ids |
| `de-prep-hub-de-code-solutions` | Draft code (track/slug and challenge/language) |

---

## 4. Full regression (optional but recommended)

After smoke test passes:

```bash
npm run test:de-challenges
npm run test:judge-engine
npm run test:sql-fixtures
npm run test:sql-judge
npm run test:pyspark-judge
npm run test:security-pocs
npm run build
```

---

## 5. When local deployment is clean

Proceed to:

1. **Docker/CI gate** ([P1.15](./P1.15-sandbox-hardening.md)) — production container verification
2. **P1.16 #008** ([P1.16-performance-008.md](./P1.16-performance-008.md)) — single next major feature track

No new architecture changes, challenges, or content until local smoke test **and** Docker gate are green.
