---
library: supabase
url: https://supabase.com/docs/guides/troubleshooting/rls-simplified-BJTcS8
title: Supabase Docs | Troubleshooting | RLS Simplified
scraped: 2025-10-23T16:59:02.333Z
---

# RLS Simplified

Last edited: 2/21/2025

* * *

### Basic summary [\#](https://supabase.com/docs/guides/troubleshooting/rls-simplified-BJTcS8\#basic-summary)

Row-Level Security (RLS) Policy: A `WHERE` or `CHECK` condition applied automatically to database queries

Key features:

- Applies without being explicitly added to each query, which makes it good for policing row access from unknown entities, such as those leveraging the anon or authenticated roles.
- Can be set for specific actions (e.g., SELECT, INSERT)
- Can target particular database roles (e.g., "anon", "authenticated")

Contrast with regular conditions:

- Regular conditions: Apply to all roles and must be added manually to each query
- RLS policies: Applied automatically to specified actions and roles

## Hands on walk-through for conditions [\#](https://supabase.com/docs/guides/troubleshooting/rls-simplified-BJTcS8\#hands-on-walk-through-for-conditions)

### USING: [\#](https://supabase.com/docs/guides/troubleshooting/rls-simplified-BJTcS8\#using)

The `USING` keyword inspects the value of row to see if it should be made visible to the query.

When you SELECT, UPDATE, or DELETE, you have to use a WHERE statement to search for specific rows:

```flex

```

Even when you don't use a WHERE statement, there's still an implicit one:

```flex

```

The `USING` clause appends more to the WHERE statement:

```flex

```

### WITH CHECK: [\#](https://supabase.com/docs/guides/troubleshooting/rls-simplified-BJTcS8\#with-check)

Let's say you have a profile table. Well, you don't want user's to be able to modify their user\_id when they make an insert, do you?

The `WITH CHECK` condition inspects values that are being added or modified. For INSERT you'd use it by itself. There's no need for a using clause:

```flex

```

INSERTs do not rely on WHERE clauses, but they can have constraints. In this case, the RLS acts as a CHECK constraint against a column, e.g.:

```flex

```

What distinguishes it from normal `CHECK` constraints is that it is only activate for certain roles or methods.

### UPDATEs: [\#](https://supabase.com/docs/guides/troubleshooting/rls-simplified-BJTcS8\#updates)

UPDATE both filters for rows to change and then adds new values to the table, so it requires both USING and WITH CHECK conditions:

```flex

```
