// Pointer dragging shares the same item-use rules as clicking. Nothing is lost on an invalid drop.
(() => {
 const root=document.querySelector('#players');let drag=null,dropPoint=null,replaying=false;
 const slots='[data-inventory-item],[data-memory="select-memory-item"],.lantern-slot';
 const click=(el,x,y)=>{replaying=true;try{if(el)el.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,clientX:x,clientY:y}));}finally{replaying=false;}};
 window.addEventListener('click',e=>{if(replaying||!dropPoint)return;const p=dropPoint;dropPoint=null;if(Date.now()<p.until&&Math.hypot(e.clientX-p.x,e.clientY-p.y)<5){e.preventDefault();e.stopImmediatePropagation();}},true);
 root.addEventListener('pointerdown',e=>{
  if(e.button!==0||document.body.classList.contains('layout-editing'))return;
  const slot=e.target.closest(slots);if(!slot)return;
  const player=slot.closest('.player');
  e.preventDefault();window.hutInventoryDrag=true;
  drag={id:e.pointerId,x:e.clientX,y:e.clientY,slot,player,item:slot.dataset.inventoryItem,memory:slot.dataset.memory==='select-memory-item',active:false};
 });
 window.addEventListener('pointermove',e=>{
  if(!drag||e.pointerId!==drag.id)return;
  if(!drag.active&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<6)return;
  if(!drag.active){drag.active=true;drag.ghost=document.createElement('img');drag.ghost.className='inventory-drag-ghost';drag.ghost.src=drag.slot.querySelector('img')?.src||'';document.body.append(drag.ghost);document.body.classList.add('inventory-dragging');}
  e.preventDefault();drag.ghost.style.left=`${e.clientX-32}px`;drag.ghost.style.top=`${e.clientY-32}px`;
 },{passive:false});
 window.addEventListener('pointerup',e=>{
  if(!drag||e.pointerId!==drag.id)return;const d=drag;drag=null;window.hutInventoryDrag=false;
  d.ghost?.remove();document.body.classList.remove('inventory-dragging');if(!d.active)return;
  e.preventDefault();dropPoint={x:e.clientX,y:e.clientY,until:Date.now()+800};
  const target=document.elementFromPoint(e.clientX,e.clientY);if(target?.closest('.player')!==d.player)return;
  const i=Number(d.player.dataset.player),p=state.players[i];
  if(d.memory){
   const kettle=target.closest('[data-memory="inspect-memory-kettle"]');
   if(!kettle)return;
   // Opening the cauldron clears the selection; select again after opening.
   const id=d.slot.dataset.item;
   if(!kettle.closest('.illness-kettle-modal'))click(kettle,e.clientX,e.clientY);
   const bag=d.player.querySelector(`[data-memory="select-memory-item"][data-item="${CSS.escape(id)}"]`);
   if(bag?.getAttribute('aria-pressed')!=='true'&&!bag?.classList.contains('selected'))click(bag,e.clientX,e.clientY);
   click(d.player.querySelector('.illness-kettle-modal [data-memory="inspect-memory-kettle"]'),e.clientX,e.clientY);return;
  }
  if(!d.item){if(p.lantern&&target.closest('.scene')){p.lightSelected=true;save();drawPlayer(i);}return;}
  if(!p.inventory.includes(d.item))return;
  const modal=window.activeGameOverlay?.(d.player);if(modal&&!modal.contains(target))return;
  p.selectedItem=d.item;
  const bottle=target.closest('[data-inventory-item]');
  if(bottle&&d.item==='ladle'){pourLadleIntoBottle(i,bottle.dataset.inventoryItem);return;}
  const scene=target.closest('.scene');if(!scene)return;
  if(d.item==='caught-fly'&&target.closest('[data-layout-id="trinket-11"],[data-memory="feed-toad"]')){window.useInventoryOnToad?.(i);return;}
  if(d.item==='raven-key'&&target.closest('.small-door')){click(d.player.querySelector('[data-action="unlock-east-door"]'),e.clientX,e.clientY);return;}
  const use=target.closest('[data-action="use-firepit"],[data-action="use-kettle"],[data-action="use-chest"]');
  if(use){if(use.dataset.action==='use-kettle')useKettle(i);else itemAction(i,use.dataset.action);return;}
  if(d.item==='deer-eye'&&target.closest('.deer-eye-socket')){useDeerEye(i,'insert');return;}
  if(d.item==='deer-eye'&&target.closest('[data-layout-id="painting-3"]')){useDeerEye(i,'insert');return;}
  if(d.item==='deer-eye'&&target.closest('.center-table')){
   p.inventory=p.inventory.filter(id=>id!==d.item);p.selectedItem=null;state.eyeOnTable=true;save();drawAll();
   document.querySelectorAll('[data-role="status"]').forEach(el=>el.textContent='The eye has been put down and can be shared.');return;
  }
  if(!target.closest('.desk,[data-memory="combine"],[data-memory="unlock-box"],[data-memory="feed-toad"],[data-action="unlock-east-door"],[data-action="use-deer-eye"]'))return;
  window.hutApplyingDrop=true;
  try{click(target,e.clientX,e.clientY);}finally{window.hutApplyingDrop=false;}
  save();
 },true);
 window.addEventListener('pointercancel',()=>{window.hutInventoryDrag=false;drag?.ghost?.remove();drag=null;document.body.classList.remove('inventory-dragging');});
 window.addEventListener('blur',()=>{window.hutInventoryDrag=false;drag?.ghost?.remove();drag=null;document.body.classList.remove('inventory-dragging');});
})();
