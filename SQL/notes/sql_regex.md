SQL Regular Expressions Crib Sheet
---

### Cheatsheet
```
\ escapes characters with special semantics
\n denotes a newline
\b denotes a backspace
\r denotes a carriage return (\r\n)
\t denotes a tab
\s denotes a whitespace character
\S denotes a non-whitespace character

\d denotes digits
\D denotes non-digits
\w denotes word characters (letters, digits and _) 
\W denotes non-word characters
```

### Special symbols
```
. matches any character
^
- matches the start of a string
- serves as the negation symbol inside square brackets, e.g. [^\d] matches non-digits.

$ matches the end of a string

<!-- Quantifiers -->

{} for quantifiers

z{3} denotes exactly 3 'z' characters
z{3,} denotes at least 3 'z' characters (lower bound on the number of z chars)
z{3, 5} denotes >= 3 and <= 5 'z' characters

[] lets you use multiple characters to match a single character

[abc123] matches a single character, namely, 'a' or 'b' or 'c' or '1' or '2' or '3'

Inside square brackets, we can define a range of characters like so:

The dash '-' denotes a range inside square brackets. Outside of square brackets, it's just a '-' character with no special meaning and so it doesn't need to be escaped with '\'. But because it denotes a range inside square brackets, we need to escape it in this way: '\-' if we wanted to match '-' inside square brackets 

[a-c1-3] is equivalent to [abc123]
[a-c] denotes the range a to c.

'?' denotes zero or one of its predecessor

E.g. 9? will find 3 matches in "999"

+ denotes one or more of its predecessor

E.g. a+ will match "a" and "aaa" in "a tidy plaaayground"

* denotes zero or more of its predecessor

What '*' matches will be a strict superset of what '?' matches and what '+' matches

'*' will also match what "?" matches or what "+" matches
```

### Capturing groups

Parentheses define a group of characters (capturing groups)

`([a-z])([\d+])` creates two capturing groups: 
- the first is a single letter of the alphabet
- the second is one or more digits.

Capturing groups or `()` let us target multiple patterns with a single regex.

Each group is given a number behind the scenes, which can use to reference the pattern matched by the capturing group in our functions.

Within a group, we can use `|` to give a disjunctive specification of patterns.

```sql
-- Examples
SELECT regexp_replace('foobar', '(foo)(bar)', '\1@\2.com')
Result: foo@bar.com
```

```
Adding '?:' at the start of a capturing group like so: (?:abc), groups the first three letters of the alphabet together without creating a capturing group
```

Playground
---

```sql
-- Type your query here, for example this one 
-- lists all records from users table: 

WITH user_details AS (
  SELECT 'Foo' AS first_name, 'Bar' AS last_name
  UNION
  SELECT 'Andy (Bob)', 'Jacobs (Smith)'
  UNION
  SELECT '***', '***'
  UNION
  SELECT '(555)-132-3813', 'Mr. Harris'
  UNION
  SELECT 'Why do I need to fill this?!', ''  
  UNION
  SELECT 'Meri-Kris', 'NuÃ±ez'  
)

SELECT 
  CASE WHEN first_name ~ '[a-z]+[^?!]$' THEN first_name END AS valid_first_names,
  CASE WHEN last_name ~ '[a-z]+[^\w]' THEN last_name END AS valid_last_names,
  CASE WHEN first_name ~ '\(+' THEN SPLIT_PART(first_name, ' ', 1)
  ELSE first_name END AS formatted_first_name,
  CASE WHEN last_name ~ '\.' THEN SPLIT_PART(last_name, '.', 2) END,
  CASE WHEN last_name ~ '\)$' THEN REGEXP_REPLACE(last_name, '\([a-z]+\)$', '') END,
  *
FROM user_details
```


Matching postcodes that have the following shapes:
- XXXXX
- XXXXX-XXXX

```
'(?:^\d{5}$|^\d{5}\-\d{4}$)'
'^[0-9]{5}(?:-[0-9]{4})?$'
```

