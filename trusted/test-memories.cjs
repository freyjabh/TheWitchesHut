const {chromium}=require('C:/Users/freyj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe"});const page=await browser.newPage({viewport:{width:1400,height:1100}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(require('node:url').pathToFileURL(require('node:path').join(__dirname,'index.html')).href);
 const p=i=>page.locator(`[data-player="${i}"]`);
 const click=async(i,sel)=>p(i).locator(sel).click();
 for(let i=0;i<2;i++){
   assert.equal(await p(i).locator('.memory-drawer-star').count(),0);
   await click(i,'[data-memory="drawer"]');
   assert.equal(await p(i).locator('.memory-drawer-star').count(),1);
   assert.equal(await p(i).locator('.desk.memory-drawer-open').count(),1);
   if(i===0)assert.equal(await p(1).locator('.desk.memory-drawer-open').count(),0);
   await click(i,'.memory-drawer-star');await click(i,'[data-memory="dismiss"]');
   assert.equal(await p(i).locator('.memory-drawer-star').count(),0);
   await click(i,'[data-memory="drawer"]');await click(i,'[data-memory="drawer"]');
   assert.equal(await p(i).locator('.memory-drawer-star').count(),0);
 }
 await page.reload();
 assert.equal(await p(0).locator('.desk.memory-drawer-open').count(),1);
 assert.equal(await p(0).locator('.memory-drawer-star').count(),0);
 await page.screenshot({path:'output/drawer-preview.png',fullPage:true});
 await click(0,'[data-memory="place"]');
 await click(1,'[data-memory="test"]');await click(1,'[data-fragment="memory-1-1"][data-memory="collect"]');await click(1,'[data-memory="dismiss"]');await click(1,'[data-memory="test"]');
 await click(1,'[data-memory="combine"]');assert.equal(await p(0).locator('.memory-shelf button').count(),0);
 await click(1,'[data-memory="select"][data-fragment="memory-0-1"]');await click(1,'[data-memory="place"]');
 assert.equal(await p(0).locator('.memory-shelf button').count(),1);assert.equal(await p(1).locator('.memory-shelf button').count(),1);
 await page.locator('[data-layout="toggle"]').click();
 const movable=p(0).locator('.memory-shelf-star');const before=await movable.boundingBox();
 const x=before.x+before.width*.3,y=before.y+before.height*.6;
 await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+35,y-12,{steps:5});await page.mouse.up();
 await page.locator('[data-layout="save"]').click();await page.locator('[data-layout="toggle"]').click();
 const after=await movable.boundingBox();assert.ok(after.x>before.x+25,'Shelf star can be moved in the layout editor');
 const layout=await page.evaluate(()=>JSON.parse(localStorage.getItem('witches-hut-layout-v1')));assert.ok(layout['0:memory-shelf-slot-0']);
 const background=await movable.evaluate(el=>getComputedStyle(el).backgroundColor);assert.equal(background,'rgba(0, 0, 0, 0)');

 await click(0,'[data-memory="enter"]');assert.equal(await p(1).locator('.memory-scene').count(),0);await click(1,'[data-memory="enter"]');
 assert.match(await p(0).locator('.memory-scene').innerText(),/Perspective A/);assert.match(await p(1).locator('.memory-scene').innerText(),/Perspective B/);
 await click(0,'[data-memory="leave"]');await click(1,'[data-memory="leave"]');
 await page.reload();assert.equal(await p(0).locator('.memory-shelf button').count(),1);assert.equal(await p(1).locator('[data-fragment="memory-1-1"][data-memory="select"]').count(),1);
 await page.screenshot({path:'output/memory-preview.png',fullPage:true});assert.deepEqual(errors,[]);
 await page.locator('#reset-game').click();assert.equal(await p(0).locator('.memory-shelf button').count(),0);
 await browser.close();console.log('PASS: private fragment collection, incorrect match preservation, shared completion, independent perspectives, reload persistence, reset and no browser errors.');
})().catch(e=>{console.error(e);process.exit(1)});


