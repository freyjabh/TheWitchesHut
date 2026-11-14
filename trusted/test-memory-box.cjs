const {chromium}=require('C:/Users/freyj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const page=await browser.newPage({viewport:{width:1400,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(require('node:url').pathToFileURL(require('node:path').join(__dirname,'index.html')).href);
 const p=i=>page.locator(`[data-player="${i}"]`);
 await p(0).locator('[data-layout-id="ask-1"]').dispatchEvent('click');assert.equal(await p(0).locator('.memory-box-star').count(),0);
 for(let i=0;i<2;i++){
  await p(i).locator('[data-action="right"]').click();await p(i).locator('[data-action="right"]').click();
  await p(i).locator('[data-layout-id="burk-1"]').dispatchEvent('click');
  assert.match(await p(i).locator('[data-layout-id="burk-1"]').getAttribute('src'),/burk1.oppen/);
  assert.equal(await p(i).locator(`[data-inventory-item="north-box-key-${i}"]`).count(),0);
  if(i===0){await page.reload();assert.match(await p(i).locator('[data-layout-id="burk-1"]').getAttribute('src'),/burk1.oppen/);}
  await p(i).locator('.memory-jar-key').click();
  assert.equal(await p(i).locator('.memory-jar-key').count(),0);
  assert.equal(await p(i).locator(`[data-inventory-item="north-box-key-${i}"]`).count(),1);
 }
 await page.reload();assert.equal(await p(0).locator('[data-inventory-item="north-box-key-0"]').count(),1);
 for(let i=0;i<2;i++){
  await p(i).locator('[data-action="left"]').click();await p(i).locator('[data-action="left"]').click();
  await p(i).locator('[data-inventory-item="north-box-key-'+i+'"]').click();
  await p(i).locator('[data-inventory-item="north-box-key-'+i+'"]').click();
  await p(i).locator('[data-layout-id="ask-1"]').dispatchEvent('click');
  assert.match(await p(i).locator('[data-layout-id="ask-1"]').getAttribute('src'),/ask1.oppen/);
  assert.equal(await p(i).locator('.memory-box-star').count(),1);
 }
 await page.locator('[data-layout="toggle"]').click();
 assert.ok(await page.locator('.layout-box').count()>0);
 const star=p(0).locator('.memory-box-star'),before=await star.boundingBox();
 await page.mouse.move(before.x+before.width/2,before.y+before.height/2);await page.mouse.down();await page.mouse.move(before.x+before.width/2-40,before.y+before.height/2-20,{steps:5});await page.mouse.up();
 await page.locator('[data-layout="save"]').click();
 const layout=await page.evaluate(()=>JSON.parse(localStorage.getItem('witches-hut-layout-v1')));assert.ok(layout['0:memory-north-box-star'],'Star has its own editable placement');
 await page.locator('[data-layout="toggle"]').click();
 await page.waitForTimeout(1000);
 await p(0).locator('.scene').screenshot({path:require('node:path').join(__dirname,'../output/memory-box-closeup.png')});
 await page.screenshot({path:require('node:path').join(__dirname,'../output/memory-box-preview.png'),fullPage:true});
 await p(0).locator('.memory-box-star').click();await p(0).locator('[data-memory="dismiss"]').click();
 await page.reload();assert.equal(await p(0).locator('.memory-box-star').count(),0);assert.equal(await p(1).locator('.memory-box-star').count(),1);
 assert.equal(await p(0).locator('[data-inventory-item="memory-1-0"]').count(),1);
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: red jar, private keys, locked/open box, reload, star collection and editor.');
})().catch(e=>{console.error(e);process.exit(1)});
