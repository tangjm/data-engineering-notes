# Three-valued logic in SQL

SQL uses a three-valued logic with three truth values, namely, True, False and Unknown.

Here are the truth tables for AND, OR and NOT operators

Conjunction

| $\text{AND}$ | $\text{True}$    | $\text{Unknown}$ | $\text{False}$ |
|---------|---------|---------|-------|
| $\text{True}$    | $\text{True}$    | $\text{Unknown}$ | $\text{False}$ |
| $\text{Unknown}$ | $\text{Unknown}$ | $\text{Unknown}$ | $\text{False}$ |
| $\text{False}$   | $\text{False}$   | $\text{False}$   | $\text{False}$ |

<br />

Disjunction

| $\text{OR}$ | $\text{True}$ | $\text{Unknown}$ | $\text{False}$   |
|---------|------|---------|---------|
| $\text{True}$    | $\text{True}$ | $\text{True}$    | $\text{True}$    |
| $\text{Unknown}$ | $\text{True}$ | $\text{Unknown}$ | $\text{Unknown}$ |
| $\text{False}$   | $\text{True}$ | $\text{Unknown}$ | $\text{False}$   |

<br />

Negation

| $\text{P}$     | $\text{NOT P}$ |
|---------|----------|
| $\text{True}$    | $\text{False}$    |
| $\text{False}$   | $\text{True}$     |
| $\text{Unknown}$ | $\text{Unknown}$  |


### Examples

Consider the SQL WHERE filter

```sql
WHERE first_name <> ''

-- equivalently,
WHERE first_name != ''
```
n.b. `!=` is syntactic sugar for `<>`

This clause filters out empty `first_names` and NULL values.

To see this, note that the clause filters out all values of `first_name` that do not make the condition evaluate to `True`.

Now this filters out NULL values because in the case that `first_name` is NULL, `first_name <> ''` will evaluate to `Unknown`, which is not equal to `True`.

We must note that NULL has truth-value `Unknown` in this context and `Unknown = anything_else` is always `Unknown` since it represents a missing value and, for all we know, that missing value might or might not be equal to `anything_else`.

Moreover, it follows that both `Unknown != anything_else` and `Unknown <> anything_else` will evaluate to `Unknown` since negating `Unknown` results in `Unknown`.