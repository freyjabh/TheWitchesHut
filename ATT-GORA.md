# Att göra

- [ ] Lägg in fler sidor med ledtrådar i spellboken så att den används mer. Påminn om detta nästa gång användaren frågar vad vi ska göra härnäst. Noterat 2026-11-13.

- [ ] Se över alla små texter i spelet. När man klickar på en kista står det nu att nyckeln finns i den röda burken. Den formuleringen kan inte vara kvar och behöver rättas. Noterat 2026-11-08. Ta med detta när användaren frågar om sådant som tidigare sagts behöver göras.

## Genomspelning 9 november 2026

- [x] Återställ den ursprungliga korpen på dödskallen från chatten ”Skapa akvarellbilder av föremålen” till `inredning-tavla-01.png`, i rummet och overlayen. `1_tavla1.png` är en annan fågeltavla och ska inte användas för korppusslet. Nyckeln är anpassad till korpens näbb.
- [x] Gör månen på norra väggen grövre och skissigare och ta bort ansiktet. Ny bild inkopplad i vanliga spelet och USB-versionen; tidigare bild bevarad.
- [x] Förankra kristallen och timglaset på örtskåpets överkant med justerad synlig bas och små kontaktskuggor, så att de inte ser ut att sväva. Genomfört i båda versionerna, för öppet och stängt skåp.
- [x] Örtskåpets kod är `8338`. Spelarna har varsin lapp bakom olika krukväxter på västra väggen. Lapparna använder anslagstavlans papper och visar varsin vertikal halva av de fyra siffrorna.
- [x] Spellbokens kodlås använder klickbara sifferhjul utan färgade inmatningsfält. Koden är fortsatt `3915`; hjulens lägen sparas.

- [x] Ta bort plats- och lösningstips i statusraden under Left-knappen. Behåll korta besked som ”You need a key”, utan att avslöja var nyckeln finns. Genomfört i vanliga spelet och USB-versionen.
- [x] Göra minnesmynten större på skrivbordet och ge dem fasta platser på en rad både på skrivbordet och hyllan. Genomfört i vanliga spelet och USB-versionen. Mynthalvor har en fast plats per mynt; färdiga minnen fyller hyllans fasta platser i färdigställandeordning.
- [x] Anteckningsblocket ska alltid gå att skriva i, även när en overlay är öppen, exempelvis spellboken. Skrivandet fungerar nu även med spellboken eller en annan speloverlay öppen.
- [x] Göra om koden till spellboken (trollformelboken): `3915`, vald 9 november 2026. Låset och spåkulans ledtråd är uppdaterade i vanliga spelet och USB-versionen. Omslagens symboler stämmer med koden när baksidan räknas från noll.
- [x] Flytta fnösket så att det ligger nere i det öppna örtskåpet. Vid genomspelningen hamnar det på väggen trots den tidigare placeringsfixen.
- [x] Utforma och bygga ett pussel eller en ledtrådskedja för att hitta örtskåpets kod. Ersatt av samarbetspusslet med de två lapparna bakom växterna, kod `8338`. Ingen ledtråd visas i låsets overlay.
- [x] Röda burkens nyckel: gör den större och placera den ovanpå burken när den kommer upp; nu hamnar den fel.
- [x] Röda burken blir mindre när den öppnas. Behåll samma visuella storlek i öppet och stängt läge.
- [x] Örterna i huvudrummets skåp ska inte vara klickbara eller öppna en overlay när skåpet är stängt. De får fortfarande synas genom dörrarna.
- [x] Dela koden till den lilla asken, som avslöjas när ljuset släcks, mellan spelarna: en del var så att de måste samarbeta. Asken öppnas för båda.
- [x] Rätta storlek och proportioner på den öppna luckan bakom hjorttavlan; den blir nu alldeles för liten.
- [x] Förtydliga att ögat kan tas tillbaka från hjorttavlan och läggas ner åt medspelaren, så att även medspelaren kan öppna tavlan.

Genomfört i vanliga spelkoden och byggt till USB-versionen 9 november 2026. Drag-and-drop för inventory finns också; se punkten längre ned. Beslut som återstår finns i [BEHOVER-DINA-BESLUT.md](BEHOVER-DINA-BESLUT.md).

## Tidigare sparade beslut

