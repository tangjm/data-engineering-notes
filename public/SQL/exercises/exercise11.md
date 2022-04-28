---
export_on_save:
  html: true
---

### 11. Average number of items per cart 
Topics: JOIN, GROUP BY, aggregate functions

Calculate the average number of unique items (SKUs) per cart. (Consider only carts with items)

1. For each cart, calculate the number of unique items it contains
2. Filter out carts with zero items
3. Aggregate the results using AVG

##### Tables
carts table - unique carts
items table - unique items
carts_items table - many to many relationships between items and carts

### A first pass

Step 1
Join unique items to carts by making use of the carts and carts_items table

```sql
SELECT *
FROM carts c
LEFT JOIN carts_items ci
  ON c.id = ci.cart_id
```

Count the number of unique items per cart

```sql
SELECT 
  c.id AS cart,
  COUNT(DISTINCT(ci.item_id)) AS unique_items
FROM carts c
LEFT JOIN carts_items ci
  ON c.id = ci.cart_id
GROUP BY 1
```

Step 2

Filter out carts with zero items

```sql
WITH items_per_cart AS (
SELECT 
  c.id AS cart,
  COUNT(DISTINCT(ci.item_id)) AS unique_items
FROM carts c
LEFT JOIN carts_items ci
  ON c.id = ci.cart_id
GROUP BY 1
)

SELECT 
  *
FROM items_per_cart
WHERE unique_items > 0
```

Step 3
Aggregate the results to calculate the average number of items per cart

```sql
WITH items_per_cart AS (
  SELECT 
    c.id AS cart,
    COUNT(DISTINCT(ci.item_id)) AS unique_items
  FROM carts c
  LEFT JOIN carts_items ci
    ON c.id = ci.cart_id
  GROUP BY 1
)

SELECT 
  ROUND(AVG(unique_items), 2) AS avg_items_per_cart
FROM items_per_cart
WHERE unique_items > 0
```

### A second pass

We don't actually need step 2, because we can account for it by using an INNER JOIN instead of a LEFT JOIN.
By using INNER JOIN, we exclude carts that have no items since these are carts that have no relation to any record in the `carts_items` table.

```sql
WITH items_per_cart AS (
  SELECT 
    c.id AS cart,
    COUNT(DISTINCT(ci.item_id)) AS unique_items
  FROM carts c
  INNER JOIN carts_items ci
    ON c.id = ci.cart_id
  GROUP BY 1
)

SELECT 
  ROUND(AVG(unique_items), 2) AS avg_items_per_cart
FROM items_per_cart
```

### A third pass

In fact, we don't actually need to make use of any joins. All the information needed is in the `carts_items` join table.

We can simply group by `cart_id` because a cart with no items would not be in the `carts_items` table.


```sql
WITH items_per_cart AS (
  SELECT 
    cart_id AS cart,
    COUNT(DISTINCT(item_id)) AS unique_items
  FROM carts_items
  GROUP BY 1
)

SELECT 
  ROUND(AVG(unique_items), 2) AS avg_items_per_cart
FROM items_per_cart
```