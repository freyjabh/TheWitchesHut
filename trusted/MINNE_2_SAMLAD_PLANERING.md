# Minne 2 – lärling hos den kloka kvinnan

## Testrum byggt – 6 november 2026

### Senaste regler och interaktion

7 november: de 18 genererade lappbilderna är inkopplade i provet. Spelare 1 får rätt latinsk lapp och spelare 2 rätt engelsk lapp enligt aktuell fråga. Ingen fonttext läggs ovanpå bilden. Hela bilden visas med bibehållna proportioner och en diskret skugga. Alternativtexten innehåller växtnamnet för tillgänglighet.

18 handskrivna uppgiftslappar genererade med imagegen från anslagstavla-lapp-akvarell.png: Grafik/3_lapp.<växtnamn med små bokstäver>.png. Nio latinska och nio engelska namn, separat bild per namn, reservoarpenneskrift med små bläckplumpar och transparent utsida. Stavningen följer böckerna (Noctiluna). Prompter och namnlista finns i Grafik/3_lappar-prompter.txt. Bilderna är sparade men ännu inte inkopplade i provet.

- Uppgiftslapparna visar endast växtnamnet i en handskriven font (Ink Free med Segoe Print som reserv). Ingen instruktionstext på lappen.
- En ört som lagts i skålen döljs på bordet. Byter spelaren ört återkommer den förra till sin ursprungliga, eventuellt redigerade placering. Ingen markeringsram vid musval. Tangentbordsfokus behåller en diskret markering.
- Örten i skålen är större. Alla örter har lätt förstärkta färger, kontrast och skuggor för att synas tydligare mot träytan. Verifierat byte av ört, återställd sparad placering och fortsatt visning utan scroll.

- Örterna dras till skålen med mus eller pekskärm. Klick på ett knippe placerar det inte längre i skålen. Släpp utanför skålen ändrar inte valet. Tangentbordsalternativ: Enter/mellanslag på ett knippe och sedan Enter i skålen.
- Vid ett felaktigt inlämnat par stängs provet för båda spelarna och skrivbordsvyn visar ”Keep studying, fool!” Böckerna blir tillgängliga igen. Provet måste öppnas på nytt genom skålen. Båda startar ett nytt försök med nya slumpade frågor och noll framsteg. Detta ersätter tidigare omedelbar omstart inne i provet.
- Att stänga ett pågående prov avbryter också försöket för båda. Återöppning ger nya växtpar. Omladdning mitt i ett öppet försök bevarar däremot frågor och framsteg.
- Växterna har ingen mörk hoverruta. Alla knippen och skålen har skuggor.
- Knippenas och skålens positioner, storlek och rotation kan ändras via Edit layout medan provet är öppet. Layouten sparas per spelare med stabila växt-ID:n. Save layout bevarar placeringarna vid nya frågor och omladdning.
- Provet skalas för att rymmas helt i spelrutan utan intern scrollning. Verifierat vid fönsterstorlekarna 1500×1100, 1280×720 och 800×600, inklusive alla knippen, skålen, lappen och knapparna.

test-apprentice-memory.cjs kontrollerar nu verklig drag-och-släpp, att klick och felaktiga släpp inte lämnar in något, stängning vid fel, återöppning via skålen, nya frågor, sparade redigerbara placeringar, transparent hover, visning utan scroll, boklås, fem rätta par och unik belöning. Befintligt test-illness-brew.cjs passerar också.

Senaste vyupplägg: testrummet har två klickbara objekt. Boken öppnar en separat bokoverlay; skålen öppnar en separat provoverlay. I provet används Grafik/2_skrivbordsyta.png som skrivbordsbakgrund, med alla nio namnlösa örtknippen utlagda på vänster sida, skålen till höger och uppgiftslappen vid bordets bortre kant. Handen till lapparna kommer senare. Böckerna är låsta hos båda medan provet pågår, även om en spelare stänger provvyn och återvänder till rummet. Den låsta bokens miniatyr visar inga växtnamn. Stänga/öppna provvyn behåller frågor, val och framsteg. Återgång till studierna avbryter däremot provet för båda och låser upp böckerna. Bakgrunden med berättelsen är ännu inte införd.

