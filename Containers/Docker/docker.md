# Docker

Docker is a software platform for building and running applications as containers. 

### Basic Docker CLI commands

[docker build](https://docs.docker.com/engine/reference/commandline/build/)

Creates a docker image from a blueprint file called a Dockerfile.

Dockerfile -> Docker image

[docker tag](https://docs.docker.com/engine/reference/commandline/tag/)

Renames an existing docker image.

[docker images](https://docs.docker.com/engine/reference/commandline/images/)

Lists images

[docker run](https://docs.docker.com/engine/reference/commandline/run/)

Runs a docker image in a new container

[docker push](https://docs.docker.com/engine/reference/commandline/push/)

Push a docker image to a container registry

[docker pull](https://docs.docker.com/engine/reference/commandline/pull/)

Pull docker images from a remote location (container registry)

### Container runtime

A container runtime is a software that executes containers

Docker is also a container runtime or container engine.


### Dockerfiles, Images and Containers

The Dockerfile is a text file that specifies what goes into an image through listing a set of commands to be called on the commandline. The image is then a blueprint/template/snapshot of a container's contents.

Using an analogy from object-oriented design, the image can be thought of as a class and the container as an instance of the class.

Docker images are immutable/read-only and contain the source code, libraries and dependencies of an application.

A container is a running image created by generating a writable layer over the image, on top of the underlying layers.

### Image layers

Docker uses instructions from a Dockerfile to build an image/container image layer by layer.


### Dockerfile instructions

Dockerfiles begin with a FROM statement. This instruction initializes a new build stage and specifies the base image that subsequent instructions will build upon.

Each instruction adds a new layer on top the existing layers.

The RUN instruction executes commands such as bash commands.

The ENV instruction let's you set environment variables in the image.

ADD and COPY instructions let you add and copy files to your image. You can use this to include your application source code in your image. COPY is restricted to local files/directories; ADD can also be used with remote files/directories.

Only the last CMD instruction takes effect. It provides a default for executing a container. It usually defines the executable that should run in your container.

Example Dockerfile

```docker
# syntax=docker/dockerfile:1
FROM ubuntu:18.04
COPY . /app
RUN make /app
CMD python /app/app.py
```


### Docker Compose

An alternative to Dockerfile using declarative YAML files to specify your container images. Can be used to define and share multi-container applications.

cf. Declarative YAML files in kubectl.

