---
export_on_save:
  html: true
---

# 30. Business spending seasonality 

Topics: Counting

Which month has the highest percentage of expense transactions (historically among all years)?

Group by month and divide the number of negative transactions by the total number of transactions. 

Sort these records by percentage with the highest at the top and return only the very first record.

```sql
WITH stats AS (
  SELECT 
    DATE_PART('month', created_at) AS month_number,
    COUNT(CASE WHEN amount_usd < 0 THEN id END) AS expense_transactions,
    COUNT(id) AS total_transactions,
    100.0 * COUNT(CASE WHEN amount_usd < 0 THEN id END) / COUNT(id) AS pecentage_expenses
  FROM transactions
  GROUP BY 1
  ORDER BY 4 DESC
)

SELECT month_number
FROM stats
LIMIT 1
```

By only grouping by month, we implicitly aggregate across all years.