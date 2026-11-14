# Speltest på två datorer

Båda datorerna ska vara på samma lokala nätverk. Bara värddatorn behöver projektfilerna, Node och Chrome (finns redan på denna dator).

1. Dubbelklicka `Starta speltest.cmd` i projektmappen på värddatorn. Låt fönstret stå öppet.
2. Startfönstret visar separata länkar för Spelare 1 och Spelare 2. Välj länkarna med nätverksadressen, exempelvis `192.168.0.6`, när du delar till den andra datorn. `127.0.0.1` fungerar bara på värddatorn.
3. Varje spelare öppnar sin egen länk i Chrome eller Edge. Ni ser bara respektive spelares perspektiv och har varsin mus.
4. Framsteg sparas automatiskt i `trusted/lan-playtest-save.json`, separat från den vanliga prototypens webbläsarsparning. Spelarlänkarna behålls mellan omstarter och framstegen återställs från filen.
5. Avsluta servern med Ctrl+C. Om den redan körs behöver den stängas innan startfilen används igen.

Om den andra datorn inte når länken: kontrollera att värddatorn är vaken och att ni använder samma nätverk, utan gästnätets klientisolering. Om Windows visar en fråga om Node.js nätverksåtkomst, tillåt det för ert privata nätverk.

## Hur testläget fungerar

`trusted/lan-server.cjs` kör en gemensam spelmotor i en separat, osynlig Chrome-session. `trusted/lan-client.html` skickar respektive spelares klick, pekarrörelser och textinmatning dit och visar uppdateringar av bara den egna vyn. Tillstånd och pusseltimers finns därför på en plats. Inga separata kopior av sparfiler behöver sammanfogas. Webbläsaren återansluter automatiskt när kontakten kommer tillbaka.

Detta är ett lokalt speltestläge, inte internetvärdskap. Det vanliga lokala tvåspelargränssnittet finns kvar. Inställningsdialogen hör fortfarande till den gemensamma motorn; ljusinställningar gäller båda. Ljud från spelmotorn överförs inte till klienterna. Normal layoutredigering och utvecklartestknappar visas inte i spelarlänkarna.

Verifierat med två separata webbläsarsessioner: privata vyer, oberoende navigering, insamling av varsin mynthalva, gemensam förening till helt mynt, omladdning/återanslutning och inställningar utan klientfel. Verklig anslutning från den andra fysiska datorn behöver provas på ert nätverk. Hela spelets samtliga pussel är inte genomspelade i detta testläge.

Även vanlig tangentbordsinmatning, bibehållet skrivfokus och kodlåsets automatiska fokus/inskickning är verifierade.

Rumsuppställningen laddas från trusted/playtest-setup.json: den aktuella exporterade layouten (122 placeringar) samt hyllornas burkar, flaskor och tomflaskor. Uppställningen exporterades från originalvyn, inte från standardläget. Via Edit layout → Export playtest setup går det att exportera en ny version. trusted/lan-access.json bevarar spelarlänkarna mellan omstarter.

