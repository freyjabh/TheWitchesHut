// Seat the visible artwork on the cabinet, rather than its transparent image box.
(() => {
 const style=document.createElement('style');style.textContent=`
 .cabinet-contact-shadow{position:absolute;z-index:3;border-radius:50%;background:radial-gradient(ellipse,#21140db3, #21140d55 45%,transparent 74%);pointer-events:none}
 .trinket.cabinet-resting{filter:drop-shadow(0 1px .6px #21140d66)}
 `;document.head.append(style);
 window.groundCabinetObjects=()=>{
  if(document.body.classList.contains('layout-editing'))return;
  for(const host of document.querySelectorAll('.player')){
   const decor=host.querySelector('[data-role="decor"]'),cabinet=decor.querySelector('.herb-cabinet');if(!cabinet)continue;
   const scene=host.querySelector('.scene'),c=cabinet.getBoundingClientRect(),d=scene.getBoundingClientRect();if(!d.width||!d.height)continue;
   const scale=Math.min(c.width/1351,c.height/1164),surface=c.top+(c.height-1164*scale)/2+1164*scale*.045;
   const sx=d.width/scene.offsetWidth,sy=d.height/scene.offsetHeight;
   for(const id of ['trinket-12','trinket-15']){
    const item=decor.querySelector(`[data-layout-id="${id}"]`);if(!item?.complete||!item.naturalWidth)continue;
    const r=visibleImageRect(item),center=r.left+r.width/2;
    let shadow=decor.querySelector(`[data-cabinet-shadow="${id}"]`);
    if(center<c.left||center>c.right||Math.abs(r.top+r.height-surface)>c.height*.35){shadow?.remove();item.classList.remove('cabinet-resting');continue;}
    if(!window.isCabinetObjectManual?.(id)){item.style.top=(parseFloat(getComputedStyle(item).top)+(surface-r.top-r.height)/sy)+'px';item.style.bottom='auto';}
    item.classList.add('cabinet-resting');
    if(!shadow){shadow=document.createElement('span');shadow.className='cabinet-contact-shadow';shadow.dataset.cabinetShadow=id;shadow.setAttribute('aria-hidden','true');decor.insertBefore(shadow,item);}
    Object.assign(shadow.style,{left:((r.left+r.width*.12-d.left)/sx-scene.clientLeft)+'px',top:((surface-1-d.top)/sy-scene.clientTop)+'px',width:(r.width*.76/sx)+'px',height:(Math.max(3,r.width*.10)/sy)+'px'});
   }
  }
 };
 document.querySelector('#players').addEventListener('load',e=>{if(e.target.matches('[data-layout-id="trinket-12"],[data-layout-id="trinket-15"]'))requestAnimationFrame(()=>window.refreshMemoryLayout?.());},true);
 window.refreshMemoryLayout?.();
})();
