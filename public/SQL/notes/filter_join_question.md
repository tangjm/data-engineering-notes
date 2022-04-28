---
export_on_save:
  html: true
---
Query 1
```sql
WITH user_activity AS (
  SELECT
    u.user_id,
    u.created_at::date AS signup_date,
    e.created_at::date AS activity_date,
    COUNT(*) AS events_counts
  FROM mobile_analytics.events u
  LEFT JOIN mobile_analytics.events e
    ON e.user_id = u.user_id  
  WHERE
    u.action = 'signup'  
  GROUP BY 1, 2, 3
  ORDER BY signup_date ASC, user_id ASC
)
```

Query 2
```sql
WITH user_activity AS (
  SELECT
    u.user_id,
    e.created_at::date AS signup_date,
    u.created_at::date AS activity_date,
    COUNT(*) AS events_counts
  FROM mobile_analytics.events u
  LEFT JOIN mobile_analytics.events e
    ON e.user_id = u.user_id  
      AND e.action = 'signup'
  GROUP BY 1, 2, 3
  ORDER BY signup_date ASC, user_id ASC
)

SELECT *
FROM user_activity
```

Does it make a difference whether we have the WHERE filter `action = 'signup'` in table `u` or table `e`?
- No