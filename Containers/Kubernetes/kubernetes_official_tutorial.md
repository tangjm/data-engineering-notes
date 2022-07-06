### Deploying containerised applications with K8s

Create a Deployment object with specifications such as the number of replicas/copies and the template/container image of your containerised application.

The configuration of your Deployment object will describe how to create and update instances of your application.

Use kubectl to create and manage Deployments.

### Section 1: Create a Kubernetes cluster
### Section 2: Deploying your containerised app

Create a deployment named `my-deployment` using container image `docker.io/tangjm5/my-app:v1`

```bash
kubectl create deployment <name-of-deployment> --image=<container-image>
```

```bash
kubectl create deployment my-deployment --image=tangjm5/my-app:v1
```

`kubectl create deployment` does three things:

  1. Look for a suitable node on which our container can run
  2. Schedule our container to run on that Node
  3. Configure the cluster to reschedule the instance on a new Node when needed

The API server will automatically create an endpoint for each pod, based on the pod name, that is also accessible through the proxy.

### Section 3: Exploring your app

Recall that Pods are running in an isolated, private network - so we need to proxy access to them so we can debug and interact with them. To do this, we'll use the kubectl proxy command to run a proxy in a second terminal window. 

```bash
echo -e "\n\n\n\e[92mStarting Proxy. After starting it will not output a response. Please click the first Terminal Tab\n"; kubectl proxy
```

Next, we will get the Pod name and query that pod directly through the proxy.

Get the Pod name and store it in the POD_NAME environment variable.
  
```bash
export POD_NAME=$(kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')
echo Name of the Pod: $POD_NAME
```

API endpoint of the pod
Query that pod directly through the proxy.

```bash
curl http://localhost:8001/api/v1/namespaces/default/pods/$POD_NAME/proxy/
```

Anything that the application would normally send to STDOUT becomes logs for the container within the Pod
This shows all the logs

```bash
kubectl logs $POD_NAME
```

Lists environment variables of the container in the pod

```bash
kubectl exec $POD_NAME -- env
```

Starts a bash session in the Pod's container.
No container name is specified if we only have one container

```bash
kubectl exec -ti $POD_NAME -- bash
```

### Section 4: Exposing your app

A Kubernetes Service is an abstraction layer which defines a logical set of Pods and enables external traffic exposure, load balancing and service discovery for those Pods.

This is basically the Kubernetes analogue of AWS Elastic Load Balancer for Pods.

A Service is defined using YAML or JSON. 

Each Pod has a unique IP address. Services help to expose outside the cluster.

```yaml
type: ClusterIP       # The default setting. Exposes the Service internally on an internal IP in the cluster
type: NodePort        # 
type: LoadBalancer    # 
type: ExternalName
```

See [docs](https://kubernetes.io/docs/tutorials/kubernetes-basics/expose/expose-intro/) for what each `type` does.

### Services and Labels

A Service routes traffic across a set of Pods. Services are the abstraction that allows pods to die and replicate in Kubernetes without impacting your application. Discovery and routing among dependent Pods (such as the frontend and backend components in an application) are handled by Kubernetes Services.

