### 12. Categories' items distribution 

Count the number of available items per category.

Put differently, for each category, count the number of items that have a non-null published_at field.

Order the result set by the number of items from highest to lowest.

Because the metric that we want to calculate involves data that belongs to multiple tables, we need to use a join.

### Solution 1

We assume that only bottom level categories have items and that every bottom level category has at least one item. With this assumption we can then perform an INNER JOIN.

```sql
SELECT *
FROM categories c
INNER JOIN items i
  ON c.id = i.category_id
```

Then we group by category_id and count the published items for each group

```sql {.line-numbers highlight=[4]}

SELECT 
  c.id AS category_id,
  c.name AS category_name,
  COUNT(DISTINCT(CASE WHEN i.published_at IS NOT NULL THEN i.id END)) AS items_count
FROM categories c
INNER JOIN items i
  ON c.id = i.category_id
GROUP BY 1
```

There are alternative ways to apply the filter for published items on line 4. 

```sql {.line-numbers highlight=[8]}
SELECT 
  c.id AS category_id,
  c.name AS category_name,
  COUNT(DISTINCT(i.id)) AS items_count
FROM categories c
INNER JOIN items i
  ON c.id = i.category_id
    AND i.published_at IS NOT NULL
GROUP BY 1
```

We can apply the filter when we apply the INNER JOIN on line 8.

```sql {.line-numbers highlight=[8]}
SELECT 
  c.id AS category_id,
  c.name AS category_name,
  COUNT(DISTINCT(i.id)) AS items_count
FROM categories c
INNER JOIN items i
  ON c.id = i.category_id
WHERE i.published_at IS NOT NULL
GROUP BY 1
```

We can also apply the filter after the INNER JOIN as shown on line 8.

Finally, we sort the results by number of published items from highest to lowest

```sql {.line-numbers highlight=[9]}
SELECT 
  c.id AS category_id,
  c.name AS category_name,
  COUNT(DISTINCT(CASE WHEN i.published_at IS NOT NULL THEN i.id END)) AS items_count
FROM categories c
INNER JOIN items i
  ON c.id = i.category_id
GROUP BY 1
ORDER BY items_count DESC, 2
```

Line 9 sorts categories with the same number of published items by category name alphabetically.

### Solution 2

Another approach is to not make the assumption that solution 1 makes about categories in the our categories table. While less optimal than the first method, this can be an instructive exercise.

We join subcategories and leaf categories to the root categories by joining the categories table to itself. And only then join the items table to the leaf categories to ensure that we're ignoring the root and subcategories, which by definition do not contain items, for they contain categories.

We first join subcategories to root categories.

```sql
SELECT *
FROM categories r
LEFT JOIN categories s  
  ON r.id = s.parent_id
```

Then we join leaf categories to subcategories

```sql {.line-numbers highlight=[5-6]}
SELECT *
FROM categories r
LEFT JOIN categories s  
  ON r.id = s.parent_id
LEFT JOIN categories l
  ON s.id = l.parent_id
```

Finally, we join the items table to each leaf category

```sql {.line-numbers highlight=[7-8]}
SELECT *
FROM categories r
LEFT JOIN categories s  
  ON r.id = s.parent_id
LEFT JOIN categories l
  ON s.id = l.parent_id
LEFT JOIN items i
  ON l.id = i.category_id
```

We group by `category_id` just like before and count the published items per category. Note that we make use of the bottom-level leaf categories on lines 2-3 when grouping .

```sql {.line-numbers highlight=[2-3, 12]}
SELECT 
  l.id AS category_id,
  l.name AS category_name,
  COUNT(DISTINCT(CASE WHEN i.published_at IS NOT NULL THEN i.id END)) AS items_count
FROM categories r
LEFT JOIN categories s  
  ON r.id = s.parent_id
LEFT JOIN categories l
  ON s.id = l.parent_id
LEFT JOIN items i
  ON l.id = i.category_id
GROUP BY 1
ORDER BY items_count DESC, 2
```

There is one remaining problem with this query.

We also get a row that has a NULL `category_id` and `category_name` and 0 `items_count`.

Why does our query return such a row?

```sql {.line-numbers highlight=[3, 5, 7]}
SELECT *
FROM categories c
LEFT JOIN categories s  
  ON c.id = s.parent_id
LEFT JOIN categories l
  ON s.id = l.parent_id
LEFT JOIN items i
  ON l.id = i.category_id
```

Try changing any of the LEFT JOINs on lines 3, 5, and 7 to an INNER JOIN.

To help make this clear, we can consider three types of category hierarchies in our categories table:
1. Categories with no subcategories
2. Categories with subcategories but not all subcategories have subcategories
3. Categories with subcategories that have subcategories

Case 1

For instance, a root category with no subcategories will have a row of nulls joined to it after the LEFT JOIN on line 3. It will then have another row of nulls joined to it after line 5 because the condition on line 6 would be false. This is because a root category with no subcategory will have a NULL value for its newly joined `s.id` field (its subcategory id field), and no leaf category has a matching `parent_id` field that is also NULL. 

Then after the LEFT JOIN on line 7, another row of NULLS will be joined, due to the same reasoning. 

Case 2

We can reason in the same way about root categories that do have subcategories but not all or none of their subcategories have leaf categories. The only difference is that we won't get any NULL values joined to the initial categories table after the first LEFT JOIN on line 3, since all root categories have subcategories. We will, however, see NULL values after the LEFT JOIN on line 5 because not all subcategories have subcategories (leaf categories). And it will be these NULL values that will result in the unwanted row when we perform the final LEFT JOIN on line 7.

Case 3

These will be included in our final result table which is what we want.

Now consider the case of using an INNER JOIN on line 7.

```sql {.line-numbers highlight=[7]}
SELECT *
FROM categories c
LEFT JOIN categories s  
  ON c.id = s.parent_id
LEFT JOIN categories l
  ON s.id = l.parent_id
INNER JOIN items i
  ON l.id = i.category_id
```

This takes care of cases 1 and 2 because the INNER JOIN ensures that any row that has an `l.id` field that is NULL will be excluded from the result table because each item will belong to some category. So the condition on line 8 will never be true if the left hand side is NULL and the right hand side is never NULL. Recall that both cases 1 and 2 will have an `l.id` field that is NULL. 

Using an INNER JOIN on line 5 would also work. It would just remove cases 1 and 2 a step earlier rather than deferring until line 7.

```sql {.line-numbers highlight=[3]}
SELECT *
FROM categories c
INNER JOIN categories s  
  ON c.id = s.parent_id
LEFT JOIN categories l
  ON s.id = l.parent_id
LEFT JOIN items i
  ON l.id = i.category_id
```

But, perhaps interestingly, using only an INNER JOIN on line 3 would not work. This is because that would only rule out records that fall under case 1 but not those that fall under case 2. You would also need to have an INNER JOIN on line 5 or line 7.
