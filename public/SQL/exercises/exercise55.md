# 55. Trial retention rate last 30 days 

For the last 30 days, calculate the
Percentage of users who took part in a trial and made a non-refunded purchase

### First pass

```sql
WITH helper_dates AS (
  SELECT  
    1 AS day
    UNION 
  SELECT 
    2 AS day
)

, last_30_days AS (
  SELECT 
    now()::date - ROW_NUMBER() OVER ()::int AS date,
    ROW_NUMBER() OVER () AS day
  FROM helper_dates h1, 
       helper_dates h2,
       helper_dates h3,
       helper_dates h4,
       helper_dates h5
  ORDER BY 1
  OFFSET 2
)

, trials_purchases AS (
  SELECT 
    t.started_at AS trial_start_date,
    t.user_id AS trial_user,
    p.user_id AS retained_user
  FROM trials t
  LEFT JOIN purchases p
    ON p.trial_id = t.id
  WHERE refunded_at IS NULL
    AND started_at >= now() - '30 days'::interval
  ORDER BY started_at 
)

, trials_purchases_last_30_days AS (
  SELECT *
  FROM last_30_days l
  LEFT JOIN trials_purchases tp
    ON tp.trial_start_date::date = l.date
)

SELECT 
  date,
  COUNT(trial_user) AS trials_count,
  COUNT(retained_user) AS retained_trials_count,
  ROUND(CASE WHEN COUNT(trial_user) = 0 THEN 0
             ELSE 100.0 * COUNT(retained_user) / COUNT(trial_user)
        END, 1) AS trial_retention_rate
FROM trials_purchases_last_30_days
GROUP BY 1
ORDER BY 1
```


### Second pass 

```sql
WITH dates AS (
  SELECT 
    GENERATE_SERIES(now() - '30 days'::interval, now(), '1 day')::date AS date
)

, trials_purchases AS (
SELECT 
  started_at::date AS date,
  COUNT(DISTINCT(t.user_id)) AS trials_count,
  COUNT(DISTINCT(p.user_id)) AS retained_trials_count,
  ROUND(100.0 * COUNT(DISTINCT(p.user_id)) / COUNT(DISTINCT(t.user_id)), 1) AS trial_retention_rate
FROM trials t
LEFT JOIN purchases p
  ON p.trial_id = t.id
    AND refunded_at IS NULL
WHERE started_at >= now() - '30 days'::interval
GROUP BY 1
ORDER BY 1 
)

SELECT
  d.*, 
  trials_count,
  retained_trials_count,
  trial_retention_rate
FROM dates d
LEFT JOIN trials_purchases tp
  ON tp.date = d.date
```

### Third pass


```sql
WITH last_30_days AS (
  SELECT 
    GENERATE_SERIES(now() - '30 days'::interval, now(), '1 day')::date AS date
)

, trials_purchases AS (
  SELECT 
    t.started_at AS trial_start_date,
    t.user_id AS trial_user,
    p.user_id AS retained_user
  FROM trials t
  LEFT JOIN purchases p
    ON p.trial_id = t.id
  WHERE refunded_at IS NULL
    AND started_at >= now() - '30 days'::interval
  ORDER BY started_at 
)

, trials_purchases_last_30_days AS (
  SELECT *
  FROM last_30_days l
  LEFT JOIN trials_purchases tp
    ON tp.trial_start_date::date = l.date
)

SELECT 
  date,
  COUNT(trial_user) AS trials_count,
  COUNT(retained_user) AS retained_trials_count,
  ROUND(CASE WHEN COUNT(trial_user) = 0 THEN 0
             ELSE 100.0 * COUNT(retained_user) / COUNT(trial_user)
        END, 1) AS trial_retention_rate
FROM trials_purchases_last_30_days
GROUP BY 1
ORDER BY 1
```




### Appendix

Trials in the last 30 days.

```sql
SELECT COUNT(*)
FROM trials
WHERE started_at >=  now() - '30 days'::interval
```

