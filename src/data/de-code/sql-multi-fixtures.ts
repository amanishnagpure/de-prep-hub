import type { SqlProblemSeed } from "@/lib/de-code/sql-seed-types";

/** Auto-generated SQL multi-fixture seeds — regenerate: npm run generate:sql-fixtures */
export const SQL_MULTI_FIXTURES: Record<string, SqlProblemSeed> = {
  "filter-active-employees": {
    "referenceQuery": "SELECT employee_id, full_name\nFROM employees\nWHERE department = 'Engineering' AND status = 'active';",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Mixed departments and statuses",
        "isHidden": false,
        "tables": {
          "employees": [
            {
              "employee_id": 1,
              "full_name": "Alice",
              "department": "Engineering",
              "status": "active",
              "salary": 90000
            },
            {
              "employee_id": 2,
              "full_name": "Bob",
              "department": "Engineering",
              "status": "active",
              "salary": 85000
            },
            {
              "employee_id": 3,
              "full_name": "Carol",
              "department": "Sales",
              "status": "active",
              "salary": 70000
            },
            {
              "employee_id": 4,
              "full_name": "Dan",
              "department": "Engineering",
              "status": "inactive",
              "salary": 80000
            }
          ]
        }
      },
      {
        "id": "hidden-all-inactive-eng",
        "label": "All Engineering inactive",
        "isHidden": true,
        "tables": {
          "employees": [
            {
              "employee_id": 1,
              "full_name": "Alice",
              "department": "Engineering",
              "status": "inactive",
              "salary": 90000
            },
            {
              "employee_id": 2,
              "full_name": "Bob",
              "department": "Engineering",
              "status": "inactive",
              "salary": 85000
            }
          ]
        }
      },
      {
        "id": "hidden-empty-result",
        "label": "No active Engineering rows",
        "isHidden": true,
        "tables": {
          "employees": [
            {
              "employee_id": 1,
              "full_name": "Carol",
              "department": "Sales",
              "status": "active",
              "salary": 70000
            }
          ]
        }
      }
    ]
  },
  "department-headcount": {
    "referenceQuery": "SELECT department, COUNT(*) AS headcount\nFROM employees\nWHERE status = 'active'\nGROUP BY department;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES\n (1,'Alice','Engineering','active',90000),\n (2,'Bob','Sales','active',70000),\n (3,'Carol','Sales','active',72000),\n (4,'Dan','HR','inactive',60000);"
      },
      {
        "id": "hidden-empty-employees",
        "label": "Empty employee table",
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);",
        "isHidden": true
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES\n (1,'Alice','Engineering','active',90000),\n (2,'Bob','Sales','active',70000),\n (3,'Carol','Sales','active',72000),\n (4,'Dan','HR','inactive',60000);"
      }
    ]
  },
  "top-salary-per-department": {
    "referenceQuery": "SELECT department, full_name, salary\nFROM (\n  SELECT *, RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rk\n  FROM employees WHERE status = 'active'\n) x WHERE rk = 1;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Clear top salary per dept",
        "isHidden": false,
        "tables": {
          "employees": [
            {
              "employee_id": 1,
              "full_name": "Alice",
              "department": "Eng",
              "status": "active",
              "salary": 100
            },
            {
              "employee_id": 2,
              "full_name": "Bob",
              "department": "Eng",
              "status": "active",
              "salary": 100
            },
            {
              "employee_id": 3,
              "full_name": "Carol",
              "department": "Sales",
              "status": "active",
              "salary": 80
            }
          ]
        }
      },
      {
        "id": "hidden-salary-ties",
        "label": "Tied top salaries in department",
        "isHidden": true,
        "tables": {
          "employees": [
            {
              "employee_id": 1,
              "full_name": "A",
              "department": "Eng",
              "status": "active",
              "salary": 100
            },
            {
              "employee_id": 2,
              "full_name": "B",
              "department": "Eng",
              "status": "active",
              "salary": 100
            },
            {
              "employee_id": 3,
              "full_name": "C",
              "department": "Eng",
              "status": "active",
              "salary": 90
            }
          ]
        }
      },
      {
        "id": "hidden-single-row-dept",
        "label": "Single employee per department",
        "isHidden": true,
        "tables": {
          "employees": [
            {
              "employee_id": 1,
              "full_name": "Solo",
              "department": "Eng",
              "status": "active",
              "salary": 50
            }
          ]
        }
      }
    ]
  },
  "monthly-revenue-trend": {
    "referenceQuery": "SELECT strftime('%Y-%m', order_date) AS month, SUM(amount) AS total_revenue\nFROM orders GROUP BY 1 ORDER BY 1;",
    "tables": [
      {
        "label": "orders",
        "description": "Order facts",
        "columns": [
          {
            "name": "order_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "amount",
            "type": "INT"
          },
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE orders (order_id INT, order_date TEXT, amount INT);\nINSERT INTO orders VALUES (1,'2024-01-15',100),(2,'2024-01-20',50),(3,'2024-02-01',200);"
      },
      {
        "id": "hidden-null-amounts",
        "label": "NULL measure values",
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,NULL,'2024-01-01','shipped'),(2,1,100,'2024-01-01','shipped');",
        "isHidden": true
      },
      {
        "id": "hidden-duplicate-facts",
        "label": "Duplicate fact rows",
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,'2024-01-01','shipped'),(1,1,10,'2024-01-01','shipped'),(2,2,20,'2024-01-02','shipped');",
        "isHidden": true
      }
    ]
  },
  "dedupe-click-events": {
    "referenceQuery": "SELECT user_id, event_type, session_id, event_time\nFROM (\n  SELECT *, ROW_NUMBER() OVER (\n    PARTITION BY user_id, event_type, session_id ORDER BY event_time\n  ) AS rn FROM click_events\n) x WHERE rn = 1;",
    "tables": [
      {
        "label": "click_events",
        "description": "Click events",
        "columns": [
          {
            "name": "user_id",
            "type": "INT"
          },
          {
            "name": "event_type",
            "type": "TEXT"
          },
          {
            "name": "session_id",
            "type": "TEXT"
          },
          {
            "name": "event_time",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE click_events (user_id INT, event_type TEXT, session_id TEXT, event_time TEXT);\nINSERT INTO click_events VALUES\n (1,'click','s1','2024-01-01 10:00'),(1,'click','s1','2024-01-01 10:01'),(2,'view','s2','2024-01-01 11:00');"
      },
      {
        "id": "hidden-identical-timestamp",
        "label": "Duplicate rows same timestamp",
        "initSql": "CREATE TABLE click_events (user_id INT, event_type TEXT, session_id TEXT, event_time TEXT);\nINSERT INTO click_events VALUES (1,'click','s1','2024-01-01 10:00'),(1,'click','s1','2024-01-01 10:00');",
        "isHidden": true
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE click_events (user_id INT, event_type TEXT, session_id TEXT, event_time TEXT);\nINSERT INTO click_events VALUES\n (1,'click','s1','2024-01-01 10:00'),(1,'click','s1','2024-01-01 10:01'),(2,'view','s2','2024-01-01 11:00');"
      }
    ]
  },
  "running-revenue-total": {
    "referenceQuery": "SELECT order_date,\n  SUM(amount) OVER (ORDER BY order_date) AS running_revenue\nFROM daily_revenue ORDER BY order_date;",
    "tables": [
      {
        "label": "daily_revenue",
        "description": "Daily revenue",
        "columns": [
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "amount",
            "type": "INT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE daily_revenue (order_date TEXT, amount INT);\nINSERT INTO daily_revenue VALUES ('2024-01-01',100),('2024-01-02',50),('2024-01-03',75);"
      },
      {
        "id": "hidden-single-revenue-row",
        "label": "Single revenue row",
        "initSql": "CREATE TABLE daily_revenue (order_date TEXT, amount INT);\nINSERT INTO daily_revenue VALUES ('2024-01-01',100);",
        "isHidden": true
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE daily_revenue (order_date TEXT, amount INT);\nINSERT INTO daily_revenue VALUES ('2024-01-01',100),('2024-01-02',50),('2024-01-03',75);"
      }
    ]
  },
  "scd2-current-version": {
    "referenceQuery": "SELECT customer_id, email, city, effective_from\nFROM customer_scd2\nWHERE is_current = 1;",
    "tables": [
      {
        "label": "customer_scd2",
        "description": "SCD2 customers",
        "columns": [
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "email",
            "type": "TEXT"
          },
          {
            "name": "city",
            "type": "TEXT"
          },
          {
            "name": "effective_from",
            "type": "TEXT"
          },
          {
            "name": "is_current",
            "type": "INT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE customer_scd2 (customer_id INT, email TEXT, city TEXT, effective_from TEXT, is_current INT);\nINSERT INTO customer_scd2 VALUES\n (1,'a@x.com','NYC','2024-01-01',0),(1,'a@x.com','Boston','2024-06-01',1),(2,'b@x.com','LA','2024-01-01',1);"
      },
      {
        "id": "hidden-no-current-row",
        "label": "No current version flag",
        "initSql": "CREATE TABLE customer_scd2 (customer_id INT, email TEXT, city TEXT, effective_from TEXT, is_current INT);\nINSERT INTO customer_scd2 VALUES (1,'a@x.com','NYC','2024-01-01',0);",
        "isHidden": true
      },
      {
        "id": "hidden-two-current",
        "label": "Multiple current rows",
        "initSql": "CREATE TABLE customer_scd2 (customer_id INT, email TEXT, city TEXT, effective_from TEXT, is_current INT);\nINSERT INTO customer_scd2 VALUES (1,'a@x.com','NYC','2024-01-01',1),(1,'a@x.com','Boston','2024-06-01',1);",
        "isHidden": true
      }
    ]
  },
  "incremental-daily-load": {
    "referenceQuery": "SELECT * FROM fact_events\nWHERE event_date = (SELECT MAX(event_date) FROM fact_events);",
    "tables": [
      {
        "label": "fact_events",
        "description": "Fact events",
        "columns": [
          {
            "name": "event_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "event_date",
            "type": "TEXT"
          },
          {
            "name": "metric",
            "type": "INT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE fact_events (event_id INT, event_date TEXT, metric INT);\nINSERT INTO fact_events VALUES (1,'2024-01-01',10),(2,'2024-01-02',20),(3,'2024-01-02',5);"
      },
      {
        "id": "hidden-single-date",
        "label": "Single load date",
        "initSql": "CREATE TABLE fact_events (event_id INT, event_date TEXT, metric INT);\nINSERT INTO fact_events VALUES (1,'2024-03-01',7);",
        "isHidden": true
      },
      {
        "id": "hidden-tied-max-date",
        "label": "Multiple rows on max date",
        "initSql": "CREATE TABLE fact_events (event_id INT, event_date TEXT, metric INT);\nINSERT INTO fact_events VALUES (1,'2024-01-02',1),(2,'2024-01-02',2);",
        "isHidden": true
      }
    ]
  },
  "unmatched-orders": {
    "referenceQuery": "SELECT o.order_id, o.customer_id\nFROM orders o\nLEFT JOIN customers c ON o.customer_id = c.customer_id\nWHERE c.customer_id IS NULL;",
    "tables": [
      {
        "label": "orders",
        "description": "Order facts",
        "columns": [
          {
            "name": "order_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "amount",
            "type": "INT"
          },
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          }
        ]
      },
      {
        "label": "customers",
        "description": "Customers",
        "columns": [
          {
            "name": "customer_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "name",
            "type": "TEXT"
          },
          {
            "name": "email",
            "type": "TEXT"
          },
          {
            "name": "region",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Matched and orphan orders",
        "isHidden": false,
        "tables": {
          "orders": [
            {
              "order_id": 1,
              "customer_id": 10,
              "amount": 100
            },
            {
              "order_id": 2,
              "customer_id": 99,
              "amount": 50
            }
          ],
          "customers": [
            {
              "customer_id": 10,
              "name": "Ada"
            }
          ]
        }
      },
      {
        "id": "hidden-null-join-key",
        "label": "NULL customer_id on order",
        "isHidden": true,
        "tables": {
          "orders": [
            {
              "order_id": 1,
              "customer_id": 10,
              "amount": 10
            },
            {
              "order_id": 2,
              "customer_id": null,
              "amount": 20
            }
          ],
          "customers": [
            {
              "customer_id": 10,
              "name": "Ada"
            }
          ]
        }
      },
      {
        "id": "hidden-all-matched",
        "label": "No orphan orders",
        "isHidden": true,
        "tables": {
          "orders": [
            {
              "order_id": 1,
              "customer_id": 10,
              "amount": 10
            }
          ],
          "customers": [
            {
              "customer_id": 10,
              "name": "Ada"
            }
          ]
        }
      },
      {
        "id": "hidden-empty-customers",
        "label": "Empty customers table",
        "isHidden": true,
        "tables": {
          "orders": [
            {
              "order_id": 1,
              "customer_id": 10,
              "amount": 10
            }
          ],
          "customers": []
        }
      }
    ]
  },
  "second-highest-salary": {
    "referenceQuery": "SELECT full_name, salary\nFROM employees\nWHERE status = 'active'\n  AND salary = (\n    SELECT MAX(salary) FROM (\n      SELECT DISTINCT salary FROM employees WHERE status = 'active'\n    ) s WHERE salary < (SELECT MAX(salary) FROM employees WHERE status = 'active')\n  );",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'Alice','Eng','active',100),(2,'Bob','Eng','active',90),(3,'Carol','Sales','active',80);"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'Alice','Eng','active',100),(2,'Bob','Eng','active',90),(3,'Carol','Sales','active',80);"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'Alice','Eng','active',100),(2,'Bob','Eng','active',90),(3,'Carol','Sales','active',80);"
      }
    ]
  },
  "customer-order-total": {
    "referenceQuery": "SELECT customer_id, SUM(amount) AS total_spent\nFROM orders\nGROUP BY customer_id\nORDER BY customer_id;",
    "tables": [
      {
        "label": "orders",
        "description": "Order facts",
        "columns": [
          {
            "name": "order_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "amount",
            "type": "INT"
          },
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT);\nINSERT INTO orders VALUES (1,10,100),(2,10,50),(3,20,200);"
      },
      {
        "id": "hidden-null-amounts",
        "label": "NULL measure values",
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,NULL,'2024-01-01','shipped'),(2,1,100,'2024-01-01','shipped');",
        "isHidden": true
      },
      {
        "id": "hidden-duplicate-facts",
        "label": "Duplicate fact rows",
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,'2024-01-01','shipped'),(1,1,10,'2024-01-01','shipped'),(2,2,20,'2024-01-02','shipped');",
        "isHidden": true
      }
    ]
  },
  "null-safe-product-name": {
    "referenceQuery": "SELECT product_id, COALESCE(product_name, 'Unknown') AS display_name\nFROM products;",
    "tables": [
      {
        "label": "products",
        "description": "Products",
        "columns": [
          {
            "name": "product_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "product_name",
            "type": "TEXT"
          },
          {
            "name": "stock_qty",
            "type": "INT"
          },
          {
            "name": "reorder_level",
            "type": "INT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE products (product_id INT, product_name TEXT);\nINSERT INTO products VALUES (1,'Widget'),(2,NULL);"
      },
      {
        "id": "hidden-all-null-text",
        "label": "All text values NULL",
        "initSql": "CREATE TABLE products (product_id INT, product_name TEXT);\nINSERT INTO products VALUES (1,NULL),(2,NULL);",
        "isHidden": true
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE products (product_id INT, product_name TEXT);\nINSERT INTO products VALUES (1,'Widget'),(2,NULL);"
      }
    ]
  },
  "day-over-day-revenue": {
    "referenceQuery": "SELECT order_date, amount,\n  LAG(amount) OVER (ORDER BY order_date) AS prev_amount,\n  amount - LAG(amount) OVER (ORDER BY order_date) AS delta\nFROM daily_revenue\nORDER BY order_date;",
    "tables": [
      {
        "label": "daily_revenue",
        "description": "Daily revenue",
        "columns": [
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "amount",
            "type": "INT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE daily_revenue (order_date TEXT, amount INT);\nINSERT INTO daily_revenue VALUES ('2024-01-01',100),('2024-01-02',150),('2024-01-03',120);"
      },
      {
        "id": "hidden-single-revenue-row",
        "label": "Single revenue row",
        "initSql": "CREATE TABLE daily_revenue (order_date TEXT, amount INT);\nINSERT INTO daily_revenue VALUES ('2024-01-01',100);",
        "isHidden": true
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE daily_revenue (order_date TEXT, amount INT);\nINSERT INTO daily_revenue VALUES ('2024-01-01',100),('2024-01-02',150),('2024-01-03',120);"
      }
    ]
  },
  "session-first-event": {
    "referenceQuery": "SELECT session_id, user_id, event_time\nFROM (\n  SELECT *, ROW_NUMBER() OVER (PARTITION BY session_id ORDER BY event_time) AS rn\n  FROM click_events\n) x WHERE rn = 1;",
    "tables": [
      {
        "label": "click_events",
        "description": "Click events",
        "columns": [
          {
            "name": "user_id",
            "type": "INT"
          },
          {
            "name": "event_type",
            "type": "TEXT"
          },
          {
            "name": "session_id",
            "type": "TEXT"
          },
          {
            "name": "event_time",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE click_events (session_id TEXT, user_id INT, event_time TEXT);\nINSERT INTO click_events VALUES\n ('s1',1,'2024-01-01 10:00'),('s1',1,'2024-01-01 10:05'),('s2',2,'2024-01-01 11:00');"
      },
      {
        "id": "hidden-duplicate-session-events",
        "label": "Multiple events same session",
        "initSql": "CREATE TABLE click_events (session_id TEXT, user_id INT, event_time TEXT);\nINSERT INTO click_events VALUES ('s1',1,'2024-01-01 10:00'),('s1',1,'2024-01-01 10:05'),('s2',2,'2024-01-01 11:00');",
        "isHidden": true
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE click_events (session_id TEXT, user_id INT, event_time TEXT);\nINSERT INTO click_events VALUES\n ('s1',1,'2024-01-01 10:00'),('s1',1,'2024-01-01 10:05'),('s2',2,'2024-01-01 11:00');"
      }
    ]
  },
  "distinct-active-users": {
    "referenceQuery": "SELECT COUNT(DISTINCT user_id) AS unique_users FROM events;",
    "tables": [
      {
        "label": "events",
        "description": "Events",
        "columns": [
          {
            "name": "user_id",
            "type": "INT"
          },
          {
            "name": "event_date",
            "type": "TEXT"
          },
          {
            "name": "event_type",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE events (user_id INT, event_date TEXT);\nINSERT INTO events VALUES (1,'2024-01-01'),(1,'2024-01-01'),(2,'2024-01-02');"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE events (user_id INT, event_date TEXT);\nINSERT INTO events VALUES (1,'2024-01-01'),(1,'2024-01-01'),(2,'2024-01-02');"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE events (user_id INT, event_date TEXT);\nINSERT INTO events VALUES (1,'2024-01-01'),(1,'2024-01-01'),(2,'2024-01-02');"
      }
    ]
  },
  "order-tier-label": {
    "referenceQuery": "SELECT order_id,\n  CASE WHEN amount >= 100 THEN 'high' ELSE 'low' END AS tier\nFROM orders;",
    "tables": [
      {
        "label": "orders",
        "description": "Order facts",
        "columns": [
          {
            "name": "order_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "amount",
            "type": "INT"
          },
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT);\nINSERT INTO orders VALUES (1,10,150),(2,10,50);"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT);\nINSERT INTO orders VALUES (1,10,150),(2,10,50);"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT);\nINSERT INTO orders VALUES (1,10,150),(2,10,50);"
      }
    ]
  },
  "manager-direct-reports": {
    "referenceQuery": "SELECT e.full_name AS employee, m.full_name AS manager\nFROM employees e\nJOIN employees m ON e.manager_id = m.employee_id;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, manager_id INT);\nINSERT INTO employees VALUES (1,'CEO',NULL),(2,'Alice',1),(3,'Bob',1);"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, manager_id INT);\nINSERT INTO employees VALUES (1,'CEO',NULL),(2,'Alice',1),(3,'Bob',1);"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, manager_id INT);\nINSERT INTO employees VALUES (1,'CEO',NULL),(2,'Alice',1),(3,'Bob',1);"
      }
    ]
  },
  "top-3-revenue-days": {
    "referenceQuery": "SELECT order_date, amount FROM daily_revenue\nORDER BY amount DESC, order_date ASC LIMIT 3;",
    "tables": [
      {
        "label": "daily_revenue",
        "description": "Daily revenue",
        "columns": [
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "amount",
            "type": "INT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE daily_revenue (order_date TEXT, amount INT);\nINSERT INTO daily_revenue VALUES ('2024-01-01',100),('2024-01-02',200),('2024-01-03',150),('2024-01-04',300);"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE daily_revenue (order_date TEXT, amount INT);\nINSERT INTO daily_revenue VALUES ('2024-01-01',100),('2024-01-02',200),('2024-01-03',150),('2024-01-04',300);"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE daily_revenue (order_date TEXT, amount INT);\nINSERT INTO daily_revenue VALUES ('2024-01-01',100),('2024-01-02',200),('2024-01-03',150),('2024-01-04',300);"
      }
    ]
  },
  "percent-of-total-revenue": {
    "referenceQuery": "SELECT order_date, amount,\n  CAST(amount AS REAL) / SUM(amount) OVER () AS pct_of_total\nFROM daily_revenue ORDER BY order_date;",
    "tables": [
      {
        "label": "daily_revenue",
        "description": "Daily revenue",
        "columns": [
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "amount",
            "type": "INT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE daily_revenue (order_date TEXT, amount INT);\nINSERT INTO daily_revenue VALUES ('2024-01-01',100),('2024-01-02',300);"
      },
      {
        "id": "hidden-single-revenue-row",
        "label": "Single revenue row",
        "initSql": "CREATE TABLE daily_revenue (order_date TEXT, amount INT);\nINSERT INTO daily_revenue VALUES ('2024-01-01',100);",
        "isHidden": true
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE daily_revenue (order_date TEXT, amount INT);\nINSERT INTO daily_revenue VALUES ('2024-01-01',100),('2024-01-02',300);"
      }
    ]
  },
  "union-event-sources": {
    "referenceQuery": "SELECT user_id, event_type, 'web' AS source FROM web_events\nUNION ALL\nSELECT user_id, event_type, 'mobile' AS source FROM mobile_events;",
    "tables": [
      {
        "label": "web_events",
        "description": "web_events",
        "columns": [
          {
            "name": "id",
            "type": "INT"
          }
        ]
      },
      {
        "label": "mobile_events",
        "description": "mobile_events",
        "columns": [
          {
            "name": "id",
            "type": "INT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE web_events (user_id INT, event_type TEXT);\nCREATE TABLE mobile_events (user_id INT, event_type TEXT);\nINSERT INTO web_events VALUES (1,'click');\nINSERT INTO mobile_events VALUES (2,'view');"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE web_events (user_id INT, event_type TEXT);\nCREATE TABLE mobile_events (user_id INT, event_type TEXT);\nINSERT INTO web_events VALUES (1,'click');\nINSERT INTO mobile_events VALUES (2,'view');"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE web_events (user_id INT, event_type TEXT);\nCREATE TABLE mobile_events (user_id INT, event_type TEXT);\nINSERT INTO web_events VALUES (1,'click');\nINSERT INTO mobile_events VALUES (2,'view');"
      }
    ]
  },
  "customers-with-orders": {
    "referenceQuery": "SELECT DISTINCT c.customer_id, c.name\nFROM customers c\nINNER JOIN orders o ON c.customer_id = o.customer_id;",
    "tables": [
      {
        "label": "customers",
        "description": "Customers",
        "columns": [
          {
            "name": "customer_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "name",
            "type": "TEXT"
          },
          {
            "name": "email",
            "type": "TEXT"
          },
          {
            "name": "region",
            "type": "TEXT"
          }
        ]
      },
      {
        "label": "orders",
        "description": "Order facts",
        "columns": [
          {
            "name": "order_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "amount",
            "type": "INT"
          },
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE customers (customer_id INT, name TEXT);\nCREATE TABLE orders (order_id INT, customer_id INT, amount INT);\nINSERT INTO customers VALUES (10,'Ada'),(20,'Bob');\nINSERT INTO orders VALUES (1,10,100);"
      },
      {
        "id": "hidden-empty-customers",
        "label": "Empty customers table",
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT);\nINSERT INTO orders VALUES (1,10,100),(2,99,50);\nCREATE TABLE customers (customer_id INT, name TEXT);",
        "isHidden": true
      },
      {
        "id": "hidden-null-join-key",
        "label": "NULL customer_id on order",
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT);\nINSERT INTO orders VALUES (1,10,100),(2,NULL,50);\nCREATE TABLE customers (customer_id INT, name TEXT);\nINSERT INTO customers VALUES (10,'Ada');",
        "isHidden": true
      }
    ]
  },
  "hire-date-filter": {
    "referenceQuery": "SELECT employee_id, full_name FROM employees\nWHERE status = 'active' AND hire_date >= '2024-01-01';",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, hire_date TEXT, status TEXT);\nINSERT INTO employees VALUES (1,'Alice','2024-06-01','active'),(2,'Bob','2023-01-01','active'),(3,'Carol','2024-02-01','inactive');"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, hire_date TEXT, status TEXT);\nINSERT INTO employees VALUES (1,'Alice','2024-06-01','active'),(2,'Bob','2023-01-01','active'),(3,'Carol','2024-02-01','inactive');"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, hire_date TEXT, status TEXT);\nINSERT INTO employees VALUES (1,'Alice','2024-06-01','active'),(2,'Bob','2023-01-01','active'),(3,'Carol','2024-02-01','inactive');"
      }
    ]
  },
  "product-revenue-rank": {
    "referenceQuery": "SELECT product_id, revenue,\n  RANK() OVER (ORDER BY revenue DESC) AS rank\nFROM (\n  SELECT product_id, SUM(amount) AS revenue FROM order_lines GROUP BY product_id\n);",
    "tables": [
      {
        "label": "order_lines",
        "description": "Order lines",
        "columns": [
          {
            "name": "product_id",
            "type": "TEXT"
          },
          {
            "name": "amount",
            "type": "INT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE order_lines (product_id TEXT, amount INT);\nINSERT INTO order_lines VALUES ('A',100),('A',50),('B',80);"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE order_lines (product_id TEXT, amount INT);\nINSERT INTO order_lines VALUES ('A',100),('A',50),('B',80);"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE order_lines (product_id TEXT, amount INT);\nINSERT INTO order_lines VALUES ('A',100),('A',50),('B',80);"
      }
    ]
  },
  "null-email-default": {
    "referenceQuery": "SELECT customer_id,\n  COALESCE(email, 'no-email@unknown.com') AS contact_email\nFROM customers;",
    "tables": [
      {
        "label": "customers",
        "description": "Customers",
        "columns": [
          {
            "name": "customer_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "name",
            "type": "TEXT"
          },
          {
            "name": "email",
            "type": "TEXT"
          },
          {
            "name": "region",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE customers (customer_id INT, email TEXT);\nINSERT INTO customers VALUES (1,'a@x.com'),(2,NULL);"
      },
      {
        "id": "hidden-empty-string",
        "label": "Empty string vs NULL",
        "initSql": "CREATE TABLE customers (customer_id INT, email TEXT, name TEXT);\nINSERT INTO customers VALUES (1,'','A'),(2,NULL,'B');",
        "isHidden": true
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE customers (customer_id INT, email TEXT);\nINSERT INTO customers VALUES (1,'a@x.com'),(2,NULL);"
      }
    ]
  },
  "average-order-value": {
    "referenceQuery": "SELECT customer_id, AVG(amount) AS avg_order_value FROM orders GROUP BY customer_id ORDER BY customer_id;",
    "tables": [
      {
        "label": "orders",
        "description": "Order facts",
        "columns": [
          {
            "name": "order_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "amount",
            "type": "INT"
          },
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,10,100,'2024-01-01','shipped'),(2,10,200,'2024-01-02','shipped'),(3,20,50,'2024-01-01','shipped');"
      },
      {
        "id": "hidden-null-amounts",
        "label": "NULL measure values",
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,NULL,'2024-01-01','shipped'),(2,1,100,'2024-01-01','shipped');",
        "isHidden": true
      },
      {
        "id": "hidden-duplicate-facts",
        "label": "Duplicate fact rows",
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,'2024-01-01','shipped'),(1,1,10,'2024-01-01','shipped'),(2,2,20,'2024-01-02','shipped');",
        "isHidden": true
      }
    ]
  },
  "first-order-per-customer": {
    "referenceQuery": "SELECT customer_id, MIN(order_date) AS first_order_date FROM orders GROUP BY customer_id ORDER BY customer_id;",
    "tables": [
      {
        "label": "orders",
        "description": "Order facts",
        "columns": [
          {
            "name": "order_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "amount",
            "type": "INT"
          },
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,10,100,'2024-01-05','shipped'),(2,10,50,'2024-02-01','shipped'),(3,20,75,'2024-01-10','shipped');"
      },
      {
        "id": "hidden-null-amounts",
        "label": "NULL measure values",
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,NULL,'2024-01-01','shipped'),(2,1,100,'2024-01-01','shipped');",
        "isHidden": true
      },
      {
        "id": "hidden-duplicate-facts",
        "label": "Duplicate fact rows",
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,'2024-01-01','shipped'),(1,1,10,'2024-01-01','shipped'),(2,2,20,'2024-01-02','shipped');",
        "isHidden": true
      }
    ]
  },
  "duplicate-email-addresses": {
    "referenceQuery": "SELECT email, COUNT(*) AS account_count FROM customers WHERE email IS NOT NULL GROUP BY email HAVING COUNT(*) > 1;",
    "tables": [
      {
        "label": "customers",
        "description": "Customers",
        "columns": [
          {
            "name": "customer_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "name",
            "type": "TEXT"
          },
          {
            "name": "email",
            "type": "TEXT"
          },
          {
            "name": "region",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE customers (customer_id INT, email TEXT, name TEXT);\nINSERT INTO customers VALUES (1,'a@x.com','A'),(2,'a@x.com','B'),(3,'b@y.com','C');"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE customers (customer_id INT, email TEXT, name TEXT);\nINSERT INTO customers VALUES (1,'a@x.com','A'),(2,'a@x.com','B'),(3,'b@y.com','C');"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE customers (customer_id INT, email TEXT, name TEXT);\nINSERT INTO customers VALUES (1,'a@x.com','A'),(2,'a@x.com','B'),(3,'b@y.com','C');"
      }
    ]
  },
  "revenue-by-region": {
    "referenceQuery": "SELECT c.region, SUM(o.amount) AS revenue FROM orders o JOIN customers c ON o.customer_id = c.customer_id GROUP BY c.region;",
    "tables": [
      {
        "label": "orders",
        "description": "Order facts",
        "columns": [
          {
            "name": "order_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "amount",
            "type": "INT"
          },
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          }
        ]
      },
      {
        "label": "customers",
        "description": "Customers",
        "columns": [
          {
            "name": "customer_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "name",
            "type": "TEXT"
          },
          {
            "name": "email",
            "type": "TEXT"
          },
          {
            "name": "region",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE customers (customer_id INT, name TEXT, region TEXT);\nCREATE TABLE orders (order_id INT, customer_id INT, amount INT);\nINSERT INTO customers VALUES (10,'Ada','US'),(20,'Bob','EU');\nINSERT INTO orders VALUES (1,10,100),(2,10,50),(3,20,200);"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE customers (customer_id INT, name TEXT, region TEXT);\nCREATE TABLE orders (order_id INT, customer_id INT, amount INT);\nINSERT INTO customers VALUES (10,'Ada','US'),(20,'Bob','EU');\nINSERT INTO orders VALUES (1,10,100),(2,10,50),(3,20,200);"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE customers (customer_id INT, name TEXT, region TEXT);\nCREATE TABLE orders (order_id INT, customer_id INT, amount INT);\nINSERT INTO customers VALUES (10,'Ada','US'),(20,'Bob','EU');\nINSERT INTO orders VALUES (1,10,100),(2,10,50),(3,20,200);"
      }
    ]
  },
  "products-never-ordered": {
    "referenceQuery": "SELECT p.product_id, p.product_name FROM products p LEFT JOIN order_lines ol ON p.product_id = ol.product_id WHERE ol.product_id IS NULL;",
    "tables": [
      {
        "label": "products",
        "description": "Products",
        "columns": [
          {
            "name": "product_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "product_name",
            "type": "TEXT"
          },
          {
            "name": "stock_qty",
            "type": "INT"
          },
          {
            "name": "reorder_level",
            "type": "INT"
          }
        ]
      },
      {
        "label": "order_lines",
        "description": "Order lines",
        "columns": [
          {
            "name": "product_id",
            "type": "TEXT"
          },
          {
            "name": "amount",
            "type": "INT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE products (product_id TEXT, product_name TEXT);\nCREATE TABLE order_lines (product_id TEXT, amount INT);\nINSERT INTO products VALUES ('A','Widget'),('B','Gadget');\nINSERT INTO order_lines VALUES ('A',100);"
      },
      {
        "id": "hidden-unordered-product",
        "label": "Product never ordered",
        "initSql": "CREATE TABLE products (product_id TEXT, product_name TEXT);\nINSERT INTO products VALUES ('A','Widget'),('B','Gadget');\nCREATE TABLE order_lines (product_id TEXT, amount INT);\nINSERT INTO order_lines VALUES ('A',100);",
        "isHidden": true
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE products (product_id TEXT, product_name TEXT);\nCREATE TABLE order_lines (product_id TEXT, amount INT);\nINSERT INTO products VALUES ('A','Widget'),('B','Gadget');\nINSERT INTO order_lines VALUES ('A',100);"
      }
    ]
  },
  "recent-active-users": {
    "referenceQuery": "SELECT DISTINCT user_id AS active_user_id FROM events WHERE event_date >= date((SELECT MAX(event_date) FROM events), '-6 days');",
    "tables": [
      {
        "label": "events",
        "description": "Events",
        "columns": [
          {
            "name": "user_id",
            "type": "INT"
          },
          {
            "name": "event_date",
            "type": "TEXT"
          },
          {
            "name": "event_type",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE events (user_id INT, event_date TEXT, event_type TEXT);\nINSERT INTO events VALUES (1,'2024-01-08','click'),(2,'2024-01-01','view'),(3,'2024-01-09','click');"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE events (user_id INT, event_date TEXT, event_type TEXT);\nINSERT INTO events VALUES (1,'2024-01-08','click'),(2,'2024-01-01','view'),(3,'2024-01-09','click');"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE events (user_id INT, event_date TEXT, event_type TEXT);\nINSERT INTO events VALUES (1,'2024-01-08','click'),(2,'2024-01-01','view'),(3,'2024-01-09','click');"
      }
    ]
  },
  "order-count-by-status": {
    "referenceQuery": "SELECT status, COUNT(*) AS order_count FROM orders GROUP BY status;",
    "tables": [
      {
        "label": "orders",
        "description": "Order facts",
        "columns": [
          {
            "name": "order_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "amount",
            "type": "INT"
          },
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,'2024-01-01','pending'),(2,1,20,'2024-01-01','pending'),(3,2,30,'2024-01-02','shipped');"
      },
      {
        "id": "hidden-null-amounts",
        "label": "NULL measure values",
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,NULL,'2024-01-01','shipped'),(2,1,100,'2024-01-01','shipped');",
        "isHidden": true
      },
      {
        "id": "hidden-duplicate-facts",
        "label": "Duplicate fact rows",
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,'2024-01-01','shipped'),(1,1,10,'2024-01-01','shipped'),(2,2,20,'2024-01-02','shipped');",
        "isHidden": true
      }
    ]
  },
  "salary-band-count": {
    "referenceQuery": "SELECT band, COUNT(*) AS headcount FROM (\n  SELECT CASE WHEN salary < 70000 THEN 'low' WHEN salary < 90000 THEN 'mid' ELSE 'high' END AS band\n  FROM employees WHERE status = 'active'\n) t GROUP BY band;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',60000),(2,'B','E','active',80000),(3,'C','E','active',100000);"
      },
      {
        "id": "hidden-empty-employees",
        "label": "Empty employee table",
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);",
        "isHidden": true
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',60000),(2,'B','E','active',80000),(3,'C','E','active',100000);"
      }
    ]
  },
  "email-domain-extract": {
    "referenceQuery": "SELECT customer_id, SUBSTR(email, INSTR(email, '@') + 1) AS domain FROM customers WHERE email IS NOT NULL;",
    "tables": [
      {
        "label": "customers",
        "description": "Customers",
        "columns": [
          {
            "name": "customer_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "name",
            "type": "TEXT"
          },
          {
            "name": "email",
            "type": "TEXT"
          },
          {
            "name": "region",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE customers (customer_id INT, email TEXT, name TEXT);\nINSERT INTO customers VALUES (1,'a@company.com','A'),(2,NULL,'B');"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE customers (customer_id INT, email TEXT, name TEXT);\nINSERT INTO customers VALUES (1,'a@company.com','A'),(2,NULL,'B');"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE customers (customer_id INT, email TEXT, name TEXT);\nINSERT INTO customers VALUES (1,'a@company.com','A'),(2,NULL,'B');"
      }
    ]
  },
  "rolling-3-day-average": {
    "referenceQuery": "SELECT order_date, amount,\nAVG(amount) OVER (ORDER BY order_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS rolling_avg\nFROM daily_revenue ORDER BY order_date;",
    "tables": [
      {
        "label": "daily_revenue",
        "description": "Daily revenue",
        "columns": [
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "amount",
            "type": "INT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE daily_revenue (order_date TEXT, amount INT);\nINSERT INTO daily_revenue VALUES ('2024-01-01',10),('2024-01-02',20),('2024-01-03',30);"
      },
      {
        "id": "hidden-single-revenue-row",
        "label": "Single revenue row",
        "initSql": "CREATE TABLE daily_revenue (order_date TEXT, amount INT);\nINSERT INTO daily_revenue VALUES ('2024-01-01',100);",
        "isHidden": true
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE daily_revenue (order_date TEXT, amount INT);\nINSERT INTO daily_revenue VALUES ('2024-01-01',10),('2024-01-02',20),('2024-01-03',30);"
      }
    ]
  },
  "dedupe-staging-rows": {
    "referenceQuery": "SELECT id, value FROM (\n  SELECT id, value, ROW_NUMBER() OVER (PARTITION BY value ORDER BY id) AS rn FROM staging\n) t WHERE rn = 1;",
    "tables": [
      {
        "label": "staging",
        "description": "Staging rows",
        "columns": [
          {
            "name": "id",
            "type": "INT"
          },
          {
            "name": "value",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE staging (id INT, value TEXT);\nINSERT INTO staging VALUES (1,'A'),(2,'A'),(3,'B');"
      },
      {
        "id": "hidden-staging-dupes",
        "label": "All staging rows duplicated",
        "initSql": "CREATE TABLE staging (id INT, value TEXT);\nINSERT INTO staging VALUES (1,'A'),(1,'A'),(2,'B');",
        "isHidden": true
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE staging (id INT, value TEXT);\nINSERT INTO staging VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE staging (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "customers-missing-email": {
    "referenceQuery": "SELECT customer_id, name FROM customers WHERE email IS NULL;",
    "tables": [
      {
        "label": "customers",
        "description": "Customers",
        "columns": [
          {
            "name": "customer_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "name",
            "type": "TEXT"
          },
          {
            "name": "email",
            "type": "TEXT"
          },
          {
            "name": "region",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE customers (customer_id INT, name TEXT, email TEXT);\nINSERT INTO customers VALUES (1,'Ada','a@x.com'),(2,'Bob',NULL);"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE customers (customer_id INT, name TEXT, email TEXT);\nINSERT INTO customers VALUES (1,'Ada','a@x.com'),(2,'Bob',NULL);"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE customers (customer_id INT, name TEXT, email TEXT);\nINSERT INTO customers VALUES (1,'Ada','a@x.com'),(2,'Bob',NULL);"
      }
    ]
  },
  "total-revenue": {
    "referenceQuery": "SELECT SUM(amount) AS total_revenue FROM orders;",
    "tables": [
      {
        "label": "orders",
        "description": "Order facts",
        "columns": [
          {
            "name": "order_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "amount",
            "type": "INT"
          },
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,'2024-01-01','shipped'),(2,1,20,'2024-01-02','shipped'),(3,2,30,'2024-01-02','shipped');"
      },
      {
        "id": "hidden-null-amounts",
        "label": "NULL measure values",
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,NULL,'2024-01-01','shipped'),(2,1,100,'2024-01-01','shipped');",
        "isHidden": true
      },
      {
        "id": "hidden-duplicate-facts",
        "label": "Duplicate fact rows",
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,'2024-01-01','shipped'),(1,1,10,'2024-01-01','shipped'),(2,2,20,'2024-01-02','shipped');",
        "isHidden": true
      }
    ]
  },
  "rank-orders-per-customer": {
    "referenceQuery": "SELECT order_id, customer_id, amount,\nROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY amount DESC) AS rn\nFROM orders;",
    "tables": [
      {
        "label": "orders",
        "description": "Order facts",
        "columns": [
          {
            "name": "order_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "amount",
            "type": "INT"
          },
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,10,50,'2024-01-01','shipped'),(2,10,100,'2024-01-02','shipped');"
      },
      {
        "id": "hidden-single-order",
        "label": "Single order row",
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,10,100,'2024-01-01','shipped');",
        "isHidden": true
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,10,50,'2024-01-01','shipped'),(2,10,100,'2024-01-02','shipped');"
      }
    ]
  },
  "union-daily-snapshots": {
    "referenceQuery": "SELECT metric_date, value, 'a' AS source FROM snapshot_a\nUNION ALL\nSELECT metric_date, value, 'b' AS source FROM snapshot_b;",
    "tables": [
      {
        "label": "snapshot_a",
        "description": "Snapshot A",
        "columns": [
          {
            "name": "metric_date",
            "type": "TEXT"
          },
          {
            "name": "value",
            "type": "INT"
          }
        ]
      },
      {
        "label": "snapshot_b",
        "description": "Snapshot B",
        "columns": [
          {
            "name": "metric_date",
            "type": "TEXT"
          },
          {
            "name": "value",
            "type": "INT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE snapshot_a (metric_date TEXT, value INT);\nCREATE TABLE snapshot_b (metric_date TEXT, value INT);\nINSERT INTO snapshot_a VALUES ('2024-01-01',10);\nINSERT INTO snapshot_b VALUES ('2024-01-02',5);"
      },
      {
        "id": "hidden-empty-snapshot",
        "label": "One empty snapshot",
        "initSql": "CREATE TABLE snapshot_a (metric_date TEXT, value INT);\nINSERT INTO snapshot_a VALUES ('2024-01-01',10);\nCREATE TABLE snapshot_b (metric_date TEXT, value INT);",
        "isHidden": true
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE snapshot_a (metric_date TEXT, value INT);\nCREATE TABLE snapshot_b (metric_date TEXT, value INT);\nINSERT INTO snapshot_a VALUES ('2024-01-01',10);\nINSERT INTO snapshot_b VALUES ('2024-01-02',5);"
      }
    ]
  },
  "orders-above-average": {
    "referenceQuery": "SELECT order_id, amount FROM orders WHERE amount > (SELECT AVG(amount) FROM orders);",
    "tables": [
      {
        "label": "orders",
        "description": "Order facts",
        "columns": [
          {
            "name": "order_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "amount",
            "type": "INT"
          },
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,'2024-01-01','shipped'),(2,1,20,'2024-01-02','shipped'),(3,2,30,'2024-01-02','shipped');"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,'2024-01-01','shipped'),(2,1,20,'2024-01-02','shipped'),(3,2,30,'2024-01-02','shipped');"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,'2024-01-01','shipped'),(2,1,20,'2024-01-02','shipped'),(3,2,30,'2024-01-02','shipped');"
      }
    ]
  },
  "warehouse-low-stock": {
    "referenceQuery": "SELECT product_id, product_name, stock_qty, reorder_level FROM products WHERE stock_qty < reorder_level;",
    "tables": [
      {
        "label": "products",
        "description": "Products",
        "columns": [
          {
            "name": "product_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "product_name",
            "type": "TEXT"
          },
          {
            "name": "stock_qty",
            "type": "INT"
          },
          {
            "name": "reorder_level",
            "type": "INT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE products (product_id INT, product_name TEXT, stock_qty INT, reorder_level INT);\nINSERT INTO products VALUES (1,'Widget',5,10),(2,'Gadget',20,10);"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE products (product_id INT, product_name TEXT, stock_qty INT, reorder_level INT);\nINSERT INTO products VALUES (1,'Widget',5,10),(2,'Gadget',20,10);"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE products (product_id INT, product_name TEXT, stock_qty INT, reorder_level INT);\nINSERT INTO products VALUES (1,'Widget',5,10),(2,'Gadget',20,10);"
      }
    ]
  },
  "funnel-step-counts": {
    "referenceQuery": "SELECT event_type, COUNT(DISTINCT user_id) AS user_count FROM events GROUP BY event_type;",
    "tables": [
      {
        "label": "events",
        "description": "Events",
        "columns": [
          {
            "name": "user_id",
            "type": "INT"
          },
          {
            "name": "event_date",
            "type": "TEXT"
          },
          {
            "name": "event_type",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE events (user_id INT, event_date TEXT, event_type TEXT);\nINSERT INTO events VALUES (1,'2024-01-01','click'),(2,'2024-01-01','click'),(3,'2024-01-01','view');"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE events (user_id INT, event_date TEXT, event_type TEXT);\nINSERT INTO events VALUES (1,'2024-01-01','click'),(2,'2024-01-01','click'),(3,'2024-01-01','view');"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE events (user_id INT, event_date TEXT, event_type TEXT);\nINSERT INTO events VALUES (1,'2024-01-01','click'),(2,'2024-01-01','click'),(3,'2024-01-01','view');"
      }
    ]
  },
  "data-freshness-timestamp": {
    "referenceQuery": "SELECT MAX(updated_at) AS latest_update FROM ingestion_log;",
    "tables": [
      {
        "label": "ingestion_log",
        "description": "Ingestion log",
        "columns": [
          {
            "name": "table_name",
            "type": "TEXT"
          },
          {
            "name": "updated_at",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE ingestion_log (table_name TEXT, updated_at TEXT);\nINSERT INTO ingestion_log VALUES ('orders','2024-01-01'),('customers','2024-01-03');"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE ingestion_log (table_name TEXT, updated_at TEXT);\nINSERT INTO ingestion_log VALUES ('orders','2024-01-01'),('customers','2024-01-03');"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE ingestion_log (table_name TEXT, updated_at TEXT);\nINSERT INTO ingestion_log VALUES ('orders','2024-01-01'),('customers','2024-01-03');"
      }
    ]
  },
  "active-pct-headcount": {
    "referenceQuery": "SELECT CAST(SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS REAL) / COUNT(*) AS active_pct FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1),(2,'B','E','active',1),(3,'C','E','active',1),(4,'D','E','inactive',1);"
      },
      {
        "id": "hidden-empty-employees",
        "label": "Empty employee table",
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);",
        "isHidden": true
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1),(2,'B','E','active',1),(3,'C','E','active',1),(4,'D','E','inactive',1);"
      }
    ]
  },
  "running-order-count": {
    "referenceQuery": "SELECT order_date, SUM(daily_cnt) OVER (ORDER BY order_date) AS running_count\nFROM (SELECT order_date, COUNT(*) AS daily_cnt FROM orders GROUP BY order_date) d ORDER BY order_date;",
    "tables": [
      {
        "label": "orders",
        "description": "Order facts",
        "columns": [
          {
            "name": "order_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "amount",
            "type": "INT"
          },
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,'2024-01-01','shipped'),(2,1,20,'2024-01-01','shipped'),(3,2,30,'2024-01-02','shipped');"
      },
      {
        "id": "hidden-single-order",
        "label": "Single order row",
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,10,100,'2024-01-01','shipped');",
        "isHidden": true
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,'2024-01-01','shipped'),(2,1,20,'2024-01-01','shipped'),(3,2,30,'2024-01-02','shipped');"
      }
    ]
  },
  "exclude-cancelled-orders": {
    "referenceQuery": "SELECT * FROM orders WHERE status != 'cancelled';",
    "tables": [
      {
        "label": "orders",
        "description": "Order facts",
        "columns": [
          {
            "name": "order_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "amount",
            "type": "INT"
          },
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,'2024-01-01','pending'),(2,1,20,'2024-01-02','cancelled');"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,'2024-01-01','pending'),(2,1,20,'2024-01-02','cancelled');"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,'2024-01-01','pending'),(2,1,20,'2024-01-02','cancelled');"
      }
    ]
  },
  "extract-order-year": {
    "referenceQuery": "SELECT strftime('%Y', order_date) AS order_year, SUM(amount) AS total_amount FROM orders GROUP BY 1;",
    "tables": [
      {
        "label": "orders",
        "description": "Order facts",
        "columns": [
          {
            "name": "order_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "amount",
            "type": "INT"
          },
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,100,'2023-06-01','shipped'),(2,1,200,'2024-01-01','shipped');"
      },
      {
        "id": "hidden-month-boundary",
        "label": "Month boundary dates",
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,'2024-01-31','shipped'),(2,1,20,'2024-02-01','shipped'),(3,2,30,'2024-02-29','shipped');",
        "isHidden": true
      },
      {
        "id": "hidden-null-dates",
        "label": "NULL order dates",
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,NULL,'shipped'),(2,1,20,'2024-01-01','shipped');",
        "isHidden": true
      }
    ]
  },
  "count-null-emails": {
    "referenceQuery": "SELECT SUM(CASE WHEN email IS NULL THEN 1 ELSE 0 END) AS missing_email_count FROM customers;",
    "tables": [
      {
        "label": "customers",
        "description": "Customers",
        "columns": [
          {
            "name": "customer_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "name",
            "type": "TEXT"
          },
          {
            "name": "email",
            "type": "TEXT"
          },
          {
            "name": "region",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE customers (customer_id INT, name TEXT, email TEXT);\nINSERT INTO customers VALUES (1,'A','a@x.com'),(2,'B',NULL),(3,'C',NULL);"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE customers (customer_id INT, name TEXT, email TEXT);\nINSERT INTO customers VALUES (1,'A','a@x.com'),(2,'B',NULL),(3,'C',NULL);"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE customers (customer_id INT, name TEXT, email TEXT);\nINSERT INTO customers VALUES (1,'A','a@x.com'),(2,'B',NULL),(3,'C',NULL);"
      }
    ]
  },
  "january-revenue": {
    "referenceQuery": "SELECT SUM(amount) AS total_january_revenue FROM orders WHERE strftime('%m', order_date) = '01';",
    "tables": [
      {
        "label": "orders",
        "description": "Order facts",
        "columns": [
          {
            "name": "order_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "amount",
            "type": "INT"
          },
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,100,'2024-01-15','shipped'),(2,1,50,'2024-01-20','shipped'),(3,2,200,'2024-02-01','shipped');"
      },
      {
        "id": "hidden-null-amounts",
        "label": "NULL measure values",
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,NULL,'2024-01-01','shipped'),(2,1,100,'2024-01-01','shipped');",
        "isHidden": true
      },
      {
        "id": "hidden-duplicate-facts",
        "label": "Duplicate fact rows",
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,'2024-01-01','shipped'),(1,1,10,'2024-01-01','shipped'),(2,2,20,'2024-01-02','shipped');",
        "isHidden": true
      }
    ]
  },
  "employees-without-manager": {
    "referenceQuery": "SELECT employee_id, full_name FROM employees WHERE manager_id IS NULL;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, manager_id INT);\nINSERT INTO employees VALUES (1,'CEO',NULL),(2,'Alice',1);"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, manager_id INT);\nINSERT INTO employees VALUES (1,'CEO',NULL),(2,'Alice',1);"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, manager_id INT);\nINSERT INTO employees VALUES (1,'CEO',NULL),(2,'Alice',1);"
      }
    ]
  },
  "select-all-employees": {
    "referenceQuery": "SELECT * FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','Eng','active',90000);"
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);\nINSERT INTO employees VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "order-salary-desc": {
    "referenceQuery": "SELECT employee_id, full_name, salary FROM employees ORDER BY salary DESC;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','Eng','active',100),(2,'B','Eng','active',200);"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','Eng','active',100),(2,'B','Eng','active',200);"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','Eng','active',100),(2,'B','Eng','active',200);"
      }
    ]
  },
  "limit-top-3-salaries": {
    "referenceQuery": "SELECT full_name, salary FROM employees ORDER BY salary DESC LIMIT 3;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',100),(2,'B','E','active',200),(3,'C','E','active',150),(4,'D','E','active',50);"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',100),(2,'B','E','active',200),(3,'C','E','active',150),(4,'D','E','active',50);"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',100),(2,'B','E','active',200),(3,'C','E','active',150),(4,'D','E','active',50);"
      }
    ]
  },
  "distinct-departments": {
    "referenceQuery": "SELECT DISTINCT department FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','Eng','active',1),(2,'B','Eng','active',2),(3,'C','Sales','active',3);"
      },
      {
        "id": "hidden-empty-employees",
        "label": "Empty employee table",
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);",
        "isHidden": true
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','Eng','active',1),(2,'B','Eng','active',2),(3,'C','Sales','active',3);"
      }
    ]
  },
  "count-all-employees": {
    "referenceQuery": "SELECT COUNT(*) AS employee_count FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1),(2,'B','E','active',2);"
      },
      {
        "id": "hidden-empty-employees",
        "label": "Empty employee table",
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);",
        "isHidden": true
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);\nINSERT INTO employees VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "filter-by-region": {
    "referenceQuery": "SELECT customer_id, name FROM customers WHERE region = 'US';",
    "tables": [
      {
        "label": "customers",
        "description": "Customers",
        "columns": [
          {
            "name": "customer_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "name",
            "type": "TEXT"
          },
          {
            "name": "email",
            "type": "TEXT"
          },
          {
            "name": "region",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE customers (customer_id INT, name TEXT, region TEXT);\nINSERT INTO customers VALUES (1,'Ada','US'),(2,'Bob','EU');"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE customers (customer_id INT, name TEXT, region TEXT);\nINSERT INTO customers VALUES (1,'Ada','US'),(2,'Bob','EU');"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE customers (customer_id INT, name TEXT, region TEXT);\nINSERT INTO customers VALUES (1,'Ada','US'),(2,'Bob','EU');"
      }
    ]
  },
  "salary-between-range": {
    "referenceQuery": "SELECT full_name, salary FROM employees WHERE salary BETWEEN 70000 AND 90000;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',80000),(2,'B','E','active',50000);"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',80000),(2,'B','E','active',50000);"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',80000),(2,'B','E','active',50000);"
      }
    ]
  },
  "orders-in-status-list": {
    "referenceQuery": "SELECT order_id, status FROM orders WHERE status IN ('pending','shipped');",
    "tables": [
      {
        "label": "orders",
        "description": "Order facts",
        "columns": [
          {
            "name": "order_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "amount",
            "type": "INT"
          },
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,'2024-01-01','pending'),(2,1,20,'2024-01-02','cancelled');"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,'2024-01-01','pending'),(2,1,20,'2024-01-02','cancelled');"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,'2024-01-01','pending'),(2,1,20,'2024-01-02','cancelled');"
      }
    ]
  },
  "names-like-prefix": {
    "referenceQuery": "SELECT full_name FROM employees WHERE full_name LIKE 'A%';",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'Alice','E','active',1),(2,'Bob','E','active',2);"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'Alice','E','active',1),(2,'Bob','E','active',2);"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'Alice','E','active',1),(2,'Bob','E','active',2);"
      }
    ]
  },
  "max-salary-by-dept": {
    "referenceQuery": "SELECT department, MAX(salary) AS max_salary FROM employees GROUP BY department;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','Eng','active',100),(2,'B','Eng','active',200),(3,'C','Sales','active',150);"
      },
      {
        "id": "hidden-empty-employees",
        "label": "Empty employee table",
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);",
        "isHidden": true
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','Eng','active',100),(2,'B','Eng','active',200),(3,'C','Sales','active',150);"
      }
    ]
  },
  "having-high-volume-customers": {
    "referenceQuery": "SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id HAVING COUNT(*) >= 2;",
    "tables": [
      {
        "label": "orders",
        "description": "Order facts",
        "columns": [
          {
            "name": "order_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "amount",
            "type": "INT"
          },
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,10,100,'2024-01-01','shipped'),(2,10,50,'2024-01-02','shipped'),(3,20,30,'2024-01-01','shipped');"
      },
      {
        "id": "hidden-null-amounts",
        "label": "NULL measure values",
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,NULL,'2024-01-01','shipped'),(2,1,100,'2024-01-01','shipped');",
        "isHidden": true
      },
      {
        "id": "hidden-duplicate-facts",
        "label": "Duplicate fact rows",
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,'2024-01-01','shipped'),(1,1,10,'2024-01-01','shipped'),(2,2,20,'2024-01-02','shipped');",
        "isHidden": true
      }
    ]
  },
  "right-join-all-customers": {
    "referenceQuery": "SELECT c.customer_id, c.name, COUNT(o.order_id) AS order_count FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.customer_id, c.name;",
    "tables": [
      {
        "label": "customers",
        "description": "Customers",
        "columns": [
          {
            "name": "customer_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "name",
            "type": "TEXT"
          },
          {
            "name": "email",
            "type": "TEXT"
          },
          {
            "name": "region",
            "type": "TEXT"
          }
        ]
      },
      {
        "label": "orders",
        "description": "Order facts",
        "columns": [
          {
            "name": "order_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "amount",
            "type": "INT"
          },
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE customers (customer_id INT, name TEXT, region TEXT);\nCREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO customers VALUES (10,'Ada','US'),(20,'Bob','EU');\nINSERT INTO orders VALUES (1,10,100,'2024-01-01','shipped');"
      },
      {
        "id": "hidden-empty-customers",
        "label": "Empty customers table",
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT);\nINSERT INTO orders VALUES (1,10,100),(2,99,50);\nCREATE TABLE customers (customer_id INT, name TEXT);",
        "isHidden": true
      },
      {
        "id": "hidden-null-join-key",
        "label": "NULL customer_id on order",
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT);\nINSERT INTO orders VALUES (1,10,100),(2,NULL,50);\nCREATE TABLE customers (customer_id INT, name TEXT);\nINSERT INTO customers VALUES (10,'Ada');",
        "isHidden": true
      }
    ]
  },
  "exists-customer-orders": {
    "referenceQuery": "SELECT customer_id, name FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);",
    "tables": [
      {
        "label": "customers",
        "description": "Customers",
        "columns": [
          {
            "name": "customer_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "name",
            "type": "TEXT"
          },
          {
            "name": "email",
            "type": "TEXT"
          },
          {
            "name": "region",
            "type": "TEXT"
          }
        ]
      },
      {
        "label": "orders",
        "description": "Order facts",
        "columns": [
          {
            "name": "order_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "amount",
            "type": "INT"
          },
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE customers (customer_id INT, name TEXT, region TEXT);\nCREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO customers VALUES (10,'Ada','US'),(20,'Bob','EU');\nINSERT INTO orders VALUES (1,10,100,'2024-01-01','shipped');"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE customers (customer_id INT, name TEXT, region TEXT);\nCREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO customers VALUES (10,'Ada','US'),(20,'Bob','EU');\nINSERT INTO orders VALUES (1,10,100,'2024-01-01','shipped');"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE customers (customer_id INT, name TEXT, region TEXT);\nCREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO customers VALUES (10,'Ada','US'),(20,'Bob','EU');\nINSERT INTO orders VALUES (1,10,100,'2024-01-01','shipped');"
      }
    ]
  },
  "cte-active-employees": {
    "referenceQuery": "WITH active AS (SELECT * FROM employees WHERE status = 'active') SELECT department, COUNT(*) AS cnt FROM active GROUP BY department;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','Eng','active',1),(2,'B','Eng','inactive',2);"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','Eng','active',1),(2,'B','Eng','inactive',2);"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','Eng','active',1),(2,'B','Eng','inactive',2);"
      }
    ]
  },
  "dense-rank-salary": {
    "referenceQuery": "SELECT full_name, salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS dr FROM employees WHERE status='active';",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',100),(2,'B','E','active',100),(3,'C','E','active',90);"
      },
      {
        "id": "hidden-salary-ties",
        "label": "Tied ranking values",
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','Eng','active',100),(2,'B','Eng','active',100),(3,'C','Eng','active',90);",
        "isHidden": true
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',100),(2,'B','E','active',100),(3,'C','E','active',90);"
      }
    ]
  },
  "lead-next-day-revenue": {
    "referenceQuery": "SELECT order_date, amount, LEAD(amount) OVER (ORDER BY order_date) AS next_amount FROM daily_revenue ORDER BY order_date;",
    "tables": [
      {
        "label": "daily_revenue",
        "description": "Daily revenue",
        "columns": [
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "amount",
            "type": "INT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE daily_revenue (order_date TEXT, amount INT);\nINSERT INTO daily_revenue VALUES ('2024-01-01',100),('2024-01-02',150);"
      },
      {
        "id": "hidden-single-revenue-row",
        "label": "Single revenue row",
        "initSql": "CREATE TABLE daily_revenue (order_date TEXT, amount INT);\nINSERT INTO daily_revenue VALUES ('2024-01-01',100);",
        "isHidden": true
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE daily_revenue (order_date TEXT, amount INT);\nINSERT INTO daily_revenue VALUES ('2024-01-01',100),('2024-01-02',150);"
      }
    ]
  },
  "weekday-from-date": {
    "referenceQuery": "SELECT order_id, strftime('%w', order_date) AS weekday FROM orders;",
    "tables": [
      {
        "label": "orders",
        "description": "Order facts",
        "columns": [
          {
            "name": "order_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "amount",
            "type": "INT"
          },
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,'2024-01-01','shipped');"
      },
      {
        "id": "hidden-month-boundary",
        "label": "Month boundary dates",
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,'2024-01-31','shipped'),(2,1,20,'2024-02-01','shipped'),(3,2,30,'2024-02-29','shipped');",
        "isHidden": true
      },
      {
        "id": "hidden-null-dates",
        "label": "NULL order dates",
        "initSql": "CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);\nINSERT INTO orders VALUES (1,1,10,NULL,'shipped'),(2,1,20,'2024-01-01','shipped');",
        "isHidden": true
      }
    ]
  },
  "concat-full-name": {
    "referenceQuery": "SELECT employee_id, full_name || ' (' || department || ')' AS label FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'Alice','Eng','active',1);"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'Alice','Eng','active',1);"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'Alice','Eng','active',1);"
      }
    ]
  },
  "replace-null-city": {
    "referenceQuery": "SELECT customer_id, COALESCE(city, 'Unknown') AS city FROM customers_ext;",
    "tables": [
      {
        "label": "customers_ext",
        "description": "Customers extended",
        "columns": [
          {
            "name": "customer_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "city",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE customers_ext (customer_id INT, city TEXT);\nINSERT INTO customers_ext VALUES (1,'NYC'),(2,NULL);"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE customers_ext (customer_id INT, city TEXT);\nINSERT INTO customers_ext VALUES (1,'NYC'),(2,NULL);"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE customers_ext (customer_id INT, city TEXT);\nINSERT INTO customers_ext VALUES (1,'NYC'),(2,NULL);"
      }
    ]
  },
  "intersect-regions": {
    "referenceQuery": "SELECT region FROM customers_a INTERSECT SELECT region FROM customers_b;",
    "tables": [
      {
        "label": "customers_a",
        "description": "Customers set A",
        "columns": [
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "region",
            "type": "TEXT"
          }
        ]
      },
      {
        "label": "customers_b",
        "description": "Customers set B",
        "columns": [
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "region",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE customers_a (customer_id INT, region TEXT);\nCREATE TABLE customers_b (customer_id INT, region TEXT);\nINSERT INTO customers_a VALUES (1,'US'),(2,'EU');\nINSERT INTO customers_b VALUES (3,'US');"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE customers_a (customer_id INT, region TEXT);\nCREATE TABLE customers_b (customer_id INT, region TEXT);\nINSERT INTO customers_a VALUES (1,'US'),(2,'EU');\nINSERT INTO customers_b VALUES (3,'US');"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE customers_a (customer_id INT, region TEXT);\nCREATE TABLE customers_b (customer_id INT, region TEXT);\nINSERT INTO customers_a VALUES (1,'US'),(2,'EU');\nINSERT INTO customers_b VALUES (3,'US');"
      }
    ]
  },
  "keep-latest-staging-id": {
    "referenceQuery": "SELECT id, value FROM (SELECT id, value, ROW_NUMBER() OVER (PARTITION BY value ORDER BY id DESC) AS rn FROM staging) t WHERE rn=1;",
    "tables": [
      {
        "label": "staging",
        "description": "Staging rows",
        "columns": [
          {
            "name": "id",
            "type": "INT"
          },
          {
            "name": "value",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE staging (id INT, value TEXT);\nINSERT INTO staging VALUES (1,'A'),(2,'A');"
      },
      {
        "id": "hidden-staging-dupes",
        "label": "All staging rows duplicated",
        "initSql": "CREATE TABLE staging (id INT, value TEXT);\nINSERT INTO staging VALUES (1,'A'),(1,'A'),(2,'B');",
        "isHidden": true
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE staging (id INT, value TEXT);\nINSERT INTO staging VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE staging (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "duplicate-order-ids": {
    "referenceQuery": "SELECT order_id, COUNT(*) AS cnt FROM orders_dup GROUP BY order_id HAVING COUNT(*) > 1;",
    "tables": [
      {
        "label": "orders_dup",
        "description": "Orders with duplicates",
        "columns": [
          {
            "name": "order_id",
            "type": "INT"
          },
          {
            "name": "amount",
            "type": "INT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE orders_dup (order_id INT, amount INT);\nINSERT INTO orders_dup VALUES (1,10),(1,20),(2,5);"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE orders_dup (order_id INT, amount INT);\nINSERT INTO orders_dup VALUES (1,10),(1,20),(2,5);"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE orders_dup (order_id INT, amount INT);\nINSERT INTO orders_dup VALUES (1,10),(1,20),(2,5);"
      }
    ]
  },
  "ntile-quartile-revenue": {
    "referenceQuery": "SELECT order_date, amount, NTILE(4) OVER (ORDER BY amount) AS quartile FROM daily_revenue;",
    "tables": [
      {
        "label": "daily_revenue",
        "description": "Daily revenue",
        "columns": [
          {
            "name": "order_date",
            "type": "TEXT"
          },
          {
            "name": "amount",
            "type": "INT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE daily_revenue (order_date TEXT, amount INT);\nINSERT INTO daily_revenue VALUES ('2024-01-01',10),('2024-01-02',20),('2024-01-03',30),('2024-01-04',40);"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE daily_revenue (order_date TEXT, amount INT);\nINSERT INTO daily_revenue VALUES ('2024-01-01',10),('2024-01-02',20),('2024-01-03',30),('2024-01-04',40);"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE daily_revenue (order_date TEXT, amount INT);\nINSERT INTO daily_revenue VALUES ('2024-01-01',10),('2024-01-02',20),('2024-01-03',30),('2024-01-04',40);"
      }
    ]
  },
  "scd2-as-of-date": {
    "referenceQuery": "SELECT customer_id, city FROM customer_scd2_pt WHERE '2024-03-01' >= effective_from AND (effective_to IS NULL OR '2024-03-01' < effective_to);",
    "tables": [
      {
        "label": "customer_scd2_pt",
        "description": "SCD2 partition",
        "columns": [
          {
            "name": "customer_id",
            "type": "INT"
          },
          {
            "name": "city",
            "type": "TEXT"
          },
          {
            "name": "effective_from",
            "type": "TEXT"
          },
          {
            "name": "effective_to",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE customer_scd2_pt (customer_id INT, city TEXT, effective_from TEXT, effective_to TEXT);\nINSERT INTO customer_scd2_pt VALUES (1,'NYC','2024-01-01','2024-06-01'),(1,'Boston','2024-06-01',NULL);"
      },
      {
        "id": "hidden-edge-1",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE customer_scd2_pt (customer_id INT, city TEXT, effective_from TEXT, effective_to TEXT);\nINSERT INTO customer_scd2_pt VALUES (1,'NYC','2024-01-01','2024-06-01'),(1,'Boston','2024-06-01',NULL);"
      },
      {
        "id": "hidden-edge-2",
        "label": "Public dataset edge replay",
        "isHidden": true,
        "initSql": "CREATE TABLE customer_scd2_pt (customer_id INT, city TEXT, effective_from TEXT, effective_to TEXT);\nINSERT INTO customer_scd2_pt VALUES (1,'NYC','2024-01-01','2024-06-01'),(1,'Boston','2024-06-01',NULL);"
      }
    ]
  },
  "incremental-yesterday": {
    "referenceQuery": "SELECT * FROM fact_events WHERE event_date = date((SELECT MAX(event_date) FROM fact_events), '-1 day');",
    "tables": [
      {
        "label": "fact_events",
        "description": "Fact events",
        "columns": [
          {
            "name": "event_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "event_date",
            "type": "TEXT"
          },
          {
            "name": "metric",
            "type": "INT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE fact_events (event_id INT, event_date TEXT, metric INT);\nINSERT INTO fact_events VALUES (1,'2024-01-01',1),(2,'2024-01-02',2);"
      },
      {
        "id": "hidden-single-date",
        "label": "Single load date",
        "initSql": "CREATE TABLE fact_events (event_id INT, event_date TEXT, metric INT);\nINSERT INTO fact_events VALUES (1,'2024-03-01',7);",
        "isHidden": true
      },
      {
        "id": "hidden-tied-max-date",
        "label": "Multiple rows on max date",
        "initSql": "CREATE TABLE fact_events (event_id INT, event_date TEXT, metric INT);\nINSERT INTO fact_events VALUES (1,'2024-01-02',1),(2,'2024-01-02',2);",
        "isHidden": true
      }
    ]
  },
  "sql-practice-26": {
    "referenceQuery": "SELECT COUNT(*) AS n FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1);"
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);\nINSERT INTO employees VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "sql-practice-27": {
    "referenceQuery": "SELECT COUNT(*) AS n FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1);"
      },
      {
        "id": "hidden-empty-employees",
        "label": "Empty employee table",
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);",
        "isHidden": true
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);\nINSERT INTO employees VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "sql-practice-28": {
    "referenceQuery": "SELECT COUNT(*) AS n FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1);"
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);\nINSERT INTO employees VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "sql-practice-29": {
    "referenceQuery": "SELECT COUNT(*) AS n FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1);"
      },
      {
        "id": "hidden-salary-ties",
        "label": "Tied ranking values",
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','Eng','active',100),(2,'B','Eng','active',100),(3,'C','Eng','active',90);",
        "isHidden": true
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);\nINSERT INTO employees VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "sql-practice-30": {
    "referenceQuery": "SELECT COUNT(*) AS n FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1);"
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);\nINSERT INTO employees VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "sql-practice-31": {
    "referenceQuery": "SELECT COUNT(*) AS n FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1);"
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);\nINSERT INTO employees VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "sql-practice-32": {
    "referenceQuery": "SELECT COUNT(*) AS n FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1);"
      },
      {
        "id": "hidden-empty-employees",
        "label": "Empty employee table",
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);",
        "isHidden": true
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);\nINSERT INTO employees VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "sql-practice-33": {
    "referenceQuery": "SELECT COUNT(*) AS n FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1);"
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);\nINSERT INTO employees VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "sql-practice-34": {
    "referenceQuery": "SELECT COUNT(*) AS n FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1);"
      },
      {
        "id": "hidden-salary-ties",
        "label": "Tied ranking values",
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','Eng','active',100),(2,'B','Eng','active',100),(3,'C','Eng','active',90);",
        "isHidden": true
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);\nINSERT INTO employees VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "sql-practice-35": {
    "referenceQuery": "SELECT COUNT(*) AS n FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1);"
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);\nINSERT INTO employees VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "sql-practice-36": {
    "referenceQuery": "SELECT COUNT(*) AS n FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1);"
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);\nINSERT INTO employees VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "sql-practice-37": {
    "referenceQuery": "SELECT COUNT(*) AS n FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1);"
      },
      {
        "id": "hidden-empty-employees",
        "label": "Empty employee table",
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);",
        "isHidden": true
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);\nINSERT INTO employees VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "sql-practice-38": {
    "referenceQuery": "SELECT COUNT(*) AS n FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1);"
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);\nINSERT INTO employees VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "sql-practice-39": {
    "referenceQuery": "SELECT COUNT(*) AS n FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1);"
      },
      {
        "id": "hidden-salary-ties",
        "label": "Tied ranking values",
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','Eng','active',100),(2,'B','Eng','active',100),(3,'C','Eng','active',90);",
        "isHidden": true
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);\nINSERT INTO employees VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "sql-practice-40": {
    "referenceQuery": "SELECT COUNT(*) AS n FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1);"
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);\nINSERT INTO employees VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "sql-practice-41": {
    "referenceQuery": "SELECT COUNT(*) AS n FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1);"
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);\nINSERT INTO employees VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "sql-practice-42": {
    "referenceQuery": "SELECT COUNT(*) AS n FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1);"
      },
      {
        "id": "hidden-empty-employees",
        "label": "Empty employee table",
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);",
        "isHidden": true
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);\nINSERT INTO employees VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "sql-practice-43": {
    "referenceQuery": "SELECT COUNT(*) AS n FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1);"
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);\nINSERT INTO employees VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "sql-practice-44": {
    "referenceQuery": "SELECT COUNT(*) AS n FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1);"
      },
      {
        "id": "hidden-salary-ties",
        "label": "Tied ranking values",
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','Eng','active',100),(2,'B','Eng','active',100),(3,'C','Eng','active',90);",
        "isHidden": true
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);\nINSERT INTO employees VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "sql-practice-45": {
    "referenceQuery": "SELECT COUNT(*) AS n FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1);"
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);\nINSERT INTO employees VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "sql-practice-46": {
    "referenceQuery": "SELECT COUNT(*) AS n FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1);"
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);\nINSERT INTO employees VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "sql-practice-47": {
    "referenceQuery": "SELECT COUNT(*) AS n FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1);"
      },
      {
        "id": "hidden-empty-employees",
        "label": "Empty employee table",
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);",
        "isHidden": true
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);\nINSERT INTO employees VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "sql-practice-48": {
    "referenceQuery": "SELECT COUNT(*) AS n FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1);"
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);\nINSERT INTO employees VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "sql-practice-49": {
    "referenceQuery": "SELECT COUNT(*) AS n FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1);"
      },
      {
        "id": "hidden-salary-ties",
        "label": "Tied ranking values",
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','Eng','active',100),(2,'B','Eng','active',100),(3,'C','Eng','active',90);",
        "isHidden": true
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);\nINSERT INTO employees VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  },
  "sql-practice-50": {
    "referenceQuery": "SELECT COUNT(*) AS n FROM employees;",
    "tables": [
      {
        "label": "employees",
        "description": "Employees",
        "columns": [
          {
            "name": "employee_id",
            "type": "INT",
            "key": "PK"
          },
          {
            "name": "full_name",
            "type": "TEXT"
          },
          {
            "name": "department",
            "type": "TEXT"
          },
          {
            "name": "status",
            "type": "TEXT"
          },
          {
            "name": "salary",
            "type": "INT"
          },
          {
            "name": "manager_id",
            "type": "INT"
          },
          {
            "name": "hire_date",
            "type": "TEXT"
          }
        ]
      }
    ],
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
      "maxOutputRows": 10000,
      "maxFixtureCount": 8
    },
    "fixtures": [
      {
        "id": "public",
        "label": "Public dataset",
        "isHidden": false,
        "initSql": "CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);\nINSERT INTO employees VALUES (1,'A','E','active',1);"
      },
      {
        "id": "hidden-minimal-rows",
        "label": "Minimal dataset",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);\nINSERT INTO employees VALUES (1,'only');",
        "isHidden": true
      },
      {
        "id": "hidden-empty-table",
        "label": "Empty primary table",
        "initSql": "CREATE TABLE employees (id INT, value TEXT);",
        "isHidden": true
      }
    ]
  }
};

export function getSqlMultiFixtureSeed(slug: string): SqlProblemSeed | null {
  return SQL_MULTI_FIXTURES[slug] ?? null;
}

export function hasSqlMultiFixtureSeed(slug: string): boolean {
  return slug in SQL_MULTI_FIXTURES;
}

export const SQL_MULTI_FIXTURE_SLUGS = Object.keys(SQL_MULTI_FIXTURES);
