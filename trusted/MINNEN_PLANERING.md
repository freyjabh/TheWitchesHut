# Häxans minnen – aktuell berättelseplanering

Fördjupning: [Minne 2 – samlad planering och källgenomgång, 6 november 2026](MINNE_2_SAMLAD_PLANERING.md).

Bildbeslut för minne 2, 6 november: mammans porträtt tillkommer bredvid pappans på hyllan med ljuset som syns i minne 1. Förändringen signalerar att även mamman har dött. Spelarvy är ännu inte bestämd.

Samlad den 30 oktober 2026 och uppdaterad med pusselplanering den 1 november 2026. Detta dokument är den aktuella källan för minnenas innehåll, spelarnas perspektiv och dagboksanteckningar. Det ersätter äldre listor i GAME_PLAN.md, där bland annat avrättningen räknades som ett minne.

**Senaste beslut:** Pusselplaneringen nedan gäller för pusslens utformning. Den nya listan har åtta minnen, medan berättelseplanen från 30 oktober har nio. Skillnaderna är uttryckligen öppna och redovisas nedan. Äldre berättelsedetaljer och dagboksidéer bevaras som underlag, inte som en färdig avstämning av den nya listan. Endast planering är beställd; ingen spelkod ska skrivas ännu.

## Beslut 13 november 2026 – pusselsäcken och tolv bitar

- Aktuell pusselplan har åtta minnen. Varje minne ger minst en gemensam belöningsbit.
- Slutpusslet har tolv bitar i en rektangulär form, 3 × 4. Detta ersätter tidigare målet om tio bitar och det tidigare öppna antalet.
- En bit delas ut redan i öppningsscenen för att introducera pusselbitarna och göra spelets mål tydligt. Öppningsscenen är fortsatt separat från de åtta minnena.
- Med öppningsscenens bit inräknad ger de sju minnena utanför fängelset en bit var, och fängelseminnet fyra bitar totalt (en grundbit samt tre extra för delpussel): 1 + 7 + 4 = 12.
- En liten säck bredvid spelrutan samlar de gemensamma bitarna. Klick öppnar en overlay med hittade bitar i oordning, där spelarna lägger pusslet. Slutligt bildmotiv och bitarnas utformning återstår.
- Detta är sparad designplanering; mekaniken för säcken, pusseloverlayen och introduktionsbelöningen är ännu inte implementerad.

## Beslut 13 november 2026 – återbesök och gemensamma pusselbitar

- Minnespussel behöver bara lösas en gång. Återbesök återställer inte lösta pussel.
- Varje löst minnespussel låser upp en pusselbit. Biten och insamlingen är gemensamma för båda spelarna; inga dubbla belöningar.
- Bitarna används i den gemensamma pusseloverlayen via säcken; tolv bitar i 3 × 4 enligt det senare beslutet ovan. Slutligt bildmotiv återstår.
- Det finns inget bevissystem. Äldre planering om insamlade bevis är ersatt. Berättelsedetaljer och egna anteckningar kan fortsatt användas för att förstå historien.

## Pusselplanering – 1 november 2026

## Gemensam bildstil – 2 november 2026

8 november 2026: alla minnesvyer har en diskret animerad dim-/akvarellkant vid uttoningen. Ett separat maskat lager rör sig långsamt; bild, föremål och klickytor förblir stilla. Lagret är transparent i mitten och fångar inga klick. Effekten döljs vid närbilder/pusseloverlays och layoutredigering. Minskad rörelse stänger av animationen. Implementerat i memories.css.

Användarens stilreferens är `Foto 1.jpg` (bifogad i chatten den 2 november). Alla minnesbilder ska följa samma stil, även när miljöer och perspektiv skiljer sig åt.

- Akvarellfärger med synliga, ojämna färgfält och papperskänsla.
- Svarta konturer med skissiga, kladdiga och upprepade streck runt alla linjer.
- Grovhugget och butchigt uttryck. Förenklade former, skevheter och ett rått handtecknat utförande; inte detaljerat, fint eller polerat.
- Personer har inga ansikten: inga ögon, näsor, munnar eller andra ansiktsdrag. Kroppshållning, kläder och placering förmedlar handling och känsla.
- Referensens dämpade jordfärger, ockra, rostbrunt och gråblå toner är visuellt underlag för en sammanhållen palett.

