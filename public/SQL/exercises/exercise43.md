---
export_on_save:
  html: true
---

# 43. Ultimate AB-test dashboard: activation rate 

Report cohort sizes (# of users) for all AB-test variations of all tests, including the number of activated users and activatation rate. 

Activation rate is $ \frac {\text{active users}} {\text{cohort size}} $.

An active user is one who has added a book to their library.


Let's first calculate cohort size for each AB variation and test.

```sql
SELECT 
  custom_parameters ->> 'ab_test_name' AS ab_test_name,
  custom_parameters ->> 'ab_test_variation' AS ab_test_variation,
  COUNT(DISTINCT(user_id))
FROM mobile_analytics.events
GROUP BY 1, 2 
```

Users who have added a book to their library will appear in the books_users table.

If we wanted to calculate hard activation rate; namely, the number of users who started reading a book, we could add the `last_page > 0` filter.

Could we achieve the same result if had put the `last_page > 0` filter in a WHERE clause?

```sql
SELECT *
FROM mobile_analytics.events m
LEFT JOIN books_users b
  ON b.user_id = m.user_id
    -- AND last_page > 0
```

If a user has performed multiple events and has added multiple books, then our LEFT JOIN on `user_id` will return $n \times m$ records for that user where $n$ is the number of events they performed and $m$ is the number of books they added to their library.

This explains why we must count distinct `user_id`.

```sql
SELECT  
  custom_parameters ->> 'ab_test_name' AS ab_test_name,
  custom_parameters ->> 'ab_test_variation' AS ab_test_variation,
  COUNT(DISTINCT(m.user_id)) AS cohort_size,
  COUNT(DISTINCT(b.user_id)) AS active_users
FROM mobile_analytics.events m
LEFT JOIN books_users b
  ON b.user_id = m.user_id
    -- AND last_page > 0
GROUP BY 1, 2
```

### Solution

Finally, we compute activation rate.

```sql
WITH active_users_per_cohort AS (
  SELECT  
    custom_parameters ->> 'ab_test_name' AS ab_test_name,
    custom_parameters ->> 'ab_test_variation' AS ab_test_variation,
    COUNT(DISTINCT(m.user_id)) AS cohort_size,
    COUNT(DISTINCT(b.user_id)) AS active_users_count
  FROM mobile_analytics.events m
  LEFT JOIN books_users b
    ON b.user_id = m.user_id
      -- AND last_page > 0
  GROUP BY 1, 2
)

SELECT 
  *,
  ROUND(100.0 * active_users_count / cohort_size, 1) AS activation_rate
FROM active_users_per_cohort
WHERE ab_test_name IS NOT NULL

