---
export_on_save:
  html: true
--- 

# Window functions

Window functions let you invoke a function over some portion of your selected table rows.

### Syntax

```sql
FUNCTION_NAME() OVER (PARTITION BY expression ORDER BY expression)

FUNCTION_NAME() OVER ()
```

PARTITION BY groups rows into partitions; it's like the GROUP BY clause.

ORDER BY orders rows within each partition or group.

Then the FUNCTION_NAME() is invoked for each partition.

[PostgresSQL documentation on window functions](https://www.postgresql.org/docs/current/tutorial-window.html)

### Demonstration

```sql
SELECT
  *,
  ROW_NUMBER() OVER (PARTITION BY visitor_id ORDER BY created_at) AS pageview_number
FROM web_analytics.pageviews
-- WHERE visitor_id = '00371fb7a18d6be6'
-- Try filtering for only the first pageview of each visitor
```

### Exercise 

Rank each user in the `users` table in ascending order of when they signed up. Do this by adding an extra column and using a window function.

```sql {hide=true}
-- one way of doing this
SELECT 
  ROW_NUMBER() OVER (ORDER BY created_at) AS signup_order,
  *
FROM users
```



Ch.192

```sql {.line-numbers highlight=[18,19]}
WITH user_activity AS (
  SELECT
    s.user_id,
    s.created_at :: date AS signup_date,
    e.created_at :: date AS event_date
  FROM mobile_analytics.events s
  LEFT JOIN mobile_analytics.events e 
    ON s.user_id = e.user_id
  WHERE s.action = 'signup'
  GROUP BY 1, 2, 3
  ORDER BY signup_date, user_id
),

retention_curve AS (
  SELECT
    event_date,
    COUNT(DISTINCT(user_id)) AS active_users,
    ROW_NUMBER() over () - 1 AS day,
    FIRST_VALUE(COUNT(DISTINCT(user_id))) over () AS d1_activity
  FROM user_activity
  WHERE signup_date = '2018-02-01'
  GROUP BY 1
  ORDER BY 1
)
```

WHERE and GROUP BY clauses are applied before we evaluate the SELECT clause.

user_activity returns a table that displays for each each user, their sign up date and the days they were active.

retention_curve returns a table that displays for each day, the number of active users, number of days since 1st February 2018 and the total active users on the 1st Februrary 2018.