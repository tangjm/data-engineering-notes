---
export_on_save:
  html: true
---

# 26. Top grossing month of the year. Part 2 

See exercise 22 for Part 1.

Find out which month historically had the highest gross revenue.

```sql
-- year, month with highest gross revenue
SELECT
    DATE_PART('year', created_at) AS y,
    DATE_PART('month', created_at) AS m,
    ROUND(SUM(CASE WHEN amount_usd > 0 THEN amount_usd END)) AS gross_revenue
FROM transactions
GROUP BY 1, 2
ORDER BY SUM(CASE WHEN amount_usd > 0 THEN amount_usd END) DESC
LIMIT 1
```

```sql
WITH gross_revenue_per_month AS (
SELECT
    DATE_PART('year', created_at) AS y,
    DATE_PART('month', created_at) AS m,
    SUM(amount_usd) AS revenue
FROM transactions
WHERE amount_usd > 0
GROUP BY 1, 2
)

SELECT
    m,
    
FROM gross_revenue_per_month
GROUP BY 1
```


Alternative solution

```sql
WITH gross_revenue_per_month AS (
SELECT
    TO_CHAR(created_at, 'yyyy-mm') AS year_month,
    SUM(amount_usd) AS gross_revenue
FROM transactions
WHERE amount_usd > 0
GROUP BY 1
)

SELECT 
    SPLIT_PART(year_month, '-', 1) AS y,
    SPLIT_PART(year_month, '-', 2) AS m,
    ROUND(gross_revenue) AS gross_revenue
FROM gross_revenue_per_month
ORDER BY 3 DESC
LIMIT 1
```