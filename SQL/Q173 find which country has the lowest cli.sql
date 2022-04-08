--  find which country has the lowest click-to-signup conversion rate. (for website referrals)

-- click -> install -> signup
-- or click -> signup 

-- num of unique clicks / num of unique signups

WITH clicks_signups_by_country AS (
	SELECT
		country,
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
	*,
	100.0 * unique_signups / unique_clicks AS overall_conversion_rate
FROM
	clicks_signups_by_country
WHERE
	unique_signups >= 10
ORDER BY
	4