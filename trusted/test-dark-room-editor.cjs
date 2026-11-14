const {chromium}=require('C:/Users/freyj/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const page=await browser.newPage({viewport:{width:1400,height:1100}});
 await page.goto(require('node:url').pathToFileURL(require('node:path').join(__dirname,'index.html')).href);
 const p=page.locator('[data-player="0"]');await p.locator('[data-action="test-dark-room-light"]').click();
 assert.equal(await p.locator('[data-role="darkness"]').isVisible(),false);
 await page.locator('[data-layout="toggle"]').click();
 const box=p.locator('.layout-box').filter({hasText:'Dark-room hatch'});const before=await p.locator('.dark-wall-hatch').boundingBox();
 await box.hover({position:{x:80,y:80}});await page.mouse.down();await page.mouse.move(before.x+110,before.y+100,{steps:5});await page.mouse.up();
 const handle=box.locator('.layout-resize');await handle.hover();await page.mouse.down();await page.mouse.move((await handle.boundingBox()).x+48,(await handle.boundingBox()).y+38,{steps:5});await page.mouse.up();
 await page.locator('[data-layout="save"]').click();await page.locator('[data-layout="toggle"]').click();
 const after=await p.locator('.dark-wall-hatch').boundingBox();assert.ok(after.x>before.x+20);assert.ok(after.width>before.width+25);
 await page.reload();const restored=await p.locator('.dark-wall-hatch').boundingBox();assert.ok(Math.abs(restored.width-after.width)<2);
 await p.locator('[data-action="test-dark-room-light"]').click();assert.equal(await p.locator('[data-role="darkness"]').isVisible(),true);
 await page.locator('[data-layout="toggle"]').click();assert.equal(await p.locator('[data-role="darkness"]').isVisible(),false);
 await browser.close();console.log('PASS: bright test room, hatch drag/resize, saved layout reload and automatic editor lighting.');
})().catch(e=>{console.error(e);process.exit(1)});