Referensbilden styr tecknings- och målarstilen, inte vilka motiv som ska finnas i scenerna. Sceninnehåll och öppna berättelsefrågor följer planeringen nedan.

### Minne 1 – bild- och interaktionsplan, 2 november 2026

Berättelsedetaljer som måste finnas med i målarlistan: hennes två yngre syskon ska synas, och en bild på pappan ska förmedla att han har varit död sedan länge. Användaren återbekräftade detta den 2 november; exakt placering mellan vyerna och hur pappans död förmedlas visuellt är inte fastställt här. Syskonens antal bekräftas även i GAME_PLAN.md. Porträttdetaljen hittades inte i de äldre chattutdrag som gick att hämta och får inte beskrivas som återfunnen där.

Källgenomgång 2 november: chattarna `planering minnen`, `Planera minnen kronologiskt`, `Minnen- bilder` och `Planera pussel i minnen` har lästs via chattverktyget. Utdragen ger huvudsakligen slutet av samtalen och sammanfattningar; de returnerar ingen äldre sidmarkör trots att tidigare diskussioner omnämns. Därför är detta inte en komplett återhämtning av röstplaneringen. Målarlistan ovan är ofullständig tills berättelseledtrådarna har stämts av. De genererade bilderna är inte godkända av användaren, som nu vill måla själv.

Senaste samtalet preciserar och ändrar den äldre uppdelningen för första minnet:

- Familjens sammansättning är en berättelseledtråd till en av de första frågorna i Write My Story/Tell My Story. Spelarna ska lägga ihop information från båda vyerna.
- Föreslagen fördelning från användaren: den ena bilden visar de två yngre syskonen; den andra visar huvudpersonen själv och bilden på pappan. Mamman finns i sjukbädden i samma rum. Vilket spelarnummer som får respektive familjeledtråd är inte låst.
- Pappans bild ska förmedla att han varit död sedan länge; exakt bildmarkör är ännu inte vald. Hans frånvaro ensam räcker inte som entydig ledtråd.
- Kompositionerna ska göra familjeledtrådarna olika åtkomliga från de två perspektiven. Den tidigare målarlistans förslag att visa huvudpersonen tydligt i båda vyerna är inte ett fast beslut och behöver anpassas till denna fördelning.

- Båda spelarna befinner sig i samma rum, i samma scen och samarbetar i realtid. Bakgrunderna visar rummet från två olika platser, med konsekvent möblering.
- Spelare 1 ser mammans symtom, väljer örter och lägger dem i grytan samt ser grytans faktiska reaktion.
- Spelare 2 kan läsa i boken vilka örter som hör till vilka symtom och vilken reaktion grytan ska ge. Spelarna måste kommunicera informationen.
- Symtom som användaren nämnt: gulblek hy, fradga vid mungiporna, mörka fingertoppar, svettningar samt en hink bredvid sängen som antyder kräkningar. Hur fradgan ska visas utan ansiktsdrag behöver lösas visuellt; ansiktsregeln gäller fortsatt.
- Bakgrunderna ska ha ett tomt örtskåp eller en tom hylla där separata, flyttbara flaskor kan placeras. Interaktiva örter och flaskor får inte målas fast i bakgrunden.
- Grytan planeras som separat grafik med transparent bakgrund och anpassad vinkel för respektive vy. Vätskeyta och reaktioner behöver egna lager så att färg, bubblor, ånga och andra effekter kan ändras utan att bakgrunden byts. Bakgrunden lämnar en avsedd plats för grytan.
- Bokens läsbara pusselinnehåll ska kunna visas separat i närbild; exakta örter, recept, reaktioner och eventuell värmereglering är ännu inte fastställda i den här preciseringen.

Två separata bakgrundsutkast genererade med inbyggda imagegen den 2 november: `output/minne-1/spelare-1-utkast.png` och `output/minne-1/spelare-2-utkast.png`. Tomma hyllor och eldstad för separata pusselobjekt. Andra bilden har boken i förgrunden. Perspektivskillnaden är ännu liten; bilderna är visuella utkast, inte slutligt godkända spelbakgrunder.

