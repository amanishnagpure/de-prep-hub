/** Seed DDL + data for in-browser sql.js playground (SQLite syntax). */

export const SQL_PLAYGROUND_INIT = `
CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT,
  department TEXT,
  department_id INTEGER,
  salary REAL,
  manager_id INTEGER,
  hire_date TEXT,
  phone TEXT
);

CREATE TABLE departments (
  id INTEGER PRIMARY KEY,
  name TEXT,
  location TEXT
);

CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name TEXT,
  city TEXT,
  country TEXT
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT,
  category TEXT,
  price REAL
);

CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  product_id INTEGER,
  amount REAL,
  order_date TEXT,
  status TEXT
);

INSERT INTO departments VALUES
  (1, 'IT', 'Bangalore'),
  (2, 'HR', 'Mumbai'),
  (3, 'Finance', 'Delhi'),
  (4, 'Sales', 'Chennai');

INSERT INTO employees VALUES
  (1, 'Alice', 'IT', 1, 9000, NULL, '2020-01-15', '111-0001'),
  (2, 'Bob', 'IT', 1, 7500, 1, '2021-03-20', '111-0002'),
  (3, 'Carol', 'HR', 2, 6000, NULL, '2019-06-10', NULL),
  (4, 'David', 'Finance', 3, 8200, NULL, '2018-11-05', '111-0004'),
  (5, 'Eve', 'IT', 1, 7800, 1, '2022-07-01', '111-0005'),
  (6, 'Frank', 'Sales', 4, 6500, NULL, '2023-02-14', '111-0006'),
  (7, 'Grace', 'Sales', 4, 7200, 6, '2021-09-30', NULL),
  (8, 'Henry', 'Finance', 3, 9500, 4, '2017-04-22', '111-0008');

INSERT INTO customers VALUES
  (1, 'Acme Corp', 'Mumbai', 'India'),
  (2, 'Globex', 'Delhi', 'India'),
  (3, 'Initech', 'Bangalore', 'India'),
  (4, 'Umbrella', 'Chennai', 'India');

INSERT INTO products VALUES
  (1, 'Laptop', 'Electronics', 1200),
  (2, 'Monitor', 'Electronics', 350),
  (3, 'Desk Chair', 'Furniture', 180),
  (4, 'Notebook', 'Stationery', 5);

INSERT INTO orders VALUES
  (101, 1, 1, 2400, '2024-01-10', 'completed'),
  (102, 1, 2, 700, '2024-02-15', 'completed'),
  (103, 2, 1, 1200, '2024-01-20', 'completed'),
  (104, 3, 3, 360, '2024-03-01', 'pending'),
  (105, 4, 4, 25, '2024-03-05', 'completed'),
  (106, 2, 2, 350, '2024-04-12', 'completed'),
  (107, 3, 1, 1200, '2024-05-18', 'cancelled');
`;

export const SQL_PLAYGROUND_TABLES = [
  "employees",
  "departments",
  "customers",
  "products",
  "orders",
] as const;
