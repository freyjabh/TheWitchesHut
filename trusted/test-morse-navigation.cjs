const {chromium}=require('C:/Users/freyj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
 const page=await browser.newPage({viewport:{width:1400,height:1100}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(require('node:url').pathToFileURL(require('node:path').join(__dirname,'index.html')).href);
 for(let i=0;i<2;i++)for(let step=0;step<2;step++)await page.locator(`[data-player="${i}"] [data-action="right"]`).click();
 await page.locator('[data-player="0"] [data-action="inspect-morse"]').click();
 await page.clock.install();await page.clock.pauseAt(new Date());
 const codes={F:'..-.',E:'.',D:'-..',T:'-',H:'....',R:'.-.',O:'---',G:'--.',S:'...',M:'--',L:'.-..',I:'..'};
 const next=page.getByRole('button',{name:'Next letter',exact:true});
 const prev=page.getByRole('button',{name:'Previous letter',exact:true});
 assert.equal(await prev.isDisabled(),true);
 const lit=()=>page.locator('.morse-lantern').evaluate(el=>el.classList.contains('is-lit'));
 const words='FEED THE FROG SOME FLIES'.split(' ');
 let position=0;
 for(let w=0;w<words.length;w++)for(let l=0;l<words[w].length;l++){
   if(position++)await next.click();
   await page.getByRole('button',{name:'Replay this letter',exact:true}).click();
   assert.equal(await page.locator('.morse-position').innerText(),`Word ${w+1} of 5 · Letter ${l+1} of ${words[w].length}`);
   assert.equal(await lit(),false);await page.clock.runFor(840);
   const marks=codes[words[w][l]];
   for(let m=0;m<marks.length;m++){
     assert.equal(await lit(),true);
     await page.clock.runFor((marks[m]==='.'?280:840)-1);assert.equal(await lit(),true);
     await page.clock.runFor(1);assert.equal(await lit(),false);
     if(m<marks.length-1)await page.clock.runFor(280);
   }
 }
 assert.equal(await next.isDisabled(),true);
 await prev.click();assert.match(await page.locator('.morse-position').innerText(),/Letter 4 of 5/);
 await page.clock.runFor(20000);assert.match(await page.locator('.morse-position').innerText(),/Letter 4 of 5/);
 await page.getByRole('button',{name:'Close the Morse puzzle'}).first().click();
 assert.equal(await page.locator('.morse-overlay').count(),0);
 await page.locator('[data-player="0"] [data-action="inspect-morse"]').click();
 assert.match(await page.locator('.morse-position').innerText(),/Letter 4 of 5/);
 await page.screenshot({path:require('node:path').join(__dirname,'../output/morse-navigation.png')});
 assert.deepEqual(errors,[]);
 console.log('PASS: all 20 letters encode FEED THE FROG SOME FLIES; dot/dash timings, word boundaries, arrows, repeat, retained position, close');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