### Minne 3 – kärleksmötet och Inges äktenskap, 6 november 2026

- **Ändrat berättelsebeslut:** Inge är redan gift när han har det hemliga kärleksmötet med huvudpersonen. Detta ersätter tidigare uppgifter om att han bara är trolovad eller har en fästmö.
- Scenen utspelar sig i samma hus. Båda spelarna tittar in i ett gemensamt mittenrum, den ena från höger och den andra från vänster. Vilket spelarnummer som står på respektive sida är ännu inte bestämt.
- Varje vy har sin egen berättelsedetalj i förgrunden. Spelare 1 ser det hemliga kärleksmötet mellan huvudpersonen och Inge.
- Spelare 2:s föreslagna förgrund visar Inges hustru med vigselring på fingret samt en tavla av henne och Inge tillsammans. Ringen och parets porträtt ska förmedla äktenskapet. Exakt komposition är ännu inte bestämd.
- Förtydligande från användaren: Finn fem fel-pusslet gäller själva mittenrummet som båda tittar in i. De två vyerna av rummet innehåller fem avvikande detaljer som spelarna måste beskriva för varandra och hitta. Exakta skillnader är ännu inte bestämda. Detta ersätter den tidigare idén om två målningar och den felaktiga tolkningen att pusslet sitter i en tavla.
- Porträttet av Inge och hans hustru är en berättelseledtråd i spelare 2:s vy.
- Berättelseledtråden till Write My Story/Tell My Story är att hon har en hemlig kärleksrelation med Inge samtidigt som han redan är gift.

### Beslut om gömställen – 1 november 2026

- Sista fragmentparet finns i ett samarbetsljuspussel på norra väggen. Klicka på glöden i Human Skulls ögonhåla i närbild för att tända strålen. Fem speglar på norra väggen leder strålen till en överföringsportal, sedan leder fem på östra väggen strålen till slutportalen (`Grafik/1_portal.png`). Båda kan se samma speglar på respektive vägg. Den som först tände dödskallen styr på norra väggen; den andra styr på östra väggen. Endast den som styr ser siffrorna. Dödskallen och strålens start är fasta i spelvyn. Speglarnas lösningsvinklar beräknas och verifieras mot sparade portalplaceringar. Knappen Test: spegelpussel visar löst läge. Lösningen sparas och ger varsin privat minnesdel (prototypens plats 9). Implementerat och testat.
- Asken på östra väggen ska låsas upp med koden som syns när ljusstyrkan i spelets inställningar sänks till noll (aktuell ledtråd: **73053**, fördelat som `7x0x3` och `x3x5x`).
- Asken innehåller nu ett minnesfragment direkt, utan ett mellanliggande pussel. Klickbar närbild och femsiffrigt lås med grafiken `1_kodlas2.png` är implementerade. Öppningen delas och sparas; spelarna tar varsin del. Prototypen använder tillfälligt minnesplats 7, men vilket berättelseminne fragmentet hör till är ännu inte bestämt.
- Gör askarna först. Spara idén om en **lös golvplanka** som ett senare gömställe och ta upp den igen när askarna är klara.

