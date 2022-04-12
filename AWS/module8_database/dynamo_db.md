# Section 2: Amazon DynamoDB

Managed low-latency NoSQL database

- The database is replicated across multiple availability zones within a Region
- Table storage is optimised for large and volatile data sets.
- Its query language is optimised for low-latency performance.
- Data is stored in SSDs
- Option to encrypt data at rest

### Tables, items and attributes

Attributes are the most fundamental data elements
Items are uniquely identifiable groups of attributes
A table is a collection of items.

![Primary key types](images/primary_key_types.png)

Two primary key types:
1. A single key composed of a single attribute: partition key
2. A compound key composed of two attributes: partition key and sort key

Each item in a table must have a key.

### Querying your database

![Querying data](images/dynamo_db_querying_data.png)

1. Query by key attributes

This way of finding data is efficient because your items are indexed by their primary keys

2. Scan for match conditions on non-key attributes

While less efficient than the first method, this method provides greater flexibility


