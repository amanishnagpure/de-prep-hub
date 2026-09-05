---
title: Interview Notes
description: Behavioral, technical roundup, resume, negotiation, and traps for DE interviews
parent: interview
hidden: true
order: 1
difficulty: basic
---

# Interview Prep Master Notes

Built for **Data Engineering** interviews — behavioral STAR → technical roundup → resume → negotiation → traps.

Each topic: **Concept → Framework → Example → DE example → Mistake → Interview → Practice**

---

## Behavioral

### 1. STAR Method

**Concept:** Four-part structure for behavioral answers — interviewers score clarity, ownership, and impact.

**Framework:**

- **Situation** (15s): team, scale, stakes
- **Task** (10s): your specific responsibility
- **Action** (60s): what *you* did, step by step
- **Result** (15s): metric, business outcome, learning

**Example:** 90–120 second answer for 'tell me about a conflict'.

**DE example:** Pipeline outage story: Situation = 50 ADF pipelines, Task = you owned finance domain, Action = added row-count checks + PagerDuty runbook, Result = MTTR 48h → 2h.

**Common mistake:** 5-minute ramble with no result or using 'we' for every action.

**Interview:** Walk me through STAR for a production incident.

**Practice:** STAR Drill #1

### 2. Situation — Setting Context

**Concept:** Anchor the listener in time, team size, and business context without jargon overload.

**Framework:**

Template: 'At [company], our [team] supported [N pipelines / TB / users] for [business function].'

**Example:** 'We had 12 analysts waiting on daily revenue reports.'

**DE example:** 'Finance close depended on 8 Synapse pipelines ingesting SAP and Salesforce — ~2M rows/day.'

**Common mistake:** Starting with technical stack before business why.

**Interview:** How much context is enough?

**Practice:** STAR Drill #2

### 3. Task — Your Ownership

**Concept:** Separate team goal from your personal accountability.

**Framework:**

Use 'I was asked to…' or 'I owned…' — not 'the team needed to…'

**Example:** 'I was the primary DE on the migration timeline.'

**DE example:** 'I owned observability and backfill strategy for the orders domain.'

**Common mistake:** Hiding behind 'we' when asked about your role.

**Interview:** How do you show ownership without arrogance?

**Practice:** STAR Drill #3

### 4. Action — What You Did

**Concept:** Chronological, specific steps with tools named correctly.

**Framework:**

3–5 bullets mentally: diagnose → design → implement → validate → communicate

**Example:** Profiled slow query, added index, validated with explain plan.

**DE example:** Repartitioned skewed join, added salting, validated row counts vs source.

**Common mistake:** Vague 'I optimized the pipeline' without steps.

**Interview:** What if you only assisted — how honest?

**Practice:** STAR Drill #4

### 5. Result — Quantify Impact

**Concept:** Numbers beat adjectives: time, cost, accuracy, scale, risk reduced.

**Framework:**

Before → After: latency, cost, incidents, adoption, revenue protected

**Example:** Cut runtime 4h → 45m; saved $12k/month compute.

**DE example:** Reduced duplicate orders 0.3% → 0.01%; prevented $2M misstatement risk.

**Common mistake:** Ending with 'it went well' or only technical metrics without business tie.

**Interview:** What if you have no metrics?

**Practice:** STAR Drill #5

### 6. Leadership Without Authority

**Concept:** Influence cross-functional stakeholders when you don't manage them.

**Framework:**

Align on problem → propose small POC → show data → get sponsor → scale

**Example:** Convinced analytics to adopt shared dimension model.

**DE example:** Piloted Delta medallion for one domain; expanded after 40% faster refreshes.

**Common mistake:** Complaining about other teams instead of showing collaboration.

**Interview:** Tell me about influencing a team you don't manage.

**Practice:** STAR Drill #6

### 7. Conflict Resolution

**Concept:** Disagreement on architecture, priorities, or data definitions.

**Framework:**

Listen → restate their concern → shared goal → options + tradeoffs → agree + document

**Example:** Analyst wanted real-time; you showed cost of streaming vs hourly batch.

**DE example:** Platform wanted Kafka; product needed T+1 — proposed micro-batch compromise with SLA doc.

**Common mistake:** Winning the argument instead of finding workable design.

**Interview:** Disagreement with a senior engineer?

**Practice:** STAR Drill #7

