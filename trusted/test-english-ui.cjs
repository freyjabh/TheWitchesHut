const {chromium}=require('C:/Users/freyj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
 const page=await browser.newPage({viewport:{width:1400,height:1700}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(require('node:url').pathToFileURL(require('node:path').join(__dirname,'index.html')).href);
 const p=i=>page.locator(`[data-player="${i}"]`);
 async function check(){const texts=await page.evaluate(()=>[document.body.innerText,...[...document.querySelectorAll('[aria-label],[alt],[title],[placeholder]')].flatMap(el=>['aria-label','alt','title','placeholder'].map(a=>el.getAttribute(a)||''))]);assert.deepEqual(texts.filter(t=>/[åäöÅÄÖ]|\b(?:krukvaxt|fagelbur|prydnad|klattervaxt|Siffra|Inställningar|Redigera|Lapp med|Tom flaska)\b/.test(t)),[]);}
 for(let n=0;n<4;n++){await check();for(let i=0;i<2;i++)await p(i).locator('[data-action="right"]').click();}
 await p(0).getByRole('button',{name:'Settings',exact:true}).click();await check();await page.getByRole('button',{name:'Done',exact:true}).click();
 for(let i=0;i<2;i++)for(let n=0;n<2;n++)await p(i).locator('[data-action="right"]').click();
 await p(0).locator('[data-action="inspect-morse"]').click();await check();await p(0).locator('[data-morse="close"]').click();
 await p(0).locator('.crystal-pickup').click();await check();await p(0).locator('[data-crystal-hint="menu"]').click();await p(0).locator('[data-topic="explore"]').click();await check();
 assert.deepEqual(errors,[]);console.log('PASS: English text, labels, image descriptions, settings, all walls, Morse overlay and crystal hints');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
