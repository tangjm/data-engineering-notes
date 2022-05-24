# Matching algorithms

### Blocking keys

#### Example 1

If we had 100 records and did a pairwise comparison, that would involve 100 * 100 comparisons or $10^4$.

But, if we split 100 records into 10 blocks of 10 records, then the number of comparisons would be $\text{number of blocks} \times \text{comparisons per block}$ which would amount to 10 * (10 * 10) or $10^3$ comparisons.

That's 10 times fewer comparisons or 10 times as fast.

#### Example 2

Suppose we had 100,000 records.
This would involve 100,000 * 100,000 comparisons or $10^9$ comparisons.

If we partition them into 100 blocks of 1000 records each, then the number of comparisons would be $100 * (1000 * 1000) = 10^7$.

That's $10^2$ times fewer comparisons or a 100 times faster.


#### Example 3
If we had 100 records and partitioned them into 100 blocks with each block containing a single record, then the number of comparisons would be 100 * 100 because blocks of a single record aren't really blocks, but just records, so 100 blocks with a single record each is equivalent to just a block of 100 records.
