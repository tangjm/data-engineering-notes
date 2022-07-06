# Kubernetes CLI

Kubectl helps you work with Kubernetes clusters and to manage the workloads running in a cluster.

It let's you communicate with the Kubernetes Control Plane of your cluster through the Kubernetes API.

### Declarative vs Imperative commands
### Imperative commands

```bash
kubectl run nginx --image nginx
```

`kubectl run` command doesn't provide an audit trail, has limited options

Imperative object configuration can help to make sure different developers are running the same commands.

```bash
kubectl create -f nginx.yaml
```

Here, we pass a file containing a configuration template as an argument, making the command more repeatable. Different developers can refer to the same configuration file when executing kubectl commands to ensure they are on the same page.

Using a shared configuration file is a little like using a shared source control file containg a history of changes.

### Declarative commands (preferred for production systems)

Describe the desired state in a shared configuration file, then let Kubernetes figure out which commands to run to realise the desired state.

Configuration files contain configurations for objects. Then the developer just needs to run the `kubectl apply` command to apply the contents of the configuration file.

```bash
kubectl apply -f nginx/
```

This applies all configuration files within the `nginx/` directory. Kubernetes will then make the necessary changes to the cluster to bring its actual state in line with that described by the files in `ngix/`

**Kubectl apply**

`apply` manages applications through files defining Kubernetes resources. It creates and updates resources in a cluster through running `kubectl apply`. This is the recommended way of managing Kubernetes applications on production. 

### Common commands

[kubectl cheatsheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

```bash
kubectl action resource   # Schema for kubectl commands

kubectl version           # Shows installed version
kubectl cluster-info      # Shows addresses of the Kubernetes Master Node and services
kubectl get nodes         # Shows available Nodes
kubectl create deployment # Creates a named deployment
kubectl get deployments   # Shows existing deployments

kubectl get       # list resources
kubectl describe  # show detailed information about a resource
kubectl logs      # print the logs from a container in a pod
kubectl exec      # execute a command on a container in a pod
```

### Installation

[Debian based linux](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/#install-using-native-package-management)