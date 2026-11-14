# USB-kontroll 8 november 2026

## Rättat

- Dödskallens öga växlar nu strålen av/på för båda spelarna. Speglarnas lägen och spelarnas roller behålls. Avstängt läge sparas vid omladdning.
- Minne 1 applicerar sparade placeringar varje gång scenen ritas om, även efter att en ört plockats.
- Sparad layout återfanns i originalförhandsvisningens lokala data på port 5174 och i den separata filvyn. Endast spelets tre layout-/hyllinställningar exporterades.
- De fem redigerbara föremålen i minne 1 samt växterna och skålarna i minne 2 (20 föremål) ingår nu i projektets standardlayout och USB-paketet.
- Minnesmyntens sparade gemensamma storlek och en ändrad individuell myntpost har också förts över.
- Byggskriptet använder nu `trusted/playtest-setup.json`, även vid framtida byggen. USB-versionen uppdaterar äldre rumsinställningar utan att nollställa spelframsteg.

## Kontrollens omfattning

Alla 158 sparade layoutposter finns i paketet. 123 återgivna objekt har jämförts mot layouten, inklusive samtliga 25 redigerbara föremål i de två implementerade minnena. Sparfilernas fulla layout jämfördes också exakt med paketets layout.

Återstående poster innehåller bland annat närbilder, lås, bakrummet och minnesmynt som bara visas efter pussellösningar. Dessa är bevarade men samtliga visningslägen har inte kontrollerats visuellt i denna genomgång. Tio gamla individuella örtposter i minne 1 används inte längre: örterna flyttas nu tillsammans med hyllan. Ingen egen ny placering har hittats på för dessa.

Tester: av/på från båda spelarna, bibehållna speglar/roller, omladdning, minnesplacering efter plockning och storleksändring, faktisk sparad layout i båda minnena, layoutuppdatering utan förlorade framsteg samt befintliga ljus-, lärlings- och brygdtester. Lärlingstestet fick köras om efter ett slumpmässigt upprepat frågenamn; någon garanti om fullständig buggfrihet ges inte av layoutkontrollen.

## Användning

Kopiera hela den uppdaterade mappen `SPELET-USB` till USB-stickan. Öppna `SPELET.html` och ladda om en redan öppen flik. Du behöver inte återställa spelet för att få layoutändringarna.

Detaljer: `output/usb-layout-audit.json` och `output/usb-layout-verification.json`.
