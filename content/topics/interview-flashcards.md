---
title: Interview Flashcards
description: 60 flashcards for behavioral, technical, and DE role interviews
parent: interview
hidden: true
order: 3
difficulty: interview
---

# Interview Flashcards

### 1. What is the STAR method?

**Situation, Task, Action, Result** — a structure for behavioral answers. Keeps responses focused and impact-driven. Aim for 90–120 seconds per story.

### 2. How long should a behavioral answer be?

Roughly **90–120 seconds**. Situation/Task brief; Action detailed with "I"; Result quantified. Practice with a timer.

### 3. What makes a strong STAR result?

**Numbers**: time saved, cost reduced, incidents prevented, users/tables/rows affected. Tie to business outcome, not just technical completion.

### 4. "Tell me about yourself" structure?

Present → past (2–3 relevant roles) → why this role/company → 60–90 seconds total. End with why you're here today.

### 5. Why do you want this DE role?

Connect your stack experience (Azure, Spark, SQL) to their problems. Mention specific product/mission if researched. Avoid generic "I love data."

### 6. Greatest strength for DE interviews?

Pick one with proof: e.g. "Shipping reliable pipelines — reduced MTTR 48h→2h at [company]." Match to job description keywords.

### 7. Greatest weakness — safe answer?

Real but non-fatal weakness + active improvement. Example: "I used to over-engineer; now I timebox POCs and ship MVPs first."

### 8. Tell me about a conflict at work.

Use STAR. Focus on **data-driven resolution**, not winning. Show empathy and documented outcome (ADR, compromise).

### 9. Tell me about a failure.

Own it. Describe fix + systemic prevention (monitoring, tests, runbooks). No blaming others or tools.

### 10. Tell me about leading without authority.

Influence via POC, demos, documentation. DE example: drove dbt adoption, CI/CD for notebooks, or metrics catalog.

### 11. How do you handle ambiguity?

Clarify requirements, propose MVP, iterate. Example: scoped "real-time 360" to 5 sources and 15-min latency first.

### 12. Describe a tight deadline you met.

Show **prioritization** (MoSCoW), communication cadence, scope trade-offs. Quantify what shipped vs deferred.

### 13. How do you work with non-technical stakeholders?

Analogies, visuals, no jargon. Confirm understanding. Example: explained PII masking to legal for GDPR audit.

### 14. Tell me about mentoring someone.

Pair programming, templates, constructive PR feedback. Show their growth outcome (solo ownership, promotion).

### 15. How do you prioritize competing requests?

Impact vs effort matrix, align with product/engineering goals, communicate trade-offs to requesters in writing.

### 16. Walk me through a pipeline you built end-to-end.

Source → ingest (ADF/Event Hubs) → bronze Delta → transform (Spark/dbt) → gold → consumption (Synapse/BI). Mention scale and your ownership.

### 17. Describe a data quality issue you fixed.

STAR: discovery (reconciliation), root cause (dedup logic, schema drift), fix (replay, DQ checks), business impact prevented.

### 18. Tell me about optimizing a slow job.

Profile → identify skew/broadcast issues → partition/Z-order/right-size cluster. Give before/after runtime and cost.

### 19. Migration story for interviews?

On-prem to Azure: scope, parallel run, validation, cutover. Quantify pipelines moved and downtime avoided.

### 20. Tool adoption story?

Champion + pilot project + demo. Skeptic buy-in through pairing. Adoption metrics (80% on dbt in 3 months).

### 21. Batch vs streaming — when to use each?

**Batch**: daily/hourly reports, large transforms, cost-sensitive. **Streaming**: fraud, alerts, sub-minute dashboards. Hybrid common (micro-batch).

### 22. What is medallion architecture?

**Bronze** (raw), **silver** (cleaned/conformed), **gold** (business aggregates). Delta Lake typical on Azure. Enables replay and lineage.

### 23. How do you handle late-arriving data?

Watermarks in streaming; partition overwrite or MERGE in batch; sliding window aggregations; document SLA vs completeness trade-off.

### 24. Explain SCD Type 1 vs Type 2.

**Type 1**: overwrite, no history. **Type 2**: new row with effective dates, current flag. DE: customer address changes for analytics.

### 25. How do you deduplicate events?

Primary key + MERGE in Delta; window ROW_NUMBER() keep latest; idempotent writes with event_id. At-least-once + dedup common.

### 26. What is data skew in Spark?

Uneven partition sizes → stragglers. Fixes: salting, broadcast small table, repartition, AQE (Adaptive Query Execution).

### 27. How do you ensure data quality?

Expectations at ingest (row counts, null checks), dbt tests, Great Expectations, reconciliation reports, alerting on anomalies.

### 28. Design a clickstream pipeline (high level).

Event Hubs → bronze JSON/Delta → sessionize in Spark → aggregate to gold → serve via Synapse/Power BI. Ask volume and latency first.

### 29. What is idempotency in pipelines?

Re-running produces same result — no duplicate rows. MERGE, overwrite partition, deterministic keys. Critical for backfills.

### 30. CAP theorem — relevance to DE?

