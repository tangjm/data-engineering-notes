---
export_on_save:
  html: true
---
### 41. Calculating purchase rate

Topics: COUNT

Calculate overall purchase rate (percentage of customers among all users)

```sql
SELECT
  ROUND(100.0 * COUNT(CASE WHEN status = 'customer' THEN id END) / COUNT(*), 2) AS purchase_rate
FROM users
```