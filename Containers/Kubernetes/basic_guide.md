### Using Kubernetes

### Step1. Deploy our ReplicaSet

```bash
kubectl apply -f nginx.yaml
```

### Step2. Check our deployments

kube-system namespace holds objects created by the Kubernetes system

```bash
kubectl get deployments --namespace kube-system
```

```bash
kubectl describe deployment deployment-name --namespace namespace
```

