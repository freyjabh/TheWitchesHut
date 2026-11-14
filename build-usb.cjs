// Builds a separate Windows USB edition; original development files stay intact.
const fs=require('node:fs'),path=require('node:path');
const root=__dirname,src=path.join(root,'trusted'),dest=path.join(root,'SPELET-USB');
const setupKeys=['witches-hut-layout-v1','witches-hut-shelf-order-v1','witches-hut-empty-bottle-shelves-v1'];
// A browser export is the source of truth for a release, including memory rooms.
// Never copy game progress or unrelated browser settings into the package.
const exported=path.resolve(process.argv[2]||path.join(src,'playtest-setup.json'));
const releaseSetupFile=path.join(dest,'playtest-setup.json');
let releaseSetup;
if(exported){
 const supplied=JSON.parse(fs.readFileSync(exported,'utf8'));
 if(!setupKeys.every(k=>typeof supplied[k]==='string'))throw Error('Use Export playtest setup (not Export layout).');
 releaseSetup=Object.fromEntries(setupKeys.map(k=>[k,supplied[k]]));
 for(const k of setupKeys)JSON.parse(releaseSetup[k]);
 const placements=JSON.parse(releaseSetup[setupKeys[0]]);
 if(!placements||Array.isArray(placements)||!Object.keys(placements).length)throw Error('Room layout is empty.');
 for(const [key,rect]of Object.entries(placements)){
  if(!rect||!['width','height'].every(k=>Number.isFinite(rect[k]))||!['left','top'].every(k=>rect[k]===undefined||Number.isFinite(rect[k])))throw Error('Invalid placement: '+key);
 }
}else if(fs.existsSync(releaseSetupFile))releaseSetup=JSON.parse(fs.readFileSync(releaseSetupFile,'utf8'));
fs.mkdirSync(dest,{recursive:true});
for(const name of fs.readdirSync(src)){
  if((/\.(js|css|svg)$/.test(name)&&!name.startsWith('test-'))||name==='lan-client.html')fs.copyFileSync(path.join(src,name),path.join(dest,name));
}
fs.cpSync(path.join(src,'Grafik'),path.join(dest,'Grafik'),{recursive:true});
let html=fs.readFileSync(path.join(src,'index.html'),'utf8');
html=html.replace('Temporary local two player layout. Each side has independent room position; shared puzzle state is shown in both panels.','Explore the hut together. Each player has a separate view; solve the puzzles as a team.');
// Keep the layout renderer, but never attach its editor controls to the document.
html=html.replace("document.querySelector('.players').before(toolbar);",'// USB edition: editor toolbar stays detached.');
html=html.replace('</head>','<style>.test-tools{display:none!important}</style></head>');
// The empty container remains because puzzle renderers expect it to exist.
html=html.replaceAll('<div class="test-tools">','<div class="test-tools" hidden inert>');
if(releaseSetup){
 fs.writeFileSync(releaseSetupFile,JSON.stringify(releaseSetup,null,2));
 const version=require('node:crypto').createHash('sha256').update(JSON.stringify(releaseSetup)).digest('hex');
 fs.writeFileSync(path.join(dest,'release-room-layout.js'),`// Exported editor configuration. Apply updated release layouts without resetting progress.\n(()=>{const setup=${JSON.stringify(releaseSetup)},version=${JSON.stringify(version)};window.hutDefaultRoomLayout=JSON.parse(setup['witches-hut-layout-v1']);try{if(localStorage.getItem('hut-usb-layout-version')!==version){for(const[k,v]of Object.entries(setup))localStorage.setItem(k,v);localStorage.setItem('hut-usb-layout-version',version);}}catch{}})();\n`);
 html=html.replace('<script src="room-layout-defaults.js"></script>','<script src="room-layout-defaults.js"></script><script src="release-room-layout.js"></script>');
 console.log('Bundled exported editor placements:',Object.keys(JSON.parse(releaseSetup[setupKeys[0]])).length);
}
// Prevent development actions, including those added by puzzle modules.
html=html.replace('<script src="room-layout-defaults.js">',`<script>document.addEventListener('click',event=>{if(event.target.closest?.('.test-tools,[data-layout]')){event.preventDefault();event.stopImmediatePropagation();}},true);</script><script src="room-layout-defaults.js">`);
fs.writeFileSync(path.join(dest,'SPELET.html'),html);
let server=fs.readFileSync(path.join(src,'lan-server.cjs'),'utf8');
server=server.replace(/require\('C:[^']+\/playwright'\)/,"require('./runtime/node_modules/playwright')");
server=server.replace("executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'","executablePath:findBrowser()");
server=server.replace("const root=__dirname",`function findBrowser(){
 const candidates=[process.env.HUT_BROWSER,process.env.PROGRAMFILES&&path.join(process.env.PROGRAMFILES,'Google/Chrome/Application/chrome.exe'),process.env['PROGRAMFILES(X86)']&&path.join(process.env['PROGRAMFILES(X86)'],'Microsoft/Edge/Application/msedge.exe'),process.env.PROGRAMFILES&&path.join(process.env.PROGRAMFILES,'Microsoft/Edge/Application/msedge.exe'),process.env.LOCALAPPDATA&&path.join(process.env.LOCALAPPDATA,'Google/Chrome/Application/chrome.exe')];
 const found=candidates.find(p=>p&&fs.existsSync(p));if(!found)throw Error('Installera Chrome eller Edge på värddatorn.');return found;
}
const root=__dirname`);
server=server.replace('/index.html`','/SPELET.html`').replaceAll('trusted/lan-playtest-save.json','lan-playtest-save.json');
// Only exported room configuration is bundled, never the developer's game progress.
fs.writeFileSync(path.join(dest,'lan-server.cjs'),server);
const node=process.execPath,runtime=path.join(dest,'runtime');fs.mkdirSync(path.join(runtime,'node_modules'),{recursive:true});
fs.copyFileSync(node,path.join(runtime,'node.exe'));
for(const name of ['playwright','playwright-core'])fs.cpSync(path.join(path.dirname(node),'..','node_modules',name),path.join(runtime,'node_modules',name),{recursive:true});
fs.writeFileSync(path.join(dest,'Starta två datorer.cmd'),'@echo off\r\ncd /d "%~dp0"\r\n"%~dp0runtime\\node.exe" "%~dp0lan-server.cjs"\r\npause\r\n');
fs.writeFileSync(path.join(dest,'LÄS MIG.txt'),`THE WITCH'S HUT – USB-VERSION

Kopiera HELA mappen SPELET-USB till USB-stickan, inklusive Grafik och runtime.
Du kan kopiera den vidare till en annan Windows-dator. Originaldatorn behövs inte.

EN DATOR: Dubbelklicka SPELET.html i Chrome eller Edge. Båda spelarnas vyer visas.
Ingen installation eller internetanslutning behövs. Framsteg sparas i webbläsaren
på den datorn, inte på USB-stickan. Inställningar > Reset game börjar om.

TVÅ DATORER: Anslut båda till samma privata nätverk. På valfri Windows-värddator
med Chrome eller Edge: dubbelklicka Starta två datorer.cmd. Node och Playwright
följer med. Låt fönstret vara öppet. Spelare 1 och 2 öppnar varsin länk som visas.
På den andra datorn: använd länken med nätverksadressen, inte 127.0.0.1.
Tillåt nätverksåtkomst på privat nätverk om Windows frågar.
Gästnät kan blockera anslutningen mellan datorerna. Värddatorn måste vara vaken.
Nätverksspelet sparas i lan-playtest-save.json bredvid SPELET.html.
Stäng med Ctrl+C före urkoppling av USB-stickan. Ta gärna en säkerhetskopia.
För en helt ny nätverksomgång: stäng servern och byt namn på sparfilen.
Spelarlänkarna är privata; dela dem bara med den som ska spela.

Spelet är ett samarbetsspel. Internetspel mellan olika nätverk ingår inte.
Detta är den nuvarande spelprototypen med redigerings- och testverktygen
avstängda i gränssnittet. Alla minnesscener är ännu inte färdigbyggda.
`);
console.log('USB edition built:',dest);
