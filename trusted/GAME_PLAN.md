# Game plan — The Witch's Hut

## Crystal ball hints (1 November 2026)

Crystal ball can be picked up from the south table and then appears below the shared notepad for both players, without using an inventory slot. Clicking the crystal ball opens a voluntary hint menu. Only deliberately inspected topics (or topics inferred from existing saved progress) appear; general exploration and inventory help are always available. Each topic has three increasingly explicit English hints in his posh, teasing voice. Discovery is shared; hint levels are saved separately per player and puzzle stage. Private puzzle completion and uncollected memory rewards are checked separately. Reset clears companion and hint progress. Files: crystal-ball.js, crystal-ball-hints.js, crystal-ball-hints-data.js. Content/planning: SPAKULAN_LEDTRADAR.md.

Validation: test-crystal-ball.cjs passes discovery gating, progression, persistence, private state, prerequisites, all menu topics, fitting and reset. test-kettle.cjs passes. Existing test-memories.cjs currently stops at its desk-placement click because the uncollected spellbook cover overlaps the test target; the same failure occurs with the new hint scripts blocked.

> **Current memory/story reference (updated 1 November 2026): [MINNEN_PLANERING.md](MINNEN_PLANERING.md).** Read it before working on memories, diary pages, the introduction or ending. The latest puzzle plan lists eight memories and requires ten reward puzzle pieces to unlock Tell My Story; their reconciliation with the older nine-memory story plan and separate execution introduction remains open. Puzzle pieces are distinct from entry fragments. This update is planning only: do not implement it yet. Next: draw the memory scenes, then design the dungeon.

## Core premise
Two players work together to lift a curse placed on a city by a witch seeking revenge after she was hanged for witchcraft. The players discover the witch's story through memories, then piece together what happened and when.

## Play structure
- The players are together in the shared hub, **The Witch's Hut**.
- The game is being prototyped as two player panels on one screen. The intended game uses separate screens, with private clues that players communicate to each other.
- Solving puzzles unlocks tarot-style cards containing memories from the witch's life.
- Players interpret the memories and determine their chronological order.
- The story is revealed piece by piece as players solve puzzles and arrange the memories.

## The Witch's Hut layout
- The room is shown as one still image per wall. Players turn left or right to see the next wall.
- **North wall:** A desk with a penholder, skull, and the Spellbook. The desk art has been removed from the mockup so the user can draw a replacement. Its other desk-top placeholders and clickable Spellbook remain in place. The Spellbook is picked up into a permanent inventory slot and disappears from the desk. Its front shows four symbols and a four-number lock; its back shows which number belongs to each symbol. The temporary code is `1234`. Player 1 sees only the front and can enter the code; Player 2 sees only the back. The recipe lists appear only after the Spellbook is unlocked, and each player sees only their own list. Only one player can hold the Spellbook open at a time, and it can be opened from anywhere. When open, both see the same inside pages.
- **East wall:** A small locked door to a back room, a painting of a mother and three children, and a chest with a keyhole. The back-room lock puzzle is still to be designed.
- **South wall:** A shelf of bottles and jars, drying herbs, a kettle over a firepit on the right, and a small table in the middle. A shared notepad sits on the table and goes into a permanent inventory slot when picked up. Both players can open it at once and see each other's edits immediately.
- **West wall:** A locked exterior door that stays locked until the curse is broken, and a window looking into the forest.

## Kettle recipe puzzle
- The hut contains 10 bottles, 10 jars, and 10 herbs to find. The herbs are inside a locked code cabinet; the code logic is still to be designed.
- At the kettle, the players must follow five steps in order. At each step both players must click their assigned ingredient at the same time:

  | Step | Player 1 pours | Player 2 pours |
  |---|---|---|
  | 1 | Bottle 1 | Bottle 3 |
  | 2 | Jar 4 | Jar 6 |
  | 3 | Herb 7 | Bottle 8 |
  | 4 | Jar 8 | Jar 9 |
  | 5 | Jar 2 | Bottle 5 |

- An incorrect ingredient, step order, or lack of simultaneous actions resets the recipe to the first pair. The kettle gives an immediate visual/audio reaction (for example, a hiss or overflow); the exact effect can be chosen during implementation.
- Ingredients are never consumed, whether the attempt fails or succeeds. They stay in the players' inventories, which can become full.
- When all five pairs succeed, the brew remains in the kettle and contains enough for two bottles.
- The players can find a ladle and one empty bottle each. Empty bottles are intended to be difficult to find. Each player can use the ladle to fill their own bottle. A filled bottle glows like a lantern and is the flashlight used to search the dark room. If only one player fills a bottle, only that player gets a lantern.

## Inventory and dropped-object rules
- Each player has 10 regular inventory slots and permanent inventory spaces for the Spellbook and shared Notepad.
- The Spellbook is available in both players' permanent inventory. Only one player can have it open at a time; opening it on one player's screen closes it on the other player's screen.
- The Notepad is available in both players' permanent inventory. Both can open it at once, add as many pages as needed, and see each other's writing immediately.
- Each object is unique: at most one player can carry a given object at a time.
- Players can put physical inventory objects down anywhere in the game world to free inventory space.
- A dropped object becomes visible to both players, stays in exactly that world location after leaving and returning to the scene, and can be picked up by the other player.
- Dropped objects are not consumed by recipe attempts.

## Lantern and memory-card fragment puzzle
- The kettle brew can be ladled into two empty bottles, one for each player. A filled bottle glows and is used as a flashlight in a dark room.
- A lantern is selected from the inventory and follows the cursor, illuminating only the area beneath it. Objects revealed by the light can be clicked and picked up, even while the lantern remains selected.
- Each of two rooms contains one half of a memory card in tarot-card format. The two room locations and art remain to be specified.
- Players bring their halves to the hut. They can place a half on any surface. If one half is already placed, the other player can select their matching half and click on or near the placed half to join them automatically.
- The completed card remains in the hut. Each player can click it independently to enter the memory, then use a simple Back control to leave.
- How all completed cards are placed at the end is intentionally undecided for now.

