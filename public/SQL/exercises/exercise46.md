# 46. Number of days to make the first purchase 

Calculate the number of days it takes for a user to make their first purchase.


We can left join purchases to users and then calculate the difference between the created_at columns of both tables.
to determine the number of days it takes for each user to make their first purchase.

```sql
SELECT
  p.created_at::date - u.created_at::date
FROM users u 
LEFT JOIN purchases p
  ON p.user_id = u.id
 ```

There are users who have made more than one purchase. We want to make sure we only consider the very first purchase for each user.

```sql
SELECT
  u.id,
  COUNT(p.id)
FROM users u 
LEFT JOIN purchases p
  ON p.user_id = u.id
GROUP BY 1
HAVING COUNT(p.id) > 1
```

We use a window function to order purchases in the purchases table in ascending order. Then we only include first purchases in our join result.

```sql
WITH purchases_ordered AS (
  SELECT 
    *,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) AS rank
  FROM purchases
)

SELECT *
FROM users u
INNER JOIN purchases_ordered p
  ON p.user_id = u.id
    AND rank = 1
```

We run a window function over days_to_buy to determine the number of users for each days_to_buy
Then we invoke the distinct function for deduplication.


```sql
WITH purchases_ordered AS (
  SELECT 
    *,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) AS rank
  FROM purchases
)

SELECT 
  DISTINCT(p.created_at::date - u.created_at::date) AS days_to_buy,
  COUNT(*) OVER (PARTITION BY p.created_at::date - u.created_at::date) AS users_count
FROM users u
INNER JOIN purchases_ordered p
  ON p.user_id = u.id
    AND rank = 1
ORDER BY 1
```

```sql
SELECT
    DISTINCT(p.created_at::date - u.created_at::date) AS days_to_buy,
    COUNT(*) OVER (PARTITION BY p.created_at::date - u.created_at::date) AS users_count
FROM users u 
INNER JOIN purchases p
  ON p.user_id = u.id
ORDER BY 1

