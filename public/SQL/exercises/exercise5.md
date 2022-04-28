### 5. Distribution of users by country
Topics: COUNT, GROUP BY, IN

Count users from English speaking countries

- us, gb, au, ca, nz, ir

```sql
SELECT 
    country,
    COUNT(id) AS users_count
FROM users
WHERE country IN ('us', 'gb', 'au', 'ca', 'nz', 'ir')
GROUP BY 1
ORDER BY 2 DESC
```