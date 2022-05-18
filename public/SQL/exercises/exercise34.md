---
export_on_save:
  html: true
---

# 34. Top rated products 

Report the 5 products with the highest average rating.

Consider only products with at least 4 reviews

We can join `reviews` to `items` on `item_id`.
If we then group by `item_id` and count the elements in the group, that would give us the number of ratings for each `item_id`.
If we average the `rating` field of all the elements in each group, that would give us the average rating for each `item_id`.
Finally, we filter our groups for items with at least 4 reviews using the HAVING clause.

### Solution 

```sql
SELECT 
  i.name,
  ROUND(AVG(r.rating), 2) AS avg_rating,
  COUNT(r.id) AS ratings_count
FROM items i
INNER JOIN reviews r
  ON r.item_id = i.id
GROUP BY 1
HAVING COUNT(r.id) >= 4
ORDER BY AVG(r.rating) DESC
LIMIT 5
```

Alternative solution using a CTE. Perhaps this is more readable.

```sql
WITH item_stats AS (
  SELECT 
    item_id,
    AVG(rating) AS avg_rating,
    COUNT(*) AS ratings_count
  FROM reviews
  GROUP BY 1
)

SELECT 
  i.name,
  ROUND(avg_rating, 2) AS avg_rating,
  ratings_count
FROM item_stats s   
INNER JOIN items i 
  ON i.id = s.item_id
WHERE ratings_count >= 4
ORDER BY avg_rating DESC
LIMIT 5
```