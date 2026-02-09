---
library: supabase
url: https://supabase.com/docs/guides/storage/management/copy-move-objects
title: Copy Objects | Supabase Docs
scraped: 2025-10-23T16:59:02.332Z
---

Storage

# Copy Objects

## Learn how to copy and move objects

* * *

## Copy objects [\#](https://supabase.com/docs/guides/storage/management/copy-move-objects\#copy-objects)

You can copy objects between buckets or within the same bucket. Currently only objects up to 5 GB can be copied using the API.

When making a copy of an object, the owner of the new object will be the user who initiated the copy operation.

### Copying objects within the same bucket [\#](https://supabase.com/docs/guides/storage/management/copy-move-objects\#copying-objects-within-the-same-bucket)

To copy an object within the same bucket, use the `copy` method.

```flex

```

### Copying objects across buckets [\#](https://supabase.com/docs/guides/storage/management/copy-move-objects\#copying-objects-across-buckets)

To copy an object across buckets, use the `copy` method and specify the destination bucket.

```flex

```

## Move objects [\#](https://supabase.com/docs/guides/storage/management/copy-move-objects\#move-objects)

You can move objects between buckets or within the same bucket. Currently only objects up to 5GB can be moved using the API.

When moving an object, the owner of the new object will be the user who initiated the move operation. Once the object is moved, the original object will no longer exist.

### Moving objects within the same bucket [\#](https://supabase.com/docs/guides/storage/management/copy-move-objects\#moving-objects-within-the-same-bucket)

To move an object within the same bucket, you can use the `move` method.

```flex

```

### Moving objects across buckets [\#](https://supabase.com/docs/guides/storage/management/copy-move-objects\#moving-objects-across-buckets)

To move an object across buckets, use the `move` method and specify the destination bucket.

```flex

```

## Permissions [\#](https://supabase.com/docs/guides/storage/management/copy-move-objects\#permissions)

For a user to move and copy objects, they need `select` permission on the source object and `insert` permission on the destination object. For example:

```flex

```

### Is this helpful?

NoYes

### On this page

[Copy objects](https://supabase.com/docs/guides/storage/management/copy-move-objects#copy-objects) [Copying objects within the same bucket](https://supabase.com/docs/guides/storage/management/copy-move-objects#copying-objects-within-the-same-bucket) [Copying objects across buckets](https://supabase.com/docs/guides/storage/management/copy-move-objects#copying-objects-across-buckets) [Move objects](https://supabase.com/docs/guides/storage/management/copy-move-objects#move-objects) [Moving objects within the same bucket](https://supabase.com/docs/guides/storage/management/copy-move-objects#moving-objects-within-the-same-bucket) [Moving objects across buckets](https://supabase.com/docs/guides/storage/management/copy-move-objects#moving-objects-across-buckets) [Permissions](https://supabase.com/docs/guides/storage/management/copy-move-objects#permissions)
