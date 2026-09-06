import type { SqlPracticeSeed } from "@/data/sql-practice-problem-seeds";

export const SEEDS_BATCH3: Record<string, SqlPracticeSeed> = {
  "average-order-value": {
    init: `
CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,10,100,'2024-01-01','shipped'),(2,10,200,'2024-01-02','shipped'),(3,20,50,'2024-01-01','shipped');
`,
    referenceQuery: `SELECT customer_id, AVG(amount) AS avg_order_value FROM orders GROUP BY customer_id ORDER BY customer_id;`,
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
                  }
            ]
      }
],
  },

  "first-order-per-customer": {
    init: `
CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,10,100,'2024-01-05','shipped'),(2,10,50,'2024-02-01','shipped'),(3,20,75,'2024-01-10','shipped');
`,
    referenceQuery: `SELECT customer_id, MIN(order_date) AS first_order_date FROM orders GROUP BY customer_id ORDER BY customer_id;`,
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
                  }
            ]
      }
],
  },

  "duplicate-email-addresses": {
    init: `
CREATE TABLE customers (customer_id INT, email TEXT, name TEXT);
INSERT INTO customers VALUES (1,'a@x.com','A'),(2,'a@x.com','B'),(3,'b@y.com','C');
`,
    referenceQuery: `SELECT email, COUNT(*) AS account_count FROM customers WHERE email IS NOT NULL GROUP BY email HAVING COUNT(*) > 1;`,
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
                  }
            ]
      }
],
  },

  "revenue-by-region": {
    init: `
CREATE TABLE customers (customer_id INT, name TEXT, region TEXT);
CREATE TABLE orders (order_id INT, customer_id INT, amount INT);
INSERT INTO customers VALUES (10,'Ada','US'),(20,'Bob','EU');
INSERT INTO orders VALUES (1,10,100),(2,10,50),(3,20,200);
`,
    referenceQuery: `SELECT c.region, SUM(o.amount) AS revenue FROM orders o JOIN customers c ON o.customer_id = c.customer_id GROUP BY c.region;`,
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
                  }
            ]
      },
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
                  }
            ]
      }
],
  },

  "products-never-ordered": {
    init: `
CREATE TABLE products (product_id TEXT, product_name TEXT);
CREATE TABLE order_lines (product_id TEXT, amount INT);
INSERT INTO products VALUES ('A','Widget'),('B','Gadget');
INSERT INTO order_lines VALUES ('A',100);
`,
    referenceQuery: `SELECT p.product_id, p.product_name FROM products p LEFT JOIN order_lines ol ON p.product_id = ol.product_id WHERE ol.product_id IS NULL;`,
    tables: [
      {
            label: "products",
            description: "Products",
            columns: [
                  {
                        name: "product_id",
                        type: "TEXT"
                  },
                  {
                        name: "product_name",
                        type: "TEXT"
                  }
            ]
      },
      {
            label: "order_lines",
            description: "Order lines",
            columns: [
                  {
                        name: "product_id",
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

  "recent-active-users": {
    init: `
CREATE TABLE events (user_id INT, event_date TEXT, event_type TEXT);
INSERT INTO events VALUES (1,'2024-01-08','click'),(2,'2024-01-01','view'),(3,'2024-01-09','click');
`,
    referenceQuery: `SELECT DISTINCT user_id AS active_user_id FROM events WHERE event_date >= date((SELECT MAX(event_date) FROM events), '-6 days');`,
    tables: [
      {
            label: "events",
            description: "Events",
            columns: [
                  {
                        name: "user_id",
                        type: "INT"
                  },
                  {
                        name: "event_type",
                        type: "TEXT"
                  }
            ]
      }
],
  },

  "order-count-by-status": {
    init: `
CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,1,10,'2024-01-01','pending'),(2,1,20,'2024-01-01','pending'),(3,2,30,'2024-01-02','shipped');
`,
    referenceQuery: `SELECT status, COUNT(*) AS order_count FROM orders GROUP BY status;`,
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
                  }
            ]
      }
],
  },

  "salary-band-count": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',60000),(2,'B','E','active',80000),(3,'C','E','active',100000);
`,
    referenceQuery: `SELECT band, COUNT(*) AS headcount FROM (
  SELECT CASE WHEN salary < 70000 THEN 'low' WHEN salary < 90000 THEN 'mid' ELSE 'high' END AS band
  FROM employees WHERE status = 'active'
) t GROUP BY band;`,
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
                        name: "status",
                        type: "TEXT"
                  }
            ]
      }
],
  },

  "email-domain-extract": {
    init: `
CREATE TABLE customers (customer_id INT, email TEXT, name TEXT);
INSERT INTO customers VALUES (1,'a@company.com','A'),(2,NULL,'B');
`,
    referenceQuery: `SELECT customer_id, SUBSTR(email, INSTR(email, '@') + 1) AS domain FROM customers WHERE email IS NOT NULL;`,
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
                  }
            ]
      }
],
  },

  "rolling-3-day-average": {
    init: `
CREATE TABLE daily_revenue (order_date TEXT, amount INT);
INSERT INTO daily_revenue VALUES ('2024-01-01',10),('2024-01-02',20),('2024-01-03',30);
`,
    referenceQuery: `SELECT order_date, amount,
AVG(amount) OVER (ORDER BY order_date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS rolling_avg
FROM daily_revenue ORDER BY order_date;`,
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

  "dedupe-staging-rows": {
    init: `
CREATE TABLE staging (id INT, value TEXT);
INSERT INTO staging VALUES (1,'A'),(2,'A'),(3,'B');
`,
    referenceQuery: `SELECT id, value FROM (
  SELECT id, value, ROW_NUMBER() OVER (PARTITION BY value ORDER BY id) AS rn FROM staging
) t WHERE rn = 1;`,
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

  "customers-missing-email": {
    init: `
CREATE TABLE customers (customer_id INT, name TEXT, email TEXT);
INSERT INTO customers VALUES (1,'Ada','a@x.com'),(2,'Bob',NULL);
`,
    referenceQuery: `SELECT customer_id, name FROM customers WHERE email IS NULL;`,
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
                  }
            ]
      }
],
  },

  "total-revenue": {
    init: `
CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,1,10,'2024-01-01','shipped'),(2,1,20,'2024-01-02','shipped'),(3,2,30,'2024-01-02','shipped');
`,
    referenceQuery: `SELECT SUM(amount) AS total_revenue FROM orders;`,
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
                  }
            ]
      }
],
  },

  "rank-orders-per-customer": {
    init: `
CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,10,50,'2024-01-01','shipped'),(2,10,100,'2024-01-02','shipped');
`,
    referenceQuery: `SELECT order_id, customer_id, amount,
ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY amount DESC) AS rn
FROM orders;`,
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
                  }
            ]
      }
],
  },

  "union-daily-snapshots": {
    init: `
