---
export_on_save:
  html: true
---

# 32. Items per cart year-over-year dynamics 

Calculate the dynamic (percentage difference) of average number of items per cart per year. 

For each year, the percentage difference is calculated by the following formula:

$$ D = \frac {a_i - a_j}
{a_j}$$

$D = \text{percentage difference from the previous year}$
$a_i = \text{avg items per cart for the current year}$
$a_j = \text{avg items per cart for the previous year}$

Calculate the average number of items per cart per year requires us to group by year and cart and count the number of items for each group.

We join `items` to `carts` via `carts_items` using inner joins since we're considering only carts with items.

```sql
SELECT *
FROM carts c
INNER JOIN carts_items ci
  ON ci.cart_id = c.id
INNER JOIN items i 
  ON i.id = ci.item_id
```

Then we count the average number of items per cart.



We have to account for users who create their cart in a different year to the year they add items to their cart.

This might be because they created their cart on the very last day of the year and added their first item on the very first day of the next year.

Or we might have users with unusual shopping patterns who create a cart before going away for some time and then come back a year later to add their first item.

```sql
-- users who have not created carts and added items in the same year.
SELECT *
FROM carts c
INNER JOIN carts_items ci
  ON ci.cart_id = c.id
INNER JOIN items i 
  ON i.id = ci.item_id
WHERE DATE_PART('year', c.created_at) != DATE_PART('year', ci.created_at)
```

The important question is whether we take 'year' to denote the year in which the cart was created or the year in which the cart had its first item. 

Seeing how users may add items to their cart in a different year to which they created their cart, we should go with the year in which the cart had its first item, which would be the `created_at` column from the `carts_items` join table. This ensures that we ignore empty carts for each year. 

Items per cart per year - we don't actually need the `items` table to calculate this

```sql
SELECT 
  DATE_PART('year', ci.created_at) AS cart_year,
  c.id AS cart_id,
  SUM(quantity) AS items_per_cart
FROM carts c
INNER JOIN carts_items ci
  ON ci.cart_id = c.id
INNER JOIN items i 
  ON i.id = ci.item_id
GROUP BY 1, 2
```

A first pass

```sql
WITH cart_items_stats AS (
  SELECT 
    DATE_PART('year', c.created_at) AS cart_year,
    c.id AS cart_id,
    SUM(quantity) AS items_per_cart
  FROM carts c
  INNER JOIN carts_items ci
    ON ci.cart_id = c.id
  GROUP BY 1, 2
),

avg_items_per_cart_per_year AS (
  SELECT 
    cart_year,
    AVG(items_per_cart) AS avg_items_per_cart
  FROM cart_items_stats
  GROUP BY 1
),

with_prev_year AS (
  SELECT 
    cart_year,
    avg_items_per_cart, 
    LAG(avg_items_per_cart) OVER (ORDER BY cart_year) AS avg_items_per_cart_prev_year
  FROM avg_items_per_cart_per_year
)

SELECT
  cart_year,
  ROUND(avg_items_per_cart, 2) AS avg_items_per_cart,
  ROUND(100 * (avg_items_per_cart - avg_items_per_cart_prev_year) / avg_items_per_cart_prev_year, 2) AS year_to_year_change
FROM with_prev_year
```


Second pass

We don't join the `items` table as we don't need any information from the `items` table

```sql
SELECT
    c.id,
    c.created_at,
    ci.cart_id,
    ci.created_at,
    ci.item_id,
    quantity
FROM carts c
INNER JOIN carts_items ci
  ON ci.cart_id = c.id
```

```sql
WITH items_per_cart AS (
  SELECT
    c.id,
    c.created_at AS cart_creation_date,
    ci.cart_id,
    ci.created_at,
    ci.item_id,
    quantity
  FROM carts c
  INNER JOIN carts_items ci
    ON ci.cart_id = c.id
),

-- items per cart
SELECT 
  DATE_PART('year', cart_creation_date) AS y,
  SUM(quantity) OVER (PARTITION BY cart_id)
FROM items_per_cart
GROUP BY 1
```



```sql
WITH items_per_cart AS (
  SELECT 
    cart_id,
    SUM(quantity) AS items_count
  FROM carts_items
  GROUP BY 1
), 

items_per_cart_and_year AS (
  SELECT 
    DATE_PART('year', c.created_at) AS cart_year,
    AVG(items_count) AS avg_items_per_cart
  FROM carts c 
  INNER JOIN items_per_cart ipc
    ON ipc.cart_id = c.id
  GROUP BY 1
), 

stats_with_prev_year AS (
  SELECT 
    cart_year,
    avg_items_per_cart,
    LAG(avg_items_per_cart) OVER (ORDER BY cart_year) AS avg_items_per_cart_prev_year
  FROM items_per_cart_and_year
)

SELECT 
  cart_year,
  ROUND(avg_items_per_cart, 2) AS avg_items_per_cart,
  ROUND(100.0 * (avg_items_per_cart - avg_items_per_cart_prev_year) / avg_items_per_cart_prev_year, 2) AS year_on_year_change
FROM stats_with_prev_year

```


```sql
SELECT 
    DATE_PART('year', c.created_at) AS cart_year,
    SUM(quantity) OVER (PARTITION BY c.id)
FROM carts c
INNER JOIN carts_items ci
  ON ci.cart_id = c.id
INNER JOIN items i 
  ON i.id = ci.item_id
```
