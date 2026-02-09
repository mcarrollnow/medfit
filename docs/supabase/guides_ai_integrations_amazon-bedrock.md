---
library: supabase
url: https://supabase.com/docs/guides/ai/integrations/amazon-bedrock
title: Amazon Bedrock | Supabase Docs
scraped: 2025-10-23T16:59:02.321Z
---

AI & Vectors

# Amazon Bedrock

* * *

[Amazon Bedrock](https://aws.amazon.com/bedrock) is a fully managed service that offers a choice of high-performing foundation models (FMs) from leading AI companies like AI21 Labs, Anthropic, Cohere, Meta, Mistral AI, Stability AI, and Amazon. Each model is accessible through a common API which implements a broad set of features to help build generative AI applications with security, privacy, and responsible AI in mind.

This guide will walk you through an example using Amazon Bedrock SDK with `vecs`. We will create embeddings using the Amazon Titan Embeddings G1 – Text v1.2 (amazon.titan-embed-text-v1) model, insert these embeddings into a Postgres database using vecs, and then query the collection to find the most similar sentences to a given query sentence.

## Create an environment [\#](https://supabase.com/docs/guides/ai/integrations/amazon-bedrock\#create-an-environment)

First, you need to set up your environment. You will need Python 3.7+ with the `vecs` and `boto3` libraries installed.

You can install the necessary Python libraries using pip:

```flex

```

You'll also need:

- [Credentials to your AWS account](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/credentials.html)
- [A Postgres Database with the pgvector extension](https://supabase.com/docs/guides/ai/integrations/hosting.md)

## Create embeddings [\#](https://supabase.com/docs/guides/ai/integrations/amazon-bedrock\#create-embeddings)

Next, we will use Amazon’s Titan Embedding G1 - Text v1.2 model to create embeddings for a set of sentences.

```flex

```

### Store the embeddings with vecs [\#](https://supabase.com/docs/guides/ai/integrations/amazon-bedrock\#store-the-embeddings-with-vecs)

Now that we have our embeddings, we can insert them into a Postgres database using vecs.

```flex

```

### Querying for most similar sentences [\#](https://supabase.com/docs/guides/ai/integrations/amazon-bedrock\#querying-for-most-similar-sentences)

Now, we query the `sentences` collection to find the most similar sentences to a sample query sentence. First need to create an embedding for the query sentence. Next, we query the collection we created earlier to find the most similar sentences.

```flex

```

This returns the most similar 3 records and their distance to the query vector.

```flex

```

## Resources [\#](https://supabase.com/docs/guides/ai/integrations/amazon-bedrock\#resources)

- [Amazon Bedrock](https://aws.amazon.com/bedrock)
- [Amazon Titan](https://aws.amazon.com/bedrock/titan)
- [Semantic Image Search with Amazon Titan](https://supabase.com/docs/guides/ai/examples/semantic-image-search-amazon-titan)

Watch video guide

![Video guide preview](https://supabase.com/docs/_next/image?url=https%3A%2F%2Fimg.youtube.com%2Fvi%2FA3uND5sgiO0%2F0.jpg&w=3840&q=75)

### Is this helpful?

NoYes

### On this page

[Create an environment](https://supabase.com/docs/guides/ai/integrations/amazon-bedrock#create-an-environment) [Create embeddings](https://supabase.com/docs/guides/ai/integrations/amazon-bedrock#create-embeddings) [Store the embeddings with vecs](https://supabase.com/docs/guides/ai/integrations/amazon-bedrock#store-the-embeddings-with-vecs) [Querying for most similar sentences](https://supabase.com/docs/guides/ai/integrations/amazon-bedrock#querying-for-most-similar-sentences) [Resources](https://supabase.com/docs/guides/ai/integrations/amazon-bedrock#resources)
