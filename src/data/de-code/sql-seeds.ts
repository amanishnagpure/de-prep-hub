import type { SqlPracticeSeed } from "@/data/sql-practice-problem-seeds";
import { fixtureToInitSql } from "@/lib/practice-platform/judge/sql-fixture-ddl";
import {
  getSqlMultiFixtureSeed,
  hasSqlMultiFixtureSeed,
  SQL_MULTI_FIXTURES,
} from "./sql-multi-fixtures";

function multiToLegacySeed(slug: string): SqlPracticeSeed | null {
  const multi = getSqlMultiFixtureSeed(slug);
  if (!multi) return null;
  const pub = multi.fixtures.find((f) => !f.isHidden) ?? multi.fixtures[0];
  return {
    init: pub.initSql ?? fixtureToInitSql(pub, multi.tables),
    referenceQuery: multi.referenceQuery,
    tables: multi.tables,
    allowMutations: multi.allowMutations,
  };
}

export function getDeCodeSqlSeed(slug: string): SqlPracticeSeed | null {
  return multiToLegacySeed(slug);
}

export function getDeCodeSqlSchemas(slug: string) {
  return getSqlMultiFixtureSeed(slug)?.tables ?? [];
}

export function hasDeCodeSqlSeed(slug: string): boolean {
  return hasSqlMultiFixtureSeed(slug);
}

export { SQL_MULTI_FIXTURES };
