---
export_on_save:
  html: true
---
### 8. Percentage of refunded purchases 
Topics: COUNT

Calculate the refund rate based on all purchases.

Plan:

Count all records by 'id' where 'refunded = TRUE' and divide by all records.
We don't count by the 'user_id' field because a user could make more than one purchase.

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