## Build approach
We will implement and test one puzzle at a time, using temporary graphics where useful. Scanned hand-drawn artwork can replace those graphics later. The user supplies the game concepts and puzzle ideas; do not invent new ones. Ask clarification questions when needed and mention practical considerations when useful. Keep the playable preview current at each step.

## Artwork currently used in the prototype
- Room backdrop: `Testspel 2/0_background.JPG`.
- North wall: Spellbook `2a_bok.png`; the desk image has been removed for replacement with the user's hand-drawn artwork. Other desk-top placeholders remain in place for now.
- Spellbook pages: open-book illustration `2a_bok.oppen.png`.
- South wall: table `1_bord.png`, notepad `0_anteckningsblock.png`, shelf `1_hylla.png`, and kettle `2b_kastrull.png`.
- The family portrait remains a simple placeholder because the available paintings depict a bird, deer, and numbered fox.
- These are mockup assets; the intended hand-drawn replacements can be swapped in later.

## Decisions to make as we build
- How the two separate screens connect and share game progress
- Which objects and clues are private to each player
- Where the bottles and jars are located, how each ingredient looks, and which recipe list belongs to each player
- The code logic and location for the herb cabinet
- Where the ladle and two hard-to-find empty bottles are located
- The two rooms containing the memory-card halves and their visual details
- The back-room lock puzzle and code
- How and where completed memory cards are arranged at the end
- What happens when the story is reconstructed

## Current prototype
The playable mockup is `index.html` (open `trusted/index.html` in the browser). It has four hut wall views and a two-panel local test layout, with an independent wall position for each player. It has a Spellbook pickup, cover lock (`1234`), single-owner open-book overlay and page turning; a shared two-screen Notepad with live text updates; 10 regular item slots and permanent book/notepad slots; local saved progress and a Reset button. Test buttons simulate a completed kettle brew and the bottle/ladle prerequisites, so each player can fill a bottle, select its lantern, enter a dark-room test view, and reveal a placeholder.

The full kettle recipe interaction, normal ingredient and tool pickup, inventory capacity/drop flow, placing and retrieving objects, dark-room artwork and actual memory fragments, back room, ending, and cross-device multiplayer connection are not implemented. Progress is saved with browser `localStorage`; use Reset when a clean start is wanted. The user can open the preview at `file:///C:/Projects/TestSpel3/trusted/index.html`.

## Handoff for a new chat
Read this plan and `trusted/index.html` before continuing. Treat the features listed under **Current prototype** as implementation status, and the earlier sections as the agreed design. Continue one puzzle or feature at a time, update this handoff as decisions change, and preserve the user's authorship of game ideas. The next drawing-related change is to replace the north-wall desk with the user's drawing when it is ready.

## Artwork update
The main project now uses the six PNG files in `Grafik/`: the desk on the north wall, the tall shelf and wall shelf on the south wall, and the exterior door and tall golden window on the west wall. The small round window replaces the mother-and-children portrait on the east wall. Original artwork files are preserved. Player panels are stacked vertically and the local preview runs at http://127.0.0.1:5174/.

