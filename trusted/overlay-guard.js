// Register before game listeners so modal backgrounds never receive input.
(() => {
 const selector='.diary-overlay,.endgame-overlay,.shared-puzzle-overlay,.player-cover,.memory-modal,.morse-overlay,.crystal-dialog,.echo-dialog';
 const visible=el=>!el.hidden&&el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden';
 const level=el=>{let z=0;for(let node=el;node&&!node.classList.contains('player');node=node.parentElement)z+=Number.parseInt(getComputedStyle(node).zIndex)||0;return z;};
 window.activeGameOverlay=player=>{
  if(!player)return null;
  const overlays=[...player.querySelectorAll(selector)].filter(visible);
  return overlays.sort((a,b)=>a.contains(b)?-1:b.contains(a)?1:level(a)-level(b)).at(-1)||null;
 };
 function guard(event){
  if(document.body?.classList.contains('layout-editing')||event.key==='Escape')return;
  const target=event.target;if(!(target instanceof Element))return;
  const settings=document.querySelector('dialog[open]');
  if(!settings&&((event.type==='pointerdown'&&target.closest('[data-inventory-item],[data-memory="select-memory-item"],.lantern-slot'))||(window.hutInventoryDrag&&['pointermove','pointerup','pointercancel'].includes(event.type))))return;
  if(!settings&&target.closest('.notes-panel,[data-action="toggle-notes"]'))return;
  const modal=settings||window.activeGameOverlay(target.closest('.player'));
  if(!modal||modal.contains(target))return;
  // The kettle uses its own memory bag; all room objects remain blocked.
  if(modal.classList.contains('illness-kettle-modal')&&target.closest('[data-memory="select-memory-item"]')&&target.closest('.player')===modal.closest('.player'))return;
  event.preventDefault();event.stopImmediatePropagation();
 }
 for(const type of ['click','dblclick','pointerdown','pointerup','pointermove','mousedown','mouseup','touchstart','touchend','keydown','keyup','submit'])window.addEventListener(type,guard,{capture:true,passive:false});
})();
