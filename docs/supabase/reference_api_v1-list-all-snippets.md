---
library: supabase
url: https://supabase.com/docs/reference/api/v1-list-all-snippets
title: Management API Reference | Supabase Docs
scraped: 2025-10-23T16:59:02.343Z
---

Management API Reference

# Management API

Manage your Supabase organizations and projects programmatically.

## Authentication [\#](https://supabase.com/docs/reference/api/v1-list-all-snippets\#authentication)

All API requests require an access token to be included in the Authorization header: `Authorization Bearer <access_token>`.

There are two ways to generate an access token:

1. **Personal access token (PAT):**
PATs are long-lived tokens that you manually generate to access the Management API. They are useful for automating workflows or developing against the Management API. PATs carry the same privileges as your user account, so be sure to keep it secret.

To generate or manage your personal access tokens, visit your [account](https://supabase.com/dashboard/account/tokens) page.

2. **OAuth2:**
OAuth2 allows your application to generate tokens on behalf of a Supabase user, providing secure and limited access to their account without requiring their credentials. Use this if you're building a third-party app that needs to create or manage Supabase projects on behalf of your users. Tokens generated via OAuth2 are short-lived and tied to specific scopes to ensure your app can only perform actions that are explicitly approved by the user.

See [Build a Supabase Integration](https://supabase.com/docs/guides/integrations/build-a-supabase-integration) to set up OAuth2 for your application.


```flex

```

All API requests must be authenticated and made over HTTPS.

## Rate limits [\#](https://supabase.com/docs/reference/api/v1-list-all-snippets\#rate-limits)

The rate limit for Management API is 60 requests per one minute per user, and applies cumulatively across all requests made with your personal access tokens.

If you exceed this limit, all Management API calls for the next minute will be blocked, resulting in a HTTP 429 response.

The Management API is subject to our fair-use policy.
All resources created via the API are subject to the pricing detailed on our [Pricing](https://supabase.com/pricing) pages.

Additional links

- [OpenAPI Docs](https://api.supabase.com/api/v1)
- [OpenAPI Spec](https://api.supabase.com/api/v1-json)
- [Report bugs and issues](https://github.com/supabase/supabase)

* * *

## Gets project performance advisors.deprecated

get `/v1/projects/{ref}/advisors/performance`

This is an **experimental** endpoint. It is subject to change or removal in future versions. Use it with caution, as it may not remain supported or stable.

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429

### Response (200)

exampleschema

```flex

```

* * *

## Gets project security advisors.deprecated

get `/v1/projects/{ref}/advisors/security`

This is an **experimental** endpoint. It is subject to change or removal in future versions. Use it with caution, as it may not remain supported or stable.

### Path parameters

- refRequiredstring



Project ref



Details


### Query parameters

- lint\_typeOptionalenum

Accepted values


### Response codes

- 200
- 401
- 403
- 429

### Response (200)

exampleschema

```flex

```

* * *

## Gets a project's function combined statistics

get `/v1/projects/{ref}/analytics/endpoints/functions.combined-stats`

### Path parameters

- refRequiredstring



Project ref



Details


### Query parameters

- intervalRequiredenum

Accepted values

- function\_idRequiredstring


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Gets project's logs

get `/v1/projects/{ref}/analytics/endpoints/logs.all`

Executes a SQL query on the project's logs.

Either the 'iso\_timestamp\_start' and 'iso\_timestamp\_end' parameters must be provided.
If both are not provided, only the last 1 minute of logs will be queried.
The timestamp range must be no more than 24 hours and is rounded to the nearest minute. If the range is more than 24 hours, a validation error will be thrown.

### Path parameters

- refRequiredstring



Project ref



Details


### Query parameters

- sqlOptionalstring

- iso\_timestamp\_startOptionalstring

- iso\_timestamp\_endOptionalstring


### Response codes

- 200
- 401
- 403
- 429

### Response (200)

exampleschema

```flex

```

* * *

## Gets project's usage api counts

get `/v1/projects/{ref}/analytics/endpoints/usage.api-counts`

### Path parameters

- refRequiredstring



Project ref



Details


### Query parameters

- intervalOptionalenum

Accepted values


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Gets project's usage api requests count

get `/v1/projects/{ref}/analytics/endpoints/usage.api-requests-count`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Creates a new SSO provider

post `/v1/projects/{ref}/config/auth/sso/providers`

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- typeRequiredenum

Accepted values

- metadata\_xmlOptionalstring

- metadata\_urlOptionalstring

- domainsOptionalArray<string>

- attribute\_mappingOptionalobject

Object schema

- name\_id\_formatOptionalenum

Accepted values


### Response codes

- 201
- 401
- 403
- 404
- 429

### Response (201)

exampleschema

```flex

```

* * *

## Set up the project's existing JWT secret as an in\_use JWT signing key. This endpoint will be removed in the future always check for HTTP 404 Not Found.

post `/v1/projects/{ref}/config/auth/signing-keys/legacy`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 201
- 401
- 403
- 429

### Response (201)

exampleschema

```flex

```

* * *

## Create a new signing key for the project in standby status

post `/v1/projects/{ref}/config/auth/signing-keys`

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- algorithmRequiredenum

Accepted values

- statusOptionalenum

Accepted values

- private\_jwkOptionalone of the following options

Options


### Response codes

- 201
- 401
- 403
- 429

### Response (201)

exampleschema

```flex

```

* * *

## Creates a new third-party auth integration

post `/v1/projects/{ref}/config/auth/third-party-auth`

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- oidc\_issuer\_urlOptionalstring

- jwks\_urlOptionalstring

- custom\_jwksOptional

Details


### Response codes

- 201
- 401
- 403
- 429

### Response (201)

exampleschema

```flex

```

* * *

## Removes a SSO provider by its UUID

delete `/v1/projects/{ref}/config/auth/sso/providers/{provider_id}`

### Path parameters

- refRequiredstring



Project ref



Details

- provider\_idRequiredstring


### Response codes

- 200
- 401
- 403
- 404
- 429

### Response (200)

exampleschema

```flex

```

* * *

## Removes a third-party auth integration

delete `/v1/projects/{ref}/config/auth/third-party-auth/{tpa_id}`

### Path parameters

- refRequiredstring



Project ref



Details

- tpa\_idRequiredstring


### Response codes

- 200
- 401
- 403
- 429

### Response (200)

exampleschema

```flex

```

* * *

## Gets a SSO provider by its UUID

get `/v1/projects/{ref}/config/auth/sso/providers/{provider_id}`

### Path parameters

- refRequiredstring



Project ref



Details

- provider\_idRequiredstring


### Response codes

- 200
- 401
- 403
- 404
- 429

### Response (200)

exampleschema

```flex

```

* * *

## Gets project's auth config

get `/v1/projects/{ref}/config/auth`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Get the signing key information for the JWT secret imported as signing key for this project. This endpoint will be removed in the future, check for HTTP 404 Not Found.

get `/v1/projects/{ref}/config/auth/signing-keys/legacy`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429

### Response (200)

exampleschema

```flex

```

* * *

## Get information about a signing key

get `/v1/projects/{ref}/config/auth/signing-keys/{id}`

### Path parameters

- idRequiredstring

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429

### Response (200)

exampleschema

```flex

```

* * *

## List all signing keys for the project

get `/v1/projects/{ref}/config/auth/signing-keys`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429

### Response (200)

exampleschema

```flex

```

* * *

## Get a third-party integration

get `/v1/projects/{ref}/config/auth/third-party-auth/{tpa_id}`

### Path parameters

- refRequiredstring



Project ref



Details

- tpa\_idRequiredstring


### Response codes

- 200
- 401
- 403
- 429

### Response (200)

exampleschema

```flex

```

* * *

## Lists all SSO providers

get `/v1/projects/{ref}/config/auth/sso/providers`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 404
- 429

### Response (200)

exampleschema

```flex

```

* * *

## Lists all third-party auth integrations

get `/v1/projects/{ref}/config/auth/third-party-auth`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429

### Response (200)

exampleschema

```flex

```

* * *

## Remove a signing key from a project. Only possible if the key has been in revoked status for a while.

delete `/v1/projects/{ref}/config/auth/signing-keys/{id}`

### Path parameters

- idRequiredstring

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429

### Response (200)

exampleschema

```flex

```

* * *

## Updates a SSO provider by its UUID

put `/v1/projects/{ref}/config/auth/sso/providers/{provider_id}`

### Path parameters

- refRequiredstring



Project ref



Details

- provider\_idRequiredstring


### Body

application/json

- metadata\_xmlOptionalstring

- metadata\_urlOptionalstring

- domainsOptionalArray<string>

- attribute\_mappingOptionalobject

Object schema

- name\_id\_formatOptionalenum

Accepted values


### Response codes

- 200
- 401
- 403
- 404
- 429

### Response (200)

exampleschema

```flex

```

* * *

## Updates a project's auth config

patch `/v1/projects/{ref}/config/auth`

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- site\_urlOptionalstring

Details

- disable\_signupOptionalboolean

- jwt\_expOptionalinteger

- smtp\_admin\_emailOptionalstring

- smtp\_hostOptionalstring

- smtp\_portOptionalstring

- smtp\_userOptionalstring

- smtp\_passOptionalstring

- smtp\_max\_frequencyOptionalinteger

- smtp\_sender\_nameOptionalstring

- mailer\_allow\_unverified\_email\_sign\_insOptionalboolean

- mailer\_autoconfirmOptionalboolean

- mailer\_subjects\_inviteOptionalstring

- mailer\_subjects\_confirmationOptionalstring

- mailer\_subjects\_recoveryOptionalstring

- mailer\_subjects\_email\_changeOptionalstring

- mailer\_subjects\_magic\_linkOptionalstring

- mailer\_subjects\_reauthenticationOptionalstring

- mailer\_subjects\_password\_changed\_notificationOptionalstring

- mailer\_subjects\_email\_changed\_notificationOptionalstring

- mailer\_subjects\_phone\_changed\_notificationOptionalstring

- mailer\_subjects\_mfa\_factor\_enrolled\_notificationOptionalstring

- mailer\_subjects\_mfa\_factor\_unenrolled\_notificationOptionalstring

- mailer\_subjects\_identity\_linked\_notificationOptionalstring

- mailer\_subjects\_identity\_unlinked\_notificationOptionalstring

- mailer\_templates\_invite\_contentOptionalstring

- mailer\_templates\_confirmation\_contentOptionalstring

- mailer\_templates\_recovery\_contentOptionalstring

- mailer\_templates\_email\_change\_contentOptionalstring

- mailer\_templates\_magic\_link\_contentOptionalstring

- mailer\_templates\_reauthentication\_contentOptionalstring

- mailer\_templates\_password\_changed\_notification\_contentOptionalstring

- mailer\_templates\_email\_changed\_notification\_contentOptionalstring

- mailer\_templates\_phone\_changed\_notification\_contentOptionalstring

- mailer\_templates\_mfa\_factor\_enrolled\_notification\_contentOptionalstring

- mailer\_templates\_mfa\_factor\_unenrolled\_notification\_contentOptionalstring

- mailer\_templates\_identity\_linked\_notification\_contentOptionalstring

- mailer\_templates\_identity\_unlinked\_notification\_contentOptionalstring

- mailer\_notifications\_password\_changed\_enabledOptionalboolean

- mailer\_notifications\_email\_changed\_enabledOptionalboolean

- mailer\_notifications\_phone\_changed\_enabledOptionalboolean

- mailer\_notifications\_mfa\_factor\_enrolled\_enabledOptionalboolean

- mailer\_notifications\_mfa\_factor\_unenrolled\_enabledOptionalboolean

- mailer\_notifications\_identity\_linked\_enabledOptionalboolean

- mailer\_notifications\_identity\_unlinked\_enabledOptionalboolean

- mfa\_max\_enrolled\_factorsOptionalinteger

- uri\_allow\_listOptionalstring

- external\_anonymous\_users\_enabledOptionalboolean

- external\_email\_enabledOptionalboolean

- external\_phone\_enabledOptionalboolean

- saml\_enabledOptionalboolean

- saml\_external\_urlOptionalstring

Details

- security\_captcha\_enabledOptionalboolean

- security\_captcha\_providerOptionalenum

Accepted values

- security\_captcha\_secretOptionalstring

- sessions\_timeboxOptionalinteger

- sessions\_inactivity\_timeoutOptionalinteger

- sessions\_single\_per\_userOptionalboolean

- sessions\_tagsOptionalstring

Details

- rate\_limit\_anonymous\_usersOptionalinteger

- rate\_limit\_email\_sentOptionalinteger

- rate\_limit\_sms\_sentOptionalinteger

- rate\_limit\_verifyOptionalinteger

- rate\_limit\_token\_refreshOptionalinteger

- rate\_limit\_otpOptionalinteger

- rate\_limit\_web3Optionalinteger

- mailer\_secure\_email\_change\_enabledOptionalboolean

- refresh\_token\_rotation\_enabledOptionalboolean

- password\_hibp\_enabledOptionalboolean

- password\_min\_lengthOptionalinteger

- password\_required\_charactersOptionalenum

Accepted values

- security\_manual\_linking\_enabledOptionalboolean

- security\_update\_password\_require\_reauthenticationOptionalboolean

- security\_refresh\_token\_reuse\_intervalOptionalinteger

- mailer\_otp\_expOptionalinteger

- mailer\_otp\_lengthOptionalinteger

- sms\_autoconfirmOptionalboolean

- sms\_max\_frequencyOptionalinteger

- sms\_otp\_expOptionalinteger

- sms\_otp\_lengthOptionalinteger

- sms\_providerOptionalenum

Accepted values

- sms\_messagebird\_access\_keyOptionalstring

- sms\_messagebird\_originatorOptionalstring

- sms\_test\_otpOptionalstring

Details

- sms\_test\_otp\_valid\_untilOptionalstring

- sms\_textlocal\_api\_keyOptionalstring

- sms\_textlocal\_senderOptionalstring

- sms\_twilio\_account\_sidOptionalstring

- sms\_twilio\_auth\_tokenOptionalstring

- sms\_twilio\_content\_sidOptionalstring

- sms\_twilio\_message\_service\_sidOptionalstring

- sms\_twilio\_verify\_account\_sidOptionalstring

- sms\_twilio\_verify\_auth\_tokenOptionalstring

- sms\_twilio\_verify\_message\_service\_sidOptionalstring

- sms\_vonage\_api\_keyOptionalstring

- sms\_vonage\_api\_secretOptionalstring

- sms\_vonage\_fromOptionalstring

- sms\_templateOptionalstring

- hook\_mfa\_verification\_attempt\_enabledOptionalboolean

- hook\_mfa\_verification\_attempt\_uriOptionalstring

- hook\_mfa\_verification\_attempt\_secretsOptionalstring

- hook\_password\_verification\_attempt\_enabledOptionalboolean

- hook\_password\_verification\_attempt\_uriOptionalstring

- hook\_password\_verification\_attempt\_secretsOptionalstring

- hook\_custom\_access\_token\_enabledOptionalboolean

- hook\_custom\_access\_token\_uriOptionalstring

- hook\_custom\_access\_token\_secretsOptionalstring

- hook\_send\_sms\_enabledOptionalboolean

- hook\_send\_sms\_uriOptionalstring

- hook\_send\_sms\_secretsOptionalstring

- hook\_send\_email\_enabledOptionalboolean

- hook\_send\_email\_uriOptionalstring

- hook\_send\_email\_secretsOptionalstring

- hook\_before\_user\_created\_enabledOptionalboolean

- hook\_before\_user\_created\_uriOptionalstring

- hook\_before\_user\_created\_secretsOptionalstring

- hook\_after\_user\_created\_enabledOptionalboolean

- hook\_after\_user\_created\_uriOptionalstring

- hook\_after\_user\_created\_secretsOptionalstring

- external\_apple\_enabledOptionalboolean

- external\_apple\_client\_idOptionalstring

- external\_apple\_email\_optionalOptionalboolean

- external\_apple\_secretOptionalstring

- external\_apple\_additional\_client\_idsOptionalstring

- external\_azure\_enabledOptionalboolean

- external\_azure\_client\_idOptionalstring

- external\_azure\_email\_optionalOptionalboolean

- external\_azure\_secretOptionalstring

- external\_azure\_urlOptionalstring

- external\_bitbucket\_enabledOptionalboolean

- external\_bitbucket\_client\_idOptionalstring

- external\_bitbucket\_email\_optionalOptionalboolean

- external\_bitbucket\_secretOptionalstring

- external\_discord\_enabledOptionalboolean

- external\_discord\_client\_idOptionalstring

- external\_discord\_email\_optionalOptionalboolean

- external\_discord\_secretOptionalstring

- external\_facebook\_enabledOptionalboolean

- external\_facebook\_client\_idOptionalstring

- external\_facebook\_email\_optionalOptionalboolean

- external\_facebook\_secretOptionalstring

- external\_figma\_enabledOptionalboolean

- external\_figma\_client\_idOptionalstring

- external\_figma\_email\_optionalOptionalboolean

- external\_figma\_secretOptionalstring

- external\_github\_enabledOptionalboolean

- external\_github\_client\_idOptionalstring

- external\_github\_email\_optionalOptionalboolean

- external\_github\_secretOptionalstring

- external\_gitlab\_enabledOptionalboolean

- external\_gitlab\_client\_idOptionalstring

- external\_gitlab\_email\_optionalOptionalboolean

- external\_gitlab\_secretOptionalstring

- external\_gitlab\_urlOptionalstring

- external\_google\_enabledOptionalboolean

- external\_google\_client\_idOptionalstring

- external\_google\_email\_optionalOptionalboolean

- external\_google\_secretOptionalstring

- external\_google\_additional\_client\_idsOptionalstring

- external\_google\_skip\_nonce\_checkOptionalboolean

- external\_kakao\_enabledOptionalboolean

- external\_kakao\_client\_idOptionalstring

- external\_kakao\_email\_optionalOptionalboolean

- external\_kakao\_secretOptionalstring

- external\_keycloak\_enabledOptionalboolean

- external\_keycloak\_client\_idOptionalstring

- external\_keycloak\_email\_optionalOptionalboolean

- external\_keycloak\_secretOptionalstring

- external\_keycloak\_urlOptionalstring

- external\_linkedin\_oidc\_enabledOptionalboolean

- external\_linkedin\_oidc\_client\_idOptionalstring

- external\_linkedin\_oidc\_email\_optionalOptionalboolean

- external\_linkedin\_oidc\_secretOptionalstring

- external\_slack\_oidc\_enabledOptionalboolean

- external\_slack\_oidc\_client\_idOptionalstring

- external\_slack\_oidc\_email\_optionalOptionalboolean

- external\_slack\_oidc\_secretOptionalstring

- external\_notion\_enabledOptionalboolean

- external\_notion\_client\_idOptionalstring

- external\_notion\_email\_optionalOptionalboolean

- external\_notion\_secretOptionalstring

- external\_slack\_enabledOptionalboolean

- external\_slack\_client\_idOptionalstring

- external\_slack\_email\_optionalOptionalboolean

- external\_slack\_secretOptionalstring

- external\_spotify\_enabledOptionalboolean

- external\_spotify\_client\_idOptionalstring

- external\_spotify\_email\_optionalOptionalboolean

- external\_spotify\_secretOptionalstring

- external\_twitch\_enabledOptionalboolean

- external\_twitch\_client\_idOptionalstring

- external\_twitch\_email\_optionalOptionalboolean

- external\_twitch\_secretOptionalstring

- external\_twitter\_enabledOptionalboolean

- external\_twitter\_client\_idOptionalstring

- external\_twitter\_email\_optionalOptionalboolean

- external\_twitter\_secretOptionalstring

- external\_workos\_enabledOptionalboolean

- external\_workos\_client\_idOptionalstring

- external\_workos\_secretOptionalstring

- external\_workos\_urlOptionalstring

- external\_web3\_solana\_enabledOptionalboolean

- external\_web3\_ethereum\_enabledOptionalboolean

- external\_zoom\_enabledOptionalboolean

- external\_zoom\_client\_idOptionalstring

- external\_zoom\_email\_optionalOptionalboolean

- external\_zoom\_secretOptionalstring

- db\_max\_pool\_sizeOptionalinteger

- api\_max\_request\_durationOptionalinteger

- mfa\_totp\_enroll\_enabledOptionalboolean

- mfa\_totp\_verify\_enabledOptionalboolean

- mfa\_web\_authn\_enroll\_enabledOptionalboolean

- mfa\_web\_authn\_verify\_enabledOptionalboolean

- mfa\_phone\_enroll\_enabledOptionalboolean

- mfa\_phone\_verify\_enabledOptionalboolean

- mfa\_phone\_max\_frequencyOptionalinteger

- mfa\_phone\_otp\_lengthOptionalinteger

- mfa\_phone\_templateOptionalstring

- nimbus\_oauth\_client\_idOptionalstring

- nimbus\_oauth\_client\_secretOptionalstring


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Update a signing key, mainly its status

patch `/v1/projects/{ref}/config/auth/signing-keys/{id}`

### Path parameters

- idRequiredstring

- refRequiredstring



Project ref



Details


### Body

application/json

- statusRequiredenum

Accepted values


### Response codes

- 200
- 401
- 403
- 429

### Response (200)

exampleschema

```flex

```

* * *

## Apply or update billing addons, including compute instance size

patch `/v1/projects/{ref}/billing/addons`

Selects an addon variant, for example scaling the project’s compute instance up or down, and applies it to the project.

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- addon\_variantRequiredone of the following options

Options

- addon\_typeRequiredenum

Accepted values


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

schema

```flex

```

* * *

## List billing addons and compute instance selections

get `/v1/projects/{ref}/billing/addons`

Returns the billing addons that are currently applied, including the active compute instance size, and lists every addon option that can be provisioned with pricing metadata.

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Remove billing addons or revert compute instance sizing

delete `/v1/projects/{ref}/billing/addons/{addon_variant}`

Disables the selected addon variant, including rolling the compute instance back to its previous size.

### Path parameters

- refRequiredstring



Project ref



Details

- addon\_variantRequiredone of the following options

Options


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

schema

```flex

```

* * *

## \[Beta\] Apply a database migration

post `/v1/projects/{ref}/database/migrations`

Only available to selected partner OAuth apps

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- queryRequiredstring

Details

- nameOptionalstring


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

schema

```flex

```

* * *

## Authorize user-id to role mappings for JIT access

post `/v1/projects/{ref}/database/jit`

Authorizes the request to assume a role in the project database

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- roleRequiredstring

Details

- rhostRequiredstring

Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## \[Beta\] Create a login role for CLI with temporary password

post `/v1/projects/{ref}/cli/login-role`

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- read\_onlyRequiredboolean


### Response codes

- 201
- 401
- 403
- 429
- 500

### Response (201)

exampleschema

```flex

```

* * *

## Delete JIT access by user-id

delete `/v1/projects/{ref}/database/jit/{user_id}`

Remove JIT mappings of a user, revoking all JIT database access

### Path parameters

- refRequiredstring



Project ref



Details

- user\_idRequiredstring


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

schema

```flex

```

* * *

## \[Beta\] Delete existing login roles used by CLI

delete `/v1/projects/{ref}/cli/login-role`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Disables project's readonly mode for the next 15 minutes

post `/v1/projects/{ref}/readonly/temporary-disable`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 201
- 401
- 403
- 429
- 500

### Response (201)

schema

```flex

```

* * *

## \[Beta\] Enables Database Webhooks on the project

post `/v1/projects/{ref}/database/webhooks/enable`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 201
- 401
- 403
- 429
- 500

### Response (201)

schema

```flex

```

* * *

## Generate TypeScript types

get `/v1/projects/{ref}/types/typescript`

Returns the TypeScript types of your schema for use with supabase-js.

### Path parameters

- refRequiredstring



Project ref



Details


### Query parameters

- included\_schemasOptionalstring


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Gets a specific SQL snippet

get `/v1/snippets/{id}`

### Path parameters

- idRequiredstring


### Response codes

- 200
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Gets database metadata for the given project.deprecated

get `/v1/projects/{ref}/database/context`

This is an **experimental** endpoint. It is subject to change or removal in future versions. Use it with caution, as it may not remain supported or stable.

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429

### Response (200)

exampleschema

```flex

```

* * *

## Get user-id to role mappings for JIT access

get `/v1/projects/{ref}/database/jit`

Mappings of roles a user can assume in the project database

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Gets project's supavisor config

get `/v1/projects/{ref}/config/database/pooler`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Gets project's Postgres config

get `/v1/projects/{ref}/config/database/postgres`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Get project's pgbouncer config

get `/v1/projects/{ref}/config/database/pgbouncer`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Returns project's readonly mode status

get `/v1/projects/{ref}/readonly`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## \[Beta\] Get project's SSL enforcement configuration.

get `/v1/projects/{ref}/ssl-enforcement`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Lists all backups

get `/v1/projects/{ref}/database/backups`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Lists SQL snippets for the logged in user

get `/v1/snippets`

### Query parameters

- project\_refOptionalstring



Project ref



Details

- cursorOptionalstring

- limitOptionalstring

- sort\_byOptionalenum

Accepted values

- sort\_orderOptionalenum

Accepted values


### Response codes

- 200
- 500

### Response (200)

exampleschema

```flex

```

* * *

## List all user-id to role mappings for JIT access

get `/v1/projects/{ref}/database/jit/list`

Mappings of roles a user can assume in the project database

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## \[Beta\] List applied migration versions

get `/v1/projects/{ref}/database/migrations`

Only available to selected partner OAuth apps

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## \[Beta\] Remove a read replica

post `/v1/projects/{ref}/read-replicas/remove`

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- database\_identifierRequiredstring


### Response codes

- 201
- 401
- 403
- 429
- 500

### Response (201)

schema

```flex

```

* * *

## Restores a PITR backup for a database

post `/v1/projects/{ref}/database/backups/restore-pitr`

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- recovery\_time\_target\_unixRequiredinteger


### Response codes

- 201
- 401
- 403
- 429

### Response (201)

schema

```flex

```

* * *

## \[Beta\] Run sql query

post `/v1/projects/{ref}/database/query`

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- queryRequiredstring

Details

- read\_onlyOptionalboolean


### Response codes

- 201
- 401
- 403
- 429
- 500

### Response (201)

schema

```flex

```

* * *

## \[Beta\] Set up a read replica

post `/v1/projects/{ref}/read-replicas/setup`

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- read\_replica\_regionRequiredenum

Accepted values


### Response codes

- 201
- 401
- 403
- 429
- 500

### Response (201)

schema

```flex

```

* * *

## Updates a user mapping for JIT access

put `/v1/projects/{ref}/database/jit`

Modifies the roles that can be assumed and for how long

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- user\_idRequiredstring

Details

- rolesRequiredArray<object>

Items


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Updates project's supavisor config

patch `/v1/projects/{ref}/config/database/pooler`

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- default\_pool\_sizeOptionalinteger

- pool\_modeOptionalenum

Accepted values


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Updates project's Postgres config

put `/v1/projects/{ref}/config/database/postgres`

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- effective\_cache\_sizeOptionalstring

- logical\_decoding\_work\_memOptionalstring

- maintenance\_work\_memOptionalstring

- track\_activity\_query\_sizeOptionalstring

- max\_connectionsOptionalinteger

- max\_locks\_per\_transactionOptionalinteger

- max\_parallel\_maintenance\_workersOptionalinteger

- max\_parallel\_workersOptionalinteger

- max\_parallel\_workers\_per\_gatherOptionalinteger

- max\_replication\_slotsOptionalinteger

- max\_slot\_wal\_keep\_sizeOptionalstring

- max\_standby\_archive\_delayOptionalstring

- max\_standby\_streaming\_delayOptionalstring

- max\_wal\_sizeOptionalstring

- max\_wal\_sendersOptionalinteger

- max\_worker\_processesOptionalinteger

- session\_replication\_roleOptionalenum

Accepted values

- shared\_buffersOptionalstring

- statement\_timeoutOptionalstring

- track\_commit\_timestampOptionalboolean

- wal\_keep\_sizeOptionalstring

- wal\_sender\_timeoutOptionalstring

- work\_memOptionalstring

- restart\_databaseOptionalboolean


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## \[Beta\] Update project's SSL enforcement configuration.

put `/v1/projects/{ref}/ssl-enforcement`

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- requestedConfigRequiredobject

Object schema


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## \[Beta\] Upsert a database migration without applying

put `/v1/projects/{ref}/database/migrations`

Only available to selected partner OAuth apps

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- queryRequiredstring

Details

- nameOptionalstring


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

schema

```flex

```

* * *

## \[Beta\] Activates a custom hostname for a project.

post `/v1/projects/{ref}/custom-hostname/activate`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 201
- 401
- 403
- 429
- 500

### Response (201)

exampleschema

```flex

```

* * *

## \[Beta\] Activates a vanity subdomain for a project.

post `/v1/projects/{ref}/vanity-subdomain/activate`

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- vanity\_subdomainRequiredstring


### Response codes

- 201
- 401
- 403
- 429
- 500

### Response (201)

exampleschema

```flex

```

* * *

## \[Beta\] Checks vanity subdomain availability

post `/v1/projects/{ref}/vanity-subdomain/check-availability`

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- vanity\_subdomainRequiredstring


### Response codes

- 201
- 401
- 403
- 429
- 500

### Response (201)

exampleschema

```flex

```

* * *

## \[Beta\] Deletes a project's vanity subdomain configuration

delete `/v1/projects/{ref}/vanity-subdomain`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

schema

```flex

```

* * *

## \[Beta\] Gets project's custom hostname config

get `/v1/projects/{ref}/custom-hostname`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## \[Beta\] Gets current vanity subdomain config

get `/v1/projects/{ref}/vanity-subdomain`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## \[Beta\] Updates project's custom hostname configuration

post `/v1/projects/{ref}/custom-hostname/initialize`

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- custom\_hostnameRequiredstring

Details


### Response codes

- 201
- 401
- 403
- 429
- 500

### Response (201)

exampleschema

```flex

```

* * *

## \[Beta\] Attempts to verify the DNS configuration for project's custom hostname configuration

post `/v1/projects/{ref}/custom-hostname/reverify`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 201
- 401
- 403
- 429
- 500

### Response (201)

exampleschema

```flex

```

* * *

## Bulk update functions

put `/v1/projects/{ref}/functions`

Bulk update functions. It will create a new function or replace existing. The operation is idempotent. NOTE: You will need to manually bump the version.

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

Array of object

Object schema

### Response codes

- 200
- 401
- 402
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Create a functiondeprecated

post `/v1/projects/{ref}/functions`

This endpoint is deprecated - use the deploy endpoint. Creates a function and adds it to the specified project.

### Path parameters

- refRequiredstring



Project ref



Details


### Query parameters

- slugOptionalstring

Details

- nameOptionalstring

- verify\_jwtOptionalboolean



Boolean string, true or false

- import\_mapOptionalboolean



Boolean string, true or false

- entrypoint\_pathOptionalstring

- import\_map\_pathOptionalstring

- ezbr\_sha256Optionalstring


### Body

application/vnd.denoland.eszip

string

- slugRequiredstring

Details

- nameRequiredstring

- bodyRequiredstring

- verify\_jwtOptionalboolean


### Response codes

- 201
- 401
- 402
- 403
- 429
- 500

### Response (201)

exampleschema

```flex

```

* * *

## Delete a function

delete `/v1/projects/{ref}/functions/{function_slug}`

Deletes a function with the specified slug from the specified project.

### Path parameters

- refRequiredstring



Project ref



Details

- function\_slugRequiredstring



Function slug



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

schema

```flex

```

* * *

## Deploy a function

post `/v1/projects/{ref}/functions/deploy`

A new endpoint to deploy functions. It will create if function does not exist.

### Path parameters

- refRequiredstring



Project ref



Details


### Query parameters

- slugOptionalstring

Details

- bundleOnlyOptionalboolean



Boolean string, true or false


### Body

multipart/form-data

- fileOptionalArray<string>

- metadataRequiredobject

Object schema


### Response codes

- 201
- 401
- 402
- 403
- 429
- 500

### Response (201)

exampleschema

```flex

```

* * *

## Retrieve a function

get `/v1/projects/{ref}/functions/{function_slug}`

Retrieves a function with the specified slug and project.

### Path parameters

- refRequiredstring



Project ref



Details

- function\_slugRequiredstring



Function slug



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Retrieve a function body

get `/v1/projects/{ref}/functions/{function_slug}/body`

Retrieves a function body for the specified slug and project.

### Path parameters

- refRequiredstring



Project ref



Details

- function\_slugRequiredstring



Function slug



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## List all functions

get `/v1/projects/{ref}/functions`

Returns all functions you've previously added to the specified project.

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Update a function

patch `/v1/projects/{ref}/functions/{function_slug}`

Updates a function with the specified slug and project.

### Path parameters

- refRequiredstring



Project ref



Details

- function\_slugRequiredstring



Function slug



Details


### Query parameters

- slugOptionalstring

Details

- nameOptionalstring

- verify\_jwtOptionalboolean



Boolean string, true or false

- import\_mapOptionalboolean



Boolean string, true or false

- entrypoint\_pathOptionalstring

- import\_map\_pathOptionalstring

- ezbr\_sha256Optionalstring


### Body

application/vnd.denoland.eszip

string

- nameOptionalstring

- bodyOptionalstring

- verify\_jwtOptionalboolean


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Count the number of action runs

head `/v1/projects/{ref}/actions`

Returns the total number of action runs of the specified project.

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

schema

```flex

```

* * *

## Create a database branch

post `/v1/projects/{ref}/branches`

Creates a database branch from the specified project.

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- branch\_nameRequiredstring

Details

- git\_branchOptionalstring

- is\_defaultOptionalboolean

- persistentOptionalboolean

- regionOptionalstring

- desired\_instance\_sizeOptionalenum

Accepted values

- release\_channelOptionalenum

Accepted values

- postgres\_engineOptionalenum

Accepted values

- secretsOptionalobject

Object schema

- with\_dataOptionalboolean

- notify\_urlOptionalstring


### Response codes

- 201
- 401
- 403
- 429
- 500

### Response (201)

exampleschema

```flex

```

* * *

## Delete a database branch

delete `/v1/branches/{branch_id_or_ref}`

Deletes the specified database branch

### Path parameters

- branch\_id\_or\_refRequiredone of the following options



Branch ID



Options


### Response codes

- 200
- 500

### Response (200)

exampleschema

```flex

```

* * *

## \[Beta\] Diffs a database branch

get `/v1/branches/{branch_id_or_ref}/diff`

Diffs the specified database branch

### Path parameters

- branch\_id\_or\_refRequiredone of the following options



Branch ID



Options


### Query parameters

- included\_schemasOptionalstring


### Response codes

- 200
- 500

### Response (200)

schema

```flex

```

* * *

## Disables preview branching

delete `/v1/projects/{ref}/branches`

Disables preview branching for the specified project

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

schema

```flex

```

* * *

## Get a database branch

get `/v1/projects/{ref}/branches/{name}`

Fetches the specified database branch by its name.

### Path parameters

- refRequiredstring



Project ref



Details

- nameRequiredstring


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Get database branch config

get `/v1/branches/{branch_id_or_ref}`

Fetches configurations of the specified database branch

### Path parameters

- branch\_id\_or\_refRequiredone of the following options



Branch ID



Options


### Response codes

- 200
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Get the status of an action run

get `/v1/projects/{ref}/actions/{run_id}`

Returns the current status of the specified action run.

### Path parameters

- refRequiredstring



Project ref



Details

- run\_idRequiredstring



Action Run ID


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Get the logs of an action run

get `/v1/projects/{ref}/actions/{run_id}/logs`

Returns the logs from the specified action run.

### Path parameters

- refRequiredstring



Project ref



Details

- run\_idRequiredstring



Action Run ID


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

schema

```flex

```

* * *

## List all action runs

get `/v1/projects/{ref}/actions`

Returns a paginated list of action runs of the specified project.

### Path parameters

- refRequiredstring



Project ref



Details


### Query parameters

- offsetOptionalnumber

- limitOptionalnumber


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## List all database branches

get `/v1/projects/{ref}/branches`

Returns all database branches of the specified project.

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Merges a database branch

post `/v1/branches/{branch_id_or_ref}/merge`

Merges the specified database branch

### Path parameters

- branch\_id\_or\_refRequiredone of the following options



Branch ID



Options


### Body

application/json

- migration\_versionOptionalstring


### Response codes

- 201
- 500

### Response (201)

exampleschema

```flex

```

* * *

## Pushes a database branch

post `/v1/branches/{branch_id_or_ref}/push`

Pushes the specified database branch

### Path parameters

- branch\_id\_or\_refRequiredone of the following options



Branch ID



Options


### Body

application/json

- migration\_versionOptionalstring


### Response codes

- 201
- 500

### Response (201)

exampleschema

```flex

```

* * *

## Resets a database branch

post `/v1/branches/{branch_id_or_ref}/reset`

Resets the specified database branch

### Path parameters

- branch\_id\_or\_refRequiredone of the following options



Branch ID



Options


### Body

application/json

- migration\_versionOptionalstring


### Response codes

- 201
- 500

### Response (201)

exampleschema

```flex

```

* * *

## Update database branch config

patch `/v1/branches/{branch_id_or_ref}`

Updates the configuration of the specified database branch

### Path parameters

- branch\_id\_or\_refRequiredone of the following options



Branch ID



Options


### Body

application/json

- branch\_nameOptionalstring

- git\_branchOptionalstring

- reset\_on\_pushOptionalDeprecatedboolean

- persistentOptionalboolean

- statusOptionalenum

Accepted values

- request\_reviewOptionalboolean

- notify\_urlOptionalstring


### Response codes

- 200
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Update the status of an action run

patch `/v1/projects/{ref}/actions/{run_id}/status`

Updates the status of an ongoing action run.

### Path parameters

- refRequiredstring



Project ref



Details

- run\_idRequiredstring



Action Run ID


### Body

application/json

- cloneOptionalenum

Accepted values

- pullOptionalenum

Accepted values

- healthOptionalenum

Accepted values

- configureOptionalenum

Accepted values

- migrateOptionalenum

Accepted values

- seedOptionalenum

Accepted values

- deployOptionalenum

Accepted values


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## \[Beta\] Authorize user through oauth

get `/v1/oauth/authorize`

### Query parameters

- client\_idRequiredstring

- response\_typeRequiredenum

Accepted values

- redirect\_uriRequiredstring

- scopeOptionalstring

- stateOptionalstring

- response\_modeOptionalstring

- code\_challengeOptionalstring

- code\_challenge\_methodOptionalenum

Accepted values

- organization\_slugOptionalstring



Organization slug



Details

- resourceOptionalstring



Resource indicator for MCP (Model Context Protocol) clients


### Response codes

- 204

### Response (204)

schema

```flex

```

* * *

## \[Beta\] Exchange auth code for user's access and refresh token

post `/v1/oauth/token`

### Body

application/x-www-form-urlencoded

- grant\_typeOptionalenum

Accepted values

- client\_idOptionalstring

- client\_secretOptionalstring

- codeOptionalstring

- code\_verifierOptionalstring

- redirect\_uriOptionalstring

- refresh\_tokenOptionalstring

- resourceOptionalstring

- scopeOptionalstring


### Response codes

- 201

### Response (201)

exampleschema

```flex

```

* * *

## Authorize user through oauth and claim a project

get `/v1/oauth/authorize/project-claim`

Initiates the OAuth authorization flow for the specified provider. After successful authentication, the user can claim ownership of the specified project.

### Query parameters

- project\_refRequiredstring



Project ref



Details

- client\_idRequiredstring

- response\_typeRequiredenum

Accepted values

- redirect\_uriRequiredstring

- stateOptionalstring

- response\_modeOptionalstring

- code\_challengeOptionalstring

- code\_challenge\_methodOptionalenum

Accepted values


### Response codes

- 204

### Response (204)

schema

```flex

```

* * *

## \[Beta\] Revoke oauth app authorization and it's corresponding tokens

post `/v1/oauth/revoke`

### Body

application/json

- client\_idRequiredstring

- client\_secretRequiredstring

- refresh\_tokenRequiredstring


### Response codes

- 204

### Response (204)

schema

```flex

```

* * *

## Create an organization

post `/v1/organizations`

### Body

application/json

- nameRequiredstring


### Response codes

- 201
- 500

### Response (201)

exampleschema

```flex

```

* * *

## Gets information about the organization

get `/v1/organizations/{slug}`

### Path parameters

- slugRequiredstring



Organization slug



Details


### Response codes

- 200
- 401
- 403
- 429

### Response (200)

exampleschema

```flex

```

* * *

## List all organizations

get `/v1/organizations`

Returns a list of organizations that you currently belong to.

### Response codes

- 200
- 500

### Response (200)

exampleschema

```flex

```

* * *

## List members of an organization

get `/v1/organizations/{slug}/members`

### Path parameters

- slugRequiredstring



Organization slug



Details


### Response codes

- 200
- 401
- 403
- 429

### Response (200)

exampleschema

```flex

```

* * *

## Cancels the given project restoration

post `/v1/projects/{ref}/restore/cancel`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429

### Response (200)

schema

```flex

```

* * *

## Create a project

post `/v1/projects`

### Body

application/json

- db\_passRequiredstring

- nameRequiredstring

Details

- organization\_idRequiredstring

- planOptionalDeprecatedenum

Accepted values

- regionOptionalDeprecatedenum

Accepted values

- region\_selectionOptionalone of the following options

Options

- kps\_enabledOptionalDeprecatedboolean

- desired\_instance\_sizeOptionalenum

Accepted values

- template\_urlOptionalstring

- release\_channelOptionalDeprecatedenum

Accepted values

- postgres\_engineOptionalDeprecatedenum

Accepted values


### Response codes

- 201

### Response (201)

exampleschema

```flex

```

* * *

## Deletes the given project

delete `/v1/projects/{ref}`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429

### Response (200)

exampleschema

```flex

```

* * *

## \[Beta\] Remove network bans.

delete `/v1/projects/{ref}/network-bans`

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- ipv4\_addressesRequiredArray<string>

- requester\_ipOptionalboolean

- identifierOptionalstring


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

schema

```flex

```

* * *

## \[Beta\] Gets the list of available regions that can be used for a new project

get `/v1/projects/available-regions`

### Query parameters

- organization\_slugRequiredstring



Slug of your organization

- continentOptionalenum



Continent code to determine regional recommendations: NA (North America), SA (South America), EU (Europe), AF (Africa), AS (Asia), OC (Oceania), AN (Antarctica)



Accepted values


### Response codes

- 200

### Response (200)

exampleschema

```flex

```

* * *

## \[Beta\] Gets project's network restrictions

get `/v1/projects/{ref}/network-restrictions`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## \[Beta\] Returns the project's eligibility for upgrades

get `/v1/projects/{ref}/upgrade/eligibility`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## \[Beta\] Gets the latest status of the project's upgrade

get `/v1/projects/{ref}/upgrade/status`

### Path parameters

- refRequiredstring



Project ref



Details


### Query parameters

- tracking\_idOptionalstring


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Gets a specific project that belongs to the authenticated user

get `/v1/projects/{ref}`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Gets project's service health status

get `/v1/projects/{ref}/health`

### Path parameters

- refRequiredstring



Project ref



Details


### Query parameters

- servicesRequiredArray<enum>

- timeout\_msOptionalinteger


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## \[Beta\] Gets project's network bans

post `/v1/projects/{ref}/network-bans/retrieve`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 201
- 401
- 403
- 429
- 500

### Response (201)

exampleschema

```flex

```

* * *

## \[Beta\] Gets project's network bans with additional information about which databases they affect

post `/v1/projects/{ref}/network-bans/retrieve/enriched`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 201
- 401
- 403
- 429
- 500

### Response (201)

exampleschema

```flex

```

* * *

## List all projects

get `/v1/projects`

Returns a list of all projects you've previously created.

### Response codes

- 200

### Response (200)

exampleschema

```flex

```

* * *

## Lists available restore versions for the given project

get `/v1/projects/{ref}/restore`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429

### Response (200)

exampleschema

```flex

```

* * *

## \[Alpha\] Updates project's network restrictions by adding or removing CIDRs

patch `/v1/projects/{ref}/network-restrictions`

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- addOptionalobject

Object schema

- removeOptionalobject

Object schema


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Pauses the given project

post `/v1/projects/{ref}/pause`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429

### Response (200)

schema

```flex

```

* * *

## Restores the given project

post `/v1/projects/{ref}/restore`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429

### Response (200)

schema

```flex

```

* * *

## \[Beta\] Updates project's network restrictions

post `/v1/projects/{ref}/network-restrictions/apply`

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- dbAllowedCidrsOptionalArray<string>

- dbAllowedCidrsV6OptionalArray<string>


### Response codes

- 201
- 401
- 403
- 429
- 500

### Response (201)

exampleschema

```flex

```

* * *

## \[Beta\] Upgrades the project's Postgres version

post `/v1/projects/{ref}/upgrade`

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- target\_versionRequiredstring

- release\_channelOptionalenum

Accepted values


### Response codes

- 201
- 401
- 403
- 429
- 500

### Response (201)

exampleschema

```flex

```

* * *

## Gets project's postgrest config

get `/v1/projects/{ref}/postgrest`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Updates project's postgrest config

patch `/v1/projects/{ref}/postgrest`

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- db\_extra\_search\_pathOptionalstring

- db\_schemaOptionalstring

- max\_rowsOptionalinteger

- db\_poolOptionalinteger


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Bulk create secrets

post `/v1/projects/{ref}/secrets`

Creates multiple secrets and adds them to the specified project.

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

Array of object

Object schema

### Response codes

- 201
- 401
- 403
- 429
- 500

### Response (201)

schema

```flex

```

* * *

## Bulk delete secrets

delete `/v1/projects/{ref}/secrets`

Deletes all secrets with the given names from the specified project

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

Array of string

### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

schema

```flex

```

* * *

## Creates a new API key for the project

post `/v1/projects/{ref}/api-keys`

### Path parameters

- refRequiredstring



Project ref



Details


### Query parameters

- revealOptionalboolean



Boolean string, true or false


### Body

application/json

- typeRequiredenum

Accepted values

- nameRequiredstring

Details

- descriptionOptionalstring

- secret\_jwt\_templateOptionalobject

Object schema


### Response codes

- 201
- 401
- 403
- 429

### Response (201)

exampleschema

```flex

```

* * *

## Deletes an API key for the project

delete `/v1/projects/{ref}/api-keys/{id}`

### Path parameters

- refRequiredstring



Project ref



Details

- idRequiredstring


### Query parameters

- revealOptionalboolean



Boolean string, true or false

- was\_compromisedOptionalboolean



Boolean string, true or false

- reasonOptionalstring


### Response codes

- 200
- 401
- 403
- 429

### Response (200)

exampleschema

```flex

```

* * *

## \[Beta\] Gets project's pgsodium config

get `/v1/projects/{ref}/pgsodium`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Get API key

get `/v1/projects/{ref}/api-keys/{id}`

### Path parameters

- refRequiredstring



Project ref



Details

- idRequiredstring


### Query parameters

- revealOptionalboolean



Boolean string, true or false


### Response codes

- 200
- 401
- 403
- 429

### Response (200)

exampleschema

```flex

```

* * *

## Get project api keys

get `/v1/projects/{ref}/api-keys`

### Path parameters

- refRequiredstring



Project ref



Details


### Query parameters

- revealOptionalboolean



Boolean string, true or false


### Response codes

- 200
- 401
- 403
- 429

### Response (200)

exampleschema

```flex

```

* * *

## Check whether JWT based legacy (anon, service\_role) API keys are enabled. This API endpoint will be removed in the future, check for HTTP 404 Not Found.

get `/v1/projects/{ref}/api-keys/legacy`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429

### Response (200)

exampleschema

```flex

```

* * *

## List all secrets

get `/v1/projects/{ref}/secrets`

Returns all secrets you've previously added to the specified project.

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## \[Beta\] Updates project's pgsodium config. Updating the root\_key can cause all data encrypted with the older key to become inaccessible.

put `/v1/projects/{ref}/pgsodium`

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- root\_keyRequiredstring


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Updates an API key for the project

patch `/v1/projects/{ref}/api-keys/{id}`

### Path parameters

- refRequiredstring



Project ref



Details

- idRequiredstring


### Query parameters

- revealOptionalboolean



Boolean string, true or false


### Body

application/json

- nameOptionalstring

Details

- descriptionOptionalstring

- secret\_jwt\_templateOptionalobject

Object schema


### Response codes

- 200
- 401
- 403
- 429

### Response (200)

exampleschema

```flex

```

* * *

## Disable or re-enable JWT based legacy (anon, service\_role) API keys. This API endpoint will be removed in the future, check for HTTP 404 Not Found.

put `/v1/projects/{ref}/api-keys/legacy`

### Path parameters

- refRequiredstring



Project ref



Details


### Query parameters

- enabledRequiredboolean



Boolean string, true or false


### Response codes

- 200
- 401
- 403
- 429

### Response (200)

exampleschema

```flex

```

* * *

## Gets project's storage config

get `/v1/projects/{ref}/config/storage`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Lists all buckets

get `/v1/projects/{ref}/storage/buckets`

### Path parameters

- refRequiredstring



Project ref



Details


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

exampleschema

```flex

```

* * *

## Updates project's storage config

patch `/v1/projects/{ref}/config/storage`

### Path parameters

- refRequiredstring



Project ref



Details


### Body

application/json

- fileSizeLimitOptionalinteger

- featuresOptionalobject

Object schema

- externalOptionalobject

Object schema


### Response codes

- 200
- 401
- 403
- 429
- 500

### Response (200)

schema

```flex

```
