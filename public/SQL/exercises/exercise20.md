---
export_on_save:
  html: true
---
# 20. Naive sentiment analysis 

Sentiment Analysis (SA) is a technique for measuring mood of a comment, review or customer support issue.

Match feedback against our positive and negative word lists.

Positive word list:

    amazing, great, awesome, good, perfect, impressed, super

Negative word list:

    bad, terrible, horrible, disappointed, broken

- If feedback matches no words from either list, label the review 'neutral'
- If feedback matches some word from both lists, label the review 'mixed'
- If feedback matches some word from the positive list, but no word from the negative list, label the review 'positive'
- If the feedback matches some word from the negative list but no word from the positive list, label the review 'negative'

Result table schema has three columns: review_type, percentage and reviews_count

Result table should be sorted by percentage with highest at the top.
percentages should be rounded to the closest integer.

Regex for positive word list:
```regex
(amazing)|(great)|(awesome)|(good)|(perfect)|(impressed)|(super)
(amazing|great|awesome|good|perfect|impressed|super)
```

Regex for negative word list:
```regex
(bad|terrible|horrible|disappointed|broken)
```

```sql
REGEXP_MATCHES(feedback, '(amazing)|(great)|(awesome)|(good)|(perfect)|(impressed)|(super)')
REGEXP_MATCHES(feedback, '(bad)|(terrible)|(horrible)|(disappointed)|(broken)')

REGEXP_MATCHES(feedback, '(amazing|great|awesome|good|perfect|impressed|super)')
REGEXP_MATCHES(feedback, '(bad|terrible|horrible|disappointed|broken)')
```

A first pass - fails

```sql
WITH sentiment_analysis AS (
  SELECT 
      (CASE 
        WHEN feedback ~ '(amazing|great|awesome|good|perfect|impressed|super)'
          AND feedback ~ '(bad|terrible|horrible|disappointed|broken)' THEN 'mixed'
        WHEN feedback ~ '(amazing|great|awesome|good|perfect|impressed|super)' THEN 'positive'
        WHEN feedback ~ '(bad|terrible|horrible|disappointed|broken)' THEN 'negative'
        ELSE 'neutral'
      END) AS sentiment,
      COUNT(*) AS reviews_count
  FROM reviews
  GROUP BY 1
),

total_reviews AS (
  SELECT
    COUNT(*) AS total_reviews
  FROM reviews
)

SELECT 
  sentiment AS review_type,
  ROUND(100.0 * reviews_count / total_reviews) AS percentage,
  reviews_count
FROM sentiment_analysis, total_reviews
WHERE sentiment IN ('positive', 'negative')
ORDER BY (100.0 * reviews_count / total_reviews) DESC
```




Refactored - fails


```sql
WITH sentiment_analysis AS (
  SELECT 
      (CASE 
        WHEN feedback ~ '(amazing|great|awesome|good|perfect|impressed|super)'
          AND feedback ~ '(bad|terrible|horrible|disappointed|broken)' THEN 'mixed'
        WHEN feedback ~ '(amazing|great|awesome|good|perfect|impressed|super)' THEN 'positive'
        WHEN feedback ~ '(bad|terrible|horrible|disappointed|broken)' THEN 'negative'
        ELSE 'neutral'
      END) AS sentiment,
      COUNT(*) AS reviews_count,
      SUM(COUNT(*)) OVER () AS total_reviews,
      ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER ()) AS percentage
  FROM reviews
  GROUP BY 1
)

SELECT 
  sentiment AS review_type,
  percentage,
  reviews_count
FROM sentiment_analysis
WHERE sentiment IN ('positive', 'negative')
ORDER BY (100.0 * reviews_count / total_reviews) DESC
```



### Second pass

Positive reviews
Negative reviews
Mixed reviews
Neutral reviews

```sql
WITH sentiment_analysis AS (
  SELECT 
    (CASE
      WHEN feedback ~ '(amazing|great|awesome|good|perfect|impressed|super)' AND feedback ~ '(bad|terrible|horrible|disappointed|broken)' THEN 'mixed'
      WHEN feedback ~ '(bad|terrible|horrible|disappointed|broken)' THEN 'negative'
      WHEN feedback ~ '(amazing|great|awesome|good|perfect|impressed|super)' THEN 'positive'
      ELSE 'neutral'
    END) AS sentiment,
    COUNT(*) AS reviews_count,
    SUM(COUNT(*)) OVER () AS total_reviews,
    100.0 * COUNT(*) / SUM(COUNT(*)) OVER () AS percentage
  FROM reviews
  GROUP BY 1
)

, sentiments AS (
  SELECT 
    'positive' AS sentiment
  UNION
  SELECT 
    'negative'
  UNION 
  SELECT 
    'mixed'
  UNION 
  SELECT 
    'neutral'
)

SELECT 
  s.sentiment AS review_type,
  ROUND(percentage) AS percentage,
  reviews_count
FROM sentiments s 
LEFT JOIN sentiment_analysis sa
  ON sa.sentiment = s.sentiment
ORDER BY percentage DESC NULLS LAST
```

