# Starter verification

Verified on 29 October 2026 with Bun 1.4.4.

- Type checking, 9 automated tests and the self-contained build passed.
- Browser-renderer checks covered all 4 topics and 11 states, finite SVG geometry, stable framing, selected controls, captions, presentation keyboard navigation and export serialization. The deterministic reduced-motion run passed 72 assertions.
- The actual exported document was captured, reopened as a separate document, and changed topics and states successfully. It had no external script or stylesheet dependencies.
- A freshly generated client folder installed and passed its checks. A second configuration with a different firm/name, two topics and a local image built and rendered with the image embedded.
- Desktop rendering was inspected at 1504 CSS pixels, tablet at 768, and phone at 390 and 320. The 320-pixel test had no horizontal page overflow.

The built-in HTML browser renderer was used for these checks. Direct preview-tab automation was excluded by the runtime's rule for checking the agent's own edits. No development server or public hosting was needed for verification.

## Reference comparison

The generated design reference and the latest desktop render were both opened for direct image inspection. The reference is `docs/design/presentation-concept.png`.

| Item | Result |
| --- | --- |
| Main heading, project context, question and initial caption | Match the reference wording. |
| Topic rail, order, header actions and state controls | Match the reference structure; narrower rail leaves more explanation space. |
| Palette | White paper, charcoal controls and thin gray drawing strokes retained. |
| Typography | Georgia headings/controls and system sans metadata; readable responsive sizes. |
| Drawing | Working Hairline SVG preserves the two-storey courtyard and air path. It is intentionally a schematic parametric model, with fewer details than the generated reference. |
| Caption and footer | Same hierarchy; sources and assumptions disclosure added for technical context. |
| Mobile | Topics become a two-column grid; controls wrap and captions stay readable. |

The interface was checked against the reference with the documented schematic-model adaptation. The above-the-fold copy retained the reference's project, heading, topic names, question, introduction and controls. Functional additions are source/assumption notes and delivery controls described in the design document. No photographic or project-specific accuracy is claimed.

## Limits

These checks establish the starter's behaviour, not acceptance by an architect or client. Google Meet screen sharing was not exercised. No site-specific engineering analysis was run. Future client customisation must be rechecked against its own drawings, brief, recipient permissions and exported file.
