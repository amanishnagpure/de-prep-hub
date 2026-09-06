import type { SqlPracticeSeed } from "@/data/sql-practice-problem-seeds";

export const SEEDS_BATCH4: Record<string, SqlPracticeSeed> = {
  "select-all-employees": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','Eng','active',90000);
`,
    referenceQuery: `SELECT * FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "order-salary-desc": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','Eng','active',100),(2,'B','Eng','active',200);
`,
    referenceQuery: `SELECT employee_id, full_name, salary FROM employees ORDER BY salary DESC;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "limit-top-3-salaries": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',100),(2,'B','E','active',200),(3,'C','E','active',150),(4,'D','E','active',50);
`,
    referenceQuery: `SELECT full_name, salary FROM employees ORDER BY salary DESC LIMIT 3;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "distinct-departments": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','Eng','active',1),(2,'B','Eng','active',2),(3,'C','Sales','active',3);
`,
    referenceQuery: `SELECT DISTINCT department FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "count-all-employees": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1),(2,'B','E','active',2);
`,
    referenceQuery: `SELECT COUNT(*) AS employee_count FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "filter-by-region": {
    init: `
CREATE TABLE customers (customer_id INT, name TEXT, region TEXT);
INSERT INTO customers VALUES (1,'Ada','US'),(2,'Bob','EU');
`,
    referenceQuery: `SELECT customer_id, name FROM customers WHERE region = 'US';`,
    tables: [
      {
            label: "customers",
            description: "Customers",
            columns: [
                  {
                        name: "customer_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "name",
                        type: "TEXT"
                  },
                  {
                        name: "region",
                        type: "TEXT"
                  }
            ]
      }
],
  },

  "salary-between-range": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',80000),(2,'B','E','active',50000);
`,
    referenceQuery: `SELECT full_name, salary FROM employees WHERE salary BETWEEN 70000 AND 90000;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "orders-in-status-list": {
    init: `
CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,1,10,'2024-01-01','pending'),(2,1,20,'2024-01-02','cancelled');
`,
    referenceQuery: `SELECT order_id, status FROM orders WHERE status IN ('pending','shipped');`,
    tables: [
      {
            label: "orders",
            description: "Order facts",
            columns: [
                  {
                        name: "order_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "customer_id",
                        type: "INT"
                  },
                  {
                        name: "amount",
                        type: "INT"
                  },
                  {
                        name: "order_date",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  }
            ]
      }
],
  },

  "names-like-prefix": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','E','active',1),(2,'Bob','E','active',2);
`,
    referenceQuery: `SELECT full_name FROM employees WHERE full_name LIKE 'A%';`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "max-salary-by-dept": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','Eng','active',100),(2,'B','Eng','active',200),(3,'C','Sales','active',150);
`,
    referenceQuery: `SELECT department, MAX(salary) AS max_salary FROM employees GROUP BY department;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "having-high-volume-customers": {
    init: `
CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,10,100,'2024-01-01','shipped'),(2,10,50,'2024-01-02','shipped'),(3,20,30,'2024-01-01','shipped');
`,
    referenceQuery: `SELECT customer_id, COUNT(*) AS order_count FROM orders GROUP BY customer_id HAVING COUNT(*) >= 2;`,
    tables: [
      {
            label: "orders",
            description: "Order facts",
            columns: [
                  {
                        name: "order_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "customer_id",
                        type: "INT"
                  },
                  {
                        name: "amount",
                        type: "INT"
                  },
                  {
                        name: "order_date",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  }
            ]
      }
],
  },

  "right-join-all-customers": {
    init: `
CREATE TABLE customers (customer_id INT, name TEXT, region TEXT);
CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO customers VALUES (10,'Ada','US'),(20,'Bob','EU');
INSERT INTO orders VALUES (1,10,100,'2024-01-01','shipped');
`,
    referenceQuery: `SELECT c.customer_id, c.name, COUNT(o.order_id) AS order_count FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.customer_id, c.name;`,
    tables: [
      {
            label: "customers",
            description: "Customers",
            columns: [
                  {
                        name: "customer_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "name",
                        type: "TEXT"
                  },
                  {
                        name: "region",
                        type: "TEXT"
                  }
            ]
      },
      {
            label: "orders",
            description: "Order facts",
            columns: [
                  {
                        name: "order_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "customer_id",
                        type: "INT"
                  },
                  {
                        name: "amount",
                        type: "INT"
                  },
                  {
                        name: "order_date",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  }
            ]
      }
],
  },

  "exists-customer-orders": {
    init: `
