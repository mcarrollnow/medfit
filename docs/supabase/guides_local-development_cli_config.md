---
library: supabase
url: https://supabase.com/docs/guides/local-development/cli/config
title: Supabase CLI config | Supabase Docs
scraped: 2025-10-23T16:59:02.323Z
---

Local Development

# Supabase CLI config

* * *

A `supabase/config.toml` file is generated after running `supabase init`.

You can edit this file to change the settings for your locally running project. After you make changes, you will need to restart using `supabase stop` and then `supabase start` for the changes to take effect.

## General Config [\#](https://supabase.com/docs/guides/local-development/cli/config\#general-config)

### `project_id` [\#](https://supabase.com/docs/guides/local-development/cli/config\#project_id)

| Name | Default | Required |
| --- | --- | --- |
| project\_id | None | true |

Description

A string used to distinguish different Supabase projects on the same host. Defaults to the working directory name when running `supabase init`.

## Auth Config [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth-config)

### `auth.enabled` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.enabled)

| Name | Default | Required |
| --- | --- | --- |
| auth.enabled | true | false |

Description

Enable the local GoTrue service.

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.site_url` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.site_url)

| Name | Default | Required |
| --- | --- | --- |
| auth.site\_url | "http://localhost:3000" | false |

Description

The base URL of your website. Used as an allow-list for redirects and for constructing URLs used in emails.

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.additional_redirect_urls` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.additional_redirect_urls)

| Name | Default | Required |
| --- | --- | --- |
| auth.additional\_redirect\_urls | \["https://localhost:3000"\] | false |

Description

A list of _exact_ URLs that auth providers are permitted to redirect to post authentication.

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.jwt_expiry` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.jwt_expiry)

| Name | Default | Required |
| --- | --- | --- |
| auth.jwt\_expiry | 3600 | false |

Description

How long tokens are valid for, in seconds. Defaults to 3600 (1 hour), maximum 604,800 seconds (one week).

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.enable_manual_linking` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.enable_manual_linking)

| Name | Default | Required |
| --- | --- | --- |
| auth.enable\_manual\_linking | false | false |

Description

Allow testing manual linking of accounts

See also

- [Anonymous Sign Ins (Manual Linking)](https://supabase.com/docs/guides/auth/auth-anonymous?queryGroups=language&language=python#convert-an-anonymous-user-to-a-permanent-user)

### `auth.enable_refresh_token_rotation` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.enable_refresh_token_rotation)

| Name | Default | Required |
| --- | --- | --- |
| auth.enable\_refresh\_token\_rotation | true | false |

Description

If disabled, the refresh token will never expire.

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.refresh_token_reuse_interval` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.refresh_token_reuse_interval)

| Name | Default | Required |
| --- | --- | --- |
| auth.refresh\_token\_reuse\_interval | 10 | false |

Description

Allows refresh tokens to be reused after expiry, up to the specified interval in seconds. Requires enable\_refresh\_token\_rotation = true.

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.rate_limit.email_sent` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.rate_limit.email_sent)

| Name | Default | Required |
| --- | --- | --- |
| auth.rate\_limit.email\_sent | 2 | false |

Description

Number of emails that can be sent per hour. Requires auth.email.smtp to be enabled.

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.rate_limit.sms_sent` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.rate_limit.sms_sent)

| Name | Default | Required |
| --- | --- | --- |
| auth.rate\_limit.sms\_sent | 30 | false |

Description

Number of SMS messages that can be sent per hour. Requires auth.sms to be enabled.

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.rate_limit.anonymous_users` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.rate_limit.anonymous_users)

| Name | Default | Required |
| --- | --- | --- |
| auth.rate\_limit.anonymous\_users | 30 | false |

Description

Number of anonymous sign-ins that can be made per hour per IP address. Requires enable\_anonymous\_sign\_ins = true.

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.rate_limit.token_refresh` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.rate_limit.token_refresh)

| Name | Default | Required |
| --- | --- | --- |
| auth.rate\_limit.token\_refresh | 150 | false |

Description

Number of sessions that can be refreshed in a 5 minute interval per IP address.

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.rate_limit.sign_in_sign_ups` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.rate_limit.sign_in_sign_ups)

| Name | Default | Required |
| --- | --- | --- |
| auth.rate\_limit.sign\_in\_sign\_ups | 30 | false |

Description

Number of sign up and sign-in requests that can be made in a 5 minute interval per IP address (excludes anonymous users).

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.rate_limit.token_verifications` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.rate_limit.token_verifications)

| Name | Default | Required |
| --- | --- | --- |
| auth.rate\_limit.token\_verifications | 30 | false |

Description

Number of OTP / Magic link verifications that can be made in a 5 minute interval per IP address.

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.enable_signup` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.enable_signup)

| Name | Default | Required |
| --- | --- | --- |
| auth.enable\_signup | true | false |

Description

Allow/disallow new user signups to your project.

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.enable_anonymous_sign_ins` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.enable_anonymous_sign_ins)

| Name | Default | Required |
| --- | --- | --- |
| auth.enable\_anonymous\_sign\_ins | false | false |

Description

Allow/disallow anonymous sign-ins to your project.

See also

- [Anonymous Sign Ins](https://supabase.com/docs/guides/auth/auth-anonymous)

### `auth.email.enable_signup` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.email.enable_signup)

| Name | Default | Required |
| --- | --- | --- |
| auth.email.enable\_signup | true | false |

Description

Allow/disallow new user signups via email to your project.

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.email.double_confirm_changes` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.email.double_confirm_changes)

| Name | Default | Required |
| --- | --- | --- |
| auth.email.double\_confirm\_changes | true | false |

Description

If enabled, a user will be required to confirm any email change on both the old, and new email addresses. If disabled, only the new email is required to confirm.

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.email.enable_confirmations` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.email.enable_confirmations)

| Name | Default | Required |
| --- | --- | --- |
| auth.email.enable\_confirmations | false | false |

Description

If enabled, users need to confirm their email address before signing in.

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.email.secure_password_change` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.email.secure_password_change)

| Name | Default | Required |
| --- | --- | --- |
| auth.email.secure\_password\_change | None | false |

Description

If enabled, requires the user's current password to be provided when changing to a new password.

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.email.max_frequency` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.email.max_frequency)

| Name | Default | Required |
| --- | --- | --- |
| auth.email.max\_frequency | 1m | false |

Description

The minimum amount of time that must pass between email requests.
Helps prevent email spam by limiting how frequently emails can be sent.
Example values: "1m", "1h", "24h"

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.email.otp_length` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.email.otp_length)

| Name | Default | Required |
| --- | --- | --- |
| auth.email.otp\_length | 6 | false |

Description

The length of the OTP code to be sent in emails.
Must be between 6 and 10 digits.

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.email.otp_expiry` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.email.otp_expiry)

| Name | Default | Required |
| --- | --- | --- |
| auth.email.otp\_expiry | 3600 | false |

Description

The expiry time for an OTP code in seconds.
Default is 3600 seconds (1 hour).

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.email.smtp.host` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.email.smtp.host)

| Name | Default | Required |
| --- | --- | --- |
| auth.email.smtp.host | inbucket | false |

Description

Hostname or IP address of the SMTP server.

### `auth.email.smtp.port` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.email.smtp.port)

| Name | Default | Required |
| --- | --- | --- |
| auth.email.smtp.port | 2500 | false |

Description

Port number of the SMTP server.

### `auth.email.smtp.user` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.email.smtp.user)

| Name | Default | Required |
| --- | --- | --- |
| auth.email.smtp.user | None | false |

Description

Username for authenticating with the SMTP server.

### `auth.email.smtp.pass` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.email.smtp.pass)

| Name | Default | Required |
| --- | --- | --- |
| auth.email.smtp.pass | None | false |

Description

Password for authenticating with the SMTP server.

### `auth.email.smtp.admin_email` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.email.smtp.admin_email)

| Name | Default | Required |
| --- | --- | --- |
| auth.email.smtp.admin\_email | admin@email.com | false |

Description

Email used as the sender for emails sent from the application.

### `auth.email.smtp.sender_name` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.email.smtp.sender_name)

| Name | Default | Required |
| --- | --- | --- |
| auth.email.smtp.sender\_name | None | false |

Description

Display name used as the sender for emails sent from the application.

### `auth.email.template.<type>.subject` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.email.template.type.subject)

| Name | Default | Required |
| --- | --- | --- |
| auth.email.template.type.subject | None | false |

Description

The full list of email template types are:

- `invite`
- `confirmation`
- `recovery`
- `magic_link`
- `email_change`

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.email.template.<type>.content_path` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.email.template.type.content_path)

| Name | Default | Required |
| --- | --- | --- |
| auth.email.template.type.content\_path | None | false |

Description

The full list of email template types are:

- `invite`
- `confirmation`
- `recovery`
- `magic_link`
- `email_change`

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.sms.enable_signup` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.sms.enable_signup)

| Name | Default | Required |
| --- | --- | --- |
| auth.sms.enable\_signup | true | false |

Description

Allow/disallow new user signups via SMS to your project.

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.sms.enable_confirmations` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.sms.enable_confirmations)

| Name | Default | Required |
| --- | --- | --- |
| auth.sms.enable\_confirmations | false | false |

Description

If enabled, users need to confirm their phone number before signing in.

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.sms.test_otp` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.sms.test_otp)

