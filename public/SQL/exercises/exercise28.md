---
export_on_save:
  html: true
---

# 28. Product ratings distribution 

Topics: Window functions

Report the percentages for each rating. For each rating from 1 to 5, report the number of ratings and the percentage out of the total number of ratings.

Using window functions

Use a window function to count the total number of records in the `reviews` table.

Then group by rating and count the number of reviews for each rating.

```sql
WITH reviews_per_rating AS (
  SELECT 
    rating,
    COUNT(*) AS ratings_count
  FROM reviews
  GROUP BY 1
)

SELECT
  rating,
  ratings_count,
  SUM(ratings_count) over () AS total_ratings
FROM reviews_per_rating
```

We use a window function because we want to calculate the sum-total ratings by summing the values in the `ratings_count` column without aggregating the records into a single record.

### Solution


```sql
WITH reviews_per_rating AS (
  SELECT 
    rating,
    COUNT(*) AS ratings_count
  FROM reviews
  GROUP BY 1
)

SELECT
  rating,
  ratings_count,
  ROUND(100.0 * ratings_count / SUM(ratings_count) OVER (), 2) AS rating_portion
FROM reviews_per_rating
ORDER BY 100.0 * ratings_count / SUM(ratings_count) OVER () DESC
```

A longer but arguably more readable query.

```sql
WITH reviews_per_rating AS (
  SELECT 
    rating,
    COUNT(*) AS ratings_count
  FROM reviews
  GROUP BY 1
),

final_stats AS (
  SELECT
    rating,
    ratings_count,
    100 * ratings_count::numeric / SUM(ratings_count) OVER () AS raw_rating_portion
  FROM reviews_per_rating
)

SELECT 
  rating, 
  ratings_count,
  ROUND(raw_rating_portion, 2) AS rating_portion
FROM final_stats
ORDER BY raw_rating_portion DESC
```