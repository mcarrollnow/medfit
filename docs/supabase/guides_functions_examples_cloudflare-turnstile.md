---
library: supabase
url: https://supabase.com/docs/guides/functions/examples/cloudflare-turnstile
title: CAPTCHA support with Cloudflare Turnstile | Supabase Docs
scraped: 2025-10-23T16:59:02.345Z
---

Edge Functions

# CAPTCHA support with Cloudflare Turnstile

* * *

[Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) is a friendly, free CAPTCHA replacement, and it works seamlessly with Supabase Edge Functions to protect your forms. [View on GitHub](https://github.com/supabase/supabase/tree/master/examples/edge-functions/supabase/functions/cloudflare-turnstile).

## Setup [\#](https://supabase.com/docs/guides/functions/examples/cloudflare-turnstile\#setup)

- Follow these steps to set up a new site: [https://developers.cloudflare.com/turnstile/get-started/](https://developers.cloudflare.com/turnstile/get-started/)
- Add the Cloudflare Turnstile widget to your site: [https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/)

## Code [\#](https://supabase.com/docs/guides/functions/examples/cloudflare-turnstile\#code)

Create a new function in your project:

```flex

```

And add the code to the `index.ts` file:

```flex

```

## Deploy the server-side validation Edge Functions [\#](https://supabase.com/docs/guides/functions/examples/cloudflare-turnstile\#deploy-the-server-side-validation-edge-functions)

- [https://developers.cloudflare.com/turnstile/get-started/server-side-validation/](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)

```flex

```

## Invoke the function from your site [\#](https://supabase.com/docs/guides/functions/examples/cloudflare-turnstile\#invoke-the-function-from-your-site)

```flex

```

Watch video guide

![Video guide preview](https://supabase.com/docs/_next/image?url=https%3A%2F%2Fimg.youtube.com%2Fvi%2FOwW0znboh60%2F0.jpg&w=3840&q=75)

### Is this helpful?

NoYes

### On this page

[Setup](https://supabase.com/docs/guides/functions/examples/cloudflare-turnstile#setup) [Code](https://supabase.com/docs/guides/functions/examples/cloudflare-turnstile#code) [Deploy the server-side validation Edge Functions](https://supabase.com/docs/guides/functions/examples/cloudflare-turnstile#deploy-the-server-side-validation-edge-functions) [Invoke the function from your site](https://supabase.com/docs/guides/functions/examples/cloudflare-turnstile#invoke-the-function-from-your-site)
