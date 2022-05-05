q. What’s the biggest age group in the UK and Germany combined? 
a. young adult

```sql
SELECT
 (CASE
    WHEN age < 13 THEN 'kid'
    WHEN age < 18 THEN 'teenager'
    WHEN age < 25 THEN 'college'
    WHEN age < 35 THEN 'young adult'
    WHEN age < 56 THEN 'middle age'
    ELSE 'older adult'
  END) AS age_group,
  COUNT(*)
FROM users
WHERE country in ('de', 'en')
GROUP BY 1
```


q. Count signups from all beer domains (users database)
a. 13

```sql
SELECT 
  COUNT(*)
FROM users
WHERE email LIKE '%@beer.%'
```

q. calculate total revenue in June, 2018.
a. 1265.78000000 

```sql
SELECT 
  SUM(amount) AS total_revenue
FROM purchases
WHERE 
  TO_CHAR(created_at, 'yyyy-mm') = '2018-06'
  AND
  refunded = 'f'
```

```json
db.restaurants.find({"borough": "Brooklyn", "cuisine": "Hamburgers"}).count()
```
q. In sample_restaurants.restaurants find how many restaurants in Brooklyn have cuisine of type Hamburgers
a. 102


q. In sample_airbnb.listingAndReviews , find how many listings have their maximum nights between 30 and 365 days.

```json
db.listingAndReviews.find({$and: [{$expr: {"$gt": [{$toInt: "$maximum_nights"}, 30]}},{$expr: {"$lt": [{$toInt: "$maximum_nights"}, 365]}}]}).count()

db.listingsAndReviews.find({$and: [{ $expr: { $gte: [ { $toInt: "$maximum_nights" }, 30 ] } }, { $expr: { $lte: [ { $toInt: "$maximum_nights" }, 365 ] } }]}).count()
```