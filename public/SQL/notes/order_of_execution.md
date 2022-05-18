---
export_on_save:
  html: true
---

Order of execution for SQL clauses:

```sql
FROM, JOIN
WHERE
GROUP BY
Aggregate functions
HAVING
Window functions
SELECT
DISTINCT
UNION/INTERSECT/EXCEPT
ORDER BY
OFFSET
LIMIT/FETCH/TOP
```