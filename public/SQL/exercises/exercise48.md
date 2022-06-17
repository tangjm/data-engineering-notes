# 48. Number of days to make the first purchase with ranges 

Calculate the number of days it takes a user to make the first purchase. Note that days_to_buy column is a range '1-2' or '3-5'.

```sql
SELECT 
  u.id,
  u.created_at AS signup_date,
  p.created_at AS purchase_date
FROM users u
INNER JOIN purchases p
  ON p.user_id = u.id
    AND refunded = FALSE
```

### Solution

```sql
WITH users_purchases AS (
  SELECT 
    u.id,
    u.created_at AS signup_date,
    p.created_at AS purchase_date,
    ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY p.created_at)
  FROM users u
  INNER JOIN purchases p
    ON p.user_id = u.id
      AND refunded = FALSE
)

, users_purchases_with_ranges AS (
  SELECT 
    CASE 
      WHEN purchase_date::date - signup_date::date <= 2 THEN 'rank=1, 1 - 2'
      WHEN purchase_date::date - signup_date::date <= 5 THEN 'rank=2, 3 - 5'
      WHEN purchase_date::date - signup_date::date <= 10 THEN 'rank=3, 5 - 10'
      WHEN purchase_date::date - signup_date::date > 10 THEN 'rank=4, 10+'
    END AS date_ranges,
    COUNT(*) AS users_count,
    SUM(COUNT(*)) OVER () AS total_users_with_purchases,
    100.0 * COUNT(*) / SUM(COUNT(*)) OVER () AS percentage_distribution
  FROM users_purchases
  WHERE row_number = 1
  GROUP BY 1
)

SELECT 
  SPLIT_PART(date_ranges, ',', 2) AS days_to_buy,
  users_count,
  ROUND(percentage_distribution, 1) AS percentage
FROM users_purchases_with_ranges
```