## Layout editor
`index.html` includes a Swedish layout toolbar. Enable Redigera layout to drag props and resize them proportionally with the bottom-right handle. Wall navigation remains available; scene, inventory and test-tool clicks are blocked during editing. Both player panels share the same per-wall layout. Spara layout stores it separately from game progress in browser localStorage (`witches-hut-layout-v1`). Ångra osparat restores the saved layout; Återställ layout restores CSS defaults and requires Save to persist. Exportera layout downloads JSON for transfer into project source. Layout is currently browser-local, not written back to project files.
The north wall now has four independently editable wall shelves using Grafik/0_vagghylla.PNG. The south wall has two wall shelves. The east interior door also uses Grafik/0_dorr.PNG. Repeated shelves use stable individual layout IDs; existing saved placements are preserved.
All four hut wall views now use Grafik/0_bakgrund1.JPG as their shared backdrop, replacing the Testspel 2 background. The dark-room test retains its darkness effect.
The north wall includes Grafik/2a_anslagstavla.png centered above the desk. The noticeboard can be moved and resized independently in the layout editor.
The small round window has moved to the north wall above the desk. The noticeboard is now on the east wall, which also has two independently editable wall shelves (east-shelf-1 and east-shelf-2).
Artwork filename update: the east-wall noticeboard now references Grafik/1_anslagstavla.png. All CSS image paths in index.html were checked against local files.
Layout editor: selection boxes now measure the visible alpha bounds of background artwork, accounting for contain scaling and transparent margins. Movement allows negative and off-scene coordinates, so artwork can reach corners or extend beyond scene edges. Proportional resizing keeps the visible top-left corner anchored.
The shared Notepad overlay now uses Grafik/0_anteckningsblock.png with an editable transparent writing area, two small bottom corner page arrows, and a page number. It fits within each player scene and closes on backdrop clicks, without a dialog frame or close button. The same artwork is used for its inventory miniature and table pickup. Existing shared text synchronization and page saving are preserved.
Visual trial: the desk and wall shelves use subtle warm brown CSS drop-shadows that follow transparent artwork edges. Original images and saved layouts are unchanged.
Warm brown shadows now cover all fixed furnishings: both doors, both windows, all shelves, noticeboard/painting, herbs, desk, small table, chest, firepit and kettle. The exterior door keeps its shadow on hover.
The south-wall kettle now uses Grafik/0_kittel.PNG, including its drawn hanging chains. CSS kettle shapes and the separate placeholder handle are hidden. The warm shadow and editable kettle layout key are preserved.
The small south-wall table now uses Grafik/0_bord.PNG. Player 2 sees Grafik/1_spellbook.back.PNG as an image-only cover overlay closed by clicking its backdrop; Player 1 retains the rendered front and existing temporary 1234 lock. The new back artwork contains drawn symbols but no numeric symbol key, so its final puzzle mapping remains to be designed.
The image-only spellbook back overlay uses a constrained flex layout and object-fit:contain so the full image fits inside the player scene without scrolling.
General overlay rule: all overlays must fit fully inside their player view and viewport without scrolling. The shared overlay fitter scales rendered book dialogs to available space on opening, content changes and resizing; image overlays use contain sizing. Image overlays have no surrounding panel or close button and close on backdrop clicks.
Fixed CSS cascade for the south-wall table: its Grafik/0_bord.PNG rule now follows the old rendered placeholder rules so the drawn table actually takes precedence.
Shelf dressing: all ten Grafik/1_burkN.png and ten Grafik/1_flaskaN.PNG assets are distributed once each across the four north wall shelves, two east shelves, two south wall shelves and tall south shelf. The six generated jar placeholders are removed. The shuffled order is shared by both panels and persisted under witches-hut-shelf-order-v1. Items follow shelf movement/resizing. These are visual placements; ingredient pickup is still pending. No shelves exist on the west wall.
Each shelf jar and bottle is now individually editable using its ingredient ID, with selection boxes fitted to image alpha bounds and stronger soft contact shadows. Ingredient handles appear above shelf handles. Saved ingredient coordinates remain relative to their shelf stock layer, so they follow shelf movement and scaling. Undo/reset preserves the original inline item placements.
The west wall now contains Grafik/1_ortskap.PNG and exactly ten separate herbs (1_ort1 through 1_ort10). Cabinet and each herb are editable. Herb coordinates are relative to the cabinet artwork and scale/move with it. Doors and code-lock graphics are deliberately not attached yet so the user can arrange herbs behind the future transparent door panes. Lock interaction is pending.
The tall window has been removed from the west wall. The source image is retained in Grafik.
Grafik/1_skapdorrar.PNG is now layered over the herbs inside the fitted cabinet artwork layer. Its transparent panes reveal the herbs, and doors track cabinet movement/resizing. Lock and opening interaction remain pending.
The herb cabinet has a clickable lock using Grafik/1_kodlas.png (no 1_las file currently exists). Clicking it opens the same image in a contained image-only overlay, independently per player; clicking outside closes it. Code entry/unlocking is not implemented yet.
The cabinet lock overlay now has four clickable number fields. Each starts at zero, increments modulo ten, is shared across the two panels, and persists with game progress. Reset game resets the digits. No correct-code check or door opening is attached yet.
Lock numbers now have transparent backgrounds and a dark aged serif style. During layout editing, the cabinet lock can be opened; its four digit hit areas can each be moved/resized and saved using shared cabinet-lock:digit-N keys. Digit values do not increment while editing, and clicking the image backdrop still closes the overlay.
Cabinet code 1234 now unlocks the shared cabinet, removes lock/closed doors and displays 1_skap.oppet.PNG aligned around the original herb positions. The open image has a baked-in opaque checkerboard background. Unlocked herbs can be collected once by either player, appear as inventory thumbnails, disappear for both players and persist with game progress. Inventory capacity is ten including the lantern. Reset game relocks the cabinet and returns herbs.
All fifteen 1_trinketN.PNG images are distributed across the four walls with stable, separate editor IDs and soft shadows. Generated room skull/penholder/small prop and hanging herbs were removed. Chest uses 1_kista.PNG; firepit and flame use 1_eldfat.PNG and 1_flamma.png; kettle image override corrected. The existing functional rendered spellbook front remains pending its replacement artwork.
Trinket 14 (the key) has moved from the east wall to the west wall and remains independently editable.
Object shadows strengthened throughout the room artwork. All fifteen trinkets now have two soft warm contact-shadow layers; furniture, doors/windows, cabinet, lock, herbs and bottles/jars have stronger shadows. Book and notepad pickups also cast shadows.
Five empty bottle images (1_tomflaska1 through 5) are distributed once each across five randomly selected wall shelves. Their shelf assignments persist separately, match across players, and each bottle has an independent editable layout ID plus item shadows. The flame has been removed from the firepit; finding firewood will be part of a future user-designed puzzle.

