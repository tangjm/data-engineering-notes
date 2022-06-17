---
export_on_save:
  html: true
---
# Creating and deleting tables

```sql
CREATE TABLE weather (
    city            varchar(80),
    temp_lo         int,           -- low temperature
    temp_hi         int,           -- high temperature
    prcp            real,          -- precipitation
    date            date
);

CREATE TABLE cities (
    name            varchar(80),
    location        point
);
```

```sql
DROP TABLE cities
```

n.b. psql recognises that a command isn't terminated until the semicolon. This lets you enter multiline commands.


### Inserts

[Populating a table with rows](https://www.postgresql.org/docs/current/tutorial-populate.html)

```sql
INSERT INTO tablename 
    VALUES (val1, val2, val3);

INSERT INTO tablename (col1, col2, col3)
    VALUES (val1, val2, val3);
```

We can insert records into a table and can choose to explicitly state the column names. This flexibility gives us control over which columns to populate with data and the order in which we populate the columns.

```sql
COPY weather FROM '/home/user/weather.txt';
```

The copy command can be used to copy larger amounts of data between text files and tables.

### Updates

[Updates](https://www.postgresql.org/docs/current/tutorial-update.html)

```sql
UPDATE tablename
    SET col1 = expr, col2 = expr ...
    WHERE condition_is_true;
```

### Deletions

[Deletes](https://www.postgresql.org/docs/current/tutorial-delete.html)

```sql
DELETE FROM tablename WHERE condition_is_true
```


```sql
DELETE FROM tablename
```

This will delete all records from a table without warning.


