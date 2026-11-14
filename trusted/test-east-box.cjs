const {chromium}=require('C:/Users/freyj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
 const page=await browser.newPage({viewport:{width:1400,height:1100}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(require('node:url').pathToFileURL(require('node:path').join(__dirname,'index.html')).href);
 const p=i=>page.locator(`[data-player="${i}"]`);
 for(let i=0;i<2;i++){await p(i).locator('[data-action="right"]').click();await p(i).locator('[data-memory="east-box"]').click();}
 assert.equal(await p(0).locator('[data-memory="east-digit"]').count(),5);
 assert.equal(await page.locator('.east-box-memory-star').count(),0);
 for(let n=0;n<5;n++)for(let k=0;k<Number("73053"[n]);k++)await p(0).locator(`[data-digit="${n}"]`).click();
 for(let i=0;i<2;i++)assert.equal(await p(i).locator('.east-box-memory-star').count(),1);
 await p(0).locator('.east-box-memory-star').click();
 assert.equal(await p(0).locator('[data-inventory-item="memory-6-0"]').count(),1);
 await page.reload();
 for(let i=0;i<2;i++)await p(i).locator('[data-memory="east-box"]').click();
 assert.equal(await p(0).locator('.east-box-memory-star').count(),0);
 await p(1).locator('.east-box-memory-star').click();
 assert.equal(await p(1).locator('[data-inventory-item="memory-6-1"]').count(),1);
 await p(0).locator('.memory-modal button').click().catch(()=>{});
 await p(0).locator('.item-image-overlay').click({position:{x:5,y:5}});
 await p(0).locator('[data-memory="east-box"]').click();
 await page.screenshot({path:require('node:path').join(__dirname,'../output/east-box-preview.png')});
 assert.deepEqual(errors,[]);console.log('PASS: five digits, shared unlock, private fragments, persistence, no duplicate collection, no page errors');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
