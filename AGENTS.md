# Create an architecture client presentation

The architect provides design judgement. Your task is to turn one client decision into an understandable, working explanation.

## Start

1. Read `README.md`. Inspect `src/project.json`, `src/project.ts`, and the current diagrams before proposing changes. Inspect the supplied drawings; record what they establish and what remains assumed.
2. If this is the public starter, run `bun run create-project --directory <new sibling folder> --name <project> --firm <firm>` and work in the generated project. Read the repository remote before any push. Client work belongs in a separate project with a separately authorised destination. If the architect has already created a repository from the template, continue there and preserve its work.
3. Ask for the client decision, the intended audience, source drawings, the explanation's desired conclusion and confidentiality constraints. Use the questions in `PROJECT_BRIEF.md`; ask only for missing information that changes the result. Write the answers there before implementation.
4. Choose the smallest explanation that answers the decision. Propose its initial view, its two or three labelled actions, and the sentence the client should understand. If the architect already specified these, proceed with that direction.

Start implementation when the explanation and source limitations are clear. A generic demonstration is acceptable while waiting for drawings if labelled as such; it is not evidence about the actual project.

## Build

- Use Bun. `package.json` is the source of truth for commands. `bun install` prepares a new project; `bun run check` must pass before handoff.
- Edit project copy, scene order, proportions and images through `src/project.json`. The config validator defines supported scene kinds and state counts. For new geometry or behaviour, read `docs/DRAWING_GUIDE.md` and extend the renderer and validator together.
- Keep the interface usable by an architect without coding: topic buttons, a few everyday controls, one current diagram and one short explanation. Preserve keyboard and touch access, visible focus and reduced-motion support.
- Match the actual source geometry before calling a drawing project-specific. Document simplifications. A filename, photograph or plan is not an airflow, solar or structural analysis. Use `docs/EXPLANATION_BOUNDARIES.md` when making performance claims or adapting technical examples.
- Place original confidential source files in ignored `client-source/`. Include only intended presentation images in `public/project-assets/`. Confirm the destination's privacy before committing or deploying project data.
- Keep `src/vendor/hairline-kernel.js` byte-identical to its provenance entry. Add behaviour in `src/diagram.ts`; the build supplies the module export wrapper. Preserve all third-party notices.

## Verify and hand off

Follow `docs/VERIFICATION.md`. Check every enabled scene and state, desktop and phone layouts, presentation keyboard controls, and the exported HTML reopened independently. Confirm that the project title, copy and images match the brief and that no drawing is clipped. Passing a build alone is not visual verification.

Give the architect the finished file or verified private preview link, the steps to open and present it, the checks completed, and any remaining assumptions. A local preview requires the computer and server to remain running. The exported `dist/index.html` is the portable fallback. Publish or send the presentation only when the architect requests the destination and recipients.
