---
export_on_save:
  html: true
---
# 16. Demographics data report 

Topics: Grouping and Aggregating
Calculate the number of users from the USA (country code us) and Canada (country code ca) and their average age.

```sql
SELECT 
  country,
  COUNT(id) AS users_count,
  ROUND(AVG(age)) AS avg_age
FROM users
WHERE country IN ('us', 'ca')
GROUP BY 1
ORDER BY 2 DESC
```

```sql
WITH stats_by_country AS (
  SELECT 
    country,
    COUNT(id) AS users_count,
    ROUND(AVG(age)) AS avg_age
  FROM users
  WHERE country IN ('us', 'ca')
  GROUP BY 1
  ORDER BY 2 DESC
) 

SELECT *
FROM stats_by_country
WHERE country IN ('us', 'ca')
```