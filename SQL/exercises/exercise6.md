### 6. Distribution of users email domains 
Topics: Regex, LIKE

Number of users from a specific company 

calculate the number of users with an email from boogle.com domain like alex@boogle.com or vanessa@boogle.com.

```sql
SELECT 
    COUNT(id) AS users_count
FROM users
WHERE email LIKE '%@boogle.com'
```

```sql
SELECT 
    COUNT(id) AS users_count
FROM users
WHERE email ~ '^.+@boogle.com$'
```

For case-insensitive matching, use ILIKE or first lowercase the email before matching if using regex.

```sql
-- ignoring case
SELECT 
    COUNT(id) AS users_count
FROM users
WHERE email ILIKE '%@boogle.com'
```

```sql
-- ignoring case
SELECT 
    COUNT(id) AS users_count
FROM users
WHERE LOWER(email) ~ '^.+@boogle.com$'
```
