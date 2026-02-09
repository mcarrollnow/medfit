---
library: supabase
url: https://supabase.com/docs/guides/cron
title: Cron | Supabase Docs
scraped: 2025-10-23T16:59:02.343Z
---

Cron

# Cron

## Schedule Recurring Jobs with Cron Syntax in Postgres

* * *

Supabase Cron is a Postgres Module that simplifies scheduling recurring Jobs with cron syntax and monitoring Job runs inside Postgres.

Cron Jobs can be created via SQL or the [Integrations -> Cron](https://supabase.com/dashboard/project/_/integrations) interface inside the Dashboard, and can run anywhere from every second to once a year depending on your use case.

![Manage cron jobs via the Dashboard](https://supabase.com/docs/_next/image?url=%2Fdocs%2Fimg%2Fguides%2Fcron%2Fcron--light.jpg&w=3840&q=75)

Every Job can run SQL snippets or database functions with zero network latency or make an HTTP request, such as invoking a Supabase Edge Function, with ease.

For best performance, we recommend no more than 8 Jobs run concurrently. Each Job should run no more than 10 minutes.

## How does Cron work? [\#](https://supabase.com/docs/guides/cron\#how-does-cron-work)

Under the hood, Supabase Cron uses the [`pg_cron`](https://github.com/citusdata/pg_cron) Postgres database extension which is the scheduling and execution engine for your Jobs.

The extension creates a `cron` schema in your database and all Jobs are stored on the `cron.job` table. Every Job's run and its status is recorded on the `cron.job_run_details` table.

The Supabase Dashboard provides an interface for you to schedule Jobs and monitor Job runs. You can also do the same with SQL.

## Resources [\#](https://supabase.com/docs/guides/cron\#resources)

- [`pg_cron` GitHub Repository](https://github.com/citusdata/pg_cron)

### Is this helpful?

NoYes

### On this page

[How does Cron work?](https://supabase.com/docs/guides/cron#how-does-cron-work) [Resources](https://supabase.com/docs/guides/cron#resources)
