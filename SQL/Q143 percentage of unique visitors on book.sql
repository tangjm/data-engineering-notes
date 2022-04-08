-- percentage of unique visitors on book pages from mobile devices
SELECT
	COUNT(DISTINCT(p.visitor_id)) AS unique_visitors,
	COUNT(DISTINCT(m.visitor_id)) AS unique_mobile_visitors,
	100 * COUNT(DISTINCT(m.visitor_id)) / COUNT(DISTINCT(p.visitor_id)) :: float AS visitor_percent_mobile
FROM
	web_analytics.pageviews p
	LEFT JOIN web_analytics.pageviews m ON p.visitor_id = m.visitor_id
	AND m.device_type = 'mobile'
WHERE
	p.url LIKE '%/books/%' -- Better solution
SELECT
	100 * COUNT(
		DISTINCT(
			CASE
				WHEN device_type = 'mobile' THEN visitor_id
			END
		)
	) / COUNT(DISTINCT(visitor_id)) :: float AS mobile_visitor_percentage
FROM
	web_analytics.pageviews
WHERE
	url LIKE '%/books/%'