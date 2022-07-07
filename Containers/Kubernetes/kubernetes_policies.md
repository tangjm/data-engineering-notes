# Basic Policies

**Problem 1**

Because containers run with unbounded compute resources in Kubernetes clusters, we might want to control how much resources they consume.

**Response 1**
One way of doing is using ResourceQuotas, which let us define upper limits on our resources per namespace.

The Compute Resource Quota let's us limit compute resources (CPU cores and memory)

The Storage Resource Quota puts limits on storage resources and the consumption of storage resources based on associated storage class.

The Object Count Quota let's us limit the number of objects created.

In actuality, these quotas apply to individual containers. But to make it easier to reason about quotas, we take them to apply to pods within a namespace.

The resources that a Pod consumes/creates is just the sum-total resources consumed/created by its constituent containers. 

**Problem 2**
While ResourceQuotas do let us control resource usage by pods at the namespace level, we still have no control within a namespace. A single pod within a namespace can still consume all the CPU and memory allocated to that namespace.

**Response 2**
To resolve this problem, we need a LimitRange, which is another object that let's us enforce resource allocations per pod/resource within a namespace.

1. min/max compute per pod
2. min/max storage request per PersistentVolumeClaim
3. ratio of request and limit for a resource
   - e.g. 1:2
4. set default request/limit for compute resources






