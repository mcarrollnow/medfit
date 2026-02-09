---
library: supabase
url: https://supabase.com/docs/guides/database/replication
title: Replication and change data capture | Supabase Docs
scraped: 2025-10-23T16:59:02.333Z
---

Database

# Replication and change data capture

* * *

Replication is the process of copying changes from your database to another location. It's also referred to as change data capture (CDC): capturing all the changes that occur to your data.

## Use cases [\#](https://supabase.com/docs/guides/database/replication\#use-cases)

You might use replication for:

- **Analytics and Data Warehousing**: Replicate your operational database to analytics platforms like BigQuery for complex analysis without impacting your application's performance.
- **Data Integration**: Keep your data synchronized across different systems and services in your tech stack.
- **Backup and Disaster Recovery**: Maintain up-to-date copies of your data in different locations.
- **Read Scaling**: Distribute read operations across multiple database instances to improve performance.

## Replication in Postgres [\#](https://supabase.com/docs/guides/database/replication\#replication-in-postgres)

Postgres comes with built-in support for replication via publications and replication slots. Refer to the [Concepts and terms](https://supabase.com/docs/guides/database/replication#concepts-and-terms) section to learn how replication works.

## Setting up and monitoring replication in Supabase [\#](https://supabase.com/docs/guides/database/replication\#setting-up-and-monitoring-replication-in-supabase)

- [Setting up replication](https://supabase.com/docs/guides/database/replication/setting-up-replication)
- [Monitoring replication](https://supabase.com/docs/guides/database/replication/monitoring-replication)

If you want to set up a read replica, see [Read Replicas](https://supabase.com/docs/guides/platform/read-replicas) instead. If you want to sync your data in real time to a client such as a browser or mobile app, see [Realtime](https://supabase.com/docs/guides/realtime) instead. For configuring replication to an ETL destination, use the [Dashboard](https://supabase.com/dashboard/project/_/database/replication).

## Concepts and terms [\#](https://supabase.com/docs/guides/database/replication\#concepts-and-terms)

### Write-Ahead Log (WAL) [\#](https://supabase.com/docs/guides/database/replication\#write-ahead-log-wal)

Postgres uses a system called the Write-Ahead Log (WAL) to manage changes to the database. As you make changes, they are appended to the WAL (which is a series of files (also called "segments"), where the file size can be specified). Once one segment is full, Postgres will start appending to a new segment. After a period of time, a checkpoint occurs and Postgres synchronizes the WAL with your database. Once the checkpoint is complete, then the WAL files can be removed from disk and free up space.

### Logical replication and WAL [\#](https://supabase.com/docs/guides/database/replication\#logical-replication-and-wal)

Logical replication is a method of replication where Postgres uses the WAL files and transmit those changes to another Postgres database, or a system that supports reading WAL files.

### LSN [\#](https://supabase.com/docs/guides/database/replication\#lsn)

LSN is a Log Sequence Number that is used to identify the position of a WAL file in the WAL directory. It is often used to determine the progress of replication in subscribers and calculate the lag of a replication slot.

## Logical replication architecture [\#](https://supabase.com/docs/guides/database/replication\#logical-replication-architecture)

When setting up logical replication, three key components are involved:

- `publication` \- A set of tables on your primary database that will be `published`
- `replication slot` \- A slot used for replicating the data from a single publication. The slot, when created, will specify the output format of the changes
- `subscription` \- A subscription is created from an external system (i.e. another Postgres database) and must specify the name of the `publication`. If you do not specify a replication slot, one is automatically created

## Logical replication output format [\#](https://supabase.com/docs/guides/database/replication\#logical-replication-output-format)

Logical replication is typically output in 2 forms, `pgoutput` and `wal2json`. The output method is how Postgres sends changes to any active replication slot.

## Logical replication configuration [\#](https://supabase.com/docs/guides/database/replication\#logical-replication-configuration)

When using logical replication, Postgres is then configured to keep WAL files around for longer than it needs them. If the files are removed too quickly, then your `replication slot` will become inactive and, if the database receives a large number of changes in a short time, then the `replication slot` can become lost as it was not able to keep up.

In order to mitigate this, Postgres has many options and settings that can be [tweaked](https://supabase.com/docs/guides/database/custom-postgres-config) to manage the WAL usage effectively. Not all of these settings are user configurable as they can impact the stability of your database. For those that are, these should be considered as advanced configuration and not changed without understanding that they can cause additional disk space and resources to be used, as well as incur additional costs.

| Setting | Description | User-facing | Default |
| --- | --- | --- | --- |
| [`max_replication_slots`](https://postgresqlco.nf/doc/en/param/max_replication_slots/) | Max count of replication slots allowed | No |  |
| [`wal_keep_size`](https://postgresqlco.nf/doc/en/param/wal_keep_size/) | Minimum size of WAL files to keep for replication | No |  |
| [`max_slot_wal_keep_size`](https://postgresqlco.nf/doc/en/param/max_slot_wal_keep_size/) | Max WAL size that can be reserved by replication slots | No |  |
| [`checkpoint_timeout`](https://postgresqlco.nf/doc/en/param/checkpoint_timeout/) | Max time between WAL checkpoints | No |  |

### Is this helpful?

NoYes

### On this page

[Use cases](https://supabase.com/docs/guides/database/replication#use-cases) [Replication in Postgres](https://supabase.com/docs/guides/database/replication#replication-in-postgres) [Setting up and monitoring replication in Supabase](https://supabase.com/docs/guides/database/replication#setting-up-and-monitoring-replication-in-supabase) [Concepts and terms](https://supabase.com/docs/guides/database/replication#concepts-and-terms) [Write-Ahead Log (WAL)](https://supabase.com/docs/guides/database/replication#write-ahead-log-wal) [Logical replication and WAL](https://supabase.com/docs/guides/database/replication#logical-replication-and-wal) [LSN](https://supabase.com/docs/guides/database/replication#lsn) [Logical replication architecture](https://supabase.com/docs/guides/database/replication#logical-replication-architecture) [Logical replication output format](https://supabase.com/docs/guides/database/replication#logical-replication-output-format) [Logical replication configuration](https://supabase.com/docs/guides/database/replication#logical-replication-configuration)
