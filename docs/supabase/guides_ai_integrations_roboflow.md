---
library: supabase
url: https://supabase.com/docs/guides/ai/integrations/roboflow
title: Roboflow | Supabase Docs
scraped: 2025-10-23T16:59:02.339Z
---

AI & Vectors

# Roboflow

## Learn how to integrate Supabase with Roboflow, a tool for running fine-tuned and foundation vision models.

* * *

In this guide, we will walk through two examples of using [Roboflow Inference](https://inference.roboflow.com/) to run fine-tuned and foundation models. We will run inference and save predictions using an object detection model and [CLIP](https://github.com/openai/CLIP).

## Project setup [\#](https://supabase.com/docs/guides/ai/integrations/roboflow\#project-setup)

Let's create a new Postgres database. This is as simple as starting a new Project in Supabase:

1. [Create a new project](https://database.new/) in the Supabase dashboard.
2. Enter your project details. Remember to store your password somewhere safe.

Your database will be available in less than a minute.

**Finding your credentials:**

You can find your project credentials on the dashboard:

- [Database connection strings](https://supabase.com/dashboard/project/_/settings/api?showConnect=true): Direct and Pooler connection details including the connection string and parameters.
- [Database password](https://supabase.com/dashboard/project/_/database/settings): Reset database password here if you do not have it.
- [API credentials](https://supabase.com/dashboard/project/_/settings/api): your serverless API URL and `anon` / `service_role` keys.

## Save computer vision predictions [\#](https://supabase.com/docs/guides/ai/integrations/roboflow\#save-computer-vision-predictions)

Once you have a trained vision model, you need to create business logic for your application. In many cases, you want to save inference results to a file.

The steps below show you how to run a vision model locally and save predictions to Supabase.

### Preparation: Set up a model [\#](https://supabase.com/docs/guides/ai/integrations/roboflow\#preparation-set-up-a-model)

Before you begin, you will need an object detection model trained on your data.

You can [train a model on Roboflow](https://blog.roboflow.com/getting-started-with-roboflow/), leveraging end-to-end tools from data management and annotation to deployment, or [upload custom model weights](https://docs.roboflow.com/deploy/upload-custom-weights) for deployment.

All models have an infinitely scalable API through which you can query your model, and can be run locally.

For this guide, we will use a demo [rock, paper, scissors](https://universe.roboflow.com/roboflow-58fyf/rock-paper-scissors-sxsw) model.

### Step 1: Install and start Roboflow Inference [\#](https://supabase.com/docs/guides/ai/integrations/roboflow\#step-1-install-and-start-roboflow-inference)

You will deploy our model locally using Roboflow Inference, a computer vision inference server.

To install and start Roboflow Inference, first install Docker on your machine.

Then, run:

```flex

```

An inference server will be available at `http://localhost:9001`.

### Step 2: Run inference on an image [\#](https://supabase.com/docs/guides/ai/integrations/roboflow\#step-2-run-inference-on-an-image)

You can run inference on images and videos. Let's run inference on an image.

Create a new Python file and add the following code:

```flex

```

Above, replace:

1. The image URL with the name of the image on which you want to run inference.
2. `ROBOFLOW_API_KEY` with your Roboflow API key. [Learn how to retrieve your Roboflow API key](https://docs.roboflow.com/api-reference/authentication#retrieve-an-api-key).
3. `MODEL_ID` with your Roboflow model ID. [Learn how to retrieve your model ID](https://docs.roboflow.com/api-reference/workspace-and-project-ids).

When you run the code above, a list of predictions will be printed to the console:

```flex

```

### Step 3: Save results in Supabase [\#](https://supabase.com/docs/guides/ai/integrations/roboflow\#step-3-save-results-in-supabase)

To save results in Supabase, add the following code to your script:

```flex

```

You can then query your predictions using the following code:

```flex

```

Here is an example result:

```flex

```

## Calculate and save CLIP embeddings [\#](https://supabase.com/docs/guides/ai/integrations/roboflow\#calculate-and-save-clip-embeddings)

You can use the Supabase vector database functionality to store and query CLIP embeddings.

Roboflow Inference provides a HTTP interface through which you can calculate image and text embeddings using CLIP.

### Step 1: Install and start Roboflow Inference [\#](https://supabase.com/docs/guides/ai/integrations/roboflow\#step-1-install-and-start-roboflow-inference)

See [Step #1: Install and Start Roboflow Inference](https://supabase.com/docs/guides/ai/integrations/roboflow#step-1-install-and-start-roboflow-inference) above to install and start Roboflow Inference.

### Step 2: Run CLIP on an image [\#](https://supabase.com/docs/guides/ai/integrations/roboflow\#step-2-run-clip-on-an-image)

Create a new Python file and add the following code:

```flex

```

This code will calculate CLIP embeddings for each image in the directory and print the results to the console.

Above, replace:

1. `IMAGE_DIR` with the directory containing the images on which you want to run inference.
2. `ROBOFLOW_API_KEY` with your Roboflow API key. [Learn how to retrieve your Roboflow API key](https://docs.roboflow.com/api-reference/authentication#retrieve-an-api-key).

You can also calculate CLIP embeddings in the cloud by setting `SERVER_URL` to `https://infer.roboflow.com`.

### Step 3: Save embeddings in Supabase [\#](https://supabase.com/docs/guides/ai/integrations/roboflow\#step-3-save-embeddings-in-supabase)

You can store your image embeddings in Supabase using the Supabase `vecs` Python package:

First, install `vecs`:

```flex

```

Next, add the following code to your script to create an index:

```flex

```

Replace `DB_CONNECTION` with the authentication information for your database. You can retrieve this from the Supabase dashboard in `Project Settings > Database Settings`.

You can then query your embeddings using the following code:

```flex

```

## Resources [\#](https://supabase.com/docs/guides/ai/integrations/roboflow\#resources)

- [Roboflow Inference documentation](https://inference.roboflow.com/)
- [Roboflow Getting Started guide](https://blog.roboflow.com/getting-started-with-roboflow/)
- [How to Build a Semantic Image Search Engine with Supabase and OpenAI CLIP](https://blog.roboflow.com/how-to-use-semantic-search-supabase-openai-clip/)

### Is this helpful?

NoYes

### On this page

[Project setup](https://supabase.com/docs/guides/ai/integrations/roboflow#project-setup) [Save computer vision predictions](https://supabase.com/docs/guides/ai/integrations/roboflow#save-computer-vision-predictions) [Preparation: Set up a model](https://supabase.com/docs/guides/ai/integrations/roboflow#preparation-set-up-a-model) [Step 1: Install and start Roboflow Inference](https://supabase.com/docs/guides/ai/integrations/roboflow#step-1-install-and-start-roboflow-inference) [Step 2: Run inference on an image](https://supabase.com/docs/guides/ai/integrations/roboflow#step-2-run-inference-on-an-image) [Step 3: Save results in Supabase](https://supabase.com/docs/guides/ai/integrations/roboflow#step-3-save-results-in-supabase) [Calculate and save CLIP embeddings](https://supabase.com/docs/guides/ai/integrations/roboflow#calculate-and-save-clip-embeddings) [Step 1: Install and start Roboflow Inference](https://supabase.com/docs/guides/ai/integrations/roboflow#step-1-install-and-start-roboflow-inference) [Step 2: Run CLIP on an image](https://supabase.com/docs/guides/ai/integrations/roboflow#step-2-run-clip-on-an-image) [Step 3: Save embeddings in Supabase](https://supabase.com/docs/guides/ai/integrations/roboflow#step-3-save-embeddings-in-supabase) [Resources](https://supabase.com/docs/guides/ai/integrations/roboflow#resources)