| Minne | Scen | Pussel | Spelare 1 | Spelare 2 | Lösning och belöning |
| --- | --- | --- | --- | --- | --- |
| **1** | Mammans sjukdom | Brygga medicin | Väljer och tillsätter örter. Ser vilka reaktioner grytan ska ha. | Ser grytans faktiska reaktioner och reglerar värmen. | Spelarna experimenterar fram rätt sekvens. Medicinen ges till kloka kvinnan. Pusselbiten dyker upp. |
| **2** | Lärling hos kloka kvinnan | Växtkunskap | Ser växter med latinska namn. | Ser växter med engelska namn. | Spelarna lär sig kopplingarna och matchar sedan växter med båda namnen. |
| **3** | Förälskelsen i Inge | Finn fem fel i mittenrummet | Tittar in i mittenrummet från ena sidan; ser det hemliga kärleksmötet i förgrunden. | Tittar in i samma rum från andra sidan, med fem avvikande detaljer i rummet; föreslagen förgrund visar Inges hustru och äktenskapsledtrådar. | Spelarna beskriver rummet för varandra och identifierar alla fem skillnaderna. |
| **4** | Arbetet i det rika huset | Bokhyllepussel | Ser bokhyllan från sin vinkel. | Ser bokhyllan från motsatt vinkel. | Spelarna klickar på fem matchande böcker samtidigt, en efter en. Fel bok eller fel timing återställer samtliga böcker. |
| **5** | Gripandet på gatan | Kullabyrint | Ser hela banan och styr lutningen nord–syd. | Ser samma bana och styr lutningen öst–väst. | Spelarna samarbetar för att få kulan genom labyrinten. |
| **6** | Fängelsehålan | Stort escape room | Befinner sig i en cell. | Befinner sig i en annan cell. | Inte färdigplanerat. Ska utvecklas senare. |
| **7** | Skogsstugan – mörk magi | Magiskt språk | Har en bok med grammatiska regler för trollformler. | Har en stor samling flyttbara magiska ord. | Spelarna konstruerar korrekta trollformler för fyra olika beställningar. |
| **8** | Sista tillfångatagandet | Sokoban / skjutpussel | Ser hela spelplanen och guidar. | Styr en figur som kan knuffa lådor men inte ser spelplanen. | Spelarna samarbetar för att flytta föremålen rätt och lösa pusslet. |

### Gemensamma regler

| Funktion | Beslut |
| --- | --- |
| Antal spelare | Två. |
| Samarbete | Obligatoriskt i samtliga pussel. |
| Tidspress | Ingen. Bokhyllepusslets samtidiga klick är ett uttryckligt krav; exakt tolerans är inte bestämd. |
| Belöning | En pusselbit per färdiglöst minnespussel. |
| Pusselbitarnas placering | Särskilt inventory under anteckningsblocket. |
| Slutmål | Samla alla tio pusselbitar för att låsa upp **Tell My Story**. |
| Berättelseledtrådar | Separata från minnespusslen. Spelarna måste observera och anteckna viktiga detaljer. |
| Implementation | Endast planering. Ingen kod ska skrivas ännu. |
| Nästa steg | Rita minnesscenerna och därefter planera fängelsehålan. |

Minnesfragmenten som förenas till ingångar på hyllan och pusselbitarna som belönar lösta minnespussel är två skilda saker.

### Avstämning som återstår

- **Åtta minnen och tio pusselbitar:** Den nya tabellen innehåller åtta kronologiska minnen, varav sju har bestämda pussel. Ursprunget för de återstående två pusselbitarna är inte bestämt här. Lägg inte till nya minnen eller belöningar som antagna beslut.
- **Introduktionen:** Avrättningen var tidigare en separat startscen utan pussel. Dess roll i den senaste planen och eventuell koppling till de tio pusselbitarna ska stämmas av; ingen belöning tilldelas den automatiskt.
- **Tidigare nio minnen:** Den gamla planen skiljde på flykten till skogen och början på svart magi. Den nya listan har en punkt, Skogsstugan – mörk magi. Det är inte bestämt här hur den tidigare ankomsten till huset och dess berättelseledtrådar ska fördelas.
- **Ändrad ordning:** Den nya listan placerar förälskelsen som minne 3 och arbetet i det rika huset som minne 4. Den tidigare berättelsetabellen har arbetet före kärleken. Den nya ordningen är sparad exakt som angiven, men kopplingen till de äldre scenerna och dagboksanteckningarna behöver stämmas av.
- **Namn på slutpusslet:** Den senaste benämningen är Tell My Story. Äldre underlag nedan använder Write My Story.
- **Detaljer:** Exakta växter, sekvenser, reaktioner, värmelägen, målningar, böcker, labyrintbanor, språkregler och skjutpusselbanor är inte specificerade i denna plan.

## Tidigare berättelseplan – 30 oktober 2026

Följande underlag bevarar sceninnehåll och dagboksidéer. Antal och numrering ska läsas med avstämningspunkterna ovan.

## Berättelsens ram