### 8. Failure & Learning

**Concept:** Real mistake + accountability + systemic fix.

**Framework:**

What happened → your role → impact → what you changed (process/tool/test)

**Example:** Deployed wrong partition key; added pre-deploy validation.

**DE example:** Missed schema change broke gold mart; added contract tests in CI.

**Common mistake:** Fake weakness ('I work too hard') or blaming others only.

**Interview:** Biggest mistake in a data pipeline?

**Practice:** STAR Drill #8

### 9. Tight Deadlines

**Concept:** Prioritize MVP, communicate risk, cut scope not quality on keys.

**Framework:**

Clarify must-haves → parallelize → automate tests → daily stakeholder sync

**Example:** Shipped 80% reports on time; deferred nice-to-have dims.

**DE example:** Month-end migration: bronze+silver only week 1; gold week 2 with exec sign-off.

**Common mistake:** Silent scope slip until deadline day.

**Interview:** How do you handle impossible timelines?

**Practice:** STAR Drill #9

### 10. Data Quality Incidents

**Concept:** Detect, contain, root-cause, prevent recurrence.

**Framework:**

Alert → stop bad propagation → quantify blast radius → hotfix → RCA → guardrails

**Example:** Null rate spike in key column triggered quarantine.

**DE example:** Revenue off 15% — traced to currency conversion bug in silver MERGE.

**Common mistake:** Fixing forward without backfill plan or stakeholder comms.

**Interview:** Walk through a data quality fire drill.

**Practice:** STAR Drill #10

### 11. Mentoring & Collaboration

**Concept:** Teaching, pairing, documentation, code review culture.

**Example:** Onboarded junior on dbt + PR standards.

**DE example:** Created notebook templates and pairing sessions for ADF → Databricks handoff.

**Common mistake:** Hero culture — only you can run the pipeline.

**Interview:** How do you mentor junior DEs?

**Practice:** STAR Drill #11

### 12. Explaining Tech to Non-Technical

**Concept:** Analogies, outcomes, visuals — avoid acronyms.

**Framework:**

Outcome first → simple analogy → one diagram → confirm understanding

**Example:** Explained partitioning as 'filing cabinets by month'.

**DE example:** Told CFO 'we separate raw receipts from verified totals like accounting periods'.

**Common mistake:** Diving into Spark executor memory.

**Interview:** Explain your pipeline to a product manager.

**Practice:** STAR Drill #12

### 13. Amazon Leadership Principles (DE lens)

**Concept:** Many companies use LP-style behavioral probes.

**Framework:**

Ownership | Dive Deep | Deliver Results | Bias for Action | Learn & Be Curious | Customer Obsession

**Example:** Map 6 stories to 6 LPs before onsite.

**DE example:** Dive Deep: debugged skew via stage metrics; Deliver Results: migration on date despite scope creep.

**Common mistake:** Memorizing LP definitions without stories.

**Interview:** Give an example of Dive Deep.

**Practice:** STAR Drill #13

### 14. Story Bank Maintenance

**Concept:** 6–8 polished stories cover 80% of behavioral loops.

**Framework:**

Leadership | Conflict | Failure | Deadline | DQ incident | Mentoring | Initiative | Communication

**Example:** Spreadsheet with STAR bullets + metrics per story.

**DE example:** Rotate stories by company values listed in job description.

**Common mistake:** One generic story forced into every question.

**Interview:** How many stories should you prepare?

**Practice:** STAR Drill #14

### 15. Delivery & Prioritization

**Concept:** Backlog tradeoffs when stakeholders compete.

**Framework:**

Impact × urgency matrix → explicit defer list → written agreement

**Example:** Deferred dashboard polish to ship compliance report.

**DE example:** Prioritized PII masking over new mart when audit was 2 weeks out.

**Common mistake:** Yes to everything — missed all deadlines.

**Interview:** Two executives want conflicting priorities?

**Practice:** STAR Drill #15

### 16. Initiative & Process Improvement

**Concept:** Self-started improvements beyond ticket queue.

**Example:** Introduced data catalog documentation.

**DE example:** Built reusable ADF linked service ARM templates — cut deploy time 60%.

**Common mistake:** Claiming credit for mandated compliance work only.

**Interview:** Something you improved without being asked?

**Practice:** STAR Drill #16

### 17. On-Call & Incidents

