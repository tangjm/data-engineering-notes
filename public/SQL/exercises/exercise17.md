---
export_on_save:
  html: true
---
# 17. Revenue by country 

Calculate the number of non-refunded purchases and total revenue from the USA (country code us) and Canada (country code ca).

Join the purchases table to the users table and then group by country.
Then for each country, aggregate purchase ids using COUNT and purchase amounts using SUM.

```sql
SELECT 
  country,
  COUNT(p.id) AS purchases_count,
  ROUND(SUM(p.amount)) AS total_revenue
FROM users u   
LEFT JOIN purchases p   
  ON u.id = p.user_id
    AND refunded = FALSE
WHERE country IN ('us', 'ca')
GROUP BY 1
ORDER BY SUM(p.amount) DESC
```