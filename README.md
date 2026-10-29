# Architecture Explainer

Give this repository to a coding agent. It creates a project presentation that an architect can use with a client, in person or over Google Meet.

The starter includes interactive explanations of natural ventilation, sun protection, building layers and design options. The architect uses labelled buttons. Their agent handles the code.

## Give this to your agent

Copy this message and attach the project drawings or images you want the agent to use:

> Use https://github.com/OsirisMedici/architecture-explainer-starter to create a separate local project for my client presentation. Clone the starter into a new folder if necessary, then read its AGENTS.md. Follow its project-creation workflow so my work has no remote pointing to the public starter. Ask me which client decision we need to explain, which drawings to use, and what must remain private. Build the explanation, verify all interactions and the exported file, and give me the presentation. Keep project information local unless I explicitly ask you to publish it.

You do not need an AI API key. Your existing coding agent does the preparation. The presentation itself runs without an AI service or account.

## Try the starter

Install [Bun](https://bun.sh/) if your environment does not already have it. From a new clone:

```sh
bun install
bun run check
bun run dev
```

Open the local address printed by the development command. It listens only on loopback. Refresh after the agent edits a file. In a remote coding environment, ask the agent to use that environment's approved private preview method.

Or build the single-file presentation:

```sh
bun run build
```

Open `dist/index.html` directly in a browser. It includes the drawing engine, styles, project configuration and any configured project photographs. No server or internet connection is needed to present it. External source links require internet only if opened.

## Create a client project

Run this from the starter. Choose a new folder outside it:

```sh
bun run create-project --directory ../courtyard-client --name "Courtyard House" --firm "Your Studio"
cd ../courtyard-client
bun install
```

The command copies the working starter without `.git`, a Git remote, installed dependencies, build output or confidential source drawings. It refuses to replace an existing folder. The new project is local; creating a GitHub repository or deploying it is a separate action.

The agent completes `PROJECT_BRIEF.md`, edits `src/project.json`, and changes `src/diagram.ts` when the project needs different geometry. Text changes belong in the project configuration, not scattered through the interface.

## In the client meeting

1. Open the project presentation before the call.
2. Click **Present** to give the explanation more space. This is a simplified presentation layout; the browser's fullscreen command is optional.
3. Share that browser window in Google Meet, or show it on your laptop or tablet in person.
4. Use the topic and diagram buttons. In presentation mode, left and right arrow keys change topics; Escape exits the mode.
5. **Export presentation** downloads an independent HTML copy. Open that file to check it before sending it or taking it offline.

Sharing your screen is different from sending a live link. A live client link needs a separate hosting decision. The starter does not deploy automatically.

## Customisation

| Change | Location |
| --- | --- |
| Firm, project name, explanation copy and scene order | `src/project.json` |
| Building proportions and storey count | `src/project.json` → `model` |
| Actual building shape, openings and interaction geometry | `src/diagram.ts` |
| Project photos and renders | `public/project-assets/` and `src/project.json` → `images` |
| Agent workflow | `AGENTS.md` |
| Project questions and constraints | `PROJECT_BRIEF.md` |

The included model is a generic courtyard building. A new project name does not make its geometry accurate. The agent must check drawings, state assumptions, and adapt the diagram before presenting it as your design. See [the agent guide](docs/AGENT_WORKFLOW.md) and [the drawing guide](docs/DRAWING_GUIDE.md).

Photographs must be local PNG, JPEG or WebP files, up to 8 MB each. The build embeds them in the exported file. The export therefore contains the project information and images; share it only with the intended recipients. Original confidential source material can stay in the ignored `client-source/` folder. Files placed in `public/project-assets/` are deliberately included in the build and can be committed, so put them only in the separate client project.

## What the examples establish

These are explanatory illustrations. They do not calculate airflow rates, daylight levels, solar exposure for a site, structural capacity, comfort, cost, or regulatory compliance. The sun example is a schematic ray, with no date, location or orientation calculation. The ventilation example assumes a connected vertical path, temperature differences and no wind. Exploded views are not construction sequences. Source links and assumptions are visible in each scene.

## Checks and maintenance

`bun run check` checks types, validates configuration and project creation, checks the pinned Hairline source, and builds the portable document. [The verification guide](docs/VERIFICATION.md) covers browser and export checks. CI runs the same checks with Bun 1.4.4 and the committed lockfile.

This is a GitHub template. You may use **Use this template** to create a separate repository; choose private for confidential client work. The command above also works without GitHub authentication after you have the starter.

## Credits and license

Built using [Hairline](https://github.com/lucasmarkes/hairline) by Lucas Marques. The original kernel is vendored unchanged at a pinned commit, with its MIT license. This project is an independent starter and is not affiliated with Hairline's author. See [third-party notices](THIRD_PARTY_NOTICES.md). Starter code is MIT licensed.