**Concept:** Calm triage, communication, postmortem blameless culture.

**Framework:**

Acknowledge → mitigate → communicate ETA → fix → postmortem → action items

**Example:** Paged at 2am; rolled back deploy; notified stakeholders in 15m.

**DE example:** ADF failure — reran with idempotent MERGE after fixing watermark.

**Common mistake:** Fixing prod without ticket or communication.

**Interview:** Describe your on-call experience.

**Practice:** STAR Drill #17

### 18. Working with Ambiguity

**Concept:** Incomplete requirements are normal — clarify and prototype.

**Framework:**

Assumptions doc → 1-week spike → demo → refine requirements

**Example:** Source schema undocumented — profiled samples.

**DE example:** Built bronze ingest before silver contract signed; gated promotion with DQ checks.

**Common mistake:** Waiting forever for perfect specs.

**Interview:** Project with unclear requirements?

**Practice:** STAR Drill #18

### 19. Cross-Team Dependencies

**Concept:** Upstream delays, API changes, platform outages.

**Framework:**

Dependency map → SLAs → escalation path → fallback/buffer

**Example:** API team slipped — consumed cached snapshot with disclaimer.

**DE example:** Databricks maintenance window — shifted batch window + pre-warmed cluster.

**Common mistake:** Surprise leadership on demo day.

**Interview:** Blocked by another team?

**Practice:** STAR Drill #19

### 20. Behavioral Answer Timing

**Concept:** Pacing and practice prevent rambling.

**Framework:**

90–120s target; practice with timer; pause before answering

**Example:** Record on phone; cut filler words.

**DE example:** Mock with peer asking random LP questions.

**Common mistake:** Answering immediately without 3-second think.

**Interview:** Is it OK to ask for a moment to think?

**Practice:** STAR Drill #20


## Technical Roundup

### 1. DE Interview Loop Structure

**Concept:** Typical loop: recruiter → hiring manager → technical screens → onsite (SQL, Python/Spark, design, behavioral).

**Framework:**

Prep per round: SQL 40% | Python/Spark 25% | Design 20% | Behavioral 15%

**Example:** 2-week plan: SQL daily, design 3 cases, 8 STAR stories.

**DE example:** Azure DE: expect ADF + Databricks + SQL + one design whiteboard.

**Common mistake:** Only cramming SQL and ignoring behavioral.

**Interview:** What does your interview process look like?

### 2. SQL Round Expectations

**Concept:** Joins, windows, aggregations, optimization intuition — often live or timed.

**Framework:**

See SQL Lab: Notes → Practice → LeetCode → Interview flashcards

**Example:** Second-highest salary per dept; sessionization; retention.

**DE example:** Explain why LEFT JOIN + WHERE can become INNER.

**Common mistake:** Writing query without stating assumptions.

**Interview:** How do you approach an unseen SQL problem?

**Practice:** SQL Practice #1–25

### 3. Python / pandas Round

**Concept:** Transformations, data structures, edge cases — sometimes notebook or verbal.

**Framework:**

See Python Lab: pandas groupby, merge, null handling, vectorization

**Example:** Deduplicate by key keeping latest timestamp.

**DE example:** When to leave pandas for Spark — row count threshold.

**Common mistake:** Row-by-row loops on large data.

**Interview:** pandas vs PySpark for 10GB?

**Practice:** Python Practice #1–15

### 4. Spark / PySpark Round

**Concept:** Transformations, joins, shuffle, skew, partitions.

**Framework:**

See Spark Lab: wide vs narrow, broadcast join, AQE, salting

**Example:** Why did job OOM after join?

**DE example:** Repartition before groupBy on high-cardinality key.

**Common mistake:** collect() on large RDD/DataFrame.

**Interview:** Explain shuffle.

**Practice:** Spark Practice #1–12

### 5. System Design Opening

**Concept:** Never jump to boxes — clarify requirements first.

**Framework:**

1. Clarify (volume, latency, retention, consumers)
2. High-level diagram
3. Deep dive 1–2 areas
4. Tradeoffs
5. Observability + failure modes

**Example:** Clickstream → daily dashboards.

**DE example:** 500M events/day, T+1 SLA, GDPR delete support.

**Common mistake:** Designing Kafka for a weekly CSV report.

**Interview:** Design a metrics pipeline.

**Practice:** System Design Practice #1

### 6. Batch vs Streaming Choice

