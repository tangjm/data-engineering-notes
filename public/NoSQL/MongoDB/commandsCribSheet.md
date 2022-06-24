---
export_on_save:
  html: true
---

# Mongosh crib sheet

### Part 1: Connect to a server

    mongosh
    mongosh "mongodb://localhost:27017"

The above two commands are equivalent.

Connect to a specific database

    mongosh "mongodb://localhost:27017/<database>"

#### Remote hosts

These two are also equivalent: the first uses a connection string; the second uses command-line options.

    mongosh "mongodb://mongodb0.example.com:28015"
    mongosh --host mongodb0.example.com --port 28015

[Further documentation](https://www.mongodb.com/docs/mongodb-shell/connect/)

- Connect with authentication
- Connect to a Replica Set
- Connect via TLS

### Part 2: Mongosh commands

n.b. Databases and collections will be created if they don't already exist when they feature in commands.

For example:

  1. Using a database that doesn't exist creates the database and then uses it.
    
    use weatherDB

  2. Running a query on a collection that doesn't exist creates the collection and then executes the query.
  
    db.cities.insertOne(
      { 
        name: "london", 
        weather: "rainy"
      }
    )

(https://www.mongodb.com/docs/mongodb-shell/run-commands/)

    show dbs

Outputs a list of existing databases

    db

Just like how the shell command `pwd` outputs the working directory, `db` outputs the working/currently used database.

    use <db>

This will create a database if it doesn't already exist. Otherwise, it will switch to the existing database.

#### Clearing the console

     1. Ctrl + L
     2. console.clear()




### Part 3: CRUD operations 

#### Create

    db.collection.insertOne()
    db.collection.insertMany()

n.b. All write operations are atomic (not transactional). [What are transactions?](https://www.postgresql.org/docs/current/tutorial-transactions.html)

E.g.

    db.users.insertOne(
      {
        name: "sue",
        age: 26,
        status: "pending"
      }
    )

#### Read

    db.collection.find()  

E.g.

    db.users.find(
      { age: { $gt: 18} }, 
      { name: 1, address: 1 }
    ).limit(5)

#### Update

    db.collection.updateOne()
    db.collection.updateMany()
    db.collection.replaceOne()

E.g.

    db.users.updateMany(
      { age: { $lt: 18 }},
      { $set: { status: "reject" }}
    )


#### Delete

    db.collection.deleteOne()
    db.collection.deleteMany()

E.g. 

    db.users.deleteMany(
      { status: "reject" }
    )

[Link to docs](https://www.mongodb.com/docs/manual/crud/)