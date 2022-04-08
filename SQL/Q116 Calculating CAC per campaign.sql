-- Q116 Calculating CAC per campaign
-- 1. calculate how much was spent on each campaign
-- 2. calculate the total number of customers attributable to each campaign
-- 3. divide 1 by 2
WITH marketing_spends AS (
	SELECT
		utm_campaign,
		SUM(amount) AS total_spent
	FROM
		marketing_spends
	GROUP BY
		1
),
customer_count AS (
	SELECT
		utm_campaign,
		COUNT(id) AS total_customers
	FROM
		users
	WHERE
		status = 'customer'
	GROUP BY
		1
)
SELECT
	ms.utm_campaign,
	total_spent,
	COALESCE(total_customers, 0) AS num_of_customers,
	total_spent / total_customers AS CAC
FROM
	marketing_spends ms
	LEFT JOIN customer_count cc ON ms.utm_campaign = cc.utm_campaign
ORDER BY
	CAC