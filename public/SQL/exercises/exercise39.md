---
export_on_save:
  html: true
---

# 39. User base month-to-month growth

Calculate the number of users who signed up per month, both the absolute number of signups and the relative difference from the previous month as a percentage.

We need to group users by year and month and count the number of users. To do so, we first need to extract the year and month from the signup_date column.

```sql
WITH signups_monthly AS (
  SELECT 
    DATE_PART('year', signup_date) AS year,
    DATE_PART('month', signup_date) AS month,
    COUNT(id) AS users_count
  FROM users
  GROUP BY 1, 2
  ORDER BY 1, 2
)

SELECT 
  *,
  LAG(users_count) OVER () AS prev_users_count,
  users_count - LAG(users_count) OVER () AS difference,
  100.0 * (users_count - LAG(users_count) OVER ()) / LAG(users_count) OVER () AS percentage_diff,
  ROUND(100.0 * (users_count - LAG(users_count) OVER ()) / LAG(users_count) OVER (), 1) AS percentage
FROM signups_monthly
```

#### Solution

```sql
WITH signups_monthly AS (
  SELECT 
    DATE_PART('year', signup_date) AS year,
    DATE_PART('month', signup_date) AS month,
    COUNT(id) AS users_count
  FROM users
  GROUP BY 1, 2
  ORDER BY 1, 2
),

with_percentage_diff AS (
  SELECT 
    *,
    LAG(users_count) OVER () AS prev_users_count
  FROM signups_monthly
)

SELECT 
  year,
  month,
  users_count,
  ROUND(100.0 * (users_count - prev_users_count) / prev_users_count, 1) AS percentage
FROM with_percentage_diff
```

Footnotes

We can't use coalesce with arguments of different types.

```sql
...

SELECT 
  year,
  month,
  users_count,
  COALESCE(ROUND(100.0 * (users_count - prev_users_count) / prev_users_count, 1), '') AS percentage
FROM with_percentage_diff
```


We can't quite fit everything in a single query due to the order of execution. Window functions are applied after grouping and aggregate functions and the order by clause is applied after window functions.

So unless the view we get after grouping by year and month is in the order we want, our LAG window function isn't guaranteed to return the users_count for the previous month.

```sql
WITH signups_monthly AS (
  SELECT 
    DATE_PART('year', signup_date) AS year,
    DATE_PART('month', signup_date) AS month,
    COUNT(id) AS users_count,
    LAG(COUNT(id)) OVER (ORDER BY 2)
  FROM users
  GROUP BY 1, 2
--   ORDER BY 1, 2
)

SELECT *
FROM signups_monthly
```