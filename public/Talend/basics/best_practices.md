---
export_on_save:
  html: true
---

### Naming conventions

Keep component names but add a descriptive name

#### Context variables 

With jobs exported to the Talend Cloud, prefix context variables with "parameter_"
Prefix talend Jobs with "jb_" and talend joblets with "jl_"
Include a three digit number to organise your jobs and joblets - "000", "001", "002"

Context groups - `ctx_nameOfContextGroup`

Database connection variables - `connection_nameOfConnection_parameterName`

Example of a job name: `jb_010_readSalesData`

