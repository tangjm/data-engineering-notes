---
export_on_save:
  html: true
---

# 36. Vendor with the highest revenue 

Which vendor has the highest revenue and calculate the percentage of this revenue from the total.

We can calculate revenue per vendor by grouping and summing.
Then to calculate the percentage from the total, we can sum the total revenues per vendor and divide each vendor's total revenue by this total sum.

Total revenue per vendor

```sql
SELECT 
  name,
  SUM(amount_usd) AS total_revenue
FROM vendors v 
LEFT JOIN transactions t
  ON t.vendor_id = v.id
WHERE amount_usd > 0
GROUP BY 1
```

### Solution

```sql
SELECT
  name AS vendor,
  ROUND(SUM(amount_usd), 2) AS total_revenue,
  ROUND(100 * SUM(amount_usd) / SUM(SUM(amount_usd)) OVER (), 2) AS percentage
FROM vendors v
LEFT JOIN transactions t
  ON t.vendor_id = v.id
WHERE amount_usd > 0
GROUP BY 1
ORDER BY 2 DESC
LIMIT 1
```

Alternatively,

```sql
WITH revenue_per_vendor AS (
  SELECT 
    vendor_id,
    SUM(amount_usd) AS total_revenue
  FROM transactions
  WHERE amount_usd > 0
  GROUP BY 1
),

with_percentage AS (
  SELECT 
    v.name,
    r.*,
    SUM(total_revenue) OVER () AS sum_total_revenue,
    100 * total_revenue / SUM(total_revenue) OVER () AS percentage
  FROM revenue_per_vendor r
  INNER JOIN vendors v
    ON v.id = r.vendor_id
)

SELECT 
  name AS vendor,
  ROUND(total_revenue, 2) AS total_revenue,
  ROUND(percentage, 2) AS percentage
FROM with_percentage
ORDER BY 2 DESC
LIMIT 1
```