**Concept:** Match freshness requirement to cost and complexity.

**Framework:**

Batch: scheduled, simpler correctness | Stream: low latency | Micro-batch: compromise

**Example:** Fraud alerts → stream; finance close → batch.

**DE example:** Spark Structured Streaming with 5-min trigger for near-real-time KPIs.

**Common mistake:** Streaming because it sounds modern.

**Interview:** When batch beats streaming?

**Practice:** System Design Practice #2

### 7. Storage Layer Tradeoffs

**Concept:** Data lake (ADLS/S3), warehouse (Synapse/BigQuery), lakehouse (Delta/Iceberg).

**Framework:**

Lake: cheap flexible files | Warehouse: SQL BI | Lakehouse: ACID on object storage

**Example:** Bronze Parquet → Silver Delta → Gold Synapse serving.

**DE example:** Medallion on ADLS with Unity Catalog governance.

**Common mistake:** Warehouse as only landing zone for raw JSON.

**Interview:** Lake vs warehouse vs lakehouse?

**Practice:** System Design Practice #3

### 8. CDC & Incremental Loads

**Concept:** Capture changes instead of full extracts.

**Framework:**

Timestamp watermark | CDC log | Change Data Feed | MERGE idempotency

**Example:** SQL Server CDC → ADF → bronze → silver MERGE.

**DE example:** Delta CDF for downstream gold incremental refresh.

**Common mistake:** Watermark advanced before successful commit.

**Interview:** How handle deletes in CDC?

**Practice:** Databricks Practice #1

### 9. Idempotency & Exactly-Once

**Concept:** Safe replays without duplicates or lost data.

**Framework:**

Deterministic keys | MERGE | partition overwrite with replaceWhere | Kafka offset + checkpoint

**Example:** Re-run failed ADF slice without duplicate facts.

**DE example:** Delta MERGE on business key + ingest_batch_id audit.

**Common mistake:** Append-only loads on retry.

**Interview:** Exactly-once realistic in distributed systems?

**Practice:** System Design Practice #4

### 10. Data Quality & Contracts

**Concept:** Validate early; fail fast or quarantine bad rows.

**Framework:**

Great Expectations / DLT EXPECT / row counts / null thresholds / schema registry

**Example:** Reject file if primary key null rate > 0.1%.

**DE example:** Bronze quarantine path + alert; silver never sees bad batch.

**Common mistake:** DQ only at BI layer.

**Interview:** Where in pipeline do you enforce DQ?

**Practice:** System Design Practice #5

### 11. Partitioning & Pruning

**Concept:** Physical layout for filter performance.

**Framework:**

Partition on date/region — avoid high cardinality | Z-ORDER for multi-filter

**Example:** Hive partition dt=2024-01-01.

**DE example:** ADLS folder layout matches query patterns for Synapse serverless.

**Common mistake:** Partition on customer_id.

**Interview:** Partition vs cluster keys?

**Practice:** Spark Practice #20

### 12. Skew & Hot Keys

**Concept:** Uneven partition sizes slow joins and aggregations.

**Framework:**

Salting | broadcast small side | AQE skew join | isolate hot key processing

**Example:** Null join key explosion.

**DE example:** Salt user_id with random suffix for reduce phase.

**Common mistake:** Only increasing shuffle partitions without fixing skew.

**Interview:** Symptoms of skew?

**Practice:** Spark Practice #25

### 13. Azure ADF in Design Answers

**Concept:** Orchestration — not storage or heavy transform.

**Framework:**

Linked services → datasets → pipelines → triggers → IR | Copy vs Mapping Data Flow vs Databricks notebook

**Example:** Nightly copy SQL → ADLS bronze.

**DE example:** Parameterize environment via ARM + Key Vault.

**Common mistake:** Saying ADF stores data.

**Interview:** ADF vs Databricks division of labor?

**Practice:** Cloud Practice #1–8

### 14. ADLS Gen2 & Medallion Layout

**Concept:** Hierarchical paths for bronze/silver/gold with RBAC at container/folder.

**Framework:**

abfss://container@account.dfs.core.windows.net/bronze/source/table/dt=...

**Example:** Separate containers per environment.

**DE example:** Managed identity from ADF/Databricks to ADLS.

**Common mistake:** Public containers with keys in git.

**Interview:** How secure ADLS access?

