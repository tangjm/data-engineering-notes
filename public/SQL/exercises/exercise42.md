---
export_on_save:
  html: true
---

# 42. Ultimate AB-test dashboard: purchase rate

Report cohort sizes (# of users) for all AB-test variations of all tests, including the number of customers and purchase rate.

We need to join `purchases` to `mobile_analytics.events` on `user_id` to bring in data about which members of each cohort are customers.

The cohort size of each variation of each AB test can be calculated as follows:

```sql
SELECT 
  custom_parameters ->> 'ab_test_name' AS ab_test_name,
  custom_parameters ->> 'ab_test_variation' AS ab_test_variation,
  COUNT(user_id) AS cohort_size
FROM mobile_analytics.events
WHERE action = 'signup'
  AND custom_parameters ->> 'ab_test_variation' IS NOT NULL
GROUP BY 1, 2
```

We can join non-refunded purchases to our table and then count distinct customers for each AB test variation and AB test.

```sql
SELECT 
  custom_parameters ->> 'ab_test_name' AS ab_test_name,
  custom_parameters ->> 'ab_test_variation' AS ab_test_variation,
  COUNT(DISTINCT(m.user_id)) AS cohort_size,
  COUNT(DISTINCT(p.user_id)) AS customers
FROM mobile_analytics.events m
LEFT JOIN purchases p
  ON p.user_id = m.user_id
    AND refunded = FALSE
WHERE action = 'signup'
  AND custom_parameters ->> 'ab_test_variation' IS NOT NULL    
GROUP BY 1, 2
```

We calculate purchase rate - customers / users

### Solution

```sql
SELECT 
  custom_parameters ->> 'ab_test_name' AS ab_test_name,
  custom_parameters ->> 'ab_test_variation' AS ab_test_variation,
  COUNT(DISTINCT(m.user_id)) AS cohort_size,
  COUNT(DISTINCT(p.user_id)) AS customers_count,
  ROUND(100.0 * COUNT(DISTINCT(p.user_id)) / COUNT(DISTINCT(m.user_id)), 1) AS purchase_rate
FROM mobile_analytics.events m
LEFT JOIN purchases p
  ON p.user_id = m.user_id
    AND refunded = FALSE
WHERE action = 'signup'
  AND custom_parameters ->> 'ab_test_variation' IS NOT NULL    
GROUP BY 1, 2
```

