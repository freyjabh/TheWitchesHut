const {chromium}=require('C:/Users/freyj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
  const page=await browser.newPage({viewport:{width:1500,height:1800}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(require('node:url').pathToFileURL(path.join(__dirname,'index.html')).href);
  const host=i=>page.locator(`[data-player="${i}"]`),view=i=>host(i).locator('.endgame-overlay');
  await host(0).getByRole('button',{name:'Test: endgame',exact:true}).click();
  await host(1).getByRole('button',{name:'Test: endgame',exact:true}).click();
  assert.equal(await view(0).locator('.story-gap').count(),6);
  await view(0).locator('[data-story="check"]').click();
  assert.match(await view(0).locator('.story-feedback').innerText(),/missing/);
  await view(0).locator('[data-word="before"]').click();await view(0).locator('[data-gap="5"]').click();
  assert.equal(await view(1).locator('[data-gap="5"]').innerText(),'before');
  await view(0).locator('[data-gap="5"]').click();
  const first=view(0).locator('[data-word="siblings"]');await first.scrollIntoViewIfNeeded();
  const from=await first.boundingBox(),to=await view(0).locator('[data-gap="0"]').boundingBox();
  await page.mouse.move(from.x+from.width/2,from.y+from.height/2);await page.mouse.down();
  await page.mouse.move(to.x+to.width/2,to.y+to.height/2,{steps:10});await page.mouse.up();
  assert.equal(await view(0).locator('[data-gap="0"]').innerText(),'two younger siblings');
  assert.equal(await view(1).locator('[data-word="siblings"]').count(),0);
  for(const [n,word] of ['siblings','healing','inge','married','innocent','after'].entries()){
   if(n===0)continue;await view(0).locator(`[data-word="${word}"]`).click();await view(0).locator(`[data-gap="${n}"]`).click();
  }
  await view(0).locator('[data-story="check"]').click();assert.match(await view(1).locator('.story-feedback').innerText(),/remembered/);
  await page.screenshot({path:path.join(__dirname,'../output/endgame-filled.png'),fullPage:true});
  await page.reload();await host(0).getByRole('button',{name:'Test: endgame',exact:true}).click();
  assert.equal(await view(0).locator('.story-gap.is-filled').count(),6);
  await view(0).locator('[data-story="clear"]').click();
  await page.screenshot({path:path.join(__dirname,'../output/endgame-preview.png'),fullPage:true});
  for(const size of [{width:1280,height:720},{width:800,height:600}]){
   await page.setViewportSize(size);
   assert.equal(await view(0).evaluate(el=>el.scrollWidth<=el.clientWidth&&el.scrollHeight<=el.clientHeight),true);
   const bounds=await view(0).boundingBox();
   for(const el of await view(0).locator('.story-gap,.story-word,[data-story="check"]').all()){
    const r=await el.boundingBox();assert.ok(r.y>=bounds.y-1&&r.y+r.height<=bounds.y+bounds.height+1,'Control fits inside overlay');
   }
  }
  await view(0).locator('[data-story="close"]').click();
  await page.evaluate(()=>{localStorage.setItem('witches-hut-shared-puzzle-v1',JSON.stringify({placed:Array.from({length:12},(_,i)=>i),testAll:true,letterUnlocked:true}));});
  await page.reload();await host(0).locator('.memory-pieces').click();
  await host(0).locator('.shared-puzzle-letter').click();assert.equal(await view(0).count(),1);
  await page.locator('#reset-game').click({force:true});
  assert.deepEqual(errors,[]);console.log('PASS: endgame test button, six gaps, drag and click placement, shared words, validation, save, responsive fit, letter entry, no page errors');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