**Practice:** Cloud Practice #9–15

### 15. Databricks in Design Answers

**Concept:** Compute for Spark/SQL; Delta for lakehouse; Workflows for orchestration.

**Framework:**

Auto Loader bronze | MERGE silver | OPTIMIZE/VACUUM ops | UC governance

**Example:** Notebook task in Workflow DAG.

**DE example:** Serverless SQL warehouse for analyst gold queries.

**Common mistake:** All-purpose cluster for production cron.

**Interview:** When Databricks vs Synapse?

**Practice:** Databricks Practice #1–10

### 16. Airflow / Orchestration Mention

**Concept:** DAG dependencies, idempotent tasks, backfill, sensors.

**Framework:**

See Airflow Lab — operators, XCom, catchup, pools

**Example:** Task A bronze → Task B silver with retry.

**DE example:** Compare ADF triggers vs Airflow DAG schedule.

**Common mistake:** Orchestrator doing heavy transform.

**Interview:** Airflow vs ADF?

**Practice:** Airflow Practice #1–8

### 17. SCD Type 1 vs 2

**Concept:** Overwrite vs history tracking for dimensions.

**Framework:**

Type 1: update in place | Type 2: effective dates + is_current | Type 3: limited history columns

**Example:** Customer address changes.

**DE example:** Delta MERGE SCD2 pattern in silver.

**Common mistake:** SCD2 without closing previous row.

**Interview:** When Type 1 enough?

**Practice:** SQL Practice + System Design #6

### 18. Late-Arriving Data

**Concept:** Events after watermark or close of period.

**Framework:**

Watermarks in stream | reopen partitions | adjustment facts | grace period

**Example:** Mobile events arrive 24h late.

**DE example:** Reprocess last 3 days of gold partition nightly.

**Common mistake:** Ignoring late data in SLA design.

**Interview:** How affect batch vs stream?

**Practice:** System Design Practice #7

### 19. SLA & Observability

**Concept:** Define freshness, completeness, latency; monitor and alert.

**Framework:**

Data contracts | row count checks | freshness timestamp | lineage | PagerDuty

**Example:** Gold must land by 6am — alert at 5:30 if bronze incomplete.

**DE example:** ADF pipeline success + Databricks job duration + DQ metrics dashboard.

**Common mistake:** Monitoring only infra not data.

**Interview:** What metrics for pipeline health?

**Practice:** System Design Practice #8

### 20. Whiteboard Mechanics

**Concept:** Readable diagrams and collaborative narration.

**Framework:**

Left-to-right flow | label formats | note SLAs | ask questions throughout

**Example:** Boxes: Source → Ingest → Lake → Transform → Serve → BI

**DE example:** Add Key Vault, private endpoint if security asked.

**Common mistake:** Silent drawing for 10 minutes.

**Interview:** Tips for virtual whiteboard?

**Practice:** System Design Practice #9–20


## Resume

### 1. One-Page DE Resume

**Concept:** Recruiters scan 6–10 seconds — clarity and metrics win.

**Framework:**

Header | 2-line summary | Skills (grouped) | Experience (bullets) | Projects | Education

**Example:** Single page for <10 YOE.

**DE example:** Lead with Azure, Spark, SQL if target role is Azure DE.

**Common mistake:** Two pages of dense paragraphs.

**Interview:** Walk me through your resume.

### 2. Summary Line Formula

**Concept:** Positioning statement — not objective fluff.

**Script / template:**

[Title] with [X years] building [type] pipelines on [stack]. [Domain impact metric].

**Example:** 'Data Engineer with 5 years building batch/stream pipelines on Azure and Databricks. Cut report latency 60% for finance analytics.'

**DE example:** Mention medallion, Delta, ADF if in job description.

**Common mistake:** 'Hardworking team player seeking growth.'

**Interview:** Tell me about yourself — first 60 seconds.

### 3. Bullet Formula (CAR)

**Concept:** Context → Action → Result with numbers.

**Script / template:**

[Verb] [what] using [tech] [for whom], [metric].

**Example:** 'Built 12 ADF pipelines ingesting 5M daily events to Delta, cutting latency T+2 → T+0.'

**DE example:** 'Optimized PySpark joins with broadcast + salting, reducing runtime 4h → 50m ($8k/mo savings).'

**Common mistake:** 'Responsible for data pipelines.'

