const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
for(const script of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new Function(script[1]);
const block=html.slice(html.indexOf('  const RECIPE='),html.indexOf('  state.players.forEach(p=>{p.inventory='));
function harness(){
  const state={players:[{inventory:[],lantern:false},{inventory:[],lantern:false}],bookUnlocked:true,fireLit:true,brewServings:0};
  const clock={now:0},timers=new Map();let nextTimer=0;
  const catalog={};
  const api=new Function('state','saved','itemCatalog','catalogAdd','document','window','save','drawAll','setTimeout','clearTimeout','Date',block+'return {use:useKettle,recipe:RECIPE,complete:completeBrewForTest,fill:pourLadleIntoBottle};')(
    state,{},catalog,(id,name,description,src)=>catalog[id]={name,description,src},{querySelectorAll:()=>[]},{},()=>{},()=>{},fn=>{timers.set(++nextTimer,fn);return nextTimer;},id=>timers.delete(id),{now:()=>clock.now});
  return {...api,state,clock,timers};
}
{
  const h=harness();h.state.fireLit=false;h.state.players[0].inventory=['flaska-1'];h.state.players[0].selectedItem='flaska-1';h.use(0);assert.equal(h.timers.size,0);
  h.state.fireLit=true;h.state.bookUnlocked=false;h.use(0);assert.equal(h.timers.size,0);
}
{
  const h=harness();h.state.fireLit=false;h.complete();assert.equal(h.state.brewReady,false);assert.equal(h.state.brewServings,0);
  h.state.brewReady=true;h.state.brewServings=2;h.state.players[0].inventory=['ladle','tomflaska-1'];h.state.players[0].selectedItem='ladle';h.use(0);assert(!h.state.ladleCharged);assert.equal(h.state.brewServings,2);
  h.state.ladleCharged=true;assert.equal(h.fill(0,'tomflaska-1'),false);assert(!h.state.players[0].lantern);
}
{
  const h=harness();h.state.players[0].inventory=['flaska-1'];h.state.players[0].selectedItem='flaska-1';h.use(0);
  assert.equal(h.timers.size,1);[...h.timers.values()][0]();assert.equal(h.state.recipeStep,0);assert.deepEqual(h.state.players[0].inventory,['flaska-1']);
}
{
  const h=harness();h.state.players[0].inventory=h.recipe.map(pair=>pair[0]);h.state.players[1].inventory=h.recipe.map(pair=>pair[1]);
  const ingredients=h.state.players.map(p=>[...p.inventory]);
  for(let step=0;step<5;step++){
    for(let player=0;player<2;player++){h.state.players[player].selectedItem=h.recipe[step][player];h.clock.now=step*2000+player*500;h.use(player);}
  }
  assert.equal(h.state.brewReady,true);assert.equal(h.state.recipeStep,5);assert.equal(h.state.brewServings,2);
  h.state.players.forEach((p,i)=>assert.deepEqual(p.inventory,ingredients[i]));
  const p0=h.state.players[0],p1=h.state.players[1];p0.inventory.push('ladle','tomflaska-1');p0.selectedItem='tomflaska-1';h.use(0);assert(!p0.lantern);assert(!h.state.ladleCharged);p0.selectedItem='ladle';h.use(0);assert(h.state.ladleCharged);assert(!p0.lantern);assert(p0.inventory.includes('tomflaska-1'));h.use(0);assert.equal(h.state.brewServings,1);assert(h.fill(0,'tomflaska-1'));
  assert(p0.lantern);assert.equal(p0.lanternBottle,'tomflaska-1');assert(!p0.inventory.includes('tomflaska-1'));assert.equal(h.state.brewServings,1);
  h.use(0);assert.equal(h.state.brewServings,1);
  p0.inventory=p0.inventory.filter(id=>id!=='ladle');p1.inventory.push('ladle','tomflaska-2');p1.selectedItem='ladle';h.use(1);assert(h.state.ladleCharged);assert(!p1.lantern);assert(h.fill(1,'tomflaska-2'));
  assert(p1.lantern);assert.equal(p1.lanternBottle,'tomflaska-2');assert.equal(h.state.brewServings,0);assert(!p1.inventory.includes('tomflaska-2'));
  h.state.players.forEach((p,i)=>ingredients[i].forEach(id=>assert(p.inventory.includes(id))));
}
console.log('PASS: fire/book prerequisites, timeout, ingredient preservation, five paired steps, two lanterns, bottle consumption and ladle reuse.');
{
  const h=harness();h.state.players[0].inventory=['flaska-1'];h.state.players[0].selectedItem='flaska-1';h.use(0);assert.equal(h.timers.size,1);
  h.complete();assert.equal(h.timers.size,0);assert(h.state.brewReady);assert.equal(h.state.recipeStep,5);assert.equal(h.state.brewServings,2);
  assert.deepEqual(h.state.players[0].inventory,['flaska-1']);
  h.state.players[0].lantern=true;h.complete();assert.equal(h.state.brewServings,1);
  h.state.players[1].lantern=true;h.complete();assert.equal(h.state.brewServings,0);
}
console.log('PASS: brew test button cancels pending pours, preserves inventory and respects existing lanterns.');
{
  const h=harness();h.complete();const p=h.state.players[0];p.inventory=['ladle'];p.selectedItem='ladle';h.use(0);assert(!h.state.ladleCharged);assert.equal(h.state.brewServings,2);
  p.inventory.push('tomflaska-1');assert.equal(h.fill(0,'tomflaska-1'),false);assert(!p.lantern);
  p.selectedItem='tomflaska-1';h.use(0);assert(!h.state.ladleCharged);
  p.selectedItem='ladle';h.use(0);assert(h.state.ladleCharged);assert.equal(h.state.brewServings,1);
  p.selectedItem=null;assert.equal(h.fill(0,'tomflaska-1'),false);assert(h.state.ladleCharged);
  p.selectedItem='ladle';assert(h.fill(0,'tomflaska-1'));assert(!h.state.ladleCharged);assert(p.lantern);
}
console.log('PASS: ladle requires bottle, only ladle can scoop, empty ladle cannot fill, and bottle only lights after the second click.');
{
  const state={players:[{inventory:['flaska-1'],selectedItem:'flaska-1',wall:2},{inventory:[],wall:2}],worldDrops:{},cabinetUnlocked:false,fireToolsPlaced:[]};
  const catalog={'flaska-1':{name:'Test bottle',description:'A test bottle.',src:'test.png'}},handlers=[];
  const overlays=[0,1].map(()=>({dataset:{},hidden:true,querySelector:()=>({})}));
  const panels=[0,1].map(i=>({dataset:{player:String(i)},querySelector:()=>overlays[i]}));
  const root={addEventListener:(type,fn)=>{if(type==='click')handlers.push(fn)},querySelector:q=>panels[q.includes('"1"')?1:0],querySelectorAll:()=>[]};
  const doc={querySelector:()=>root,body:{classList:{contains:()=>false}}};
  const inspector=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].find(m=>m[1].includes('function inspect(index,id,inInventory)'))[1];
  new Function('document','state','itemCatalog','fireToolArt','escapeHtml','save','drawAll','drawPlayer','itemAction','showChestContents',inspector)(doc,state,catalog,{},String,()=>{},()=>{},()=>{},()=>{},()=>{});
  const click=(index,action)=>handlers[0]({target:{closest:q=>q==='.player'?panels[index]:q==='[data-inspect-action]'?{dataset:{inspectAction:action,inspectId:'flaska-1'}}:null},preventDefault(){},stopImmediatePropagation(){}});
  click(0,'drop');assert.equal(state.players[0].inventory.length,0);assert(!state.worldDrops['flaska-1']);
  click(1,'take');assert.deepEqual(state.players[1].inventory,['flaska-1']);assert(!state.worldDrops['flaska-1']);
  assert.equal(state.players[0].selectedItem,null);
}
console.log('PASS: Put down frees inventory, restores original placement instead of a floor drop, and lets the other player take the unique ingredient.');
