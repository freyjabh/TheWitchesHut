const {chromium}=require('C:/Users/freyj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
 const page=await browser.newPage({viewport:{width:1400,height:1700}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(require('node:url').pathToFileURL(require('node:path').join(__dirname,'index.html')).href);
 const p=i=>page.locator(`[data-player="${i}"]`);
 assert.equal(await page.locator('.light-mirror').count(),0);assert.equal(await page.locator('.light-portal').count(),0);
 assert.equal(await page.locator('.light-rays line').count(),0);
 await p(0).getByRole('button',{name:'Inspect Human Skull',exact:true}).click();
 assert.equal(await p(0).locator('[data-inspect-action="take"]').count(),0);
 await p(0).getByRole('button',{name:'Light the glow in the skull’s eye socket'}).click();
 await p(0).locator('.item-image-overlay').click({position:{x:5,y:5}});
 assert.ok(await page.locator('.light-rays line').count()>0);
 await p(1).locator('[data-action="right"]').click();
 const initial=[2,5,1,6,3,7,2,4,6,1];
 for(let n=0;n<10;n++){
  assert.equal(await page.locator('.light-memory-star').count(),0);
  for(let step=0;step<(8-initial[n])%8;step++)await page.locator(`[data-mirror="${n}"]`).click();
 }
 assert.equal(await page.locator('.light-mirror.is-hit').count(),10);
 assert.equal(await page.locator('.light-portal-final.is-open').count(),1);
 assert.equal(await p(0).locator('.light-memory-star').count(),0);
 await p(0).locator('[data-action="right"]').click();
 assert.equal(await page.locator('.light-memory-star').count(),2);
 await page.screenshot({path:require('node:path').join(__dirname,'../output/light-puzzle-preview.png'),fullPage:true});
 await p(0).locator('.light-memory-star').click();assert.equal(await p(0).locator('[data-inventory-item="memory-8-0"]').count(),1);
 await p(0).locator('.memory-modal button').click();
 await page.reload();assert.equal(await p(0).locator('.light-memory-star').count(),0);assert.equal(await p(1).locator('.light-memory-star').count(),1);
 await p(1).locator('.light-memory-star').click();assert.equal(await p(1).locator('[data-inventory-item="memory-8-1"]').count(),1);
 await p(1).locator('.memory-modal button').click();
 await p(0).locator('[data-action="right"]').click();assert.equal(await p(0).locator('.light-board').count(),0);
 await page.locator('#reset-game').click();
 assert.equal(await page.locator('.light-memory-star').count(),0);assert.equal(await page.locator('.light-rays line').count(),0);
 assert.deepEqual(errors,[]);console.log('PASS: skull ignition, 10 mirrors, alternating physical reflections, portal, private rewards, persistence, navigation, reset');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
