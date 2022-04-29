---
export_on_save:
  html: true
---
### 7. Total number of transactions 
Topics: COUNT, CASE statement

Calculate the total number of income transactions

In other words, count the total number of positive transactions

```sql
SELECT 
    COUNT(CASE WHEN amount_usd > 0 THEN id END) AS income_transactions_count
FROM transactions
```