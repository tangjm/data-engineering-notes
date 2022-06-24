---
export_on_save:
  html: true
---
# Setting up PostgreSQL

### Connecting to the server and creating a database

The `pg_hba.conf` file lets you configure client connection settings.

Commands for creating and dropping databases:
```cmd
createdb <db_name>
dropdb <db_name>
```

`createdb -U <role> <db_name>`
lets you create a database called <db_name> in your capacity as `<role>`

The default superuser is called `postgres`

If `-U <role>` isn't provided, then the user defaults to the local user account name.

### Using the psql shell

After starting psql, some SQL queries may return the following error:

```
'more' is not recognized as an internal or external command,
operable program or batch file.
```

We can fix this error by running the command:

```
\pset pager off
```

This overrides the default setting which restricts outputs from commands to the size of a page.

To get help, run
```
\h
```

To get a list of internal commands, run
```
\?
```

To quit psql, run
```
\q
```


