---
export_on_save:
  html: true
---
# HAVING

HAVING lets us filter grouped rows.

Syntax

```sql
SELECT select_list FROM ... [WHERE ...] GROUP BY ... HAVING boolean_expression
```

If a table has been grouped using GROUP BY, but only certain groups are of interest, the HAVING clause can be used, much like a WHERE clause, to eliminate groups from the result. 

It's more efficient to rewrite a HAVING clause that doesn't feature an aggregate function as a WHERE clause. This is because the WHERE clause determines which records grouping and aggregate calculations are applied to. And by filtering our records at this stage we avoid unnecessary grouping and aggregating.

So as a rule of thumb, if we can perform the same filter with both WHERE and HAVING, we should use the WHERE filter to avoid redundant grouping and aggregate calculations.

[PostgresSQL documentation on HAVING](https://www.postgresql.org/docs/current/queries-table-expressions.html#QUERIES-GROUP)