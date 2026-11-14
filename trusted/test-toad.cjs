const {chromium}=require('C:/Users/freyj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
 const page=await browser.newPage({viewport:{width:1400,height:1700}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(require('node:url').pathToFileURL(require('node:path').join(__dirname,'index.html')).href);
 const p=i=>page.locator(`[data-player="${i}"]`);
 for(let i=0;i<2;i++)for(let s=0;s<2;s++)await p(i).locator('[data-action="right"]').click();
 await p(0).locator('[data-action="inspect-morse"]').click();
 for(let i=0;i<2;i++)await p(i).locator('.morse-fly').click();
 await page.getByRole('button',{name:'Close the Morse puzzle'}).first().click();
 for(let i=0;i<2;i++){
  await p(i).getByRole('button',{name:'Inspect Toad Figurine',exact:true}).click();
  assert.equal(await p(i).locator('[data-inspect-action="take"]').count(),0);
  await p(i).locator('[data-memory="feed-toad"]').click();assert.equal(await p(i).locator('.toad-memory-star').count(),0);
  await p(i).locator('[data-inventory-item="caught-fly"]').click();
  await p(i).locator('[data-memory="feed-toad"]').click();
  assert.equal(await p(i).locator('[data-inventory-item="caught-fly"]').count(),0);
  assert.equal(await p(i).locator('.toad-memory-star').count(),1);
  await page.reload();await p(i).getByRole('button',{name:'Inspect Toad Figurine',exact:true}).click();
  assert.equal(await p(i).locator('.toad-memory-star').count(),1);
  await p(i).locator('.toad-memory-star').click();
  assert.equal(await p(i).locator(`[data-inventory-item="memory-7-${i}"]`).count(),1);
  await p(i).locator('.memory-modal button').click();
  await p(i).getByRole('button',{name:'Inspect Toad Figurine',exact:true}).click();assert.equal(await p(i).locator('.toad-memory-star').count(),0);
  await p(i).locator('.item-image-overlay').click({position:{x:5,y:5}});
 }
 assert.deepEqual(errors,[]);console.log('PASS: each player feeds their own fly, fragment persists, collection is private and cannot repeat');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