Consistency vs availability in distributed systems. Eventual consistency common in lakes; choose per use case (finance vs logs).

### 31. OLTP vs OLAP?

**OLTP**: row-oriented, transactional. **OLAP**: columnar, analytical. DE moves OLTP → lake/warehouse for analytics.

### 32. Star schema vs snowflake?

**Star**: denormalized dimensions, faster queries. **Snowflake**: normalized dims, less storage. Star common in marts.

### 33. What is a data lake vs warehouse?

**Lake**: cheap storage (ADLS), schema-on-read, raw + curated. **Warehouse**: Synapse/BigQuery, optimized SQL, governance. Lakehouse merges both (Delta).

### 34. Partitioning strategy for fact tables?

Usually **date** (daily/monthly). Enables partition pruning. Avoid too many small files — compaction/OPTIMIZE.

### 35. How do you handle schema evolution?

Delta `mergeSchema`, explicit schema registry, contract tests, reject/quarantine bad records, versioned Avro/Protobuf for streams.

### 36. Resume bullet formula?

**Action verb + what + tech + metric**. "Built 12 ADF pipelines ingesting 5M events/day, cutting latency T+2→T+0."

### 37. What to put in DE resume skills?

Group: Languages (Python, SQL), Cloud (Azure, AWS), Orchestration (ADF, Airflow), Storage (ADLS, Delta), Warehouses (Synapse, Snowflake), Tools (dbt, Spark).

### 38. How many resume pages?

**One page** for &lt;10 years. Two only if very senior with major publications/patents. Every line must earn its space.

### 39. Should I list every tool I've touched?

No — list what you can **discuss deeply** in interview. Depth beats breadth. Match job description honestly.

### 40. GitHub for DE interviews?

1–2 end-to-end projects with README architecture diagram. Sample data only. Pin best repo. Quality over quantity.

### 41. How to explain employment gap?

Honest, brief: upskilling (certs), family, contract end. Pivot to what you learned and readiness now.

### 42. Certifications worth mentioning?

**Azure DP-203**, Azure Fundamentals, Databricks associate. List if relevant; not substitute for experience.

### 43. System design — first 5 minutes?

**Clarify requirements**: volume, latency, retention, consumers, budget. Draw high-level flow. Don't dive deep without scope.

### 44. System design — what interviewers score?

Structured thinking, trade-off articulation, scalability basics, observability, familiarity with real components — not perfect diagrams.

### 45. How to discuss cost in design?

Mention storage tier (hot/cool), cluster auto-termination, partition pruning, batch vs always-on streaming. Shows production maturity.

### 46. Observability in data platforms?

Pipeline success/failure alerts, row-count SLAs, freshness dashboards, lineage (Purview), incident runbooks, data quality metrics.

### 47. When recruiter asks expected salary?

Deflect early: focus on fit; discuss comp after mutual interest. Research range beforehand; give range not single number if pressed.

### 48. How to negotiate an offer?

Thank them, state research-based target, ask flexibility on base/sign-on/equity. Never bluff competing offers. Get it in writing.

### 49. What is total compensation?

Base + annual bonus + equity (RSUs/options) + benefits (401k match, health). Compare TC not base alone.

### 50. Sign-on bonus clawback?

Often must repay if you leave within 12 months. Read offer letter. Factor into job-hopping decisions.

### 51. What does an Azure DE do day-to-day?

Build/maintain ADF pipelines, Databricks notebooks/jobs, ADLS/Delta lakes, Synapse models, data quality, on-call for pipeline failures.

### 52. ADF vs Databricks — when to use which?

**ADF**: orchestration, copy activities, scheduling, lightweight transforms. **Databricks**: heavy Spark, ML, complex transforms, Delta operations.

### 53. What is Azure Data Lake Storage Gen2?

Hierarchical namespace on blob storage. ADLS Gen2 + Delta = common Azure lakehouse pattern. RBAC + ACLs for security.

### 54. What is Microsoft Purview?

Data governance catalog — lineage, classification, discovery across Azure/on-prem. Mention in governance interview answers.

### 55. DP-203 exam relevance?

Azure Data Engineer cert covers ADF, Synapse, Databricks basics, security. Good signal for Azure-focused roles; discuss practical experience too.

### 56. On-call for data engineers?

Monitor pipeline failures, freshness SLAs, cost spikes. Runbooks, escalation paths, blameless postmortems. Ask team about rotation in interview.

### 57. DE vs analytics engineer?

**DE**: pipelines, infrastructure, scale, reliability. **AE**: transforms in warehouse (dbt), metrics, closer to analysts. Overlap increasing.

### 58. How to answer "experience with X" when you don't have it?

Honest gap + adjacent experience + learning plan. "I used Airflow; ADF concepts map — triggers, dependencies, I'd ramp in weeks."

### 59. Take-home assignment red flags?

&gt;4–6 hours unpaid, production credentials required, no NDA, vague scope. Ask to scope down or decline professionally.

### 60. Best questions to ask interviewer?

Team structure, biggest data pain, deploy/test process, 90-day success, on-call expectations. Shows seniority and filters bad fits.
