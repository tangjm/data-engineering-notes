-- Let P be the number of page visits referred from the homepage
-- Let Q be the number of non-book page visits referred from the homepage
-- Q / P * 100.0 is the percentage of visitors referred from the homepage
-- that didn't visit the books page 
-- Calculate percentage of visitors who did not went from the homepage to a book page.
-- NOT LIKE behaves aberrantly
SELECT
	COUNT(DISTINCT(o.visitor_id)),
	COUNT(DISTINCT(h.visitor_id)),
	100 * COUNT(DISTINCT(o.visitor_id)) / COUNT(DISTINCT(h.visitor_id)) :: float AS churn_rate
FROM
	web_analytics.pageviews h
	LEFT JOIN web_analytics.pageviews o ON h.visitor_id = o.visitor_id
	AND o.url NOT LIKE '%/books/%'
	AND (
		o.referer_url LIKE 'https://www.bindle.com/'
		OR o.referer_url LIKE 'https://www.bindle.com/?%'
	)
	AND o.created_at BETWEEN h.created_at
	AND h.created_at + '30 minutes' :: interval
WHERE
	h.url LIKE 'https://www.bindle.com/'
	OR h.url LIKE 'https://www.bindle.com/?%'