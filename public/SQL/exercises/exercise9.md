---
export_on_save:
  html: true
---
### 9. Counting subcategories in an online store
Topics: JOINS

Group by root categories and count the number of entries that reference the root category as its parent_id

```mermaid
graph RL
  sub_categories -- LEFT JOIN --> root_categories
  leaf_categories -- LEFT JOIN --> sub_categories

```

```sql {.line-numbers highlight=[7, 9]}
-- a first pass using two left joins to join subcategories to root categories and then leaf categories to subcategories
-- let r, s, l denote root, subcategory and left respectively
SELECT 
    r.name AS root_category_name,
    COUNT(l.id) AS leaf_categories_count
FROM categories r
LEFT JOIN categories s
    ON r.id = s.parent_id
LEFT JOIN categories l
    ON s.id = l.parent_id
WHERE r.parent_id IS NULL
GROUP BY 1
ORDER BY 2 DESC

```

Line 7 first left joins the subcategories
Line 8 joins the leaf categories