Spelet har **nio minnen och en separat introduktionsscen**. Listan nedan är kronologisk för planeringens skull. Spelarna hittar fragmenten i valfri ordning och färdiga minnen står på hyllan i den ordning de färdigställs.

**Det centrala avslöjandet:** Hon var oskyldig när hon greps första gången. Först efter sveket, fängelsevistelsen och flykten började hon med svart magi.

## Introduktion: Avrättningen

Introduktionen är **inte ett av de nio minnena**.

| Spelare 1 ser | Spelare 2 ser | Dagboksanteckning |
| --- | --- | --- |
| Häxan står inför sin avrättning och uttalar förbannelsen över staden. | Exakt samma stillbild som spelare 1. | Ingen. Häxan förklarar själv att förbannelsen bara kan brytas om hennes sanna historia berättas. |

Efter introduktionen börjar spelet i häxans gamla stuga. Spelarna vet ännu inte att stugan tillhörde henne, utan upptäcker det genom minnena.

## De nio minnena

| Minne | Spelare 1 ser | Spelare 2 ser | Dagboksanteckning |
| --- | --- | --- | --- |
| **1. Mammans sjukdom** | Den sjuka mamman i sängen, den kloka kvinnan som hjälper henne och barnen. Ledtrådar om mammans symtom. | Eldstaden, örter, flaskor och receptboken. Information som behövs för att tillverka medicinen. | Inte bestämd ännu. |
| **2. Lärlingstiden** | Den kloka kvinnan som undervisar flickan. Böcker och instruktioner om läkekonst. | Andra detaljer från lärlingstiden som visar hur sträng den kloka kvinnan är. | Flickan är utmattad av det hårda arbetet och känner ett stort ansvar för sina yngre syskon. |
| **3. Arbetet som barnmorska** | Flickan utför sitt arbete skickligt i ett rikt hem. | Den förmögna miljön och en irriterad rik man. Klasskillnaderna blir tydliga. | Trots det hårda arbetet och svårigheterna tycker hon att det är värt det eftersom hon kan försörja sina syskon. |
| **4. Kärleken till Inge** | Ett hemligt romantiskt ögonblick mellan henne och Inge. | Ändrat 6 november: Inges hustru, med vigselring och ett porträtt av paret som föreslagna ledtrådar. Se aktuell bildplan för minne 3 ovan. | Inte bestämd ännu. |
| **5. Det första gripandet** | Fogden griper henne på gatan. Hon är chockad och förstår inte varför. | Inge står nära eller talar med fogden. Det antyder att han har förrått henne. | Inte bestämd ännu. |
| **6. Fängelsehålan och flykten** | En fängelsecell med föremål och ledtrådar som behövs för flykten. | En annan cell mitt emot, med galler emellan. Andra föremål och ledtrådar. | Inte bestämd ännu. |
| **7. Flykten till skogen** | Hon anländer utmattad till ett övergivet hus i skogen, med mycket få tillhörigheter. | Insidan av huset, med föremål som antyder att det tidigare tillhörde den kloka kvinnan. | Hon har tvingats lämna sina syskon och kan inte återvända hem. Hon är ensam och söker skydd. |
| **8. Början på svart magi** | Hon sitter vid ett bord och studerar en bok om förbannelser, med exempelvis dödskallar och mörka symboler. | De gamla läkeböckerna har lagts undan. Det framgår att hon har övergett läkekonsten för att studera svart magi. | Hon är fruktansvärt arg och besviken på människorna som förrått henne. Hon börjar hata dem och känner att hon vill se världen brinna. |
| **9. Det andra gripandet** | Utanför stugan ser spelaren hur fogden brutalt för bort henne. | Inne i stugan syns flaskor, böcker och föremål från svart magi. Hon har blivit avbruten mitt i sitt arbete. | Hon känner sig förföljd och misstänker att någon rör sig i skogen. Hon är rädd att bli upptäckt. |

Dagboksbeskrivningarna anger planerat innehåll och är inte färdigskrivna dagbokstexter.

## Minnesmekaniken – beslut som gäller tillsammans med berättelseplanen

