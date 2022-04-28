# 19. Distribution of countries by purchase rate

Order countries by their purchase rate (percentage of customers or users with at least one non-refunded purchase). 

```sql
WITH purchase_rate_per_country AS (
  SELECT 
    country,
    COUNT(DISTINCT(p.user_id)) AS customers,
    100.0 * COUNT(DISTINCT(p.user_id)) / COUNT(u.id) AS purchase_rate1
  FROM users u  
  LEFT JOIN purchases p  
    ON u.id = p.user_id
      AND refunded = FALSE
  GROUP BY 1
)

SELECT  
  country,
  ROUND(purchase_rate1, 2) AS purchase_rate
FROM purchase_rate_per_country
WHERE customers >= 10
ORDER BY 2 DESC
LIMIT 5
```

Using the HAVING clause, we can do without the CTE.


```sql
SELECT 
  country,
  COUNT(DISTINCT(p.user_id)) AS customers,
  ROUND(100.0 * COUNT(DISTINCT(p.user_id)) / COUNT(u.id), 2) AS purchase_rate
FROM users u  
LEFT JOIN purchases p  
  ON u.id = p.user_id
    AND refunded = FALSE
GROUP BY 1
HAVING COUNT(DISTINCT(p.user_id)) >= 10 
ORDER BY 2 DESC
LIMIT 5
```