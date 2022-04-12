which creative has the highest click-to-signup conversion rate?
group by creative_name
num of distinct clicks / number of distinct signups


```sql
WITH clicks_signups_by_creative AS (
	SELECT
		creative_name,
		COUNT(
			DISTINCT(
				CASE
					WHEN activity_kind = 'click' THEN label
				END
			)
		) AS unique_clicks,
		COUNT(
			DISTINCT(
				CASE
					WHEN activity_kind = 'event'
					AND event_name = 'signup' THEN label
				END
			)
		) AS unique_signups
	FROM
		adjust.callbacks
	WHERE
		adgroup_name = 'website'
		AND tracker = 'gxel3d1'
	GROUP BY
		1
)
SELECT
	creative_name,
	unique_signups,
	100 * unique_signups / unique_clicks :: float AS conversion_rate
FROM
	clicks_signups_by_creative
ORDER BY
	3 DESC
```