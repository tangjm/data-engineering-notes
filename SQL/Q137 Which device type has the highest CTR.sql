-- which device type has the highest CTR of a signup button on book pages?
-- For each device type, calculate 2 things
-- 1. the number of unique visitors to books page (book_page_visitors)
-- 2. the number of unique visitors who clicked the sign up button on the books page (book_page_signups)
-- 3. the CTR which is: book_page_signups / book_page_visitors
SELECT
	device_type,
	COUNT(DISTINCT(p.visitor_id)) AS visitors,
	COUNT(DISTINCT(e.pageview_id)) AS signup_clicks,
	100 * COUNT(DISTINCT(e.pageview_id)) / COUNT(DISTINCT(p.visitor_id)) :: float AS CTR
FROM
	web_analytics.pageviews p
	LEFT JOIN web_analytics.events e ON p.pageview_id = e.pageview_id
	AND e.category = 'Signup Button'
	AND e.action = 'Click'
WHERE
	url LIKE '%/books/%'
GROUP BY
	1
ORDER BY
	CTR DESC
LIMIT
	1