This query includes all sentiments in the result table.



Rewritten using ILIKE operators

```sql
WITH sentiment_analysis AS (
  SELECT 
    (CASE
      WHEN (feedback ILIKE '%amazing%' OR
            feedback ILIKE '%great%' OR 
            feedback ILIKE '%awesome%' OR
            feedback ILIKE '%good%' OR
            feedback ILIKE '%perfect%' OR
            feedback ILIKE '%impressed%' OR
            feedback ILIKE '%super%')
        AND
            (feedback ILIKE '%bad%' OR
            feedback ILIKE '%terrible%' OR
            feedback ILIKE '%horrible%' OR
            feedback ILIKE '%disappointed%' OR
            feedback ILIKE '%broken%') THEN 'mixed'
      WHEN (feedback ILIKE '%amazing%' OR
            feedback ILIKE '%great%' OR 
            feedback ILIKE '%awesome%' OR
            feedback ILIKE '%good%' OR
            feedback ILIKE '%perfect%' OR
            feedback ILIKE '%impressed%' OR
            feedback ILIKE '%super%') THEN 'positive'
      WHEN (feedback ILIKE '%bad%' OR
            feedback ILIKE '%terrible%' OR
            feedback ILIKE '%horrible%' OR
            feedback ILIKE '%disappointed%' OR
            feedback ILIKE '%broken%') THEN 'negative'
      ELSE 'neutral'
    END) AS sentiment,
    COUNT(*) AS reviews_count,
    SUM(COUNT(*)) OVER () AS total_reviews,
    100.0 * COUNT(*) / SUM(COUNT(*)) OVER () AS percentage
  FROM reviews
  GROUP BY 1
)

, sentiments AS (
  SELECT 
    'positive' AS sentiment
  UNION
  SELECT 
    'negative'
  UNION 
  SELECT 
    'mixed'
  UNION 
  SELECT 
    'neutral'
)

SELECT 
  s.sentiment AS review_type,
  ROUND(percentage) AS percentage,
  reviews_count
FROM sentiments s 
LEFT JOIN sentiment_analysis sa
  ON sa.sentiment = s.sentiment
ORDER BY percentage DESC NULLS LAST
```

The problem seems to be that our regex pattern matches are case-sensitive. So, for example, 'great' will be matched but 'Great' and 'GReAt' won't be matched.

To perform case-insensitive regex pattern matches, use a tilde succeded by an asterisk, `~*`, instead of `~`.

### Solution

```sql
WITH sentiment_analysis AS (
  SELECT 
      (CASE 
        WHEN feedback ~* '(amazing|great|awesome|good|perfect|impressed|super)'
          AND feedback ~* '(bad|terrible|horrible|disappointed|broken)' THEN 'mixed'
        WHEN feedback ~* '(amazing|great|awesome|good|perfect|impressed|super)' THEN 'positive'
        WHEN feedback ~* '(bad|terrible|horrible|disappointed|broken)' THEN 'negative'
        ELSE 'neutral'
      END) AS sentiment,
      COUNT(*) AS reviews_count,
      SUM(COUNT(*)) OVER () AS total_reviews,
      ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER ()) AS percentage
  FROM reviews
  GROUP BY 1
)

SELECT 
  sentiment AS review_type,
  percentage,
  reviews_count
FROM sentiment_analysis
-- WHERE sentiment IN ('positive', 'negative')
ORDER BY (100.0 * reviews_count / total_reviews) DESC
```

Alternatively, we can convert the feedback to lowercase before pattern matching.

```sql
WITH sentiment_analysis AS (
  SELECT 
      (CASE 
        WHEN LOWER(feedback) ~ '(amazing|great|awesome|good|perfect|impressed|super)'
          AND LOWER(feedback) ~ '(bad|terrible|horrible|disappointed|broken)' THEN 'mixed'
        WHEN LOWER(feedback) ~ '(amazing|great|awesome|good|perfect|impressed|super)' THEN 'positive'
        WHEN LOWER(feedback) ~ '(bad|terrible|horrible|disappointed|broken)' THEN 'negative'
        ELSE 'neutral'
      END) AS sentiment,
      COUNT(*) AS reviews_count,
      SUM(COUNT(*)) OVER () AS total_reviews,
      ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER ()) AS percentage
  FROM reviews
  GROUP BY 1
)

SELECT 
  sentiment AS review_type,
  percentage,
  reviews_count
FROM sentiment_analysis
-- WHERE sentiment IN ('positive', 'negative')
ORDER BY (100.0 * reviews_count / total_reviews) DESC
```