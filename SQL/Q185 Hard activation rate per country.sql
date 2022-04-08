-- Hard activation rate per country
-- For each country,
-- num of 'open-reader' events / num of install events
WITH started_book_by_country AS (
	SELECT
		country,
		COUNT(
			DISTINCT(
				CASE
					WHEN category = 'content'
					AND action = 'open-reader' THEN user_id
				END
			)
		) AS started_book,
		COUNT(
			DISTINCT(
				CASE
					WHEN category = 'onboarding'
					AND action = 'signup' THEN user_id
				END
			)
		) AS signups
	FROM
		mobile_analytics.events
	GROUP BY
		1
)
SELECT
	country,
	100.0 * started_book / signups AS hard_activation_rate
FROM
	started_book_by_country
ORDER BY
	2 DESC