## Key, chest and firewood
Trinket 14 is now a unique collectible key. Selecting it in inventory and clicking the east-wall chest unlocks the shared chest. The key remains in inventory. Clicking the unlocked chest opens an image-only top view with collectible Grafik/1_ved.PNG. Wood is unique, occupies one regular slot and can be placed in the south-wall firepit by selecting it then clicking the firepit. Placement removes it from inventory and adds visible wood without igniting it. Shared chest/wood progress and player inventories persist; Reset game restores the initial puzzle. Ten-slot capacity includes the lantern. Open-chest and top-view artwork are temporary SVG renderings (source files chest-open-placeholder.svg and chest-top-placeholder.svg, embedded in index.html for the current preview server). Replace them when the user supplies the final chest images. Mechanic checks cover locking, unique ownership, capacity, chest inspection, selection requirements and wood placement.
Placed firewood is independently movable and resizable in the layout editor as Ved i eldfatet. Its saved placement is relative to the firepit and shared by both players.
Placed firewood now switches the firepit to Grafik/1_eldfat.ved.png instead of rendering a separate wood layer. The combined image keeps the firepit layout and shadow, including for previously saved wood placement.
Spellbook front now uses Grafik/1_spellbook.front-v2.png for Player 1, the desk pickup and permanent inventory miniature. The front overlay is image-only and fits the player view; its four numeric inputs are positioned over the drawn lock and automatically check the existing 1234 code once all four digits are entered. Backdrop click closes it.
The kettle now has a drawn SVG ceiling hook and a longer linked chain connecting to the top ring in its original artwork. The hanging chain recalculates when the kettle is moved/resized or the preview size changes. Original kettle artwork is preserved.
Ceiling chain and hook restyled to match the rough hand-drawn kettle: irregular tilted links, layered charcoal/blue-gray metal strokes, stray ink outlines and muted warm scratches. Deterministic variations stay stable during movement/resizing.
Final chest artwork is connected: Grafik/1_kista.oppen.PNG replaces the open-chest placeholder and Grafik/1_kista.topview.PNG replaces the top-view placeholder. The top-view overlay keeps its image proportions and fits the player view; firewood is positioned inside the lower chest compartment. Key/unlock/wood mechanics are unchanged.
The unlocked spellbook now displays only Grafik/1_bok.oppen.png, fitted without scrolling. Placeholder text, page controls and surrounding dialog/close button are removed from this view. Click outside the image to close. Book content will be added later.

## Fire-starting puzzle
Flint (1_flinta.PNG) is hidden on the north wall, steel (1_eldstal.PNG) on the east wall, and tinder (1_fnöske.PNG) inside the herb cabinet behind its doors. All have unique editable layout IDs, alpha-fitted handles and shadows. Each can be collected once, with ten-slot inventory capacity; cabinet tinder requires unlocking. Select each tool and click the shared firepit to contribute it. Either player can contribute parts in any order. Once all three and the wood are present the fire lights. Placed tools and fire progress persist and reset with Reset game. The firepit switches between 1_eldfat.PNG, 1_eldfat.ved.png, and 1_eldfat.ved.brinner.png; no separate flame is rendered. Mechanic checks passed for cabinet gating, uniqueness, contributions from both players, required wood and ignition.

## Item inspection
Shelf bottles/jars, empty bottles, trinkets, herbs, fire tools, chest firewood and regular inventory items now open a shared image-and-description inspection view. All 55 catalog entries have English names/descriptions. World inspection happens before pickup; Take transfers a unique item into a free inventory slot. Inventory inspection offers Use to select it for existing puzzles. Locked cabinet herbs/tinder can be inspected but not taken. Clicking the backdrop closes the overlay. Layout editing bypasses inspection. Collected artwork disappears for both players and regular item IDs survive reload. Bottle/jar contents are fictional witch ingredients while numeric IDs retain recipe mapping. Herb names are preliminary visual identifications (1 Tarragon, 2 Rosemary, 3 Sage, 4 Thyme, 5 Mint, 6 Lavender, 7 Oregano, 8 Lemon Balm, 9 Dill, 10 Chamomile). The original names were sought in Generera bilder, but the relevant older turn exceeds the chat reader size limit; user has been asked for the numbered list. Do not treat these provisional names as verified species IDs.

## Implemented kettle recipe
The real five-pair recipe is now connected to the existing ingredients. Each unlocked spellbook displays only its owner's English recipe list over the open-book art. The fire must be lit. Select ingredients using inventory inspection > Use, then click the kettle in each player's view within 1000 ms. A wrong ingredient, repeated same-player pour or timeout resets all steps; ingredient inventory entries are preserved. Failure shakes the kettle, adds a red flash and spilling bubbles, and plays a brief procedural hiss. Completing five pairs gives the kettle a warm glow and exactly two servings. The temporary ladle is found on the south wall and is editable. Carry it with an actual empty bottle, select either and click the successful kettle to replace the empty bottle with that player's glowing lantern. The ladle remains available and can be put down for the other player. Test brew/kit/fill buttons are hidden; the dark-room test remains available.
Inventory inspection now has Put down for physical objects. Items dropped on the current wall remain visible to both players and can be taken by the other. Dropped items have independent layout IDs to avoid conflicting with original shelf positions. Partial completed recipe steps, brew state, servings and dropped world objects persist; a pending simultaneous pair is cancelled on reload. Reset clears recipe and drops without resetting the editor layout. Tests in trusted/test-kettle.cjs check fire/book prerequisites, timeout reset, ingredient preservation, all recipe pairs, bottle conversion, two-serving limit, shared ladle, and cross-player handoff. The preview was checked for the new ladle and inspection UI.

## Persistent notes side panels
The shared notepad is now available from the start in an independent collapsible side panel for each player. It has been removed from the permanent inventory and table pickup, and no longer opens in a scene overlay. The original notepad image, writing surface and page arrows remain. Wide views place notes beside the game; views under 600px place notes below it. Each player navigates pages independently; text updates live for both when viewing the same page. Existing saved notes are preserved, collapsed state persists, and unchanged note DOM is retained through game redraws to avoid losing typing focus. Notes remain usable while book/inspection overlays are open and during layout editing. Syntax and existing recipe/handoff checks pass; the side-panel placement was visually checked in the preview.
Notepad pickup is required again: it appears on the south-wall table until collected by either player, which unlocks and opens both notes side panels. Before collection panels are collapsed/disabled. Existing note text is preserved; saved pickup state uses notepadPickupVersion 2 so saves from the always-open experiment require a fresh pickup once. Reset relocks notes and restores the table pickup.
Put down now returns each physical item to its original scene/shelf/cabinet/chest placement, preserving its saved editor layout. It no longer drops objects on the current wall floor. Legacy floor drops are cleared on load, returning those items to their origins. Inventory is freed and the other player can collect the returned item. Returning wood refreshes any open chest top views.
The ladle now uses Grafik/1_slev.PNG in the room, inventory and inspection view, replacing the temporary SVG. Existing ladle placement and recipe functionality are preserved.
Three main-project paintings (1_tavla1.PNG bird, 1_tavla2.PNG fox, 1_tavla3.png deer) are placed on the east wall. Each has its own editor ID and warm shadow. Clicking opens an image-only fitted overlay; puzzle mechanics will be designed later.
A fifth independently editable wall shelf (north-shelf-5) has been added to the north wall. It starts empty; existing ingredient assignments and saved shelf layouts are unchanged.

