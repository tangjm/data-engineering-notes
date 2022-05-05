---
export_on_save:
  html: true
---

ROI question on GROUP BY, INNER JOIN and LEFT JOIN

Calculating marketing channel ROI.

-- join users and purchases table
-- group by campaign
-- calculate revenue for each utm_source

-- join the result of the first query with marketing_spends on utm_source
-- use the revenue and spending columns to calculate ROI    


```sql
WITH source_revenue AS (
  SELECT 
    utm_source,
    SUM(amount) AS total_revenue
  FROM purchases p
  INNER JOIN users u
    ON p.user_id = u.id
  WHERE 
    refunded = 'f'
  GROUP BY 1
), source_expenditure AS (
  SELECT 
    utm_source,
    SUM(amount) AS total_expenditure
  FROM marketing_spends
  GROUP BY 1
)
```

If we want to ignore campaigns that generated no revenue, we can use INNER JOIN or LEFT JOIN (source_revenue, source_expenditure).
Otherwise, we should use LEFT JOIN (source_expenditure, source_revenue).

```sql
SELECT 
  ex.utm_source AS marketing_source,
  100.0 * (total_revenue - total_expenditure) / total_expenditure AS ROI
FROM source_expenditure ex
LEFT JOIN source_revenue re
  ON ex.utm_source = re.utm_source
ORDER BY 2 DESC
```