---
export_on_save:
  html: true
---

# 25. E-commerce power users

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
  COUNT(DISTINCT(user_id)) AS total_users,
  COUNT(DISTINCT(CASE WHEN purchases >= 5 THEN user_id END)) AS users_with_5_or_more_purchases,
  ROUND(100.0 * COUNT(DISTINCT(CASE WHEN purchases >= 5 THEN user_id END)) / COUNT(DISTINCT(user_id)), 2) AS percentage
FROM purchase_stats
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

Maybe we're misinterpreting 'in a month' to mean 'in a calendar month' when should take it to denote a timeframe of a month.

So purchases that occur within a period of a month that span multiple calendar months should also be counted. This will result in greater numbers of users with at least 5 purchases.

