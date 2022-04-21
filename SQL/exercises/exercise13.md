### 13. The most profitable month

Find out which month historically had the highest profit.

First pass

```sql
WITH profit_per_month AS (
  SELECT 
      TO_CHAR(created_at, 'yyyy-mm') AS year_month,
      0.75 * SUM(amount_usd) AS profit
  FROM transactions
  GROUP BY 1
)

SELECT 
    SPLIT_PART(year_month, '-', 1) AS y,
    SPLIT_PART(year_month, '-', 2) AS m,
    ROUND(profit) AS profit
FROM profit_per_month
ORDER BY 3 DESC
LIMIT 1
```

Second pass 
Using DATE_PART

```sql
SELECT
    DATE_PART('year', created_at) AS y,
    DATE_PART('month', created_at) AS m,
    ROUND(0.75 * SUM(amount_usd)) AS profit
FROM transactions
GROUP BY 1, 2
ORDER BY 3 DESC
LIMIT 1
```


Solution

```sql
SELECT
    DATE_PART('year', created_at) AS y,
    DATE_PART('month', created_at) AS m,
    ROUND(0.75 * SUM(amount_usd)) AS profit
FROM transactions
GROUP BY 1, 2
ORDER BY SUM(amount_usd) DESC
LIMIT 1
```

Note that we ordered transactions not by profit column or ORDER BY 3 DESC but by the original value of net revenue. The problem is that if you have 2 months with close net revenues like 128139.11 and 128139.44 we might lose the correct order after rounding.