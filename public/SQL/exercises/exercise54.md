# 54. Time of day distribution for signups 

Report the number of signups by user’s local hour of day.

<!-- For each user, how many users signed up within the same hour that they did.  -->

For each hour of the day, how many users signed up? (After localising each user's signup timestamp)

Create a table with 24 hours of the day.
Left join `users` to this table.
Then extract the hours from the created_at timestamp.
Apply the offset. (Apply `mod 24` to account for cases when the absolute value of the offset is greater than that of the UTC hour)
Finally, group by hours of the day and count the number of rows.


```sql
-- Our makeshift hours of the day table
WITH hour_of_day AS (
    SELECT 1
    UNION ALL
    SELECT 1
    UNION ALL
    SELECT 1
)
  
SELECT 
  ROW_NUMBER() OVER () - 1 AS hours
FROM 
  hour_of_day h1, 
  hour_of_day h2, 
  hour_of_day h3
LIMIT 24
```

The idea behind this is that cross join produces a cartesian product.
So if our table has three records, two cross joins will produce $3 \times 3 \times 3$ rows.

Alternatively, we can use [set returning functions](https://www.postgresql.org/docs/current/functions-srf.html) which are supported by Postgres.

```sql
SELECT 
 DATE_PART(
    'hours', 
    GENERATE_SERIES(
      now()::date::timestamp, 
      now()::date::timestamp + '23 hours'::interval, 
      '1 hour'::interval
    )
  ) AS hour
```

```sql
SELECT GENERATE_SERIES(0, 23) AS hour
```

### First pass

```sql
WITH hour_of_day AS (
  SELECT GENERATE_SERIES(0, 23) as hour
)

, users_with_localised_signup_hour AS (
  SELECT 
    *,
    MOD((DATE_PART('hour', created_at) + utc_offset)::numeric + 24, 24) AS localised_hour
  FROM users
)

SELECT
  hour AS hour_of_day,
  COUNT(*) AS signsup_count
FROM hour_of_day h
LEFT JOIN users_with_localised_signup_hour u
  ON u.localised_hour = h.hour
GROUP BY 1
ORDER BY 1
```

We setup a separate table for hours of the day to ensure that we include hours when no users have signed up.


### Solution

```sql
WITH users_with_localised_signup_hour AS (
  SELECT 
    *,
    MOD((DATE_PART('hour', created_at) + utc_offset)::numeric + 24, 24) AS localised_hour
  FROM users
)

SELECT 
  localised_hour AS hour_of_day,
  COUNT(*) AS signups_count
FROM users_with_localised_signup_hour
GROUP BY 1
ORDER BY 1
```

### Appendix

Notes on SQL Habit solution

We can apply the offset in this way too.

```sql
SELECT
  created_at + '1 hour'::interval * utc_offset AS local_created_at,
  *
FROM users
```

[AT TIME ZONE](https://www.postgresql.org/docs/14/functions-datetime.html#FUNCTIONS-DATETIME-ZONECONVERT) function converts time stamps without a time zone to a time stamp with a time zone. It also converts time stamps with a time zone to different time zones.

```sql
SELECT 
  '2022-06-01 00:00:00' AT TIME ZONE 'UTC',
  '2022-06-01 00:00:00' AT TIME ZONE 'America/New_York'
```

```sql
SELECT
  created_at AT TIME ZONE 'UTC' AT TIME ZONE timezone AS local_created_at,
  *
FROM users
```

```sql
WITH users_with_local_time AS (
  SELECT
    created_at + '1 hour'::interval * utc_offset AS local_created_at,
    *
  FROM users
)

, hour_of_day AS (
  SELECT GENERATE_SERIES(0, 23) AS hour
)

SELECT
  DATE_PART('hour', local_created_at) AS hour_of_day,
  COUNT(*) AS signups_count
FROM users_with_local_time u
RIGHT JOIN hour_of_day h
  ON h.hour = DATE_PART('hour', u.local_created_at)
GROUP BY 1
ORDER BY 1 ASC
```