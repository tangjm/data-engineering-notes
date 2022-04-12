Q130 which percentage of homepage visits is followed up by a visit to a book page? 
1. calculate the number of bookpage visits referred from the homepage 
that occur within 30mins of a homepage visit
add a time t for each homepage visit, 
then count the number of book page visits (referred from the homepage)
that occur at most 30mins after time t.

```sql
WITH homepage_visits AS (
	SELECT
		created_at AS homepage_created_at,
		visitor_id AS homepage_visitor_id
	FROM
		web_analytics.pageviews
	WHERE
		url LIKE 'https://www.bindle.com/'
		OR url LIKE 'https://www.bindle.com/?%'
),
bookpage_visits AS (
	SELECT
		created_at AS bookpage_created_at,
		visitor_id AS bookpage_visitor_id
	FROM
		web_analytics.pageviews
	WHERE
		url LIKE '%/books/%'
		AND (
			referer_url LIKE 'https://www.bindle.com/'
			OR referer_url LIKE 'https://www.bindle.com/?%'
		)
),
bookpage_referrals AS (
	SELECT
		COUNT(*) AS bookpage_referrals_from_homepage
	FROM
		bookpage_visits b
		LEFT JOIN homepage_visits h ON b.bookpage_visitor_id = h.homepage_visitor_id
		AND h.homepage_created_at + '30 minutes' :: interval >= b.bookpage_created_at
		AND h.homepage_created_at < b.bookpage_created_at
),
total_homepage_visits AS (
	SELECT
		COUNT(DISTINCT(visitor_id)) AS homepage_visitors
	FROM
		web_analytics.pageviews
	WHERE
		url LIKE 'https://www.bindle.com/'
		OR url LIKE 'https://www.bindle.com/?%'
)
SELECT
	*,
	100.0 * bookpage_referrals_from_homepage / homepage_visitors AS percent_bookpage_from_homepage
FROM
	bookpage_referrals,
	total_homepage_visits 
```

More concise query

```sql
SELECT
	COUNT(h.visitor_id) AS homepage_pvs,
	COUNT(b.visitor_id) AS book_page_pvs
FROM
	web_analytics.pageviews h
	LEFT JOIN web_analytics.pageviews b ON h.visitor_id = b.visitor_id
	AND b.url LIKE '%/books/%'
	AND (
		b.referer_url = 'https://www.bindle.com/'
		OR b.referer_url LIKE 'https://www.bindle.com/?%'
	)
	AND b.created_at BETWEEN h.created_at
	AND h.created_at + '30 minutes' :: interval
WHERE
	h.url = 'https://www.bindle.com/'
	OR h.url LIKE 'https://www.bindle.com/?%'
```