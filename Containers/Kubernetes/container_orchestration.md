# Container orchestration

Container orchestration helps to automate the management of containerised deployments and infrastructure.

It let's us automate processes like container provisioning and deployment.

It also enables auto-scaling and load balancing of containers.

Scheduling and health checks are also automated, which together with auto-scaling and load balancing, ensures that containers are redundant and highly available. 

### Kubernetes (K8s)

The current de facto choice for a container orchestration platform.

- open-source
- container-orchestration platform
- facilities declarative management
  - You can describe what you want without having to write imperative instructions telling Kubernetes to do X, then Y and finally Z. 
- large and growing ecosystem
- widely available 

To draw an analogy, we can think of Kubernetes as an automated AWS EC2 console. You can manage containers in the same way in which you manage your EC2 instances in AWS EC2 through health status checks, launching new instances, stopping and terminating existing instances, and much more.

Kubernetes is flexible with no restrictions on the types of applications that work with it, so long as they can run in a container.

Kubernetes isn't Jenkins; it's not a CI/CD pipeline.

No logging, monitoring or alerting solutions like AWS CloudWatch are included with Kubernetes.

