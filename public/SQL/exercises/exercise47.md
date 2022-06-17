# 47. Number of days to make the first purchase with percentage distribution 

Calculate the number of days it takes a user to make the first purchase. Also calculate percentage distribution - what percentage of users with purchases took X days after signing up to make their first purchase, where X is the number of days between the signup date and first purchase date.

```sql
SELECT 
  u.id,
  u.email,
  u.created_at,
  p.user_id,
  p.created_at,
  ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY p.created_at)
FROM users u
LEFT JOIN purchases p
  ON p.user_id = u.id
ORDER BY u.id
```

For users who have made a purchase, we need to find the difference between the time of their signup and the time of their first purchase.

First, we can filter out first purchases of each user.

```sql
WITH users_purchases AS (
SELECT 
  u.id,
  u.email,
  u.created_at AS signup_date,
  p.user_id,
  p.created_at AS purchase_date,
  ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY p.created_at)
FROM users u
INNER JOIN purchases p
  ON p.user_id = u.id
ORDER BY u.id
)

SELECT *
FROM users_purchases
WHERE row_number = 1
```

Then we perform the calculations and exclude refunded purchases.

```sql
WITH users_purchases AS (
  SELECT 
    u.id,
    u.email,
    u.created_at AS signup_date,
    p.user_id,
    p.created_at AS purchase_date,
    ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY p.created_at)
  FROM users u
  INNER JOIN purchases p
    ON p.user_id = u.id
      AND refunded = FALSE
  ORDER BY 1
)

, users_purchases_stats AS (
SELECT
  purchase_date::date - signup_date::date AS days_to_buy,
  COUNT(*) AS users_count,
  SUM(COUNT(*)) OVER () AS total_users_with_purchases,
  100.0 * COUNT(*) / SUM(COUNT(*)) OVER () AS percentage_distribution
FROM users_purchases
WHERE row_number = 1
GROUP BY 1
)

SELECT 
  days_to_buy,
  users_count,
  ROUND(percentage_distribution, 1) AS percentage
FROM users_purchases_stats
```