**Interview:** Proudest project on resume?

### 4. Skills Section Grouping

**Concept:** Grouped skills beat alphabetical soup.

**Framework:**

Languages | Cloud (Azure) | Orchestration | Warehouses/Lakehouse | Tools

**Example:** Python, SQL, PySpark | ADF, ADLS, Synapse, Databricks, Delta

**DE example:** Match JD keywords honestly — no keyword stuffing.

**Common mistake:** Listing 40 tools with no depth story.

**Interview:** Strongest vs learning skills?

### 5. Quantifying Impact

**Concept:** Every bullet should have scale or outcome where possible.

**Framework:**

Rows/day, TB, pipeline count, latency, cost, error rate, users

**Example:** 50 pipelines, 3TB/day, 99.9% SLA.

**DE example:** Revenue protected, audit pass, headcount supported.

**Common mistake:** Inflating numbers you cannot defend in interview.

**Interview:** How did you measure that improvement?

### 6. Projects Section

**Concept:** Backfill experience or show initiative.

**Framework:**

Problem → stack → your role → link (GitHub) → metric

**Example:** End-to-end lakehouse demo with public dataset.

**DE example:** Medallion on ADLS + Databricks + Power BI README diagram.

**Common mistake:** Tutorial clone without README or architecture.

**Interview:** Tell me about this GitHub project.

### 7. GitHub Portfolio

**Concept:** Proof of work — clean README, no secrets.

**Framework:**

Architecture diagram | setup steps | sample data | what you learned

**Example:** Pin 2 repos; CI badge optional.

**DE example:** IaC for ADF ARM or databricks.yml bundle impresses.

**Common mistake:** Credentials in notebook committed to public repo.

**Interview:** What should I look at in your GitHub?

### 8. Certifications

**Concept:** Signal for Azure-focused roles — not substitute for experience.

**Framework:**

DP-203 (Azure Data Engineer) | AZ-900 fundamentals | Databricks associate

**Example:** List with year; drop expired irrelevant certs.

**DE example:** DP-203 aligns with ADF/ADLS/Synapse interview topics.

**Common mistake:** 10 certs no projects.

**Interview:** How did certification help on job?

### 9. Resume Red Flags

**Concept:** What screeners filter out.

**Framework:**

Buzzwords without metrics | gaps unexplained | title inflation | every tool ever

**Example:** Explain 6-month gap honestly in one line.

**DE example:** 'Architect' title but only 1 YOE — mismatch.

**Common mistake:** Same bullet copy-pasted across roles.

**Interview:** Gap in employment?

### 10. Tailoring per Application

**Concept:** Mirror JD language in summary and top bullets — truthfully.

**Framework:**

Highlight 3 JD requirements in first 3 bullets of most relevant role

**Example:** JD wants Unity Catalog — move Delta/UC bullet up.

**DE example:** Reorder skills: Azure first for Microsoft loop.

**Common mistake:** Identical resume for DE vs analytics engineer roles.

**Interview:** Why this role?

### 11. LinkedIn Alignment

**Concept:** Resume and LinkedIn should tell same story — LinkedIn can add detail.

**Framework:**

Headline = target title | About = expanded summary | Featured = repos/posts

**Example:** Headline: 'Data Engineer | Azure | Databricks | SQL'

**DE example:** Recommendations from EM or peer on delivery stories.

**Common mistake:** Resume says Python expert, LinkedIn empty.

**Interview:** Anything not on resume I should know?

### 12. Discussing Each Role

**Concept:** Be ready for 3–5 minute deep dive per recent job.

**Framework:**

Team context | your scope | top 2 projects | tech | why you left

**Example:** Last role: platform team, 4 engineers, you owned ingestion.

**DE example:** Migration from on-prem SQL to ADLS medallion — your workstream.

**Common mistake:** Badmouthing previous employer.

**Interview:** Why leaving current role?


## Negotiation

### 1. When to Discuss Comp

**Concept:** Delay until fit is clear; negotiate after written offer.

**Framework:**

Recruiter screen: deflect | HM: focus on role | Offer: negotiate

**Script / template:**

'I'm focused on fit; happy to discuss comp once we're aligned on the role.'

**Example:** Don't give current salary if illegal to ask — redirect to range.

**DE example:** Azure DE bands vary by level (IC3/4/5) — know your level.

**Common mistake:** Giving number first without research.