- Varje minne har två fragment: spelare 1 kan bara hitta sin del och spelare 2 sin. Fragmenten är lysande stjärnor eller ljuspunkter med en egen färg för varje minne.
- Fragmenten finns på olika platser i respektive spelares del av spelet. Vissa är direkt åtkomliga, andra ligger i låsta lådor eller bakom pussel. De kan hittas i valfri ordning.
- Ett fynd visar en overlay med uppmaning att prova att lägga fragmentet på skrivbordet och lägger fragmentet i inventory.
- Skrivbordet på norra väggen används för att förena delarna. Placerade fragment syns för båda och har fasta, redigerbara positioner. Flera ofärdiga fragment kan finnas samtidigt.
- När båda matchande delarna läggs på skrivbordet förenas de automatiskt till en mycket starkare lysande stjärna. Det går också att välja ett fragment och klicka på ett som redan ligger där. Fel par ger ett elektriskt bzz, gnistor och bortstötning.
- Färdiga minnen flyttas automatiskt till hyllan ovanför skrivbordet och står i färdigställandeordning, inte kronologisk ordning. De finns kvar resten av spelet.
- Varje färdigt minne leder till ett eget point-and-click-rum med egen bakgrund och layout. Spelarna ser samma händelse ur varsitt tilldelat perspektiv och kan gå in oberoende av varandra.
- Minnena ska innehålla både konkreta samarbetspussel och information som hjälper spelarna att förstå berättelsen. Spelet bekräftar inte automatiskt om deras tolkning är rätt.
- Första minnets fragment finns i skrivbordets vänstra låda på norra väggen, en egen del för varje spelare. Övriga exakta gömställen är ännu inte bestämda i denna planering.

## Dagbokssidor och bevis

Dagbokssidorna är gömda och frivilliga att hitta. Innehållet är inte bestämt för alla minnen; se tabellen.

Ett separat bevissystem är påbörjat i planeringen. Bevis kan vara fysiska föremål eller andra ledtrådar som sparas och undersöks senare. Exakt lagring och eventuell användning i andra pussel är inte bestämd.

## Slutpusslet: Write My Story

Spelarna använder informationen från minnena, sina anteckningar och insamlade bevis, inklusive eventuella dagbokssidor, för att återskapa och skriva hennes sanna historia. När de lyckas bryts förbannelsen över staden. Att enbart sortera minnen kronologiskt är en ersatt idé.

## Pusselidé att återkomma till – låsdyrkning, 6 november 2026

- Användarens idé: en spelare ser låsmekaniken och den andra ska dyrka låset. Spelarna behöver kommunicera för att lyckas.
- Möjlig placering: fängelseflykten (minne 6). Detta är ett förslag, inte en låst placering.
- Ta upp idén nästa gång användaren frågar om minnespussel eller planeringen av fängelseflykten.
- Exakt mekanik, kontroller och lösning är ännu inte bestämda.

## Medvetet öppna frågor

- **Konkreta pussel:** Bilderna och informationen är planerade; de konkreta pusslen ska utvecklas senare. För minne 1 finns idén att kommunicera om symptom, örter och recept, men inga slutliga symptom, ingredienser eller lösningssteg är bestämda här.
- **Återbesök:** Beslutat 13 november: endast första gången.
- **Pusseltillstånd:** Beslutat 13 november: löst status och belöningsbitar är gemensamma.
- **Bevis:** Beslutat 13 november: inget bevissystem.
- **Dagbok:** Vad står på de återstående sidorna och var göms de?

Frågorna om återbesök, gemensamt pusseltillstånd och bevis återtas efter att pusslen i alla nio minnena har utformats. Prototypens tillfälliga kontroller avgör inte de frågorna.

## Hur dokumentet ska användas

Läs detta dokument inför arbete med minnen, berättelse, introduktion, dagbok eller slutpussel. Bevara uppdelningen mellan beslut och öppna frågor. Bilder som genererats som inspiration är visuella förslag, inte nya berättelsebeslut. Dokumentet beskriver planeringen och innebär inte att allt redan är implementerat; aktuell kod och GAME_PLAN.md beskriver byggläget.
## Minnesmynt – 1 november 2026

