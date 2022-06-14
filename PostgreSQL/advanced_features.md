# Advanced features

### Views

[Views](https://www.postgresql.org/docs/current/tutorial-views.html)

```sql
CREATE VIEW myview AS
    SELECT name, temp_lo, temp_hi, prcp, date, location
        FROM weather, cities
        WHERE city = name;

SELECT * FROM myview;
```

Creating a view over a query gives a name to the query with which you can reference the query in the same way as would reference a table.

Views let you encapsulate the details of your table structure and can serve as higher-level interfaces or abstractions over your tables.

### Foreign keys

```sql
CREATE TABLE cities (
        name     varchar(80) primary key,
        location point
);

CREATE TABLE weather (
        city      varchar(80) references cities(name),
        temp_lo   int,
        temp_hi   int,
        prcp      real,
        date      date
);
```

Creates tables with primary and foreign keys and their relationships defined.

Foreign key relationships adds constraints on what records you can insert into the `weather` table. For instance, you cannot insert records into the `weather` table whose `city` value doesn't correspond to some `name` value in the `cities` table.

### Transactions

Transactions bundle multiple steps into a single, all-or-nothing operation. This all-or-nothing property of transactions can be described as atomicity.

In virtue of atomicity, intermediate steps of a transaction are not visible to other transactions running in parallel. Other transactions can only see if the transaction failed or completed; incomplete changes of state are not exposed.

Transactions are also durable in the sense that they are recorded permanently upon completion even in spite of system crashes. This is usually guaranteed by logging a transaction to non-volatile storage (e.g. SSD, Hard Drive Disks) before the transaction is reported completete.

#### Syntax of transations

```sql
BEGIN;
...
COMMIT;
```

Transactions are SQL commands that begin with a BEGIN and end with a COMMIT.

PostgreSQL treats every SQL statement as being executed in a transaction. That is, SQL statements are implicitly preceded with a BEGIN and succeded with a COMMIT if successful. 

#### Savepoints

Savepoints provide finer grained control over transactions. They are like git commits which let you roll back changes within a transaction to a user-defined savepoint and continue the transaction from that point onwards.

Here is an example.

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100.00
    WHERE name = 'Alice';
SAVEPOINT my_savepoint;
UPDATE accounts SET balance = balance + 100.00
    WHERE name = 'Bob';
-- oops ... forget that and use Wally's account
ROLLBACK TO my_savepoint;
UPDATE accounts SET balance = balance + 100.00
    WHERE name = 'Wally';
COMMIT;
```

[More on transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html)


### Window functions

[More on window functions](https://www.postgresql.org/docs/current/tutorial-window.html)

https://www.postgresql.org/docs/current/sql-expressions.html#SYNTAX-WINDOW-FUNCTIONS

For queries with multiple window functions that share a windowing behaviour, we can abstract over the windowing behaviour using a reference to a WINDOW clause.

For example, the following two queries are equivalent.

```sql
SELECT 
  user_id,
  COUNT(*) OVER (PARTITION BY user_id),
  SUM(amount) OVER (PARTITION BY user_id),
  AVG(amount) OVER (PARTITION BY user_id)
FROM purchases
```

```sql
SELECT
  user_id,
  COUNT(*) OVER u,
  SUM(amount) OVER u,
  AVG(amount) OVER u
FROM purchases
WINDOW u AS (PARTITION BY user_id)
```

### Inheritance

[More on inheritance](https://www.postgresql.org/docs/current/tutorial-inheritance.html)

n.b. At this moment in time, inheritance hasn't been implemented with foreign keys.

```sql
CREATE TABLE cities (
  name       text,
  population real,
  elevation  int     -- (in ft)
);

CREATE TABLE capitals (
  state      char(2) UNIQUE NOT NULL
) INHERITS (cities);
```

Any record added to the `capitals` table is also visible in the `cities` table in the sense that if you ran the following query:

```sql
SELECT *
FROM cities
```

The returned result table would include all records in the cities table as well as the capitals table.

However, if you ran the following query:

```sql
SELECT *
FROM ONLY cities
```

Records from any table that inherits the `cities` table will not be included in the returned table.
