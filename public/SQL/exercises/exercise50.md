---
export_on_save:
  html: true
--- 

# 50. Purchase rate for different cohorts 

Report purchase rate (customer_share) for both cohorts – regular users and users who were invited.

Regular users are those who weren't referred by another user.
All other users are invited users.

To count the number of customers we need to bring in data from the purchases table using a left join.

Customer share is the percentage of users who are customers.

```sql
SELECT 
  (CASE WHEN u.referrer_id IS NOT NULL THEN 'invited'
       ELSE 'regular' END) AS user_type,
  u.id,
  u.first_name,
  u.last_name,
  u.referrer_id,
  p.*
FROM users u
LEFT JOIN purchases p
  ON p.user_id = u.id
    AND refunded = FALSE
```

### Solution

```sql
SELECT 
  (CASE 
    WHEN u.referrer_id IS NOT NULL THEN 'invited'
    ELSE 'regular' 
  END) AS user_type,
  COUNT(DISTINCT(u.id)) AS users_count,
  COUNT(DISTINCT(p.user_id)) AS customers_count,
  ROUND(100.0 * COUNT(DISTINCT(p.user_id)) / COUNT(DISTINCT(u.id)), 2) AS customer_share
FROM users u
LEFT JOIN purchases p
  ON p.user_id = u.id
    AND refunded = FALSE
GROUP BY 1
```

We need to count `DISTINCT(p.user_id)` avoid overcounting the number of customers because each user isn't limited to a single purchase.

Why do we also need to count `DISTINCT(u.id)`?

Because in the case where a user makes more than one purchase, there will be as many records from the left table (users) as the number of matching records in the right table (purchases).


### Appendix

```sql
-- Total purchases
SELECT 
  COUNT(p.id)
FROM users u   
LEFT JOIN purchases p 
 ON p.user_id = u.id
```

```sql
-- Total non-refunded purchases
SELECT 
  COUNT(p.id)
FROM users u   
LEFT JOIN purchases p 
 ON p.user_id = u.id
WHERE refunded = FALSE
```

```sql
-- Total unique non-refunded purchases (number of customers)
SELECT 
  COUNT(DISTINCT(p.user_id))
FROM users u   
LEFT JOIN purchases p 
 ON p.user_id = u.id
WHERE refunded = FALSE
```

```sql
-- Total users
SELECT 
  COUNT(id)
FROM users
```


Test to check that numbers add up correctly for users and customers.

```sql
WITH temp AS (
  SELECT 
    (CASE 
      WHEN u.referrer_id IS NOT NULL THEN 'invited'
      ELSE 'regular' 
    END) AS user_type,
    COUNT(DISTINCT(u.id)) AS users_count,
    COUNT(DISTINCT(p.user_id)) AS customers_count,
    ROUND(100.0 * COUNT(DISTINCT(p.user_id)) / COUNT(DISTINCT(u.id)), 2) AS customer_share
  FROM users u
  LEFT JOIN purchases p
    ON p.user_id = u.id
      AND refunded = FALSE
  GROUP BY 1
)

, totals AS (
  SELECT 
    SUM(users_count) AS total_users_actual,
    SUM(customers_count) AS total_customers_actual
  FROM temp
)

, total_users AS (
  SELECT 
    COUNT(id) AS total_users_expected
  FROM users
)

, total_customers AS (
  SELECT 
    COUNT(DISTINCT(p.user_id)) AS total_customers_expected
  FROM users u   
  LEFT JOIN purchases p 
    ON p.user_id = u.id
  WHERE refunded = FALSE
)

SELECT 
  total_users_actual = total_users_expected AS "actual = expected (users)",
  total_customers_actual = total_customers_expected AS "actual = expected (customers)",
  total_users_actual,
  total_users_expected,
  total_customers_actual,
  total_customers_expected  
FROM totals, total_users, total_customers
```



### Playground

```sql
SELECT 
 u1.id,
 u1.first_name,
 u1.last_name,
 u1.referrer_id,
 u2.id,
 u2.first_name,
 u2.last_name
FROM users u1 
LEFT JOIN users u2
 ON u2.id = u1.referrer_id
```

Convoluted alternative with redundant self join.

```sql
SELECT 
  (CASE 
    WHEN u2.id IS NULL THEN 'regular'
    ELSE 'invited'
  END) AS user_type,
  COUNT(DISTINCT(u1.id)) AS users_count,
  COUNT(DISTINCT(p.user_id)) AS customers_count,
  ROUND(100.0 * COUNT(DISTINCT(p.user_id)) / COUNT(DISTINCT(u1.id)), 2) AS customer_share
FROM users u1 
LEFT JOIN users u2
 ON u2.id = u1.referrer_id
LEFT JOIN purchases p
 ON p.user_id = u1.id
    AND refunded = FALSE
GROUP BY 1
```

### Second pass (07/06/2022)

How many users were not invited?
How many users were invited?
Out of the non-invited users, how many are customers? What percentage are customers?
Out of the invited users, how many are customers? What percentage are customers?

Total users

```sql
SELECT COUNT(*)
FROM users
```

Total invited users

```sql
SELECT COUNT(*)
FROM users
WHERE referrer_id IS NOT NULL
```

Total regular users

```sql
SELECT COUNT(*)
FROM users
WHERE referrer_id IS NULL
```

Total customers

```sql
SELECT 
  COUNT(DISTINCT(p.user_id))
FROM users u
LEFT JOIN purchases p
  ON p.user_id = u.id
    AND refunded = FALSE
```

#### Final query

```sql
WITH user_cohorts AS (
SELECT 
 CASE
  WHEN referrer_id IS NULL THEN 'regular'
  ELSE 'invited'
 END AS user_type,
 u.id, 
 email,
 referrer_id,
 p.user_id,
 p.refunded
FROM users u
LEFT JOIN purchases p
  ON p.user_id = u.id
    AND refunded = FALSE
)

, metrics_by_cohort AS (
SELECT 
  user_type,
  COUNT(DISTINCT(id)) AS users_count,
  COUNT(DISTINCT(user_id)) AS customers_count,
  100.0 * COUNT(DISTINCT(user_id)) / COUNT(DISTINCT(id)) AS customer_share,
  SUM(COUNT(DISTINCT(id))) OVER () AS total_users,
  SUM(COUNT(DISTINCT(user_id))) OVER () AS total_customers
FROM user_cohorts
GROUP BY 1
)

SELECT 
  user_type,
  users_count,
  customers_count,
  ROUND(customer_share, 2) AS customer_share
FROM metrics_by_cohort
```