  ---
  export_on_save:
    html: true
  ---

# 33. Most popular items in E-commerce store 

Topics: Window functions, Grouping

Calculate the TOP-3 purchased items per country.

We need to associate purchased items with countries. Data about countries is found in the `purchases` table and items are found in the `cart_items` table.

We will eventually need to join the `items` table to the `purchases` table via the `carts_items` table to obtain item names.

We first join `cart_items` to `purchases` using an inner join to ensure that we only consider purchased carts and items. Then we group by country and item_id and sum the quantity of each purchased item. 

```sql
SELECT
  country,
  item_id,
  SUM(quantity)
FROM purchases p 
INNER JOIN carts_items ci
  ON ci.cart_id = p.cart_id
GROUP BY 1, 2
```

We can use ROW_NUMBER to take a look at what our current table looks like after ranking each record in each partition.

```sql
WITH purchases_by_country AS (
  SELECT
    country,
    item_id,
    SUM(quantity)
  FROM purchases p 
  INNER JOIN carts_items ci
    ON ci.cart_id = p.cart_id
  GROUP BY 1, 2
)

SELECT 
  b.country,
  i.name,
  b.sum AS purchased_quantity,
  ROW_NUMBER() OVER (PARTITION BY b.country ORDER BY b.country ASC, b.sum DESC) AS rank
FROM purchases_by_country
INNER JOIN items i
  ON i.id = b.item_id
```

Next, we need to ensure that within each partition by country, items with the same purchased quantity have the same rank. We can use [DENSE_RANK](https://www.postgresql.org/docs/14/functions-window.html#FUNCTIONS-WINDOW-TABLE) window function for this purpose. 

The RANK window function doesn't rank the entries consecutively if there are entries within the partition with matching values for the the columns by which the table was partitioned.

The DENSE RANK window function differs by ranking records within each partition consecutively.

```sql
WITH purchases_by_country AS (
  SELECT
    country,
    item_id,
    SUM(quantity)
  FROM purchases p 
  INNER JOIN carts_items ci
    ON ci.cart_id = p.cart_id
  GROUP BY 1, 2
)

SELECT 
  b.country,
  i.name,
  b.sum AS purchased_quantity,
  DENSE_RANK() OVER (PARTITION BY b.country ORDER BY b.country ASC, b.sum DESC) AS rank
FROM purchases_by_country b
INNER JOIN items i
  ON i.id = b.item_id
```

Finally, we only want to see the top 3 items per country.

We can't add the following query because window functions aren't permitted in the WHERE clause. Instead, we will turn our final query into another CTE and query that CTE with a filter applied.

```sql 
WHERE DENSE_RANK() OVER (PARTITION BY b.country ORDER BY b.country ASC, b.sum DESC) <= 3
```

### Solution

```sql
WITH item_purchases_by_country AS (
  SELECT
    p.country,
    ci.item_id,
    SUM(ci.quantity)
  FROM purchases p 
  INNER JOIN carts_items ci
    ON ci.cart_id = p.cart_id
  GROUP BY 1, 2
),
ranked_items AS (
  SELECT 
    b.country,
    i.name AS item_name,
    b.sum AS purchased_quantity,
    DENSE_RANK() OVER (PARTITION BY b.country ORDER BY b.country, b.sum DESC) AS rank
  FROM item_purchases_by_country b
  INNER JOIN items i
    ON i.id = b.item_id
)

SELECT * 
FROM ranked_items
WHERE rank <= 3
```

Alternatively, we can group by country and item name and keep all joins in one CTE.

```sql
WITH item_purchases_by_country AS (
  SELECT
    p.country,
    i.name,
    SUM(ci.quantity)
  FROM purchases p 
  INNER JOIN carts_items ci
    ON ci.cart_id = p.cart_id
  INNER JOIN items i 
    ON i.id = ci.item_id
  GROUP BY 1, 2
),
ranked_items AS (
  SELECT 
    b.country,
    b.name AS item_name,
    b.sum AS purchased_quantity,
    DENSE_RANK() OVER (PARTITION BY b.country ORDER BY b.country, b.sum DESC) AS rank
  FROM item_purchases_by_country b
)

SELECT * 
FROM ranked_items
WHERE rank <= 3
```