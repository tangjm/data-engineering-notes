# Starter deployment

We need a Kubernetes cluster running first.

First we deploy `exampleDeployment.yaml` using

```bash
kubectl apply -f exampleDeployment.yaml
```

Check the deployment

```bash
kubectl get deploy
```

Check pods

```bash
kubectl get pods
```

Enable a public endpoint using `kubectl expose`

The system assigns a port to the service and all the nodes in the cluster send traffic to this service port.

```bash
kubectl expose deployment hello-kubernetes --type=NodePort --port=80 --target-port=8080 --name=hello-kubernetes
```

Gets the public IP of your cluster

```bash
kubectl get node -o wide
```

Obtain the exposed port by traversing the JSON and extracting the value of the `nodePort` field.

```bash
kubectl get service hello-kubernetes -o jsonpath="{.spec.ports[0].nodePort}{'\n'}"
```

Access the application using curl or a web browser

```bash
curl <cluster_ip_address>:<exposed_port>
```

http://<cluster_ip_address>:<exposed_port>/

### ReplicaSets (AWS Autoscaling Group for Pods)

Manages your pods, ensuring the right number are running at any time.

A ReplicaSet is created when you create a Deployment.

To manually create a ReplicaSet, create a YAML file with the key, value pair `type: ReplicaSet` and specify the number of replicas with `replicas: 1`.

To view existing ReplicaSets, run

```bash
kubectl get replicaset
kubectl get rs
```

Scaling replicas manually with [kubectl scale](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#scale)

```bash
kubectl scale deploy deployment-name --replicas=desired-number-of-replicas
```

Delete pods manually

```bash
kubectl delete pod pod-name
```

### Horizontal Pod Autoscaler

Horizontal Pod Autoscaler (HPA) enables applications to increase the number of pods based on traffic by updating the `replicas` field through either the ReplicaSet or the Deployment.

[kubectl autoscale](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#autoscale)

Example

```bash
kubectl autoscale deploy deployment-name --min=2 --max=5 --cpu-percent=10
```

"Cpu-percent" is the trigger to create new pods. This tells the system, “If the CPU usage hits 10% across the cluster, create a new pod.” You are using a very small number here because you don’t really have a CPU intensive application.

To see information about the Horizontal Pod Autoscaler created behind the scenes, run

```bash
kubectl get hpa
```

### Manual autoscaling (Not recommended)

Create a YAML file describing an object with `kind: HorizontalPodAutoscaler` and appropriate fields including optional `minReplicas` and `maxReplicas` and a reference to the Deployment that this HPA will scale.

```yaml
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: hello-kubernetes
  namespace: default
spec:
  maxReplicas: 5
  minReplicas: 2
  scaledTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: hello-kubernetes
    targetCPUUtilizationPercentage: 10
```