| Name | Default | Required |
| --- | --- | --- |
| auth.sms.test\_otp | None | false |

Description

Use pre-defined map of phone number to OTP for testing.

Usage

```py
1[auth.sms.test_otp]
24152127777 = "123456"
```

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.sms.<provider>.enabled` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.sms.provider.enabled)

| Name | Default | Required |
| --- | --- | --- |
| auth.sms.provider.enabled | false | false |

Description

Use an external SMS provider. The full list of providers are:

- `twilio`
- `twilio_verify`
- `messagebird`
- `textlocal`
- `vonage`

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.sms.<twilio|twilio_verify>.account_sid` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.sms.twilio.account_sid)

| Name | Default | Required |
| --- | --- | --- |
| auth.sms.twilio.account\_sid | None | true |

Description

Twilio Account SID

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.sms.<twilio|twilio_verify>.message_service_sid` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.sms.twilio.message_service_sid)

| Name | Default | Required |
| --- | --- | --- |
| auth.sms.twilio.message\_service\_sid | None | true |

Description

Twilio Message Service SID

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.sms.<twilio|twilio_verify>.auth_token` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.sms.twilio.auth_token)

| Name | Default | Required |
| --- | --- | --- |
| auth.sms.twilio.auth\_token | env(SUPABASE\_AUTH\_SMS\_TWILIO\_AUTH\_TOKEN) | true |

Description

Twilio Auth Token

DO NOT commit your Twilio auth token to git. Use environment variable substitution instead.

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.sms.messagebird.originator` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.sms.messagebird.originator)

| Name | Default | Required |
| --- | --- | --- |
| auth.sms.messagebird.originator | None | true |

Description

MessageBird Originator

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.sms.messagebird.access_key` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.sms.messagebird.access_key)

| Name | Default | Required |
| --- | --- | --- |
| auth.sms.messagebird.access\_key | env(SUPABASE\_AUTH\_SMS\_MESSAGEBIRD\_ACCESS\_KEY) | true |

Description

MessageBird Access Key

DO NOT commit your MessageBird access key to git. Use environment variable substitution instead.

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.sms.textlocal.sender` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.sms.textlocal.sender)

| Name | Default | Required |
| --- | --- | --- |
| auth.sms.textlocal.sender | None | true |

Description

TextLocal Sender

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.sms.textlocal.api_key` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.sms.textlocal.api_key)

| Name | Default | Required |
| --- | --- | --- |
| auth.sms.textlocal.api\_key | env(SUPABASE\_AUTH\_SMS\_TEXTLOCAL\_API\_KEY) | true |

Description

TextLocal API Key

DO NOT commit your TextLocal API key to git. Use environment variable substitution instead.

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.sms.vonage.from` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.sms.vonage.from)

| Name | Default | Required |
| --- | --- | --- |
| auth.sms.vonage.from | None | true |

Description

Vonage From

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.sms.vonage.api_key` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.sms.vonage.api_key)

| Name | Default | Required |
| --- | --- | --- |
| auth.sms.vonage.api\_key | None | true |

Description

Vonage API Key

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.sms.vonage.api_secret` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.sms.vonage.api_secret)

| Name | Default | Required |
| --- | --- | --- |
| auth.sms.vonage.api\_secret | env(SUPABASE\_AUTH\_SMS\_VONAGE\_API\_SECRET) | true |

Description

Vonage API Secret

DO NOT commit your Vonage API secret to git. Use environment variable substitution instead.

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.external.<provider>.enabled` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.external.provider.enabled)

| Name | Default | Required |
| --- | --- | --- |
| auth.external.provider.enabled | false | false |

Description

Use an external OAuth provider. The full list of providers are:

- `apple`
- `azure`
- `bitbucket`
- `discord`
- `facebook`
- `github`
- `gitlab`
- `google`
- `kakao`
- `keycloak`
- `linkedin_oidc`
- `notion`
- `twitch`
- `twitter`
- `slack_oidc`
- `spotify`
- `workos`
- `zoom`

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.external.<provider>.client_id` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.external.provider.client_id)

| Name | Default | Required |
| --- | --- | --- |
| auth.external.provider.client\_id | None | true |

Description

Client ID for the external OAuth provider.

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.external.<provider>.secret` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.external.provider.secret)

| Name | Default | Required |
| --- | --- | --- |
| auth.external.provider.secret | env(SUPABASE\_AUTH\_EXTERNAL\_<PROVIDER>\_SECRET) | true |

Description

Client secret for the external OAuth provider.

DO NOT commit your OAuth provider secret to git. Use environment variable substitution instead.

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.external.<provider>.url` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.external.provider.url)

| Name | Default | Required |
| --- | --- | --- |
| auth.external.provider.url | None | false |

Description

The base URL used for constructing the URLs to request authorization and
access tokens. Used by gitlab and keycloak. For gitlab it defaults to
https://gitlab.com. For keycloak you need to set this to your instance,
for example: https://keycloak.example.com/realms/myrealm .

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.external.<provider>.redirect_uri` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.external.provider.redirect_uri)

| Name | Default | Required |
| --- | --- | --- |
| auth.external.provider.redirect\_uri | None | false |

Description

The URI a OAuth2 provider will redirect to with the code and state values.

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.external.<provider>.skip_nonce_check` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.external.provider.skip_nonce_check)

| Name | Default | Required |
| --- | --- | --- |
| auth.external.provider.skip\_nonce\_check | None | false |

Description

Disables nonce validation during OIDC authentication flow for the specified provider. Enable only when client libraries cannot properly handle nonce verification. Be aware that this reduces security by allowing potential replay attacks with stolen ID tokens.

See also

- [Auth Server configuration](https://supabase.com/docs/reference/auth)

### `auth.hook.<hook_name>.enabled` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.hook.%3Chook_name%3E.enabled)

| Name | Default | Required |
| --- | --- | --- |
| auth.hook.<hook\_name>.enabled | false | false |

Description

Enable Auth Hook. Possible values for `hook_name` are: `custom_access_token`, `send_sms`, `send_email`, `mfa_verification_attempt`, and `password_verification_attempt`.

See also

- [Auth Hooks](https://supabase.com/docs/guides/auth/auth-hooks)

### `auth.hook.<hook_name>.uri` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.hook.%3Chook_name%3E.uri)

| Name | Default | Required |
| --- | --- | --- |
| auth.hook.<hook\_name>.uri | None | false |

Description

URI of hook to invoke. Should be a http or https function or Postgres function taking the form: `pg-functions://<database>/<schema>/<function-name>`. For example, `pg-functions://postgres/auth/custom-access-token-hook`.

See also

