const {chromium}=require('./SPELET-USB/runtime/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
  for(const target of ['trusted/index.html','SPELET-USB/SPELET.html']){
   const context=await browser.newContext({viewport:{width:1600,height:1100}}),page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(pathToFileURL(path.join(__dirname,target)).href);
   const panel=i=>page.locator(`[data-player="${i}"]`),skull=i=>panel(i).getByRole('button',{name:'Inspect Human Skull',exact:true});
   await skull(1).click();await panel(1).locator('.skull-eye').click();
   assert.equal(await panel(1).locator('.skull-eye').getAttribute('aria-pressed'),'true');
   await panel(1).locator('.item-image-overlay').click({position:{x:5,y:5}});
   await panel(1).locator('[data-mirror="0"]').click();
   const before=await page.evaluate(()=>({steps:state.players.map(p=>p.lightMirrorSteps),starter:state.players[0].lightStarter}));
   await skull(0).click();await panel(0).getByRole('button',{name:'Extinguish the glow in the skull’s eye socket'}).click();
   assert.equal(await page.locator('.light-rays line').count(),0);
   assert.equal(await panel(0).locator('.skull-eye').getAttribute('aria-pressed'),'false');
   await page.reload();assert.equal(await page.locator('.light-rays line').count(),0);
   await skull(0).click();await panel(0).locator('.skull-eye').click();
   assert.ok(await page.locator('.light-rays line').count()>0);
   assert.deepEqual(await page.evaluate(()=>({steps:state.players.map(p=>p.lightMirrorSteps),starter:state.players[0].lightStarter})),before);
   const fixture={
    'memory:illness:player-0:illness-shelf':{left:11,top:12,width:43,height:16,rotation:2},
    'memory:illness:player-0:illness-burning-wood':{left:23,top:68,width:18,height:15,rotation:-4},
    'memory:illness:player-0:illness-kettle':{left:26,top:52,width:25,height:31,rotation:5},
    'memory:illness:player-1:illness-plant-chart':{left:19,top:21,width:22,height:33,rotation:-3},
    'memory:illness:player-1:illness-board-paper':{left:57,top:18,width:13,height:25,rotation:7}
   };
   await page.evaluate(fixture=>{localStorage.setItem('witches-hut-layout-v1',JSON.stringify({...JSON.parse(localStorage.getItem('witches-hut-layout-v1')), ...fixture}));sessionStorage.setItem('witches-hut-memory-visits-v1','[8,8]');},fixture);
   await page.reload();
   const check=async()=>{
    await page.waitForFunction(()=>document.querySelector('.illness-kettle')?.style.left==='26%');
    for(const [key,rect]of Object.entries(fixture)){
     const [, ,player,id]=key.split(':');
     const actual=await panel(Number(player.slice(7))).locator(`[data-layout-id="${id}"]`).evaluate(el=>Object.fromEntries(['left','top','width','height','rotate'].map(k=>[k,el.style[k]])));
     assert.deepEqual(actual,{left:rect.left+'%',top:rect.top+'%',width:rect.width+'%',height:rect.height+'%',rotate:rect.rotation+'deg'});
    }
   };
   await check();
   await panel(0).locator('.illness-herb').first().click();await page.locator('[data-memory="take-memory-herb"]').click();await check();
   await page.setViewportSize({width:1300,height:900});await check();
   await page.reload();await check();
   await page.screenshot({path:path.join(__dirname,'output',target.startsWith('trusted')?'layout-fix-editor.png':'layout-fix-usb.png'),fullPage:true});
   assert.deepEqual(errors,[]);
   console.log('PASS',target,': either player toggles beam; reload preserves off state; relight preserves mirrors and roles; all 5 memory props keep position, size and rotation on entry, pickup, resize and reload.');
   await context.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
