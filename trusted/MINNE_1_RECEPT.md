# Minne 1 – recept och kombinationer

Förslag 6 november 2026. Underlag för receptbokens två sidor och kommande pusselkod; kombinationsreglerna är ännu inte implementerade.

## Bekräftat innehåll

- Verkliga symtom: gulaktig hud, blåaktiga fingrar, blodhosta och kräkningar. Tidigare förslag om svettningar och mörka fingertoppar ersätts.
- Engelskt växtnamn först, latinskt inom parentes.
- En sektion per symtom, med örtalternativ och förväntad reaktion.
- Extra symtom och växter som falska spår.
- Fel tillsats förstör hela brygden. Örterna återställs för nya försök.

## Föreslagna ingredienser och reaktioner

| Symtom | Örter som finns | Extra ört som saknas | Rätt reaktion |
|---|---|---|---|
| Gulaktig hud | Moonblossom (Noctiluna), Greenvein (Verridra) | Ashbell (Cinerella) | Mjölkvit vätska |
| Blåaktiga fingrar | Bloodmoss (Sanguinor), Starroot (Luminthra) | — | Långsamma bubblor |
| Blodhosta | Skythyme (Caelthym), Shadowleaf (Umbrafol) | Silverlace (Argentella) | Tunn vit ånga |
| Kräkningar | Firepetal (Ignispetra), Deathbloom (Mortelana), Windfern (Aetheris) | — | Klar, gyllene vätska |

Falska symtom: frossa och röda utslag. De är inte symtom på patienten och ska inte behandlas. Ashbell och Silverlace är påhittade växter för boken och finns varken på hyllan eller växttavlan.

## Tre fungerande brygder – endast för byggaren

1. Moonblossom + Bloodmoss + Skythyme + Firepetal (1, 3, 5, 7).
2. Greenvein + Starroot + Shadowleaf + Deathbloom (2, 4, 6, 8).
3. Moonblossom + Starroot + Skythyme + Windfern (1, 4, 5, 9).

Ordningen är fri. Varje brygd behandlar alla fyra symtom med fyra olika örter. Alla nio örter ingår i minst en lösning.

En tillsats godkänns om alla hittills tillsatta örter tillsammans är en delmängd av minst en fungerande brygd. En upprepad ört eller en kombination som inte kan byggas vidare till någon lösning ger svart rök och förstör brygden. Godkänd ört visar reaktionen för sitt symtom enligt tabellen. Pusselbiten delas ut först när en komplett fyrörtsbrygd är färdig.

Exempel: Moonblossom ger mjölkvit vätska. Starroot kan därefter ge långsamma bubblor och Skythyme vit ånga. Då passar Windfern som sista ört; Firepetal förstör brygden. Börjar spelarna i stället med Firepetal behöver de Moonblossom, Bloodmoss och Skythyme.

## Boktext – vänster sida

### On the Treatment of Ailments

Observe the patient before choosing a remedy. Treat only the signs you find.

**Yellowish skin**

Moonblossom (Noctiluna), Greenvein (Verridra), or Ashbell (Cinerella).

A harmonious addition turns the brew milky white.

**Bluish fingers**

Bloodmoss (Sanguinor) or Starroot (Luminthra).

A harmonious addition produces slow bubbles.

**Coughing blood**

Skythyme (Caelthym), Shadowleaf (Umbrafol), or Silverlace (Argentella).

A harmonious addition releases a thin white steam.

## Boktext – höger sida

**Vomiting**

Firepetal (Ignispetra), Deathbloom (Mortelana), or Windfern (Aetheris).

A harmonious addition leaves the liquid clear and golden.

**Chills**

Greenvein (Verridra) or Ashbell (Cinerella).

A harmonious addition produces blue vapour.

**Red skin eruptions**

Bloodmoss (Sanguinor) or Silverlace (Argentella).

A harmonious addition turns the liquid rose-red.

### A Word of Caution

Begin with any symptom. Add one herb for each ailment, never the same herb twice. Watch each reaction before continuing.

An herb may suit the ailment yet quarrel with the brew. Black smoke means all is spoiled: empty the pot and begin anew.

## Återstår

- Visa texten i receptbokens overlay och granska läsbarheten i båda sidorna.
- Implementera kombinationer, reaktioner, återställning och belöning.
- Stäm av att örtbild 1–9 motsvarar tavlans ordning innan namn kopplas till enskilda bilder i spelkoden.

## Implementerat 6 november 2026 – brygden
illness-brew.js implementerar de tre fyrörtskombinationerna i valfri ordning. Örtbilderna 1–9 har kontrollerats visuellt mot tavlans ordning. Välj ört i minnets inventory och klicka på kitteln i rummet eller närbilden. Örterna förbrukas inte. Reaktionerna visas som animerade lager i kittelns närbild. Fel eller upprepad ört ger svart rök och kräver Empty pot innan nytt försök. Fyra kompatibla tillsatser låser upp en gemensam pusselbit som kan samlas i en separat samling vid anteckningspanelen. Framsteg, felstatus och belöning sparas. Bokbilderna 2_receptbok-1.png och 2_receptbok-2.png används i de två bokoverlaysen. Test: test-illness-brew.cjs täcker 72 lösningsordningar samt browserflödet. De äldre punkterna om att kod och boktext återstår är ersatta av detta avsnitt. Slutmålet Tell My Story återstår.