Minnesfragmenten visas nu som skissiga, fläckiga kopparmynt efter användarens tecknade förlaga. Nio motiv: sol, måne, kvicksilver, svavel, salt, jord, eld, vatten och luft. Varje mynt har en ingraverad symbol och delas längs samma taggiga brottyta: spelare 1 får vänsterhalvan, spelare 2 högerhalvan. Rätt par på skrivbordet blir ett helt mynt på minneshyllan. Ändringen gäller grafiken och hjälptexter; minnesantal, berättelse och belöningspusselbitar är fortsatt separata planeringsfrågor.

Grafik: `Grafik/memory-coins/` (atlas samt nio hela mynt och arton halvor). Befintliga minnes-ID:n, sparningar och layout-ID:n behålls.

## Implementerat 4 november 2026
Användaren har beställt första minnet och valt spegelpusslet med dödskallen som gömställe. Luftmyntet (befintligt ID 8) leder nu till mammans sjukdom; ID-numret är inte kronologisk ordning. Bakgrunder: Grafik/2_player1.png och Grafik/2_player2.png, en per spelare. Hyllan behåller färdigställandeordningen. illness-memory.js innehåller en första spelbar medicinprototyp med tillfälligt recept (ringblomma, salvia, älgört), gemensamt sparat tillstånd och registrerad pusselbitsbelöning. Receptet är ett implementationsförslag, inte ett tidigare berättelsebeslut. Särskilt pusselbitsinventory och Tell My Story är ännu inte implementerade. Test: output/test-first-memory.cjs.

## Säckbild inkopplad – 13 november 2026

`Grafik/0_säck.PNG` visas från start för båda spelarna, under anteckningsblocket och kristallkulan. Säcken ska senare erhållas i öppningsscenen. Befintliga gemensamma pusselbitar visas vid säcken; pusseloverlayen återstår.

## Spelbart bildpussel – 13 november 2026

`0_pussel.jpg` delas visuellt i tolv pusselbitar (fyra kolumner, tre rader) med matchande kanter. Säcken öppnar pusseloverlayen. Test: get all puzzle pieces ger samtliga bitar utan att lösa minnena. Drag till rätt plats snäpper fast; alternativt välj bit och klicka på dess plats. Båda spelarna delar placeringar och sparning. Scatter collected pieces återställer placeringarna. End test tar bort testbitar men behåller riktiga insamlade bitar. De två befintliga minnesbelöningarna är kopplade till två av bildens bitar. Öppningsscenens och framtida minnesbelöningars utdelning återstår när scenerna byggs. Bildpusslet öppnar ännu inte Tell My Story.

## Pusslet blir ett brev – 13 november 2026

När sista biten läggs snurrar den färdiga bilden ihop och krymper in mot mitten, följt av ett ljussken och ett vikt pergamentbrev utan text. Tillfällig vektorbild används tills användarens brevbild finns. Gemensam brevstatus sparas direkt; vid återbesök eller omladdning visas brevet utan att pusslet måste läggas igen. Minskad rörelse hoppar över snurren. Testlägets Scatter/Test: assemble again gör effekten möjlig att prova igen, och End test tar bort testbelöningen.

## Tell My Story – första spelbara provvyn, 13 november 2026

Test: endgame öppnar ett pergament med tre korta stycken och sex luckor. Ord/fraser dras från en gemensam ordbank; klicka ord och sedan lucka fungerar också. Klicka en fylld lucka för att återföra ordet, eller dra det till en annan lucka. Två felalternativ ingår. Båda spelarna delar val och sparning. Read our story kontrollerar hela texten utan att markera enskilda rätta svar. Brevet efter bildpusslet öppnar samma vy. Texten är ett första layout- och mekanikutkast, inte slutligt godkänd berättelsetext. Ingen slutsekvens eller upplåsning av ytterdörren är kopplad ännu.

## Minne 3 – tavlan implementerad, 13 november 2026

På användarens beställning ligger nu endast skogstavlan i minne 3; scenbilderna saknas ännu. Tavlan har varsin bild för spelarna och fem föremålsbyten på motsvarande platser: uggla/ekorre, snigel/skalbagge, groda/mus, övre nattfjäril/trollslända och näckrosblomma/eklöv. Detta är den nu beställda pusselversionen, som ersätter den tidigare planeringen att skillnaderna måste sitta i själva mittenrummet.

