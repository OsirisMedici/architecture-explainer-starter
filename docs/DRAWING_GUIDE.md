# Drawing guide

## Existing renderer

`createDiagram(stage, model, kind)` mounts one SVG and returns `setState(index)` and `destroy()`. It uses the actual Hairline kernel for projection, rounded solids and springs. The stage owns one registered animation loop and unregisters it when changing topics. It asks for another frame only while a spring is moving.

Coordinates use x and y on the ground and z vertically. Project model values are metres converted to convenient drawing units. They describe a schematic model, not a measured BIM model. The camera is fitted once per scene so a state change does not pan the explanation unexpectedly.

The ventilation states close the lid, open it with upward stack flow, and reverse the air path. The shade states show a schematic facade ray with no overhang, a high ray intercepted by an overhang, and a low ray beneath it. The layers states raise the roof and separate the floors. The options states compare continuous and open-centre plates.

Change the actual walls, openings, massing and furnishings to match the drawings. State the simplifications. The renderer does not read CAD, IFC, Revit, SketchUp, PDFs or photographs automatically.

## Hairline integration

The pinned kernel lives in `src/vendor/hairline-kernel.js`. Read the API index at its top before extending the renderer. The source is unchanged. The build plugin adds an ESM export in memory; the type declaration describes the API used here. Provenance and the original MIT notice sit beside the file.

Use `Cam`, `proj`, `fit` and `facing` for the camera. Use `rings`, `prism`, `solid` and `put` for opaque rounded solids. Append farther surfaces first so nearer solids hide the right edges. Use `spring`, `stepS` and `register` for interruption-safe motion. `setReducedMotion` lands these movements immediately when the browser preference is enabled.

Keep diagrams legible at rest, use highlights to communicate the current selection, and keep names and explanations in the surrounding interface. Buttons must work on touch and keyboard; essential information cannot depend on hovering.

For more elaborate custom figures, Hairline's official [create skill](https://github.com/lucasmarkes/hairline/tree/main/skills/hairline-create) and [adopt skill](https://github.com/lucasmarkes/hairline/tree/main/skills/hairline-adopt) contain its complete figure-authoring workflow. Review those instructions before choosing to use that separate workflow; installation is optional for this starter.

## Add a scene kind

Extend the type, validator and exact state count in `src/project.ts`, add the drawing behaviour in `src/diagram.ts`, and add a scene to `src/project.json`. Include a plain-language question, two or three meaningful states, an explanation for each, and relevant source links. Add domain validation and browser state checks. Do not add controls that only change styling without helping explain the client decision.
