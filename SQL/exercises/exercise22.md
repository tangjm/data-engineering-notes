# 22. Top grossing month of the year 

Topics: Joins, Problem solving

Calculate revenue for each month of the year 2018.

Relevant tables:
purchases - contains cart_id and discount_code_id
carts
cart_items
items
discount_codes


Calculating the price of a cart involves calculating the price of items in that cart.
```
carts_items LEFT JOIN items
```
For each cart, we will calculate the price of its items. Then we will join this table back to our purchases table.

We also need to apply discounts if applicable, so we also need data from the discount_codes table.

```
purchases INNER JOIN discount_codes
```
Maybe use COALESCE to apply either the amount_off or percent_off discount to the resulting cart?

Turns out we can't use this as amount_off and percent_off discounts are calculated differently.

```sql
-- price of each cart
SELECT 
    cart_id,
    SUM(quantity * price_usd) AS cart_price
  FROM carts_items c
  INNER JOIN items i
    ON c.item_id = i.id
GROUP BY 1
```

```sql
-- apply discounts to cart prices
SELECT 
  *,
  (CASE 
    WHEN amount_off IS NULL AND percent_off IS NULL THEN cart_price
    WHEN amount_off IS NOT NULL THEN cart_price - amount_off
    WHEN percent_off IS NOT NULL THEN cart_price * 0.01 * percent_off 
  END) AS final_price
FROM purchases p
INNER JOIN cart_prices c
  ON p.cart_id = c.cart_id
LEFT JOIN discount_codes d
  ON p.discount_code = d.code
```

Final query

```sql
WITH cart_prices AS (
  SELECT 
    cart_id,
    SUM(quantity * price_usd) AS cart_price
  FROM carts_items c
  INNER JOIN items i
    ON c.item_id = i.id
  GROUP BY 1
),

cart_prices_discounted AS (
  SELECT 
    p.created_at AS p_created_at,
    *,
    (CASE 
      WHEN amount_off IS NULL AND percent_off IS NULL THEN cart_price
      WHEN amount_off IS NOT NULL THEN cart_price - amount_off
      WHEN percent_off IS NOT NULL THEN cart_price * 0.01 * (100 - percent_off)
    END) AS final_price
  FROM purchases p
  INNER JOIN cart_prices c
    ON p.cart_id = c.cart_id
  LEFT JOIN discount_codes d
    ON p.discount_code = d.code
)

SELECT 
  DATE_PART('month', p_created_at) AS month_2018,
  ROUND(SUM(final_price)) AS total_revenue
FROM cart_prices_discounted
WHERE DATE_PART('year', p_created_at) = '2018'
GROUP BY 1
ORDER BY SUM(final_price) DESC
```

Neater CASE expression - n.b. each discount either features an amount_off or a percent_off but not both

```sql
CASE 
  WHEN amount_off IS NOT NULL THEN cart_price - amount_off
  WHEN percent_off IS NOT NULL THEN cart_price * 0.01 * (100 - percent_off)
  ELSE cart_price
END
```

Can we write a single query for this?
