export type SqlPracticeSeed = {
  init: string;
  referenceQuery: string;
  allowMutations?: boolean;
  tables: { label: string; description: string; columns: { name: string; type: string; key?: string }[] }[];
};

const SEEDS: Record<string, SqlPracticeSeed> = {
  "recyclable-and-low-fat-products": {
    init: `
CREATE TABLE Products (product_id INT, low_fats TEXT, recyclable TEXT);
INSERT INTO Products VALUES (1,'Y','N'),(2,'Y','Y'),(3,'N','Y'),(4,'Y','Y');
`,
    referenceQuery: `SELECT product_id FROM Products WHERE low_fats = 'Y' AND recyclable = 'Y';`,
    tables: [{
      label: "Products",
      description: "Product flags",
      columns: [
        { name: "product_id", type: "INT", key: "PK" },
        { name: "low_fats", type: "TEXT" },
        { name: "recyclable", type: "TEXT" },
      ],
    }],
  },
  "find-customer-referee": {
    init: `
CREATE TABLE Customer (id INT, name TEXT, referee INT);
INSERT INTO Customer VALUES (1,'Alice',2),(2,'Bob',NULL),(3,'Carol',3),(4,'Dan',NULL);
`,
    referenceQuery: `SELECT name FROM Customer WHERE referee <> 2 OR referee IS NULL;`,
    tables: [{
      label: "Customer",
      description: "Customer referrals",
      columns: [
        { name: "id", type: "INT", key: "PK" },
        { name: "name", type: "TEXT" },
        { name: "referee", type: "INT" },
      ],
    }],
  },
  "big-countries": {
    init: `
CREATE TABLE World (name TEXT, continent TEXT, area INT, population INT, gdp INT);
INSERT INTO World VALUES
 ('China','Asia',9387209,1411780000,0),
 ('India','Asia',3287263,1366410000,0),
 ('USA','North America',9826675,331002651,0),
 ('Monaco','Europe',2,39244,0);
`,
    referenceQuery: `SELECT name, population, area FROM World WHERE area >= 3000000 OR population >= 25000000;`,
    tables: [{
      label: "World",
      description: "Country stats",
      columns: [
        { name: "name", type: "TEXT" },
        { name: "continent", type: "TEXT" },
        { name: "area", type: "INT" },
        { name: "population", type: "INT" },
        { name: "gdp", type: "INT" },
      ],
    }],
  },
  "article-views-i": {
    init: `
CREATE TABLE Views (article_id INT, author_id INT, viewer_id INT, view_date TEXT);
INSERT INTO Views VALUES
 (1,3,3,'2024-01-01'),(2,3,3,'2024-01-02'),(3,4,4,'2024-01-01'),(4,7,7,'2024-01-01'),(5,7,7,'2024-01-02'),(6,7,7,'2024-01-03');
`,
    referenceQuery: `SELECT author_id AS id FROM Views WHERE author_id = viewer_id GROUP BY author_id HAVING COUNT(*) > 1;`,
    tables: [{
      label: "Views",
      description: "Article views",
      columns: [
        { name: "article_id", type: "INT" },
        { name: "author_id", type: "INT" },
        { name: "viewer_id", type: "INT" },
        { name: "view_date", type: "TEXT" },
      ],
    }],
  },
  "invalid-tweets": {
    init: `
CREATE TABLE Tweets (tweet_id INT, content TEXT);
INSERT INTO Tweets VALUES (1,'Vote for Biden'),(2,'Let us make America great again!'),(3,'Short');
`,
    referenceQuery: `SELECT tweet_id FROM Tweets WHERE LENGTH(content) > 15;`,
    tables: [{
      label: "Tweets",
      description: "Tweet content",
      columns: [
        { name: "tweet_id", type: "INT", key: "PK" },
        { name: "content", type: "TEXT" },
      ],
    }],
  },
  "rearrange-products-table": {
    init: `
CREATE TABLE Products (product_id INT, store1 INT, store2 INT, store3 INT);
INSERT INTO Products VALUES (1,100,200,300),(2,400,500,600);
`,
    referenceQuery: `
SELECT product_id, 'store1' AS store, store1 AS price FROM Products
UNION ALL SELECT product_id, 'store2', store2 FROM Products
UNION ALL SELECT product_id, 'store3', store3 FROM Products;
`,
    tables: [{
      label: "Products",
      description: "Prices per store column",
      columns: [
        { name: "product_id", type: "INT", key: "PK" },
        { name: "store1", type: "INT" },
        { name: "store2", type: "INT" },
        { name: "store3", type: "INT" },
      ],
    }],
  },
  "replace-employee-id-with-unique-identifier": {
    init: `
CREATE TABLE Employees (id INT, name TEXT);
CREATE TABLE EmployeeUNI (employee_id INT, unique_id INT);
INSERT INTO Employees VALUES (1,'Alice'),(2,'Bob'),(3,'Charlie');
INSERT INTO EmployeeUNI VALUES (1,101),(2,102),(3,103);
`,
    referenceQuery: `SELECT u.unique_id, e.name FROM Employees e JOIN EmployeeUNI u ON e.id = u.employee_id;`,
    tables: [
      {
        label: "Employees",
        description: "Employee names",
        columns: [
          { name: "id", type: "INT", key: "PK" },
          { name: "name", type: "TEXT" },
        ],
      },
      {
        label: "EmployeeUNI",
        description: "Unique id mapping",
        columns: [
          { name: "employee_id", type: "INT", key: "FK → Employees.id" },
          { name: "unique_id", type: "INT" },
        ],
      },
    ],
  },
  "product-sales-analysis-i": {
    init: `
CREATE TABLE Product (product_id INT, product_name TEXT);
CREATE TABLE Sales (sale_id INT, product_id INT, year INT, price INT);
INSERT INTO Product VALUES (100,'Nokia'),(200,'Apple'),(300,'Samsung');
INSERT INTO Sales VALUES (1,100,2008,7000),(2,100,2009,6000),(3,200,2011,9000);
`,
    referenceQuery: `SELECT p.product_name, s.year, s.price FROM Sales s JOIN Product p ON s.product_id = p.product_id;`,
    tables: [
      {
        label: "Product",
        description: "Products",
        columns: [
          { name: "product_id", type: "INT", key: "PK" },
          { name: "product_name", type: "TEXT" },
        ],
      },
      {
        label: "Sales",
        description: "Sales by year",
        columns: [
          { name: "sale_id", type: "INT", key: "PK" },
          { name: "product_id", type: "INT" },
          { name: "year", type: "INT" },
          { name: "price", type: "INT" },
        ],
      },
    ],
  },
  "customer-who-visited-but-did-not-transact": {
    init: `
CREATE TABLE Visits (visit_id INT, customer_id INT);
CREATE TABLE Transactions (transaction_id INT, visit_id INT, customer_id INT, amount INT);
INSERT INTO Visits VALUES (1,23),(2,9),(3,30),(4,30),(5,46),(6,46),(7,46);
INSERT INTO Transactions VALUES (1,1,23,300),(2,2,9,1000);
`,
    referenceQuery: `
SELECT v.customer_id, COUNT(*) AS count_no_trans
FROM Visits v
LEFT JOIN Transactions t ON v.visit_id = t.visit_id AND v.customer_id = t.customer_id
WHERE t.transaction_id IS NULL
GROUP BY v.customer_id;
`,
    tables: [
      {
        label: "Visits",
        description: "Store visits",
        columns: [
          { name: "visit_id", type: "INT", key: "PK" },
          { name: "customer_id", type: "INT" },
        ],
      },
      {
        label: "Transactions",
        description: "Visit transactions",
        columns: [
          { name: "transaction_id", type: "INT", key: "PK" },
          { name: "visit_id", type: "INT" },
          { name: "customer_id", type: "INT" },
          { name: "amount", type: "INT" },
        ],
      },
    ],
  },
  "rising-temperature": {
    init: `
CREATE TABLE Weather (id INT, recordDate TEXT, temperature INT);
INSERT INTO Weather VALUES
 (1,'2015-01-01',10),(2,'2015-01-02',25),(3,'2015-01-03',20),(4,'2015-01-04',30);
`,
    referenceQuery: `
SELECT w1.id
FROM Weather w1
JOIN Weather w2 ON julianday(w1.recordDate) - julianday(w2.recordDate) = 1
WHERE w1.temperature > w2.temperature;
`,
    tables: [{
      label: "Weather",
      description: "Daily temperatures",
      columns: [
        { name: "id", type: "INT", key: "PK" },
        { name: "recordDate", type: "TEXT" },
        { name: "temperature", type: "INT" },
      ],
    }],
  },
  "find-followers-count": {
    init: `
CREATE TABLE Followers (user_id INT, follower_id INT);
INSERT INTO Followers VALUES (1,10),(1,11),(1,12),(1,13),(2,20),(2,21);
`,
    referenceQuery: `SELECT user_id FROM Followers GROUP BY user_id HAVING COUNT(*) >= 3;`,
    tables: [{
      label: "Followers",
      description: "Follower relationships",
      columns: [
        { name: "user_id", type: "INT" },
        { name: "follower_id", type: "INT" },
      ],
    }],
  },
  "biggest-single-number": {
    init: `
CREATE TABLE MyNumbers (num INT);
INSERT INTO MyNumbers VALUES (8),(8),(3),(3),(3),(9),(4),(4),(4);
`,
    referenceQuery: `
SELECT MAX(num) AS num FROM (
  SELECT num FROM MyNumbers GROUP BY num HAVING COUNT(*) = 1
) x;
`,
    tables: [{
      label: "MyNumbers",
      description: "Number frequency",
      columns: [{ name: "num", type: "INT" }],
    }],
  },
  "project-employees-i": {
    init: `
CREATE TABLE Project (project_id INT, employee_id INT);
CREATE TABLE Employee (employee_id INT, name TEXT, experience_years INT);
INSERT INTO Project VALUES (1,1),(1,2),(1,3),(2,1),(2,4);
INSERT INTO Employee VALUES (1,'Khaled',3),(2,'Ali',2),(3,'John',1),(4,'Doe',2);
`,
    referenceQuery: `
SELECT p.project_id, ROUND(AVG(e.experience_years), 2) AS average_years
FROM Project p JOIN Employee e ON p.employee_id = e.employee_id
GROUP BY p.project_id;
`,
    tables: [
      {
        label: "Project",
        description: "Project assignments",
        columns: [
          { name: "project_id", type: "INT" },
          { name: "employee_id", type: "INT" },
        ],
      },
      {
        label: "Employee",
        description: "Employee experience",
        columns: [
          { name: "employee_id", type: "INT", key: "PK" },
          { name: "name", type: "TEXT" },
          { name: "experience_years", type: "INT" },
        ],
      },
    ],
  },
  "sales-analysis-iii": {
    init: `
CREATE TABLE Product (product_id INT, product_name TEXT);
CREATE TABLE Sales (product_id INT, year INT);
INSERT INTO Product VALUES (100,'Nokia'),(200,'Apple'),(300,'Samsung');
INSERT INTO Sales VALUES (100,2018),(100,2019),(200,2018),(300,2019);
`,
    referenceQuery: `
SELECT p.product_id, p.product_name
FROM Sales s JOIN Product p ON s.product_id = p.product_id
GROUP BY p.product_id, p.product_name
HAVING MIN(s.year) = 2018 AND MAX(s.year) = 2018;
`,
    tables: [
      {
        label: "Product",
        description: "Products",
        columns: [
          { name: "product_id", type: "INT", key: "PK" },
          { name: "product_name", type: "TEXT" },
        ],
      },
      {
        label: "Sales",
        description: "Sales years",
        columns: [
          { name: "product_id", type: "INT" },
          { name: "year", type: "INT" },
        ],
      },
    ],
  },
  "maximum-transaction-each-day": {
    init: `
CREATE TABLE Transactions (transaction_id INT, day TEXT, amount INT);
INSERT INTO Transactions VALUES
 (1,'2024-06-01',100),(2,'2024-06-01',150),(3,'2024-06-02',200),(4,'2024-06-02',180);
`,
    referenceQuery: `
SELECT transaction_id FROM (
  SELECT transaction_id,
    DENSE_RANK() OVER (PARTITION BY day ORDER BY amount DESC) AS dr
  FROM Transactions
) x WHERE dr = 1;
`,
    tables: [{
      label: "Transactions",
      description: "Daily transactions",
      columns: [
        { name: "transaction_id", type: "INT", key: "PK" },
        { name: "day", type: "TEXT" },
        { name: "amount", type: "INT" },
      ],
    }],
  },
  "second-highest-salary": {
    init: `
CREATE TABLE Employee (id INT, salary INT);
INSERT INTO Employee VALUES (1,100),(2,200),(3,300);
`,
    referenceQuery: `SELECT MAX(salary) AS SecondHighestSalary FROM Employee WHERE salary < (SELECT MAX(salary) FROM Employee);`,
    tables: [{
      label: "Employee",
      description: "Employee salaries",
      columns: [
        { name: "id", type: "INT", key: "PK" },
        { name: "salary", type: "INT" },
      ],
    }],
  },
  "nth-highest-salary": {
    init: `
CREATE TABLE Employee (id INT, salary INT);
INSERT INTO Employee VALUES (1,100),(2,200),(3,300),(4,200);
`,
    referenceQuery: `
SELECT salary FROM (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rk FROM Employee
) x WHERE rk = 2;
`,
    tables: [{
      label: "Employee",
      description: "Employee salaries",
      columns: [
        { name: "id", type: "INT", key: "PK" },
        { name: "salary", type: "INT" },
      ],
    }],
  },
  "rank-scores": {
    init: `
CREATE TABLE Scores (id INT, score REAL);
INSERT INTO Scores VALUES (1,3.5),(2,3.65),(3,4.0),(4,3.85),(5,4.0),(6,3.65);
`,
    referenceQuery: `SELECT score, RANK() OVER (ORDER BY score DESC) AS rank FROM Scores;`,
    tables: [{
      label: "Scores",
      description: "Exam scores",
      columns: [
        { name: "id", type: "INT", key: "PK" },
        { name: "score", type: "REAL" },
      ],
    }],
  },
  "consecutive-numbers": {
    init: `
CREATE TABLE Logs (id INT, num INT);
INSERT INTO Logs VALUES (1,1),(2,1),(3,1),(4,2),(5,1),(6,2),(7,2);
`,
    referenceQuery: `
SELECT DISTINCT l1.num AS ConsecutiveNums
FROM Logs l1
JOIN Logs l2 ON l1.id = l2.id - 1 AND l1.num = l2.num
JOIN Logs l3 ON l2.id = l3.id - 1 AND l2.num = l3.num;
`,
    tables: [{
      label: "Logs",
      description: "Number logs",
      columns: [
        { name: "id", type: "INT", key: "PK" },
        { name: "num", type: "INT" },
      ],
    }],
  },
  "employees-earning-more-than-managers": {
    init: `
CREATE TABLE Employee (id INT, name TEXT, salary INT, managerId INT);
INSERT INTO Employee VALUES (1,'Joe',70000,3),(2,'Henry',80000,4),(3,'Sam',60000,NULL),(4,'Max',90000,NULL);
`,
    referenceQuery: `
SELECT e1.name AS Employee
FROM Employee e1
JOIN Employee e2 ON e1.managerId = e2.id
WHERE e1.salary > e2.salary;
`,
    tables: [{
      label: "Employee",
      description: "Employee hierarchy",
      columns: [
        { name: "id", type: "INT", key: "PK" },
        { name: "name", type: "TEXT" },
        { name: "salary", type: "INT" },
        { name: "managerId", type: "INT" },
      ],
    }],
  },
  "duplicate-emails": {
    init: `
CREATE TABLE Person (id INT, email TEXT);
INSERT INTO Person VALUES (1,'a@x.com'),(2,'b@x.com'),(3,'a@x.com');
`,
    referenceQuery: `SELECT email FROM Person GROUP BY email HAVING COUNT(*) > 1;`,
    tables: [{
      label: "Person",
      description: "People and emails",
      columns: [
        { name: "id", type: "INT", key: "PK" },
        { name: "email", type: "TEXT" },
      ],
    }],
  },
  "customers-who-never-order": {
    init: `
CREATE TABLE Customers (id INT, name TEXT);
CREATE TABLE Orders (id INT, customerId INT);
INSERT INTO Customers VALUES (1,'Joe'),(2,'Henry'),(3,'Sam'),(4,'Max');
INSERT INTO Orders VALUES (1,3),(2,1);
`,
    referenceQuery: `
SELECT c.name AS Customers
FROM Customers c
LEFT JOIN Orders o ON c.id = o.customerId
WHERE o.id IS NULL;
`,
    tables: [
      {
        label: "Customers",
        description: "Customers",
        columns: [
          { name: "id", type: "INT", key: "PK" },
          { name: "name", type: "TEXT" },
        ],
      },
      {
        label: "Orders",
        description: "Customer orders",
        columns: [
          { name: "id", type: "INT", key: "PK" },
          { name: "customerId", type: "INT" },
        ],
      },
    ],
  },
  "department-highest-salary": {
    init: `
CREATE TABLE Employee (id INT, name TEXT, salary INT, departmentId INT);
CREATE TABLE Department (id INT, name TEXT);
INSERT INTO Department VALUES (1,'IT'),(2,'Sales');
INSERT INTO Employee VALUES (1,'Joe',85000,1),(2,'Henry',80000,2),(3,'Sam',60000,2),(4,'Max',90000,1),(5,'Janet',69000,1);
`,
    referenceQuery: `
SELECT d.name AS Department, e.name AS Employee, e.salary
FROM Employee e
JOIN Department d ON e.departmentId = d.id
WHERE e.salary = (SELECT MAX(salary) FROM Employee e2 WHERE e2.departmentId = e.departmentId);
`,
    tables: [
      {
        label: "Employee",
        description: "Employees by department",
        columns: [
          { name: "id", type: "INT", key: "PK" },
          { name: "name", type: "TEXT" },
          { name: "salary", type: "INT" },
          { name: "departmentId", type: "INT" },
        ],
      },
      {
        label: "Department",
        description: "Departments",
        columns: [
          { name: "id", type: "INT", key: "PK" },
          { name: "name", type: "TEXT" },
        ],
      },
    ],
  },
  "department-top-three-salaries": {
    init: `
CREATE TABLE Employee (id INT, name TEXT, salary INT, departmentId INT);
CREATE TABLE Department (id INT, name TEXT);
INSERT INTO Department VALUES (1,'IT'),(2,'Sales');
INSERT INTO Employee VALUES
 (1,'Joe',85000,1),(2,'Henry',80000,2),(3,'Sam',60000,2),(4,'Max',90000,1),(5,'Janet',69000,1),(6,'Randy',85000,2),(7,'Will',70000,1);
`,
    referenceQuery: `
SELECT d.name AS Department, e.name AS Employee, e.salary
FROM (
  SELECT *, DENSE_RANK() OVER (PARTITION BY departmentId ORDER BY salary DESC) AS dr
  FROM Employee
) e
JOIN Department d ON e.departmentId = d.id
WHERE e.dr <= 3;
`,
    tables: [
      {
        label: "Employee",
        description: "Employees by department",
        columns: [
          { name: "id", type: "INT", key: "PK" },
          { name: "name", type: "TEXT" },
          { name: "salary", type: "INT" },
          { name: "departmentId", type: "INT" },
        ],
      },
      {
        label: "Department",
        description: "Departments",
        columns: [
          { name: "id", type: "INT", key: "PK" },
          { name: "name", type: "TEXT" },
        ],
      },
    ],
  },
  "delete-duplicate-emails": {
    init: `
CREATE TABLE Person (id INT, email TEXT);
INSERT INTO Person VALUES (1,'a@x.com'),(2,'b@x.com'),(3,'a@x.com'),(4,'c@x.com'),(5,'a@x.com');
`,
    referenceQuery: `
SELECT p1.id, p1.email FROM Person p1
JOIN Person p2 ON p1.email = p2.email AND p1.id > p2.id;
`,
    allowMutations: true,
    tables: [{
      label: "Person",
      description: "People and emails",
      columns: [
        { name: "id", type: "INT", key: "PK" },
        { name: "email", type: "TEXT" },
      ],
    }],
  },
  "game-play-analysis-i": {
    init: `
CREATE TABLE Activity (player_id INT, device_id INT, event_date TEXT, games_played INT);
INSERT INTO Activity VALUES (1,2,'2016-03-01',5),(1,2,'2016-05-02',6),(2,3,'2017-06-25',1),(3,1,'2016-03-02',0),(3,4,'2018-07-03',5);
`,
    referenceQuery: `SELECT player_id, MIN(event_date) AS first_login FROM Activity GROUP BY player_id;`,
    tables: [{
      label: "Activity",
      description: "Player activity log",
      columns: [
        { name: "player_id", type: "INT" },
        { name: "device_id", type: "INT" },
        { name: "event_date", type: "TEXT" },
        { name: "games_played", type: "INT" },
      ],
    }],
  },
  "game-play-analysis-ii": {
    init: `
CREATE TABLE Activity (player_id INT, device_id INT, event_date TEXT, games_played INT);
INSERT INTO Activity VALUES
 (1,1,'2016-03-01',5),(1,1,'2016-03-02',2),
 (2,2,'2017-06-25',1),(3,3,'2016-03-02',0);
`,
    referenceQuery: `
WITH first AS (SELECT player_id, MIN(event_date) AS first_login FROM Activity GROUP BY player_id)
SELECT ROUND(
  1.0 * SUM(CASE WHEN julianday(a.event_date) - julianday(f.first_login) = 1 THEN 1 ELSE 0 END)
  / COUNT(DISTINCT f.player_id), 2
) AS fraction
FROM first f LEFT JOIN Activity a ON f.player_id = a.player_id;
`,
    tables: [{
      label: "Activity",
      description: "Player activity log",
      columns: [
        { name: "player_id", type: "INT" },
        { name: "device_id", type: "INT" },
        { name: "event_date", type: "TEXT" },
        { name: "games_played", type: "INT" },
      ],
    }],
  },
  "game-play-analysis-iii": {
    init: `
CREATE TABLE Activity (player_id INT, device_id INT, event_date TEXT, games_played INT);
INSERT INTO Activity VALUES
 (1,1,'2020-01-01',1),(1,1,'2020-01-02',1),(1,1,'2020-01-03',1),(1,1,'2020-01-04',1),(1,1,'2020-01-05',1),
 (2,2,'2020-01-01',1),(2,2,'2020-01-03',1);
`,
    referenceQuery: `
WITH d AS (
  SELECT player_id, event_date,
    DATE(julianday(event_date) - ROW_NUMBER() OVER (PARTITION BY player_id ORDER BY event_date)) AS grp
  FROM (SELECT DISTINCT player_id, event_date FROM Activity)
)
SELECT DISTINCT player_id FROM d GROUP BY player_id, grp HAVING COUNT(*) >= 5;
`,
    tables: [{
      label: "Activity",
      description: "Player activity log",
      columns: [
        { name: "player_id", type: "INT" },
        { name: "device_id", type: "INT" },
        { name: "event_date", type: "TEXT" },
        { name: "games_played", type: "INT" },
      ],
    }],
  },
  "game-play-analysis-iv": {
    init: `
CREATE TABLE Activity (player_id INT, device_id INT, event_date TEXT, games_played INT);
INSERT INTO Activity VALUES
 (1,1,'2016-03-01',0),(1,1,'2016-03-02',1),
 (2,2,'2016-03-01',0),(2,2,'2016-03-02',0);
`,
    referenceQuery: `
WITH first AS (SELECT player_id, MIN(event_date) AS install FROM Activity GROUP BY player_id)
SELECT a.install AS install_dt,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN julianday(b.event_date) - julianday(a.install) = 1 THEN b.player_id END)
    / COUNT(DISTINCT a.player_id), 2) AS percentage
FROM first a JOIN Activity b ON a.player_id = b.player_id
GROUP BY a.install;
`,
    tables: [{
      label: "Activity",
      description: "Player activity log",
      columns: [
        { name: "player_id", type: "INT" },
        { name: "device_id", type: "INT" },
        { name: "event_date", type: "TEXT" },
        { name: "games_played", type: "INT" },
      ],
    }],
  },
  "managers-with-at-least-5-direct-reports": {
    init: `
CREATE TABLE Employee (id INT, name TEXT, department TEXT, managerId INT);
INSERT INTO Employee VALUES
 (101,'Alice','IT',1),(102,'Bob','IT',1),(103,'Carol','IT',1),(104,'Dan','IT',1),(105,'Eve','IT',1),(106,'Frank','IT',1),
 (1,'CEO','Exec',NULL);
`,
    referenceQuery: `
SELECT e2.name FROM Employee e1
JOIN Employee e2 ON e1.managerId = e2.id
GROUP BY e2.id, e2.name HAVING COUNT(*) >= 5;
`,
    tables: [{
      label: "Employee",
      description: "Employee hierarchy",
      columns: [
        { name: "id", type: "INT", key: "PK" },
        { name: "name", type: "TEXT" },
        { name: "department", type: "TEXT" },
        { name: "managerId", type: "INT" },
      ],
    }],
  },
  "find-median-given-frequency-of-numbers": {
    init: `
CREATE TABLE Numbers (num INT, frequency INT);
INSERT INTO Numbers VALUES (0,1),(1,2),(2,3),(3,3);
`,
    referenceQuery: `
WITH RECURSIVE expanded(num, n, maxn) AS (
  SELECT num, 1, frequency FROM Numbers
  UNION ALL SELECT num, n + 1, maxn FROM expanded WHERE n < maxn
),
ranked AS (
  SELECT num, ROW_NUMBER() OVER (ORDER BY num) AS rn, COUNT(*) OVER () AS cnt FROM expanded
)
SELECT AVG(1.0 * num) AS median FROM ranked
WHERE rn IN ((cnt + 1) / 2, (cnt + 2) / 2);
`,
    tables: [{
      label: "Numbers",
      description: "Number frequencies",
      columns: [
        { name: "num", type: "INT" },
        { name: "frequency", type: "INT" },
      ],
    }],
  },
  "consecutive-available-seats": {
    init: `
CREATE TABLE Cinema (seat_id INT, free INT);
INSERT INTO Cinema VALUES (1,1),(2,0),(3,1),(4,1),(5,0);
`,
    referenceQuery: `
SELECT DISTINCT c1.seat_id FROM Cinema c1
JOIN Cinema c2 ON ABS(c1.seat_id - c2.seat_id) = 1 AND c1.free = 1 AND c2.free = 1
ORDER BY c1.seat_id;
`,
    tables: [{
      label: "Cinema",
      description: "Seat availability",
      columns: [
        { name: "seat_id", type: "INT", key: "PK" },
        { name: "free", type: "INT" },
      ],
    }],
  },
  "sales-person": {
    init: `
CREATE TABLE SalesPerson (sales_id INT, name TEXT, salary INT, commission_rate INT, hire_date TEXT);
CREATE TABLE Company (com_id INT, name TEXT, city TEXT);
CREATE TABLE Orders (order_id INT, order_date TEXT, customer_id INT, sales_id INT, company_id INT);
INSERT INTO SalesPerson VALUES (1,'John',100000,6,'2006-04-01'),(2,'Amy',120000,5,'2010-03-01'),(3,'Mark',65000,12,'2008-12-25');
INSERT INTO Company VALUES (1,'RED','Boston'),(2,'ORANGE','New York'),(3,'YELLOW','Boston');
INSERT INTO Orders VALUES (1,'2014-01-01',1,1,1),(2,'2014-02-01',2,2,1),(3,'2014-03-01',3,3,1);
`,
    referenceQuery: `
SELECT s.name FROM SalesPerson s WHERE NOT EXISTS (
  SELECT 1 FROM Orders o JOIN Company c ON o.company_id = c.com_id
  WHERE o.sales_id = s.sales_id AND c.name = 'RED'
);
`,
    tables: [
      { label: "SalesPerson", description: "Sales staff", columns: [{ name: "sales_id", type: "INT", key: "PK" }, { name: "name", type: "TEXT" }] },
      { label: "Company", description: "Companies", columns: [{ name: "com_id", type: "INT", key: "PK" }, { name: "name", type: "TEXT" }] },
      { label: "Orders", description: "Orders", columns: [{ name: "order_id", type: "INT", key: "PK" }, { name: "sales_id", type: "INT" }, { name: "company_id", type: "INT" }] },
    ],
  },
  "triangle-judgement": {
    init: `
CREATE TABLE Triangle (x INT, y INT, z INT);
INSERT INTO Triangle VALUES (13,15,30),(10,20,15);
`,
    referenceQuery: `SELECT x, y, z FROM Triangle WHERE x + y > z AND x + z > y AND y + z > x;`,
    tables: [{
      label: "Triangle",
      description: "Triangle sides",
      columns: [
        { name: "x", type: "INT" },
        { name: "y", type: "INT" },
        { name: "z", type: "INT" },
      ],
    }],
  },
  "shortest-distance-in-a-plane": {
    init: `
CREATE TABLE Point2D (x INT, y INT);
INSERT INTO Point2D VALUES (-1,-1),(0,0),(1,1);
`,
    referenceQuery: `
SELECT ROUND(MIN(SQRT((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y))), 2) AS shortest
FROM Point2D p1 JOIN Point2D p2 ON (p1.x <> p2.x OR p1.y <> p2.y);
`,
    tables: [{
      label: "Point2D",
      description: "2D points",
      columns: [
        { name: "x", type: "INT" },
        { name: "y", type: "INT" },
      ],
    }],
  },
  "second-degree-follower": {
    init: `
CREATE TABLE Follow (follower INT, followee INT);
INSERT INTO Follow VALUES (1,2),(2,3),(3,4),(4,5);
`,
    referenceQuery: `SELECT DISTINCT f1.follower FROM Follow f1 JOIN Follow f2 ON f1.followee = f2.follower;`,
    tables: [{
      label: "Follow",
      description: "Follow relationships",
      columns: [
        { name: "follower", type: "INT" },
        { name: "followee", type: "INT" },
      ],
    }],
  },
  "exchange-seats": {
    init: `
CREATE TABLE Seat (id INT, student TEXT);
INSERT INTO Seat VALUES (1,'A'),(2,'B'),(3,'C'),(4,'D');
`,
    referenceQuery: `
SELECT id, student FROM (
  SELECT CASE WHEN id % 2 = 1 AND id = (SELECT MAX(id) FROM Seat) THEN id
    WHEN id % 2 = 1 THEN id + 1 ELSE id - 1 END AS id, student FROM Seat
) ORDER BY id;
`,
    tables: [{
      label: "Seat",
      description: "Exam seats",
      columns: [
        { name: "id", type: "INT", key: "PK" },
        { name: "student", type: "TEXT" },
      ],
    }],
  },
  "customers-who-bought-all-products": {
    init: `
CREATE TABLE Customer (customer_id INT, product_key INT);
CREATE TABLE Product (product_key INT);
INSERT INTO Product VALUES (5),(6);
INSERT INTO Customer VALUES (1,5),(1,6),(2,5),(3,5),(3,6),(3,7);
`,
    referenceQuery: `
SELECT customer_id FROM Customer GROUP BY customer_id
HAVING COUNT(DISTINCT product_key) = (SELECT COUNT(*) FROM Product);
`,
    tables: [
      { label: "Customer", description: "Customer purchases", columns: [{ name: "customer_id", type: "INT" }, { name: "product_key", type: "INT" }] },
      { label: "Product", description: "Products", columns: [{ name: "product_key", type: "INT", key: "PK" }] },
    ],
  },
  "actors-and-directors-cooperated-three-times": {
    init: `
CREATE TABLE ActorDirector (actor_id INT, director_id INT, timestamp INT);
INSERT INTO ActorDirector VALUES (1,1,0),(1,1,1),(1,1,2),(1,2,3),(2,3,4);
`,
    referenceQuery: `
SELECT actor_id, director_id FROM ActorDirector
GROUP BY actor_id, director_id HAVING COUNT(*) >= 3;
`,
    tables: [{
      label: "ActorDirector",
      description: "Actor-director pairs",
      columns: [
        { name: "actor_id", type: "INT" },
        { name: "director_id", type: "INT" },
        { name: "timestamp", type: "INT" },
      ],
    }],
  },
  "product-sales-analysis-ii": {
    init: `
CREATE TABLE Product (product_id INT, product_name TEXT);
CREATE TABLE Sales (sale_id INT, product_id INT, year INT, quantity INT, price INT);
INSERT INTO Product VALUES (1,'A'),(2,'B'),(3,'C');
INSERT INTO Sales VALUES (1,1,2008,4,10),(2,1,2009,3,15),(3,2,2009,1,20);
`,
    referenceQuery: `
SELECT p.product_name, COALESCE(SUM(s.quantity), 0) AS total
FROM Product p LEFT JOIN Sales s ON p.product_id = s.product_id
GROUP BY p.product_name;
`,
    tables: [
      { label: "Product", description: "Products", columns: [{ name: "product_id", type: "INT", key: "PK" }, { name: "product_name", type: "TEXT" }] },
      { label: "Sales", description: "Sales", columns: [{ name: "sale_id", type: "INT", key: "PK" }, { name: "product_id", type: "INT" }, { name: "quantity", type: "INT" }] },
    ],
  },
  "project-employees-ii": {
    init: `
CREATE TABLE Project (project_id INT, employee_id INT);
CREATE TABLE Employee (employee_id INT, name TEXT, experience_years INT);
INSERT INTO Project VALUES (1,1),(1,2),(1,3),(2,1),(2,2);
INSERT INTO Employee VALUES (1,'Khaled',3),(2,'Ali',2),(3,'John',4);
`,
    referenceQuery: `
SELECT project_id, employee_id FROM (
  SELECT p.project_id, p.employee_id,
    ROW_NUMBER() OVER (PARTITION BY p.project_id ORDER BY e.experience_years DESC, p.employee_id) AS rn
  FROM Project p JOIN Employee e ON p.employee_id = e.employee_id
) x WHERE rn = 1;
`,
    tables: [
      { label: "Project", description: "Project assignments", columns: [{ name: "project_id", type: "INT" }, { name: "employee_id", type: "INT" }] },
      { label: "Employee", description: "Employees", columns: [{ name: "employee_id", type: "INT", key: "PK" }, { name: "experience_years", type: "INT" }] },
    ],
  },
  "sales-analysis-i": {
    init: `
CREATE TABLE Product (product_id INT, product_name TEXT);
CREATE TABLE Sales (sale_id INT, product_id INT, year INT);
INSERT INTO Product VALUES (100,'Nokia'),(200,'Apple'),(300,'Samsung');
INSERT INTO Sales VALUES (1,100,2008),(2,200,2018);
`,
    referenceQuery: `
SELECT p.product_id, p.product_name FROM Product p
LEFT JOIN Sales s ON p.product_id = s.product_id AND s.year = 2018
WHERE s.product_id IS NULL;
`,
    tables: [
      { label: "Product", description: "Products", columns: [{ name: "product_id", type: "INT", key: "PK" }, { name: "product_name", type: "TEXT" }] },
      { label: "Sales", description: "Sales years", columns: [{ name: "sale_id", type: "INT", key: "PK" }, { name: "product_id", type: "INT" }, { name: "year", type: "INT" }] },
    ],
  },
  "sales-analysis-ii": {
    init: `
CREATE TABLE Product (product_id INT, product_name TEXT);
CREATE TABLE Sales (sale_id INT, product_id INT, year INT);
INSERT INTO Product VALUES (100,'Nokia'),(200,'Apple'),(300,'Samsung');
INSERT INTO Sales VALUES (1,100,2018),(2,100,2019),(3,200,2018),(4,200,2019),(5,300,2018);
`,
    referenceQuery: `
SELECT p.product_id, p.product_name FROM Sales s
JOIN Product p ON s.product_id = p.product_id
GROUP BY p.product_id, p.product_name
HAVING SUM(CASE WHEN s.year = 2018 THEN 1 ELSE 0 END) > 0
   AND SUM(CASE WHEN s.year = 2019 THEN 1 ELSE 0 END) > 0;
`,
    tables: [
      { label: "Product", description: "Products", columns: [{ name: "product_id", type: "INT", key: "PK" }, { name: "product_name", type: "TEXT" }] },
      { label: "Sales", description: "Sales years", columns: [{ name: "sale_id", type: "INT", key: "PK" }, { name: "product_id", type: "INT" }, { name: "year", type: "INT" }] },
    ],
  },
  "highest-grade-for-each-student": {
    init: `
CREATE TABLE Enrollments (student_id INT, course_id INT, grade INT);
INSERT INTO Enrollments VALUES (1,1,90),(1,2,85),(2,1,95),(2,2,88),(3,1,70);
`,
    referenceQuery: `
SELECT student_id, course_id, grade FROM (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY student_id ORDER BY grade DESC, course_id) AS rn
  FROM Enrollments
) x WHERE rn = 1;
`,
    tables: [{
      label: "Enrollments",
      description: "Student grades",
      columns: [
        { name: "student_id", type: "INT" },
        { name: "course_id", type: "INT" },
        { name: "grade", type: "INT" },
      ],
    }],
  },
  "user-activity-for-the-past-30-days-i": {
    init: `
CREATE TABLE Activity (user_id INT, activity_date TEXT);
INSERT INTO Activity VALUES
 (1,'2019-07-01'),(2,'2019-07-08'),(2,'2019-07-08'),(3,'2019-07-10'),(4,'2019-07-15');
`,
    referenceQuery: `
SELECT activity_date AS day, COUNT(DISTINCT user_id) AS active_users
FROM Activity
WHERE julianday(activity_date) > julianday('2019-07-27') - 30
GROUP BY activity_date;
`,
    tables: [{
      label: "Activity",
      description: "User activity",
      columns: [
        { name: "user_id", type: "INT" },
        { name: "activity_date", type: "TEXT" },
      ],
    }],
  },
  "market-analysis-i": {
    init: `
CREATE TABLE Users (user_id INT, join_date TEXT);
CREATE TABLE Orders (order_id INT, buyer_id INT, order_date TEXT);
CREATE TABLE Items (order_id INT, item_id INT, is_return TEXT);
INSERT INTO Users VALUES (1,'2018-01-01'),(2,'2018-02-01'),(3,'2018-03-01');
INSERT INTO Orders VALUES (1,1,'2019-01-01'),(2,2,'2019-02-01'),(3,3,'2019-03-01');
INSERT INTO Items VALUES (1,1,'no'),(2,2,'no'),(3,3,'approved');
`,
    referenceQuery: `
SELECT u.user_id AS buyer_id, u.join_date FROM Users u
JOIN Orders o ON u.user_id = o.buyer_id
JOIN Items i ON o.order_id = i.order_id
WHERE strftime('%Y', o.order_date) = '2019' AND i.item_id IS NOT NULL
GROUP BY u.user_id, u.join_date
HAVING SUM(CASE WHEN i.is_return = 'approved' THEN 1 ELSE 0 END) = 0;
`,
    tables: [
      { label: "Users", description: "Buyers", columns: [{ name: "user_id", type: "INT", key: "PK" }, { name: "join_date", type: "TEXT" }] },
      { label: "Orders", description: "Orders", columns: [{ name: "order_id", type: "INT", key: "PK" }, { name: "buyer_id", type: "INT" }] },
      { label: "Items", description: "Order items", columns: [{ name: "order_id", type: "INT" }, { name: "item_id", type: "INT" }, { name: "is_return", type: "TEXT" }] },
    ],
  },
  "product-price-at-a-given-date": {
    init: `
CREATE TABLE Products (product_id INT, new_price INT, change_date TEXT);
INSERT INTO Products VALUES (1,20,'2019-08-01'),(1,30,'2019-08-14'),(2,50,'2019-08-14'),(2,65,'2019-08-19');
`,
    referenceQuery: `
SELECT product_id, new_price AS price FROM (
  SELECT product_id, new_price,
    ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY change_date DESC) AS rn
  FROM Products WHERE change_date <= '2019-08-16'
) x WHERE rn = 1;
`,
    tables: [{
      label: "Products",
      description: "Price changes",
      columns: [
        { name: "product_id", type: "INT" },
        { name: "new_price", type: "INT" },
        { name: "change_date", type: "TEXT" },
      ],
    }],
  },
  "immediate-food-delivery-ii": {
    init: `
CREATE TABLE Delivery (delivery_id INT, customer_id INT, order_date TEXT, customer_pref_delivery_date TEXT);
INSERT INTO Delivery VALUES (1,1,'2019-08-01','2019-08-02'),(2,2,'2019-08-02','2019-08-02'),(3,1,'2019-08-11','2019-08-12');
`,
    referenceQuery: `
SELECT ROUND(100.0 * AVG(CASE WHEN order_date = customer_pref_delivery_date THEN 1.0 ELSE 0 END), 2) AS immediate_percentage
FROM Delivery;
`,
    tables: [{
      label: "Delivery",
      description: "Delivery orders",
      columns: [
        { name: "delivery_id", type: "INT", key: "PK" },
        { name: "customer_id", type: "INT" },
        { name: "order_date", type: "TEXT" },
        { name: "customer_pref_delivery_date", type: "TEXT" },
      ],
    }],
  },
  "monthly-transactions-i": {
    init: `
CREATE TABLE Transactions (id INT, country TEXT, state TEXT, amount INT, trans_date TEXT);
INSERT INTO Transactions VALUES
 (1,'US','approved',1000,'2019-12-01'),(2,'US','approved',2000,'2019-12-18'),
 (3,'US','chargeback',2000,'2019-12-18'),(4,'US','chargeback',2000,'2019-12-18');
`,
    referenceQuery: `
SELECT strftime('%Y-%m-01', trans_date) AS month, country,
  COUNT(CASE WHEN state = 'approved' THEN 1 END) AS approved_count,
  SUM(CASE WHEN state = 'approved' THEN amount ELSE 0 END) AS approved_total,
  SUM(CASE WHEN state = 'chargeback' THEN amount ELSE 0 END) AS chargeback_total
FROM Transactions GROUP BY 1, 2;
`,
    tables: [{
      label: "Transactions",
      description: "Payment transactions",
      columns: [
        { name: "id", type: "INT", key: "PK" },
        { name: "country", type: "TEXT" },
        { name: "state", type: "TEXT" },
        { name: "amount", type: "INT" },
        { name: "trans_date", type: "TEXT" },
      ],
    }],
  },
  "last-person-to-fit-on-bus": {
    init: `
CREATE TABLE Queue (person_id INT, person_name TEXT, weight INT, turn INT);
INSERT INTO Queue VALUES (5,'Alice',250,1),(4,'Bob',175,2),(3,'Carol',500,3),(6,'Dan',400,4);
`,
    referenceQuery: `
SELECT person_name FROM (
  SELECT person_name, turn, SUM(weight) OVER (ORDER BY turn) AS running FROM Queue
) WHERE running <= 1000 ORDER BY turn DESC LIMIT 1;
`,
    tables: [{
      label: "Queue",
      description: "Bus queue",
      columns: [
        { name: "person_id", type: "INT", key: "PK" },
        { name: "person_name", type: "TEXT" },
        { name: "weight", type: "INT" },
        { name: "turn", type: "INT" },
      ],
    }],
  },
};

export function getSqlPracticeSeed(slug: string): SqlPracticeSeed | null {
  return SEEDS[slug] ?? null;
}

export function getSqlPracticeSchemas(slug: string) {
  return getSqlPracticeSeed(slug)?.tables ?? [];
}

export function hasSqlPracticeSeed(slug: string): boolean {
  return slug in SEEDS;
}
