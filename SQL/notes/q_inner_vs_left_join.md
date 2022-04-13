INNER JOIN vs LEFT JOIN

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
Because we also want to calculate the ROI of campaigns that bring in no revenue.

In the case when no user attributable to campaign X has made a purchase, campaign X will be excluded from our campaign_revenues table because we used INNER JOIN to join purchases and users. This excludes users that have not made a purchase and excludes campaigns where none of its attributable users have made a purchase. Note that the utm_campaign column belongs to the users table.

(More formally, no id of any user attributable to campaign X in the users table will be the foreign key of any purchase in the purchases table.)
 

So if we had used INNER JOIN to join campaign_spends and campaign_revenues, campaign X would not have been included.


