## Data Modelling Patterns

1. Which 3 concerns should you take into account when choosing a pattern to apply to your schema?

- [x] Data Duplication
- [x] Data Staleness
- [x] Data Integrity Issues
- [ ] Data Structure
- [ ] Data Size

2. Would the problem of keeping relations between documents across different collections up to date be a Data Staleness or Data Integrity consideration? Why?

- [_] Data Integrity
- [x] Data Staleness
- [_] Data Duplication

3. In what sort of data environment would it be useful to use one-to-zillions notation?
![many to many](/images/many_to_many.png)
- In a big data environment

4. What does the “0" and "1000" denote in the "[0, 1000]” notation above?
- "0" denotes the minimum number of relations
- "1000" denotes the max number of relations

5. Suppose we changed the notation for the reviews schema from "[0, 1000]" to "[0, 20, 1000]". What would the integer "20" now denote?
- The average number of one to many relations

### Extended Reference Pattern

The problem the ___(extended reference) pattern addresses is avoiding joining too many pieces of data at query time.

![extended_reference](./images/extended_reference.png)

6. Which of the following patterns has been used?
- [ ] Attribute Pattern
- [ ] Subset Pattern
- [ ] Bucket Pattern
- [x] Extended Reference Pattern

### Schema Versioning Pattern
7. If I need to modify and update one of my schemas and I want to avoid downtime while doing so, then I should use the ___ (Schema Versioning) Pattern.

This pattern is implemented by adding a ___(version) field to each ___(document).

### Subset Pattern
8. The subset pattern is a great pattern to help you ___ (reduce) the size of your working set by ___ (splitting) information that you want to keep in memory and information that you fetch on demand. 
•	Reduce
•	Increase
•	Splitting
•	Combining

### Computed Pattern
9. If I am doing costly computations frequently for the same data and producing similar results, then I should consider the ___(computed) pattern.

10. If I am doing costly computations frequently and precision is unimportant, then I should consider the ___ (approximation) pattern.

- [ ] computed
- [ ] approximation

If, on an hourly basis, I read more often than I write to my database and each of my reads involves some expensive mathematical computation, then I might want to consider the ___ (computed) pattern.

<!-- Rather than running an expensive computation each time I read from my database, I run a computation for each write and store the result so that it can be retrieved by subsequent reads.  -->

<!-- What changes would you make if the number of writes per hour exceeded the number of reads per hour? -->

### Tree Pattern
11. The Tree Pattern allows you to model ___(hierarchical) data. 

12. What are the four types of Tree Patterns?

- Parent References
- Child References
- Array of Ancestors
- Materialised Paths

### Bucket Pattern

13. We should use the Bucket Pattern when we have documents that are too ___(large) or too ___(numerous).

14. When we can’t embed a 1-N relationship and want an alternative to a embedding or linking an entire document, we can make use of the ___ pattern. 
- [x] Bucket
- [ ] Subset
- [ ] Extended Reference

### Polymorphic Pattern

When we want to keep similar objects in the same collection, we should use the ___ (polymorphic) pattern. 

With this pattern, we add a field to keep track of the document type. 

### Attribute Pattern

According to the ___ pattern, we transform related key-value pairs with similar value types into sub-documents that have the following shape: `{"k": <key>, "v": "<value>"}`.

Suppose you have a document in the cities collection that looks like this:

```json
{
  "city_weather": [
	  {"london": "sunny"},
	  {"paris": "rainy"},
	  {"new york": "windy"}
  ]
}
```

Produce a schema for this document using the attribute pattern.

```json
{
	"city_weather": [
		{"k": "<string>", "v": "<string>"}
	]
}


{
	"city_weather": [
		{"k": "london", "v": "sunny"}
		{"k": "london", "v": "sunny"}
	]
}
```