CREATE TABLE customers (customer_id INT, name TEXT, region TEXT);
CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO customers VALUES (10,'Ada','US'),(20,'Bob','EU');
INSERT INTO orders VALUES (1,10,100,'2024-01-01','shipped');
`,
    referenceQuery: `SELECT customer_id, name FROM customers c WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id);`,
    tables: [
      {
            label: "customers",
            description: "Customers",
            columns: [
                  {
                        name: "customer_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "name",
                        type: "TEXT"
                  },
                  {
                        name: "region",
                        type: "TEXT"
                  }
            ]
      },
      {
            label: "orders",
            description: "Order facts",
            columns: [
                  {
                        name: "order_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "customer_id",
                        type: "INT"
                  },
                  {
                        name: "amount",
                        type: "INT"
                  },
                  {
                        name: "order_date",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  }
            ]
      }
],
  },

  "cte-active-employees": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','Eng','active',1),(2,'B','Eng','inactive',2);
`,
    referenceQuery: `WITH active AS (SELECT * FROM employees WHERE status = 'active') SELECT department, COUNT(*) AS cnt FROM active GROUP BY department;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "dense-rank-salary": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',100),(2,'B','E','active',100),(3,'C','E','active',90);
`,
    referenceQuery: `SELECT full_name, salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS dr FROM employees WHERE status='active';`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "lead-next-day-revenue": {
    init: `
CREATE TABLE daily_revenue (order_date TEXT, amount INT);
INSERT INTO daily_revenue VALUES ('2024-01-01',100),('2024-01-02',150);
`,
    referenceQuery: `SELECT order_date, amount, LEAD(amount) OVER (ORDER BY order_date) AS next_amount FROM daily_revenue ORDER BY order_date;`,
    tables: [
      {
            label: "daily_revenue",
            description: "Daily revenue",
            columns: [
                  {
                        name: "order_date",
                        type: "TEXT"
                  },
                  {
                        name: "amount",
                        type: "INT"
                  }
            ]
      }
],
  },

  "weekday-from-date": {
    init: `
CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,1,10,'2024-01-01','shipped');
`,
    referenceQuery: `SELECT order_id, strftime('%w', order_date) AS weekday FROM orders;`,
    tables: [
      {
            label: "orders",
            description: "Order facts",
            columns: [
                  {
                        name: "order_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "customer_id",
                        type: "INT"
                  },
                  {
                        name: "amount",
                        type: "INT"
                  },
                  {
                        name: "order_date",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  }
            ]
      }
],
  },

  "concat-full-name": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'Alice','Eng','active',1);
`,
    referenceQuery: `SELECT employee_id, full_name || ' (' || department || ')' AS label FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "replace-null-city": {
    init: `
CREATE TABLE customers_ext (customer_id INT, city TEXT);
INSERT INTO customers_ext VALUES (1,'NYC'),(2,NULL);
`,
    referenceQuery: `SELECT customer_id, COALESCE(city, 'Unknown') AS city FROM customers_ext;`,
    tables: [
      {
            label: "customers_ext",
            description: "Customers extended",
            columns: [
                  {
                        name: "customer_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "city",
                        type: "TEXT"
                  }
            ]
      }
],
  },

  "intersect-regions": {
    init: `
CREATE TABLE customers_a (customer_id INT, region TEXT);
CREATE TABLE customers_b (customer_id INT, region TEXT);
INSERT INTO customers_a VALUES (1,'US'),(2,'EU');
INSERT INTO customers_b VALUES (3,'US');
`,
    referenceQuery: `SELECT region FROM customers_a INTERSECT SELECT region FROM customers_b;`,
    tables: [
      {
            label: "customers_a",
            description: "Customers set A",
            columns: [
                  {
                        name: "customer_id",
                        type: "INT"
                  },
                  {
                        name: "region",
                        type: "TEXT"
                  }
            ]
      },
      {
            label: "customers_b",
            description: "Customers set B",
            columns: [
                  {
                        name: "customer_id",
                        type: "INT"
                  },
                  {
                        name: "region",
                        type: "TEXT"
                  }
            ]
      }
],
  },

  "keep-latest-staging-id": {
    init: `
CREATE TABLE staging (id INT, value TEXT);
INSERT INTO staging VALUES (1,'A'),(2,'A');
`,
    referenceQuery: `SELECT id, value FROM (SELECT id, value, ROW_NUMBER() OVER (PARTITION BY value ORDER BY id DESC) AS rn FROM staging) t WHERE rn=1;`,
    tables: [
      {
            label: "staging",
            description: "Staging",
            columns: [
                  {
                        name: "id",
                        type: "INT"
                  },
                  {
                        name: "value",
                        type: "TEXT"
                  }
            ]
      }
],
  },

  "duplicate-order-ids": {
    init: `
CREATE TABLE orders_dup (order_id INT, amount INT);
INSERT INTO orders_dup VALUES (1,10),(1,20),(2,5);
`,
    referenceQuery: `SELECT order_id, COUNT(*) AS cnt FROM orders_dup GROUP BY order_id HAVING COUNT(*) > 1;`,
    tables: [
      {
            label: "orders_dup",
            description: "Orders with duplicates",
            columns: [
                  {
                        name: "order_id",
                        type: "INT"
                  },
                  {
                        name: "amount",
                        type: "INT"
                  }
            ]
      }
],
  },

  "ntile-quartile-revenue": {
    init: `
CREATE TABLE daily_revenue (order_date TEXT, amount INT);
INSERT INTO daily_revenue VALUES ('2024-01-01',10),('2024-01-02',20),('2024-01-03',30),('2024-01-04',40);
`,
    referenceQuery: `SELECT order_date, amount, NTILE(4) OVER (ORDER BY amount) AS quartile FROM daily_revenue;`,
    tables: [
      {
            label: "daily_revenue",
            description: "Daily revenue",
            columns: [
                  {
                        name: "order_date",
                        type: "TEXT"
                  },
                  {
                        name: "amount",
                        type: "INT"
                  }
            ]
      }
],
  },

  "scd2-as-of-date": {
    init: `
CREATE TABLE customer_scd2_pt (customer_id INT, city TEXT, effective_from TEXT, effective_to TEXT);
INSERT INTO customer_scd2_pt VALUES (1,'NYC','2024-01-01','2024-06-01'),(1,'Boston','2024-06-01',NULL);
`,
    referenceQuery: `SELECT customer_id, city FROM customer_scd2_pt WHERE '2024-03-01' >= effective_from AND (effective_to IS NULL OR '2024-03-01' < effective_to);`,
    tables: [
      {
            label: "customer_scd2_pt",
            description: "SCD2 customer history",
            columns: [
                  {
                        name: "customer_id",
                        type: "INT"
                  },
                  {
                        name: "city",
                        type: "TEXT"
                  },
                  {
                        name: "effective_from",
                        type: "TEXT"
                  },
                  {
                        name: "effective_to",
                        type: "TEXT"
                  }
            ]
      }
],
  },

  "incremental-yesterday": {
    init: `
CREATE TABLE fact_events (event_id INT, event_date TEXT, metric INT);
INSERT INTO fact_events VALUES (1,'2024-01-01',1),(2,'2024-01-02',2);
`,
    referenceQuery: `SELECT * FROM fact_events WHERE event_date = date((SELECT MAX(event_date) FROM fact_events), '-1 day');`,
    tables: [
      {
            label: "fact_events",
            description: "Fact events",
            columns: [
                  {
                        name: "event_id",
                        type: "INT"
                  },
                  {
                        name: "event_date",
                        type: "TEXT"
                  },
                  {
                        name: "metric",
                        type: "INT"
                  }
            ]
      }
],
  },

  "sql-practice-26": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1);
