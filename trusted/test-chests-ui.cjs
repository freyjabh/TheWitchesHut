const {chromium}=require('C:/Users/freyj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
 const page=await browser.newPage();
 await page.goto(require('node:url').pathToFileURL(require('node:path').join(__dirname,'index.html')).href);
 await page.evaluate(()=>localStorage.setItem('witches-hut-progress-v1',JSON.stringify({players:[{wall:1,inventory:['key-14'],selectedItem:'key-14',chestUnlocked:false},{wall:1,inventory:[],chestUnlocked:false}]})));
 await page.reload();
 const chest=i=>page.locator(`.player[data-player="${i}"] .chest`);
 assert.equal(await chest(0).count(),1);assert.equal(await chest(1).count(),1);
 await chest(0).dispatchEvent('click');
 assert(await chest(0).evaluate(el=>el.classList.contains('is-open')));
 assert(!(await chest(1).evaluate(el=>el.classList.contains('is-open'))));
 await chest(1).dispatchEvent('click');
 assert(!(await chest(1).evaluate(el=>el.classList.contains('is-open'))));
 await chest(0).dispatchEvent('click');
 assert.equal(await page.locator('.player[data-player="0"] .chest-top-wood').count(),1);
 assert.equal(await page.locator('.player[data-player="0"] .chest-top-eye').count(),0);
 await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('witches-hut-progress-v1'));s.players[0].inventory=[];s.players[0].selectedItem=null;s.players[1].inventory=['key-14'];s.players[1].selectedItem='key-14';localStorage.setItem('witches-hut-progress-v1',JSON.stringify(s));});
 await page.reload();await chest(1).dispatchEvent('click');await chest(1).dispatchEvent('click');
 assert.equal(await page.locator('.player[data-player="1"] .chest-top-eye').count(),1);
 assert.equal(await page.locator('.player[data-player="1"] .chest-top-wood').count(),0);
 await page.reload();assert(await chest(0).evaluate(el=>el.classList.contains('is-open')));assert(await chest(1).evaluate(el=>el.classList.contains('is-open')));
 console.log('PASS: visible chests, separate key unlocks, private wood/eye contents and reload persistence.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
