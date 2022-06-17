---
export_on_save:
  html: true
---
# 45. Design research: users who refunded 

Provide a list of the 50 most recent customers who refunded their purchase. 

The 50 latest refunds

```sql
SELECT *
FROM purchases
WHERE refunded = TRUE
ORDER BY created_at DESC
LIMIT 50
```

### Solution

```sql
SELECT
  u.first_name,
  u.email
FROM purchases p
INNER JOIN users u
  ON u.id = p.user_id
WHERE refunded = TRUE
ORDER BY p.created_at DESC
LIMIT 50
```

The join order doesn't matter if we're using an inner join.

```sql
SELECT
  first_name,
  email
FROM users u
INNER JOIN purchases p 
  ON p.user_id = u.id
WHERE refunded = TRUE
ORDER BY p.created_at DESC
LIMIT 50
```