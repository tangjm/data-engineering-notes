Which variation of longer_onboarding_201803 AB-test has a higher purchase rate of the yearly subscription?

In other words, calculate the purchase rate for a specific product, namely, the yearly subscription.

```sql
WITH ab_categorisation AS (
SELECT 
	user_id,
	custom_parameters ->> 'ab_test_name' AS ab_test_name,
	custom_parameters ->> 'ab_test_variation' AS variation,
	created_at AS categorisation_date
FROM mobile_analytics.events
WHERE action = 'signup' 
	AND custom_parameters ->> 'ab_test_name' IS NOT NULL
), 
ab_unit_economics AS (
	SELECT 
		variation,
		COUNT(DISTINCT(a.user_id)) AS cohort_size,
		COUNT(DISTINCT(CASE WHEN refunded = 'f' AND pd.name = 'Yearly subscription' THEN p.user_id END)) AS yearly_customers
	FROM ab_categorisation a
	LEFT JOIN purchases p
		ON a.user_id = p.user_id
	LEFT JOIN products pd  
		ON p.product_id = pd.id
	WHERE ab_test_name = 'longer_onboarding_201803'
	GROUP BY 1
)

SELECT 
	*,
	ROUND(100.0 * yearly_customers / cohort_size, 2) AS purchase_rate
FROM ab_unit_economics
ORDER BY 1 DESC

```