CREATE TABLE snapshot_a (metric_date TEXT, value INT);
CREATE TABLE snapshot_b (metric_date TEXT, value INT);
INSERT INTO snapshot_a VALUES ('2024-01-01',10);
INSERT INTO snapshot_b VALUES ('2024-01-02',5);
`,
    referenceQuery: `SELECT metric_date, value, 'a' AS source FROM snapshot_a
UNION ALL
SELECT metric_date, value, 'b' AS source FROM snapshot_b;`,
    tables: [
      {
            label: "snapshot_a",
            description: "Snapshot A",
            columns: [
                  {
                        name: "metric_date",
                        type: "TEXT"
                  },
                  {
                        name: "value",
                        type: "INT"
                  }
            ]
      },
      {
            label: "snapshot_b",
            description: "Snapshot B",
            columns: [
                  {
                        name: "metric_date",
                        type: "TEXT"
                  },
                  {
                        name: "value",
                        type: "INT"
                  }
            ]
      }
],
  },

  "orders-above-average": {
    init: `
CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,1,10,'2024-01-01','shipped'),(2,1,20,'2024-01-02','shipped'),(3,2,30,'2024-01-02','shipped');
`,
    referenceQuery: `SELECT order_id, amount FROM orders WHERE amount > (SELECT AVG(amount) FROM orders);`,
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
                  }
            ]
      }
],
  },

  "warehouse-low-stock": {
    init: `
CREATE TABLE products (product_id INT, product_name TEXT, stock_qty INT, reorder_level INT);
INSERT INTO products VALUES (1,'Widget',5,10),(2,'Gadget',20,10);
`,
    referenceQuery: `SELECT product_id, product_name, stock_qty, reorder_level FROM products WHERE stock_qty < reorder_level;`,
    tables: [
      {
            label: "products",
            description: "Products",
            columns: [
                  {
                        name: "product_id",
                        type: "TEXT"
                  },
                  {
                        name: "product_name",
                        type: "TEXT"
                  }
            ]
      }
],
  },

  "funnel-step-counts": {
    init: `
