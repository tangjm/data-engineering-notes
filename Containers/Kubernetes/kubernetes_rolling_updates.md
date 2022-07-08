# Rolling updates

They are a way to roll out app changes across your pods in an automatic and controlled manner.

They let you rollback changes if something goes wrong with an update.

Add a rolling update

1. Add liveliness and readiness probes
2. Add a Rolling Update Strategy to your Deployment object's YAML file

`maxUnavailable` specifies how many pods must stay running while the updates are rolled out. If it's a percentage, then that percentage is relative to the `replicas` property.

`maxSurge` specifies how many pods you can run in excess of the `replicas` value while the updates are rolled out.

n.b. Updates are rolled out on a pod by pod basis.

In the following Deployment, we specify that at least 5 and at most 12 pods must be running while updates are rolled out.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-test
spec:
  replicas: 10
  selector:
    matchLabels:
      service: http-server
  minReadySeconds: 5
  progressDeadlineSeconds: 600
  strategy:    # Rolling updates
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 50%
      maxSurge: 2
```


### Making a rolling update

1. Update our image with latest source file changes

Change source files
Rebuild image from Dockerfile
Push new image to Docker Hub (or any other container registry)


(https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#-em-image-em-)

Show deployments

```bash
k get deployments
```

Update your deployment's container image

```bash
k set image deployments/YOUR-DEPLOYMENT-NAME CONTAINER-NAME=CONTAINER-IMAGE-NAME
```

Check status of update rollout

```bash
k rollout status deployments/YOUR-DEPLOYMENT-NAME
```

The container image used in running Pods should be updated

```bash
k describe pods
```

### Roll back an update

```bash
k rollout undo deployements/YOUR-DEPLOYMENT-NAME
```

Check Pod status

```bash
k get pods
```