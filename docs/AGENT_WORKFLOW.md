# Agent workflow

## From the starter to a project

Use the starter's `create-project` command to create a separate sibling folder, or work in a new repository generated from GitHub's template action. Confirm the chosen folder before edits. The copy command intentionally leaves out `.git`; there is no remote to the shared public starter.

Run `bun install` in the new folder. Complete the brief, inspect the source drawings, and choose an example to adapt. The default copy still contains demonstration geometry. Run `bun run check` after changing `src/project.json` and the renderer.

For the simplest presentation, keep only the relevant scenes in the config. Reorder them to match the conversation with the client. Each scene kind has a specific geometric behaviour; the state labels and captions must describe that behaviour. Renaming a ventilation scene as a structural analysis does not create a structural analysis.

## Photographs and project evidence

Copy approved images into `public/project-assets/`. Add entries like this to `images`:

```json
{"src":"project-assets/courtyard.webp","alt":"View from the living room into the central courtyard","caption":"Proposed courtyard, view from the living room."}
```

The build embeds these bytes into the standalone file. It rejects external image URLs, directory traversal, unsupported extensions and files larger than 8 MB. Review the images and captions before export. The gallery sits below the normal presentation; presentation mode concentrates on the diagrams.

## Delivery choices

- For meetings: open `dist/index.html`, enter presentation mode, and share the browser window.
- For an offline handoff: use Export presentation and reopen the downloaded HTML. It includes the configured images and works without a server.
- For a private live link: use the coding environment's supported private preview method and verify the exact link from the viewing device when possible. State the process lifetime and access requirements.
- For deployment: obtain the intended hosting destination and visibility. Build output is static and does not require an AI key. Do not assume a public GitHub starter means the client presentation should be public.

The starter has no accounts, database, CAD import, AI generation service, analytics, cloud upload or automatic deployment. The architect's existing coding agent creates and edits the project.
