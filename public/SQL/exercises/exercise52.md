---
export_on_save:
  html: true
--- 

# 52. Signups in the last 30 days with an uplift 

Report the number of signups for the past 30 days and the percentage difference compared to the previous 30 days.

Count the number of records after filtering with the predicate `created_at BETWEEN now() - '30 days'::interval AND now()` to count the number of signups in the past 30 days.

Predicate for previous last 30 days: 
`created_at BETWEEN now() - '60 days'::interval AND now() - '30 days'::interval`

```sql
WITH last_30_and_60_days_signups AS (
  SELECT 
    COUNT(CASE WHEN created_at BETWEEN now() - '30 days'::interval AND now() THEN id END) AS last_30_days,
    COUNT(CASE WHEN created_at BETWEEN now() - '60 days'::interval AND now() - '30 days'::interval THEN id END) AS last_60_days
  FROM users
)

SELECT 
  last_30_days AS signups_count,
  ROUND(100.0 * (last_30_days - last_60_days) / last_60_days, 1) AS uplift
FROM last_30_and_60_days_signups
```

Note how there is an overlap between the two CASE WHEN conditions in our first query.

```sql
WITH last_30_and_60_days_signups AS (
  SELECT 
    COUNT(CASE WHEN created_at > now() - '30 days'::interval AND created_at <= now() THEN id END) AS last_30_days,
    COUNT(CASE WHEN created_at > now() - '60 days'::interval AND created_at <= now() - '30 days'::interval THEN id END) AS last_60_days
  FROM users
)

SELECT 
  last_30_days AS signups_count,
  ROUND(100.0 * (last_30_days - last_60_days) / last_60_days, 1) AS uplift
FROM last_30_and_60_days_signups
```

Also, `AND created_at <= now()` is redundant because it's not possible for any record to have a created_at field with a future timestamp in our `users` table.