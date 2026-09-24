# Field assembly interface — 0.2.3

Selected equipment can be moved using mouse or touch drag. The grabbed cell remains under the pointer, including multi-cell shapes and the portrait board's rotated coordinates. Dragging previews a move; the ring's Confirm commits it. Blocked cells disable Confirm. Cancel, Escape and interrupted touch gestures preserve the original placement. Dragging toward the edge keeps the complete footprint on the board.

Rotate, Retrieve and Confirm surround the selected footprint. Near edges their positions move around the orbit so the buttons remain clickable without covering the piece. A nearby caption provides details and cancellation; destructive discard is in the details dialog. The inventory collapses during selection, and new reward equipment enters a legal preview automatically when one is available. Confirm deselects the piece. Retrieve keeps the item in inventory. Undo remains available. The simulation and save format are unchanged.

Occupied plates remain brass / rust / turquoise for the iron / boiler / electric teams, with team-colored borders during both assembly and combat. The original location is faded while previewing a move.

## Validation

- 22 simulation tests passed; static build passed.
- Actual Chrome mouse and CDP touch gestures at 1280×720, 390×844, 320×568 and 844×390: grabbed-cell offsets, explicit commit, invalid route, edge clamping, cancellation, four rotations, retrieve/undo, inventory placement, reload persistence, equipment details, battle edit lock, all four board corners' clickable controls, no document overflow or browser errors.
- Smoke flow: unfinished dialogue restore, retrieve/undo, discard/undo, pause/save, reward re-selection, assisted checkpoint recovery, modal fit on four sizes.
- Harpoon regression: orientation hints, committed rotation, details, actual shots and nonzero damage on mouse and touch.
- Real touch play from the opening through the second pursuit: two placements, one earned reward, no browser errors. This is an interaction regression, not a new complete-run balance evaluation; combat rules and numerical balance were not changed.
- Screenshots inspected for footprint contrast, orbit controls and compact landscape caption placement. Screenshots are local diagnostic artifacts; JSON results are checked in.