## Preview usability updates
World image hit-testing now uses visible image bounds independent of shelf parent hitboxes, so relocated bottles, jars and trinkets can be inspected even on the floor. Overlay clicks outside the actually painted image close the overlay, while captions, inputs and buttons remain interactive. The table notepad now keeps its native aspect ratio and contain sizing, including saved editor layouts and hover.
The visible Test: solve brew puzzle button completes all five recipe steps, clears any pending pour and prepares two servings minus existing player lanterns. It leaves inventory and other puzzle progress intact, allowing manual bottle-filling and dark-room lamp tests without simultaneous clicks.

## Memory design — conversation reference, 29 October 2026
Source: ChatGPT conversation `6ae37936-de24-83ed-97c9-55d4b65e35e9` (Fortsätt spelet). The reader returned only the final five turns; earlier fragment-assembly details are unavailable. Do not treat those missing details as confirmed.

Confirmed in the retrieved conversation:
- Completed memories are kept on a shelf and can be revisited.
- Players enter memories independently, including when the other player is already inside.
- Each player always sees only the perspective assigned to that player.
- Whether leaving or revisiting requires solving the puzzle again is deliberately deferred until the memory puzzles are designed. A temporary prototype Back control does not settle that design question.

Story outline from the supplied conversation preview (proposed, not implemented):
- A poor girl lives with her mother and two younger siblings. A wise woman from the forest treats her sick mother.
- After her mother's death she learns healing from the wise woman and supports her siblings.
- She falls in love with Inge, who is already married (updated story decision, 6 November 2026; replaces the earlier betrothal). He betrays her and accuses her of black magic. The earlier marriage-promise detail has not been reconciled with this change. See MINNEN_PLANERING.md for memory 3's shared middle room, secret meeting and wife/marriage clues.
- Innocent at the time of the accusation, she is imprisoned and escapes. Only after hiding in the forest does she begin practising real black magic.
- She is captured and executed, cursing the town before her death. Two players must discover and retell her true story to lift the curse.
- Nine proposed memories: childhood home, wise woman, apprenticeship, secret love, betrayal, dungeon, witch in the forest, capture, execution.
- A proposed cooperative memory puzzle gives one player symptoms and herbs, the other a recipe book and herb illustrations; it requires repeated communication. Exact puzzle details remain to be designed.

Implementation status: no memory fragments, memory shelf or playable memory scenes yet. The existing dark-room interaction still collects a placeholder. Confirm the missing assembly interaction with the user before implementing it.

## Ladle cursor and rotation
Bottle filling now has two distinct steps. The player must carry the physical ladle and an empty bottle, inspect the ladle and choose Use. It becomes a custom cursor over the scene and inventory. Clicking a successful kettle charges the ladle with one serving and adds a small glow to the cursor, without filling or removing a bottle. Clicking an empty bottle slot with the selected charged ladle consumes that bottle and creates the player's lantern. Only the ladle can scoop; empty ladles cannot fill bottles. The shared ladle charge persists and follows the unique ladle if returned and taken by the other player. The brew test button counts existing lanterns and a charged ladle when calculating remaining servings. Tests cover both steps and selection/ownership prerequisites.
The layout editor now includes a circular rotation handle on each object, a numeric Vinkel field, Shift snapping to 15 degrees and a Räta upp reset for the selected object. Rotation is saved/exported with position/size, uses CSS rotate to preserve existing transforms, and is retained when moving/resizing. Older layouts default to zero rotation.

## Authoritative memory mechanics — user specification, 29 October 2026
This replaces earlier tarot-card, arbitrary-surface assembly and chronological-card-sorting proposals above.
- Nine memories, two private fragments each: one discoverable only by Player 1, one only by Player 2. Find them in any order at distinct locations in their respective parts of the game.
- Fragments look like glowing stars/light points. Each memory has its own matching color.
- Collection displays a discovery overlay suggesting the desk, and puts the fragment in a regular inventory slot.
- The north-wall desk combines fragments. Placed fragments are visible to both players, occupy predetermined positions, and several unfinished fragments can coexist. Select your fragment and click one already on the desk to attempt a match.
- Wrong matches buzz, spark and repel without consuming either fragment. Matching pairs merge, flash and glow steadily.
- Completed memories automatically move to a wall shelf, remain available all game, and are displayed in completion order, never chronological order. The intended shelf is above the desk.
- Players enter independently and always see their own assigned perspective of the same event. Each memory will have a concrete point-and-click puzzle and narrative clues requiring communication. Do not automatically validate the players' interpretation of the story.
- Evidence collection (physical objects or other clues) is planned but not yet specified.
- The ending is Write My Story: reconstruct and write the witch's true story using notes, evidence and possible diary pages to lift the town's curse. Sorting memory cards is no longer the final puzzle.
- Still deliberately open: whether revisits require solving puzzles again, shared versus separate puzzle state, and evidence storage/reuse. Defer until all nine puzzles are designed.

