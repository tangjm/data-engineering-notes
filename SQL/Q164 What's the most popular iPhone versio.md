What's the most popular iPhone version among Bindle users?

```sql
SELECT
	SPLIT_PART(version, ',', 1) AS iphone_model,
	COUNT(*)
FROM devices
WHERE device_type = 'iphone'
GROUP BY 1
ORDER BY 2 DESC
```