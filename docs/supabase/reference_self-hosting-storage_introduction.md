---
library: supabase
url: https://supabase.com/docs/reference/self-hosting-storage/introduction
title: Self-Hosting | Supabase Docs
scraped: 2025-10-23T16:59:02.343Z
---

Storage Server Reference

# Self-Hosting Storage

An S3 compatible object storage service that integrates with Postgres.

- Uses Postgres as it's datastore for storing metadata
- Authorization rules are written as Postgres Row Level Security policies
- Integrates with S3 as the storage backend (with more in the pipeline!)
- Extremely lightweight and performant

### Client libraries [\#](https://supabase.com/docs/reference/self-hosting-storage/introduction\#client-libraries)

- [JavaScript](https://github.com/supabase/storage-js)
- [Dart](https://github.com/supabase/storage-dart)

### Additional links [\#](https://supabase.com/docs/reference/self-hosting-storage/introduction\#additional-links)

- [Source code](https://github.com/supabase/storage-api)
- [Known bugs and issues](https://github.com/supabase/storage-js/issues)
- [Storage guides](https://supabase.com/docs/guides/storage)
- [OpenAPI docs](https://supabase.github.io/storage/)
- [Why we built a new object storage service](https://supabase.com/blog/supabase-storage)

* * *

## Create a bucket

post `/bucket/`

### Body

application/json

- nameRequiredstring

- idOptionalstring

- publicOptionalboolean

- typeOptionalenum

Accepted values

- file\_size\_limitOptionalany of the following options

Options

- allowed\_mime\_typesOptionalArray<string>


### Response codes

- 200
- 4XX

### Response (200)

exampleschema

```flex

```

* * *

## Gets all buckets

get `/bucket/`

### Query parameters

- limitOptionalinteger

- offsetOptionalinteger

- sortColumnOptionalenum

Accepted values

- sortOrderOptionalenum

Accepted values

- searchOptionalstring


### Response codes

- 200
- 4XX

### Response (200)

exampleschema

```flex

```

* * *

## Empty a bucket

post `/bucket/{bucketId}/empty`

### Path parameters

- bucketIdRequiredstring


### Response codes

- 200
- 4XX

### Response (200)

exampleschema

```flex

```

* * *

## Get details of a bucket

get `/bucket/{bucketId}`

### Path parameters

- bucketIdRequiredstring


### Response codes

- 200
- 4XX

### Response (200)

exampleschema

```flex

```

* * *

## Update properties of a bucket

put `/bucket/{bucketId}`

### Body

application/json

- publicOptionalboolean

- file\_size\_limitOptionalany of the following options

Options

- allowed\_mime\_typesOptionalArray<string>


### Response codes

- 200
- 4XX

### Response (200)

exampleschema

```flex

```

* * *

## Delete a bucket

delete `/bucket/{bucketId}`

### Path parameters

- bucketIdRequiredstring


### Response codes

- 200
- 4XX

### Response (200)

exampleschema

```flex

```

* * *

## Delete an object

delete `/object/{bucketName}/{wildcard}`

### Path parameters

- bucketNameRequiredstring

- \*Requiredstring


### Response codes

- 200
- 4XX

### Response (200)

exampleschema

```flex

```

* * *

## Get object

get `/object/{bucketName}/{wildcard}`

Serve objects

### Path parameters

- bucketNameRequiredstring

- \*Requiredstring


### Response codes

- 4XX

* * *

## Update the object at an existing key

put `/object/{bucketName}/{wildcard}`

### Path parameters

- bucketNameRequiredstring

- \*Requiredstring


### Response codes

- 200
- 4XX

### Response (200)

exampleschema

```flex

```

* * *

## Upload a new object

post `/object/{bucketName}/{wildcard}`

### Path parameters

- bucketNameRequiredstring

- \*Requiredstring


### Response codes

- 200
- 4XX

### Response (200)

exampleschema

```flex

```

* * *

## Delete multiple objects

delete `/object/{bucketName}`

### Path parameters

- bucketNameRequiredstring


### Body

application/json

- prefixesRequiredArray<string>


### Response codes

- 200
- 4XX

### Response (200)

exampleschema

```flex

```

* * *

## Retrieve an object

get `/object/authenticated/{bucketName}/{wildcard}`

### Path parameters

- bucketNameRequiredstring

- \*Requiredstring


### Response codes

- 4XX

* * *

## Generate a presigned url to retrieve an object

post `/object/sign/{bucketName}/{wildcard}`

### Path parameters

- bucketNameRequiredstring

- \*Requiredstring


### Body

application/json

- expiresInRequiredinteger

- transformOptionalobject

Object schema


### Response codes

- 200
- 4XX

### Response (200)

exampleschema

```flex

```

* * *

## Retrieve an object via a presigned URL

get `/object/sign/{bucketName}/{wildcard}`

### Path parameters

- bucketNameRequiredstring

- \*Requiredstring


### Query parameters

- downloadOptionalstring

- tokenRequiredstring


### Response codes

- 4XX

* * *

## Generate presigned urls to retrieve objects

post `/object/sign/{bucketName}`

### Path parameters

- bucketNameRequiredstring


### Body

application/json

- expiresInRequiredinteger

- pathsRequiredArray<string>


### Response codes

- 200
- 4XX

### Response (200)

exampleschema

```flex

```

* * *

## Moves an object

post `/object/move`

### Body

application/json

- bucketIdRequiredstring

- sourceKeyRequiredstring

- destinationBucketOptionalstring

- destinationKeyRequiredstring


### Response codes

- 200
- 4XX

### Response (200)

exampleschema

```flex

```

* * *

## Search for objects under a prefix

post `/object/list/{bucketName}`

### Path parameters

- bucketNameRequiredstring


### Body

application/json

- prefixRequiredstring

- limitOptionalinteger

- offsetOptionalinteger

- sortByOptionalobject

Object schema

- searchOptionalstring


### Response codes

- 200
- 4XX

### Response (200)

exampleschema

```flex

```

* * *

## Retrieve object info

get `/object/info/{bucketName}/{wildcard}`

Object Info

### Path parameters

- bucketNameRequiredstring

- \*Requiredstring


### Response codes

- 4XX

* * *

## Copies an object

post `/object/copy`

### Body

application/json

- bucketIdRequiredstring

- sourceKeyRequiredstring

- destinationBucketOptionalstring

- destinationKeyRequiredstring

- metadataOptionalobject

Object schema

- copyMetadataOptionalboolean


### Response codes

- 200
- 4XX

### Response (200)

exampleschema

```flex

```

* * *

## Retrieve an object from a public bucket

get `/object/public/{bucketName}/{wildcard}`

### Path parameters

- bucketNameRequiredstring

- \*Requiredstring


### Response codes

- 4XX

* * *

## Get object info

get `/object/info/public/{bucketName}/{wildcard}`

returns object info

### Path parameters

- bucketNameRequiredstring

- \*Requiredstring


### Response codes

- 4XX