- [x] Bestäm koden för handavtrycken i mörka rummet: `5465`, vald 9 november 2026.
- [x] Gör om handavtrycksbilden och koppla in kod `5465` i vanliga spelet och USB-versionen. Fyra avtryck med 5, 4, 6 och 5 fingrar från vänster till höger.
- [ ] Återkom till låsdyrkningspusslet: en spelare ser mekaniken och den andra dyrkar låset. Möjlig placering är fängelseflykten, minne 6; placeringen är ännu inte bestämd.
- [x] Återbesök, gemensamma pusselbitar och bevis: beslutat 13 november 2026. Minnespussel löses bara en gång; bitarna är gemensamma och ska användas i ett gemensamt pussel/en form. Inget bevissystem.

## Tidigare arbetslista efter speltest 1 – stäm av vad som återstår

Punkterna nedan beställdes tidigare i arbetsfördelningen från 2 november. Avstämda mot aktuell spelkod 8 november 2026. Användarens egna kryss är bevarade. Ett kryss gäller hela punkten; delvis genomförda uppgifter står fortsatt öppna.

- [ ] Göra alla föremål klickbara med en beskrivande overlay.
- [ ] Ta bort lösningsledtrådar ur objekttexterna. Ingår i textgenomgången överst.
- [ ] Visa myntbelöningen efter minnespusslet i en overlay; om myntet inte tas ska det hovra ovanför tavlan.
  - Avstämt: blinkpusslets mynt visas vid tavlan och fyndrutan visas när det samlas in. Någon belöningsruta före insamlingen finns inte i detta flöde.
- [x] Fixa att den animerade kattavlan inte syns i overlayen.
- [x] Låta speglarna följa muspekaren tydligt när de flyttas.
- [ ] Göra övriga föremål oklickbara medan ljuspusslet pågår. Allmän blockering av bakgrunden vid overlays har rapporterats fixad; kontrollera just ljuspusslets hela förlopp.
- [ ] Låta ljuspusslet och speglarna försvinna automatiskt när pusslet är löst.
  - Avstämt: speglarna ritas fortfarande när `lightSolved` är satt.
- [ ] Visa även ljuspusslets myntbelöning i en overlay.
  - Avstämt: myntet visas vid portalen. Fyndrutan visas först efter insamling.
- [x] Säkerställa att den egna sparade layouten används som grundplacering och behålls vid overlays och teststart.
  - Bekräftat: `trusted/room-layout-defaults.js` laddas före spelet och återställer saknade placeringar utan att skriva över egna sparade ändringar. Layouten återappliceras efter rendering och overlayändringar. En ny webbläsarsession läste in samtliga 158 grundplaceringar vid kontrollen.
- [x] Lägga till drag-and-drop för alla föremål i inventoryt, så att spelaren kan dra dem till de platser och föremål där de ska läggas eller användas. Förtydligat vid genomspelningen 9 november 2026.
- [ ] Ge tydligare återkoppling under lantern brew, exempelvis ett ljus som blir starkare vid framsteg.
  - Avstämt: text visar framstegen, men ljusskenet tänds först när brygden är helt klar.
- [ ] Flytta kittelpusslets statustext upp mellan vänster- och högerknapparna.
- [ ] Fixa osynliga bildmarkörer, exempelvis sleven.
- [ ] Separera spelarnas grattisrutor så att de inte stänger varandras.
- [ ] Ge mynten ett tydligt ljussken och en mjuk puls i storlek.
  - Avstämt: myntbilderna har ett ljussken. En mjuk återkommande storlekspuls saknas.

## Underlag

Sammanställt 8 november 2026 från tillgänglig chatthistorik och sparad projektplanering:

- Chatten ”Fixas erfter speltest 1” och [den sparade arbetsfördelningen](output/ARBETSFÖRDELNING.md).
- Chatterna ”Bygga spel 6”, ”Bygga spel 5”, ”Bygga spel7- minne 1”, ”Bygga spel 8- minne 2”, ”Bygga spel 9- minne 3” och ”Ta bort vita linjer”, för avstämning mot senare ändringar.
- [Minnesplaneringen](trusted/MINNEN_PLANERING.md), inklusive den uttryckligen sparade låsdyrkningsidén och frågorna som ska återtas senare.

Detta är en samlad uppföljningslista, inte en fullständig inventering av all äldre chatthistorik. Vissa längre chattutdrag kunde inte läsas på grund av verktygets storleksgräns. Speltestrapportens egna åtgärdsförslag har inte automatiskt räknats som användarens beställningar.
