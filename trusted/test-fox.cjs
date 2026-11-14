const {chromium}=require('C:/Users/freyj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const page=await browser.newPage({viewport:{width:1400,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(require('node:url').pathToFileURL(require('node:path').join(__dirname,'index.html')).href);
 const p=page.locator('[data-player="0"]');
 await page.evaluate(()=>{state.players[0].southBoxOpen=true;state.players[0].wall=2;drawPlayer(0);showSouthBox(0);});
 await p.locator('[data-action="read-box-note"]').click();assert.match(await p.locator('.item-image-overlay>img').getAttribute('src'),/1_lapp.png/);
 await p.locator('[data-action="left"]').click();await p.locator('[data-layout-id="painting-2"]').click();
 assert.equal(await p.locator('.fox-number').count(),10);
 for(const digit of '123'){await p.locator(`[data-fox-number="${digit}"]`).click();assert.equal(await p.locator('.fox-code-feedback').innerText(),'');}
 await p.locator('[data-fox-number="4"]').click();assert.match(await p.locator('.fox-code-feedback').innerText(),/Fel kod/);assert.equal(await p.locator('.fox-code-output').innerText(),'1234');
 for(const digit of '4683')await p.locator(`[data-fox-number="${digit}"]`).click();
 assert.match(await p.locator('.fox-code-feedback').innerText(),/Rätt kod/);
 await p.locator('.scene').screenshot({path:require('node:path').join(__dirname,'../output/fox-puzzle.png')});
 await page.reload();await p.locator('[data-layout-id="painting-2"]').click();assert.match(await p.locator('.fox-code-feedback').innerText(),/Rätt kod/);assert.deepEqual(errors,[]);
 await browser.close();console.log('PASS: note in open box, fox digit hotspots, delayed error after four digits, retry, 4683 and saved success.');
})().catch(e=>{console.error(e);process.exit(1)});
