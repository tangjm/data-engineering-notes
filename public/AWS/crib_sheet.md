# Cloud Foundations Exam - Crib Sheet

### Topic weightings
Cloud concepts = 26%
Security and compliance = 25%
Technology = 33%
Billing and Pricing = 16%

### Cost Explorer vs Pricing Calculator vs Budgets

Cost Explorer
- use when you already have AWS services
- backward-looking (for exploring cost history)
- visualise your costs over time

Pricing Calculator
- use before you have any AWS services
Pricing calculator is for exploring and estimating the costs of your selected AWS services before you build them.

Budgets
- use when you already have AWS services
- forward-looking (for planning future costs based on user defined budgets)
- for setting up budgets and alerts for when your costs breach configured thresholds.
- uses cost visualisations from AWS Cost Explorer to show the status of preset budgets and to forecast estimated costs.

Compared to Cost Explorer and Budgets, the following services are more for billing rather than cost management:

Billing - provides a monthly view of your chargeable costs.
- Cost and Usage Reports
- Bills
- Cost Allocation Tags


 
### S3 Transfer Acceleration vs CloudFront PUT/POST
For large throughput, S3 Transfer Acceleration is more performant.
If you have objects that are smaller than 1 GB or if the data set is less than 1 GB in size, you should consider using Amazon CloudFront's PUT/POST commands for optimal performance.

### Developer tools

CodeStar
- unified user-interface for managing software development activities

CodeDeploy
- automates application deployments to AWS compute servicies or on-premise servers

CodeCommit
- AWS managed private Git repos

CodePipeline
- automates continuous deployment (CD) pipelines

CodeBuild
- fully managed continuous integration (CI) service for compiling code, running tests and building deployment packages


### Penetration testing
Prohibited activities

- DNS zone walking via Amazon Route 53 Hosted Zones
- Denial of Service (DoS), Distributed Denial of Service (DDoS), Simulated DoS, Simulated DDoS (These are subject to the DDoS Simulation Testing policy)
- Port flooding
- Protocol flooding
- Request flooding (login request flooding, API request flooding)

Permitted services
- Amazon EC2 instances, NAT Gateways, and Elastic Load Balancers
- Amazon RDS
- Amazon CloudFront
- Amazon Aurora
- Amazon API Gateways
- AWS Fargate
- AWS Lambda and Lambda Edge functions
- Amazon Lightsail resources
- Amazon Elastic Beanstalk environments


AWS Storage Gateway
- provides access to cloud storage for on-premises applications

### Container services
AWS Fargate 
- serverless compute used with container services like EKS and ECS

| AWS Container services           | Purpose                                                          |
| -------------------------------- | ---------------------------------------------------------------- |
| Elastic Container Service (ECS)  | Run containerized applications or build microservices            |
| Elastic Kubernetes Service (EKS) | Manage containers with Kubernetes                                |
| Elastic Container Registry (ECR) | Share and deploy container software, publicly or privately       |
| Fargate                          | Run containers without managing servers                          |
| Lightsail                        | Run simple containerized applications for a fixed, monthly price |

### Miscellaneous services

