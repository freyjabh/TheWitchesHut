const {chromium}=require('C:/Users/freyj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const page=await browser.newPage({viewport:{width:1400,height:1500}}),errors=[];page.on('pageerror',e=>(errors.push(e.message),console.error(e.message)));
 await page.goto(require('node:url').pathToFileURL(require('node:path').join(__dirname,'index.html')).href);
 await page.evaluate(()=>{state.players[0].wall=2;drawAll();});
 await page.locator('[data-player="0"] [data-layout-id="inredning-tavla-03"]').click();
 await page.locator('[data-echo="start"]').click();assert.match(await page.locator('[data-player="0"] [data-role="status"]').innerText(),/Both players/);
 await page.evaluate(()=>{state.players[1].wall=2;drawPlayer(1);});
 await page.locator('[data-echo="start"]').click();
 await page.waitForFunction(()=>document.querySelector('.echo-flash'));
 assert.equal(await page.locator('.echo-flash').count(),1);
 assert.equal(await page.locator('.echo-target:not(img)').count(),0);
 assert.equal(await page.locator('[data-player="1"] .echo-flash').count(),0);
 assert.equal(await page.locator('.scene .echo-banner').count(),0);
 assert.equal(await page.locator('[data-player="0"] .echo-banner + .nav').count(),1);
 assert.match(await page.locator('[data-player="0"] .echo-counter').innerText(),/^\d+\/\d+$/);
 await page.locator('[data-player="0"] .echo-banner button').click();
 assert.equal(await page.locator('.echo-banner').count(),0);
 await page.evaluate(()=>{
   const timer=window.setTimeout;window.setTimeout=(fn,ms,...args)=>timer(fn,ms/30,...args);
   window.seen=[];
   new MutationObserver(records=>{for(const r of records)if(r.target.classList.contains('echo-flash'))window.seen.push(r.target.dataset.layoutId);}).observe(document.querySelector('[data-player="0"] [data-role="decor"]'),{attributes:true,subtree:true,attributeFilter:['class']});
 });
 await page.locator('[data-player="0"] [data-layout-id="inredning-tavla-03"]').click();await page.locator('[data-echo="start"]').click();
 await page.waitForFunction(()=>document.querySelector('[data-player="1"] .echo-banner')?.textContent.includes('0/1'));
 await page.evaluate(()=>{const wrong=[...document.querySelectorAll('[data-player="1"] .echo-target')].find(el=>el.dataset.layoutId!==window.seen[0]);wrong.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));});
 await page.waitForTimeout(200);await page.evaluate(()=>window.seen=[]);
 // Restart cleanly after verifying the wrong answer does not advance.
 await page.keyboard.press('Escape');await page.locator('[data-player="0"] [data-layout-id="inredning-tavla-03"]').click();await page.locator('[data-echo="start"]').click();
 for(let round=1;round<=10;round++){
   await page.waitForFunction(n=>{const bar=document.querySelector('[data-player="1"] .echo-banner');return bar?.dataset.phase==='input'&&bar.querySelector('.echo-counter').textContent===`0/${n}`;},round);
   const sequence=await page.evaluate(()=>window.seen.splice(0));assert.equal(sequence.length,round);
   for(const id of sequence)await page.evaluate(id=>document.querySelector(`[data-player="1"] [data-layout-id="${id}"]`).dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true})),id);
 }
 assert.deepEqual(await page.evaluate(()=>state.players.map((p,i)=>p.inventory.includes(`memory-5-${i}`))),[false,false]);
 assert.equal(await page.locator('.echo-memory-star').count(),2);
 assert.equal(await page.locator('[data-role="decor"] > .echo-memory-star').count(),2);
 assert.equal(await page.locator('[data-layout-id="inredning-tavla-03"][role="button"]').count(),0);
 assert.equal(await page.locator('.echo-dialog').count(),0);
 await page.reload();assert.deepEqual(await page.evaluate(()=>state.players.map(p=>p.echoSolved)),[true,true]);
 await page.locator('[data-player="0"] .echo-memory-star').click();
 assert.deepEqual(await page.evaluate(()=>state.players.map((p,i)=>p.inventory.includes(`memory-5-${i}`))),[true,false]);
 assert.equal(await page.locator('[data-player="1"] .echo-memory-star').count(),1);
 await page.locator('[data-player="0"] [data-memory="dismiss"]').click();
 await page.locator('[data-player="1"] .echo-memory-star').click();
 assert.equal(await page.evaluate(()=>state.players[0].inventory.filter(id=>id==='memory-5-0').length),1);
 assert.deepEqual(await page.evaluate(()=>state.players.map((p,i)=>p.inventory.includes(`memory-5-${i}`))),[true,true]);
 await page.locator('#reset-game').click();assert.deepEqual(await page.evaluate(()=>state.players.map(p=>!!p.echoSolved)),[false,false]);
 await page.locator('[data-player="1"] [data-echo="test-complete"]').click();
 assert.deepEqual(await page.evaluate(()=>state.players.map((p,i)=>p.echoSolved&&!p.inventory.includes(`memory-5-${i}`))),[true,true]);
 await page.locator('[data-player="0"] [data-echo="test-complete"]').click();
 assert.equal(await page.evaluate(()=>state.players[0].inventory.filter(id=>id==='memory-5-0').length),0);
 await page.locator('#reset-game').click();
 await page.evaluate(()=>{state.players.forEach(p=>p.wall=2);drawAll();});
 await page.locator('[data-player="0"] [data-layout-id="inredning-tavla-03"]').click();
 await page.locator('[data-player="0"] .scene').screenshot({path:require('node:path').join(__dirname,'../output/echo-puzzle-preview.png')});
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: same-wall gate, private flashes, wrong answer, rounds 1–10, rewards, persistence, no duplicates, reset.');
})().catch(e=>{console.error(e);process.exit(1)});



