---
library: supabase
url: https://supabase.com/docs/guides/auth/auth-hooks/send-email-hook
title: Send Email Hook | Supabase Docs
scraped: 2025-10-23T16:59:02.345Z
---

Auth

# Send Email Hook

## Use a custom email provider to send authentication messages

* * *

The Send Email Hook runs before an email is sent and allows for flexibility around email sending. You can use this hook to configure a back-up email provider or add internationalization to your emails.

## Email sending behavior [\#](https://supabase.com/docs/guides/auth/auth-hooks/send-email-hook\#email-sending-behavior)

Email sending depends on two settings: Email Provider and Auth Hook status.

| Email Provider | Auth Hook | Result |
| --- | --- | --- |
| Enabled | Enabled | Auth Hook handles email sending (SMTP not used) |
| Enabled | Disabled | SMTP handles email sending (custom if configured, default otherwise) |
| Disabled | Enabled | Email Signups Disabled |
| Disabled | Disabled | Email Signups Disabled |

## Email change behavior and token hash mapping [\#](https://supabase.com/docs/guides/auth/auth-hooks/send-email-hook\#email-change-behavior-and-token-hash-mapping)

When `email_action_type` is `email_change`, the hook payload can include one or two OTPs and their hashes. This depends on your [Secure Email Change](https://supabase.com/dashboard/project/_/auth/providers?provider=Email) setting.

- Secure Email Change enabled: two OTPs are generated, one for the current email ( `user.email`) and one for the new email ( `user.email_new`). You must send two emails.
- Secure Email Change disabled: only one OTP is generated for the new email. You send a single email.

Important quirk (backward compatibility):

- `email_data.token_hash_new` = Hash( `user.email`, `email_data.token`)
- `email_data.token_hash` = Hash( `user.email_new`, `email_data.token_new`)

This naming is historical and kept for backward compatibility. Do not assume that the `_new` suffix refers to the new email.

### What to send [\#](https://supabase.com/docs/guides/auth/auth-hooks/send-email-hook\#what-to-send)

If both `token_hash` and `token_hash_new` are present, send two messages:

- To the current email ( `user.email`): use `token` with `token_hash_new`.
- To the new email ( `user.email_new`): use `token_new` with `token_hash`.

If only one token/hash pair is present, send a single email. In non-secure mode, this is typically the new email OTP. Use `token` with `token_hash` or `token_new` with `token_hash`, depending on which fields are present in the payload.

**Inputs**

| Field | Type | Description |
| --- | --- | --- |
| `user` | [`User`](https://supabase.com/docs/guides/auth/users#the-user-object) | The user attempting to sign in. |
| `email` | `object` | Metadata specific to the email sending process. Includes the OTP and `token_hash`. |

JSONJSON Schema

```flex

```

**Outputs**

- No outputs are required. An empty response with a status code of 200 is taken as a successful response.

SQLHTTP

Use Resend as an email providerAdd Internationalization for Email Templates

You can configure [Resend](https://resend.com/) as the custom email provider through the "Send Email" hook. This allows you to take advantage of Resend's developer-friendly APIs to send emails and leverage [React Email](https://react.email/) for managing your email templates. For a more advanced React Email tutorial, refer to [this guide](https://supabase.com/docs/guides/functions/examples/auth-send-email-hook-react-email-resend).

If you want to send emails through the Supabase Resend integration, which uses Resend's SMTP server, check out [this integration](https://supabase.com/partners/integrations/resend) instead.

Create a `.env` file with the following environment variables:

```flex

```

You can generate the secret in the [Auth Hooks](https://supabase.com/dashboard/project/_/auth/hooks) section of the Supabase dashboard.

Set the secrets in your Supabase project:

```flex

```

Create a new edge function:

```flex

```

Add the following code to your edge function:

```flex

```

Deploy your edge function and [configure it as a hook](https://supabase.com/dashboard/project/_/auth/hooks):

```flex

```

### Is this helpful?

NoYes

### On this page

[Email sending behavior](https://supabase.com/docs/guides/auth/auth-hooks/send-email-hook#email-sending-behavior) [Email change behavior and token hash mapping](https://supabase.com/docs/guides/auth/auth-hooks/send-email-hook#email-change-behavior-and-token-hash-mapping) [What to send](https://supabase.com/docs/guides/auth/auth-hooks/send-email-hook#what-to-send)
