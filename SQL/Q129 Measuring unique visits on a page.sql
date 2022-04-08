-- Q129 Measuring unique visits on a page
-- count how many unique visits Bindle had on all book pages in Feb, 2018?
SELECT
	COUNT(DISTINCT(visitor_id)) AS unique_bookpage_visits,
	TO_CHAR(created_at, 'yyyy-mm') AS year_month
FROM
	web_analytics.pageviews
WHERE
	url LIKE '%/books/%'
GROUP BY
	2