- [Auth Hooks](https://supabase.com/docs/guides/auth/auth-hooks)

### `auth.hook.<hook_name>.secrets` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.hook.%3Chook_name%3E.secrets)

| Name | Default | Required |
| --- | --- | --- |
| auth.hook.<hook\_name>.secrets | None | false |

Description

Configure when using a HTTP Hooks. Takes a list of base64 comma separated values to allow for secret rotation. Currently, Supabase Auth uses only the first value in the list.

See also

- [Auth Hooks](https://supabase.com/docs/guides/auth/auth-hooks?queryGroups=language&language=http)

### `auth.mfa.totp.enroll_enabled` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.mfa.totp.enroll_enabled)

| Name | Default | Required |
| --- | --- | --- |
| auth.mfa.totp.enroll\_enabled | true | false |

Description

Enable TOTP enrollment for multi-factor authentication.

See also

- [Auth Multi-Factor Authentication (TOTP)](https://supabase.com/docs/guides/auth/auth-mfa/totp)

### `auth.mfa.totp.verify_enabled` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.mfa.totp.verify_enabled)

| Name | Default | Required |
| --- | --- | --- |
| auth.mfa.totp.verify\_enabled | true | false |

Description

Enable TOTP verification for multi-factor authentication.

See also

- [Auth Multi-Factor Authentication (TOTP)](https://supabase.com/docs/guides/auth/auth-mfa/totp)

### `auth.mfa.max_enrolled_factors` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.mfa.max_enrolled_factors)

| Name | Default | Required |
| --- | --- | --- |
| auth.mfa.max\_enrolled\_factors | 10 | false |

Description

Control how many MFA factors can be enrolled at once per user.

See also

- [Auth Multi-Factor Authentication (TOTP)](https://supabase.com/docs/guides/auth/auth-mfa/totp)

### `auth.mfa.phone.enroll_enabled` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.mfa.phone.enroll_enabled)

| Name | Default | Required |
| --- | --- | --- |
| auth.mfa.phone.enroll\_enabled | false | false |

Description

Enable Phone enrollment for multi-factor authentication.

See also

- [Auth Multi-Factor Authentication (Phone)](https://supabase.com/docs/guides/auth/auth-mfa/phone)

### `auth.mfa.phone.otp_length` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.mfa.phone.otp_length)

| Name | Default | Required |
| --- | --- | --- |
| auth.mfa.phone.otp\_length | 6 | false |

Description

Length of OTP code sent when using phone multi-factor authentication

See also

- [Auth Multi-Factor Authentication (Phone)](https://supabase.com/docs/guides/auth/auth-mfa/phone)

### `auth.mfa.phone.max_frequency` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.mfa.phone.max_frequency)

| Name | Default | Required |
| --- | --- | --- |
| auth.mfa.phone.max\_frequency | 10s | false |

Description

The minimum amount of time that must pass between phone requests.
Helps prevent spam by limiting how frequently messages can be sent.
Example values: "10s", "20s", "1m"

See also

- [Auth Multi-Factor Authentication (Phone)](https://supabase.com/docs/guides/auth/auth-mfa/phone)

### `auth.mfa.phone.otp_length` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.mfa.phone.otp_length)

| Name | Default | Required |
| --- | --- | --- |
| auth.mfa.phone.otp\_length | 6 | false |

Description

Length of OTP sent when using phone multi-factor authentication

See also

- [Auth Multi-Factor Authentication (Phone)](https://supabase.com/docs/guides/auth/auth-mfa/phone)

### `auth.mfa.phone.verify_enabled` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.mfa.phone.verify_enabled)

| Name | Default | Required |
| --- | --- | --- |
| auth.mfa.phone.verify\_enabled | false | false |

Description

Enable Phone verification for multi-factor authentication.

See also

- [Auth Multi-Factor Authentication (Phone)](https://supabase.com/docs/guides/auth/auth-mfa/phone)

### `auth.mfa.web_authn.enroll_enabled` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.mfa.web_authn.enroll_enabled)

| Name | Default | Required |
| --- | --- | --- |
| auth.mfa.web\_authn.enroll\_enabled | false | false |

Description

Enable WebAuthn enrollment for multi-factor authentication.

See also

- [Auth Multi-Factor Authentication](https://supabase.com/docs/guides/auth/auth-mfa)

### `auth.mfa.web_authn.verify_enabled` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.mfa.web_authn.verify_enabled)

| Name | Default | Required |
| --- | --- | --- |
| auth.mfa.web\_authn.verify\_enabled | false | false |

Description

Enable WebAuthn verification for multi-factor authentication.

See also

- [Auth Multi-Factor Authentication](https://supabase.com/docs/guides/auth/auth-mfa)

### `auth.sessions.timebox` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.sessions.timebox)

| Name | Default | Required |
| --- | --- | --- |
| auth.sessions.timebox | None | false |

Description

Force log out after the specified duration. Sample values include: '50m', '20h'.

See also

- [Auth Sessions](https://supabase.com/docs/guides/auth/sessions)

### `auth.sessions.inactivity_timeout` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.sessions.inactivity_timeout)

| Name | Default | Required |
| --- | --- | --- |
| auth.sessions.inactivity\_timeout | None | false |

Description

Force log out if the user has been inactive longer than the specified duration. Sample values include: '50m', '20h'.

See also

- [Auth Sessions](https://supabase.com/docs/guides/auth/sessions)

### `auth.third_party.aws_cognito.enabled` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.third_party.aws_cognito.enabled)

| Name | Default | Required |
| --- | --- | --- |
| auth.third\_party.aws\_cognito.enabled | false | false |

Description

Enable third party auth with AWS Cognito (Amplify)

See also

- [Third Party Auth (Cognito)](https://supabase.com/docs/guides/auth/third-party/aws-cognito)

### `auth.third_party.aws_cognito.user_pool_id` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.third_party.aws_cognito.user_pool_id)

| Name | Default | Required |
| --- | --- | --- |
| auth.third\_party.aws\_cognito.user\_pool\_id | false | false |

Description

User Pool ID for AWS Cognito (Amplify) that you are integrating with

See also

- [Third Party Auth (Cognito)](https://supabase.com/docs/guides/auth/third-party/aws-cognito)

### `auth.third_party.aws_cognito.user_pool_region` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.third_party.aws_cognito.user_pool_region)

| Name | Default | Required |
| --- | --- | --- |
| auth.third\_party.aws\_cognito.user\_pool\_region | false | false |

Description

User Pool region for AWS Cognito (Amplify) that you are integrating with. Example values: 'ap-southeast-1', 'us-east-1'

See also

- [Third Party Auth (Cognito)](https://supabase.com/docs/guides/auth/third-party/aws-cognito)

### `auth.third_party.auth0.enabled` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.third_party.auth0.enabled)

| Name | Default | Required |
| --- | --- | --- |
| auth.third\_party.auth0.enabled | false | false |

Description

Enable third party auth with Auth0

See also

- [Third Party Auth (Auth0)](https://supabase.com/docs/guides/auth/third-party/auth0)

### `auth.third_party.auth0.tenant` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.third_party.auth0.tenant)

| Name | Default | Required |
| --- | --- | --- |
| auth.third\_party.auth0.tenant | false | false |

Description

Tenant Identifier for Auth0 instance that you are integrating with

See also

- [Third Party Auth (Auth0)](https://supabase.com/docs/guides/auth/third-party/auth0)

### `auth.third_party.tenant_region` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.third_party.auth0.tenant_region)

| Name | Default | Required |
| --- | --- | --- |
| auth.third\_party.auth0.tenant\_region | false | false |

Description

Tenant region for Auth0 instance that you are integrating with

See also

- [Third Party Auth (Auth0)](https://supabase.com/docs/guides/auth/third-party/auth0)

### `auth.third_party.firebase.enabled` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.third_party.firebase.enabled)

| Name | Default | Required |
| --- | --- | --- |
| auth.third\_party.firebase.enabled | false | false |

Description

Enable third party auth with Firebase

See also

- [Third Party Auth (Firebase)](https://supabase.com/docs/guides/auth/third-party/firebase-auth)

### `auth.third_party.firebase.project_id` [\#](https://supabase.com/docs/guides/local-development/cli/config\#auth.third_party.firebase.project_id)

| Name | Default | Required |
| --- | --- | --- |
| auth.third\_party.firebase.project\_id | false | false |

Description

Project ID for Firebase instance that you are integrating with

See also

- [Third Party Auth (Firebase)](https://supabase.com/docs/guides/auth/third-party/firebase-auth)

## API Config [\#](https://supabase.com/docs/guides/local-development/cli/config\#api-config)

### `api.enabled` [\#](https://supabase.com/docs/guides/local-development/cli/config\#api.enabled)

| Name | Default | Required |
| --- | --- | --- |
| api.enabled | true | false |

Description

Enable the local PostgREST service.

See also

- [PostgREST configuration](https://postgrest.org/en/stable/configuration.html)

### `api.port` [\#](https://supabase.com/docs/guides/local-development/cli/config\#api.port)

| Name | Default | Required |
| --- | --- | --- |
| api.port | 54321 | false |

Description

Port to use for the API URL.

Usage

```py
1[api]
2port = 54321
```

See also

- [PostgREST configuration](https://postgrest.org/en/stable/configuration.html)

### `api.schemas` [\#](https://supabase.com/docs/guides/local-development/cli/config\#api.schemas)

| Name | Default | Required |
| --- | --- | --- |
| api.schemas | \["public", "storage", "graphql\_public"\] | false |

Description

Schemas to expose in your API. Tables, views and functions in this schema will get API endpoints. `public` and `storage` are always included.

See also

- [PostgREST configuration](https://postgrest.org/en/stable/configuration.html)

### `api.extra_search_path` [\#](https://supabase.com/docs/guides/local-development/cli/config\#api.extra_search_path)

| Name | Default | Required |
| --- | --- | --- |
| api.extra\_search\_path | \["public", "extensions"\] | false |

Description

Extra schemas to add to the search\_path of every request. public is always included.

See also

- [PostgREST configuration](https://postgrest.org/en/stable/configuration.html)

### `api.max_rows` [\#](https://supabase.com/docs/guides/local-development/cli/config\#api.max_rows)

| Name | Default | Required |
| --- | --- | --- |
| api.max\_rows | 1000 | false |

Description

The maximum number of rows returned from a view, table, or stored procedure. Limits payload size for accidental or malicious requests.

See also

- [PostgREST configuration](https://postgrest.org/en/stable/configuration.html)

## Database Config [\#](https://supabase.com/docs/guides/local-development/cli/config\#database-config)

### `db.port` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.port)

| Name | Default | Required |
| --- | --- | --- |
| db.port | 54322 | false |

Description

Port to use for the local database URL.

See also

- [PostgreSQL configuration](https://postgrest.org/en/stable/configuration.html)

### `db.shadow_port` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.shadow_port)

| Name | Default | Required |
| --- | --- | --- |
| db.shadow\_port | 54320 | false |

Description

Port to use for the local shadow database.

See also

### `db.major_version` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.major_version)

| Name | Default | Required |
| --- | --- | --- |
| db.major\_version | 15 | false |

Description

The database major version to use. This has to be the same as your remote database's. Run `SHOW server_version;` on the remote database to check.

See also

- [PostgreSQL configuration](https://postgrest.org/en/stable/configuration.html)

### `db.pooler.enabled` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.pooler.enabled)

| Name | Default | Required |
| --- | --- | --- |
| db.pooler.enabled | false | false |

Description

Enable the local PgBouncer service.

See also

- [PgBouncer Configuration](https://www.pgbouncer.org/config.html)

### `db.pooler.port` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.pooler.port)

| Name | Default | Required |
| --- | --- | --- |
| db.pooler.port | 54329 | false |

Description

Port to use for the local connection pooler.

See also

- [PgBouncer Configuration](https://www.pgbouncer.org/config.html#listen_port)

### `db.pooler.pool_mode` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.pooler.pool_mode)

| Name | Default | Required |
| --- | --- | --- |
| db.pooler.pool\_mode | "transaction" | false |

Description

Specifies when a server connection can be reused by other clients. Configure one of the supported pooler modes: `transaction`, `session`.

See also

- [PgBouncer Configuration](https://www.pgbouncer.org/config.html#pool_mode)

### `db.pooler.default_pool_size` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.pooler.default_pool_size)

| Name | Default | Required |
| --- | --- | --- |
| db.pooler.default\_pool\_size | 20 | false |

Description

How many server connections to allow per user/database pair.

See also

- [PgBouncer Configuration](https://www.pgbouncer.org/config.html#default_pool_size)

### `db.settings.effective_cache_size` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.settings.effective_cache_size)

| Name | Default | Required |
| --- | --- | --- |
| db.settings.effective\_cache\_size | None | false |

Description

Sets the planner's assumption about the effective size of the disk cache.
This is a query planner parameter that doesn't affect actual memory allocation.

See also

- [PostgreSQL configuration](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-EFFECTIVE-CACHE-SIZE)

### `db.settings.logical_decoding_work_mem` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.settings.logical_decoding_work_mem)

| Name | Default | Required |
| --- | --- | --- |
| db.settings.logical\_decoding\_work\_mem | None | false |

Description

Specifies the amount of memory to be used by logical decoding, before writing data to local disk.

See also

- [PostgreSQL configuration](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-LOGICAL-DECODING-WORK-MEM)

### `db.settings.maintenance_work_mem` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.settings.maintenance_work_mem)

| Name | Default | Required |
| --- | --- | --- |
| db.settings.maintenance\_work\_mem | None | false |

Description

Specifies the maximum amount of memory to be used by maintenance operations, such as VACUUM, CREATE INDEX, and ALTER TABLE ADD FOREIGN KEY.

See also

- [PostgreSQL configuration](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAINTENANCE-WORK-MEM)

### `db.settings.max_connections` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.settings.max_connections)

| Name | Default | Required |
| --- | --- | --- |
| db.settings.max\_connections | None | false |

Description

Determines the maximum number of concurrent connections to the database server.
Note: Changing this parameter requires a database restart.

See also

- [PostgreSQL configuration](https://www.postgresql.org/docs/current/runtime-config-connection.html#GUC-MAX-CONNECTIONS)

### `db.settings.max_locks_per_transaction` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.settings.max_locks_per_transaction)

| Name | Default | Required |
| --- | --- | --- |
| db.settings.max\_locks\_per\_transaction | None | false |

Description

Controls the average number of object locks allocated for each transaction.
Note: Changing this parameter requires a database restart.

See also

- [PostgreSQL configuration](https://www.postgresql.org/docs/current/runtime-config-locks.html#GUC-MAX-LOCKS-PER-TRANSACTION)

### `db.settings.max_parallel_maintenance_workers` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.settings.max_parallel_maintenance_workers)

| Name | Default | Required |
| --- | --- | --- |
| db.settings.max\_parallel\_maintenance\_workers | None | false |

Description

Sets the maximum number of parallel workers that can be started by a single utility command.

See also

- [PostgreSQL configuration](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAX-PARALLEL-MAINTENANCE-WORKERS)

### `db.settings.max_parallel_workers` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.settings.max_parallel_workers)

| Name | Default | Required |
| --- | --- | --- |
| db.settings.max\_parallel\_workers | None | false |

Description

Sets the maximum number of parallel workers that the system can support.
Note: Changing this parameter requires a database restart.

See also

- [PostgreSQL configuration](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAX-PARALLEL-WORKERS)

### `db.settings.max_parallel_workers_per_gather` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.settings.max_parallel_workers_per_gather)

| Name | Default | Required |
| --- | --- | --- |
| db.settings.max\_parallel\_workers\_per\_gather | None | false |

Description

Sets the maximum number of parallel workers that can be started by a single Gather or Gather Merge node.

See also

- [PostgreSQL configuration](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAX-PARALLEL-WORKERS-PER-GATHER)

### `db.settings.max_replication_slots` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.settings.max_replication_slots)

| Name | Default | Required |
| --- | --- | --- |
| db.settings.max\_replication\_slots | None | false |

Description

Specifies the maximum number of replication slots that the server can support.
Note: Changing this parameter requires a database restart.

See also

- [PostgreSQL configuration](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-REPLICATION-SLOTS)

### `db.settings.max_slot_wal_keep_size` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.settings.max_slot_wal_keep_size)

| Name | Default | Required |
| --- | --- | --- |
| db.settings.max\_slot\_wal\_keep\_size | None | false |

Description

Specifies the maximum size of WAL files that replication slots are allowed to retain in the pg\_wal directory.

See also

- [PostgreSQL configuration](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-SLOT-WAL-KEEP-SIZE)

### `db.settings.max_standby_archive_delay` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.settings.max_standby_archive_delay)

| Name | Default | Required |
| --- | --- | --- |
| db.settings.max\_standby\_archive\_delay | None | false |

Description

Sets the maximum delay before canceling queries when a hot standby server is processing archived WAL data.

See also

- [PostgreSQL configuration](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-STANDBY-ARCHIVE-DELAY)

### `db.settings.max_standby_streaming_delay` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.settings.max_standby_streaming_delay)

| Name | Default | Required |
| --- | --- | --- |
| db.settings.max\_standby\_streaming\_delay | None | false |

Description

Sets the maximum delay before canceling queries when a hot standby server is processing streamed WAL data.

See also

- [PostgreSQL configuration](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-STANDBY-STREAMING-DELAY)

### `db.settings.max_wal_size` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.settings.max_wal_size)

| Name | Default | Required |
| --- | --- | --- |
| db.settings.max\_wal\_size | None | false |

Description

Sets the maximum size of WAL files that the system will keep in the pg\_wal directory.

See also

- [PostgreSQL configuration](https://www.postgresql.org/docs/current/runtime-config-wal.html#GUC-MAX-WAL-SIZE)

### `db.settings.max_wal_senders` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.settings.max_wal_senders)

| Name | Default | Required |
| --- | --- | --- |
| db.settings.max\_wal\_senders | None | false |

Description

Specifies the maximum number of concurrent connections from standby servers or streaming base backup clients.
Note: Changing this parameter requires a database restart.

See also

- [PostgreSQL configuration](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-MAX-WAL-SENDERS)

### `db.settings.max_worker_processes` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.settings.max_worker_processes)

| Name | Default | Required |
| --- | --- | --- |
| db.settings.max\_worker\_processes | None | false |

Description

Sets the maximum number of background processes that the system can support.
Note: Changing this parameter requires a database restart.

See also

- [PostgreSQL configuration](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-MAX-WORKER-PROCESSES)

### `db.settings.session_replication_role` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.settings.session_replication_role)

| Name | Default | Required |
| --- | --- | --- |
| db.settings.session\_replication\_role | None | false |

Description

Controls whether triggers and rewrite rules are enabled. Valid values are: "origin", "replica", or "local".

See also

- [PostgreSQL configuration](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-SESSION-REPLICATION-ROLE)

### `db.settings.shared_buffers` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.settings.shared_buffers)

| Name | Default | Required |
| --- | --- | --- |
| db.settings.shared\_buffers | None | false |

Description

Sets the amount of memory the database server uses for shared memory buffers.
Note: Changing this parameter requires a database restart.

See also

- [PostgreSQL configuration](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-SHARED-BUFFERS)

### `db.settings.statement_timeout` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.settings.statement_timeout)

| Name | Default | Required |
| --- | --- | --- |
| db.settings.statement\_timeout | None | false |

Description

Abort any statement that takes more than the specified amount of time.

See also

- [PostgreSQL configuration](https://www.postgresql.org/docs/current/runtime-config-client.html#GUC-STATEMENT-TIMEOUT)

### `db.settings.track_activity_query_size` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.settings.track_activity_query_size)

| Name | Default | Required |
| --- | --- | --- |
| db.settings.track\_activity\_query\_size | None | false |

Description

Sets the maximum size of the query string that will be tracked in pg\_stat\_activity.current\_query field.
Note: Changing this parameter requires a database restart.

See also

- [PostgreSQL configuration](https://www.postgresql.org/docs/current/runtime-config-statistics.html#GUC-TRACK-ACTIVITY-QUERY-SIZE)

### `db.settings.track_commit_timestamp` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.settings.track_commit_timestamp)

| Name | Default | Required |
| --- | --- | --- |
| db.settings.track\_commit\_timestamp | None | false |

Description

Record commit time of transactions.
Note: Changing this parameter requires a database restart.

See also

- [PostgreSQL configuration](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-TRACK-COMMIT-TIMESTAMP)

### `db.settings.wal_keep_size` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.settings.wal_keep_size)

| Name | Default | Required |
| --- | --- | --- |
| db.settings.wal\_keep\_size | None | false |

Description

Specifies the minimum size of past log file segments kept in the pg\_wal directory.

See also

- [PostgreSQL configuration](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-WAL-KEEP-SIZE)

### `db.settings.wal_sender_timeout` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.settings.wal_sender_timeout)

| Name | Default | Required |
| --- | --- | --- |
| db.settings.wal\_sender\_timeout | None | false |

Description

Terminate replication connections that are inactive for longer than this amount of time.

See also

- [PostgreSQL configuration](https://www.postgresql.org/docs/current/runtime-config-replication.html#GUC-WAL-SENDER-TIMEOUT)

### `db.settings.work_mem` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.settings.work_mem)

| Name | Default | Required |
| --- | --- | --- |
| db.settings.work\_mem | None | false |

Description

Specifies the amount of memory to be used by internal sort operations and hash tables before writing to temporary disk files.

See also

- [PostgreSQL configuration](https://www.postgresql.org/docs/current/runtime-config-resource.html#GUC-WORK-MEM)

### `db.pooler.max_client_conn` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.pooler.max_client_conn)

| Name | Default | Required |
| --- | --- | --- |
| db.pooler.max\_client\_conn | 100 | false |

Description

Maximum number of client connections allowed.

See also

- [PgBouncer Configuration](https://www.pgbouncer.org/config.html#max_client_conn)

### `db.seed.enabled` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.seed.enabled)

| Name | Default | Required |
| --- | --- | --- |
| db.seed.enabled | true | false |

Description

Enables running seeds when starting or resetting the database.

See also

### `db.seed.sql_paths` [\#](https://supabase.com/docs/guides/local-development/cli/config\#db.seed.sql_paths)

| Name | Default | Required |
| --- | --- | --- |
| db.seed.sql\_paths | \["./seed.sql"\] | false |

Description

An array of files or glob patterns to find seeds in.

See also

- [Seeding your database](https://supabase.com/docs/guides/cli/seeding-your-database)

## Dashboard Config [\#](https://supabase.com/docs/guides/local-development/cli/config\#dashboard-config)

### `studio.enabled` [\#](https://supabase.com/docs/guides/local-development/cli/config\#studio.enabled)

| Name | Default | Required |
| --- | --- | --- |
| studio.enabled | true | false |

Description

Enable the local Supabase Studio dashboard.

See also

### `studio.port` [\#](https://supabase.com/docs/guides/local-development/cli/config\#studio.port)

| Name | Default | Required |
| --- | --- | --- |
| studio.port | 54323 | false |

Description

Port to use for Supabase Studio.

See also

### `studio.api_url` [\#](https://supabase.com/docs/guides/local-development/cli/config\#studio.api_url)

| Name | Default | Required |
| --- | --- | --- |
| studio.api\_url | "http://localhost" | false |

Description

External URL of the API server that frontend connects to.

See also

### `studio.openai_api_key` [\#](https://supabase.com/docs/guides/local-development/cli/config\#studio.openai_api_key)

| Name | Default | Required |
| --- | --- | --- |
| studio.openai\_api\_key | env(OPENAI\_API\_KEY) | false |

Description

OpenAI API key used for AI features in the Studio dashboard.
DO NOT commit your OpenAI API key to git. Use environment variable substitution instead.

See also

- [OpenAI API Keys](https://platform.openai.com/api-keys)

## Realtime Config [\#](https://supabase.com/docs/guides/local-development/cli/config\#realtime-config)

### `realtime.enabled` [\#](https://supabase.com/docs/guides/local-development/cli/config\#realtime.enabled)

| Name | Default | Required |
| --- | --- | --- |
| realtime.enabled | true | false |

Description

Enable the local Realtime service.

See also

### `realtime.ip_version` [\#](https://supabase.com/docs/guides/local-development/cli/config\#realtime.ip_version)

| Name | Default | Required |
| --- | --- | --- |
| realtime.ip\_version | "IPv6" | false |

Description

Bind realtime via either IPv4 or IPv6. (default: IPv6)

See also

## Storage Config [\#](https://supabase.com/docs/guides/local-development/cli/config\#storage-config)

### `storage.enabled` [\#](https://supabase.com/docs/guides/local-development/cli/config\#storage.enabled)

| Name | Default | Required |
| --- | --- | --- |
| storage.enabled | true | false |

Description

Enable the local Storage service.

See also

- [Storage server configuration](https://supabase.com/docs/guides/self-hosting/storage/config)

### `storage.file_size_limit` [\#](https://supabase.com/docs/guides/local-development/cli/config\#storage.file_size_limit)

| Name | Default | Required |
| --- | --- | --- |
| storage.file\_size\_limit | "50MiB" | false |

Description

The maximum file size allowed for all buckets in the project.

See also

- [Storage server configuration](https://supabase.com/docs/guides/self-hosting/storage/config)

### `storage.buckets.<bucket_name>.public` [\#](https://supabase.com/docs/guides/local-development/cli/config\#storage.buckets.bucket_name.public)

| Name | Default | Required |
| --- | --- | --- |
| storage.buckets.bucket\_name.public | false | false |

Description

Enable public access to the bucket.

See also

- [Storage server configuration](https://supabase.com/docs/guides/self-hosting/storage/config)

### `storage.buckets.<bucket_name>.file_size_limit` [\#](https://supabase.com/docs/guides/local-development/cli/config\#storage.buckets.bucket_name.file_size_limit)

| Name | Default | Required |
| --- | --- | --- |
| storage.buckets.bucket\_name.file\_size\_limit | None | false |

Description

The maximum file size allowed (e.g. "5MB", "500KB").

See also

- [Storage server configuration](https://supabase.com/docs/guides/self-hosting/storage/config)

### `storage.buckets.<bucket_name>.allowed_mime_types` [\#](https://supabase.com/docs/guides/local-development/cli/config\#storage.buckets.bucket_name.allowed_mime_types)

| Name | Default | Required |
| --- | --- | --- |
| storage.buckets.bucket\_name.allowed\_mime\_types | None | false |

Description

The list of allowed MIME types for objects in the bucket.

See also

- [Storage server configuration](https://supabase.com/docs/guides/self-hosting/storage/config)

### `storage.buckets.<bucket_name>.objects_path` [\#](https://supabase.com/docs/guides/local-development/cli/config\#storage.buckets.bucket_name.objects_path)

| Name | Default | Required |
| --- | --- | --- |
| storage.buckets.bucket\_name.objects\_path | None | false |

Description

The local directory to upload objects to the bucket.

See also

- [Storage server configuration](https://supabase.com/docs/guides/self-hosting/storage/config)

## Edge-Functions Config [\#](https://supabase.com/docs/guides/local-development/cli/config\#edge-functions-config)

### `edge_runtime.enabled` [\#](https://supabase.com/docs/guides/local-development/cli/config\#edge_runtime.enabled)

| Name | Default | Required |
| --- | --- | --- |
| edge\_runtime.enabled | true | false |

Description

Enable the local Edge Runtime service for Edge Functions.

See also

### `edge_runtime.policy` [\#](https://supabase.com/docs/guides/local-development/cli/config\#edge_runtime.policy)

| Name | Default | Required |
| --- | --- | --- |
| edge\_runtime.policy | "oneshot" | false |

Description

Configure the request handling policy for Edge Functions. Available options:

- `oneshot`: Recommended for development with hot reload support
- `per_worker`: Recommended for load testing scenarios

See also

### `edge_runtime.inspector_port` [\#](https://supabase.com/docs/guides/local-development/cli/config\#edge_runtime.inspector_port)

| Name | Default | Required |
| --- | --- | --- |
| edge\_runtime.inspector\_port | 8083 | false |

Description

Port to attach the Chrome inspector for debugging Edge Functions.

See also

### `functions.<function_name>.enabled` [\#](https://supabase.com/docs/guides/local-development/cli/config\#functions.function_name.enabled)

| Name | Default | Required |
| --- | --- | --- |
| functions.function\_name.enabled | true | false |

Description

Controls whether a function is deployed or served. When set to false,
the function will be skipped during deployment and won't be served locally.
This is useful for disabling demo functions or temporarily disabling a function
without removing its code.

See also

- [\`supabase functions\` CLI subcommands](https://supabase.com/docs/reference/cli/supabase-functions)

### `functions.<function_name>.verify_jwt` [\#](https://supabase.com/docs/guides/local-development/cli/config\#functions.function_name.verify_jwt)

| Name | Default | Required |
| --- | --- | --- |
| functions.function\_name.verify\_jwt | true | false |

Description

By default, when you deploy your Edge Functions or serve them locally, it
will reject requests without a valid JWT in the Authorization header.
Setting this configuration changes the default behavior.

Note that the `--no-verify-jwt` flag overrides this configuration.

See also

- [\`supabase functions\` CLI subcommands](https://supabase.com/docs/reference/cli/supabase-functions)

### `functions.<function_name>.import_map` [\#](https://supabase.com/docs/guides/local-development/cli/config\#functions.function_name.import_map)

| Name | Default | Required |
| --- | --- | --- |
| functions.function\_name.import\_map | None | false |

Description

Specify the Deno import map file to use for the Function.
When not specified, defaults to `supabase/functions/<function_name>/deno.json`.

Note that the `--import-map` flag overrides this configuration.

See also

- [\`supabase functions\` CLI subcommands](https://supabase.com/docs/reference/cli/supabase-functions)

### `functions.<function_name>.entrypoint` [\#](https://supabase.com/docs/guides/local-development/cli/config\#functions.function_name.entrypoint)

| Name | Default | Required |
| --- | --- | --- |
| functions.function\_name.entrypoint | None | false |

Description

Specify a custom entrypoint path for the function relative to the project root.
When not specified, defaults to `supabase/functions/<function_name>/index.ts`.

Usage

```py
1[functions.my_function]
2entrypoint = "path/to/custom/function.ts"
```

See also

- [\`supabase functions\` CLI subcommands](https://supabase.com/docs/reference/cli/supabase-functions)

### `functions.<function_name>.static_files` [\#](https://supabase.com/docs/guides/local-development/cli/config\#functions.function_name.static_files)

| Name | Default | Required |
| --- | --- | --- |
| functions.function\_name.static\_files | None | false |

Description

Specify an array of static files to be bundled with the function. Supports glob patterns.

NOTE: only file paths within `functions` directory are supported at the moment.

Usage

```py
1[functions.my_function]
2static_files = [ "./functions/MY_FUNCTION_NAME/*.html", "./functions/MY_FUNCTION_NAME/custom.wasm" ]
```

See also

- [\`supabase functions\` CLI subcommands](https://supabase.com/docs/reference/cli/supabase-functions)

## Analytics Config [\#](https://supabase.com/docs/guides/local-development/cli/config\#analytics-config)

### `analytics.enabled` [\#](https://supabase.com/docs/guides/local-development/cli/config\#analytics.enabled)

| Name | Default | Required |
| --- | --- | --- |
| analytics.enabled | false | false |

Description

Enable the local Logflare service.

See also

- [Self-hosted Logflare Configuration](https://supabase.com/docs/reference/self-hosting-analytics/list-endpoints#getting-started)

### `analytics.port` [\#](https://supabase.com/docs/guides/local-development/cli/config\#analytics.port)

| Name | Default | Required |
| --- | --- | --- |
| analytics.port | 54327 | false |

Description

Port to the local Logflare service.

See also

### `analytics.vector_port` [\#](https://supabase.com/docs/guides/local-development/cli/config\#analytics.vector_port)

| Name | Default | Required |
| --- | --- | --- |
| analytics.vector\_port | 54328 | false |

Description

Port to the local syslog ingest service.

See also

### `analytics.backend` [\#](https://supabase.com/docs/guides/local-development/cli/config\#analytics.backend)

| Name | Default | Required |
| --- | --- | --- |
| analytics.backend | "postgres" | false |

Description

Configure one of the supported backends:

- `postgres`
- `bigquery`

See also

- [Self-hosted Logflare Configuration](https://supabase.com/docs/reference/self-hosting-analytics/list-endpoints#getting-started)

## Experimental Config [\#](https://supabase.com/docs/guides/local-development/cli/config\#experimental-config)

### `experimental.webhooks.enabled` [\#](https://supabase.com/docs/guides/local-development/cli/config\#experimental.webhooks.enabled)

| Name | Default | Required |
| --- | --- | --- |
| experimental.webhooks.enabled | false | false |

Description

Automatically enable webhook features on each new created branch
Note: This is an experimental feature and may change in future releases.

See also

### `experimental.orioledb_version` [\#](https://supabase.com/docs/guides/local-development/cli/config\#experimental.orioledb_version)

| Name | Default | Required |
| --- | --- | --- |
| experimental.orioledb\_version | None | false |

Description

Configures Postgres storage engine to use OrioleDB with S3 support.
Note: This is an experimental feature and may change in future releases.

See also

### `experimental.s3_host` [\#](https://supabase.com/docs/guides/local-development/cli/config\#experimental.s3_host)

| Name | Default | Required |
| --- | --- | --- |
| experimental.s3\_host | env(S3\_HOST) | false |

Description

Configures S3 bucket URL for OrioleDB storage.
Format example: <bucket\_name>.s3-<region>.amazonaws.com
Note: This is an experimental feature and may change in future releases.

See also

### `experimental.s3_region` [\#](https://supabase.com/docs/guides/local-development/cli/config\#experimental.s3_region)

| Name | Default | Required |
| --- | --- | --- |
| experimental.s3\_region | env(S3\_REGION) | false |

Description

Configures S3 bucket region for OrioleDB storage.
Example: us-east-1
Note: This is an experimental feature and may change in future releases.

See also

### `experimental.s3_access_key` [\#](https://supabase.com/docs/guides/local-development/cli/config\#experimental.s3_access_key)

| Name | Default | Required |
| --- | --- | --- |
| experimental.s3\_access\_key | env(S3\_ACCESS\_KEY) | false |

Description

Configures AWS\_ACCESS\_KEY\_ID for S3 bucket access.
DO NOT commit your AWS access key to git. Use environment variable substitution instead.
Note: This is an experimental feature and may change in future releases.

See also

### `experimental.s3_secret_key` [\#](https://supabase.com/docs/guides/local-development/cli/config\#experimental.s3_secret_key)

| Name | Default | Required |
| --- | --- | --- |
| experimental.s3\_secret\_key | env(S3\_SECRET\_KEY) | false |

Description

Configures AWS\_SECRET\_ACCESS\_KEY for S3 bucket access.
DO NOT commit your AWS secret key to git. Use environment variable substitution instead.
Note: This is an experimental feature and may change in future releases.

See also

## Local Development Config [\#](https://supabase.com/docs/guides/local-development/cli/config\#local-development-config)

### `inbucket.enabled` [\#](https://supabase.com/docs/guides/local-development/cli/config\#inbucket.enabled)

| Name | Default | Required |
| --- | --- | --- |
| inbucket.enabled | true | false |

Description

Enable the local InBucket service.

See also

- [Inbucket documentation](https://www.inbucket.org/)

### `inbucket.port` [\#](https://supabase.com/docs/guides/local-development/cli/config\#inbucket.port)

| Name | Default | Required |
| --- | --- | --- |
| inbucket.port | 54324 | false |

Description

Port to use for the email testing server web interface.

Emails sent with the local dev setup are not actually sent - rather, they are monitored, and you can view the emails that would have been sent from the web interface.

See also

- [Inbucket documentation](https://www.inbucket.org/)

### `inbucket.smtp_port` [\#](https://supabase.com/docs/guides/local-development/cli/config\#inbucket.smtp_port)

| Name | Default | Required |
| --- | --- | --- |
| inbucket.smtp\_port | 54325 | false |

Description

Port to use for the email testing server SMTP port.

Emails sent with the local dev setup are not actually sent - rather, they are monitored, and you can view the emails that would have been sent from the web interface.

If set, you can access the SMTP server from this port.

See also

- [Inbucket documentation](https://www.inbucket.org/)

### `inbucket.pop3_port` [\#](https://supabase.com/docs/guides/local-development/cli/config\#inbucket.pop3_port)

| Name | Default | Required |
| --- | --- | --- |
| inbucket.pop3\_port | 54326 | false |

Description

Port to use for the email testing server POP3 port.

Emails sent with the local dev setup are not actually sent - rather, they are monitored, and you can view the emails that would have been sent from the web interface.

If set, you can access the POP3 server from this port.

See also

- [Inbucket documentation](https://www.inbucket.org/)

### `inbucket.admin_email` [\#](https://supabase.com/docs/guides/local-development/cli/config\#inbucket.admin_email)

| Name | Default | Required |
| --- | --- | --- |
| inbucket.admin\_email | admin@email.com | false |

Description

Email used as the sender for emails sent from the application.

### `inbucket.sender_name` [\#](https://supabase.com/docs/guides/local-development/cli/config\#inbucket.sender_name)

| Name | Default | Required |
| --- | --- | --- |
| inbucket.sender\_name | Admin | false |

Description

Display name used as the sender for emails sent from the application.

## Branching Config [\#](https://supabase.com/docs/guides/local-development/cli/config\#branching-config)

### `remotes.<branch_name>.project_id` [\#](https://supabase.com/docs/guides/local-development/cli/config\#remotes.branch_name.project_id)

| Name | Default | Required |
| --- | --- | --- |
| remotes.branch\_name.project\_id | None | true |

Description

The project reference ID for a specific persistent Supabase branch.
This ID is used to configure branch-specific settings in your config.toml file for branches deployments.
All other configuration options available in the root config are also supported in the remotes block.
For example, you can specify branch-specific database settings like so:

Usage

```py
1[remotes.<branch_name>]
2project_id = "your-project-ref"
3
4[remotes.<branch_name>.db.seed]
5sql_paths = ["./seeds/staging.sql"]
```

### Is this helpful?

NoYes

### On this page

[General Config](https://supabase.com/docs/guides/local-development/cli/config#general-config) [project\_id](https://supabase.com/docs/guides/local-development/cli/config#project_id) [Auth Config](https://supabase.com/docs/guides/local-development/cli/config#auth-config) [auth.enabled](https://supabase.com/docs/guides/local-development/cli/config#auth.enabled) [auth.site\_url](https://supabase.com/docs/guides/local-development/cli/config#auth.site_url) [auth.additional\_redirect\_urls](https://supabase.com/docs/guides/local-development/cli/config#auth.additional_redirect_urls) [auth.jwt\_expiry](https://supabase.com/docs/guides/local-development/cli/config#auth.jwt_expiry) [auth.enable\_manual\_linking](https://supabase.com/docs/guides/local-development/cli/config#auth.enable_manual_linking) [auth.enable\_refresh\_token\_rotation](https://supabase.com/docs/guides/local-development/cli/config#auth.enable_refresh_token_rotation) [auth.refresh\_token\_reuse\_interval](https://supabase.com/docs/guides/local-development/cli/config#auth.refresh_token_reuse_interval) [auth.rate\_limit.email\_sent](https://supabase.com/docs/guides/local-development/cli/config#auth.rate_limit.email_sent) [auth.rate\_limit.sms\_sent](https://supabase.com/docs/guides/local-development/cli/config#auth.rate_limit.sms_sent) [auth.rate\_limit.anonymous\_users](https://supabase.com/docs/guides/local-development/cli/config#auth.rate_limit.anonymous_users) [auth.rate\_limit.token\_refresh](https://supabase.com/docs/guides/local-development/cli/config#auth.rate_limit.token_refresh) [auth.rate\_limit.sign\_in\_sign\_ups](https://supabase.com/docs/guides/local-development/cli/config#auth.rate_limit.sign_in_sign_ups) [auth.rate\_limit.token\_verifications](https://supabase.com/docs/guides/local-development/cli/config#auth.rate_limit.token_verifications) [auth.enable\_signup](https://supabase.com/docs/guides/local-development/cli/config#auth.enable_signup) [auth.enable\_anonymous\_sign\_ins](https://supabase.com/docs/guides/local-development/cli/config#auth.enable_anonymous_sign_ins) [auth.email.enable\_signup](https://supabase.com/docs/guides/local-development/cli/config#auth.email.enable_signup) [auth.email.double\_confirm\_changes](https://supabase.com/docs/guides/local-development/cli/config#auth.email.double_confirm_changes) [auth.email.enable\_confirmations](https://supabase.com/docs/guides/local-development/cli/config#auth.email.enable_confirmations) [auth.email.secure\_password\_change](https://supabase.com/docs/guides/local-development/cli/config#auth.email.secure_password_change) [auth.email.max\_frequency](https://supabase.com/docs/guides/local-development/cli/config#auth.email.max_frequency) [auth.email.otp\_length](https://supabase.com/docs/guides/local-development/cli/config#auth.email.otp_length) [auth.email.otp\_expiry](https://supabase.com/docs/guides/local-development/cli/config#auth.email.otp_expiry) [auth.email.smtp.host](https://supabase.com/docs/guides/local-development/cli/config#auth.email.smtp.host) [auth.email.smtp.port](https://supabase.com/docs/guides/local-development/cli/config#auth.email.smtp.port) [auth.email.smtp.user](https://supabase.com/docs/guides/local-development/cli/config#auth.email.smtp.user) [auth.email.smtp.pass](https://supabase.com/docs/guides/local-development/cli/config#auth.email.smtp.pass) [auth.email.smtp.admin\_email](https://supabase.com/docs/guides/local-development/cli/config#auth.email.smtp.admin_email) [auth.email.smtp.sender\_name](https://supabase.com/docs/guides/local-development/cli/config#auth.email.smtp.sender_name) [auth.email.template.<type>.subject](https://supabase.com/docs/guides/local-development/cli/config#auth.email.template.type.subject) [auth.email.template.<type>.content\_path](https://supabase.com/docs/guides/local-development/cli/config#auth.email.template.type.content_path) [auth.sms.enable\_signup](https://supabase.com/docs/guides/local-development/cli/config#auth.sms.enable_signup) [auth.sms.enable\_confirmations](https://supabase.com/docs/guides/local-development/cli/config#auth.sms.enable_confirmations) [auth.sms.test\_otp](https://supabase.com/docs/guides/local-development/cli/config#auth.sms.test_otp) [auth.sms.<provider>.enabled](https://supabase.com/docs/guides/local-development/cli/config#auth.sms.provider.enabled) [auth.sms.<twilio\|twilio\_verify>.account\_sid](https://supabase.com/docs/guides/local-development/cli/config#auth.sms.twilio.account_sid) [auth.sms.<twilio\|twilio\_verify>.message\_service\_sid](https://supabase.com/docs/guides/local-development/cli/config#auth.sms.twilio.message_service_sid) [auth.sms.<twilio\|twilio\_verify>.auth\_token](https://supabase.com/docs/guides/local-development/cli/config#auth.sms.twilio.auth_token) [auth.sms.messagebird.originator](https://supabase.com/docs/guides/local-development/cli/config#auth.sms.messagebird.originator) [auth.sms.messagebird.access\_key](https://supabase.com/docs/guides/local-development/cli/config#auth.sms.messagebird.access_key) [auth.sms.textlocal.sender](https://supabase.com/docs/guides/local-development/cli/config#auth.sms.textlocal.sender) [auth.sms.textlocal.api\_key](https://supabase.com/docs/guides/local-development/cli/config#auth.sms.textlocal.api_key) [auth.sms.vonage.from](https://supabase.com/docs/guides/local-development/cli/config#auth.sms.vonage.from) [auth.sms.vonage.api\_key](https://supabase.com/docs/guides/local-development/cli/config#auth.sms.vonage.api_key) [auth.sms.vonage.api\_secret](https://supabase.com/docs/guides/local-development/cli/config#auth.sms.vonage.api_secret) [auth.external.<provider>.enabled](https://supabase.com/docs/guides/local-development/cli/config#auth.external.provider.enabled) [auth.external.<provider>.client\_id](https://supabase.com/docs/guides/local-development/cli/config#auth.external.provider.client_id) [auth.external.<provider>.secret](https://supabase.com/docs/guides/local-development/cli/config#auth.external.provider.secret) [auth.external.<provider>.url](https://supabase.com/docs/guides/local-development/cli/config#auth.external.provider.url) [auth.external.<provider>.redirect\_uri](https://supabase.com/docs/guides/local-development/cli/config#auth.external.provider.redirect_uri) [auth.external.<provider>.skip\_nonce\_check](https://supabase.com/docs/guides/local-development/cli/config#auth.external.provider.skip_nonce_check) [auth.hook.<hook\_name>.enabled](https://supabase.com/docs/guides/local-development/cli/config#auth.hook.%3Chook_name%3E.enabled) [auth.hook.<hook\_name>.uri](https://supabase.com/docs/guides/local-development/cli/config#auth.hook.%3Chook_name%3E.uri) [auth.hook.<hook\_name>.secrets](https://supabase.com/docs/guides/local-development/cli/config#auth.hook.%3Chook_name%3E.secrets) [auth.mfa.totp.enroll\_enabled](https://supabase.com/docs/guides/local-development/cli/config#auth.mfa.totp.enroll_enabled) [auth.mfa.totp.verify\_enabled](https://supabase.com/docs/guides/local-development/cli/config#auth.mfa.totp.verify_enabled) [auth.mfa.max\_enrolled\_factors](https://supabase.com/docs/guides/local-development/cli/config#auth.mfa.max_enrolled_factors) [auth.mfa.phone.enroll\_enabled](https://supabase.com/docs/guides/local-development/cli/config#auth.mfa.phone.enroll_enabled) [auth.mfa.phone.otp\_length](https://supabase.com/docs/guides/local-development/cli/config#auth.mfa.phone.otp_length) [auth.mfa.phone.max\_frequency](https://supabase.com/docs/guides/local-development/cli/config#auth.mfa.phone.max_frequency) [auth.mfa.phone.otp\_length](https://supabase.com/docs/guides/local-development/cli/config#auth.mfa.phone.otp_length) [auth.mfa.phone.verify\_enabled](https://supabase.com/docs/guides/local-development/cli/config#auth.mfa.phone.verify_enabled) [auth.mfa.web\_authn.enroll\_enabled](https://supabase.com/docs/guides/local-development/cli/config#auth.mfa.web_authn.enroll_enabled) [auth.mfa.web\_authn.verify\_enabled](https://supabase.com/docs/guides/local-development/cli/config#auth.mfa.web_authn.verify_enabled) [auth.sessions.timebox](https://supabase.com/docs/guides/local-development/cli/config#auth.sessions.timebox) [auth.sessions.inactivity\_timeout](https://supabase.com/docs/guides/local-development/cli/config#auth.sessions.inactivity_timeout) [auth.third\_party.aws\_cognito.enabled](https://supabase.com/docs/guides/local-development/cli/config#auth.third_party.aws_cognito.enabled) [auth.third\_party.aws\_cognito.user\_pool\_id](https://supabase.com/docs/guides/local-development/cli/config#auth.third_party.aws_cognito.user_pool_id) [auth.third\_party.aws\_cognito.user\_pool\_region](https://supabase.com/docs/guides/local-development/cli/config#auth.third_party.aws_cognito.user_pool_region) [auth.third\_party.auth0.enabled](https://supabase.com/docs/guides/local-development/cli/config#auth.third_party.auth0.enabled) [auth.third\_party.auth0.tenant](https://supabase.com/docs/guides/local-development/cli/config#auth.third_party.auth0.tenant) [auth.third\_party.tenant\_region](https://supabase.com/docs/guides/local-development/cli/config#auth.third_party.auth0.tenant_region) [auth.third\_party.firebase.enabled](https://supabase.com/docs/guides/local-development/cli/config#auth.third_party.firebase.enabled) [auth.third\_party.firebase.project\_id](https://supabase.com/docs/guides/local-development/cli/config#auth.third_party.firebase.project_id) [API Config](https://supabase.com/docs/guides/local-development/cli/config#api-config) [api.enabled](https://supabase.com/docs/guides/local-development/cli/config#api.enabled) [api.port](https://supabase.com/docs/guides/local-development/cli/config#api.port) [api.schemas](https://supabase.com/docs/guides/local-development/cli/config#api.schemas) [api.extra\_search\_path](https://supabase.com/docs/guides/local-development/cli/config#api.extra_search_path) [api.max\_rows](https://supabase.com/docs/guides/local-development/cli/config#api.max_rows) [Database Config](https://supabase.com/docs/guides/local-development/cli/config#database-config) [db.port](https://supabase.com/docs/guides/local-development/cli/config#db.port) [db.shadow\_port](https://supabase.com/docs/guides/local-development/cli/config#db.shadow_port) [db.major\_version](https://supabase.com/docs/guides/local-development/cli/config#db.major_version) [db.pooler.enabled](https://supabase.com/docs/guides/local-development/cli/config#db.pooler.enabled) [db.pooler.port](https://supabase.com/docs/guides/local-development/cli/config#db.pooler.port) [db.pooler.pool\_mode](https://supabase.com/docs/guides/local-development/cli/config#db.pooler.pool_mode) [db.pooler.default\_pool\_size](https://supabase.com/docs/guides/local-development/cli/config#db.pooler.default_pool_size) [db.settings.effective\_cache\_size](https://supabase.com/docs/guides/local-development/cli/config#db.settings.effective_cache_size) [db.settings.logical\_decoding\_work\_mem](https://supabase.com/docs/guides/local-development/cli/config#db.settings.logical_decoding_work_mem) [db.settings.maintenance\_work\_mem](https://supabase.com/docs/guides/local-development/cli/config#db.settings.maintenance_work_mem) [db.settings.max\_connections](https://supabase.com/docs/guides/local-development/cli/config#db.settings.max_connections) [db.settings.max\_locks\_per\_transaction](https://supabase.com/docs/guides/local-development/cli/config#db.settings.max_locks_per_transaction) [db.settings.max\_parallel\_maintenance\_workers](https://supabase.com/docs/guides/local-development/cli/config#db.settings.max_parallel_maintenance_workers) [db.settings.max\_parallel\_workers](https://supabase.com/docs/guides/local-development/cli/config#db.settings.max_parallel_workers) [db.settings.max\_parallel\_workers\_per\_gather](https://supabase.com/docs/guides/local-development/cli/config#db.settings.max_parallel_workers_per_gather) [db.settings.max\_replication\_slots](https://supabase.com/docs/guides/local-development/cli/config#db.settings.max_replication_slots) [db.settings.max\_slot\_wal\_keep\_size](https://supabase.com/docs/guides/local-development/cli/config#db.settings.max_slot_wal_keep_size) [db.settings.max\_standby\_archive\_delay](https://supabase.com/docs/guides/local-development/cli/config#db.settings.max_standby_archive_delay) [db.settings.max\_standby\_streaming\_delay](https://supabase.com/docs/guides/local-development/cli/config#db.settings.max_standby_streaming_delay) [db.settings.max\_wal\_size](https://supabase.com/docs/guides/local-development/cli/config#db.settings.max_wal_size) [db.settings.max\_wal\_senders](https://supabase.com/docs/guides/local-development/cli/config#db.settings.max_wal_senders) [db.settings.max\_worker\_processes](https://supabase.com/docs/guides/local-development/cli/config#db.settings.max_worker_processes) [db.settings.session\_replication\_role](https://supabase.com/docs/guides/local-development/cli/config#db.settings.session_replication_role) [db.settings.shared\_buffers](https://supabase.com/docs/guides/local-development/cli/config#db.settings.shared_buffers) [db.settings.statement\_timeout](https://supabase.com/docs/guides/local-development/cli/config#db.settings.statement_timeout) [db.settings.track\_activity\_query\_size](https://supabase.com/docs/guides/local-development/cli/config#db.settings.track_activity_query_size) [db.settings.track\_commit\_timestamp](https://supabase.com/docs/guides/local-development/cli/config#db.settings.track_commit_timestamp) [db.settings.wal\_keep\_size](https://supabase.com/docs/guides/local-development/cli/config#db.settings.wal_keep_size) [db.settings.wal\_sender\_timeout](https://supabase.com/docs/guides/local-development/cli/config#db.settings.wal_sender_timeout) [db.settings.work\_mem](https://supabase.com/docs/guides/local-development/cli/config#db.settings.work_mem) [db.pooler.max\_client\_conn](https://supabase.com/docs/guides/local-development/cli/config#db.pooler.max_client_conn) [db.seed.enabled](https://supabase.com/docs/guides/local-development/cli/config#db.seed.enabled) [db.seed.sql\_paths](https://supabase.com/docs/guides/local-development/cli/config#db.seed.sql_paths) [Dashboard Config](https://supabase.com/docs/guides/local-development/cli/config#dashboard-config) [studio.enabled](https://supabase.com/docs/guides/local-development/cli/config#studio.enabled) [studio.port](https://supabase.com/docs/guides/local-development/cli/config#studio.port) [studio.api\_url](https://supabase.com/docs/guides/local-development/cli/config#studio.api_url) [studio.openai\_api\_key](https://supabase.com/docs/guides/local-development/cli/config#studio.openai_api_key) [Realtime Config](https://supabase.com/docs/guides/local-development/cli/config#realtime-config) [realtime.enabled](https://supabase.com/docs/guides/local-development/cli/config#realtime.enabled) [realtime.ip\_version](https://supabase.com/docs/guides/local-development/cli/config#realtime.ip_version) [Storage Config](https://supabase.com/docs/guides/local-development/cli/config#storage-config) [storage.enabled](https://supabase.com/docs/guides/local-development/cli/config#storage.enabled) [storage.file\_size\_limit](https://supabase.com/docs/guides/local-development/cli/config#storage.file_size_limit) [storage.buckets.<bucket\_name>.public](https://supabase.com/docs/guides/local-development/cli/config#storage.buckets.bucket_name.public) [storage.buckets.<bucket\_name>.file\_size\_limit](https://supabase.com/docs/guides/local-development/cli/config#storage.buckets.bucket_name.file_size_limit) [storage.buckets.<bucket\_name>.allowed\_mime\_types](https://supabase.com/docs/guides/local-development/cli/config#storage.buckets.bucket_name.allowed_mime_types) [storage.buckets.<bucket\_name>.objects\_path](https://supabase.com/docs/guides/local-development/cli/config#storage.buckets.bucket_name.objects_path) [Edge-Functions Config](https://supabase.com/docs/guides/local-development/cli/config#edge-functions-config) [edge\_runtime.enabled](https://supabase.com/docs/guides/local-development/cli/config#edge_runtime.enabled) [edge\_runtime.policy](https://supabase.com/docs/guides/local-development/cli/config#edge_runtime.policy) [edge\_runtime.inspector\_port](https://supabase.com/docs/guides/local-development/cli/config#edge_runtime.inspector_port) [functions.<function\_name>.enabled](https://supabase.com/docs/guides/local-development/cli/config#functions.function_name.enabled) [functions.<function\_name>.verify\_jwt](https://supabase.com/docs/guides/local-development/cli/config#functions.function_name.verify_jwt) [functions.<function\_name>.import\_map](https://supabase.com/docs/guides/local-development/cli/config#functions.function_name.import_map) [functions.<function\_name>.entrypoint](https://supabase.com/docs/guides/local-development/cli/config#functions.function_name.entrypoint) [functions.<function\_name>.static\_files](https://supabase.com/docs/guides/local-development/cli/config#functions.function_name.static_files) [Analytics Config](https://supabase.com/docs/guides/local-development/cli/config#analytics-config) [analytics.enabled](https://supabase.com/docs/guides/local-development/cli/config#analytics.enabled) [analytics.port](https://supabase.com/docs/guides/local-development/cli/config#analytics.port) [analytics.vector\_port](https://supabase.com/docs/guides/local-development/cli/config#analytics.vector_port) [analytics.backend](https://supabase.com/docs/guides/local-development/cli/config#analytics.backend) [Experimental Config](https://supabase.com/docs/guides/local-development/cli/config#experimental-config) [experimental.webhooks.enabled](https://supabase.com/docs/guides/local-development/cli/config#experimental.webhooks.enabled) [experimental.orioledb\_version](https://supabase.com/docs/guides/local-development/cli/config#experimental.orioledb_version) [experimental.s3\_host](https://supabase.com/docs/guides/local-development/cli/config#experimental.s3_host) [experimental.s3\_region](https://supabase.com/docs/guides/local-development/cli/config#experimental.s3_region) [experimental.s3\_access\_key](https://supabase.com/docs/guides/local-development/cli/config#experimental.s3_access_key) [experimental.s3\_secret\_key](https://supabase.com/docs/guides/local-development/cli/config#experimental.s3_secret_key) [Local Development Config](https://supabase.com/docs/guides/local-development/cli/config#local-development-config) [inbucket.enabled](https://supabase.com/docs/guides/local-development/cli/config#inbucket.enabled) [inbucket.port](https://supabase.com/docs/guides/local-development/cli/config#inbucket.port) [inbucket.smtp\_port](https://supabase.com/docs/guides/local-development/cli/config#inbucket.smtp_port) [inbucket.pop3\_port](https://supabase.com/docs/guides/local-development/cli/config#inbucket.pop3_port) [inbucket.admin\_email](https://supabase.com/docs/guides/local-development/cli/config#inbucket.admin_email) [inbucket.sender\_name](https://supabase.com/docs/guides/local-development/cli/config#inbucket.sender_name) [Branching Config](https://supabase.com/docs/guides/local-development/cli/config#branching-config) [remotes.<branch\_name>.project\_id](https://supabase.com/docs/guides/local-development/cli/config#remotes.branch_name.project_id)
