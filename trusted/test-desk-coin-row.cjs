const {chromium}=require('../SPELET-USB/runtime/node_modules/playwright');
const assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});try{
 const page=await browser.newPage({viewport:{width:1600,height:1100}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.resolve(process.argv[2]||'trusted/index.html')).href);
 const load=async(desk,completed)=>{await page.evaluate(({desk,completed})=>{localStorage.setItem('witches-hut-memories-v1',JSON.stringify({desk,completed}));sessionStorage.removeItem('witches-hut-memory-visits-v1');},{desk,completed});await page.reload();await page.waitForTimeout(1000);};
 const rects=async(i,kind)=>page.locator(`[data-player="${i}"] .memory-${kind}-star`).evaluateAll(es=>es.map(e=>({id:e.dataset.fragment||e.dataset.number,left:parseFloat(e.style.left),top:parseFloat(e.style.top),width:parseFloat(e.style.width),r:(()=>{const r=e.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height}})()})));
 const row=rs=>{for(let n=1;n<rs.length;n++){assert.ok(Math.abs(rs[n].r.y-rs[0].r.y)<.5);assert.ok(rs[n].r.x>=rs[n-1].r.x+rs[n-1].r.w-.5);}};
 await load(['memory-0-0','memory-4-1','memory-8-0'],[2,1,3]);
 for(const i of [0,1]){const desk=await rects(i,'desk'),shelf=await rects(i,'shelf');row(desk);row(shelf);assert.equal(desk.length,3);assert.equal(shelf.length,3);assert.deepEqual(shelf.map(x=>x.id),['2','1','3']);assert.ok(Math.abs(desk[1].left-400/9)<.01);assert.equal(desk[0].width,10.4);assert.ok(desk[0].r.h>=25,'Larger desktop coin bounds');}
 const before=(await rects(0,'desk')).find(x=>x.id==='memory-4-1');
 await page.screenshot({path:'output/fixed-memory-coin-rows.png',fullPage:true});
 await load(['memory-4-1','memory-8-0'],[2,1,3,0]);const after=(await rects(0,'desk')).find(x=>x.id==='memory-4-1');assert.ok(Math.abs(before.r.x-after.r.x)<.5,'Removing a half must not move another slot');
 await load(Array.from({length:9},(_,n)=>`memory-${n}-0`),[]);row(await rects(0,'desk'));assert.equal((await rects(0,'desk')).length,9);
 await load([],Array.from({length:9},(_,n)=>8-n));for(const i of [0,1]){const shelf=await rects(i,'shelf');row(shelf);assert.equal(shelf.length,9);assert.deepEqual(shelf.map(x=>x.id),['8','7','6','5','4','3','2','1','0']);}
 assert.deepEqual(errors,[]);console.log('PASS: larger desk coins, nine fixed slots without overlap, stable positions after removal/reload, shelf completion order and both views: '+(process.argv[2]||'trusted'));
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