### Memory prototype implementation
`memories.js` and `memories.css` implement the collection/inventory/desk/shelf lifecycle with nine color pairs. The temporary Test: memory fragment locations screen gives each player only their own nine fragments, selectable in any order. These are test locations, not final hiding places. Collection respects the 10-slot inventory limit (including lantern). Fragments are selected directly from inventory, then placed on the north-wall desk; click an existing fragment with another selected to combine. Desk slots are fixed by fragment identity. Mismatches preserve fragments and give a brief buzz/spark reaction. Correct matches flash and move to the existing empty editable north-shelf-5 in completion order. Its location is provisional: the user can move that shelf above the desk with the layout editor.
Completed memories open a clearly labeled empty scene prototype showing only the assigned A/B perspective. A temporary Return to hut (test) control leaves; it establishes no final puzzle/exit rule. Narrative content, actual memory puzzles, hidden world locations, evidence and Write My Story are not implemented.
Memory desk/completion state is saved separately under witches-hut-memories-v1; carried fragments use the existing inventory save. Reset game clears both. Existing player progress/layout is preserved when loading this update.
Validation: test-kettle.cjs passes. test-memories.cjs runs headless Chrome against the local HTML and checks private collection, wrong-match preservation, shared completed shelf, independent A/B entry, reload persistence, reset and browser errors. output/memory-preview.png records the initial visual check.
Each filled lantern now remembers its source empty-bottle ID (players[].lanternBottle) and renders that exact 1_tomflaskaN.png artwork in inventory, with a warm internal glow masked to its silhouette and a soft outer glow. Inspection uses the matching bottle image too. Converted bottles stay absent from their original shelf while serving as lanterns. Existing legacy lanterns without a source ID receive a default bottle variant. Tests assert preservation of each newly filled bottle ID.
Glowing-bottle inspection now reuses the same lantern-art image and masked internal glow as its inventory miniature, preserving the source bottle shape. The illustration still fits its overlay and outside-image clicks close it.
Fire is now a strict prerequisite for every lantern-brew step, including the brew-test shortcut, scooping previously prepared brew and filling a bottle. Loading a saved cold-kettle test state clears unfinished brew/ladle charge and recipe progress. Existing lanterns are preserved. Tests cover cold brewing, cold scooping, cold bottle filling and the test button.

### First real fragment placement — north desk drawer
Memory 1 now has one private fragment per player inside the left north-wall desk drawer. Click the left drawer front to open/close it. The open desk uses the supplied Grafik/0_Skrivbord.oppen.PNG (the available asset is named 0_, rather than 1_). Opening is independent per player and saved with their player progress. The glowing star appears only while that player's drawer is open and their fragment has not already been collected, placed or completed. Taking it uses the existing discovery overlay and inventory capacity checks. Desk hotspot and star positions follow the contained desk artwork and its layout dimensions. Remaining memories keep temporary test locations. Browser checks now collect both Memory 1 fragments from the real drawer, verify independent opening, no duplicate collection, and drawer/inventory persistence through reload; recipe regression checks also pass.

### Automatic merge and editable memory stars
Placing the second matching fragment anywhere on the desk now automatically merges the pair; selecting a fragment and clicking a placed one still supports explicit matching/mismatch feedback. Completed stars have a larger, much brighter steady glow and move to a dedicated editable memory-storage-shelf above the desk, in completion order. The earlier provisional north-shelf-5 target is superseded.
The existing layout editor now includes memory stars: drawer star (open the drawer before editing), each desk fragment, and completed shelf positions. Drawer, desk and shelf use separate stable layout IDs. Completed shelf layouts are keyed by completion slot to preserve completion order. These share the existing save/cancel/reset/export and sizing/rotation controls, and saved star placements apply in both player views. Star button backgrounds, borders and hover fills are transparent in the world, test picker and fragment inventory. The old visible Place fragment panel is now an invisible accessible desk target; the desk itself can still be clicked with a selected fragment.
Validation: browser tests exercise automatic desk merging, moving/saving a shelf star through the actual layout editor, transparent backgrounds, private collection, reload persistence, independent memory entry and reset. Existing kettle checks pass.

## First painting puzzle: private chests and deer-eye key
Chest unlocking is now private per player (players[].chestUnlocked). Both need the same unique trinket-14 key, handed off using Put down and collection at its origin. Player 1 alone finds firewood; Player 2 alone finds Grafik/1_oga.png (deer-eye). Legacy shared chest saves migrate their unlocked state only to Player 1.
Clicking the deer painting opens its image-only overlay. Select Use on the eye, then click the dark socket to insert it. The eye leaves inventory and state.deerEyeOwner identifies the only player entitled to open the hatch. That player's painting changes to Grafik/1_lucka.oppen.png and reveals their own currently empty compartment. Clicking the open door closes it to the painting without removing the eye. Click the inserted eye on the closed painting to take it back, provided inventory has space. Put down on the eye places it on the shared south-wall table (state.eyeOnTable), where either player can inspect and take it. The other player's compartment remains closed until they hold/insert the eye. Contents behind each painting remain unspecified and are not invented.
Eye location/owner and private chest/hatch states persist; Reset restores both locked chests and returns the eye to Player 2's chest. New tests in test-deer.cjs cover private locks/contents, key sharing, wood restriction, eye installation, private access, close/remove, inventory capacity and table transfer. Recipe and memory tests also pass.

2026-10-29: Removed the empty fifth north-wall shelf (north-shelf-5), as marked in the browser. Existing four stocked shelves and their layout IDs remain intact. Deer/chest, kettle and memory regression checks pass.

2026-10-29: Restored the puzzle chest on the west wall alongside the decorative boxes. Each player's chest retains its own key lock; player 1 finds wood and player 2 finds the eye. Added test-chests-ui.cjs to verify actual chest presence, separate unlocking, private contents and persistence in a browser.

