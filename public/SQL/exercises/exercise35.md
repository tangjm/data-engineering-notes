---
export_on_save:
  html: true
---

# 35. Revenue distribution by country 

Topics: Aggregate functions, Window functions

Calculate the total revenue by country and its percentage from the total revenue of all countries. Report only 3 countries (the ones with the highest revenues).

Total revenue by country and its percentage share of the sum-total revenue.

We first join `purchases` to `users`

```sql
SELECT *
FROM users u
INNER JOIN purchases p
  ON p.user_id = u.id
    AND p.refunded = FALSE
```

Total revenue by country

```sql
SELECT 
  country,
  SUM(amount) AS revenue
FROM users u
INNER JOIN purchases p
  ON p.user_id = u.id
    AND p.refunded = FALSE
GROUP BY 1
```

### Solution

We calculate for each country its percentage share of the total revenue using a window function. 

```sql
WITH revenue_per_country AS (
SELECT 
  country,
  SUM(amount) AS revenue
FROM users u
INNER JOIN purchases p
  ON p.user_id = u.id
    AND p.refunded = FALSE
GROUP BY 1
)

SELECT 
  country,
  ROUND(revenue) AS total_revenue,
  ROUND(100.0 * revenue / SUM(revenue) OVER ()) AS percentage
FROM revenue_per_country
ORDER BY 3 DESC
LIMIT 3
```

We could have used LEFT JOIN to include countries whose users have not made any non-refunded purchases.

We can use window functions with group by clause in the same query. We make sure that we apply our aggregate function to the result of an aggregation, in this case, the window function `SUM() OVER ()` is applied to the aggregate amount `SUM(amount)`.

```sql {.line-numbers highlight=4}
SELECT 
  country,
  SUM(amount) AS revenue,
  SUM(amount) / SUM(SUM(amount)) OVER () AS percentage
FROM users u
INNER JOIN purchases p
  ON p.user_id = u.id
    AND p.refunded = FALSE
GROUP BY 1