---
export_on_save:
  html: true
---

# 29. ARPU per country 

Topics: ARPU

Calculate the total revenue and the average revenue per user (ARPU) for users from the USA (country code us) and Canada (country code ca).

We left join `purchases` to `users` because this will include users who have not made any purchases. We could also use a right join if we wanted.

Ensure we count distinct `u.id` instead of `p.user_id` as using the latter would get us Average Revenue Per Paying User (ARPPU). Also note that users can make more than one purchase.

### Solution

```sql
SELECT 
  country,
  ROUND(SUM(amount)) AS total_revenue,
  ROUND(SUM(amount) / COUNT(DISTINCT(u.id))) AS ARPU
FROM users u
LEFT JOIN purchases p
  ON p.user_id = u.id
    AND refunded = FALSE
GROUP BY 1
HAVING country IN ('us', 'ca')
ORDER BY SUM(amount) DESC
```