-- D7 retention rate for all mobile signups from the day of Feb 1, 2018. 
-- num of distinct signup events on Feb 1, 2018 AS signups
-- Out of those signups, how many of those users performed some action on Feb 8, 2018?

SELECT
	100.0 * COUNT(DISTINCT(d7.user_id)) / 
	COUNT(DISTINCT(d1.user_id)) AS d7_retention_rate 
FROM
	mobile_analytics.events d1
	LEFT JOIN mobile_analytics.events d7 ON d1.user_id = d7.user_id
	AND TO_CHAR(d7.created_at, 'yyyy-mm-dd') = '2018-02-08'
	AND d7.action IN (
		SELECT
			DISTINCT(action)
		FROM
			mobile_analytics.events
		WHERE
			action != 'signup'
	)
WHERE
	TO_CHAR(d1.created_at, 'yyyy-mm-dd') = '2018-02-01'
	AND d1.action = 'signup'