2026-10-29: Moved the puzzle chests from west to east wall for both players. Browser regression verifies independent locks and private contents on the east wall.

2026-10-29: Eye layout editor now includes preview shortcuts for chest, deer painting/socket and shared table. Each position saves independently; socket position also sets the gameplay click area. Previews do not unlock or collect puzzle items. Browser tests verify all three modes and saved rotation after reload.

2026-10-30: Added all 25 inredning-* images across the four walls with proportional dimensions and matching shadows. Every furnishing has a stable independent layout ID and supports editor movement, scaling and rotation. Verified all assets load, all walls render, and editor handles appear; chest/deer and memory regressions pass.

2026-10-30: Removed the original bird, fox and deer wall paintings from the east wall at user request. New inredning-* paintings remain.

2026-10-30: Added one small wall shelf each on north and west, using the available 0_vagghylla.liten.PNG artwork. Independent layout IDs support move/resize/rotation; shelves start empty.

2026-10-30: Raised the herb cabinet stacking layer above wall furnishings so its open doors cover decorations against the wall. Editor handles and overlays remain above the cabinet.

2026-10-30: Strengthened warm brown contact and soft cast shadows across room furnishings, furniture, wall fixtures, shelf items, herbs and trinkets. Existing glow effects retain their colors.

## Red jar and north-wall memory box (30 October 2026)
Jar 1 has a fixed south-wall shelf assignment. Clicking it gives each player a small brass key with a flight animation and inventory capacity checks. Select that key in inventory and click ask-1 on the north wall to unlock it, consume the key and switch to 1_ask1.oppen.PNG. Memory fragment 2 rises and hovers above the box until collected. Unlocking and collection persist independently per player. The box keeps its existing editable ask-1 layout; its star uses memory-north-box-star and supports moving, resizing and rotation through the layout editor. Open the box before editing the star. The separate dark-room prototype is unchanged. Browser tests: test-memory-box.cjs and test-memories.cjs pass.

## Raven painting key (30 October 2026)
The north-wall raven-and-skull furnishing (inredning-tavla-01) is interactive and opens an image-only painting overlay. A collectable nyckel-02 sits in the raven's beak. This shared raven-key respects inventory capacity, persists through reload and returns to the painting when Put down is used. Its destination lock is not wired yet. Red-jar north-box keys now use nyckel-01, while the original chest key retains 1_trinket14; all three puzzle key types have distinct artwork. test-raven-key.cjs and test-memory-box.cjs pass.

Red-jar interaction update: first click persistently opens Jar 1 using Grafik/1_burk1.oppen.png. The brass key rises and hovers above it; a separate click on the key transfers it to inventory. The open jar remains after pickup and reload. test-memory-box.cjs verifies both clicks and reload before collection.

2026-10-30: Restored original bird, fox and deer paintings on east wall with original painting-1/2/3 layout IDs and default positions, reusing saved editor placements. Existing eye/socket, private hatch, close/remove and handoff mechanics restored through the original painting click handlers. Deer, chest UI and eye editor tests pass.

## East door and raven key (30 October 2026)
Select the raven-key via inventory Use and click the transparent lock hotspot on the east door. Only that key unlocks the shared door; it is consumed and cannot respawn in the painting. Saved eastDoorOpen switches to Grafik/0_dorr.oppen.png (the supplied open-door asset is named 0_, not 1_). A black SVG backing fills the transparent doorway interior. Reset relocks it. test-east-door.cjs passes correct/wrong key, shared opening, persistence, no respawn and reset checks.

The open east doorway now enters a separate back room using Grafik/0_bakgrund2.jpg. Each player enters independently; their location persists on reload. The room starts empty, without hut furniture or memory controls. Return to hut leads back to the open east door. test-east-door.cjs also verifies entry, background, independent player locations, reload and return.

## Dark-room integration (30 October 2026)
The actual back room behind the raven-key door now owns the lantern search mechanic. Its 0_bakgrund2.jpg background is covered by solid black without a selected glowing bottle. Using the player's brew-filled bottle enables a cursor-following light; leaving the scene hides the light and unreveals the test object. The existing hidden placeholder is collectible only when revealed within the light. Pickup and room location persist independently per player. Returning to the hut deselects the light. The old standalone dark-room test buttons are hidden. test-east-door.cjs exercises the real doorway, darkness without a lantern, inventory Use, reveal, guarded pickup, reload and return.

## Private dark-room hatch puzzle (30 October 2026)
Player 1 sees chalk code 1234 on the dark-room wall. Player 2 instead sees Grafik/1_lucka.stangd.png with four clickable digit wheels aligned over the painted code lock. Each click increments one digit modulo 10; 1234 opens the hatch with 1_lucka.oppen.png. Digit changes require that player's selected glowing bottle. Digits and opened state persist in player progress and reset with the game. The open compartment is empty for now. Browser verification passes private perspectives, code entry and persistence.

## Dark-room rewards and floor key (30 October 2026)
Code 5555 is entered by Player 1; Player 2 uses the supplied handprint background. Solving immediately reveals Memory 3 fragments for both players: Player 1 inside the hatch, Player 2 on the wall. Each is independently collected and saved with the existing memory system. Stars remain beneath the darkness/lantern mask. A shared Diamond key (nyckel-03.png, dark-room-key) sits on the floor. Only one player can hold it; Put down restores its editor-adjusted floor position for either player to take. Layout uses back-room:dark-room-key and the existing trinket move/resize/rotate controls. Browser verification passes rewards, private collection, unique ownership, put down, transfer and reload.

