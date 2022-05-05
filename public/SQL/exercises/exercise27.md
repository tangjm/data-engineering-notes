---
export_on_save:
  html: true
---

# 27. First sale date for E-commerce vendor 

### Question

Prepare a report with the date of the very first revenue transaction for the TOP-5 overall gross revenue vendors.

Tables: transactions, vendors

1. Join the two tables. 

2. To calculate the overall gross revenue vendors, we can group by `vendor_id` or `name` and sum the positive transactions.

3. To get the first revenue transaction for each vendor, we can order transactions within each group by ascending `created_at` date and pick out the first one.

```sql
-- This query returns gross revenue vendors in descending order of gross revenue
SELECT 
  name AS vendor_name,
  SUM(amount_usd) 
FROM transactions t
INNER JOIN vendors v  
  ON v.id = t.vendor_id
WHERE amount_usd > 0
GROUP BY 1
ORDER BY SUM(amount_usd) DESC
```


```sql
SELECT 
  name AS vendor_name,
  FIRST_VALUE(created_at) over (PARTITION BY name ORDER BY created_at)  
FROM transactions t
INNER JOIN vendors v  
  ON v.id = t.vendor_id
WHERE amount_usd > 0
GROUP BY 1
ORDER BY SUM(amount_usd) DESC
```

This is the idea, but we can't use window functions if we are also grouping our records in the same query since window functions don't reduce the rows into a single row for each group.

Instead, we can use MIN to get the first revenue transaction since MIN is an aggregate function and can be used in tandem with GROUP BY.

#### Solution

```sql
SELECT 
  name AS vendor_name,
  MIN(created_at)::date AS first_transaction_date
FROM transactions t
INNER JOIN vendors v  
  ON v.id = t.vendor_id
WHERE amount_usd > 0
GROUP BY 1
ORDER BY SUM(amount_usd) DESC
LIMIT 5
```



Using window function to solve the question

```sql
WITH temp AS (
SELECT 
  name AS vendor_name,
  FIRST_VALUE(created_at) over (PARTITION BY name ORDER BY created_at) AS first_transaction_date
FROM transactions t
INNER JOIN vendors v  
  ON v.id = t.vendor_id
WHERE amount_usd > 0
)

SELECT 
 DISTINCT(vendor_name),
 first_transaction_date
From temp
ORDER BY 1
