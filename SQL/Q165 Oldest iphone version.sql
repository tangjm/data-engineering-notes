-- Oldest iphone version
WITH iphone_versions AS (
	SELECT
		SPLIT_PART(version, ',', 2) AS iphone_version,
		SPLIT_PART(SPLIT_PART(version, ',', 2), '.', 1) AS major_ver,
		SPLIT_PART(SPLIT_PART(version, ',', 2), '.', 2) AS minor_ver,
		SPLIT_PART(SPLIT_PART(version, ',', 2), '.', 3) AS patch_ver
	FROM
		devices
	WHERE
		device_type = 'iphone'
	ORDER BY
		major_ver,
		minor_ver,
		patch_ver
	LIMIT
		1
)
SELECT
	iphone_version AS oldest_iphone_version
FROM
	iphone_versions