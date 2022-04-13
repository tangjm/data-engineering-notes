### SQL views

SQL views lets you use subqueries as tables. It lets you make subqueries accessible to all queries which is especially useful if you find yourself writing the same subquery multiple times.

```sql
CREATE VIEW view_name AS (
  -- INSERT SUBQUERY HERE
)
```

### Create, Update, and Delete rows in SQL tables

Inserting records

```sql
INSERT INTO table_name (column_1, column_2, column_3)
VALUES ('example@domain.com', 'John', 'Doe', 'us')
       ('example2@domain.com', 'Jane', 'Doe', 'en')
```

Updating records

```sql 
UPDATE table_name
SET
  column_1 = column1_value,
  column_2 = column2_value
WHERE
  id IN (id_1, id_2)
```

'WHERE' filter lets you select which records to update
'SET' lets you select which column(s) to update

Delete records

```sql
DELETE 
FROM table_name
WHERE id IN (id_1, id_2)
```

'WHERE' filter lets you select which records to delete

```sql
-- Delete all records without deleting the table itself
TRUNCATE TABLE table_name
```