OpsWorks - provides AWS managed Chef and Puppet instances
Quicksight - BI tool for creating BI dashboards
Athena - serverless SQL query service for data analysis in S3
Glue - serverless data integration service (Amazon's ETL tool)
SQS - Simple Queue Service is a managed messaging queue service that helps you decouple and scale microservices, distributed systems and serverless apps.


### Saving Plans
- Savings Plans offer a flexible pricing model that provides savings on AWS usage. You can save up to 72% on your AWS compute workloads (EC2, Lambda, Fargate)
- Using No Upfront, Partial Upfront and Full Upfront plans.


### CloudFront vs Global Accelerator

Global Accelerator uses static IP addresses
Global Accelerator is a networking service which helps to improve your application performance and availability by routing traffic to optimal regional endpoints based on health, client location and policies that you configure.
Endpoints can be Network Load Balancers, Application Load Balancers, EC2 instances or Elastic IP addresses located in AWS Regions. 


### Security 

Amazon GuardDuty 
  - monitors your AWS accounts, workloads and data in S3 and detects threats. 
  - GuardDuty analyzes continuous metadata streams generated from your account and network activity found in AWS CloudTrail Events, Amazon Virtual Private Cloud (VPC) Flow Logs, and domain name system (DNS) Logs.
  - GuardDuty also uses integrated threat intelligence such as known malicious IP addresses, anomaly detection, and machine learning (ML) to more accurately identify threats.
Amazon Macie - discovers, monitors and protects sensitive data in AWS using machine learning and pattern matching 
AWS Security Hub - aggregates alerts from GuardDuty, Inspector, Macie
Amazon Inspector - continually scans compute workloads for software vulnerabilities and unintended network exposure
Amazon Detective - collates log data from AWS resources and finds the root cause of threats.

AWS Config - let's you audit your AWS resource configurations and configuration changes

AWS Cognito 
- supports web-identity federation - let's authenticated users access AWS resources through a temporary authentication code that provides temporary access. 

AWS WAF
- AWS WAF is a web application firewall that lets you monitor the HTTP(S) requests that are forwarded to an Amazon CloudFront distribution, an Amazon API Gateway REST API, an Application Load Balancer, or an AWS AppSync GraphQL API.

AWS Firewall Manager 
- Centrally manage and configure firewall rules across accounts and applications in AWS Organisations.
- Enable WAF, Network Firewall, VPC security groups, Route 53 Resolver DNS Firewall, Shield Advanced protection from a single place.

### AWS KMS 

Customer Master Keys are the top level keys used to encrypt your data keys.
Data keys are keys used to encrypt your data at rest.

Customer Master Keys can either be managed by AWS or by the customer

AWS Managed CMK vs Customer Managed CMK

- AWS Managed Custom Master Keys (CMK) are rotated automatically once every 3 years, there is no option to rotate them manually
- Customer Managed CMKs can be rotated manually or automatically once a year.
- Customer Managed CMKs can be given any name whereas AWS Managed CMKs are identified by "aws/servicename"
- AWS Managed CMKs cannot be deleted; Customer Managed ones can be deleted/enabled/disabled
- AWS Managed CMKs cannot be baked into custom roles; Customer Managed ones can be baked into custom roles



AWS Outposts
- facilitates the running of AWS services and infrastructure on-premises

AWS Well-Architected Tool
- provides advice on cloud architectures
- lets you review your cloud architecture against best practices

AWS Management Console
- Web-based user interface for accessing and managing your AWS services

AWS Compute Optimizer
- uses machine learning to analyse your compute workloads to provide cost and performance recommendations
- helps you choose optimal configurations for EC2 instances, EBS volumes and Lambda functions based on your utilisation data.

AWS Professional Services
- global team of experts to help you execute enterprise cloud computing initiatives

AWS Service Catalog
- create and deploy portfolios of products within AWS infrastructure that make it easier for users to perform quick deployments
- each product is launched as an AWS CloudFormation Stack
- use AWS IAM permissions to control who can view, modify your products and portfolios



### AWS Elastic Beanstalk vs AWS Lightsail

- lightsail is better for simpler business applications
- beanstalk is better if you need flexible configuration options
- lightsail is better if you have preconfigured applications

### Disaster recovery options

1. Multi-site
2. Warm standby
3. Pilot light
4. Backup & restore

From top to bottom with decreasing cost and complexity

### AWS Secrets Manager vs AWS Systems Manager Parameter Store

- Secrets Manager is a paid service
- Systems Manager Parameter Store is free

Systems Manager Parameter Store lets you store configuration data and secrets securely in a plain or encrypted format in the Parameter Store and can be referred by application code. 

Encryption for data stored in Parameter Store and Secrets Manager is provided by AWS KMS.

### Cloud-Architecture

Loose coupling helps isolate behavior of a component from other components that depend on it, increasing resiliency and agility. A change or a failure in one of the components should not affect the other components.

When you design for agility, you can provision resources more quickly. Agility is not related to the number of Availability Zones.

Elasticity is the ability to activate resources as you need them and return resources when you no longer need them.

 AWS recommends that you distribute workloads across multiple Availability Zones. This distribution will ensure continuous availability of your application, even if the application is unavailable in one single Availability Zone


IAM
 With IAM, you can manage access to AWS services and resources securely.

Trusted Advisor
 You can use Trusted Advisor for real-time guidance to help you provision your resources according to AWS best practices.   

Trusted Advisor checks for S3 bucket permissions in Amazon S3 with open access permissions. Bucket permissions that grant list access to everyone can result in higher than expected charges if objects in the bucket are listed by unintended users at a high frequency. Bucket permissions that grant upload and delete access to all users create potential security vulnerabilities by allowing anyone to add, modify, or remove items in a bucket. This Trusted Advisor check examines explicit bucket permissions and associated bucket policies that might override the bucket permissions.

AWS Config
 You can use AWS Config to assess, audit, and evaluate the configurations of your AWS resources.

AWS CloudWatch
 CloudWatch monitors your AWS resources and the applications that you run on AWS in real time.

IAM roles are temporary credentials that expire. IAM roles are more secure than long-term access keys because they reduce risk if credentials are accidentally exposed.

### Data replication across AWS Regions
Amazon S3 supports Cross-Region Replication. With Cross-Region Replication, you designate a destination S3 bucket in another Region. When Cross-Region Replication is turned on, any new object that is uploaded will be replicated to the destination S3 bucket

You can use Amazon RDS to host relational databases on AWS. One RDS DB instance resides in a single Region. With Amazon RDS, you can create read replicas across Regions. Amazon RDS replicates any data from the primary DB instance to the read replica across Regions.


### AWS CloudFront
CloudFront is a web service that speeds up the distribution of your static and dynamic web content, such as .html, .css, .js, and image files, to your users. Content is cached in edge locations. Content that is repeatedly accessed can be served from the edge locations instead of the source S3 bucket.


### AWS Managed Services

AMS helps you to operate your AWS infrastructure more efficiently and securely. By using AWS services and a growing library of automations, configurations, and run books, AMS can augment and optimize your operational capabilities in both new and existing AWS environments.