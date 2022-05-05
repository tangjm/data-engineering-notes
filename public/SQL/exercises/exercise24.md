---
export_on_save:
  html: true
---

# 24. Average price per cart 

Topics: Joins, Aggregate functions, Problem solving

Calculate average revenue per cart (for purchased carts only).
Round the answer to 2.d.p.

Tables:
- purchases
- carts
- items
- carts_items
- discount_codes

This is basically ARPU for carts instead of users.

We can sum the revenue for all purchased carts, apply any discounts and then divide by the number of purchased carts.

Since we need information about the price of items in each cart, we need to join the items table to our purchases via the carts_items join table.

We can then join the discount_codes table to our purchases to get information about discounts.

Finally, we group and aggregate.

```sql
-- High-level overview of how we will join the tables
SELECT *
FROM purchases p
INNER JOIN carts_items ci
  ON ci.cart_id = p.cart_id
INNER JOIN items i
  ON i.id = ci.item_id
LEFT JOIN discount_codes d 
  ON d.code = p.discount_code
```

We have to aggregate the price of items per cart, then we need to aggregate the price per cart.

### Solution

See SQLHabit solution for exercise 24 for a different solution.

```sql
WITH revenue_per_cart AS (
  SELECT
    p.cart_id,
    p.discount_code,
    SUM(quantity * price_usd) AS total_revenue
  FROM purchases p
  INNER JOIN carts_items ci
    ON ci.cart_id = p.cart_id
  INNER JOIN items i
    ON i.id = ci.item_id
  GROUP BY 1, 2
),

final_stats AS (
  SELECT 
    SUM(CASE 
          WHEN amount_off IS NOT NULL THEN total_revenue - amount_off
          WHEN percent_off IS NOT NULL THEN total_revenue - (total_revenue * percent_off / 100)
          ELSE total_revenue
        END) AS total_revenue_discounted,
    COUNT(r.cart_id) AS purchased_carts
  FROM revenue_per_cart r
  LEFT JOIN discount_codes d 
    ON d.code = r.discount_code
)

SELECT 
  ROUND(total_revenue_discounted / purchased_carts, 2) AS avg_cart_price
FROM final_stats
```

The first assumption I make is that each purchase either has a discount code or doesn't. This let's us group by both `p.cart_id` and `p.discount_code` which will serve as our primary/foreign key relationship with the `discount_codes` table for joining discount codes later on.

I also made the assumption that purchased carts must have items, and so they must have a corresponding row in the carts_items table. But it turns out that this is not true as LEFT JOIN and INNER JOIN produce different results.

```sql
SELECT *
FROM purchases p
LEFT JOIN carts_items ci
  ON p.cart_id = ci.cart_id
```

```sql
SELECT *
FROM purchases p
INNER JOIN carts_items ci
  ON p.cart_id = ci.cart_id
```

This means that strictly speaking, what I calculated was average revenue per purchased non-empty cart rather than average revenue per cart. Although, the two amount to the same as purchasing a cart with no items doesn't count as a purchase on any reasonable interpretation. This possibility of a purchased empty cart is likely because of a source application design that let's users purchase empty carts or maybe that the data is yet to be loaded into the data warehouse.


More concise solution using AVG function 

### Concise version

```sql
WITH revenue_per_cart AS (
  SELECT
    p.cart_id,
    p.discount_code,
    SUM(quantity * price_usd) AS total_revenue
  FROM purchases p
  INNER JOIN carts_items ci
    ON ci.cart_id = p.cart_id
  INNER JOIN items i
    ON i.id = ci.item_id
  GROUP BY 1, 2
),

SELECT 
  ROUND(
    AVG(CASE 
          WHEN amount_off IS NOT NULL THEN total_revenue - amount_off
          WHEN percent_off IS NOT NULL THEN total_revenue - (total_revenue * percent_off / 100)
          ELSE total_revenue
        END), 2) AS avg_cart_price
FROM revenue_per_cart r
LEFT JOIN discount_codes d 
  ON d.code = r.discount_code
```

### SQLHabit solution

Note the use of the purchase_id, `p.id`, to join the discount codes in the `purchase_amounts_net` CTE.

```sql {.line-numbers }
WITH purchase_amounts_gross AS (
  SELECT 
    p.id AS purchase_id,
    SUM(i.price_usd * ci.quantity) AS gross_revenue
  FROM purchases p
  INNER JOIN carts c
    ON p.cart_id = c.id
  INNER JOIN carts_items ci
    ON ci.cart_id = c.id
  INNER JOIN items i
    ON ci.item_id = i.id
  GROUP BY 1
), purchase_amounts_net AS (
  SELECT
    purchase_id, 
    gross_revenue,
    (CASE 
      WHEN d.amount_off IS NOT NULL THEN gross_revenue - d.amount_off
      WHEN d.percent_off IS NOT NULL THEN gross_revenue * (100.0 - d.percent_off) / 100
      ELSE gross_revenue
    END) AS net_revenue
  FROM purchase_amounts_gross g
  INNER JOIN purchases p
    ON g.purchase_id = p.id
  LEFT JOIN discount_codes d
    ON d.code = p.discount_code
)

SELECT
  ROUND(AVG(net_revenue), 2) AS avg_cart_price
FROM purchase_amounts_net
```

### Performance test

Average query latencies (10 queries)

First pass - 1342ms
Concise version - 1447ms
SQLHabit solution - 1597ms

```sql
WITH sqlhabit_solution AS (
  SELECT 1454 AS latency
  UNION
  SELECT 1303
  UNION 
  SELECT 1635
  UNION
  SELECT 1781
  UNION
  SELECT 1514
  UNION
  SELECT 1390
  UNION
  SELECT 1457
  UNION
  SELECT 1542
  UNION
  SELECT 2299
)

SELECT 
  ROUND(AVG(latency))
FROM sqlhabit_solution
```

```sql
WITH concise_query AS (
  SELECT 1187 AS latency
  UNION
  SELECT 1127
  UNION
  SELECT 1370
  UNION
  SELECT 1391
  UNION
  SELECT 1553
  UNION
  SELECT 1079
  UNION
  SELECT 1013
  UNION
  SELECT 1120
  UNION
  SELECT 3327
  UNION
  SELECT 1307
)
SELECT ROUND(AVG(latency))
FROM concise_query
```

```sql
WITH first_pass AS (
  SELECT 1407 AS latency    
  UNION
  SELECT 1151        
  UNION
  SELECT 1151        
  UNION
  SELECT 1164        
  UNION
  SELECT 962         
  UNION
  SELECT 2499        
  UNION
  SELECT 1270        
  UNION
  SELECT 1250        
  UNION
  SELECT 1066        
  UNION
  SELECT 1309        
)

SELECT ROUND(AVG(latency))
FROM first_pass
```