**Interview:** What are your salary expectations?

### 2. Total Compensation

**Concept:** Base + bonus + equity + benefits — compare apples to apples.

**Framework:**

TC = base + (bonus × target %) + equity annualized + sign-on amortized

**Example:** Big tech: heavy RSU; consulting: lower base, bonus.

**DE example:** Microsoft: refresh grants matter over 4 years.

**Common mistake:** Comparing startup equity to cash only.

**Interview:** How do you evaluate offers?

### 3. Market Research

**Concept:** Data before anchor.

**Framework:**

Levels.fyi | Glassdoor | Blind | recruiter friends | multiple offers

**Example:** DE L4 Seattle band ~$180–220k base (verify current year).

**DE example:** India: factor remote US vs local product company.

**Common mistake:** Single anecdotal number.

**Interview:** How did you arrive at your ask?

### 4. Negotiation Script

**Concept:** Polite, specific, flexible.

**Script / template:**

'Thank you for the offer. Based on my research for [level] DE roles in [location] and my experience with [Azure/Spark/migration], I was hoping for [X] base. Is there flexibility on base or sign-on?'

**Example:** Anchor slightly above target; leave room.

**DE example:** Cite competing offer only if true.

**Common mistake:** Ultimatum tone or lying about offers.

**Interview:** Can you do better on base?

### 5. What to Negotiate

**Concept:** Priority order when base is fixed.

**Framework:**

1. Base 2. Sign-on 3. Equity/RSU 4. Level/title 5. Start date/PTO/remote

**Example:** Ask sign-on if base capped.

**DE example:** Level bump affects future comp bands — worth pushing.

**Common mistake:** Negotiating only PTO when base is 20% below market.

**Interview:** What else besides salary?

### 6. Multiple Offers

**Concept:** Leverage without burning bridges.

**Framework:**

Transparent timeline | compare TC + growth + team | decide | thank others

**Example:** 'I have another offer deciding Friday — can we expedite?'

**DE example:** Choose team and learning over 5% TC sometimes.

**Common mistake:** Ghosting recruiters.

**Interview:** Are you interviewing elsewhere?

### 7. Red Lines & Walk Away

**Concept:** Know minimum TC and role fit non-negotiables.

**Framework:**

Written offer | clawback terms | role scope matches interview | on-call expectations

**Example:** Sign-on clawback 12 months — factor job risk.

**DE example:** Vague 'data generalist' if you want platform DE.

**Common mistake:** Accepting verbal promise not in offer letter.

**Interview:** When would you decline an offer?

### 8. Counter-Offer from Current Employer

**Concept:** Often short-term retention; evaluate why you interviewed.

**Framework:**

Compare new role growth | trust after counter | market adjustment rarity

**Example:** Counter may not fix root cause (tech debt, no growth).

**DE example:** If staying, get promises in writing.

**Common mistake:** Accepting counter without reflection.

**Interview:** Employer matched offer — what would you do?

### 9. Contract & Consulting Rates

**Concept:** W2 vs C2C — different tax and benefit implications (region-specific).

**Framework:**

Hourly × billable hours vs salary TC | benefits gap | contract length

**Example:** C2C higher rate but no PTO/insurance.

**DE example:** DE contractors on Azure migrations — 6–12 month contracts common.

**Common mistake:** Ignoring unpaid bench time between contracts.

**Interview:** Interest in contract vs FTE?

### 10. Remote & Geo Pay

**Concept:** Some companies adjust pay by location.

**Framework:**

Ask policy upfront | remote tier bands | relocation clauses

**Example:** Fully remote with US geo band.

**DE example:** Hybrid 3-day office — factor commute cost.

**Common mistake:** Assuming SF salary for remote India.

**Interview:** How is pay determined for remote?


## Traps

### 1. Classic HR Traps

**Concept:** Questions designed to probe self-awareness and fit.

**Framework:**

| Trap | Defense |
| Weakness | Real + improvement |
| Why hire you | 3 proof bullets |
| Unlimited scope design | Clarify MVP |

**Example:** 'Biggest weakness' — not 'perfectionism'.

**DE example:** 'Why DE?' — tie to building reliable data products at scale.

**Common mistake:** Memorized generic answers.

**Interview:** Greatest weakness?

### 2. Fake Expertise Trap

**Concept:** Resume or answer claims tool depth you lack.

