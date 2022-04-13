### 51. Count signups in the last 30 days 

report the number of signups for the last 30 days.

```sql
SELECT 
    COUNT(CASE WHEN created_at > now() - '30 days'::interval THEN id END) AS signups_count
FROM users

```

```sql
-- second pass
-- doesn't quite work since it includes all signups from 00:00:00 30 days ago until 00:00:00 today.

SELECT 
    COUNT(CASE WHEN TO_CHAR(created_at, 'yyyy-mm-dd') 
    BETWEEN TO_CHAR(now() - '30 days'::interval, 'yyyy-mm-dd')  AND TO_CHAR(now(), 'yyyy-mm-dd') THEN id END) AS signups_count
FROM users
```