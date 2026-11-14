const {chromium}=require('C:/Users/freyj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
 const page=await browser.newPage({viewport:{width:1400,height:1700}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(require('node:url').pathToFileURL(require('node:path').join(__dirname,'index.html')).href);
 const p=i=>page.locator(`[data-player="${i}"]`),fly=i=>p(i).locator('.morse-fly');
 for(let i=0;i<2;i++)for(let s=0;s<2;s++)await p(i).locator('[data-action="right"]').click();
 await p(0).locator('[data-action="inspect-morse"]').click();assert.equal(await page.locator('.morse-fly').count(),2);
 const before=await fly(0).boundingBox();await page.mouse.move(before.x+15,before.y+15);await page.waitForTimeout(400);
 const after=await fly(0).boundingBox();assert.ok(Math.hypot(after.x-before.x,after.y-before.y)>80);
 await page.mouse.move(0,0);
 await page.locator('[data-layout="toggle"]').click();
 const box=page.locator('.layout-box').filter({hasText:'Fly starting position'});assert.equal(await box.count(),2);
 const b=await box.first().boundingBox();await page.mouse.move(b.x+4,b.y+4);await page.mouse.down();await page.mouse.move(b.x+40,b.y+35,{steps:5});await page.mouse.up();
 await page.locator('[data-layout="save"]').click();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('witches-hut-layout-v1')));
 assert.ok(saved['morse:morse-fly-0']);assert.equal(saved['morse:morse-fly-1'],undefined);
 await page.locator('[data-layout="toggle"]').click();
 await page.reload();await p(0).locator('[data-action="inspect-morse"]').click();
 const actual=await fly(0).evaluate(el=>({left:parseFloat(el.style.left),top:parseFloat(el.style.top)}));assert.ok(Math.abs(actual.left-saved['morse:morse-fly-0'].left)<.001);assert.ok(Math.abs(actual.top-saved['morse:morse-fly-0'].top)<.001);
 await fly(0).click();assert.equal(await p(0).locator('[data-inventory-item="caught-fly"]').count(),1);
 assert.equal(await fly(0).count(),0);assert.equal(await fly(1).count(),1);
 await page.reload();await p(0).locator('[data-action="inspect-morse"]').click();assert.equal(await fly(0).count(),0);assert.equal(await fly(1).count(),1);
 await fly(1).click();assert.equal(await p(1).locator('[data-inventory-item="caught-fly"]').count(),1);
 assert.deepEqual(errors,[]);console.log('PASS: flee, quick catch, separate inventory, persistence, independent editable start positions');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
