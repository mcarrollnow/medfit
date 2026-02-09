---
library: supabase
url: https://supabase.com/docs/guides/database/custom-postgres-config
title: Customizing Postgres configs | Supabase Docs
scraped: 2025-10-23T16:59:02.314Z
---

Database

# Customizing Postgres configs

* * *

Each Supabase project is a pre-configured Postgres cluster. You can override some configuration settings to suit your needs. This is an advanced topic, and we don't recommend touching these settings unless it is necessary.

Customizing Postgres configurations provides _advanced_ control over your database, but inappropriate settings can lead to severe performance degradation or project instability.

### Viewing settings [\#](https://supabase.com/docs/guides/database/custom-postgres-config\#viewing-settings)

To list all Postgres settings and their descriptions, run:

```flex

```

## Configurable settings [\#](https://supabase.com/docs/guides/database/custom-postgres-config\#configurable-settings)

### User-context settings [\#](https://supabase.com/docs/guides/database/custom-postgres-config\#user-context-settings)

The [`pg_settings`](https://www.postgresql.org/docs/current/view-pg-settings.html) table's `context` column specifies the requirements for changing a setting. By default, those with a `user` context can be changed at the `role` or `database` level with [SQL](https://supabase.com/dashboard/project/_/sql/).

To list all user-context settings, run:

```flex

```

As an example, the `statement_timeout` setting can be altered:

```flex

```

To verify the change, execute:

```flex

```

### Superuser settings [\#](https://supabase.com/docs/guides/database/custom-postgres-config\#superuser-settings)

Some settings can only be modified by a superuser. Supabase pre-enables the [`supautils` extension](https://supabase.com/blog/roles-postgres-hooks#setting-up-the-supautils-extension), which allows the `postgres` role to retain certain superuser privileges. It enables modification of the below reserved configurations at the `role` level:

| Setting | Description |
| --- | --- |
| `auto_explain.*` | Configures the [auto\_explain module](https://www.postgresql.org/docs/current/auto-explain.html). Can be configured to log execution plans for queries expected to exceed x seconds, including function queries. |
| `log_lock_waits` | Controls whether a log message is produced when a session waits longer than [deadlock\_timeout](https://www.postgresql.org/docs/current/runtime-config-locks.html#GUC-DEADLOCK-TIMEOUT) to acquire a lock. |
| `log_min_duration_statement` | Causes the duration of each completed statement to be logged if the statement ran for at least the specified amount of time. |
| `log_min_messages` | Minimum severity level of messages to log. |
| `log_replication_commands` | Logs all replication commands |
| `log_statement` | Controls which SQL statements are logged. Valid values are `none` (off), `ddl`, `mod`, and `all` (all statements). |
| `log_temp_files` | Controls logging of temporary file names and sizes. |
| `pg_net.ttl` | Sets how long the [pg\_net extension](https://supabase.com/docs/guides/database/extensions/pg_net) saves responses |
| `pg_net.batch_size` | Sets how many requests the [pg\_net extension](https://supabase.com/docs/guides/database/extensions/pg_net) can make per second |
| `pg_stat_statements.*` | Configures the [pg\_stat\_statements extension](https://www.postgresql.org/docs/current/pgstatstatements.html). |
| `pgaudit.*` | Configures the [PGAudit extension](https://supabase.com/docs/guides/database/extensions/pgaudit). The `log_parameter` is still restricted to protect secrets |
| `pgrst.*` | [`PostgREST` settings](https://docs.postgrest.org/en/stable/references/configuration.html#db-aggregates-enabled) |
| `plan_filter.*` | Configures the [pg\_plan\_filter extension](https://supabase.com/docs/guides/database/extensions/pg_plan_filter) |
| `session_replication_role` | Sets the session's behavior for triggers and rewrite rules. |
| `track_io_timing` | Collects timing statistics for database I/O activity. |
| `wal_compression` | This parameter enables compression of WAL using the specified compression method. |

For example, to enable `log_nested_statements` for the `postgres` role, execute:

```flex

```

To view the change:

```flex

```

### CLI configurable settings [\#](https://supabase.com/docs/guides/database/custom-postgres-config\#cli-configurable-settings)

While many Postgres parameters are configurable directly, some configurations can be changed with the Supabase CLI at the [`system`](https://www.postgresql.org/docs/current/config-setting.html#CONFIG-SETTING-SQL) level.

CLI changes permanently overwrite default settings, so `reset all` and `set to default` commands won't revert to the original values.

In order to overwrite the default settings, you must have `Owner` or `Administrator` privileges within your organizations.

#### CLI supported parameters [\#](https://supabase.com/docs/guides/database/custom-postgres-config\#cli-supported-parameters)

If a setting you need is not yet configurable, [share your use case with us](https://supabase.com/dashboard/support/new)! Let us know what setting you'd like to control, and we'll consider adding support in future updates.

The following parameters are available for overrides:

01. [effective\_cache\_size](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-EFFECTIVE-CACHE-SIZE)
02. [logical\_decoding\_work\_mem](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-LOGICAL-DECODING-WORK-MEM) (CLI only)
03. [maintenance\_work\_mem](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAINTENANCE-WORK-MEM)
04. [max\_connections](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-MAX-CONNECTIONS) (CLI only)
05. [max\_locks\_per\_transaction](https://www.postgresql.org/docs/current/runtime-config-locks.html#GUC-MAX-LOCKS-PER-TRANSACTION) (CLI only)
06. [max\_parallel\_maintenance\_workers](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAX-PARALLEL-MAINTENANCE-WORKERS)
07. [max\_parallel\_workers\_per\_gather](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAX-PARALLEL-WORKERS-PER-GATHER)
08. [max\_parallel\_workers](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAX-PARALLEL-WORKERS)
09. [max\_replication\_slots](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-REPLICATION-SLOTS) (CLI only)
10. [max\_slot\_wal\_keep\_size](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-SLOT-WAL-KEEP-SIZE) (CLI only)
11. [max\_standby\_archive\_delay](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-STANDBY-ARCHIVE-DELAY) (CLI only)
12. [max\_standby\_streaming\_delay](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-STANDBY-STREAMING-DELAY) (CLI only)
13. [max\_wal\_size](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-MAX-WAL-SIZE) (CLI only)
14. [max\_wal\_senders](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-WAL-SENDERS) (CLI only)
15. [max\_worker\_processes](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAX-WORKER-PROCESSES) (CLI only)
16. [session\_replication\_role](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-SESSION-REPLICATION-ROLE)
17. [shared\_buffers](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-SHARED-BUFFERS) (CLI only)
18. [statement\_timeout](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-STATEMENT-TIMEOUT)
19. [track\_activity\_query\_size](https://www.postgresql.org/docs/current/runtime-config-statistics.html#GUC-TRACK-ACTIVITY-QUERY-SIZE)
20. [track\_commit\_timestamp](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-TRACK-COMMIT-TIMESTAMP)
21. [wal\_keep\_size](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-WAL-KEEP-SIZE) (CLI only)
22. [wal\_sender\_timeout](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-WAL-SENDER-TIMEOUT) (CLI only)
23. [work\_mem](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-WORK-MEM)

#### Managing Postgres configuration with the CLI [\#](https://supabase.com/docs/guides/database/custom-postgres-config\#managing-postgres-configuration-with-the-cli)

To start:

1. [Install](https://supabase.com/docs/guides/resources/supabase-cli) Supabase CLI 1.69.0+.
2. [Log in](https://supabase.com/docs/guides/cli/local-development#log-in-to-the-supabase-cli) to your Supabase account using the CLI.

To update Postgres configurations, use the [`postgres config`](https://supabase.com/docs/reference/cli/supabase-postgres-config) command:

```flex

```

By default, the CLI will merge any provided config overrides with any existing ones. The `--replace-existing-overrides` flag can be used to instead force all existing overrides to be replaced with the ones being provided:

```flex

```

To delete specific configuration overrides, use the `postgres-config delete` command:

```flex

```

By default, CLI v2 (≥ 2.0.0) checks the parameter’s context and requests the correct action (reload or restart):

- If the setting can be reloaded ( `pg_settings.context = 'sighup'`), then the Management API will detect this and apply the change with a configuration reload.
- If the setting requires a restart ( `pg_settings.context = 'postmaster'`), then both the primary and any read replicas will restart to apply the change.

To check whether a parameter can be reloaded without a restart, see the [Postgres docs](https://www.postgresql.org/docs/current/runtime-config.html).

You can verify whether changes have been applied with the following checks:

```flex

```

```flex

```

```flex

```

You can also pass the `--no-restart` flag to attempt a reload-only apply. If the parameter cannot be reloaded, the change stays pending until the next restart.

##### Read Replicas and Custom Config

Postgres requires several parameters to be synchronized between the Primary cluster and [Read Replicas](https://supabase.com/docs/guides/platform/read-replicas).

By default, Supabase ensures that this propagation is executed correctly. However, if the `--no-restart` behavior is used in conjunction with parameters that cannot be reloaded without a restart, the user is responsible for ensuring that both the primaries and the read replicas get restarted in a timely manner to ensure a stable running state. Leaving the configuration updated, but not utilized (via a restart) in such a case can result in read replica failure if the primary, or a read replica, restarts in isolation (e.g. due to an out-of-memory event, or hardware failure).

```flex

```

### Resetting to default config [\#](https://supabase.com/docs/guides/database/custom-postgres-config\#resetting-to-default-config)

To reset a setting to its default value at the database level:

```flex

```

For `role` level configurations, you can run:

```flex

```

### Considerations [\#](https://supabase.com/docs/guides/database/custom-postgres-config\#considerations)

1. Changes through the CLI might restart the database causing momentary disruption to existing database connections; in most cases this should not take more than a few seconds. However, you can use the --no-restart flag to bypass the restart and keep the connections intact. Keep in mind that this depends on the specific configuration changes you're making. if the change requires a restart, using the --no-restart flag will prevent the restart but you won't see those changes take effect until a restart is manually triggered. Additionally, some parameters are required to be the same on Primary and Read Replicas; not restarting in these cases can result in read replica failure if the Primary/Read Replicas restart in isolation.
2. Custom Postgres Config will always override the default optimizations generated by Supabase. When changing compute add-ons, you should also review and update your custom Postgres Config to ensure they remain compatible and effective with the updated compute.
3. Some parameters (e.g. `wal_keep_size`) can increase disk utilization, triggering disk expansion, which in turn can lead to [increases in your bill](https://supabase.com/docs/guides/platform/compute-add-ons#disk-io).

### Is this helpful?

NoYes

### On this page

[Viewing settings](https://supabase.com/docs/guides/database/custom-postgres-config#viewing-settings) [Configurable settings](https://supabase.com/docs/guides/database/custom-postgres-config#configurable-settings) [User-context settings](https://supabase.com/docs/guides/database/custom-postgres-config#user-context-settings) [Superuser settings](https://supabase.com/docs/guides/database/custom-postgres-config#superuser-settings) [CLI configurable settings](https://supabase.com/docs/guides/database/custom-postgres-config#cli-configurable-settings) [Resetting to default config](https://supabase.com/docs/guides/database/custom-postgres-config#resetting-to-default-config) [Considerations](https://supabase.com/docs/guides/database/custom-postgres-config#considerations)
