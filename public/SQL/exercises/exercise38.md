---
export_on_save:
  html: true
---

# 38. Extracting dates out of text

Topics: String functions

DISTINCT ensures each campaign is listed once. Since launch date is the first 7 characters before the first _ of a campaign name, we can make use of split_part.

Solution

```sql
SELECT 
  DISTINCT(utm_campaign),
  SPLIT_PART(utm_campaign, '_', 1)::date AS launch_date
FROM marketing_spends
```

Testing that launch_date column has type date.

```sql
WITH temp AS (
  SELECT 
    DISTINCT(utm_campaign),
    SPLIT_PART(utm_campaign, '_', 1)::date AS launch_date
  FROM marketing_spends
)

SELECT 
  launch_date,
  launch_date::timestamp + '2 days'
FROM temp
```

Alternative solution

Note that the second argument to TO_DATE specifies the format of the first argument and not the date returned. 

```sql
WITH campaigns AS (
  SELECT DISTINCT(utm_campaign)
  FROM marketing_spends
)
SELECT 
  utm_campaign,
  TO_DATE(SPLIT_PART(utm_campaign, '_', 1), 'YYYYMMDD') AS launch_date
FROM campaigns
```