`,
    referenceQuery: `SELECT COUNT(*) AS n FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "sql-practice-27": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1);
`,
    referenceQuery: `SELECT COUNT(*) AS n FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "sql-practice-28": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1);
`,
    referenceQuery: `SELECT COUNT(*) AS n FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "sql-practice-29": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1);
`,
    referenceQuery: `SELECT COUNT(*) AS n FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "sql-practice-30": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1);
`,
    referenceQuery: `SELECT COUNT(*) AS n FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "sql-practice-31": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1);
`,
    referenceQuery: `SELECT COUNT(*) AS n FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "sql-practice-32": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1);
`,
    referenceQuery: `SELECT COUNT(*) AS n FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "sql-practice-33": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1);
`,
    referenceQuery: `SELECT COUNT(*) AS n FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "sql-practice-34": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1);
`,
    referenceQuery: `SELECT COUNT(*) AS n FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "sql-practice-35": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1);
`,
    referenceQuery: `SELECT COUNT(*) AS n FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "sql-practice-36": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1);
`,
    referenceQuery: `SELECT COUNT(*) AS n FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "sql-practice-37": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1);
`,
    referenceQuery: `SELECT COUNT(*) AS n FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "sql-practice-38": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1);
`,
    referenceQuery: `SELECT COUNT(*) AS n FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "sql-practice-39": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1);
`,
    referenceQuery: `SELECT COUNT(*) AS n FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "sql-practice-40": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1);
`,
    referenceQuery: `SELECT COUNT(*) AS n FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "sql-practice-41": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1);
`,
    referenceQuery: `SELECT COUNT(*) AS n FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "sql-practice-42": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1);
`,
    referenceQuery: `SELECT COUNT(*) AS n FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "sql-practice-43": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1);
`,
    referenceQuery: `SELECT COUNT(*) AS n FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "sql-practice-44": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1);
`,
    referenceQuery: `SELECT COUNT(*) AS n FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "sql-practice-45": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1);
`,
    referenceQuery: `SELECT COUNT(*) AS n FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "sql-practice-46": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1);
`,
    referenceQuery: `SELECT COUNT(*) AS n FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "sql-practice-47": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1);
`,
    referenceQuery: `SELECT COUNT(*) AS n FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "sql-practice-48": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1);
`,
    referenceQuery: `SELECT COUNT(*) AS n FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "sql-practice-49": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1);
`,
    referenceQuery: `SELECT COUNT(*) AS n FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },

  "sql-practice-50": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1);
`,
    referenceQuery: `SELECT COUNT(*) AS n FROM employees;`,
    tables: [
      {
            label: "employees",
            description: "Employees",
            columns: [
                  {
                        name: "employee_id",
                        type: "INT",
                        key: "PK"
                  },
                  {
                        name: "full_name",
                        type: "TEXT"
                  },
                  {
                        name: "department",
                        type: "TEXT"
                  },
                  {
                        name: "status",
                        type: "TEXT"
                  },
                  {
                        name: "salary",
                        type: "INT"
                  }
            ]
      }
],
  },
};
