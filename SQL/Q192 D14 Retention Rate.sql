-- D14 Retention Rate
-- out of the users who signed up on Feb 1, 2018, how many performed some action on Feb 15, 2018?
WITH user_activity AS (
	SELECT
		s.user_id,
		s.created_at :: date AS signup_date,
		e.created_at :: date AS event_date
	FROM
		mobile_analytics.events s
		LEFT JOIN mobile_analytics.events e ON s.user_id = e.user_id
	WHERE
		s.action = 'signup'
	GROUP BY
		1,
		2,
		3
	ORDER BY
		signup_date,
		user_id
),
retention_curve AS (
	SELECT
		event_date,
		COUNT(DISTINCT(user_id)) AS active_users
	FROM
		user_activity
	WHERE
		signup_date = '2018-02-01'
	GROUP BY
		1
	ORDER BY
		1
)
SELECT
	100.0 * d14.active_users / d1.active_users AS d14_retention_rate
FROM
	retention_curve d1,
	retention_curve d14
WHERE
	d1.event_date = '2018-02-01'
	AND d14.event_date = '2018-02-15'

-- alternative solution

WITH user_activity AS (
	SELECT
		s.user_id,
		s.created_at :: date AS signup_date,
		e.created_at :: date AS event_date
	FROM
		mobile_analytics.events s
		LEFT JOIN mobile_analytics.events e ON s.user_id = e.user_id
	WHERE
		s.action = 'signup'
	GROUP BY
		1,
		2,
		3
	ORDER BY
		signup_date,
		user_id
)
, retention_curve AS (
SELECT
		event_date,
		COUNT(DISTINCT(user_id)) AS active_users,
		ROW_NUMBER() over () - 1 AS day,
		FIRST_VALUE(COUNT(DISTINCT(user_id))) over () AS d1_activity
	FROM
		user_activity
	WHERE
		signup_date = '2018-02-01'
	GROUP BY
		1
	ORDER BY
		1
)

SELECT 
  *,
  100.0 * active_users / d1_activity AS retention_rate
FROM retention_curve
WHERE day = 14