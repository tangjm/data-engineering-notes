---
export_on_save:
  html: true
---
# MongoDB Data Modelling
### ch1

What's the difference between databases, collections and documents?
Data modelling methodology

1.	Identity workload – important operations and quantify and quality operations
2.	Identify and model relationships between entities
3.	Apply design patterns

MongoDB stores data as ____. (Documents)

MongoDB is a flexible schema database. 
Explain what is a flexible schema database.

Answer:  Documents in the same collection don't need to have the exact same list of fields. Furthermore, the data type in any given field can vary across documents. You can have multiple versions of your schema as your application develops over time and all the schema versions can coexist in the same collection. MongoDB supports enforcing the schema shape from no rules, rules in a few fields, to rules on all the fields of the documents.

Question. In the case of MongoDB, a document can't be larger than ___ MB.
Answer. 16MB

Keep the frequently used ___ and ___ in ____(memory/storage). They are what we described as a ___. Prefer ___ drives to ___ drives. If you have a ton of historical data, data you don't use very often, ___ drives are cheaper and may work just fine.
- memory
- storage
- data
- indexes
- working set
- solid state
- hard disk

The nature of your ___ and ____define the need to model your data. It is important to identify those exact constraints and their impact to create a better model. As your software and the technological landscape change, your model should be ___ and ___ accordingly.
•	data set
•	hardware
•	re-evaluated
•	updated
•	documents
•	indexes
•	working set

#### Embedding vs Linking documents
If I want to optimise for simplicity, should I go for fewer collections with lots of embedded sub-documents or more collections with references to different documents?

#### Simplicity vs Performance
To keep the model simple, you are likely to group a lot of those pieces inside a few collections using sub-documents or arrays to represent the one-to-one, one-to-many, too many-to-many many relationships.

By keeping the modeling steps to the minimum, we can remain very agile, with the ability to quickly iterate on our application, reflecting these changes back into the model if needed.

If you model for simplicity, as a result, you will likely see fewer collection in your design where each document contains more information and maps very well to the object you have in your application code-- the objects being represented in your favorite language as hashes, maps, dictionary, or nested objects.

Finally, as a result of having larger documents with embedded documents in them, the application is likely to do less disk accesses to retrieve the information.

Again, you start by identifying the important operations, but also quantify those in terms of metrics like operation per second, required latency, and pinning some quality attributes on those queries such as-- can the application work with data that's a little stale, are those operations parts of the large analytic query?

If you model for performance you will often see more collection in your design.

You will also need to apply a series of schema design patterns to ensure the best usage of resources like CPU, disk, bandwidth.
### ch2
1-1 relationships
Many-Many relationships
One-Many relationships
When might it be useful to use one-to-zillions notation?

What does the “[0, 1000]” notation denote?

### ch3
For example, duplicating data across documents, accepting staleness in some pieces of data, writing extra application side logic to ensure referential integrity.

Choosing a pattern to be applied to your schema requires taking into account which 3 concerns?
•	Duplication
•	Data Staleness
•	Data Integrity Issues
•	Data Structure
•	Data Size

### The Attribute Pattern

    <key, value> -> {“k”: key, “v”: value”} []

Transform a `<key, value>` pair into a sub-document with two fields: “k” and “v” that denote “key” and “value”. This enables you to create a single index for multiple fields, by indexing over the `{“k”: <string>, “v”: <value data type> }` schema. 

Advantages
Simpler indexing, as we are indexing over schemas, we don’t need to know the exactly `<key, value>` values beforehand. Newly added instances of the schema are automatically indexed. 

We can qualify the relationship between key and value. 
The attribute pattern addresses the problem of having a lot of similar fields in a document. Often, those fields have similar value types. Or there's a need to search across many of those fields at once. This pattern is also helpful when only a subset of the documents have many similar fields.

### The Extended Reference Pattern
The Extended Reference Pattern is used to aovid doing additional joins/lookups.

The problem the extended reference pattern addresses is avoiding joining too many pieces of data at query time.

If the query is frequent enough and generates a considerable amount of lookups, pre-joining the data can be done by applying this pattern.

The solution is to identify the fields you are interested in on the looked up side and make a copy of those fields in the main object.

You will see this pattern often used in catalogs, mobile applications, and real-time analytics.

The common thread here is to reduce the latency of your read operations or avoid round trips or avoid touching too many pieces of data.

You will get faster reads, due to the reduced number of joints and lookups.

The price you will pay for the improvement in performance is the fact that you may have to manage a fair amount of duplication, especially if you embed Many-to-One relationships, where the fields change or mutate a lot.

### The Subset Pattern
Reduce the size of documents brought into the working set by diving the document into two collections: a frequently used part and a less used part. Only duplicate parts of a 1-N N-N relationship that more frequently used.


# ch4
### The Computed Pattern (cf. memoization)
•	Costly computation/manipulation of data executed frequently on the same data producing the same result.
•	Avoid performing similar operations many times.

Solution
Perform the operation and store the result in the appropriate document and collection

Mathematical operations
If I read more often than I write to my database and each of my reads involves some expensive mathematical computation, then I might want to consider using the computed pattern. 
Rather than running an expensive computation for each read, I run a computation for each write and store the result so that it can be retrieved by subsequent reads. 
- Fan Out Operations
- Roll Up Operations (vs drill down)
Grouping data together. (seeing data at higher-levels) 

### Bucket Pattern
When we have documents that are too large or too numerous
When we can’t embed a 1-N relationship. Alternative to fully embedding or linking a 1-N relationship.
Define an optimal amount of data to group together and store the information in the main document under an array field.

We group data together according to a user-defined level of granularity. For instance, we can decide whether to group data by the minute, hour, month, year. 

It’s essentially an embedded 1-to-many relationship. 


### Schema Versioning Pattern

Avoids downtime when doing schema updates.
Each document gets a schema_version.

### Tree Patterns
•	Parent References
•	Child References
•	Array of Ancestors
•	Materialised Paths

    {
        "name": "parent reference",
        "parent": "<string>"
    }


    {
        "name": "array of children"
        "children": ["<string>"]
    }


    {
        "name": "array of ancestors"
        "ancestors": ["<string>"]
    }


    {
        "name": "materialised path"
        "ancestors": ".<string>.<string>"
    }


### Polymorphic Pattern

When we want to keep similar objects in the same collection.
- Add a field to keep track of the document/sub-document type

Easy to implement 
Allows queries across collections




