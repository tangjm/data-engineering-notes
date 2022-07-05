# Jenkins Pipelines

[Pipeline concepts](https://www.jenkins.io/doc/book/pipeline/)

[Pipeline syntax](https://www.jenkins.io/doc/book/pipeline/syntax/#agent)

Write declarative continuous integration/deployment pipelines as code.

Create a file called `Jenkinsfile` 

The `pipeline` block contains all content and instructions for executing the entire pipeline.

The `agent` block allocates an executor on a node and a workspace for the entire pipeline. It defines the pipeline's execution environment. 

A `node` is a machine in the Jenkins environment that can execute a pipeline.

The `stages` section let's you setup different stages to your pipeline, such as testing, build stages as well as deployment and preprod and production.

The `input` command let's you pause the pipeline and require human input before continuing to the next stage of the pipeline.

The `environment` section let's you set global environment variables.

In `post` section, you can configure what to do after going through the `stages` section of the pipline. You can perform actions based on how the `stages` section went. Notifications can be sent in this part of the pipeline.

```groovy
pipeline {
    agent any

    environment {
      DISABLE_AUTH = 'true'
      DB_ENGINE    = 'sqlite'
    }

    stages {
      stage('Build') {
        steps {
          sh './gradlew build'
        }
      }

      stage('Test') {
        steps {
            sh 'echo "Fail!"; exit 1'
        }
      }

      stage('Deploy - Staging') {
        steps {
            sh './deploy staging'
            sh './run-smoke-tests'
        }
      }

      stage('Sanity check') {
        steps {
            input "Does the staging environment look ok?"
        }
      }

      stage('Deploy - Production') {
        steps {
            sh './deploy production'
        }
      }
    }

    post {
        always {
            echo 'This will always run'
        }
        success {
            echo 'This will run only if successful'
        }
        failure {
            echo 'This will run only if failed'
            mail to: 'team@example.com',
                 subject: "Failed Pipeline: ${currentBuild.fullDisplayName}",
                 body: "Something is wrong with ${env.BUILD_URL}"
        }
        unstable {
            echo 'This will run only if the run was marked as unstable'
        }
        changed {
            echo 'This will run only if the state of the Pipeline has changed'
            echo 'For example, if the Pipeline was previously failing but is now successful'
        }
    }
}
```

### Creating a Jenkinsfile

[Defining a pipeline in SCM](https://www.jenkins.io/doc/book/pipeline/getting-started/#defining-a-pipeline-in-scm)

1. Define a Jenkinsfile
2. Commit the Jenkinsfile into source control

