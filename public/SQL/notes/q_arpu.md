---
export_on_save:
  html: true
---

Find the marketing campaign with the highest ARPU (average revenue per user).

revenue per campaign / total users

```sql
SELECT 
  utm_campaign,
  SUM(amount) / COUNT(DISTINCT(u.id)) AS ARPU
FROM purchases p 
LEFT JOIN users u
  ON p.user_id = u.id
    AND refunded = 'f'
GROUP BY 1
ORDER BY 2 DESC
```