CREATE TABLE events (user_id INT, event_date TEXT, event_type TEXT);
INSERT INTO events VALUES (1,'2024-01-01','click'),(2,'2024-01-01','click'),(3,'2024-01-01','view');
`,
    referenceQuery: `SELECT event_type, COUNT(DISTINCT user_id) AS user_count FROM events GROUP BY event_type;`,
    tables: [
      {
            label: "events",
            description: "Events",
            columns: [
                  {
                        name: "user_id",
                        type: "INT"
                  },
                  {
                        name: "event_type",
                        type: "TEXT"
                  }
            ]
      }
],
  },

  "data-freshness-timestamp": {
    init: `
CREATE TABLE ingestion_log (table_name TEXT, updated_at TEXT);
INSERT INTO ingestion_log VALUES ('orders','2024-01-01'),('customers','2024-01-03');
`,
    referenceQuery: `SELECT MAX(updated_at) AS latest_update FROM ingestion_log;`,
    tables: [
      {
            label: "ingestion_log",
            description: "Ingestion log",
            columns: [
                  {
                        name: "table_name",
                        type: "TEXT"
                  },
                  {
                        name: "updated_at",
                        type: "TEXT"
                  }
            ]
      }
],
  },

  "active-pct-headcount": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, department TEXT, status TEXT, salary INT);
INSERT INTO employees VALUES (1,'A','E','active',1),(2,'B','E','active',1),(3,'C','E','active',1),(4,'D','E','inactive',1);
`,
    referenceQuery: `SELECT CAST(SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS REAL) / COUNT(*) AS active_pct FROM employees;`,
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
                        name: "status",
                        type: "TEXT"
                  }
            ]
      }
],
  },

  "running-order-count": {
    init: `
CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,1,10,'2024-01-01','shipped'),(2,1,20,'2024-01-01','shipped'),(3,2,30,'2024-01-02','shipped');
`,
    referenceQuery: `SELECT order_date, SUM(daily_cnt) OVER (ORDER BY order_date) AS running_count
FROM (SELECT order_date, COUNT(*) AS daily_cnt FROM orders GROUP BY order_date) d ORDER BY order_date;`,
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
                  }
            ]
      }
],
  },

  "exclude-cancelled-orders": {
    init: `
CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,1,10,'2024-01-01','pending'),(2,1,20,'2024-01-02','cancelled');
`,
    referenceQuery: `SELECT * FROM orders WHERE status != 'cancelled';`,
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
                  }
            ]
      }
],
  },

  "extract-order-year": {
    init: `
CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,1,100,'2023-06-01','shipped'),(2,1,200,'2024-01-01','shipped');
`,
    referenceQuery: `SELECT strftime('%Y', order_date) AS order_year, SUM(amount) AS total_amount FROM orders GROUP BY 1;`,
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
                  }
            ]
      }
],
  },

  "count-null-emails": {
    init: `
CREATE TABLE customers (customer_id INT, name TEXT, email TEXT);
INSERT INTO customers VALUES (1,'A','a@x.com'),(2,'B',NULL),(3,'C',NULL);
`,
    referenceQuery: `SELECT SUM(CASE WHEN email IS NULL THEN 1 ELSE 0 END) AS missing_email_count FROM customers;`,
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
                  }
            ]
      }
],
  },

  "january-revenue": {
    init: `
CREATE TABLE orders (order_id INT, customer_id INT, amount INT, order_date TEXT, status TEXT);
INSERT INTO orders VALUES (1,1,100,'2024-01-15','shipped'),(2,1,50,'2024-01-20','shipped'),(3,2,200,'2024-02-01','shipped');
`,
    referenceQuery: `SELECT SUM(amount) AS total_january_revenue FROM orders WHERE strftime('%m', order_date) = '01';`,
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
                  }
            ]
      }
],
  },

  "employees-without-manager": {
    init: `
CREATE TABLE employees (employee_id INT, full_name TEXT, manager_id INT);
INSERT INTO employees VALUES (1,'CEO',NULL),(2,'Alice',1);
`,
    referenceQuery: `SELECT employee_id, full_name FROM employees WHERE manager_id IS NULL;`,
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
                        name: "status",
                        type: "TEXT"
                  }
            ]
      }
],
  },
};
