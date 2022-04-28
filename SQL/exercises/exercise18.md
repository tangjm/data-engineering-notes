# 18. A month with the lowest number of purchases

Find out which month has the lowest number of income transactions.

Income transactions are transactions with positive value. 

Group by month ignoring years and count the number of transactions with positive value.

```sql
WITH income_transactions_by_month AS (
  SELECT 
      DATE_PART('month', created_at) AS month_number,
      COUNT(id) AS income_transaction_count
  FROM transactions
  WHERE amount_usd > 0
  GROUP BY 1
)

SELECT month_number
FROM income_transactions_by_month
ORDER BY income_transaction_count 
LIMIT 1
```

Single query version - we move the aggregate function into the ORDER BY clause. n.b. Any expression that can appear in the SELECT clause can also appear in the ORDER BY clause.

```sql
SELECT 
    DATE_PART('month', created_at) AS month_number
FROM transactions
GROUP BY 1
ORDER BY COUNT(*)
LIMIT 1
```