### 8. Percentage of refunded purchases 

calculate the refund rate based on all purchases.

Plan

count all records by 'id' where 'refunded = TRUE' and divide by all records
We don't count by 'user_id' because a user could make more than one purchase.

```sql
SELECT 
  COUNT(CASE WHEN refunded = TRUE THEN id END) AS refunds,
  COUNT(*) AS purchases,
  ROUND(100.0 * COUNT(CASE WHEN refunded = TRUE THEN id END) / COUNT(*), 2) AS refund_rate
FROM purchases
```
  
```sql
-- calculates the rate for both refunded and non-refunded purchases
SELECT
  refunded,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) over (), 2) AS percentage
FROM purchases
GROUP BY 1
```