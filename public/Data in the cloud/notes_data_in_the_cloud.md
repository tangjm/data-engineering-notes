### Cloud computing 
Computing using any computer other than your local computer
Cloud - collection of remote computers
Scalable

### Distributed Computing 
- multiple computers working together


Advantages
1. Reliable scaling - use as many or little computers as required
2. Flexible
3. Secure - 
4. Fast
5. Fault-Tolerant - prepared for failure
6. Connected



We often use frameworks to work with distributed computing
- Apache Hadoop
- Apache Storm
- Apache Spark

## Hadoop framework
### HDFS - Hadoop Distributed File System

Keeps 3 copies - 2 locally, 1 elsewhere
Neatly partiitons data by logical steps

It can store fragments of a single file as a block across different computers.

### MapReduce
Map tasks by key value pairs -> Reduce tasks

### YARN - Yet Another Resource Negotiator

Talks to the outside world. Has a scheduler and a Resource Manager.

### Hadoop architecture
Central Node
DataNode
- stores data

NameNode
- stores file metadata, transaction log
- all 3 copies of the data is made

JobTracker
Calculates the "map" jobs and the data to perform "reduce" on before sending it to TaskTacker

TaskTracker
Carries out the MapReduce and returns the results to JobTracker.

#### Hadoop infrastructure

Scoop - data ingestion tool that transfers data between Hadoop and external data stores
Tez - updated version of MapReduce/Spark
HBase - relational database management system option
Kafka - streaming data 
Mahout - linear algebra framework
ZooKeeper - node management service
Ambari - Hadoop's GUI tool (cf. MongoDB Compass)
Flume - data movement and management tool
Pig - data movement tool using pig-latin
H2O - machine learning algorithm library
Hive - provides an interface to query data from structured data bases using HiveQL 
Drill - colulmn-based in memory editor for complex data models, implementation of NoSQL

### Spark
Based-on MapReduce (upgrade to MapReduce)
Works on direct acyclic graphs (DAG) and is a resilient distributed dataset (RDD) at its core.
- Lower latency achieved by caching in memory - more responsive write and read queries.
- Multi-threading
- Makes better use of each processor
- Needs a cluster manager and distributed storage system (so it can run on Hadoop)
- Functional programming model

### PySpark
- Python Interface for working with Spark
- Write Python which is converted to Spark Jobs that run on the Spark Engine
- Use PySpark through notebooks
- Pandas library used for working with structured data



