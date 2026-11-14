# Spåkulan – ledtrådsstruktur

1 november 2026. Ledtrådsmenyn är nu inkopplad i spelet via `crystal-ball-hints.js`. Replikerna finns i `crystal-ball-hints-data.js`. Ändra även den filen vid framtida replikändringar här. Test: `node trusted/test-crystal-ball.cjs`.

## Tillgänglighet och flöde

Spåkulan räknas som upptäckt när någon plockar upp den på södra bordet. Den blir då permanent tillgänglig hos båda, under anteckningsblocket.

Klick → “Seek a vision” → välj upptäckt pussel → nivå 1 → “Another hint” → nivå 2 → nivå 3. “Back” återgår till ämnena och “Close” stänger.

- Nivå 1: riktning, lätt pik. Nivå 2: koppling. Nivå 3: konkret nästa handling.
- Ingen automatisk hjälp eller tidsstyrd upptrappning.
- Pussel räknas som upptäckta efter en avsiktlig interaktion med föremålet, inte bara för att spelaren ser väggen. Det behöver spåras uttryckligen i kommande kod.
- Pusselupptäckt delas av paret: om en spelare har undersökt ett pussel får båda välja ämnet. Repliken tar däremot hänsyn till den frågande spelarens privata framsteg.
- Spara senast visade nivå per spelare, pussel och delsteg. Ett nytt delsteg börjar på nivå 1. Öppna samma delsteg igen visar senast begärda hjälp; bara “Another hint” höjer nivån.
- Välj nästa olösta delsteg före val av replik. Hoppa aldrig över en förutsättning som ännu saknas.
- Skilj mellan upplåst pussel och hämtad belöning. En ohämtad stjärna ger insamlingshjälp, inte en upprepad pussellösning.
- Privat: lås upp kistan, norra asken, ögat, rävtavlan och mata paddan kontrolleras per spelare. Gemensamt: eld, brygd, dörr och gemensamt öppnade askar.
- Hjälpen kan nämna ett ännu oupptäckt relaterat föremål först på en tydligare nivå efter att spelaren själv har valt det upptäckta pusslet.
- Låskoder hålls i gemensamma datakonstanter i en kommande implementation, så ändrade koder inte gör replikerna felaktiga.
- Inga tips om innehållet i de ännu obygda minnesrummen.

## Repliker och ingångar

Varje rad är ett delsteg. Replikerna är utkast på brittisk engelska; förolämpningarna riktas lekfullt mot spelarnas detektivarbete.

