---
export_on_save:
  html: true
---

# 25. E-commerce power users (Unsolved)

Calculate the percentage of users who purchased 5 or more times during one month 

Tables: purchases and carts

left join purchases to carts

group by the user_id from the cart, the total number of groups corresponds to the total number of users

sort each user_id group by the created_at field from the purchases table, then count cart_id of the purchases table where the number of cart_id's is greater than or equal to 5 and at least 5 card_id's have the same TO_CHAR(created_at, 'yyyy-mm') value.

```sql
-- example user with more than five purchases in a month
SELECT *
FROM carts c 
LEFT JOIN purchases p
  ON p.cart_id = c.id
WHERE user_id = 17670 
```


```sql
-- ordered purchases for each user
SELECT 
    *,
  ROW_NUMBER() over (PARTITION BY user_id ORDER BY p.created_at)
FROM carts c 
LEFT JOIN purchases p
  ON p.cart_id = c.id
```

We group by `user_id` and `created_at` date of purchased carts that have a purchase date in the same month.
By counting the number of records per group, we are able to calculate the total purchases that each user made for each month they made a purchase.

We also make sure to join the `users` table to include users who haven't created a basket in addition to those with zero or more purchases.

```sql
WITH purchase_stats AS (
  SELECT 
    user_id,
    TO_CHAR(p.created_at, 'yyyy-mm') AS year_month,
    COUNT(*) AS purchases
  FROM carts c 
  LEFT JOIN purchases p
    ON p.cart_id = c.id
  GROUP BY 1, 2
  ORDER BY 3 DESC
)

SELECT 
  COUNT(DISTINCT(u.id)) AS total_users,
  COUNT(DISTINCT(CASE WHEN purchases >= 5 THEN ps.user_id END)) AS users_with_5_or_more_purchases,
  ROUND(100.0 * COUNT(DISTINCT(CASE WHEN purchases >= 5 THEN ps.user_id END)) / COUNT(DISTINCT(u.id)), 2) AS percentage
FROM users u
LEFT JOIN purchase_stats ps
  ON ps.user_id = u.id
```

```sql
-- users with at least 5 purchases in multiple months
WITH purchase_stats AS (
  SELECT 
    user_id,
    TO_CHAR(p.created_at, 'yyyy-mm') AS year_month,
    COUNT(*) AS purchases
  FROM carts c 
  LEFT JOIN purchases p
    ON p.cart_id = c.id
  GROUP BY 1, 2
  HAVING COUNT(*) >= 5
  ORDER BY 3 DESC
)

SELECT 
  COUNT(user_id) AS total_groups,
  COUNT(DISTINCT(user_id)) AS users_with_at_least_5_purchases,
  COUNT(user_id) - COUNT(DISTINCT(user_id)) AS users_with_at_least_5_purchases_in_multiple_months
FROM purchase_stats
```

Maybe we're misinterpreting 'in a month' to mean 'in a calendar month' when we should take it to denote a timeframe of a month.

So purchases that occur within a period of a month that span multiple calendar months should also be counted. This will result in greater numbers of users with at least 5 purchases.





### Second pass (27-05-2022) (Still not working)

The problem might be that 'month' should be interpreted more charitably to denote a period of 30 days instead of a calendar month.

So we will have to determine for each user whether at least 5 of their purchases occurred within 30 days of each other.

We can make use of window functions and work along these lines.

If we sort user purchases in ascending order, then we can look through them one by one and compare the timestamp of the 4th purchase from the current purchase to see if that later purchase falls within 30 days of the timestamp of the current purchase.

Partition purchases by user and order each user's purchase by date in ascending order.
Then for each each record $n$, we can check if record $n + 4$ has a `created_at` date that satisfies the predicate `<= created_at + '30 days'::interval`.

We then implement this as follows in SQL:

```sql
LEAD(created_at, 4) OVER (PARTITION BY user_id ORDER BY created_at) <= created_at + '30 days'::interval
```

Finally, we can know if a user is a power user (a user who made 5+ purchases in a month) if at least one record in the partition has value 'True'.

First version of working query.

```sql
WITH customer_purchases AS (
  SELECT 
    user_id,
    c.id AS cart_id,
    p.created_at,
    COUNT(*) OVER (PARTITION BY user_id) AS purchase_times,
    LEAD(p.created_at, 4) OVER (PARTITION BY user_id ORDER BY p.created_at) <= p.created_at + '30 days'::interval AS power_user
  FROM carts c  
  LEFT JOIN purchases p 
    ON p.cart_id = c.id
  ORDER BY user_id, p.created_at
)

, totals AS (
  SELECT 
    COUNT(DISTINCT(u.id)) AS total_users,
    COUNT(DISTINCT(CASE WHEN purchase_times >= 5 AND power_user = TRUE THEN pu.user_id END)) AS power_user_count
  FROM users u
  LEFT JOIN customer_purchases cu
    ON pu.user_id = u.id
)

SELECT 
  total_users,
  power_user_count AS users_with_5_or_more_purchases,
  ROUND(100.0 * power_user_count / total_users, 2) AS percentage
FROM totals
```

Refactored.

