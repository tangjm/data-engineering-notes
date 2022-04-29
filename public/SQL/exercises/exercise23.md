---
export_on_save:
  html: true
---
# 23. Vendor with the highest refund rate 

Calculate the return rate (percentage of returned items from all items of all purchased carts) for each vendor in the E-commerce dataset.

Result table formatting: round return rate to 2.d.p, exclude vendors without purchases

We can rephrase the question as "For each vendor, what percentage of their sold items were returned?"
### Plan

We need data from the `vendors`, `returns`, `purchases`, `items` and `carts_items` tables

`vendors` include the names of item vendors
`returns` include data about what quantity of items from each cart was returned
`purchases` contains data about purchased carts
`items` contains data about items such as their price and their vendor
`carts_items` contains data about items in carts

Users do not have to return all items in their cart. 

Because we are calculating return rate, we need information about all purchased items. But the purchases table only contains information about purchased carts. In order to know what items and what quantity were added to each purchased cart we need to join the `carts_items` table to our `purchases` table and then join the `items` table to the resulting table.

Because we need to aggregate items by vendor, we need to join the `vendors` table to the `items` table.

We also need to join the `returns` table to the `purchases` table to calculate the purchased items that were returned.

```sql {.line-numbers highlight=[3, 5, 7, 9]}
SELECT *
FROM purchases p 
INNER JOIN carts_items ci 
  ON p.cart_id = ci.cart_id
INNER JOIN items i
  ON ci.item_id = i.id
INNER JOIN vendors v
  ON i.vendor_id = v.id
LEFT JOIN returns r 
  ON ci.item_id = r.item_id
```

Line 3 ensures we consider only purchased carts
Line 5 associates item data like vendor_id with each cart
Line 7 associates vendor data with each item
Line 9 brings in data about which carts have returned items

Testing the waters

```sql
-- total purchased items sold by each vendor
SELECT 
  vendor_id,
  v.name AS vendor_name,
  SUM(ci.quantity) AS items_sold
FROM purchases p 
INNER JOIN carts_items ci 
  ON p.cart_id = ci.cart_id
INNER JOIN items i
  ON ci.item_id = i.id
INNER JOIN vendors v
  ON i.vendor_id = v.id
LEFT JOIN returns r 
  ON ci.item_id = r.item_id
GROUP BY 1, 2
```

```sql
-- item_id, quantity and vendor_id for each purchased cart
SELECT 
  p.cart_id AS p_cart_id,
  ci.item_id AS item_id,
  quantity,
  vendor_id
FROM purchases p 
INNER JOIN carts_items ci 
  ON p.cart_id = ci.cart_id
INNER JOIN items i
  ON ci.item_id = i.id
```

```sql
-- add returns table
SELECT 
  p.cart_id AS p_cart_id,
  ci.item_id AS item_id,
  ci.quantity AS purchased_quantity,
  r.quantity AS returned_quantity,
  vendor_id
FROM purchases p 
INNER JOIN carts_items ci 
  ON p.cart_id = ci.cart_id
INNER JOIN items i
  ON ci.item_id = i.id
LEFT JOIN returns r
  ON ci.item_id = r.id
```

```sql
-- purchase quantity and returned quantity without items table
SELECT 
  p.cart_id AS p_cart_id,
  ci.item_id AS item_id,
  ci.quantity AS purchased_quantity,
  r.quantity AS returned_quantity,
FROM purchases p 
INNER JOIN carts_items ci 
  ON p.cart_id = ci.cart_id
LEFT JOIN returns r 
  ON ci.item_id = r.item_id
```

The problem I ran into with these queries was that the join condition for joining `returns` to `items` included too many refunded items. In fact, for some items, their refunded quantity exceeded their purchased quantity.

Because different carts can contain the same items and the same items can be returned from different carts, given a particular cart and some returned item of that cart, our current queries join not only the entry for that item and cart combination in the `returns` table but also item and cart combinations where the item is the same but the cart is different.

To avoid overestimating returns, we can make the ON condition more specific by requiring that the cart to which the returned item belongs must also be the same when joining returns from the `returns` table. We implement this by adding the `ci.cart_id = r.cart_id` condition in addition to `ci.item_id = r.item_id`.

```sql
-- we test that total number of refunded items do not exceed the total number of purchased items
WITH temp AS (
  SELECT 
    ci.item_id,
    SUM(ci.quantity) AS sold,
    SUM(r.quantity) AS refunded
  FROM purchases p 
  INNER JOIN carts_items ci 
    ON p.cart_id = ci.cart_id
  LEFT JOIN returns r 
    ON ci.cart_id = r.cart_id
      AND ci.item_id = r.item_id
  GROUP BY 1
)

SELECT *
FROM temp
WHERE sold < refunded
```

Now we join the items and vendors to attribute each sold item to each vendor
### Solution

```sql {.line-numbers highlight=[10-13]}
WITH temp AS (
SELECT 
  v.id AS vendor_id,
  v.name AS vendor_name,
  SUM(ci.quantity) AS sold,
  SUM(r.quantity) AS refunded
FROM purchases p 
INNER JOIN carts_items ci 
  ON p.cart_id = ci.cart_id
INNER JOIN items i
  ON ci.item_id = i.id
INNER JOIN vendors v
  ON i.vendor_id = v.id
LEFT JOIN returns r 
  ON ci.cart_id = r.cart_id
    AND ci.item_id = r.item_id
GROUP BY 1, 2
)

SELECT 
  vendor_id,
  vendor_name,
  COALESCE(ROUND(100.0 * refunded / sold, 2), 0) AS return_rate
FROM temp
ORDER BY (100.0 * refunded / sold) DESC NULLS LAST 
-- Actual solution requires us to ORDER BY rounded and coalesced return rate
```

The grouping would be the same if we only grouped by 1 or 2 because no two ids have the same name and ids are unique (there's a bijection between `v.id` and `v.name`).

The ORDER BY clause requires NULLS LAST because null values appear first by default and we haven't used in our ORDER BY clause.

Here's a query that tests that all our vendors have at least one purchased item

```sql
SELECT 
  v.id
FROM purchases p 
INNER JOIN carts_items ci 
  ON p.cart_id = ci.cart_id
INNER JOIN items i
  ON ci.item_id = i.id
INNER JOIN vendors v
  ON i.vendor_id = v.id
LEFT JOIN returns r 
  ON ci.cart_id = r.cart_id
    AND ci.item_id = r.item_id
GROUP BY 1
HAVING COUNT(ci.quantity) = 0
```