Skålen är nu insatt: Grafik/3_skal.png ersätter den tillfälliga pappersytan hos båda spelarna. Vald växt visas i skålens öppning.

Senaste provregel: ett felaktigt inlämnat par nollställer hela provet och ger fem nya slumpade frågepar direkt. Båda får en ny första fråga, skild från både tidigare första fråga och det underkända paret. Varje spelare får fem olika växter per prov. Frågorna sparas och byts inte vid omladdning. Detta ersätter den tidigare regeln om att behålla rätta par och försöka samma uppgift igen. Verifierat även efter ett redan godkänt par.

Senaste ändring: de lösa växtknippena saknar namn även under studierna. Namnen finns enbart i böckerna och i provets uppgiftskort. Spelarna måste jämföra knippenas utseende med bokbilderna. Tillgänglighetsnamnen på knippena är neutrala och avslöjar inte växtnamn.

Testknappen **Test: minne – Lärlingstiden (testrum)** öppnar ett rum utan målad bakgrund för respektive spelare. Prototypen använder befintligt fragment-ID 2, samma som asken på norra väggen. De två nya växtböckerna, nio separata örtknippen och en befintlig papperslapp används. Skål saknas fortfarande och ersätts av en tydligt markerad pappersyta. Porträtten och berättelsebakgrunden tillkommer med användarens målade bakgrunder.

Studier visar ett språk per spelare och varsin förstoring av boken. Båda startar provet. Böcker och etiketter döljs, varje spelare får en namnuppgift och väljer genom klick den växt som den andra efterfrågar. Valet visas på inlämningsytan. Båda bekräftar utan samtidighetskrav; val kan ändras medan man väntar. Fel återställer bara aktuellt par. Fem rätta par avslutar provet. Pusselbiten kan samlas en gång och sparas gemensamt. Återgång till studier startar om provet för båda. Slutfört prov kan startas om via en testknapp utan att ge en extra pusselbit. Allt sparas i befintlig minnessparning och nollställs med Reset game. Växtordningen skiljer sig mellan spelarna. Ingen drag-och-släpp krävs i denna klickprototyp.

Kod: apprentice-memory.js och apprentice-memory.css, integrerade via index.html och memories.js. Test: test-apprentice-memory.cjs verifierar privata bokvyer, dolda namn, fel/omförsök, återstudier, samtliga fem par, sparning efter omladdning, engångsbelöning och laddad grafik. Befintliga test-memory-box.cjs och test-illness-brew.cjs passerar också. Skärmbilder: output/apprentice-memory-study.png och output/apprentice-memory-books.png.

Sammanställt 6 november 2026 från projektfiler och tillgängliga äldre chattmeddelanden. Detta är återfunnen planering, inte nya scen- eller pusselbeslut.

## Berättelsen

- Efter mammans död går huvudpersonen i lära hos den kloka kvinnan och lär sig läkekonst.
- Hon behöver kunna försörja sina två yngre syskon.
- Lärlingstiden innebär hårt arbete. Den kloka kvinnan är sträng.
- Minnet ska förmedla både att hon lär sig ett yrke och vad lärandet kostar henne i arbete och ansvar.
- Hon studerar läkekonst i detta skede. Berättelsens övergripande beslut är att svart magi börjar först efter sveket, fängelset och flykten.

## Två perspektiv och dagbok

### Nytt bildbeslut – 6 november 2026

I minne 1 finns pappans porträtt på en hylla med ett ljus bredvid. I minne 2 ska mammans porträtt stå bredvid pappans på hyllan. Det nytillkomna porträttet ska signalera att även mamman har dött. Detta är en berättelseledtråd genom jämförelse mellan minnena. Vilken spelares vy som visar hyllan är ännu inte bestämt.

