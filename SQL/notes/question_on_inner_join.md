Question on INNER JOIN 

```
SELECT
  name AS book_title,
  COUNT(DISTINCT(bu.user_id)) AS reader_count
FROM books_users bu
INNER JOIN books b
  ON bu.book_id = b.id
GROUP BY 1
ORDER BY 2 DESC, name ASC

SELECT 
  name AS book_title,
  COUNT(user_id) AS reader_count
FROM books_users bu
INNER JOIN books b
  ON bu.book_id = b.id
GROUP BY 1
ORDER BY 2 DESC, 1
```

Order of query
1. FROM
2. INNER JOIN
3. GROUP BY
4. SELECT
5. COUNT
6. ORDER BY

Is it necessary to apply DISTINCT to the user_id's of the books_users table? If so, why might it be a good idea? If not, explain why not.
