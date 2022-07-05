# Container registries

A container registry is used for the storage and distribution of named container images.

They can be either public or private just like github repos.

They can be hosted by a provider like AWS' ECR (Elastic Container Registry) or self-hosted.


Push and pull commands are used to store and retrieve images from container registries. This is often automated by software like Kubernetes.

Container registries store named images. The `docker build` and `docker tag` commands can be used to name images.

The convention for naming container images is to have three parts:
1. Hostname
    - identifies the registry to which the image is pushed
    - e.g. Docker hub = docker.io
2. Repository
    - group of related container images
    - usually different versions of the same application
    - it's a good idea to include a name that describes the application or service
3. Tag
    - provides information specific to a version or variant of an image
    - usually the version number or operating system
```
hostname/repository:tag
```

Example
```
docker.io/ubuntu:18.04
```