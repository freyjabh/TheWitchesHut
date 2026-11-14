const {chromium}=require('C:/Users/freyj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const page=await browser.newPage({viewport:{width:1400,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(require('node:url').pathToFileURL(require('node:path').join(__dirname,'index.html')).href);
 const p=i=>page.locator(`[data-player="${i}"]`);
 for(let i=0;i<2;i++){await p(i).locator('[data-action="right"]').click();await p(i).locator('.noticeboard').click();}
 assert.equal(await p(0).locator('.letter-note').count(),8);assert.equal(await p(0).locator('[data-notice-note]').count(),0);
 assert.equal(await p(1).locator('[data-notice-note]').count(),10);assert.equal(await p(1).locator('.letter-note').count(),0);
 const correct=await page.evaluate(()=>NOTICEBOARD_ROWS.map(([row],n)=>{const bits=row.split(' ');return [1,3,5].every(k=>bits[k]==='<'?NOTICEBOARD_LETTERS[bits[k-1]]<NOTICEBOARD_LETTERS[bits[k+1]]:NOTICEBOARD_LETTERS[bits[k-1]]>NOTICEBOARD_LETTERS[bits[k+1]])?n:null;}).filter(n=>n!==null));assert.deepEqual(correct,[6]);
 await p(0).locator('.scene').screenshot({path:require('node:path').join(__dirname,'../output/noticeboard-letters.png')});
 const note=p(1).locator('[data-notice-note="6"]');await note.click();assert.equal(await note.getAttribute('aria-pressed'),'true');assert.match(await note.getAttribute('aria-label'),/5831/);
 await page.waitForTimeout(400);await p(1).locator('.scene').screenshot({path:require('node:path').join(__dirname,'../output/noticeboard-statements.png')});
 await page.reload();await p(1).locator('.noticeboard').click();assert.equal(await p(1).locator('[data-notice-note="6"]').getAttribute('aria-pressed'),'true');
 await p(1).locator('[data-notice-note="6"]').click();assert.equal(await p(1).locator('[data-notice-note="6"]').getAttribute('aria-pressed'),'false');assert.deepEqual(errors,[]);
 await browser.close();console.log('PASS: private note sets, exact puzzle data, unique correct row, flip both ways and persistence.');
})().catch(e=>{console.error(e);process.exit(1)});
