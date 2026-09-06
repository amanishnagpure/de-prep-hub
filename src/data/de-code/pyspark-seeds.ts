import type { PySparkProblemSeed } from "@/lib/de-code/pyspark-seed-types";

/** Auto-generated PySpark judge fixtures — regenerate with: npm run generate:pyspark-seeds */
export const PYSPARK_SEEDS: Record<string, PySparkProblemSeed> = {
  "filter-active-users": {
    "resultVar": "active",
    "referenceCode": "active = df.filter(df.status == 'active')",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Mixed active/inactive",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "active",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      },
      {
        "id": "hidden-all-active",
        "label": "All rows active",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "active",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      },
      {
        "id": "hidden-none-active",
        "label": "No active rows",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "inactive",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      }
    ]
  },
  "daily-event-count": {
    "resultVar": "daily",
    "referenceCode": "daily = df.groupBy('event_date').count()",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Standard aggregation input",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "active",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      },
      {
        "id": "hidden-null-measure",
        "label": "NULL amounts in facts",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "event_date": "2024-01-01",
              "amount": null
            },
            {
              "event_date": "2024-01-01",
              "amount": 10
            },
            {
              "event_date": "2024-01-02",
              "amount": 5
            }
          ],
          "sales": [
            {
              "region": "US",
              "amount": null,
              "category": "A"
            },
            {
              "region": "US",
              "amount": 20,
              "category": "A"
            }
          ]
        }
      },
      {
        "id": "hidden-zero-rows-group",
        "label": "Sparse grouping keys",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "event_date": "2024-01-01",
              "status": "active"
            }
          ],
          "sales": [
            {
              "region": "APAC",
              "amount": 0,
              "category": "Z"
            }
          ]
        }
      },
      {
        "id": "hidden-duplicate-facts",
        "label": "Duplicate fact rows",
        "isHidden": true,
        "tables": {
          "sales": [
            {
              "region": "US",
              "amount": 10,
              "category": "A"
            },
            {
              "region": "US",
              "amount": 10,
              "category": "A"
            }
          ]
        }
      }
    ]
  },
  "join-orders-customers": {
    "resultVar": "joined",
    "referenceCode": "joined = orders.join(customers, on='customer_id', how='inner')",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Matched and unmatched orders",
        "isHidden": false,
        "tables": {
          "orders": [
            {
              "order_id": 1,
              "customer_id": 10,
              "amount": 100,
              "status": "shipped"
            },
            {
              "order_id": 2,
              "customer_id": 20,
              "amount": 50,
              "status": "pending"
            }
          ],
          "customers": [
            {
              "customer_id": 10,
              "name": "Ada",
              "region": "US"
            },
            {
              "customer_id": 20,
              "name": "Bob",
              "region": "EU"
            }
          ]
        }
      },
      {
        "id": "hidden-null-key",
        "label": "NULL join key on order",
        "isHidden": true,
        "tables": {
          "orders": [
            {
              "order_id": 1,
              "customer_id": null,
              "amount": 10,
              "status": "shipped"
            },
            {
              "order_id": 2,
              "customer_id": 10,
              "amount": 20,
              "status": "shipped"
            }
          ],
          "customers": [
            {
              "customer_id": 10,
              "name": "Ada",
              "region": "US"
            },
            {
              "customer_id": 20,
              "name": "Bob",
              "region": "EU"
            }
          ]
        }
      },
      {
        "id": "hidden-duplicate-keys",
        "label": "Duplicate customer_id rows",
        "isHidden": true,
        "tables": {
          "orders": [
            {
              "order_id": 1,
              "customer_id": 10,
              "amount": 10,
              "status": "shipped"
            }
          ],
          "customers": [
            {
              "customer_id": 10,
              "name": "Ada",
              "region": "US"
            },
            {
              "customer_id": 10,
              "name": "Ada-dup",
              "region": "US"
            }
          ]
        }
      },
      {
        "id": "hidden-empty-orders",
        "label": "Empty orders table",
        "isHidden": true,
        "tables": {
          "orders": [],
          "customers": [
            {
              "customer_id": 10,
              "name": "Ada",
              "region": "US"
            },
            {
              "customer_id": 20,
              "name": "Bob",
              "region": "EU"
            }
          ]
        }
      }
    ]
  },
  "dedupe-with-window": {
    "resultVar": "deduped",
    "referenceCode": "from pyspark.sql.window import Window\nfrom pyspark.sql.functions import row_number\nw = Window.partitionBy('user_id').orderBy('event_time')\ndeduped = df.withColumn('rn', row_number().over(w)).filter('rn = 1')",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Normal event stream",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click"
            },
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:05:00",
              "event_type": "click"
            },
            {
              "user_id": 2,
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view"
            }
          ]
        }
      },
      {
        "id": "hidden-dup-ids",
        "label": "Duplicate IDs same timestamp",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click"
            },
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click"
            },
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:00:00",
              "event_type": "view"
            }
          ]
        }
      },
      {
        "id": "hidden-single-partition",
        "label": "Single user many duplicates",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 9,
              "event_time": "2024-01-02T08:00:00",
              "event_type": "purchase"
            },
            {
              "user_id": 9,
              "event_time": "2024-01-02T08:00:00",
              "event_type": "purchase"
            },
            {
              "user_id": 9,
              "event_time": "2024-01-02T09:00:00",
              "event_type": "purchase"
            }
          ]
        }
      }
    ]
  },
  "repartition-before-write": {
    "resultVar": "out",
    "referenceCode": "out = df.repartition(8)",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Standard dataframe",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "active",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      },
      {
        "id": "hidden-small",
        "label": "Small partition count",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "name": "A"
            }
          ]
        }
      },
      {
        "id": "hidden-wide",
        "label": "Wide row set",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "name": "U1",
              "k": "batch"
            },
            {
              "user_id": 2,
              "name": "U2",
              "k": "batch"
            },
            {
              "user_id": 3,
              "name": "U3",
              "k": "batch"
            },
            {
              "user_id": 4,
              "name": "U4",
              "k": "batch"
            },
            {
              "user_id": 5,
              "name": "U5",
              "k": "batch"
            },
            {
              "user_id": 6,
              "name": "U6",
              "k": "batch"
            },
            {
              "user_id": 7,
              "name": "U7",
              "k": "batch"
            },
            {
              "user_id": 8,
              "name": "U8",
              "k": "batch"
            },
            {
              "user_id": 9,
              "name": "U9",
              "k": "batch"
            },
            {
              "user_id": 10,
              "name": "U10",
              "k": "batch"
            },
            {
              "user_id": 11,
              "name": "U11",
              "k": "batch"
            },
            {
              "user_id": 12,
              "name": "U12",
              "k": "batch"
            }
          ]
        }
      }
    ]
  },
  "cache-reused-df": {
    "resultVar": "cached",
    "referenceCode": "cached = df.cache()",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Standard dataframe",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "active",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      },
      {
        "id": "hidden-small",
        "label": "Small partition count",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "name": "A"
            }
          ]
        }
      },
      {
        "id": "hidden-wide",
        "label": "Wide row set",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "name": "U1",
              "k": "batch"
            },
            {
              "user_id": 2,
              "name": "U2",
              "k": "batch"
            },
            {
              "user_id": 3,
              "name": "U3",
              "k": "batch"
            },
            {
              "user_id": 4,
              "name": "U4",
              "k": "batch"
            },
            {
              "user_id": 5,
              "name": "U5",
              "k": "batch"
            },
            {
              "user_id": 6,
              "name": "U6",
              "k": "batch"
            },
            {
              "user_id": 7,
              "name": "U7",
              "k": "batch"
            },
            {
              "user_id": 8,
              "name": "U8",
              "k": "batch"
            },
            {
              "user_id": 9,
              "name": "U9",
              "k": "batch"
            },
            {
              "user_id": 10,
              "name": "U10",
              "k": "batch"
            },
            {
              "user_id": 11,
              "name": "U11",
              "k": "batch"
            },
            {
              "user_id": 12,
              "name": "U12",
              "k": "batch"
            }
          ]
        }
      }
    ]
  },
  "select-column-projection": {
    "resultVar": "projected",
    "referenceCode": "projected = df.select('user_id', 'event_type')",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Mixed active/inactive",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "active",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      },
      {
        "id": "hidden-all-active",
        "label": "All rows active",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "active",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      },
      {
        "id": "hidden-none-active",
        "label": "No active rows",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "inactive",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      }
    ]
  },
  "drop-duplicates-by-key": {
    "resultVar": "unique_users",
    "referenceCode": "unique_users = df.dropDuplicates(['user_id'])",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Normal event stream",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click"
            },
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:05:00",
              "event_type": "click"
            },
            {
              "user_id": 2,
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view"
            }
          ]
        }
      },
      {
        "id": "hidden-dup-ids",
        "label": "Duplicate IDs same timestamp",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click"
            },
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click"
            },
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:00:00",
              "event_type": "view"
            }
          ]
        }
      },
      {
        "id": "hidden-single-partition",
        "label": "Single user many duplicates",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 9,
              "event_time": "2024-01-02T08:00:00",
              "event_type": "purchase"
            },
            {
              "user_id": 9,
              "event_time": "2024-01-02T08:00:00",
              "event_type": "purchase"
            },
            {
              "user_id": 9,
              "event_time": "2024-01-02T09:00:00",
              "event_type": "purchase"
            }
          ]
        }
      }
    ]
  },
  "sum-amount-by-region": {
    "resultVar": "by_region",
    "referenceCode": "by_region = sales.groupBy('region').sum('amount')",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Standard aggregation input",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "active",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ],
          "sales": [
            {
              "region": "US",
              "amount": 100,
              "category": "A"
            },
            {
              "region": "EU",
              "amount": 75,
              "category": "B"
            },
            {
              "region": "US",
              "amount": 25,
              "category": "A"
            }
          ]
        }
      },
      {
        "id": "hidden-null-measure",
        "label": "NULL amounts in facts",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "event_date": "2024-01-01",
              "amount": null
            },
            {
              "event_date": "2024-01-01",
              "amount": 10
            },
            {
              "event_date": "2024-01-02",
              "amount": 5
            }
          ],
          "sales": [
            {
              "region": "US",
              "amount": null,
              "category": "A"
            },
            {
              "region": "US",
              "amount": 20,
              "category": "A"
            }
          ]
        }
      },
      {
        "id": "hidden-zero-rows-group",
        "label": "Sparse grouping keys",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "event_date": "2024-01-01",
              "status": "active"
            }
          ],
          "sales": [
            {
              "region": "APAC",
              "amount": 0,
              "category": "Z"
            }
          ]
        }
      },
      {
        "id": "hidden-duplicate-facts",
        "label": "Duplicate fact rows",
        "isHidden": true,
        "tables": {
          "sales": [
            {
              "region": "US",
              "amount": 10,
              "category": "A"
            },
            {
              "region": "US",
              "amount": 10,
              "category": "A"
            }
          ]
        }
      }
    ]
  },
  "sort-events-desc": {
    "resultVar": "sorted_df",
    "referenceCode": "sorted_df = df.orderBy(df.event_time.desc())",
    "comparison": {
      "schema": true,
      "columnOrder": true,
      "rowOrder": true,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Events to sort",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "event_time": "2024-01-01T12:00:00"
            },
            {
              "user_id": 2,
              "event_time": "2024-01-01T08:00:00"
            },
            {
              "user_id": 3,
              "event_time": "2024-01-01T10:00:00"
            }
          ]
        }
      },
      {
        "id": "hidden-tie-times",
        "label": "Tied timestamps",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:00:00"
            },
            {
              "user_id": 2,
              "event_time": "2024-01-01T10:00:00"
            }
          ]
        }
      },
      {
        "id": "hidden-single-row",
        "label": "Single row input",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:00:00"
            }
          ]
        }
      }
    ]
  },
  "groupby-multiple-keys": {
    "resultVar": "rollup",
    "referenceCode": "rollup = df.groupBy('region', 'category').sum('amount')",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Standard aggregation input",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "active",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      },
      {
        "id": "hidden-null-measure",
        "label": "NULL amounts in facts",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "event_date": "2024-01-01",
              "amount": null
            },
            {
              "event_date": "2024-01-01",
              "amount": 10
            },
            {
              "event_date": "2024-01-02",
              "amount": 5
            }
          ],
          "sales": [
            {
              "region": "US",
              "amount": null,
              "category": "A"
            },
            {
              "region": "US",
              "amount": 20,
              "category": "A"
            }
          ]
        }
      },
      {
        "id": "hidden-zero-rows-group",
        "label": "Sparse grouping keys",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "event_date": "2024-01-01",
              "status": "active"
            }
          ],
          "sales": [
            {
              "region": "APAC",
              "amount": 0,
              "category": "Z"
            }
          ]
        }
      },
      {
        "id": "hidden-duplicate-facts",
        "label": "Duplicate fact rows",
        "isHidden": true,
        "tables": {
          "sales": [
            {
              "region": "US",
              "amount": 10,
              "category": "A"
            },
            {
              "region": "US",
              "amount": 10,
              "category": "A"
            }
          ]
        }
      }
    ]
  },
  "withcolumn-derived": {
    "resultVar": "enriched",
    "referenceCode": "enriched = df.withColumn('amount_usd', df.amount * df.fx_rate)",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "active",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      },
      {
        "id": "hidden-edge",
        "label": "Hidden edge case",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "amount": 0
            }
          ]
        }
      },
      {
        "id": "hidden-nulls",
        "label": "Hidden NULL values",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": null,
              "event_date": null,
              "amount": null,
              "name": null
            }
          ]
        }
      }
    ]
  },
  "filter-amount-threshold": {
    "resultVar": "filtered",
    "referenceCode": "filtered = df.filter(df.amount > 100)",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Mixed active/inactive",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "active",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      },
      {
        "id": "hidden-all-active",
        "label": "All rows active",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "active",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      },
      {
        "id": "hidden-none-active",
        "label": "No active rows",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "inactive",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      }
    ]
  },
  "select-rename-columns": {
    "resultVar": "renamed",
    "referenceCode": "renamed = df.select(df.user_id.alias('id'))",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Mixed active/inactive",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "active",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      },
      {
        "id": "hidden-all-active",
        "label": "All rows active",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "active",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      },
      {
        "id": "hidden-none-active",
        "label": "No active rows",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "inactive",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      }
    ]
  },
  "distinct-event-types": {
    "resultVar": "types",
    "referenceCode": "types = df.select('event_type').distinct()",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "active",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      },
      {
        "id": "hidden-edge",
        "label": "Hidden edge case",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "amount": 0
            }
          ]
        }
      },
      {
        "id": "hidden-nulls",
        "label": "Hidden NULL values",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": null,
              "event_date": null,
              "amount": null,
              "name": null
            }
          ]
        }
      }
    ]
  },
  "count-by-status": {
    "resultVar": "counts",
    "referenceCode": "counts = df.groupBy('status').count()",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Standard aggregation input",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "active",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      },
      {
        "id": "hidden-null-measure",
        "label": "NULL amounts in facts",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "event_date": "2024-01-01",
              "amount": null
            },
            {
              "event_date": "2024-01-01",
              "amount": 10
            },
            {
              "event_date": "2024-01-02",
              "amount": 5
            }
          ],
          "sales": [
            {
              "region": "US",
              "amount": null,
              "category": "A"
            },
            {
              "region": "US",
              "amount": 20,
              "category": "A"
            }
          ]
        }
      },
      {
        "id": "hidden-zero-rows-group",
        "label": "Sparse grouping keys",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "event_date": "2024-01-01",
              "status": "active"
            }
          ],
          "sales": [
            {
              "region": "APAC",
              "amount": 0,
              "category": "Z"
            }
          ]
        }
      },
      {
        "id": "hidden-duplicate-facts",
        "label": "Duplicate fact rows",
        "isHidden": true,
        "tables": {
          "sales": [
            {
              "region": "US",
              "amount": 10,
              "category": "A"
            },
            {
              "region": "US",
              "amount": 10,
              "category": "A"
            }
          ]
        }
      }
    ]
  },
  "left-join-orders": {
    "resultVar": "joined",
    "referenceCode": "joined = orders.join(customers, on='customer_id', how='left')",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Matched and unmatched orders",
        "isHidden": false,
        "tables": {
          "orders": [
            {
              "order_id": 1,
              "customer_id": 10,
              "amount": 100,
              "status": "shipped"
            },
            {
              "order_id": 2,
              "customer_id": 20,
              "amount": 50,
              "status": "pending"
            }
          ],
          "customers": [
            {
              "customer_id": 10,
              "name": "Ada",
              "region": "US"
            },
            {
              "customer_id": 20,
              "name": "Bob",
              "region": "EU"
            }
          ]
        }
      },
      {
        "id": "hidden-null-key",
        "label": "NULL join key on order",
        "isHidden": true,
        "tables": {
          "orders": [
            {
              "order_id": 1,
              "customer_id": null,
              "amount": 10,
              "status": "shipped"
            },
            {
              "order_id": 2,
              "customer_id": 10,
              "amount": 20,
              "status": "shipped"
            }
          ],
          "customers": [
            {
              "customer_id": 10,
              "name": "Ada",
              "region": "US"
            },
            {
              "customer_id": 20,
              "name": "Bob",
              "region": "EU"
            }
          ]
        }
      },
      {
        "id": "hidden-duplicate-keys",
        "label": "Duplicate customer_id rows",
        "isHidden": true,
        "tables": {
          "orders": [
            {
              "order_id": 1,
              "customer_id": 10,
              "amount": 10,
              "status": "shipped"
            }
          ],
          "customers": [
            {
              "customer_id": 10,
              "name": "Ada",
              "region": "US"
            },
            {
              "customer_id": 10,
              "name": "Ada-dup",
              "region": "US"
            }
          ]
        }
      },
      {
        "id": "hidden-empty-orders",
        "label": "Empty orders table",
        "isHidden": true,
        "tables": {
          "orders": [],
          "customers": [
            {
              "customer_id": 10,
              "name": "Ada",
              "region": "US"
            },
            {
              "customer_id": 20,
              "name": "Bob",
              "region": "EU"
            }
          ]
        }
      }
    ]
  },
  "window-rank-events": {
    "resultVar": "w",
    "referenceCode": "from pyspark.sql.window import Window\nfrom pyspark.sql.functions import rank\nw=Window.partitionBy('user_id').orderBy(df.event_time.desc())\nranked = df.withColumn('rk', rank().over(w))",
    "comparison": {
      "schema": true,
      "columnOrder": true,
      "rowOrder": true,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Events to sort",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "event_time": "2024-01-01T12:00:00"
            },
            {
              "user_id": 2,
              "event_time": "2024-01-01T08:00:00"
            },
            {
              "user_id": 3,
              "event_time": "2024-01-01T10:00:00"
            }
          ]
        }
      },
      {
        "id": "hidden-tie-times",
        "label": "Tied timestamps",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:00:00"
            },
            {
              "user_id": 2,
              "event_time": "2024-01-01T10:00:00"
            }
          ]
        }
      },
      {
        "id": "hidden-single-row",
        "label": "Single row input",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:00:00"
            }
          ]
        }
      }
    ]
  },
  "coalesce-partitions": {
    "resultVar": "out",
    "referenceCode": "out = df.coalesce(4)",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Standard dataframe",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "active",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      },
      {
        "id": "hidden-small",
        "label": "Small partition count",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "name": "A"
            }
          ]
        }
      },
      {
        "id": "hidden-wide",
        "label": "Wide row set",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "name": "U1",
              "k": "batch"
            },
            {
              "user_id": 2,
              "name": "U2",
              "k": "batch"
            },
            {
              "user_id": 3,
              "name": "U3",
              "k": "batch"
            },
            {
              "user_id": 4,
              "name": "U4",
              "k": "batch"
            },
            {
              "user_id": 5,
              "name": "U5",
              "k": "batch"
            },
            {
              "user_id": 6,
              "name": "U6",
              "k": "batch"
            },
            {
              "user_id": 7,
              "name": "U7",
              "k": "batch"
            },
            {
              "user_id": 8,
              "name": "U8",
              "k": "batch"
            },
            {
              "user_id": 9,
              "name": "U9",
              "k": "batch"
            },
            {
              "user_id": 10,
              "name": "U10",
              "k": "batch"
            },
            {
              "user_id": 11,
              "name": "U11",
              "k": "batch"
            },
            {
              "user_id": 12,
              "name": "U12",
              "k": "batch"
            }
          ]
        }
      }
    ]
  },
  "persist-df": {
    "resultVar": "cached",
    "referenceCode": "cached = df.persist()",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Standard dataframe",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "active",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      },
      {
        "id": "hidden-small",
        "label": "Small partition count",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "name": "A"
            }
          ]
        }
      },
      {
        "id": "hidden-wide",
        "label": "Wide row set",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "name": "U1",
              "k": "batch"
            },
            {
              "user_id": 2,
              "name": "U2",
              "k": "batch"
            },
            {
              "user_id": 3,
              "name": "U3",
              "k": "batch"
            },
            {
              "user_id": 4,
              "name": "U4",
              "k": "batch"
            },
            {
              "user_id": 5,
              "name": "U5",
              "k": "batch"
            },
            {
              "user_id": 6,
              "name": "U6",
              "k": "batch"
            },
            {
              "user_id": 7,
              "name": "U7",
              "k": "batch"
            },
            {
              "user_id": 8,
              "name": "U8",
              "k": "batch"
            },
            {
              "user_id": 9,
              "name": "U9",
              "k": "batch"
            },
            {
              "user_id": 10,
              "name": "U10",
              "k": "batch"
            },
            {
              "user_id": 11,
              "name": "U11",
              "k": "batch"
            },
            {
              "user_id": 12,
              "name": "U12",
              "k": "batch"
            }
          ]
        }
      }
    ]
  },
  "withcolumn-upper-name": {
    "resultVar": "enriched",
    "referenceCode": "enriched = df.withColumn('name_upper', df.name.upper())",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "active",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      },
      {
        "id": "hidden-edge",
        "label": "Hidden edge case",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "amount": 0
            }
          ]
        }
      },
      {
        "id": "hidden-nulls",
        "label": "Hidden NULL values",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": null,
              "event_date": null,
              "amount": null,
              "name": null
            }
          ]
        }
      }
    ]
  },
  "spark-drill-10": {
    "resultVar": "out_0",
    "referenceCode": "out_0 = df.groupBy('k').count()",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Standard aggregation input",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "active",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      },
      {
        "id": "hidden-null-measure",
        "label": "NULL amounts in facts",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "event_date": "2024-01-01",
              "amount": null
            },
            {
              "event_date": "2024-01-01",
              "amount": 10
            },
            {
              "event_date": "2024-01-02",
              "amount": 5
            }
          ],
          "sales": [
            {
              "region": "US",
              "amount": null,
              "category": "A"
            },
            {
              "region": "US",
              "amount": 20,
              "category": "A"
            }
          ]
        }
      },
      {
        "id": "hidden-zero-rows-group",
        "label": "Sparse grouping keys",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "event_date": "2024-01-01",
              "status": "active"
            }
          ],
          "sales": [
            {
              "region": "APAC",
              "amount": 0,
              "category": "Z"
            }
          ]
        }
      },
      {
        "id": "hidden-duplicate-facts",
        "label": "Duplicate fact rows",
        "isHidden": true,
        "tables": {
          "sales": [
            {
              "region": "US",
              "amount": 10,
              "category": "A"
            },
            {
              "region": "US",
              "amount": 10,
              "category": "A"
            }
          ]
        }
      }
    ]
  },
  "spark-drill-11": {
    "resultVar": "out_1",
    "referenceCode": "out_1 = df.groupBy('k').count()",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Standard aggregation input",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "active",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      },
      {
        "id": "hidden-null-measure",
        "label": "NULL amounts in facts",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "event_date": "2024-01-01",
              "amount": null
            },
            {
              "event_date": "2024-01-01",
              "amount": 10
            },
            {
              "event_date": "2024-01-02",
              "amount": 5
            }
          ],
          "sales": [
            {
              "region": "US",
              "amount": null,
              "category": "A"
            },
            {
              "region": "US",
              "amount": 20,
              "category": "A"
            }
          ]
        }
      },
      {
        "id": "hidden-zero-rows-group",
        "label": "Sparse grouping keys",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "event_date": "2024-01-01",
              "status": "active"
            }
          ],
          "sales": [
            {
              "region": "APAC",
              "amount": 0,
              "category": "Z"
            }
          ]
        }
      },
      {
        "id": "hidden-duplicate-facts",
        "label": "Duplicate fact rows",
        "isHidden": true,
        "tables": {
          "sales": [
            {
              "region": "US",
              "amount": 10,
              "category": "A"
            },
            {
              "region": "US",
              "amount": 10,
              "category": "A"
            }
          ]
        }
      }
    ]
  },
  "spark-drill-12": {
    "resultVar": "out_2",
    "referenceCode": "out_2 = df.groupBy('k').count()",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Normal event stream",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click"
            },
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:05:00",
              "event_type": "click"
            },
            {
              "user_id": 2,
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view"
            }
          ]
        }
      },
      {
        "id": "hidden-dup-ids",
        "label": "Duplicate IDs same timestamp",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click"
            },
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click"
            },
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:00:00",
              "event_type": "view"
            }
          ]
        }
      },
      {
        "id": "hidden-single-partition",
        "label": "Single user many duplicates",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 9,
              "event_time": "2024-01-02T08:00:00",
              "event_type": "purchase"
            },
            {
              "user_id": 9,
              "event_time": "2024-01-02T08:00:00",
              "event_type": "purchase"
            },
            {
              "user_id": 9,
              "event_time": "2024-01-02T09:00:00",
              "event_type": "purchase"
            }
          ]
        }
      }
    ]
  },
  "spark-drill-13": {
    "resultVar": "out_3",
    "referenceCode": "out_3 = df.groupBy('k').count()",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Normal event stream",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click"
            },
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:05:00",
              "event_type": "click"
            },
            {
              "user_id": 2,
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view"
            }
          ]
        }
      },
      {
        "id": "hidden-dup-ids",
        "label": "Duplicate IDs same timestamp",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click"
            },
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click"
            },
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:00:00",
              "event_type": "view"
            }
          ]
        }
      },
      {
        "id": "hidden-single-partition",
        "label": "Single user many duplicates",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 9,
              "event_time": "2024-01-02T08:00:00",
              "event_type": "purchase"
            },
            {
              "user_id": 9,
              "event_time": "2024-01-02T08:00:00",
              "event_type": "purchase"
            },
            {
              "user_id": 9,
              "event_time": "2024-01-02T09:00:00",
              "event_type": "purchase"
            }
          ]
        }
      }
    ]
  },
  "spark-drill-14": {
    "resultVar": "out_4",
    "referenceCode": "out_4 = df.groupBy('k').count()",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Normal event stream",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click"
            },
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:05:00",
              "event_type": "click"
            },
            {
              "user_id": 2,
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view"
            }
          ]
        }
      },
      {
        "id": "hidden-dup-ids",
        "label": "Duplicate IDs same timestamp",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click"
            },
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click"
            },
            {
              "user_id": 1,
              "event_time": "2024-01-01T10:00:00",
              "event_type": "view"
            }
          ]
        }
      },
      {
        "id": "hidden-single-partition",
        "label": "Single user many duplicates",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 9,
              "event_time": "2024-01-02T08:00:00",
              "event_type": "purchase"
            },
            {
              "user_id": 9,
              "event_time": "2024-01-02T08:00:00",
              "event_type": "purchase"
            },
            {
              "user_id": 9,
              "event_time": "2024-01-02T09:00:00",
              "event_type": "purchase"
            }
          ]
        }
      }
    ]
  },
  "spark-drill-15": {
    "resultVar": "out_5",
    "referenceCode": "out_5 = df.groupBy('k').count()",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Standard aggregation input",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "active",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      },
      {
        "id": "hidden-null-measure",
        "label": "NULL amounts in facts",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "event_date": "2024-01-01",
              "amount": null
            },
            {
              "event_date": "2024-01-01",
              "amount": 10
            },
            {
              "event_date": "2024-01-02",
              "amount": 5
            }
          ],
          "sales": [
            {
              "region": "US",
              "amount": null,
              "category": "A"
            },
            {
              "region": "US",
              "amount": 20,
              "category": "A"
            }
          ]
        }
      },
      {
        "id": "hidden-zero-rows-group",
        "label": "Sparse grouping keys",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "event_date": "2024-01-01",
              "status": "active"
            }
          ],
          "sales": [
            {
              "region": "APAC",
              "amount": 0,
              "category": "Z"
            }
          ]
        }
      },
      {
        "id": "hidden-duplicate-facts",
        "label": "Duplicate fact rows",
        "isHidden": true,
        "tables": {
          "sales": [
            {
              "region": "US",
              "amount": 10,
              "category": "A"
            },
            {
              "region": "US",
              "amount": 10,
              "category": "A"
            }
          ]
        }
      }
    ]
  },
  "spark-drill-16": {
    "resultVar": "out_6",
    "referenceCode": "out_6 = df.groupBy('k').count()",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "active",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      },
      {
        "id": "hidden-edge",
        "label": "Hidden edge case",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "amount": 0
            }
          ]
        }
      },
      {
        "id": "hidden-nulls",
        "label": "Hidden NULL values",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": null,
              "event_date": null,
              "amount": null,
              "name": null
            }
          ]
        }
      }
    ]
  },
  "spark-drill-17": {
    "resultVar": "out_7",
    "referenceCode": "out_7 = df.groupBy('k').count()",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Mixed active/inactive",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "active",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      },
      {
        "id": "hidden-all-active",
        "label": "All rows active",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "active",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      },
      {
        "id": "hidden-none-active",
        "label": "No active rows",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "inactive",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      }
    ]
  },
  "spark-drill-18": {
    "resultVar": "out_8",
    "referenceCode": "out_8 = df.groupBy('k').count()",
    "comparison": {
      "schema": true,
      "columnOrder": false,
      "rowOrder": false,
      "allowExtraColumns": false,
      "ignoreColumnCase": true
    },
    "limits": {
      "timeLimitMs": 2000,
      "maxInputRows": 5000,
      "maxOutputRows": 10000
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "event_id": "e1",
              "event_time": "2024-01-01T10:00:00",
              "event_type": "click",
              "name": "Alice",
              "amount": 150,
              "fx_rate": 1.1,
              "region": "US",
              "category": "A",
              "k": "x"
            },
            {
              "user_id": 2,
              "status": "inactive",
              "event_date": "2024-01-01",
              "event_id": "e2",
              "event_time": "2024-01-01T11:00:00",
              "event_type": "view",
              "name": "Bob",
              "amount": 50,
              "fx_rate": 1,
              "region": "EU",
              "category": "B",
              "k": "x"
            },
            {
              "user_id": 3,
              "status": "active",
              "event_date": "2024-01-02",
              "event_id": "e3",
              "event_time": "2024-01-02T09:00:00",
              "event_type": "click",
              "name": "Carol",
              "amount": 200,
              "fx_rate": 1.2,
              "region": "US",
              "category": "A",
              "k": "y"
            }
          ]
        }
      },
      {
        "id": "hidden-edge",
        "label": "Hidden edge case",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": "active",
              "event_date": "2024-01-01",
              "amount": 0
            }
          ]
        }
      },
      {
        "id": "hidden-nulls",
        "label": "Hidden NULL values",
        "isHidden": true,
        "tables": {
          "df": [
            {
              "user_id": 1,
              "status": null,
              "event_date": null,
              "amount": null,
              "name": null
            }
          ]
        }
      }
    ]
  }
};

export function getPySparkSeed(slug: string): PySparkProblemSeed | null {
  return PYSPARK_SEEDS[slug] ?? null;
}

export function hasPySparkSeed(slug: string): boolean {
  return slug in PYSPARK_SEEDS;
}