## Private noticeboard comparison puzzle (30 October 2026)
The east noticeboard overlay now has eight separate letter/value notes for Player 1 (A7 B2 C9 D4 E1 F8 G3 H6). Player 2 sees ten separate comparison notes from Spelprat fortsättning; clicking flips each note to its associated five-digit code, and clicking again restores the statement. Flipped notes persist per player. Only row 7 (E < B < D < H) is entirely true and its reverse is 58310. This code opens Ask 2 under the south-wall table. test-noticeboard.cjs validates all data, the unique correct row, private perspectives, flipping and reload; both views visually checked.

## South-wall box and updated code lock (30 October 2026)
The implementation is saved in index.html. Ask 2 is now on the south wall and Ask 3 is on the east wall. World layout IDs remain tied to their wall slots to preserve edited placements. Clicking the south-wall box opens its close-up with 1_ask2.PNG; unlocking switches both the close-up and world view to 1_ask2.oppen.PNG.

The box uses Grafik/1_kodlas2.png, copied from the supplied extensionless PNG 1_kodlas2. Its native dimensions are 1774 x 887 (2:1); preserve its original proportions. All five digit wheels are interactive. Each click advances one digit modulo 10. Correct code: **58310**. The shared opened state and each player's dial settings persist in player progress.

Noticeboard reverse-side codes, in row order: 29470, 81630, 57290, 34810, 92740, 16380, **58310**, 74920, 63150, 48560. These replace the previous four-digit codes. Row 7 remains the only fully true statement. All note faces now use Grafik/anslagstavla-lapp-akvarell.png, with live text and reversible note animation.

The layout editor can move the entire lock, with digits following their parent. Lock placement key: south-box-lock:placement. Individual digit position/size/rotation keys: south-box-lock-v2:digit-0 through digit-4. The v2 keys separate the new five-wheel layout from previously saved positions for the old four-wheel lock. Save layout to retain adjustments.

Browser verification passed: five active digit controls, code 58310 unlocking the box, all noticeboard codes having five digits, and original lock proportions. Earlier checks verified saved lock movement with digits following it.

## Note and fox painting code puzzle (30 October 2026)
The opened south-wall Ask 2 contains Grafik/1_lapp.png (copied from the supplied extensionless PNG 1_lapp). Clicking the note enlarges its drawn code 4683. The fox painting now opens a puzzle overlay with ten transparent hotspots over its painted numbers and a small entered-code display underneath. All four digits are accepted before showing incorrect-code feedback. A subsequent digit starts a fresh attempt; 4683 shows success. Input and success persist independently per player. No reward or hatch behavior has yet been assigned to the fox puzzle. test-fox.cjs passes note reading, all digit controls, deferred feedback, retry, correct code and reload.

## Fox painting memory and cooperative hand hold (30 October 2026)
Solving 4683 grants each player their own Memory 5 fragment in the fox overlay and reveals a large handprint. Holding the handprint opens the other player's unused Ask 4 on the west wall, including its close-up if visible. This works in both directions. Release, pointer cancellation, lost capture, window blur or hidden tab closes it immediately; held state is transient and not saved. While held, the helper text reads exactly: tell your friend to go look. Browser checks pass both directions, release-to-close, reward and helper text.

## Room echo sequence puzzle (30 October 2026)
The south-wall tree painting (`inredning-tavla-03`) opens a preview with “Tell your friend to use your memories”. Both players must face south to start. Player 1 sees room objects flash; Player 2 repeats the order by clicking the same objects in the unchanged room. Each successful round repeats the sequence with one added object, through ten. Wrong input restarts at one; navigation and normal object actions are blocked during play, and Avbryt/Escape exits. Success persists and grants each player a memory fragment (temporarily pair 6). Full inventories defer the reward until a slot is free and the painting is opened again. `echo-puzzle.js` contains the puzzle; `test-echo.cjs` checks same-wall gating, private flashes, the ten rounds, reward persistence, duplicates and reset.

Echo reward update: Winning (including the test button) reveals a private memory-6 fragment star on the south-wall painting in each player's room. No automatic inventory grant. Each player clicks their own star to collect it; a full inventory leaves the star on the painting. Collection uses the existing memory system and persists separately per player.

## LAN playtest – 1 November 2026

User requested a real playtest using two computers on the same network. `lan-server.cjs` runs the existing full game in one authoritative headless Chrome session. `lan-client.html` mirrors only the authorized player's live DOM and forwards input. Shared closures, timers and memory progress remain in one engine. Independent pointer IDs, validated stale-node fallback and DOM reconciliation preserve simultaneous interactions, focus and animations. Random per-player tokens scope input to the player's panel; no public internet hosting is configured. Separate save file: `lan-playtest-save.json`. Launch from `Starta speltest.cmd`; instructions and limitations in `../SPELTEST-TVA-DATORER.md`. Two independent browser-session verification passed navigation, private halves, shared coin completion, reconnect and settings. Physical second-computer connectivity and a complete puzzle playthrough remain unverified. Sound is not streamed; brightness/settings remain shared.

Additional input verification passed: one player's token cannot operate the other player's controls, delayed actions survive a shared redraw, and typed notepad contents synchronize between sessions. Keyboard focus and form submission are forwarded to support text-entry puzzles.

## Spellbook code – 9 November 2026
The chosen code is now `3915`, replacing temporary `1234`. The existing front symbols match back-list indices 3, 9, 1, 5 counted from zero at the top. The herb cabinet still uses `1234`. Existing unlocked saves remain unlocked.

## Cabinet clues and Spellbook controls – 9 November 2026
Herb cabinet code is now `8338`. Each player has a separate noticeboard-paper note behind a different west-wall plant: Player 1 gets the left halves of the four digits; Player 2 gets the right halves. The lock overlay has no clue. Spellbook code remains `3915`, now operated by transparent clickable 0–9 digit buttons, with saved wheel positions and blank-wheel cover art. Previous code/control notes above are historical.