| Del | Spelare 1 | Spelare 2 |
| --- | --- | --- |
| Berättelsebild enligt planen från 30 oktober | Den kloka kvinnan undervisar flickan. Böcker och instruktioner om läkekonst. | Detaljer från lärlingstiden som visar hur sträng den kloka kvinnan är. Exakta detaljer är inte återfunna. |
| Pusselinformation enligt planen från 1 november | Växter med latinska namn. | Växter med engelska namn. |

Dagbokssidans planerade innehåll: hon är utmattad av det hårda arbetet och känner ett stort ansvar för sina yngre syskon. Det är en innehållsbeskrivning, inte en färdigskriven dagbokstext. Dagbokssidor är enligt den gemensamma planen gömda och frivilliga att hitta.

I chatten Planera minnen kronologiskt sammanfattades uppdelningen: ”En ser lärandet, en ser strängheten, och dagbokssidan bär känslan.”

## Pusslet – växtkunskap

### Konkretisering och grafik – 6 november 2026

Användaren accepterade upplägget med inlärning och prov: båda studerar varsin språkversion, beskriver växterna och antecknar kopplingarna. Under provet stängs böckerna och knippenas namn döljs. Varje spelare ser ett efterfrågat namn på sitt språk och väljer växten den andra efterfrågar. Valen läggs i skålar och kontrolleras när båda tryckt Klar, utan samtidighetskrav. Förslaget är fem rätta par, omförsök på samma uppgift vid fel med tidigare rätta kvar, och möjlighet att återgå till studierna med omstart av provet.

Grafikbeslut: återanvänd befintliga lappar och papper. Användaren ritar skålen själv och målar porträtttavlan direkt i bakgrunden. Växtböckerna utgår från Grafik/1_bok.oppen.png och Grafik/1_växttavla.png. Två uppslag genererade med inbyggda imagegen: Grafik/minne2-vaxtbok-latin-v1.png och Grafik/minne2-vaxtbok-engelska-v1.png, med alla nio växter och enbart respektive språk. Växterna ligger i olika ordning. Namnet på tavlan är Ignispetra (äldre textsammanfattningar har även stavningen Ignispetra korrekt i tabellen ovan). Bildtexter och växtkopplingar granskade visuellt. Ingen pusselkod ändrad.

- Två spelare samarbetar och beskriver sina växter och namn.
- De lär sig kopplingarna mellan växternas latinska och engelska namn och matchar sedan växterna med båda namnen.
- Gemensamma regler från 1 november: obligatoriskt samarbete, ingen tidspress, en pusselbit efter färdiglöst minnespussel. Pusselbiten sparas i ett särskilt inventory under anteckningsblocket.
- Minnets ingångsfragment och belöningspusselbiten är olika saker.
- Exakt inlärningsfas, hur matchningen utförs, antal växter, felhantering och segerkontroll är inte specificerade i det återfunna underlaget.

## Befintliga växter – möjligt återbruk, inte beslutat urval för minne 2

Den nyare chatten Bygga spel7- minne 1 och MINNE_1_RECEPT.md visar att följande namn redan finns på växttavlan. Användaren har där klargjort vilket namn som är engelskt respektive latinskt. Detta avgör inte automatiskt vilka som ska användas i minne 2.

| Engelskt namn | Latinskt namn i spelet |
| --- | --- |
| Moonblossom | Noctiluna |
| Greenvein | Verridra |
| Bloodmoss | Sanguinor |
| Starroot | Luminthra |
| Skythyme | Caelthym |
| Shadowleaf | Umbrafol |
| Firepetal | Ignispetra |
| Deathbloom | Mortelana |
| Windfern | Aetheris |

## Fragmentets gömställe

Chatten Sammanfatta spelets pussel anger: röd burk på södra väggen → varsin mässingsnyckel → asken på norra väggen → minne 2/lärlingstiden. GAME_PLAN.md och memories.js bekräftar den byggda kedjan för fragment-ID 2: öppna burken, ta nyckeln, lås upp asken och samla fragmentet. Detta är gömstället i stugan, inte växtpusslet inne i minnet.

