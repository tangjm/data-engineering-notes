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
(amazing)|(great)|(awesome)|(good)|(perfect)|(impressed)|(super)
(amazing|great|awesome|good|perfect|impressed|super)

Regex for negative word list:
(bad|terrible|horrible|disappointed|broken)

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




Refactored


```sql
WITH sentiment_analysis AS (
  SELECT 
      (CASE 
        WHEN feedback ~ '(amazing|great|awesome|good|perfect|impressed|super)'
          AND feedback ~ '(bad|terrible|horrible|disappointed|broken)' THEN 'mixed'
        WHEN feedback ~ '(amazing|great|awesome|good|perfect|impressed|super)' THEN 'positive'
        **WHEN feedback ~ '(bad|terrible|horrible|disappointed|broken)' THEN 'negative'**
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