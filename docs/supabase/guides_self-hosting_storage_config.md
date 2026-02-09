---
library: supabase
url: https://supabase.com/docs/guides/self-hosting/storage/config
title: Storage Self-hosting Config | Supabase Docs
scraped: 2025-10-23T16:59:02.327Z
---

Self-Hosting

# Storage Self-hosting Config

* * *

A sample `.env` file is located in the [storage repository](https://github.com/supabase/storage-api/blob/master/.env.sample).

Use this file to configure your environment variables for your Storage server.

## General

General Settings

##### Parameters

ANON\_KEY
REQUIRED
no type

A long-lived JWT with anonymous Postgres privileges.

SERVICE\_KEY
REQUIRED
no type

A long-lived JWT with Postgres privileges to bypass Row Level Security.

TENANT\_ID
REQUIRED
no type

The ID of a Storage tenant.

REGION
REQUIRED
no type

Region of your S3 bucket.

GLOBAL\_S3\_BUCKET
REQUIRED
no type

Name of your S3 bucket.

POSTGREST\_URL
REQUIRED
no type

The URL of your PostgREST server.

PGRST\_JWT\_SECRET
REQUIRED
no type

A JWT Secret for the PostgREST database.

DATABASE\_URL
REQUIRED
no type

The URL of your Postgres database.

PGOPTIONS
REQUIRED
no type

Additional configuration parameters for Postgres startup.

FILE\_SIZE\_LIMIT
REQUIRED
no type

The maximum file size allowed.

STORAGE\_BACKEND
REQUIRED
no type

The storage provider.

FILE\_STORAGE\_BACKEND\_PATH
REQUIRED
no type

The location storage when the "STORAGE\_BACKEND" is set to "file".

## Multi-tenant

Configuration items for multi-tenant servers.

##### Parameters

IS\_MULTITENANT
REQUIRED
no type

Operate across multiple tenants.

MULTITENANT\_DATABASE\_URL
REQUIRED
no type

The URL of the multitenant Postgres database.

X\_FORWARDED\_HOST\_REGEXP
REQUIRED
no type

TBD.

POSTGREST\_URL\_SUFFIX
REQUIRED
no type

The suffix for the PostgREST instance.

ADMIN\_API\_KEYS
REQUIRED
no type

Secure API key for administrative endpoints.

ENCRYPTION\_KEY
REQUIRED
no type

An key for encryting/decrypting secrets.

### Is this helpful?

NoYes
