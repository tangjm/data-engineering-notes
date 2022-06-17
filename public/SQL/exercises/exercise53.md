---
export_on_save:
  html: true
---

# 53. Trial opt-in rate last 30 days

Report the trial opt-in rate for daily user cohorts (signups from that specific days) during the past 30 days.

For each day, how many users signed up? How many started a trial?

First pass

```sql
WITH signups_trials_per_day AS (
  SELECT 
    created_at::date AS date,
    COUNT(DISTINCT(u.id)) AS signup_count,
    COUNT(DISTINCT(t.id)) AS trial_count,
    100.0 * COUNT(DISTINCT(t.id)) / COUNT(DISTINCT(u.id)) AS opt_in_rate
  FROM users u
  LEFT JOIN trials t
    ON t.user_id = u.id
  GROUP BY 1
  ORDER BY 1
)

SELECT 
  date,
  signup_count AS users_count,
  trial_count AS trials_count,
  ROUND(opt_in_rate, 1) AS trial_optin_rate
FROM signups_trials_per_day
WHERE now()::date - date <= 30
```

By casting `created_at` to type 'date' we loose some precision.
Compare these two filters. n.b. '-' is defined for dates but not for timestamps.

```sql
WHERE created_at >= now() - '30 days'::interval
```
```sql
WHERE now()::date - date <= 30
```

Second pass - works!

```sql
SELECT 
  created_at::date AS date,
  COUNT(DISTINCT(u.id)) AS users_count,
  COUNT(DISTINCT(t.id)) AS trials_count,
  ROUND(100.0 * COUNT(DISTINCT(t.id)) / COUNT(DISTINCT(u.id)), 1) AS trial_optin_rate
FROM users u
LEFT JOIN trials t
  ON t.user_id = u.id
WHERE created_at >= now() - '30 days'::interval
GROUP BY 1
ORDER BY 1
```


Appendix

```sql
-- Signups and trials on 31st May 2018
SELECT *
FROM users u
LEFT JOIN trials t
  ON t.user_id = u.id
WHERE created_at::date = '2018-05-31'
ORDER BY u.created_at
```


```sql
-- Compare two WHERE clauses
SELECT 
  *
FROM users u
LEFT JOIN trials t
  ON t.user_id = u.id
WHERE now()::date - created_at::date <= 30
-- WHERE created_at >= now() - '30 days'::interval
ORDER BY created_at
```