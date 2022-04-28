---
export_on_save:
  html: true
---

Order of execution for SQL clauses:

```sql
  SELECT <columns> 	5.
  FROM <table> 	1.
  WHERE <predicate on rows> 	2.
  GROUP BY <columns> 	3.
  HAVING <predicate on groups> 	4.
  ORDER BY <columns> 	6.
  OFFSET 	7.
  FETCH FIRST 	8. 
```