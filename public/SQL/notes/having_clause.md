---
export_on_save:
  html: true
---
# HAVING

Syntax

```sql
SELECT select_list FROM ... [WHERE ...] GROUP BY ... HAVING boolean_expression
```

If a table has been grouped using GROUP BY, but only certain groups are of interest, the HAVING clause can be used, much like a WHERE clause, to eliminate groups from the result. [PostgresSQL documentation on HAVING](https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-GROUP)