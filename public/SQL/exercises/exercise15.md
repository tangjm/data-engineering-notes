# 15. Count users with identical names 

Topics: Grouping, Sorting, Aggregate functions, Filters

Calculate the number of users who have perfectly matching first and last names.

```sql
WITH users_with_same_name AS (
  SELECT 
      first_name, 
      last_name,
      COUNT(id) AS user_count
  FROM users
  WHERE 1 = 1
      AND first_name IS NOT NULl
      AND last_name IS NOT NULL
  GROUP BY 1, 2
  ORDER BY 3 DESC
)

SELECT
    SUM(CASE WHEN user_count > 1 THEN user_count END) AS users_count
FROM users_with_same_name
```

SUM ignores NULL values.

We can also use `first_name <> ''` AND `last_name <> ''` for our filter conditions.
