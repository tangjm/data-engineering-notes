# Designing Data Integration Jobs

In this training module, you create a Job in Talend Studio and apply development best practices to an existing Job.

TASKS:

Create a Job 

Add, connect, and configure components 

Redesign a Job following best practices 
git
### Key terms
Component - a predefined unit of Java code that performs specific operations on data (implementation is hidden)
Job - one or more SubJobs
SubJob - one or more connected components performing a specific task

### Simple ETL job

```mermaid
graph LR
  input(input component) -- process data --> output(output component)
```

Creating a Job

Job Designs -> right click -> create job

Adding a component

1. click in the designer and type in the name of a component
2. drag a component from the palette and place in designer

Linking components

1. rClick first component
2. Select row
3. Select main
4. Select second component to link to 

Row - carry data to the next component
Trigger - transfer proccessing control to the next component or SubJob

Renaming components

1. Select component
2. View tab
3. Label format

Help page
1. Click component
2. F1