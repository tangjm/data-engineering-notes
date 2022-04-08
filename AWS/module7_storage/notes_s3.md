# Section 2: AWS S3 (Simple Storage Service)

A durable object-level storage service that stores data as objects in buckets

Each object is limited to around 5TB which provides you with practically unlimited storage

Buckets are logical containers that can store almost all data types including images, videos and server log.

Buckets are be accessed through HTTP(S) through urls REST endpoints or through VPC endpoints.


### Data durability and security

By default, buckets are replicated across Regions and across multiple facilities.

You can configure security options for individual buckets.

By default, public access to newly created buckets is denied.

### Integration with AWS Lambda functions

You can set up event notifications to trigger events when an object is uploaded to or deleted from a bucket and trigger Lambda functions.



### S3 storage classes

There are a range of different object-level storage classes:



### S3 bucket URLs

There are two URL formats for S3 buckets

1. Bucket path-styyle URL endpoint

https://s3.<region>.amazonaws.com/<bucket_name>

2. Bucket virtual hosted-style URL endpoint

https://<bucket_name>.s3<region>.amazonaws.com

Bucket names must be globally unique and DNS compliant. This is because they form part of the URL address through which the bucket is accessed and URLs must be globally unique.

Uploaded files are referred to as objects because they get wrapped with metadata (which includes the object's url) and are stored as objects in S3 buckets.

Folders are logical separators for organising files/objects in your S3 bucket.

You can configure the permissions for each uploaded file.