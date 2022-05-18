---
export_on_save:
  html: true
---

# 40. Calculating CPS (Cost per Signup) 

Calculate overall Cost per Signup (CPS)

Group by utm_campaign and count the number of signups. Then divide the spends by the number of signups for each campaign.

We first join `users` to `marketing_spends` and use INNER JOIN to exclude campaigns with no signups.

```sql
SELECT 
  m.utm_source,
  m.utm_campaign,
  u.*
FROM marketing_spends m
INNER JOIN users u
  ON u.utm_campaign = m.utm_campaign
```

Then we group by `utm_source` and `utm_campaign` and count the signups.

```sql
SELECT 
  m.utm_source,
  m.utm_campaign,
  COUNT(DISTINCT(u.id)) AS signup_count
FROM marketing_spends m
INNER JOIN users u
  ON u.utm_campaign = m.utm_campaign 
    AND u.utm_source = m.utm_source
GROUP BY 1, 2
```

We run another query to calculate the total spend per campaign.

```sql
WITH spend_per_campaign AS (
  SELECT 
    m.utm_source,
    m.utm_campaign,
    SUM(amount) AS spends
  FROM marketing_spends m
  GROUP BY 1, 2
)
```

Finally, we join the spends for each campaign back to our primary table and calculate CPS.

### Solution

```sql
WITH signups_per_campaign AS (
  SELECT 
    m.utm_source,
    m.utm_campaign,
    COUNT(DISTINCT(u.id)) AS signup_count
  FROM marketing_spends m
  INNER JOIN users u
    ON u.utm_campaign = m.utm_campaign 
      AND u.utm_source = m.utm_source
  GROUP BY 1, 2
), 

spend_per_campaign AS (
  SELECT 
    m.utm_source,
    m.utm_campaign,
    SUM(amount) AS spends
  FROM marketing_spends m
  GROUP BY 1, 2
)

SELECT 
  sp.utm_source,
  sp.utm_campaign,
  ROUND(sp.spends / signup_count, 2) AS CPS
FROM signups_per_campaign si
INNER JOIN spend_per_campaign sp
  ON sp.utm_campaign = si.utm_campaign
    AND sp.utm_source = si.utm_source
```

We don't need to use any joins for calculating the `signups_per_campaign` as the campaign information is also included in our `users` table. So our first CTE can be made simpler.

```sql
SELECT 
  utm_source,
  utm_campaign,
  COUNT(id) AS signups
FROM users
WHERE utm_campaign IS NOT NULL
GROUP BY 1, 2
```

Can we rewrite this using a single query?

Calculating spends per campaign and signups per campaign in a single query requires having spends data and signup data in one place, which will require joining the `users` and `marketing_spends` tables. If we grouped by `utm_source` and `utm_campaign` we could count the signups per campaign by composing the COUNT and DISTINCT aggregate functions. But I don't think we're able to sum the spends per campaign accurately as the many-to-one relationship between campaigns and users together with the join will mean that records in our `marketing_spends` table will duplicated many times in the join result. So if we tried to aggregate the amount spent on each campaign using the SUM function, we will end up overcounting the total amount spent on each campaign.

We would need a way to SUM(m.amount) for DISTINCT(m.id). More generally, that would involve aggregating one column based on the results of aggregating another column. And unlike COUNT and DISINCT which both apply to a single column in present case, we're unable to compose SUM and DISTINCT in the same way. This would also prevent us from making use of any window functions as we can only apply window functions to what is returned by an aggregate function. 


Test query
```sql
SELECT 
  -- m.id,
  m.utm_source,
  m.utm_campaign,
  -- SUM(m.amount) OVER (PARTITION BY m.utm_source, m.utm_campaign),
  SUM(m.amount),
  COUNT(DISTINCT(u.id))
FROM users u 
INNER JOIN marketing_spends m
  ON m.utm_source = u.utm_source
     AND m.utm_campaign = u.utm_campaign
GROUP BY 1, 2
```