const {chromium}=require('./SPELET-USB/runtime/node_modules/playwright');
const assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url'),{spawn}=require('node:child_process');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 let server;
 try{
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(pathToFileURL(path.join(__dirname,'SPELET-USB/SPELET.html')).href);
  await page.waitForTimeout(1000);
  assert.equal(await page.locator('.player').count(),2);
  assert.equal(await page.locator('.layout-toolbar').count(),0);
  assert.equal(await page.locator('.test-tools:visible').count(),0);
  const before=await page.locator('[data-player="0"] [data-role="wall-name"]').textContent();
  await page.locator('[data-player="0"] [data-action="right"]').click();
  assert.notEqual(await page.locator('[data-player="0"] [data-role="wall-name"]').textContent(),before);
  await page.locator('[data-player="0"] .player-settings-button').click();
  assert(await page.locator('dialog[open]').isVisible());
  await page.locator('[data-settings-done]').click();
  const broken=await page.evaluate(()=>[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src));
  assert.deepEqual(broken,[]);assert.deepEqual(errors,[]);
  console.log('PASS: offline startup, two views, navigation, settings, images, no editor or visible test controls.');
  let output='';server=spawn(path.join(__dirname,'SPELET-USB/runtime/node.exe'),['lan-server.cjs'],{cwd:path.join(__dirname,'SPELET-USB'),env:{...process.env,HUT_PORT:'5187'},windowsHide:true});
  server.stdout.on('data',d=>output+=d);server.stderr.on('data',d=>output+=d);
  for(let n=0;n<100&&!output.includes('Spelare 2:');n++)await new Promise(r=>setTimeout(r,200));
  assert(output.includes('Spelare 2:'),output);
  const links=[...output.matchAll(/http:\/\/127\.0\.0\.1:5187\/\?token=[a-f0-9]+&player=[12]/g)].map(m=>m[0]);
  const clients=[];
  for(let i=0;i<2;i++){
   const client=await browser.newPage();clients.push(client);client.on('pageerror',e=>errors.push(e.message));
   await client.goto(links[i]);await client.locator(`.player[data-player="${i}"]`).waitFor();
   assert.equal(await client.locator('.player').count(),1);assert.equal(await client.locator('.test-tools:visible').count(),0);
  }
  const wall=clients.map(c=>c.locator('[data-role="wall-name"]'));
  const old=await wall[0].textContent(),other=await wall[1].textContent();
  await clients[0].locator('[data-action="right"]').click();
  for(let n=0;n<30&&await wall[0].textContent()===old;n++)await clients[0].waitForTimeout(100);
  assert.notEqual(await wall[0].textContent(),old);assert.equal(await wall[1].textContent(),other);
  assert.deepEqual(errors,[]);console.log('PASS: bundled runtime LAN server, two private clients, independent navigation, no script errors.');
 }finally{server?.kill();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
