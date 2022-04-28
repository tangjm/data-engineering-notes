# 21. The biggest category 

Topics: Joins

Count the number of published items for each root category.

Let c1 denote the root categories
Let c2 denote the subcategories of c1
Let c3 denote the subcategories of c2

    category -> parent_id
    c1 -> NULL
    c2 -> c1.id
    c3 -> c2.id

We join the categories table to itself twice to associate leaf categories with our root categories and then join the items table to the leaf categories to categorise published items.

We then group by root categories and count the number of published items.

LEFT JOIN ensures we include root categories without subcategories or items in our result table.

```sql
SELECT
--   c1.id AS root_category_id,
  c1.name AS root_category_name,
  COUNT(i.id) AS items_count
FROM categories c1
LEFT JOIN categories c2
  ON c2.parent_id = c1.id
LEFT JOIN categories c3
  ON c3.parent_id = c2.id
LEFT JOIN items i
  ON i.category_id = c3.id
    AND published_at IS NOT NULL
WHERE c1.parent_id IS NULL
GROUP BY 1
```