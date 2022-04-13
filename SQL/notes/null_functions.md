### Null functions

**COALESCE**

Use COALESCE to substitute a default value for null values

```sql
COALESCE(value1, default_value)
```

**NULLIF**

Can be regarded as the the inverse of the COALESCE function.
Use NULLIF to substitute a specified value for a null value.

```sql
-- if value1 matches the second value, then replace value1 with null, else stick to value1
NULLIF(value1, 'value_to_replace_with_null')
```


e.g.

```sql
COALESCE(value1, non_null_value)
NULLIF(value1, non_null_value)

-- If value1 is NULL, then COALESCE will return the non_null_value.
-- If value1 is the non_null_value, it's not NULL, and so NULLIF will return NULL.
```

In short:
- If value1 is NULL, then not NULL.
- If value is not NULL, then NULL.
  
Hence, we can think of NULLIF as the inverse of COALESCE.