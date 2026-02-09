---
library: supabase
url: https://supabase.com/docs/guides/ai/examples/image-search-openai-clip
title: Image Search with OpenAI CLIP | Supabase Docs
scraped: 2025-10-23T16:59:02.315Z
---

AI & Vectors

# Image Search with OpenAI CLIP

## Implement image search with the OpenAI CLIP Model and Supabase Vector.

* * *

The [OpenAI CLIP Model](https://github.com/openai/CLIP) was trained on a variety of (image, text)-pairs. You can use the CLIP model for:

- Text-to-Image / Image-To-Text / Image-to-Image / Text-to-Text Search
- You can fine-tune it on your own image and text data with the regular `SentenceTransformers` training code.

[`SentenceTransformers`](https://www.sbert.net/examples/applications/image-search/README.html) provides models that allow you to embed images and text into the same vector space. You can use this to find similar images as well as to implement image search.

You can find the full application code as a Python Poetry project on [GitHub](https://github.com/supabase/supabase/tree/master/examples/ai/image_search#image-search-with-supabase-vector).

## Create a new Python project with Poetry [\#](https://supabase.com/docs/guides/ai/examples/image-search-openai-clip\#create-a-new-python-project-with-poetry)

[Poetry](https://python-poetry.org/) provides packaging and dependency management for Python. If you haven't already, install poetry via pip:

```flex

```

Then initialize a new project:

```flex

```

## Setup Supabase project [\#](https://supabase.com/docs/guides/ai/examples/image-search-openai-clip\#setup-supabase-project)

If you haven't already, [install the Supabase CLI](https://supabase.com/docs/guides/cli), then initialize Supabase in the root of your newly created poetry project:

```flex

```

Next, start your local Supabase stack:

```flex

```

This will start up the Supabase stack locally and print out a bunch of environment details, including your local `DB URL`. Make a note of that for later user.

## Install the dependencies [\#](https://supabase.com/docs/guides/ai/examples/image-search-openai-clip\#install-the-dependencies)

We will need to add the following dependencies to our project:

- [`vecs`](https://github.com/supabase/vecs#vecs): Supabase Vector Python Client.
- [`sentence-transformers`](https://huggingface.co/sentence-transformers/clip-ViT-B-32): a framework for sentence, text and image embeddings (used with OpenAI CLIP model)
- [`matplotlib`](https://matplotlib.org/): for displaying our image result

```flex

```

## Import the necessary dependencies [\#](https://supabase.com/docs/guides/ai/examples/image-search-openai-clip\#import-the-necessary-dependencies)

At the top of your main python script, import the dependencies and store your `DB URL` from above in a variable:

```flex

```

## Create embeddings for your images [\#](https://supabase.com/docs/guides/ai/examples/image-search-openai-clip\#create-embeddings-for-your-images)

In the root of your project, create a new folder called `images` and add some images. You can use the images from the example project on [GitHub](https://github.com/supabase/supabase/tree/master/examples/ai/image_search/images) or you can find license free images on [Unsplash](https://unsplash.com/).

Next, create a `seed` method, which will create a new Supabase Vector Collection, generate embeddings for your images, and upsert the embeddings into your database:

```flex

```

Add this method as a script in your `pyproject.toml` file:

```flex

```

After activating the virtual environment with `poetry shell` you can now run your seed script via `poetry run seed`. You can inspect the generated embeddings in your local database by visiting the local Supabase dashboard at [localhost:54323](http://localhost:54323/project/default/editor), selecting the `vecs` schema, and the `image_vectors` database.

## Perform an image search from a text query [\#](https://supabase.com/docs/guides/ai/examples/image-search-openai-clip\#perform-an-image-search-from-a-text-query)

With Supabase Vector we can query our embeddings. We can use either an image as search input or alternative we can generate an embedding from a string input and use that as the query input:

```flex

```

By limiting the query to one result, we can show the most relevant image to the user. Finally we use `matplotlib` to show the image result to the user.

Go ahead and test it out by running `poetry run search` and you will be presented with an image of a "bike in front of a red brick wall".

## Conclusion [\#](https://supabase.com/docs/guides/ai/examples/image-search-openai-clip\#conclusion)

With just a couple of lines of Python you are able to implement image search as well as reverse image search using OpenAI's CLIP model and Supabase Vector.

### Is this helpful?

NoYes

### On this page

[Create a new Python project with Poetry](https://supabase.com/docs/guides/ai/examples/image-search-openai-clip#create-a-new-python-project-with-poetry) [Setup Supabase project](https://supabase.com/docs/guides/ai/examples/image-search-openai-clip#setup-supabase-project) [Install the dependencies](https://supabase.com/docs/guides/ai/examples/image-search-openai-clip#install-the-dependencies) [Import the necessary dependencies](https://supabase.com/docs/guides/ai/examples/image-search-openai-clip#import-the-necessary-dependencies) [Create embeddings for your images](https://supabase.com/docs/guides/ai/examples/image-search-openai-clip#create-embeddings-for-your-images) [Perform an image search from a text query](https://supabase.com/docs/guides/ai/examples/image-search-openai-clip#perform-an-image-search-from-a-text-query) [Conclusion](https://supabase.com/docs/guides/ai/examples/image-search-openai-clip#conclusion)
