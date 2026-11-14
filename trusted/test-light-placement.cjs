const {chromium}=require('C:/Users/freyj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 try{
 const page=await browser.newPage({viewport:{width:1400,height:1700}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(require('node:url').pathToFileURL(require('node:path').join(__dirname,'index.html')).href);
 const p=i=>page.locator(`[data-player="${i}"]`),skull=p(0).locator('[data-role="decor"] [data-layout-id="trinket-1"]');
 const drag=async(loc,dx,dy)=>{await loc.waitFor({state:"visible"});let b;for(let n=0;n<5&&!b;n++)b=await loc.boundingBox();assert.ok(b);await page.mouse.move(b.x+b.width*.45,b.y+b.height*.45);await page.mouse.down();await page.mouse.move(b.x+b.width*.45+dx,b.y+b.height*.45+dy,{steps:8});await page.mouse.up();};
 await skull.click();await page.locator('[data-layout="toggle"]').click();
 const eyeBox=page.locator('.layout-box').filter({hasText:'Skull light source'});assert.equal(await eyeBox.count(),1);
 await drag(eyeBox,12,8);await page.locator('[data-layout="save"]').click();
 const eye=await page.evaluate(()=>JSON.parse(localStorage.getItem('witches-hut-layout-v1'))['light:skull-eye']);assert.ok(eye);
 await page.locator('[data-layout="toggle"]').click();await skull.click();await page.locator('.skull-eye').click();
 await p(0).locator('.item-image-overlay').click({position:{x:5,y:5}});
 const start=()=>p(0).locator('.light-rays line').first().evaluate(el=>[+el.getAttribute('x1'),+el.getAttribute('y1')]);
 const before=await start();await drag(skull,70,45);const after=await start();assert.ok(Math.hypot(after[0]-before[0],after[1]-before[1])<.01);
 assert.equal(await p(0).locator('.item-image-overlay:not([hidden])').count(),0);
 const mirror=p(0).locator('[data-mirror="0"]'),beforeMirror=await mirror.boundingBox();await drag(mirror,45,25);const afterMirror=await mirror.boundingBox();assert.ok(afterMirror.x-beforeMirror.x>35);
 await p(1).locator('[data-action="right"]').click();
 await page.locator('[data-layout="toggle"]').click();
 const portalBox=page.locator('.layout-box').filter({hasText:'Final portal for the memory coin'});assert.equal(await portalBox.count(),1);await drag(portalBox,-25,-15);await page.locator('[data-layout="save"]').click();
 const portal=await page.evaluate(()=>JSON.parse(localStorage.getItem('witches-hut-layout-v1'))['light:portal']);assert.ok(portal);
 await page.locator('[data-layout="toggle"]').click();await page.reload();
 assert.equal(await page.locator('.light-mirror').count(),10);
 assert.ok(Math.abs((await start())[0]-after[0])<.01);
 assert.ok(Math.abs(parseFloat(await page.locator('.light-portal-final').evaluate(el=>el.style.left))-portal.left)<.01);
 await page.screenshot({path:require('node:path').join(__dirname,'../output/light-placement-preview.png'),fullPage:true});
 assert.deepEqual(errors,[]);console.log('PASS: editable eye origin and portal, fixed skull beam origin, mirror dragging, saved positions');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
