---
library: supabase
url: https://supabase.com/docs/guides/local-development/testing/overview
title: Testing Overview | Supabase Docs
scraped: 2025-10-23T16:59:02.317Z
---

Local Development

# Testing Overview

* * *

Testing is a critical part of database development, especially when working with features like Row Level Security (RLS) policies. This guide provides a comprehensive approach to testing your Supabase database.

## Testing approaches [\#](https://supabase.com/docs/guides/local-development/testing/overview\#testing-approaches)

### Database unit testing with pgTAP [\#](https://supabase.com/docs/guides/local-development/testing/overview\#database-unit-testing-with-pgtap)

[pgTAP](https://pgtap.org/) is a unit testing framework for Postgres that allows testing:

- Database structure: tables, columns, constraints
- Row Level Security (RLS) policies
- Functions and procedures
- Data integrity

This example demonstrates setting up and testing RLS policies for a simple todo application:

1. Create a test table with RLS enabled:



```flex



```

2. Set up your testing environment:



```flex



```

3. Write your RLS tests:



```flex



```

4. Run the tests:



```flex



```


### Application-Level testing [\#](https://supabase.com/docs/guides/local-development/testing/overview\#application-level-testing)

Testing through application code provides end-to-end verification. Unlike database-level testing with pgTAP, application-level tests cannot use transactions for isolation.

Application-level tests should not rely on a clean database state, as resetting the database before each test can be slow and makes tests difficult to parallelize.
Instead, design your tests to be independent by using unique user IDs for each test case.

Here's an example using TypeScript that mirrors the pgTAP tests above:

```flex

```

#### Test isolation strategies [\#](https://supabase.com/docs/guides/local-development/testing/overview\#test-isolation-strategies)

For application-level testing, consider these approaches for test isolation:

1. **Unique Identifiers**: Generate unique IDs for each test suite to prevent data conflicts
2. **Cleanup After Tests**: If necessary, clean up created data in an `afterAll` or `afterEach` hook
3. **Isolated Data Sets**: Use prefixes or namespaces in data to separate test cases

### Continuous integration testing [\#](https://supabase.com/docs/guides/local-development/testing/overview\#continuous-integration-testing)

Set up automated database testing in your CI pipeline:

1. Create a GitHub Actions workflow `.github/workflows/db-tests.yml`:

```flex

```

## Best practices [\#](https://supabase.com/docs/guides/local-development/testing/overview\#best-practices)

1. **Test Data Setup**
   - Use begin and rollback to ensure test isolation
   - Create realistic test data that covers edge cases
   - Use different user roles and permissions in tests
2. **RLS Policy Testing**
   - Test Create, Read, Update, Delete operations
   - Test with different user roles: anonymous and authenticated
   - Test edge cases and potential security bypasses
   - Always test negative cases: what users should not be able to do
3. **CI/CD Integration**
   - Run tests automatically on every pull request
   - Include database tests in deployment pipeline
   - Keep test runs fast using transactions

## Real-World examples [\#](https://supabase.com/docs/guides/local-development/testing/overview\#real-world-examples)

For more complex, real-world examples of database testing, check out:

- [Database Tests Example Repository](https://github.com/usebasejump/basejump/tree/main/supabase/tests/database) \- A production-grade example of testing RLS policies
- [RLS Guide and Best Practices](https://github.com/orgs/supabase/discussions/14576)

## Troubleshooting [\#](https://supabase.com/docs/guides/local-development/testing/overview\#troubleshooting)

Common issues and solutions:

1. **Test Failures Due to RLS**
   - Ensure you've set the correct role `set local role authenticated;`
   - Verify JWT claims are set `set local "request.jwt.claims"`
   - Check policy definitions match your test assumptions
2. **CI Pipeline Issues**
   - Verify Supabase CLI is properly installed
   - Ensure database migrations are run before tests
   - Check for proper test isolation using transactions

## Additional resources [\#](https://supabase.com/docs/guides/local-development/testing/overview\#additional-resources)

- [pgTAP Documentation](https://pgtap.org/)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli/supabase-test)
- [pgTAP Supabase reference](https://supabase.com/docs/guides/database/extensions/pgtap?queryGroups=database-method&database-method=sql#testing-rls-policies)
- [Database testing reference](https://supabase.com/docs/guides/database/testing)

### Is this helpful?

NoYes

### On this page

[Testing approaches](https://supabase.com/docs/guides/local-development/testing/overview#testing-approaches) [Database unit testing with pgTAP](https://supabase.com/docs/guides/local-development/testing/overview#database-unit-testing-with-pgtap) [Application-Level testing](https://supabase.com/docs/guides/local-development/testing/overview#application-level-testing) [Continuous integration testing](https://supabase.com/docs/guides/local-development/testing/overview#continuous-integration-testing) [Best practices](https://supabase.com/docs/guides/local-development/testing/overview#best-practices) [Real-World examples](https://supabase.com/docs/guides/local-development/testing/overview#real-world-examples) [Troubleshooting](https://supabase.com/docs/guides/local-development/testing/overview#troubleshooting) [Additional resources](https://supabase.com/docs/guides/local-development/testing/overview#additional-resources)