Båda väljer samma plats för att bekräfta en skillnad, utan tidsgräns. Dessutom finns 17 klickbara oförändrade föremål som ger möjlighet till felval. Fel par återställer bara det aktuella valet, inte redan hittade skillnader. Gemensamma framsteg sparas och återbesök behåller lösningen. Alla fem ger en gemensam pusselbit, endast en gång.

Kod: forest-memory.js och forest-memory.css. Befintlig intern minnesplats 3 (svavelmyntet bakom hjorttavlan) används; intern numrering är inte kronologisk ordning. Direkt ingång i utvecklingsversionen: Test: minne – Kärleksmötet – tavlan. Inkopplat i vanliga spelet och USB-versionen. Testat med output/test-forest-memory.cjs.

## Dagbokssidor och insamlade ord – beslut 13 november 2026

- Dagbokssidor i minnena innehåller ord eller korta fraser som spelarna kan lyfta ur texten och dra till en ordsamling. Detta ersätter idén om separata lösa ordlappar i scenerna.
- Ordsamlingen placeras under anteckningsblocket och delas mellan spelarna. Ett kuvert är den föreslagna visuella behållaren; exakt grafik återstår. Klick på behållaren visar sparade ord.
- Insamlade ord lämnar ett svagt bläckavtryck på dagbokssidan så att texten förblir läsbar. Varje ord kan samlas in en gång.
- Slutbrevets ordbank använder de insamlade orden. Dagbokstexten ger sammanhanget; spelarna behöver själva välja vilka ord som passar i luckorna.
- Äldre planering om helt frivilliga dagbokssidor behöver anpassas: sidor med nödvändiga ord krävs för att lösa slutpusslet och ska gå att återbesöka och samla från även efter att minnespusslet är löst.
- Detta är godkänd designplanering. Ordinsamling, behållare, slutliga dagbokstexter och kopplingen till slutbrevets ordbank är ännu inte implementerade. Provversionen har fortfarande sin förfyllda ordbank.

## Kuvertbild inkopplad – 13 november 2026

`Grafik/0_kuvert.PNG` visas från start för båda spelarna under anteckningsblocket och kristallkulan, ovanför pusselsäcken. Bilden är behållaren för den planerade gemensamma ordsamlingen; insamling och ordvy är ännu inte inkopplade. Dagbokssidorna ska använda `Grafik/morse-paper-blank.png`; den befintliga sidan på tavlan i minne 1 återanvänds som första dagbokssida.

## Två klickbara dagboksexempel – 13 november 2026

Test: diary page öppnar olika exempelanteckningar för spelarna på det blanka morsepapperet. Spelare 1 kan samla Mother och two younger siblings; spelare 2 home och healing. Orden sparas gemensamt i kuvertet, som nu öppnar ordsamlingen. Insamlade ord lämnar läsbara svaga bläckavtryck. Papperet på tavlan i minne 1 öppnar spelare 2:s anteckning; spelare 1:s exempel nås tills vidare via testknappen i väntan på placering i scenen. Texterna är utkast. Slutpusslets provordbank är fortfarande förfylld och har ännu inte begränsats till insamlade ord.

## Fasta inventoryplatser för säck och kuvert – 13 november 2026

Säcken och ordkuvertet flyttas från anteckningspanelen till två egna permanenta knappar bredvid trollformelboken. De tar inte någon av de tio vanliga föremålsplatserna och är tillgängliga även inne i minnena. Kristallkulan ligger kvar under anteckningsblocket. Befintliga samlingar, pusselplaceringar och ordsparning behålls.

## Utökade dagboksexempel och fasta samlingsplatser – 13 november 2026

De två exempelanteckningarna har mer text och sex samlingsbara ord/fraser var (tolv totalt). Flera är avledande ord som inte behövs i nuvarande slutbrev. Alla sparas i samma gemensamma kuvert; äldre insamlade ord bevaras. Säcken och kuvertet ligger nu i permanenta inventoryplatser bredvid boken och deras overlays fungerar också i minnena.