```sql
WITH user_purchases AS (
  SELECT 
    u.id,
    p.created_at,
    CASE WHEN p.id IS NOT NULL THEN COUNT(*) OVER (PARTITION BY u.id) END AS purchase_times,
    LEAD(p.created_at, 4) OVER (PARTITION BY u.id ORDER BY p.created_at) <= p.created_at + '30 days'::interval AS power_user
  FROM users u
  LEFT JOIN carts c
    ON c.user_id = u.id
  LEFT JOIN purchases p 
    ON p.cart_id = c.id
  ORDER BY u.id, p.created_at
)

SELECT 
  COUNT(DISTINCT(id)) AS total_users,
  COUNT(DISTINCT(CASE WHEN purchase_times >= 5 AND power_user = TRUE THEN id END)) AS users_with_5_or_more_purchases,
  ROUND(100.0 * COUNT(DISTINCT(CASE WHEN purchase_times >= 5 AND power_user = TRUE THEN id END)) / COUNT(DISTINCT(id)), 2) AS percentage
FROM user_purchases
```


The following two are equivalent.

```sql
NULLIF(COUNT(p.id) OVER (PARTITION BY u.id), 0) AS purchase_times
```

```sql
CASE WHEN p.id IS NOT NULL THEN COUNT(*) OVER (PARTITION BY u.id) END AS purchase_times
```

This alternative returns 0 instead of null for users with no purchases

```sql
COUNT(p.id) OVER (PARTITION BY u.id) AS purchase_times
```




### Appendix

Creating an intermediate power users table.

```sql
WITH customer_purchases AS (
  SELECT 
    user_id,
    c.id AS cart_id,
    p.created_at,
    COUNT(*) OVER (PARTITION BY user_id) AS purchase_times,
    LEAD(p.created_at, 4) OVER (PARTITION BY user_id ORDER BY p.created_at) <= p.created_at + '30 days'::interval AS power_user
  FROM carts c  
  LEFT JOIN purchases p 
    ON p.cart_id = c.id
  ORDER BY user_id, p.created_at
)

, power_users AS (
  SELECT *
  FROM customer_purchases
  WHERE purchase_times >= 5
)

, totals AS (
  SELECT 
    COUNT(DISTINCT(u.id)) AS total_users,
    COUNT(DISTINCT(CASE WHEN power_user = TRUE THEN pu.user_id END)) AS power_user_count
  FROM users u
  LEFT JOIN power_users pu
    ON pu.user_id = u.id
)

SELECT 
  total_users,
  power_user_count AS users_with_5_or_more_purchases,
  ROUND(100.0 * power_user_count / total_users, 2) AS percentage
FROM totals
```



Using cross joins

```sql
WITH customer_purchases AS (
  SELECT 
    user_id,
    c.id AS cart_id,
    p.created_at,
    COUNT(*) OVER (PARTITION BY user_id) AS purchase_times,
    LEAD(p.created_at, 4) OVER (PARTITION BY user_id ORDER BY p.created_at) <= p.created_at + '30 days'::interval AS power_user
  FROM carts c  
  LEFT JOIN purchases p 
    ON p.cart_id = c.id
  ORDER BY user_id, p.created_at
)

, power_users AS (
  SELECT 
    COUNT(DISTINCT(CASE WHEN power_user = TRUE THEN user_id END)) AS power_user_count
  FROM customer_purchases
  WHERE purchase_times >= 5
)

, total_users AS (
  SELECT 
    COUNT(*) AS total_users
  FROM users u
)

SELECT 
  total_users,
  power_user_count AS users_with_5_or_more_purchases,
  ROUND(100.0 * power_user_count / total_users, 2) AS percentage
FROM total_users, power_users
```



Query with views

```sql
WITH raw_data AS (
   SELECT 
    u.id,
    c.id AS cart_id,
    p.created_at,
    COUNT(p.id) OVER (PARTITION BY u.id) AS purchase_times,
    LEAD(p.created_at, 4) OVER (PARTITION BY u.id ORDER BY p.created_at) <= p.created_at + '30 days'::interval AS power_user
  FROM users u
  LEFT JOIN carts c  
    ON c.user_id = u.id
  LEFT JOIN purchases p 
    ON p.cart_id = c.id
  ORDER BY 1, 3
)

CREATE VIEW users_purchases AS (
  SELECT 
    id,
    cart_id,
    created_at
  FROM raw_data
)

CREATE VIEW users_purchases_count AS (
  SELECT
    DISTINCT(id) AS user_id,
    purchase_times
  FROM raw_data
  ORDER BY 1
)

CREATE VIEW power_users AS (
  SELECT 
    DISTINCT(id) AS user_id,
    purchase_times
  FROM raw_data
  WHERE purchase_times >= 5
    AND power_user = TRUE
  ORDER BY 1
)

CREATE VIEW total_users AS (
  SELECT 
    COUNT(*)
  FROM users
)

SELECT 
  COUNT(DISTINCT(id)) AS total_users,
  COUNT(DISTINCT(CASE WHEN purchase_times >= 5 AND power_user = TRUE THEN id END)) AS users_with_5_or_more_purchases,
  ROUND(100.0 *
  COUNT(DISTINCT(CASE WHEN purchase_times >= 5 AND power_user = TRUE THEN id END)) / 
  COUNT(DISTINCT(id)), 2) AS percentage
FROM raw_data
```