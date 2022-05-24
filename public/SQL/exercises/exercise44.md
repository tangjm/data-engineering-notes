# 44. Ultimate AB-test dashboard: purchase rate uplift 

Report cohort sizes (# of users) for all AB-test variations of all tests, including the number of customers, purchase rate and purchase rate uplift (relative to control variation).

ab_test_name
ab_test_variation
cohort_size
customers_count
purchase_rate
purchase_rate_uplift

Purchase rate uplift is the difference or change relative to the control variation.


Zoom in on which AB variation each user is attributed to

```sql
SELECT 
  custom_parameters ->> 'ab_test_name' AS ab_test_name,
  custom_parameters ->> 'ab_test_variation' AS ab_test_variation,
  user_id
FROM mobile_analytics.events
```

Calculate cohort size, customers and purchase_rate

```sql
WITH attribution_stats AS (
  SELECT 
    custom_parameters ->> 'ab_test_name' AS ab_test_name,
    custom_parameters ->> 'ab_test_variation' AS ab_test_variation,
    user_id
  FROM mobile_analytics.events 
)

SELECT 
  ab_test_name,
  ab_test_variation,
  COUNT(DISTINCT(a.user_id)) AS cohort_size,
  COUNT(DISTINCT(p.user_id)) AS customers,
  100.0 * COUNT(DISTINCT(p.user_id)) / COUNT(DISTINCT(a.user_id)) AS purchase_rate
FROM attribution_stats a
LEFT JOIN purchases p
  ON p.user_id = a.user_id
    AND refunded = FALSE
GROUP BY 1, 2
```

For each AB test, determine the uplift of its non-control variations relative to its control variation.

#### First pass

Use a window function and calculate the percentage difference from the control for all variations. 

Then use a NULLIF(purchase_rate - purchase_rate_control, 0) to convert the uplift of the control variation to NULL.

But this won't account for non-control variations that have the same purchase_rate as the control variation.


#### Second pass

If our ab_test_variation within each partition by ab_test_name is not the control variation, then we calculate the percentage difference of its purchase_rate relative to the control variation's purchase_rate. Otherwise, we return NULL.

We add a column with the purchase_rate of the control variation for each AB test. In each AB test partition, we sort each partition s.t. the control variation is at the top. 

To achieve this, we can first use NULLIF to convert records with an ab_test_variation field of 'control' to NULL and then specify `ORDER BY ab_test_variation NULLS FIRST` in our () clause of our window function.

Before, we weren't able to ensure that 'control' variations were always the first value of each partition. We can now ensure this because NULL values returned from NULLIF should only represent control variations and NULLS FIRST gives us control over how we sort NULL values. 

We then use ROW_NUMBER() as a way to map control variations to NULL and non-control variations to their respective uplift calculations in terms of $\frac {p - f}{f}$ where $p$ is the purchase_rate of the current variation and $f$ is the purchase_rate of the control variation in each partition. This ensures that only the control variation has a NULL purchase rate uplift and other variations with the same purchase_rate as the control variation will have an uplift of 0.

```sql
WITH attribution_stats AS (
  SELECT 
    custom_parameters ->> 'ab_test_name' AS ab_test_name,
    custom_parameters ->> 'ab_test_variation' AS ab_test_variation,
    user_id
  FROM mobile_analytics.events 
)

SELECT 
  ab_test_name,
  ab_test_variation,
  COUNT(DISTINCT(a.user_id)) AS cohort_size,
  COUNT(DISTINCT(p.user_id)) AS customers,
  100.0 * COUNT(DISTINCT(p.user_id)) / COUNT(DISTINCT(a.user_id)) AS purchase_rate,
  FIRST_VALUE(100.0 * COUNT(DISTINCT(p.user_id)) / COUNT(DISTINCT(a.user_id)) ) OVER (PARTITION BY ab_test_name ORDER BY NULLIF(ab_test_variation, 'control') NULLS FIRST),
  ROW_NUMBER () OVER (PARTITION BY ab_test_name ORDER BY NULLIF (ab_test_variation, 'control') NULLS FIRST),
  CASE WHEN ROW_NUMBER () OVER (PARTITION BY ab_test_name ORDER BY NULLIF (ab_test_variation, 'control') NULLS FIRST) != 1 THEN 100.0 * (100.0 * COUNT(DISTINCT(p.user_id)) / COUNT(DISTINCT(a.user_id)) - FIRST_VALUE(100.0 * COUNT(DISTINCT(p.user_id)) / COUNT(DISTINCT(a.user_id)) ) OVER (PARTITION BY ab_test_name ORDER BY NULLIF(ab_test_variation, 'control') NULLS FIRST)) / FIRST_VALUE(100.0 * COUNT(DISTINCT(p.user_id)) / COUNT(DISTINCT(a.user_id)) ) OVER (PARTITION BY ab_test_name ORDER BY NULLIF(ab_test_variation, 'control') NULLS FIRST) END
FROM attribution_stats a
LEFT JOIN purchases p
  ON p.user_id = a.user_id
    AND refunded = FALSE
GROUP BY 1, 2
```

Let's make this more readable

```sql
WITH attribution_stats AS (
  SELECT 
    custom_parameters ->> 'ab_test_name' AS ab_test_name,
    custom_parameters ->> 'ab_test_variation' AS ab_test_variation,
    user_id
  FROM mobile_analytics.events
  WHERE custom_parameters ->> 'ab_test_name' IS NOT NULL
)

, stats_with_aggregation_and_window_funcs AS (
  SELECT 
    ab_test_name,
    ab_test_variation,
    COUNT(DISTINCT(a.user_id)) AS cohort_size,
    COUNT(DISTINCT(p.user_id)) AS customers,
    100.0 * COUNT(DISTINCT(p.user_id)) / COUNT(DISTINCT(a.user_id)) AS purchase_rate,
    FIRST_VALUE(100.0 * COUNT(DISTINCT(p.user_id)) / COUNT(DISTINCT(a.user_id))) OVER (PARTITION BY ab_test_name ORDER BY NULLIF(ab_test_variation, 'control') NULLS FIRST) AS purchase_rate_control,
    ROW_NUMBER() OVER (PARTITION BY ab_test_name ORDER BY NULLIF (ab_test_variation, 'control') NULLS FIRST)
  FROM attribution_stats a
  LEFT JOIN purchases p
    ON p.user_id = a.user_id
      AND refunded = FALSE
  GROUP BY 1, 2
)

SELECT 
  ab_test_name,
  ab_test_variation,
  cohort_size,
  customers AS customers_count,
  ROUND(purchase_rate, 1) AS purchase_rate,
  ROUND(CASE WHEN 
    row_number != 1 THEN 100.0 * (purchase_rate - purchase_rate_control) / purchase_rate_control
  END, 1) AS purchase_rate_uplift
FROM stats_with_aggregation_and_window_funcs
```


Alternative solution without using ROW_NUMBER.

```sql
WITH attribution_stats AS (
  SELECT 
    custom_parameters ->> 'ab_test_name' AS ab_test_name,
    custom_parameters ->> 'ab_test_variation' AS ab_test_variation,
    user_id
  FROM mobile_analytics.events
  WHERE custom_parameters ->> 'ab_test_name' IS NOT NULL
)

, stats_with_aggregation_and_window_funcs AS (
  SELECT 
    ab_test_name,
    ab_test_variation,
    COUNT(DISTINCT(a.user_id)) AS cohort_size,
    COUNT(DISTINCT(p.user_id)) AS customers,
    100.0 * COUNT(DISTINCT(p.user_id)) / COUNT(DISTINCT(a.user_id)) AS purchase_rate,
    FIRST_VALUE(100.0 * COUNT(DISTINCT(p.user_id)) / COUNT(DISTINCT(a.user_id))) OVER (PARTITION BY ab_test_name ORDER BY NULLIF(ab_test_variation, 'control') NULLS FIRST) AS purchase_rate_control
  FROM attribution_stats a
  LEFT JOIN purchases p
    ON p.user_id = a.user_id
      AND refunded = FALSE
  GROUP BY 1, 2
)

SELECT 
  ab_test_name,
  ab_test_variation,
  cohort_size,
  customers AS customers_count,
  ROUND(purchase_rate, 1) AS purchase_rate,
  ROUND(CASE WHEN ab_test_variation != 'control' THEN 100.0 * (purchase_rate - purchase_rate_control) / purchase_rate_control
  END, 1) AS purchase_rate_uplift
FROM stats_with_aggregation_and_window_funcs
```


Time to test our FIRST_VALUE window function
