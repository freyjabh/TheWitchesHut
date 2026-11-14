const {chromium}=require('C:/Users/freyj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  try{
    const page=await browser.newPage({viewport:{width:1500,height:1100}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(pathToFileURL(path.join(__dirname,'index.html')).href);
    const p=i=>page.locator(`.player[data-player="${i}"]`);
    const hint=(i,a)=>p(i).locator(`[data-crystal-hint="${a}"]`);
    const choose=(i,t)=>p(i).locator(`[data-topic="${t}"]`);
    for(let i=0;i<2;i++){await p(i).locator('[data-action="right"]').click();await p(i).locator('[data-action="right"]').click();}
    assert.match(await p(0).locator('.crystal-pickup img').getAttribute('src'),/1_kristallkula.png/);
    await p(0).locator('.crystal-pickup').click();await hint(0,'menu').click();
    assert.equal(await p(0).locator('[data-topic]').count(),2,'unseen puzzles remain hidden');
    await choose(0,'explore').click();assert.match(await p(0).locator('.crystal-level').textContent(),/1 of 3/);
    await hint(0,'next').click();await hint(0,'next').click();assert.match(await p(0).locator('.crystal-level').textContent(),/3 of 3/);
    assert.equal(await hint(0,'next').count(),0);
    await hint(0,'close').click();await p(1).locator('.crystal-companion').click();await choose(1,'explore').click();
    assert.match(await p(1).locator('.crystal-level').textContent(),/1 of 3/,'hint levels are private');await hint(1,'close').click();
    // Real world interaction, shared discovery, no hint-related game mutation.
    await p(0).locator('[data-layout-id="burk-1"]').dispatchEvent('click');
    await p(1).locator('.crystal-companion').click();assert.equal(await choose(1,'jar').count(),1);
    const before=await page.evaluate(()=>JSON.stringify(state));await choose(1,'jar').click();await hint(1,'next').click();
    assert.equal(await page.evaluate(()=>JSON.stringify(state)),before,'hints cannot change puzzle progress');await hint(1,'close').click();
    await page.reload();await p(0).locator('.crystal-companion').click();await choose(0,'explore').click();
    assert.match(await p(0).locator('.crystal-level').textContent(),/3 of 3/,'levels survive reload');await hint(0,'close').click();
    // Existing saves infer only discoveries supported by progress; player 2 does not inherit player 1's private completion.
    await page.evaluate(()=>{state.players[0].chestUnlocked=true;state.players[1].chestUnlocked=false;state.fireLit=true;state.bookUnlocked=true;state.brewReady=true;save();drawAll();});
    await p(1).locator('.crystal-companion').click();await choose(1,'chest').click();assert.match(await p(1).locator('.crystal-level').textContent(),/1 of 3/);await hint(1,'close').click();
    await p(0).locator('.crystal-companion').click();await choose(0,'chest').click();assert.match(await p(0).locator('.crystal-hint').textContent(),/Your chest is open/);await hint(0,'menu').click();
    await choose(0,'brew').click();assert.match(await p(0).locator('.crystal-hint').textContent(),/Glowing soup/);await hint(0,'close').click();
    await page.evaluate(()=>{state.ladleCharged=true;drawAll();});await p(0).locator('.crystal-companion').click();await choose(0,'brew').click();assert.match(await p(0).locator('.crystal-hint').textContent(),/already full/);await hint(0,'close').click();
    // All topic previews and final hint levels must render without overflow or exceptions.
    await page.evaluate(()=>{const k='witches-hut-reginald-hints-v1',s=JSON.parse(localStorage.getItem(k));s.discoveries=['drawer','jar','north-box','chest','deer','fire','cabinet','book','brew','raven','door','hatch','board','fox','hand','echo','east-box','morse','toad','light','memories'];localStorage.setItem(k,JSON.stringify(s));save();});
    await page.reload();await p(0).locator('.crystal-companion').click();
    const ids=await p(0).locator('[data-topic]').evaluateAll(es=>es.map(e=>e.dataset.topic));
    for(const id of ids){await choose(0,id).click();for(let n=0;n<2;n++)if(await hint(0,'next').count())await hint(0,'next').click();assert((await p(0).locator('.crystal-hint').textContent()).length>10);assert(await p(0).locator('.crystal-words').evaluate(el=>{const text=el.querySelector('p');return text.scrollHeight<=el.clientHeight+1&&text.scrollWidth<=el.clientWidth+1;}),'hint fits inside crystal');await hint(0,'menu').click();}
    await p(0).screenshot({path:path.join(__dirname,'../output/crystal-hints-menu.png')});
    const fits=await p(0).locator('.crystal-dialog article').evaluate(el=>el.scrollHeight<=el.clientHeight+1);assert(fits,'menu fits player view');
    await choose(0,'jar').click();await p(0).locator('.crystal-words').evaluate(el=>Promise.all(el.getAnimations().map(a=>a.finished)));await p(0).screenshot({path:path.join(__dirname,'../output/crystal-ball-hint.png')});
    await hint(0,'close').click();page.on('dialog',d=>d.accept());await page.locator('#reset-game').click();
    assert.equal(await page.locator('.crystal-companion').count(),0);assert.equal(await page.evaluate(()=>localStorage.getItem('witches-hut-reginald-hints-v1')),null);
    assert.deepEqual(errors,[]);console.log('PASS: progressive hints, discovery, privacy, saved levels, state-aware stages, all topics, layout and reset.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
