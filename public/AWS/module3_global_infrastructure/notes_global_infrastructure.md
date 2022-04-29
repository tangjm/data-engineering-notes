### AWS Regions
***

An AWS Region is a geographical area with two or more availability zones.

An availability zone comprises one or more data centres.

Availability zones are fully isolated partitions of the AWS infrastructure.

Within a region, availability zones are not physically located together but remain within 100km of each other.

They are designed to be fault tolerant.

Availability zones are connected through high speed low-latency private links.

It is a good idea to replicate data across availability zones for data resilience.

Data replication is not cross regional.

Use AWS console to enable and disable regions

### Selecting a Region

- Data governance and legal requirements (e.g. GDPR)
- Latency (Proximy to customers; Use Cloud Ping to test latency)
- AWS Services available within the region
- Cost

### AWS Data Centres

You select in which availability zones your systems reside.

You cannot specify exactly which data centre.

Data centres are where data resides and is processed.

Data centres are designed with failure in mind to ensure high availability.

A data centre has typically 50,000 to 80,000 physical servers.

CloudFront is a CDN (Content Delivery Network). It delivers content to end users with reduced latency

Route 53 is a DNS (Domain Name System) service. Requests are automatically routed to edge locations to reduce latency. 

Regional edge caches are for not frequently accessed data.

### Infrastructure features

1. Elasticity and scalability

Resources adjust on-demand to fit capacity and growth

2. Fault-tolerance

Allows for operation in spite of failures

3. High availability

Minimal downtime without in-person support.


### Foundational Infrastructure

1. Compute
2. Networking
3. Storage


### Storage services

S3 (Simple Storage System)
- Object storage service

EBS (Elastic Block Store)
- Block storage service
- for transaction intensive workloads
- works well with EC2

EFS (Elastic File System)
- NFS (Network File System)

S3 Glacier 
- Data archiving 
- Long-term backups

### Compute services

EC2 (Elastic Compute Cloud)
- a virtual machine in the cloud
- resizable/configurable

Auto Scaling allows for adding and removing EC2's automatically according to preconfigured settings.

ECS (EC2 Container Service)
- Supports Docker containers

ECR (EC2 Container Registry)
- Deploy, maintain, manage, store Docker container images

Elastic Beanstalk
- web applications

Lambda
- Run code without servers
- You only pay for units of computation. 

EKS (Elastic Kubernetes Service)
- Deploy apps containerised with Kubernetes

Fargate
- engine for ECS without needing servers/clusters


### Database services

RDS (Relational Database Service)
- relational database

Aurora 
- MySQL/PostgresSQL database
- 5x faster than ordinary MySQL databases
- 3x faster than PostgresSQL database

Redshift
- Run analytic queries on data
- Data analysis platform

DynamoDB
- Document based NoSQL database
- <key, value> pair NoSQL database


### Networking and Content Delivery services

VPC (Virtual Private Cloud)
- run logically isolated parts of the AWS cloud in a user-controlled private network 

Elastic Load Balancing
- Automatically distribute traffic across multiple compute targets

CloudFront
- CDN that delivers data and applications, APIs to global customers
- low latency
- high transfer speed

Transit Gateway
- Connect your on-premise infrastructure with your VPC
  
Route 53
- Cloud DNS (Domain Name System)

Direct Connect
- Dedicated private network connection

VPN
- Secure private tunnel for your device to the AWS global network.


### Security, Identity, Compliance services

IAM (Identity and Access Management)
- Manage user access to AWS services and resources

AWS Organisations
- Restrict access based on accounts and Organisational Units

Cognito
- User Authentication for web and mobile apps

Artifact
- On-demand access to AWS compliance reports and online agreements

Key Management Service
- Create and manage encryption keys

Shield
- Managed, distributed DOS protection service

Cost Management services

Cost and Usage Report
- cost and usage data
- metadata about services, pricing and reservations

Budgets
- Custom budgets for services
- Setup notifications when you exceed your budget

Cost Explorer
- Visualise your AWS cost and usage over time

### AWS Management and Governance services

Management Console
- Access your AWS account via a webpage

Config
- Track resource inventory and changes

CloudWatch
- Monitor resources and apps

Auto Scaling
- Scale multiple resources to meet demand

CLI
- Manage AWS Services through the command line
  
Trusted Advisor
- Optimise peformance and security using AWS best practices
  
Well-Architected Tool
- Review and improve workloads
  
CloudTrail
- Track user activity and API usage across AWS accounts