**Framework:**

'I haven't used X in prod but I've used Y which shares [concept]. I'd ramp in [timeframe].'

**Example:** Never used Snowflake but strong Synapse — explain transfer.

**DE example:** Honest about Databricks cert vs production MERGE experience.

**Common mistake:** Bluffing through ADF linked service questions.

**Interview:** Rate yourself 1–10 on Spark.

### 3. Live Coding Traps

**Concept:** Silent coding or no test cases.

**Framework:**

Restate problem | examples | approach | code | test edge cases | complexity

**Example:** Talk through SQL before typing.

**DE example:** Python: handle empty input, null keys.

**Common mistake:** Jumping to code without plan.

**Interview:** Stuck on problem — what do you do?

### 4. Take-Home Abuse

**Concept:** Unpaid work beyond reasonable scope.

**Framework:**

>4 hours unpaid → ask to scope down or decline | use public data only

**Example:** 'Can I deliver subset demonstrating architecture?'

**DE example:** Take-home should mirror real work — not production free labor.

**Common mistake:** Spending weekend on unlimited spec.

**Interview:** Company assigns 20-hour take-home.

### 5. Architecture Without Requirements

**Concept:** Design questions need clarifying questions.

**Framework:**

Volume | latency | retention | consistency | budget | team skills

**Example:** Ask 'batch or real-time?' before drawing Kafka.

**DE example:** 500 rows/day vs 500M/day — totally different design.

**Common mistake:** One-size-fits-all lakehouse diagram.

**Interview:** Interviewer gives vague prompt.

**Practice:** System Design Practice

### 6. Brainteaser & Puzzle Questions

**Concept:** Less common now — stay calm, think aloud.

**Framework:**

Clarify | estimate | structure | sanity check

**Example:** Fermi estimate: daily YouTube upload storage.

**DE example:** Relate to capacity planning if possible.

**Common mistake:** Saying 'that's irrelevant' dismissively.

**Interview:** How many gas stations in city X?

### 7. Questions You Should Ask

**Concept:** Signals seniority and filters bad roles.

**Framework:**

Team structure | platform ownership | on-call | deploy process | 90-day success | data quality pain

**Example:** 'What breaks most often in prod data today?'

**DE example:** 'How do ADF and Databricks divide orchestration vs transform?'

**Common mistake:** No questions at end.

**Interview:** What would you ask us?

### 8. Company Red Flags

**Concept:** Warning signs during interview loop.

**Framework:**

No staging | hero DE only person | unclear on-call | won't share stack | 24h offer pressure

**Example:** Five 'urgent' roles open — high churn?

**DE example:** Can't explain how pipelines deploy to prod.

**Common mistake:** Ignoring gut feel because of brand name.

**Interview:** What concerns would you research?

### 9. Post-Interview Follow-Up

**Concept:** Professional close and learning loop.

**Framework:**

Thank-you 24h | reference specific discussion | reiterate fit | one page max

**Example:** Thank HM for system design discussion on CDC.

**DE example:** Note questions you missed — add to flashcard review.

**Common mistake:** Generic copy-paste thank-you.

**Interview:** Sent follow-up — no reply?

### 10. Rejection & Feedback

**Concept:** Normal part of process — extract learning.

**Framework:**

Ask once for feedback politely | update weak areas | stay connected on LinkedIn

**Example:** Failed SQL round — drill LeetCode 30 days.

**DE example:** Failed design — redo 5 cases with timer.

**Common mistake:** Arguing with recruiter about decision.

**Interview:** How handle rejection?

### 11. Panel & Loop Fatigue

**Concept:** Onsites are marathons — energy management.

**Framework:**

Water | notes between rounds | consistent stories | don't contradict earlier answers

**Example:** Same STAR story fits multiple questions — vary emphasis.

**DE example:** Round 5 behavioral — still enthusiastic and specific.

**Common mistake:** Contradicting yourself on team size or role.

**Interview:** 6 interviews in one day tips?

### 12. Salary History Questions

**Concept:** Illegal in many jurisdictions — know your rights.

**Framework:**

Redirect to range expectations | 'I'm looking for market rate for this scope'

**Example:** US: many states ban salary history.

**DE example:** India: still common — deflect to expectations.

**Common mistake:** Undercutting yourself with current low pay.

**Interview:** What do you earn now?


