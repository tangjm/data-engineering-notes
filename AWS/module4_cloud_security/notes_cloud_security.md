# Section 1
### Shared responsibility

AWS is responsible for the security of the cloud infrastructure. This includes the hardware, software, networking, and facilities running the AWS Cloud services

Customers are responsible for data encryption, network security configurations and management of credentials and logins. 

They are also responsible for:
- security group configuration 
- operating system configuration for compute instances

All the infrastructure running AWS Regions, availability zones and edge locations is the responsibility of AWS.

- Physical security of data centres (video surveillance, security guards, 2-factor authentication)
- Hardward infrastructure (servers, storage devices...)
- Software infrastructure (operating systems, virtualisation software)
- Network infrastructure (routers, switches, cabling...)


Customer responsibilities include:
- selecting and securing any instance operating systems
- securing the applications that are launched on AWS resources
- security group configurations
- firewall configurations
- network configurations
- secure account management

Customers are responsible for managing critical content security: 
- What content they choose to store on AWS
- Which AWS services are used with the content
- In what country that content is stored
- The format and structure of that content and whether it is masked, anonymized, or 
encrypted
- Who has access to that content and how those access rights are granted, managed, and 
revoked

#### IaaS, PaaS, SaaS
----decreasing customer responsibility -->
--- increasing AWS responsibility -->

With more flexbility and control over your IT services comes with greater responsibility

**IaaS**
- customer to perform all necessary **security configuration** and **management tasks**
- e.g. Customers who deploy EC2 instances are responsible for managing the guest operating system (including updates and security patches), any application software that is installed on 
the instances, and the configuration of the security groups that were provided by AWS.

**PaaS**
- With PaaS services, customers 
are responsible for managing their data, classifying their assets, and applying the appropriate 
permissions.
- e.g. RDS and Lambda

**SaaS**
- With SaaS, customers do not need to manage the infrastructure that supports the 
service.
- The responsibility is all on AWS

**AWS Trusted Advisor**
- an online tool that analyzes your AWS environment and provides real-time guidance and recommendations to help you provision your resources by following AWS best practices. 
- The Trusted Advisor service is offered as part of your AWS Support plan. Some of the Trusted Advisor features are free to all accounts, but Business Support and Enterprise Support customers have access to the full set of Trusted Advisor checks and recommendations.

**AWS Shield** 
- a managed distributed denial of service (DDoS) protection service that safeguards applications running on AWS. 
- It provides always-on detection and automatic inline mitigations that minimize application downtime and latency, so there is no need to engage AWS Support to benefit from DDoS protection. 
- AWS Shield Advanced is available to all customers. However, to contact the DDoS Response Team, customers must have either 
Enterprise Support or Business Support from AWS Support.

**Amazon Chime**
- amazon's version of teams or zoom
- It is a pay-as-you-go communications service with no upfront fees, commitments, or long-term contracts

# Section 2
### Identity and Access Management

IAM User - person/application that can authenticate with an AWS account

IAM Group - collection of IAM users granted the same authorisation

IAM Policy - document that defines which resources can be accessed and the level of access to each resource

IAM role - mechanism to grant temporary permissions for AWS services for select users

### Authentication

Programmatic access
- access key id
- secret access key
- Access via AWS CLI or AWS SDK
  
AWS Management Console access
- 12-digit Account ID or alias
- IAM username
- IAM password
- Multi-factor authentication

Use an IAM Policy to assign permissions.
Permissions determine which resources and operations are allowed:

By default, all permissions are implicitly defnied
Apply the minimum set of privileges needed to perform some task.

IAM Policies

2 types
1. Identity-based policies
- Attach to IAM entity like user, group or role
- When there is a conflict between an allow and deny access statement, the deny access statement takes precedence
2. Resource-based policies
- Attach to resources


How IAM determines permissions

Step 1. Explictly denied?
- if yes, then deny
- if no, then goto Step 2

Step 2. Explicity allowed?
- if yes, then allow
- if no, then implicitly deny

In short, unless explicitly allowed, permission is denied.

IAM group
- specify permissions for a collection of users
- cannot be nested
- users can belong to more than one group

IAM role
- IAM identity with specific permissions
- Can be assumed by multiple persons, applications, services
- temporary security credentials
  

### AWS Account creation

Root user - the user account that's created when your first signup
Step 1. Stop using the root user

Create an IAM User 
Create an IAM Group with full admin access
Add the IAM User to the IAM Group
Disable or delete root user account access keys
Enable a password policy for users
Sign in with IAM User credentials (This will be your new admin account)
Store root user account credentials securely

Step 2. Enable Multi-factor authentication
Step 3. Enable CLoudTrail
- Tracks all API requests 
Step 4. Enable billing reports (Cost and Usage report)


### Securing accounts with AWS Organisations

- Group accounts into OU (Organisational Units)
- Apply Service Control Policies to OUs

#### Service control policies

- specifies maximum permisisons for organisations

#### KMS (Key Management Service)
- create and manage encryption keys
- integrates with CloudTrail
- Uses hardware security modules

### Cognito
- Add sign-up, sign-in and access control to web and mobile applications

### AWS Shield

- managed distributed DDoS protection service 
- always-on and automatic inline mitigations
- Shield Standard is enabled for free
- Shield Advanced is an optional paid service

### Encryption of data at rest
- Encrypt stored data with secret key
- Use AWS KMS

### Encryption of data in transit
- TLS (transport layer security) - formerly SSL
- AWS Certificate Manager to manage TLS certificates
- HTTPS - bidirectional encryption of TLS
- e.g. EC2 <-TLS-> EFS
- e.g. Storage Gateway <-TLS-> S3

### Securing S3 buckets and objects

S3 buckets and objects are private and protected by default
- Block Public Access is enabled by default 
- Bucket policies
- Access control lists
- Trusted Advisor - to check permissions

### AWS Compliance Programs

Certifications and attestations
e.g. ISO 27001

Laws, regulations and privacy
- security features and legal agreements to support laws like GDPR

AWS Config
- monitors AWS resource configurations
- Simplifies compliance auditing and security analysis
- Compares recorded configurations with configurations rules

AWS Artifact
- provides access to security and compliance reports and online agreements
- Security -> Identify & Compliance -> Artifact
- you can accept agreements on behalf of multiple accounts using AWS Organisations

### IAM Policy structure

 The basic structure of the statements in an IAM Policy is:

Effect says whether to Allow or Deny the permissions.

Action specifies the API calls that can be made against an AWS Service (eg cloudwatch:ListMetrics).

Resource defines the scope of entities covered by the policy rule (eg a specific Amazon S3 bucket or Amazon EC2 instance, or * which means any resource).

Inline Policy, which is a policy assigned to just one User or Group. Inline Policies are typically used to apply permissions for one-off situations.