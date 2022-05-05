---
export_on_save:
  html: true
---

# 31. Time between purchases

Calculate the average number of days between the very first and second purchase (based on all users with at least 2 purchases).

We join `purchases` to `users` via `carts`.
We can ignore users who haven't added items to a cart or who have made no purchases.
So we can inner join `purchases` to `carts` and `carts` to `users`.

```sql
SELECT *
FROM users u
INNER JOIN carts c
  ON c.user_id = u.id
INNER JOIN purchases p
  ON p.cart_id = c.id
```

We can check how many purchases each user made with the following query.

```sql
SELECT 
    u.id, 
    COUNT(*) AS purchases
FROM users u
INNER JOIN carts c
  ON c.user_id = u.id
INNER JOIN purchases p
  ON p.cart_id = c.id
GROUP BY 1
```

Next, we filter out users with less than two purchases

```sql
SELECT *
FROM users u
INNER JOIN carts c
  ON c.user_id = u.id
INNER JOIN purchases p
  ON p.cart_id = c.id
```


The LAG window function lets you specify the value of a column a certain number of rows preceding the current row.
The first argument to LAG is the name of the column whose value you want.
The second argument to LAG is an integer that represents the number of rows preceding the current row and defaults to 1.

If there is no previous row of the column you specified, as is the case with single element partitions, then LAG will return NULL. 

n.b. double quotes let us use special characters and whitespace in our alias names!

```sql
SELECT 
  u.id AS user_id,
  p.created_at AS purchase_date,
  p.cart_id,
  ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY p.created_at) AS "nth purchase",
  LAG(p.created_at, 1) OVER (PARTITION BY u.id ORDER BY p.created_at) AS "n-1th purchase date"
FROM users u
INNER JOIN carts c
  ON c.user_id = u.id
INNER JOIN purchases p
  ON p.cart_id = c.id
```

We will convert this into a subquery and subtract `n-1th purchase date` from `purchase_date` to determine the number of days between any two consecutive purchases.

The WHERE clause ensures we only consider the number of days between the first and second purchases.

```sql
WITH purchase_dates AS (
  SELECT 
    u.id AS user_id,
    p.created_at AS purchase_date,
    p.cart_id,
    ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY p.created_at) AS nth_purchase,
    LAG(p.created_at) OVER (PARTITION BY u.id ORDER BY p.created_at) AS prev_purchase_date
  FROM users u
  INNER JOIN carts c
    ON c.user_id = u.id
  INNER JOIN purchases p
    ON p.cart_id = c.id
)

SELECT 
    user_id,
    purchase_date::date,
    prev_purchase_date::date,
    purchase_date::date - prev_purchase_date::date AS difference_in_days
FROM purchase_dates
WHERE nth_purchase = 2
```

Now we have to consider hours, minutes and seconds when calculate the difference in days between two timestamps.
Casting them to dates will loose information about time.

```sql
WITH purchase_dates AS (
  SELECT 
    u.id AS user_id,
    p.created_at AS purchase_date,
    p.cart_id,
    ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY p.created_at) AS nth_purchase,
    LAG(p.created_at) OVER (PARTITION BY u.id ORDER BY p.created_at) AS prev_purchase_date
  FROM users u
  INNER JOIN carts c
    ON c.user_id = u.id
  INNER JOIN purchases p
    ON p.cart_id = c.id
)

SELECT 
    user_id,
    purchase_date,
    purchase_date::date,
    prev_purchase_date,
    prev_purchase_date::date,
    purchase_date::date - prev_purchase_date::date AS difference_in_days
FROM purchase_dates
WHERE nth_purchase = 2
```





















```sql
WITH purchase_dates AS (
  SELECT 
    u.id AS user_id,
    p.created_at AS purchase_date,
    p.cart_id,
    ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY p.created_at) AS nth_purchase,
    LAG(p.created_at) OVER (PARTITION BY u.id ORDER BY p.created_at) AS prev_purchase_date
  FROM users u
  INNER JOIN carts c
    ON c.user_id = u.id
  INNER JOIN purchases p
    ON p.cart_id = c.id
),

days_between_purchases AS (
  SELECT 
      user_id,
      purchase_date::date,
      prev_purchase_date::date,
      purchase_date::date - prev_purchase_date::date AS difference_in_days
  FROM purchase_dates
  WHERE nth_purchase = 2
)

SELECT 
  ROUND(AVG(difference_in_days)) AS avg_second_purchase_day
FROM days_between_purchases
```