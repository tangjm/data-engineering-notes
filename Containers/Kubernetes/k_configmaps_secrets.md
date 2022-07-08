# ConfigMaps and Secrets

ConfigMaps and Secrets let you decouple your configuration variables from your deployments, letting you reuse them across multiple deployments.

As the name suggests, ConfigMaps are hashmaps that map configuration variables to their values.

There are three ways of creating ConfigMaps.

1. Using string literals
2. Using existing key, value files
3. Providing a ConfigMap YAML descriptor file.

Add configuration variables to the `env` section.

### Hard-coded environment variables

Here we hard code the `MESSAGE` variable with the `name`, `value` pair.

```yaml
# other object properties
env:
  - name: MESSAGE
    value: "value"
```

### Using string literals

Run the `kubectl create configmap` command. This creates a ConfigMap called `my-config` with key `MESSAGE` set to value `hello`.

```bash
k create configmap my-config --from-literal=MESSAGE="hello"
```

Update `deployment.yaml`. We use a ConfigMap together with a key in that ConfigMap.

`configMapKeyRef` is just a referencce to a ConfigMap denoted by `name` plus a key of that hashmap denoted by `key`.

The value can then be obtained by looking up the `key` in `name`.

```yaml
# rest of the Deployment object properties
env:
  - name: MESSAGE
    valueFrom:
      configMapKeyRef:
        name: my-config
        key: MESSAGE
```

### Using ConfigMap Properties file

Create a file with extension `.properties` to contain your configuration variables in `key=value` format.

If you're familiar with the 'dotenv' package for NodeJS, `.properties` has the same structure as `.env` files.

A ConfigMap Properties file called `my.properties` with two variables.

```bash
# my.properties file
MESSAGE=value
ANOTHER_VARIABLE=another value
YET_ANOTHER_VARIABLE=yet another value
```

Create a ConfigMap out of a `.properties` file called `my.properties`

```bash
k create cm my-config --from-file=my.properties
```

Create a ConfigMap with a `.properties` file loaded to a specific key called `KEY`

```bash
k create cm my-config --from-file=KEY=my.properties
```

Create a ConfigMap from many `.properties` files within a directory called `configfiles/`. All configuration variables in `configfiles/*.properties` will be loaded to the `my-config` ConfigMap. [^1]

```bash
k create cm my-config --from-file=configfiles
```

Now, because `my.properties` is a file that can contain more than one configuration variable, we access variables in `my.properties` by chaining them to the `name`, which in this case is `MESSAGE`. So we would have `MESSAGE.MESSAGE` or `MESSAGE.ANOTHER_MESSAGE`.

n.b. The variable `MESSAGE` in `name: MESSAGE` doesn't contain a value but a collection of key, value pairs. Think of `my.properties` in `key: my.properties` as a collection of key, value pairs.

```yaml
# rest of the Deployment object properties
env:
  - name: MESSAGE
    valueFrom:
      configMapKeyRef:
        name: my-config
        key: my.properties
```

If we had ran the following

```bash
k create cm my-config --from-file=KEY=my.properties
```

Then we would access our loaded config variables using `MESSAGE.KEY.MESSAGE` and `MESSAGE.KEY.ANOTHER_MESSAGE`. In this case, `my.properties` would be a named collection of key, value pairs called `KEY`.

### Using ConfigMap YAML descriptor files

Just like with objects like Deployments and ReplicaSets, we can create a ConfigMap object with a YAML file.

```yaml
# my-config.yaml file
apiVersion: v1
data:
  my.properties: MESSAGE=hello
kind: ConfigMap
metadata:
  name: my-config
  namespace: default
```

Then create the ConfigMap

```bash
k apply -f my-config.yaml
```

### View ConfigMaps

Show all ConfigMaps

```bash
k get configmaps
```

Show details of a specific ConfigMap

```bash
k describe configmap <name-of-configmap>
```

### Secrets

### Using string literals

This is similar to creating ConfigMaps using string literals

```bash
k create secret generic secret-name --from-literal=key=AKCAQEAwEqa9
```

One difference is that you cannot view your secret.

```bash
k get secrets
```

```bash
k describe secret secret-name
```

You can view your secret if you output it as YAML

```bash
k get secret secret-name -o yaml
```

Add your secret as an environment variable to a Deployment

```yaml
# Rest of the deployment's properties
env:
  - name: MY_SECRET # Determine how you want to refer to your secret
    valueFrom:
      secretKeyRef:
        name: secret-name
        key: key
```

### Load secrets with volume mounts

1. Create your secret

```bash
k create secret generic secret-name --from-literal=key=AKCAQEAwEqa9
```

2. Mount your secret as a file at path `/etc/api`

A volume and a volume mount is needed for your secret.
Your app running in the container will then read the file at path `/etc/api/my-secret` to extract your secret.

```yaml
spec:
  containers:
    - name: hello-kubernetes
      image: tangjm5/myapp:v2
      ports:
        - containerPort: 8000
      volumeMounts:
        - name: my-secret
          mountPath: "/etc/api"
          readOnly: true
  volumes:
    -name: my-secret
    secret:
      secretName: my-secret
```

[^1]: `configfiles/*.properties` denotes all files in directory `configfiles/` with extension `.properties`.
