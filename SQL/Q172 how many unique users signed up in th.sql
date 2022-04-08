-- how many unique users signed up in the app after installing it? (from the website)
-- num of sign ups / num of installs   
-- only consider case when tracker = 'gxel3d1' and adgroup_name = 'website'
WITH signups_installs AS (
	SELECT
		COUNT(
			DISTINCT(
				CASE
					WHEN activity_kind = 'install' THEN label
				END
			)
		) AS distinct_installs,
		COUNT(
			DISTINCT(
				CASE
					WHEN activity_kind = 'event'
					AND event_name = 'signup' THEN label
				END
			)
		) AS distinct_signups
	FROM
		adjust.callbacks
	WHERE
		tracker = 'gxel3d1'
		AND adgroup_name = 'website'
)
SELECT
	100 * distinct_signups / distinct_installs :: float AS conversion_rate
FROM
	signups_installs