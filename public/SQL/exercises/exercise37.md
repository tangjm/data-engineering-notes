---
export_on_save:
  html: true
---

# 37. Ultimate AB-test dashboard: cohort sizes

Report cohort sizes (# of users) for all AB-test variations of all tests.

Note the `->>` syntax used for accessing the key of a JSON column in PostgreSQL.

```sql
WITH ab_test_stats AS (
SELECT 
  user_id,
  custom_parameters ->> 'ab_test_name' AS ab_test_name,
  custom_parameters ->> 'ab_test_variation' AS ab_test_variation
FROM mobile_analytics.events
WHERE custom_parameters ->> 'ab_test_name' IS NOT NULL
)

SELECT 
  ab_test_name,
  ab_test_variation,
  COUNT(DISTINCT(user_id)) AS cohort_size
FROM ab_test_stats
GROUP BY 1, 2
```