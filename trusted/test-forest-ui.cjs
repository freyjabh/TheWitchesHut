const {chromium}=require('C:/Users/freyj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  try {
    const page=await browser.newPage({viewport:{width:1500,height:1100}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(pathToFileURL(path.join(__dirname,'index.html')).href);
    await page.evaluate(()=>document.fonts.ready);
    const scene=page.locator('.player[data-player="0"] .scene');
    const snapshot=()=>scene.evaluate(root=>[root,...root.querySelectorAll('*')].map(el=>{
      const s=getComputedStyle(el),r=el.getBoundingClientRect(),base=root.getBoundingClientRect();
      return {tag:el.tagName,css:Array.from(s).map(k=>[k,s.getPropertyValue(k)]),rect:r.width||r.height?[r.x-base.x,r.y-base.y,r.width,r.height].map(v=>Math.round(v*1000)/1000):[0,0,0,0]};
    }));
    for(let wall=0;wall<4;wall++) {
      await page.evaluate(w=>{state.players[0].wall=w;drawAll();},wall);
      const themed=await snapshot();
      await page.evaluate(()=>document.querySelector('link[href="forest-ui.css"]').disabled=true);
      assert.deepEqual(await snapshot(),themed,`Wall ${wall}: every scene element retains all computed styles and geometry`);
      await page.evaluate(()=>document.querySelector('link[href="forest-ui.css"]').disabled=false);
    }
    await page.evaluate(()=>{state.players[0].wall=2;drawAll();});
    const wallBefore=await page.evaluate(()=>state.players[0].wall);
    await page.locator('.player[data-player="0"] [data-action="right"]').click();
    assert.notEqual(await page.evaluate(()=>state.players[0].wall),wallBefore);
    await page.locator('.player[data-player="0"] [data-action="left"]').click();
    await page.locator('.player[data-player="0"] .player-settings-button').click();
    assert(await page.locator('.settings-dialog').isVisible());
    await page.locator('[data-settings-done]').click();
    await page.locator('.player[data-player="0"] [data-action="pickup-notepad"]').click();
    assert(await page.locator('.player[data-player="0"] .notes-body textarea').isVisible());
    await page.locator('.player[data-player="0"] .notes-body textarea').fill('Forest UI check');
    assert.equal(await page.locator('.player[data-player="1"] .notes-body textarea').inputValue(),'Forest UI check');
    await page.mouse.move(0,0);
    const openNotesScene=await snapshot();
    await page.evaluate(()=>document.querySelector('link[href="forest-ui.css"]').disabled=true);
    assert.deepEqual(await snapshot(),openNotesScene,'Open notes also preserve scene styles and geometry');
    await page.evaluate(()=>document.querySelector('link[href="forest-ui.css"]').disabled=false);
    await page.locator('.player[data-player="0"] .notes-toggle').click();
    assert(!await page.locator('.player[data-player="0"] .notes-body').isVisible());
    assert(await page.evaluate(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0)),'Artwork loads');
    await page.screenshot({path:path.join(__dirname,'../output/forest-ui-desktop.png'),fullPage:true});
    await page.setViewportSize({width:390,height:844});
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Mobile has no horizontal overflow');
    await page.screenshot({path:path.join(__dirname,'../output/forest-ui-mobile.png'),fullPage:true});
    assert.deepEqual(errors,[]);
    console.log('PASS: scene styles and geometry unchanged on all four walls and with notes open; navigation, shared notes, settings, artwork and mobile overflow.');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