## Bildstil

Gemensamma bildbeslut gäller: grov akvarell, svarta konturer och tunna upprepade kladdiga skisslinjer, förenklade former och personer utan ansiktsdrag. Den senare bildbearbetningen i Lista planerade minnen och bilder använder dämpade jord-, gråbruna och gråblå toner, mindre starkt gult samt synliga vita papperskanter och transparent utsida.

Ingen detaljerad målarlista eller uppdelning i bakgrund och separata interaktiva bilder har återfunnits för just minne 2. Uppdelningen gjord för minne 1 ska inte automatiskt räknas som ett beslut här.

## Öppna frågor och versionsskillnader

- I den tidigaste sammanfattningen från 29 oktober hette minne 2 Den kloka kvinnan och omfattade mammans död och början på läkekonsten; Lärlingstiden var då minne 3. De senare planerna från 30 oktober och 1 november kallar minne 2 Lärlingstiden/Lärling hos kloka kvinnan. Äldre numrering ska därför inte blandas ihop med den aktuella.
- Mammans död signaleras enligt det nya beslutet den 6 november av hennes porträtt bredvid pappans på hyllan; vilken spelares vy som visar detta återstår.
- Exakt miljö, möblering, kameravinklar, huvudpersonens ålder och syskonens närvaro i bilderna är inte specificerade.
- Vilka konkreta föremål eller gester som visar stränghet och hårt arbete är inte specificerade.
- De äldre berättelsebilderna och det senare växtpusslet behöver fogas samman i en konkret scenplan.
- Ingen särskild fråga eller exakt bevisledtråd till Write My Story/Tell My Story är fastställd för detta minne i det återfunna underlaget.

## Källor och genomgångens gränser

- MINNEN_PLANERING.md: berättelseplan 30 oktober, pusselplan 1 november och gemensam bildstil.
- GAME_PLAN.md: tidig berättelsebakgrund och fragmentets byggda gömställe.
- MINNE_1_RECEPT.md och chatten Bygga spel7- minne 1: befintliga växtnamn, som separat återbruksunderlag.
- Planera minnen kronologiskt (6ae4def7-f2a4-83eb-a686-26be853ddc7e): lärande, stränghet och dagbok; innehåller även användarens uppgift att tidigare samtalsdelar saknades.
- Minnen- bilder (6ae4e583-e204-83ed-a8d2-2ae2980589eb): samlad berättelsetabell med dagboksinnehåll.
- Planera pussel i minnen (6ae70fa1-857c-83ed-8df7-00e4c8621f7b): växtpusslet och gemensamma regler.
- Bygga spel 2- Minnen (01a1893f-1aa8-7f91-9d91-0f7e4885ca5b): användaren har klistrat in både berättelsetabell och senare pusseltabell; äldre cachad sammanfattning visar den tidigare numreringen.
- Fortsätt spelet (01a18923-1ae8-7480-ac34-fa1c4c6f1fd2), arkiverad: samma äldre berättelsesammanfattning.
- Sammanfatta spelets pussel (01a18e9c-71e3-7f02-bf23-eef6a2104127): fragmentets gömställe och berättelsemål.
- Övriga genomlästa relaterade utdrag: planering minnen, Skriva pusselidé till codexen, Fortsätt escape room spelet, Spelprat fortsättning samt Sammanfatta spelets pussel och idéer. Inga ytterligare konkreta beslut för minne 2 hittades där.

Aktiv och arkiverad chatthistorik har inventerats. Tillgängliga sidmarkörer följdes i Bygga spel7- minne 1 och Sammanfatta spelets pussel. Flera äldre röstchattar lämnar bara slutdelar och saknar sidmarkör trots hänvisningar till tidigare diskussion. Därför är detta allt som kunnat beläggas i de åtkomliga källorna, inte ett påstående om att varje äldre röstyttrande har återhämtats. Chatten Skapa akvarellmålade växtknippen gick inte att läsa på grund av verktygets storleksgräns.