| Ämne / upptäckt genom | Delsteg | Nivå 1 | Nivå 2 | Nivå 3 |
| --- | --- | --- | --- | --- |
| Skrivbordet: undersök lådan | Öppna och samla | “Drawers do occasionally contain things. A revolutionary notion, I appreciate.” | “Try the left-hand drawer of the writing desk.” | “Open the left drawer and take your glowing fragment. Your companion must collect theirs as well.” |
| Röda burken: undersök burken | Ta nyckeln | “A lid is generally an invitation, you incurious turnip.” | “Open the red jar and examine what rises above it.” | “Click the floating brass key after opening the jar.” |
| Norra asken: undersök asken | Lås upp | “A small lock. Somewhere, a small key is feeling thoroughly underappreciated.” | “The red jar has something suitable for this box.” | “Take your brass key from the red jar, select it, and click the north-wall box. Then collect your star.” |
| Kistan: undersök kistan | Nyckel och delning | “Have you considered a key? Do stop me if I am moving too quickly.” | “Search the west wall for an old iron key.” | “Use the iron key on your chest, then put it down for your companion. You each need to open your own chest.” |
| Hjorttavlan: undersök tavlan | Hitta ögat | “The deer appears to be missing something. Stimulating company aside.” | “Your companion’s chest may contain the missing eye.” | “Player 2 should unlock their chest and take the eye. Select Use on it, then click the deer painting’s empty socket.” |
| Hjorttavlan | Överlämna ögat | “You have enjoyed your little revelation. Kindly allow your companion a turn.” | “The eye can be removed once the painting is closed.” | “Take your fragment, close the painting, retrieve the eye, and put it on the south table for your companion.” |
| Eldfatet: undersök eldfatet | Samla och tänd | “An empty fire bowl. Your optimism is doing very little to warm it.” | “You need wood, flint, fire steel and tinder.” | “Wood comes from Player 1’s chest; flint is north, fire steel east, and tinder in the herb cabinet. Use each on the fire bowl.” |
| Örtskåpet: undersök låset | Öppna | “The herbs are behind a lock. They have apparently requested some privacy.” | “This cabinet currently uses a simple four-digit combination.” | “Set the cabinet lock to 1234. Take the herbs you need and the tinder.” |
| Trollformelboken: undersök boken | Öppna receptet | “A book with two sides, and two of you. What an extravagant coincidence.” | “Compare your views of the cover. Player 1 operates the lock.” | “The current book code is 1234. Open it to read your respective recipe lists.” |
| Kitteln: undersök kitteln | Brygg | “Two recipes, two people, and this remarkable absence of coordination.” | “Light the fire, then follow your own lists together, in order.” | “Both select the ingredient for the same recipe step and click the kettle within one second. Repeat for all five pairs; a mistake restarts the recipe.” |
| Kitteln, färdig brygd | Fyll flaskor | “Glowing soup. Lovely. Presumably you intend to carry the entire cauldron?” | “A ladle and an empty bottle would be rather less cumbersome.” | “Carry the ladle and an empty bottle. Use the ladle on the kettle, then click your empty bottle. Pass the ladle to your companion for their portion.” |
| Korptavlan: undersök tavlan | Ta nyckeln | “The raven has acquired something useful. Already a more promising assistant.” | “Look carefully at its beak.” | “Take the key from the raven’s beak and use it on the east door’s lock.” |
| Östra dörren: prova dörren | In i mörkret | “You appear to have discovered darkness. Do alert the scientific societies.” | “Your glowing brew belongs in bottles.” | “Make a bottle lantern each. Enter through the unlocked east door and select Use on your lantern.” |
| Bakrummets lucka: undersök luckan / handavtrycken | Öppna luckan | “Describe what you can see. Your companion’s eyes are inconveniently attached to their own head.” | “Compare the handprint clues with the lock in Player 1’s room.” | “With the lantern selected, Player 1 enters 5555. Both players can then collect their own fragment.” |
| Anslagstavlan: öppna tavlan | Välj sann rad | “One of you has the values, the other the statements. Conversation may yet save this expedition.” | “Find the statement in which every comparison is true.” | “E < B < D < H is the true row. Turn that note over; its code, 58310, opens the box under the south table.” |
| Södra asken, öppnad | Lapp till rävtavlan | “You have opened a box. Do try not to overlook its contents in the excitement.” | “Examine the note, then look at the numbered fox painting.” | “Read 4683 on the note and click those digits on the fox painting. Each player must do this and take their star.” |
| Rävtavlans hand: undersök handen | Håll och samarbeta | “A handprint. Perhaps it requires a hand. I shall pause while that sinks in.” | “Holding it affects something in your companion’s room.” | “Keep the handprint pressed while your companion examines the west-wall box. Releasing it closes the box; swap roles when needed.” |
| Trädtavlan: öppna sekvenspusslet | Upprepa sekvens | “One observes, one listens. An ambitious division of labour for this particular household.” | “Describe the flashing objects in their exact order.” | “Both face south. Player 1 watches; Player 2 clicks the same objects in sequence. Each round adds one object, through ten rounds.” |
| Östra asken: undersök kodlåset | Hitta dold kod | “You remain touchingly convinced that more light is always helpful.” | “Some markings are easier to find when the room is darkened.” | “Set the game brightness to zero and inspect the north wall. Combine 7x0x3 and x3x5x. The code, 73053, opens the east-wall box; collect a fragment each.” |
| Morselyktan: undersök lyktan | Tolka signalen | “The lamp is attempting conversation. Do make an effort to be the more articulate party.” | “One of you sees flashes; the other has the alphabet. Short and long flashes form letters.” | “Describe each repeating letter to the player with the Morse chart. Use the arrows to advance and write down the words: FEED THE FROG SOME FLIES.” |
| Morselyktan, fluga upptäckt | Fånga flugan | “Your dinner guest appears to have escaped the seating arrangements.” | “The fly in the lantern close-up can be caught.” | “Click the fly to catch it. Leave a free inventory slot first.” |
| Paddan: undersök paddan | Mata | “Our little amphibian has considerably better taste in dinner than in company.” | “The lantern’s message describes a meal.” | “Select Use on your caught fly and click the toad in its close-up. Each player feeds it and collects their own star.” |
| Dödskallen: undersök glödande ögat | Starta ljuset | “There is a glimmer behind those eyes. How refreshing.” | “Try the glow in the skull’s eye socket.” | “Click the glowing eye to activate the beam. The player who starts it controls north; the other controls east.” |
| Speglarna, aktiverade | Led strålen | “Light travels in straight lines. Kindly introduce your mirrors to the concept.” | “Finish the north-wall path to the transfer portal before continuing east.” | “The controlling player turns each mirror so the beam reaches the next one. Pass through all five north mirrors, then all five east mirrors to the final portal. Describe what you see to each other.” |
| Ett fragment upphittat | Förena | “Two halves of the same memory. I trust you can see where this is going.” | “The writing desk is a suitable place to compare them.” | “Place both matching fragments on the north-wall desk. They merge and move to the shelf. Each player can enter the completed memory.” |

## Gemensamma hjälprepliker

| Situation | Replik / beteende |
| --- | --- |
| Inget pussel upptäckt | “Do inspect something before requesting my expert opinion. I am a gentleman, not a clairvoyant.” Lägg även till ett alltid tillgängligt allmänt utforskningstips. |
| Allmänt utforskningstips | “Try the drawers, lids and paintings. Furniture has been known to conceal more than poor taste.” |
| Fullt inventory | “Ten possessions and not a spare thought. Put something down; your companion may take it.” |
| Pussel löst, stjärna kvar | “The hard part is over. Kindly collect the glowing reward before applying for a knighthood.” |
| Alla nivåer lästa | “That was the final hint. I shall now supervise your application of it.” Behåll nivå 3 synlig. |
| Alla fragment insamlade | “Every fragment accounted for. A thoroughly respectable result, considering the personnel.” Hänvisa endast till skrivbordet om fragment återstår att förena. |

## Kontroll inför inkoppling

Kontrollera att första klicket ger nivå 1, att hjälp aldrig förbrukar eller flyttar föremål, att privata framsteg inte ger den andra spelaren ett falskt “klart”, och att återställning rensar upptäckter samt ledtrådsnivåer. Spegelpusslets konkreta vinklar ska beräknas från dess aktiva layout om en framtida fullständig lösningshjälp läggs till, inte hårdkodas.
