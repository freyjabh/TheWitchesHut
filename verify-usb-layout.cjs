const {chromium}=require('./SPELET-USB/runtime/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{pathToFileURL}=require('node:url');
const expected=JSON.parse(JSON.parse(fs.readFileSync('trusted/playtest-setup.json','utf8'))['witches-hut-layout-v1']);
const near=(actual,expected,label)=>assert.ok(Number.isFinite(parseFloat(actual))&&Math.abs(parseFloat(actual)-expected)<.001,`${label}: ${actual} != ${expected}`);
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
  const page=await browser.newPage({viewport:{width:1600,height:1100}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(path.join(__dirname,'SPELET-USB/SPELET.html')).href);
  assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('witches-hut-layout-v1'))),expected);
  const checked=new Set();
  for(let wall=0;wall<4;wall++){
   await page.evaluate(()=>window.refreshMemoryLayout());
   const live=await page.evaluate(({expected,wall})=>{
    const result=[];
    for(const [key,rect]of Object.entries(expected)){
     if(!key.startsWith(wall+':'))continue;
     const id=key.slice(2),decor=document.querySelector('[data-player="0"] [data-role="decor"]');
     const el=decor.querySelector(`[data-layout-id="${CSS.escape(id)}"]`)||decor.querySelector('.'+CSS.escape(id));
     if(el)result.push({key,actual:Object.fromEntries(['left','top','width','height','rotate'].map(k=>[k,el.style[k]]))});
    }
    return result;
   },{expected,wall});
   for(const {key,actual}of live){const rect=expected[key];for(const k of ['left','top','width','height']){if(key==='2:table-notepad'&&k==='height'){assert.equal(actual.height,'auto');continue;}near(actual[k],rect[k],key+' '+k);}near(actual.rotate,rect.rotation||0,key+' rotation');checked.add(key);}
   if(wall<3)for(const i of [0,1])await page.locator(`[data-player="${i}"] [data-action="right"]`).click();
  }
  const enter=async n=>{await page.evaluate(n=>sessionStorage.setItem('witches-hut-memory-visits-v1',JSON.stringify([n,n])),n);await page.reload();};
  const checkMemory=async kind=>{
   await page.evaluate(()=>window.refreshMemoryLayout());
   const live=await page.locator(kind==='illness'?'.illness-prop':'.apprentice-prop').evaluateAll((els,kind)=>els.map(el=>({key:`memory:${kind}:player-${el.closest('.player').dataset.player}:${el.dataset.layoutId}`,style:Object.fromEntries(['left','top','width','height','rotate'].map(k=>[k,el.style[k]]))})),kind);
   for(const {key,style}of live){const r=expected[key];assert(r,key);for(const k of ['left','top','width','height'])near(style[k],r[k],key+' '+k);near(style.rotate,r.rotation||0,key+' rotation');checked.add(key);}
   return live.length;
  };
  await enter(8);assert.equal(await checkMemory('illness'),5);
  await page.screenshot({path:path.join(__dirname,'output/usb-memory-1-restored.png'),fullPage:true});
  await enter(2);
  for(const i of [0,1])await page.locator(`[data-player="${i}"] [data-ap="bowl"]`).click();
  for(const i of [0,1])await page.locator(`[data-player="${i}"] [data-ap="start"]`).click();
  await page.waitForFunction(()=>document.querySelector('.apprentice-prop')?.style.left);
  assert.equal(await checkMemory('apprentice'),20);
  await page.screenshot({path:path.join(__dirname,'output/usb-memory-2-restored.png'),fullPage:true});
  await page.reload();assert.equal(await checkMemory('apprentice'),20);
  // Old USB room settings are upgraded without deleting game progress.
  await page.evaluate(()=>{localStorage.setItem('hut-usb-layout-version','previous-build');localStorage.setItem('witches-hut-layout-v1','{}');localStorage.setItem('usb-progress-test','kept');});
  await page.reload();assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('witches-hut-layout-v1'))),expected);assert.equal(await page.evaluate(()=>localStorage.getItem('usb-progress-test')),'kept');
  assert.deepEqual(errors,[]);
  const report={savedPlacements:Object.keys(expected).length,checkedRenderedPlacements:[...checked],notRenderedInThisCheck:Object.keys(expected).filter(k=>!checked.has(k)),errors};
  fs.writeFileSync(path.join(__dirname,'output/usb-layout-verification.json'),JSON.stringify(report,null,2));
  console.log('PASS: exact saved layout bundled; '+checked.size+' rendered placements checked, including all 5 childhood props and all 20 apprenticeship props; reload and USB layout upgrade preserve progress.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
