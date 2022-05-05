---
export_on_save:
  html: true
---
# [Data Processing using AWS S3 Storage Components](https://cdn5.dcbstatic.com/files/t/a/talendacademy_docebosaas_com/1651762800/dIEtPRB5FnKg4GZjXh77bw/item/b2ca583f106464abdeb7eedbfcd64eaa74afa244.pdf)

What are Key prefixes for tS3List components and Key field for the tS3Put component for?
For S3 components, what are the 'key' and 'key prefix' fields for?
Key is the S3 path followed by the file name to be uploaded to the
bucket?

Key fields in tS3Put, tS3Get, tS3Delete, tS3Copy

tS3Put - uploads files to S3 bucket from local directory
tS3List - lists files in an S3 bucket folder
tS3Copy - copies files between S3 buckets
tS3Get - downloads files from S3
tS3Delete - deletes files in an S3 bucket

tS3BucketCreate
tS3BucketList
tS3BucketDelete

Object keys uniquely identify objects with an S3 bucket.

Key name prefixes end in '/' and can be used to logically structure your objects into folders.

[AWS object keys](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html)