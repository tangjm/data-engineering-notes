---
export_on_save:
  html: true
---
# 14. Biggest B2B customer

Topics: Joins, Aggregate functions, Grouping, Sorting

Find out which customer (vendor) had brought us the most gross revenue in 2019.

Round gross revenue to the nearest integer.


```sql {.line-numbers highlight=20}
WITH vendor_gross_revenue AS (
  SELECT 
    DATE_PART('year', created_at) AS yr,
    vendor_id,
    SUM(amount_usd) AS total_revenue
  FROM transactions
  WHERE amount_usd > 0
  GROUP BY 1, 2
  ORDER BY 1
)

SELECT
  name AS vendor_name,
  ROUND(SUM(total_revenue)) AS gross_revenue
FROM vendors v 
LEFT JOIN vendor_gross_revenue vgr
  ON v.id = vgr.vendor_id
    AND yr = '2019'
GROUP BY 1
ORDER BY SUM(total_revenue) DESC NULLS LAST
LIMIT 1
```

It doesn't matter which way round we perform the JOIN. Although if we joined the vendors to the CTE, we could do without the NULLS LAST expression, since all transactions are made by some customer in the vendors table.

Alternatively, if we didn't need to reuse our subquery, we could go with a single query:

```sql
SELECT
  name AS vendor_name,
  ROUND(SUM(amount_usd)) AS gross_revenue
FROM vendors v 
LEFT JOIN transactions t
  ON v.id = t.vendor_id
    AND amount_usd > 0 
    AND DATE_PART('year', created_at) = '2019'
GROUP BY 1
ORDER BY SUM(amount_usd) DESC NULLS LAST
LIMIT 1
```

We order by the unrounded gross_revenue.