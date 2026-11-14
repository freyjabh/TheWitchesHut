const {chromium}=require('C:/Users/freyj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
 const page=await browser.newPage({viewport:{width:1500,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const roomSetup=JSON.parse(require('node:fs').readFileSync(require('node:path').join(__dirname,'playtest-setup.json'),'utf8'));
 await page.goto(require('node:url').pathToFileURL(require('node:path').join(__dirname,'index.html')).href);
 const panel=i=>page.locator(`[data-player="${i}"]`),click=(i,a)=>panel(i).locator(`[data-ap="${a}"]`).last().click();
 const latin=['Noctiluna','Verridra','Sanguinor','Luminthra','Caelthym','Umbrafol','Ignispetra','Mortelana','Aetheris'];
 const english=['Moonblossom','Greenvein','Bloodmoss','Starroot','Skythyme','Shadowleaf','Firepetal','Deathbloom','Windfern'];
 const requests=async()=>[await panel(0).locator('.ap-request img').getAttribute('alt'),await panel(1).locator('.ap-request img').getAttribute('alt')];
 const start=async()=>{for(let i=0;i<2;i++)await click(i,'bowl');await click(0,'start');await click(1,'start');};
 // Authored plants overlap at their transparent corners. Drag from an exposed point,
 // as a player does, rather than assuming every bounding-box center is unobstructed.
 const drop=async(i,n)=>{
   const source=panel(i).locator(`[data-plant="${n}"]`);await source.scrollIntoViewIfNeeded();
   const point=await source.evaluate(el=>{const r=el.getBoundingClientRect();for(const y of [.5,.25,.75,.1,.9])for(const x of [.5,.25,.75,.1,.9]){const p={x:r.left+r.width*x,y:r.top+r.height*y};if(el.contains(document.elementFromPoint(p.x,p.y)))return p;}return null;});
   assert.ok(point,`Plant ${n} for player ${i} has an exposed drag target`);
   await page.mouse.move(point.x,point.y);await page.mouse.down();
   const bowl=await panel(i).locator('.ap-bowl').boundingBox();await page.mouse.move(bowl.x+bowl.width/2,bowl.y+bowl.height/2,{steps:8});await page.mouse.up();
 };
 const answer=async()=>{const r=await requests();await drop(0,english.indexOf(r[1]));await drop(1,latin.indexOf(r[0]));await click(0,'confirm');await click(1,'confirm');};
 for(let i=0;i<2;i++)await panel(i).locator('[data-memory="test-enter"][data-number="2"]').click();
 assert.equal(await page.locator('.ap-plant').count(),0);
 await click(0,'book');assert.equal(await panel(1).locator('.ap-book-overlay').count(),0);await click(0,'book');
 await start();assert.equal(await page.locator('.ap-book:disabled').count(),2);
 assert.equal(await page.locator('.ap-plant span').count(),0);
 await panel(0).locator('[data-plant="0"]').click();assert.equal(await panel(0).locator('.ap-bowl-plant').count(),0);
 await panel(0).locator('[data-plant="0"]').dragTo(panel(0).locator('.ap-request'));assert.equal(await panel(0).locator('.ap-bowl-plant').count(),0);
 const before=await requests();for(let i=0;i<2;i++){await drop(i,8);await click(i,'confirm');}
 assert.equal(await page.locator('.ap-exam-overlay').count(),0);assert.equal(await page.locator('.ap-book:disabled').count(),0);
 await click(0,'bowl');
 assert.match(await panel(0).locator('.ap-notice').textContent(),/Keep studying, fool/);
 await click(0,'close-exam');
 await click(0,'book');await click(0,'book');await start();
 const after=await requests();for(let i=0;i<2;i++)assert.notEqual(after[i],before[i]);
 await page.locator('[data-layout="toggle"]').click();
 const plant=panel(0).locator('[data-plant="0"]'),box=panel(0).locator('.layout-box').filter({hasText:'Drag specimen 1 to the bowl'});
 const old=await plant.boundingBox(),r=await box.boundingBox();assert.ok(r,'Plant has an editor handle');
 await page.mouse.move(r.x+r.width*.5,r.y+r.height*.5);await page.mouse.down();await page.mouse.move(r.x+r.width*.5+18,r.y+r.height*.5+6,{steps:4});await page.mouse.up();
 await page.locator('[data-layout="save"]').click();await page.locator('[data-layout="toggle"]').click();
 assert.ok((await plant.boundingBox()).x>old.x+10);
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('witches-hut-layout-v1'))['memory:apprentice:player-0:herb-0']);assert.ok(saved);
 const roomLayout=await page.evaluate(()=>JSON.parse(localStorage.getItem('witches-hut-layout-v1')));
 const originalRoomLayout=JSON.parse(roomSetup['witches-hut-layout-v1']);
 for(const key of ['0:desk','1:chest','2:pot-shelf','3:outside-door'])assert.deepEqual(roomLayout[key],originalRoomLayout[key],`Memory layout editing preserves main room ${key}`);
 await page.reload();assert.ok(Math.abs(await plant.evaluate(e=>parseFloat(e.style.left))-saved.left)<.001);
 // The slip contains only the plant name; swapping plants returns the old one to its saved place.
 assert.equal(await panel(0).locator('.ap-request').textContent(),'');
 for(let i=0;i<2;i++){
   const slip=panel(i).locator('.ap-request img'),name=await slip.getAttribute('alt');
   assert.equal(await slip.getAttribute('src'),`Grafik/3_lapp.${name.toLowerCase()}.png`);
 }
 const loadedSlips=await page.evaluate(async names=>Promise.all(names.map(async name=>{
   const img=new Image();img.src='Grafik/3_lapp.'+name.toLowerCase()+'.png';await img.decode();return img.naturalWidth>0;
 })),[...latin,...english]);assert.ok(loadedSlips.every(Boolean));
 const originalPosition=await plant.evaluate(e=>e.style.left);
 await drop(0,0);assert.equal(await plant.isVisible(),false);
 await drop(0,1);assert.equal(await plant.isVisible(),true);
 assert.equal(await panel(0).locator('[data-plant="1"]').isVisible(),false);
 assert.equal(await plant.evaluate(e=>e.style.left),originalPosition);
 assert.equal(await panel(0).locator('.ap-bowl-plant img').getAttribute('src'),'Grafik/2_ört2.png');
 for(const viewport of [{width:1500,height:1100},{width:1280,height:720},{width:800,height:600}]){
   await page.setViewportSize(viewport);await page.waitForTimeout(100);
   const fit=await panel(0).locator('.ap-exam-overlay').evaluate(e=>{
     const r=e.getBoundingClientRect(),targets=[...e.querySelectorAll('.ap-plant,.ap-tray,.ap-request,[data-ap="confirm"],[data-ap="study"]')];
     return {scroll:e.scrollHeight<=e.clientHeight+1&&e.scrollWidth<=e.clientWidth+1,inside:targets.every(t=>{const b=t.getBoundingClientRect();return b.left>=r.left-2&&b.right<=r.right+2&&b.top>=r.top-2&&b.bottom<=r.bottom+2;})};
   });assert.ok(fit.scroll&&fit.inside,`Puzzle fits ${viewport.width}x${viewport.height}: ${JSON.stringify(fit)}`);
 }
 await page.setViewportSize({width:1500,height:1100});
 await plant.hover();assert.equal(await plant.evaluate(e=>getComputedStyle(e).backgroundColor),'rgba(0, 0, 0, 0)');
 await answer();assert.match(await panel(0).locator('.ap-exam-overlay header').textContent(),/1\/5/);
 const closed=await requests();await click(0,'close-exam');assert.equal(await page.locator('.ap-exam-overlay').count(),0);await start();
 const reopened=await requests();for(let i=0;i<2;i++)assert.notEqual(reopened[i],closed[i]);
 for(let round=0;round<5;round++){
   await answer();
   if(round===1){await page.reload();assert.match(await panel(0).locator('.ap-exam-overlay header').textContent(),/2\/5/);}
 }
 await click(0,'collect');assert.equal(await page.locator('[data-ap="collect"]').count(),0);assert.match(await panel(1).locator('.memory-pieces').textContent(),/Puzzle pieces: 1/);
 await page.reload();assert.equal(await page.locator('[data-ap="collect"]').count(),0);
 await click(0,'restart');await start();await drop(0,0);
 await panel(0).locator('.ap-bowl-art').evaluate(img=>img.decode());await panel(0).locator('.apprentice-scene').screenshot({path:'output/apprentice-bowl.png'});
 assert.deepEqual(errors,[]);console.log('PASS: drag/drop, no click submission, failure dismiss/reopen, new questions, persisted editable positions, no scrolling, book locks, five rounds and unique reward.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
