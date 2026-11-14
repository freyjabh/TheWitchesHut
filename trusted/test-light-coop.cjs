const {chromium}=require('C:/Users/freyj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{for(const starter of [0,1]){
 const page=await browser.newPage({viewport:{width:1400,height:1700}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{if(!localStorage.getItem('fixture')){localStorage.setItem('witches-hut-layout-v1',JSON.stringify({'light:transfer':{left:72,top:35,width:12,height:22},'light:portal':{left:82,top:71,width:14,height:26}}));localStorage.setItem('fixture','yes');}});
 await page.goto(require('node:url').pathToFileURL(require('node:path').join(__dirname,'index.html')).href);
 const p=i=>page.locator(`[data-player="${i}"]`),owner=p(starter),viewer=p(1-starter);
 await owner.getByRole('button',{name:'Inspect Human Skull',exact:true}).click();await owner.locator('.skull-eye').click();await owner.locator('.item-image-overlay').click({position:{x:5,y:5}});
 for(const host of [owner,viewer])assert.equal(await host.locator('.light-mirror').count(),5);
 assert.equal(await owner.locator('.light-mirror span').count(),5);assert.equal(await viewer.locator('.light-mirror span').count(),0);
 assert.equal(await viewer.locator('.light-mirror:disabled').count(),5);
 const before=await owner.locator('[data-mirror="0"] svg g').getAttribute('transform');
 await viewer.locator('[data-mirror="0"]').dispatchEvent('click');assert.equal(await owner.locator('[data-mirror="0"] svg g').getAttribute('transform'),before);
 await owner.locator('[data-mirror="0"]').click();assert.equal(await owner.locator('[data-mirror="0"] svg g').getAttribute('transform'),await viewer.locator('[data-mirror="0"] svg g').getAttribute('transform'));
 const skull=owner.locator('[data-role="decor"] [data-layout-id="trinket-1"]'),b=await skull.boundingBox();
 await page.mouse.move(b.x+b.width*.5,b.y+b.height*.5);await page.mouse.down();await page.mouse.move(b.x+b.width*.5+45,b.y+b.height*.5+25,{steps:5});await page.mouse.up();const after=await skull.boundingBox();assert.ok(Math.abs(after.x-b.x)<1&&Math.abs(after.y-b.y)<1);
 await owner.locator('.item-image-overlay').click({position:{x:5,y:5}}).catch(()=>{});
 await owner.locator('[data-light-test]').click();
 assert.equal(await page.locator('.light-portal-final.is-open').count(),1);assert.equal(await page.locator('.light-memory-star').count(),1);assert.equal(await owner.locator('.light-memory-star').count(),0);
 assert.equal(await p(1-starter).locator('.light-mirror span').count(),5);
 assert.equal(await owner.locator('[data-light-portal="transfer"]').evaluate(el=>parseFloat(el.style.left)),72);
 assert.equal(await p(1-starter).locator('[data-light-portal="final"]').evaluate(el=>parseFloat(el.style.left)),82);
 await owner.locator('[data-action="right"]').click();assert.equal(await page.locator('.light-memory-star').count(),2);assert.equal(await owner.locator('.light-mirror span').count(),0);assert.equal(await owner.locator('.light-mirror:disabled').count(),5);
 await page.reload();assert.equal(await owner.locator('.light-mirror span').count(),0);assert.equal(await p(1-starter).locator('.light-mirror span').count(),5);
 assert.deepEqual(errors,[]);await page.close();
 }console.log('PASS: either starter controls north, partner controls east, shared mirrors, numbers only for mover, fixed skull, custom portals solve, test button, saved roles');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
