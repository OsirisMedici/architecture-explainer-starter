# Verify a presentation

Run `bun run check` first. Then use the available supported browser or HTML rendering tools. Keep automated checks separate from the architect's review of the design explanation.

## Browser checks

1. Open the current build, not an older export. Confirm project name, firm, scene order, explanatory text, source links and every configured image.
2. Visit every topic and state. The selected control, current caption, assumption note and diagram must agree. The reverse-stack state reverses the arrows. The shading states change the overhang and the ray path. The layers states lift the roof and floors. The options states change the central plate.
3. Switch rapidly between states and topics. Verify that motion can reverse and old diagrams are removed. Check for invalid SVG coordinates and console errors.
4. Enter Present. Use arrow keys to change topics, and Escape to exit. Tab through the interface and activate controls with Enter or Space. On a touch-sized viewport all essential controls remain visible and usable.
5. Check a wide desktop, a tablet and a phone down to 320 CSS pixels. Headings, controls, arrows and explanations must fit. Check long project names and longer captions. Enable reduced motion and confirm that the same information remains accessible without animated travel.
6. Export the presentation, reopen that HTML independently with networking unavailable, and repeat one state from each topic. Configured images must remain visible. The exported copy starts cleanly without a live server.
7. If delivering a private or hosted link, open that exact link and verify its identity and access on the intended viewing device when possible. State whether the host must stay awake.

## Review with the architect

Check the model against the source drawings and the brief. Confirm which facts are established, which geometry is simplified and whether every performance claim has supporting analysis. The client should understand the intended decision without requiring the architect to explain the controls.

Record checks actually performed and remaining limitations. A successful build does not establish visual fidelity, export usability, site-specific performance or client acceptance.
