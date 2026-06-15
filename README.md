# SourceWise

SourceWise is an AI-guided research discovery app that helps students turn a broad research topic into a structured research path. Instead of dropping users into a long list of papers, SourceWise first maps the research landscape, then shows ranked academic sources, credibility signals, paper comparisons, and active debates.

Built for the **Agents League Hackathon** as a **Reasoning Agents** project using the **Microsoft Foundry IQ** intelligence layer through AI model reasoning.

## Live Demo

SourceWise is deployed at:

[source-wise](https://source-wise-two.vercel.app/)


## Demo Video

Watch the demo video:

[SourceWise demo](https://www.youtube.com/watch?v=-WILZ70zfNY)

## What It Does

SourceWise helps a student move from:

> "I have a topic, but I do not know where to start."

to:

> "I understand the themes, strongest papers, credibility signals, and debates in this research area."

Core workflow:

1. Enter a research topic.
2. Choose an academic level.
3. SourceWise searches real academic papers.
4. AI agents organize the topic into themes.
5. The app shows ranked papers, credibility signals, debates, and comparisons.
6. Signed-in users can come back to saved research topics from their research history sidebar.

## Key Features

- **Real academic paper discovery** using Semantic Scholar.
- **Research Map Agent** that groups papers into topic themes.
- **Credibility Agent** that produces cautious credibility signals.
- **Debate Agent** that identifies tensions and opposing views in the literature.
- **Comparison Agent** that compares two selected papers.
- **Saved research history** with Supabase Auth and Postgres.
- **Animated landing demo** showing how SourceWise maps a medical research topic.
- **Responsive pastel UI** with a SourceWise `SW` favicon and app branding.

## Agent Architecture

SourceWise uses several focused agents instead of one large generic response.

### Research Map Agent

Input:

- user topic
- academic level
- paper titles, years, and abstract snippets

Output:

- 4 research themes
- explanations
- related paper titles
- debate status
- debate questions

### Credibility Agent

Input:

- paper metadata
- citation count
- year
- venue
- publication type

Output:

- credibility score
- citation strength
- recency signal
- methodology signal
- venue quality
- limitations
- cautious reason to read the paper

The app avoids claiming a paper is definitely "trustworthy." It uses language such as "stronger signal," "worth reading," and "use with caution."

### Debate Agent

Input:

- topic
- research map
- papers

Output:

- debate questions
- explanation of each debate
- sides of the debate
- linked paper IDs

### Comparison Agent

Input:

- two selected papers
- topic

Output:

- where the papers agree
- where they differ
- method difference
- best dissertation use

## Microsoft IQ Integration

For Agents League, SourceWise fits best under:

- **Track:** Reasoning Agents
- **Microsoft IQ layer:** Foundry IQ

SourceWise uses AI model reasoning through Microsoft Foundry / GitHub Models style model endpoints to transform real academic paper metadata into structured research maps, debates, and comparisons.

## Tech Stack

- **Next.js 16 App Router**
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Semantic Scholar Graph API**
- **GitHub Models / Azure AI Foundry-compatible model endpoints**
- **Supabase Auth**
- **Supabase Postgres**
- **Vercel deployment**

## Project Structure

```text
src/
  app/
    api/
      compare/
      research/
    auth/
    research/
  components/
    Hero.tsx
    ResearchExperience.tsx
    PaperList.tsx
    ResearchHistoryDrawer.tsx
  lib/
    semanticScholar.ts
    researchMapAgent.ts
    credibilityAgent.ts
    debateAgent.ts
    paperComparisonAgent.ts
    researchProjects.ts
    supabase/
  types/
    research.ts
supabase/
  research_projects.sql
```

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

If `.env.example` does not exist yet, create `.env.local` manually using the variables below.

## Environment Variables

Do not commit `.env.local`. This project ignores `.env*` in `.gitignore`.

Required:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SEMANTIC_SCHOLAR_API_KEY=
```

AI model configuration, depending on provider:

```env
GITHUB_MODELS_TOKEN=
GITHUB_MODELS_ENDPOINT=https://models.github.ai/inference
GITHUB_MODELS_MODEL=openai/gpt-4o-mini
```

Optional Azure AI Foundry-compatible configuration:

```env
AZURE_AI_FOUNDRY_ENDPOINT=
AZURE_AI_FOUNDRY_API_KEY=
AZURE_AI_FOUNDRY_MODEL=
```

Optional OpenAI fallback:

```env
OPENAI_API_KEY=
```

## Supabase Setup

1. Create a Supabase project.
2. Add the project URL and publishable key to `.env.local`.
3. Open Supabase SQL Editor.
4. Run the SQL in:

```text
supabase/research_projects.sql
```

This creates the `research_projects` table and Row Level Security policies so users can only access their own saved research.

## Run Locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build

```bash
npm run build
```

## Lint

```bash
npm run lint
```

## Deployment

The app is designed to deploy on Vercel.

In Vercel, add the same environment variables used locally:

```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SEMANTIC_SCHOLAR_API_KEY
GITHUB_MODELS_TOKEN
GITHUB_MODELS_ENDPOINT
GITHUB_MODELS_MODEL
```

Then update Supabase Auth URL settings:

```text
Site URL:
https://your-vercel-domain.vercel.app

Redirect URL:
https://your-vercel-domain.vercel.app/auth/callback
```

Keep local redirects too:

```text
http://localhost:3000
http://localhost:3000/auth/callback
```

## Demo Ideas

Good topics to try:

- `climate change adaptation`
- `mental health interventions`
- `type 2 diabetes medication adherence`
- `cybersecurity education`
- `AI in software engineering`

## Security Notes

- `.env.local` is ignored and should never be committed.
- Private API keys must not start with `NEXT_PUBLIC_`.
- Supabase publishable keys are safe to expose only when Row Level Security is configured correctly.
- Do not upload confidential data to the app or repository.
- Rotate any API keys that were accidentally shared outside your local environment.

## License

This project is licensed under the terms in [LICENSE](LICENSE).
