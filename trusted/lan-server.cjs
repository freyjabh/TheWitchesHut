// LAN playtest: one authoritative browser runs the existing game for both players.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto');
const {chromium}=require('C:/Users/freyj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=__dirname,port=Number(process.env.HUT_PORT||5175);
const accessFile=path.join(root,'lan-access.json');
const tokens=(()=>{try{const saved=JSON.parse(fs.readFileSync(accessFile,'utf8'));if(Array.isArray(saved)&&saved.length===2&&saved.every(t=>typeof t==='string'&&/^[a-f0-9]{36}$/.test(t))&&saved[0]!==saved[1])return saved;}catch{}const result=[crypto.randomBytes(18).toString('hex'),crypto.randomBytes(18).toString('hex')];fs.writeFileSync(accessFile,JSON.stringify(result));return result;})();
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon'};
let browser,page,ready=false,chain=Promise.resolve(),revision=Date.now(),frames=[],errors=[];
const serial=fn=>{const next=chain.then(fn);chain=next.catch(()=>{});return next;};
function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
async function capture(){
 const data=await page.evaluate(()=>{
  window.lanNodes||=new Map();window.lanIds||=new WeakMap();window.lanCounter||=0;
  const tag=el=>{let id=window.lanIds.get(el);if(!id){id=String(++window.lanCounter);window.lanIds.set(el,id);}el.dataset.lanNode=id;window.lanNodes.set(id,el);};
  window.lanNodes.clear();
  const dialog=document.querySelector('dialog[open]');
  const players=[...document.querySelectorAll('.player')];
  for(const player of players){tag(player);player.querySelectorAll('*').forEach(tag);}
  if(dialog){tag(dialog);dialog.querySelectorAll('*').forEach(tag);}
  const serialize=el=>{const clone=el.cloneNode(true);clone.querySelectorAll('textarea,input,select').forEach(copy=>{const orig=window.lanNodes.get(copy.dataset.lanNode);if(copy.tagName==='TEXTAREA')copy.textContent=orig.value;else copy.setAttribute('value',orig.value);if(orig.checked)copy.setAttribute('checked','');else copy.removeAttribute('checked');});return clone.outerHTML;};
  return {focus:players.map(player=>document.activeElement?.closest('.player')===player?document.activeElement.dataset.lanNode:null),players:players.map(serialize),dialog:dialog?serialize(dialog):'',styles:[...document.querySelectorAll('style,link[rel="stylesheet"]')].map(el=>el.outerHTML).join(''),htmlClass:document.documentElement.className,htmlStyle:document.documentElement.getAttribute('style')||'',bodyClass:document.body.className};
 });
 revision++;frames=[0,1].map(i=>({revision,focus:data.focus[i],html:data.players[i],dialog:data.dialog,styles:data.styles,htmlClass:data.htmlClass,htmlStyle:data.htmlStyle,bodyClass:data.bodyClass}));
}
async function input(i,action){
 return page.evaluate(({i,a})=>{
  let el=window.lanNodes?.get(String(a.id));
  if(!el?.isConnected&&Array.isArray(a.path)&&a.path.length<40){el=a.scope==='dialog'?document.querySelector('dialog[open]'):document.querySelector('.player[data-player="'+i+'"]');for(const index of a.path){if(!Number.isInteger(index)||index<0){el=null;break;}el=el?.children[index];}if(el){const signature=JSON.stringify([el.tagName,[...el.attributes].filter(x=>x.name.startsWith('data-')&&x.name!=='data-lan-node').map(x=>[x.name,x.value]).sort()]);if(signature!==a.signature)el=null;}}
  if(!el?.isConnected)return;
  const panel=el.closest('.player');if(panel?Number(panel.dataset.player)!==i:!el.closest('dialog[open]'))return;
  const r=el.getBoundingClientRect(),x=r.left+Math.max(0,Math.min(1,Number(a.x)||0))*r.width,y=r.top+Math.max(0,Math.min(1,Number(a.y)||0))*r.height;
  const common={bubbles:true,cancelable:true,clientX:x,clientY:y,button:0,buttons:a.buttons?1:0};
  if(a.type==='submit'&&el.matches('form')){el.requestSubmit();return;}
  if(a.type==='click'){el.dispatchEvent(new MouseEvent('click',common));return;}
  if(['pointerdown','pointerup','pointermove','pointerleave','pointercancel'].includes(a.type)){
   const target=window.lanCapture?.[i]&&a.type!=='pointerdown'?window.lanCapture[i]:el;
   target.dispatchEvent(new PointerEvent(a.type,{...common,pointerId:i+1,pointerType:'mouse',isPrimary:true}));
   if(a.type==='pointerdown')el.focus({preventScroll:true});
   return;
  }
  if(a.type==='input'&&el.matches('input,textarea,select')){el.value=String(a.value||'').slice(0,20000);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));return;}
  if(a.type==='keydown'||a.type==='keyup')el.dispatchEvent(new KeyboardEvent(a.type,{bubbles:true,cancelable:true,key:String(a.key||'').slice(0,30),code:String(a.code||'').slice(0,30)}));
 },{i,a:action});
}
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname.startsWith('/lan/')){
   const i=tokens.indexOf(url.searchParams.get('token'));if(i<0){json(res,403,{error:'Ogiltig spelarlänk.'});return;}
   if(!ready){json(res,503,{error:'Spelet startar. Prova strax igen.'});return;}
   if(url.pathname==='/lan/frame'&&req.method==='GET'){json(res,200,frames[i]);return;}
   if(url.pathname==='/lan/input'&&req.method==='POST'){
    let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>40000){json(res,413,{error:'För stor begäran'});return;}}
    const action=JSON.parse(raw);await serial(async()=>{await input(i,action);await capture();});json(res,200,{ok:true});return;
   }
   json(res,404,{});return;
  }
  if(req.method!=='GET'){json(res,405,{});return;}
  let target=path.resolve(root,'.'+decodeURIComponent(url.pathname));if(target===root)target=path.join(root,'lan-client.html');
  if(!target.startsWith(root+path.sep)||!types[path.extname(target).toLowerCase()]){res.writeHead(403);res.end('Forbidden');return;}
  fs.readFile(target,(err,data)=>{if(err){res.writeHead(404);res.end('Not found');return;}res.writeHead(200,{'Content-Type':types[path.extname(target).toLowerCase()],'Cache-Control':'no-store'});res.end(data);});
 }catch(e){console.error(e.message);if(!res.headersSent)json(res,500,{error:'Anslutningsfel. Försök igen.'});else res.end();}
});
(async()=>{
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'0.0.0.0',resolve);});
 browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const context=await browser.newContext({viewport:{width:1400,height:2200}});
 const saveFile=path.join(root,'lan-playtest-save.json');
 let stored={};try{stored=JSON.parse(fs.readFileSync(saveFile,'utf8'));}catch{}
 // Room configuration is independent of game progress and shared by both players.
 const setupPath=path.join(root,'playtest-setup.json');
 if(fs.existsSync(setupPath)){const setup=JSON.parse(fs.readFileSync(setupPath,'utf8'));for(const key of ['witches-hut-layout-v1','witches-hut-shelf-order-v1','witches-hut-empty-bottle-shelves-v1']){if(typeof setup[key]==='string'){JSON.parse(setup[key]);stored[key]=setup[key];}}console.log('Loaded saved room layout and shelf contents.');}
 await context.addInitScript(data=>{for(const [k,v]of Object.entries(data))localStorage.setItem(k,v);},stored);
 page=await context.newPage();page.on('pageerror',e=>{errors.push(e.message);console.error('Game:',e.message);});
 await page.goto(`http://127.0.0.1:${port}/index.html`);
 await page.addStyleTag({content:'.player{width:1100px!important}.test-tools{display:none!important}'});
 // Synthetic pointers retain separate capture targets for the two remote mice.
 await page.evaluate(()=>{window.lanCapture={};Element.prototype.setPointerCapture=function(id){window.lanCapture[id-1]=this;};Element.prototype.hasPointerCapture=function(id){return window.lanCapture[id-1]===this;};Element.prototype.releasePointerCapture=function(id){delete window.lanCapture[id-1];};});
 await capture();ready=true;
 setInterval(()=>{if(ready)serial(capture).catch(e=>console.error(e.message));},150).unref();
 setInterval(()=>serial(async()=>{const data=await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage)));fs.writeFileSync(saveFile+'.tmp',JSON.stringify(data));fs.renameSync(saveFile+'.tmp',saveFile);}).catch(e=>console.error(e.message)),2000).unref();
 const addresses=[...new Set(Object.values(os.networkInterfaces()).flat().filter(x=>x.family==='IPv4'&&!x.internal).map(x=>x.address))];
 console.log('\nTHE WITCHES HUT - SPELTEST PA TVÅ DATORER\nLåt detta fönster vara öppet. Båda datorerna ska vara på samma nätverk.');
 for(const host of ['127.0.0.1',...addresses])for(let i=0;i<2;i++)console.log(`Spelare ${i+1}: http://${host}:${port}/?token=${tokens[i]}&player=${i+1}`);
 console.log('\nFramsteg sparas automatiskt i trusted/lan-playtest-save.json. Stäng med Ctrl+C.');
})().catch(e=>{console.error(e);process.exit(1);});
async function close(){ready=false;try{if(page){const data=await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage)));fs.writeFileSync(path.join(root,'lan-playtest-save.json'),JSON.stringify(data));}}catch{}await browser?.close();server.close();process.exit();}
process.on('SIGINT',close);process.on('SIGTERM',close);

