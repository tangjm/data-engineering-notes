CROSS JOIN exercise

```sql
WITH revenue AS (
SELECT 
  SUM(amount) AS total_revenue
FROM purchases p 
INNER JOIN users u 
  ON p.user_id = u.id
WHERE 
  refunded = 'f'
  AND 
  utm_campaign IS NOT NULL
), spends AS (
SELECT 
  SUM(amount) AS total_spends
FROM marketing_spends
)

SELECT 
  100 * (total_revenue - total_spends) / total_spends AS ROI
FROM revenue
CROSS JOIN spends
```

We use CROSS JOIN since the two tables are unrelated. We also have two singleton tables here.