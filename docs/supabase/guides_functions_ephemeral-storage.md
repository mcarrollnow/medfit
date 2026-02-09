---
library: supabase
url: https://supabase.com/docs/guides/functions/ephemeral-storage
title: File Storage | Supabase Docs
scraped: 2025-10-23T16:59:02.344Z
---

Edge Functions

# File Storage

## Use persistent and ephemeral file storage

* * *

Edge Functions provides two flavors of file storage:

- Persistent - backed by S3 protocol, can read/write from any S3 compatible bucket, including Supabase Storage
- Ephemeral - You can read and write files to the `/tmp` directory. Only suitable for temporary operations

You can use file storage to:

- Handle complex file transformations and workflows
- Do data migrations between projects
- Process user uploaded files and store them
- Unzip archives and process contents before saving to database

* * *

## Persistent Storage [\#](https://supabase.com/docs/guides/functions/ephemeral-storage\#persistent-storage)

The persistent storage option is built on top of the S3 protocol. It allows you to mount any S3-compatible bucket, including Supabase Storage Buckets, as a directory for your Edge Functions.
You can perform operations such as reading and writing files to the mounted buckets as you would in a POSIX file system.

To access an S3 bucket from Edge Functions, you must set the following for environment variables in Edge Function Secrets.

- `S3FS_ENDPOINT_URL`
- `S3FS_REGION`
- `S3FS_ACCESS_KEY_ID`
- `S3FS_SECRET_ACCESS_KEY`

[Follow this guide](https://supabase.com/docs/guides/storage/s3/authentication) to enable and create an access key for Supabase Storage S3.

To access a file path in your mounted bucket from your Edge Function, use the prefix `/s3/YOUR-BUCKET-NAME`.

```flex

```

## Ephemeral storage [\#](https://supabase.com/docs/guides/functions/ephemeral-storage\#ephemeral-storage)

Ephemeral storage will reset on each function invocation. This means the files you write during an invocation can only be read within the same invocation.

You can use [Deno File System APIs](https://docs.deno.com/api/deno/file-system) or the [`node:fs`](https://docs.deno.com/api/node/fs/) module to access the `/tmp` path.

```flex

```

* * *

## Common use cases [\#](https://supabase.com/docs/guides/functions/ephemeral-storage\#common-use-cases)

### Archive processing with background tasks [\#](https://supabase.com/docs/guides/functions/ephemeral-storage\#archive-processing-with-background-tasks)

You can use ephemeral storage with [Background Tasks](https://supabase.com/docs/guides/functions/background-tasks) to handle large file processing operations that exceed memory limits.

Imagine you have a Photo Album application that accepts photo uploads as zip files. A streaming implementation will run into memory limit errors with zip files exceeding 100MB, as it retains all archive files in memory simultaneously.

You can write the zip file to ephemeral storage first, then use a background task to extract and upload files to Supabase Storage. This way, you only read parts of the zip file to the memory.

```flex

```

### Image manipulation [\#](https://supabase.com/docs/guides/functions/ephemeral-storage\#image-manipulation)

Custom image manipulation workflows using [`magick-wasm`](https://supabase.com/docs/guides/functions/examples/image-manipulation).

```flex

```

* * *

## Using synchronous file APIs [\#](https://supabase.com/docs/guides/functions/ephemeral-storage\#using-synchronous-file-apis)

You can safely use the following synchronous Deno APIs (and their Node counterparts) _during initial script evaluation_:

- Deno.statSync
- Deno.removeSync
- Deno.writeFileSync
- Deno.writeTextFileSync
- Deno.readFileSync
- Deno.readTextFileSync
- Deno.mkdirSync
- Deno.makeTempDirSync
- Deno.readDirSync

**Keep in mind** that the sync APIs are available only during initial script evaluation and aren’t supported in callbacks like HTTP handlers or `setTimeout`.

```flex

```

* * *

## Limits [\#](https://supabase.com/docs/guides/functions/ephemeral-storage\#limits)

There are no limits on S3 buckets you mount for Persistent storage.

Ephemeral Storage:

- Free projects: Up to 256MB of ephemeral storage
- Paid projects: Up to 512MB of ephemeral storage

### Is this helpful?

NoYes

### On this page

[Persistent Storage](https://supabase.com/docs/guides/functions/ephemeral-storage#persistent-storage) [Ephemeral storage](https://supabase.com/docs/guides/functions/ephemeral-storage#ephemeral-storage) [Common use cases](https://supabase.com/docs/guides/functions/ephemeral-storage#common-use-cases) [Archive processing with background tasks](https://supabase.com/docs/guides/functions/ephemeral-storage#archive-processing-with-background-tasks) [Image manipulation](https://supabase.com/docs/guides/functions/ephemeral-storage#image-manipulation) [Using synchronous file APIs](https://supabase.com/docs/guides/functions/ephemeral-storage#using-synchronous-file-apis) [Limits](https://supabase.com/docs/guides/functions/ephemeral-storage#limits)
