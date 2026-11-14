const {chromium}=require('C:/Users/freyj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
 const page=await browser.newPage({viewport:{width:1400,height:1900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(require('node:url').pathToFileURL(require('node:path').join(__dirname,'index.html')).href);
 const p=i=>page.locator(`[data-player="${i}"]`);
 for(let i=0;i<2;i++)for(let n=0;n<2;n++)await p(i).locator('[data-action="right"]').click();
 await p(0).locator('[data-action="inspect-morse"]').click();
 for(let i=0;i<2;i++){
  const fly=p(i).locator('.morse-fly'),b=await fly.boundingBox(),scene=await p(i).locator('.scene').boundingBox();
  assert.equal(await fly.evaluate(el=>el.parentElement.classList.contains('player')),true);
 }
 await page.evaluate(()=>{Math.random=()=>.98;});
 const fly=p(0).locator('.morse-fly'),b=await fly.boundingBox();await page.mouse.move(b.x+15,b.y+15);await page.waitForTimeout(550);
 const moved=await fly.boundingBox();assert.ok(Math.hypot(moved.x-b.x,moved.y-b.y)>80);
 for(let n=0;n<4;n++){
  assert.ok(await fly.evaluate(el=>{const f=el.getBoundingClientRect();return ![...el.parentElement.querySelectorAll('button,[role="button"],input,textarea,select,a[href],[contenteditable="true"],[data-inventory-item]')].filter(e=>e!==el&&e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden').some(e=>{const r=e.getBoundingClientRect();return f.left-23<r.right&&f.right+23>r.left&&f.top-23<r.bottom&&f.bottom+23>r.top;});}),'fly landing clears all controls including catch margin');
  const r=await fly.boundingBox();await page.mouse.move(r.x+15,r.y+15);await page.waitForTimeout(600);
 }
 await fly.click();assert.equal(await p(0).locator('[data-inventory-item="caught-fly"]').count(),1);assert.equal(await p(1).locator('.morse-fly').count(),1);
 await p(0).locator('[data-morse="close"]').click();assert.equal(await page.locator('.morse-fly').count(),0);
 await p(0).locator('[data-action="inspect-morse"]').click();assert.equal(await p(1).locator('.morse-fly').count(),1);
 assert.deepEqual(errors,[]);console.log('PASS: full-panel flight, safe landings clear of controls, private catch, cleanup on close/reopen');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
