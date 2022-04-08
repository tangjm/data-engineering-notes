-- Which version of Bindle iPhone app had error which prevent users from signing up?
-- For each signup event in adjust.callbacks, see if a corresponding user is created in the users table.
-- num of unique signup events / num of unique users with mobile app
-- We can try adjust.callbacks LEFT JOIN users on visitor_id
SELECT
	app_version,
	COUNT(
		DISTINCT(
			CASE
				WHEN activity_kind = 'install' THEN adid
			END
		)
	) AS installs,
	COUNT(
		DISTINCT(
			CASE
				WHEN event_name = 'signup' THEN adid
			END --since not all callbacks have a 'visitor_id'; 'adid' is also unique
		)
	) AS signups
FROM
	adjust.callbacks
GROUP BY
	1 -- We must also count the installs because an app version may have no signups if it has no installs.