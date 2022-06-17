---
export_on_save:
  html: true
--- 

# 49. Cumulative total users per day 

Report the number of signups per day and the cumulative number of signups per day.


To calculate cumulative number of signups for each day, we take the total_signups_count of the previous day and add to it the signups_count of the current day.

```sql
SELECT 
  signup_date,
  COUNT(*) AS signups_count,
  SUM(COUNT(*)) OVER (ORDER BY signup_date) AS total_signups_count
FROM users
GROUP BY 1
```

The (ORDER BY signup_date) changes the window frame such that for each record, all records from the first through to the current record, including the current record, are treated as belonging to the same partition. This is true for all window frames with only an ORDER BY clause.

For our window function of our current query, the COUNT aggregate function is first calculated for each grouping of records grouped by date in the partition, and then we apply SUM over the results of those calculations.

This is exactly what a cumulative sum is - summing the number of signups from the first day through to the current day.

[Further reading](https://www.postgresql.org/docs/current/tutorial-window.html)

Also note that the following won't work because the SELECT clause is executed after Window functions.

```sql
SELECT 
  signup_date,
  COUNT(*) AS signups_count,
  SUM(signups_count) OVER (ORDER BY signup_date) AS total_signups_count
FROM users
GROUP BY 1
```

If we wanted to improve the clarity we can go with the following query.

```sql
WITH signups_per_day AS (
  SELECT 
    signup_date,
    COUNT(*) AS signups_count
  FROM users
  GROUP BY 1
)

SELECT 
  signup_date,
  signups_count,
  SUM(signups_count) OVER (ORDER BY signup_date) AS total_signups_count
FROM signups_per_day
```