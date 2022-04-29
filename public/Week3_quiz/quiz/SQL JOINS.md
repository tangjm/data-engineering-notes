### JOINS 

1. Using the Bindle dataset, what is the utm_content with the highest revenue?

**Answer**
- bindle_was_launched

**Query**
```sql
SELECT 
  utm_content,
  SUM(amount) AS total_revenue
FROM purchases p
INNER JOIN users u
  ON p.user_id = u.id
WHERE refunded = 'f'
GROUP BY 1
ORDER BY 2 DESC
```

1. Using the Bindle dataset, which utm_content did Bindle spend the least amount of money on?

**Answer**
- explore_worlds_literature

**Query**
```sql
SELECT 
  utm_content,
  SUM(amount) AS spends
FROM marketing_spends
GROUP BY 1
ORDER BY 2
```

3. Using the Bindle dataset, which utm_content has the highest ROI?

**Answer**
- discover_best_books

**Query**
```sql
WITH content_revenue AS (
  SELECT 
    utm_content,
    SUM(amount) AS total_revenue
  FROM purchases p
  INNER JOIN users u
    ON p.user_id = u.id
  WHERE refunded = 'f'
  GROUP BY 1
), content_spends AS (
  SELECT 
    utm_content,
    SUM(amount) AS spends
  FROM marketing_spends
  GROUP BY 1
)

SELECT 
  s.utm_content,
  total_revenue,
  spends,
  (total_revenue - spends) / spends AS ROI  
FROM content_spends s
LEFT JOIN content_revenue r  
  ON s.utm_content = r.utm_content
ORDER BY 4 DESC
```

4. The following query returns revenue, expenditure and roi for each Bindle campaign.

```sql
WITH campaign_revenues AS (
  SELECT
    utm_campaign,
    SUM(amount) AS total_revenue
  FROM purchases p
  INNER JOIN users u
    ON p.user_id = u.id
  WHERE
    refunded = FALSE
    AND utm_campaign IS NOT NULL	  
  GROUP BY 1
), campaign_spends AS (
  SELECT
    utm_campaign,
    SUM(amount) AS total_spend
  FROM marketing_spends
  GROUP BY 1
)

SELECT 
  s.utm_campaign,
  total_spend,
  total_revenue,
  (total_revenue - total_spend) / total_spend AS ROI
FROM campaign_spends s
LEFT JOIN campaign_revenues r
  ON s.utm_campaign = r.utm_campaign
```

Why do we need a LEFT JOIN here?

**Answer**
- Because we also want to calculate the ROI of campaigns that bring in no revenue.


5. How would you add a country column to the table returned by this query?

```sql
WITH customers AS (
  SELECT
    user_id,
    MIN(created_at) AS first_purchased_at
  FROM purchases
  WHERE
    refunded = FALSE
  GROUP BY 1
  ORDER BY 2 DESC
)		

SELECT *
FROM customers
```

1. Using the Live dataset, calculate the Average Revenue Per User (ARPU) per city. Which US city has the 3rd highest ARPU?

**Answer**
- Chicago (NB. Answer will vary as this is a live dataset.)
  
**Query**
```sql
-- revenue per city
-- divide by total number of distinct users

SELECT 
  city,
  SUM(amount) AS revenue,
  COUNT(DISTINCT(user_id)) AS registered_users,
  SUM(amount) / COUNT(DISTINCT(user_id)) AS ARPU
FROM users u
LEFT JOIN purchases p
  ON u.id = p.user_id
    AND p.refunded_at IS NULL
GROUP BY 1
ORDER BY 4 DESC
```

1. (Fun question) Write an SQL query to report the second highest credit transaction from the Finance dataset's transactions table. Format your result table exactly as follows:

![image](../images/sample_result_table.png)

**Query 1**
```sql
WITH max_transaction AS (
    SELECT 
        MAX(amount_usd) as max_transaction
    FROM transactions
)

SELECT 
    (CASE WHEN COUNT(*) > 0 THEN MAX(amount_usd) END) AS second_highest_transaction
FROM transactions
CROSS JOIN max_transaction
WHERE amount_usd != max_transaction
```

**Query 2**
```sql
SELECT 
  amount_usd AS second_highest_transaction
FROM transactions
ORDER BY amount_usd DESC 
LIMIT 1
OFFSET 1
```