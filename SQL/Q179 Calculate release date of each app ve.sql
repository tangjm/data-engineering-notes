-- Calculate release date of each app version
SELECT
	app_version,
	MIN(created_at)
FROM
	adjust.callbacks
GROUP BY
	1
ORDER BY
	string_to_array(app_version, '.')