// Each player sees only one vertical half of every digit, on the existing noticeboard paper.
(() => {
 const paper='Grafik/anslagstavla-lapp-akvarell.png';
 const eight='M40 12 C8 12 7 45 40 50 C73 55 72 90 40 90 C8 90 7 55 40 50 C73 45 72 12 40 12';
 const right='M40 12 C72 12 73 45 40 50 C73 55 72 90 40 90';
 const three='M15 12 L40 12 C72 12 73 45 40 50 C73 55 72 90 40 90 L15 90';
 const artwork=i=>`<svg viewBox="0 0 400 120" aria-hidden="true"><defs><clipPath id="half-${i}">${[0,1,2,3].map(n=>`<rect x="${n*100+(i===0?0:36.5)}" y="0" width="${i===0?36.5:43.5}" height="120"/>`).join('')}</clipPath></defs><g clip-path="url(#half-${i})" fill="none" stroke="#38271f" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">${(i===0?[eight,three,three,eight]:[right,right,right,right]).map((d,n)=>`<path transform="translate(${n*100} 8)" d="${d}"/>`).join('')}</g></svg>`;
 const style=document.createElement('style');style.textContent=`
 .cabinet-clue-world,.cabinet-clue-world:hover:not(:disabled){position:absolute;padding:0;border:0;border-radius:0;background:transparent;cursor:pointer;z-index:1;rotate:-9deg}
 .cabinet-clue-world img{width:100%;height:100%;object-fit:fill;pointer-events:none}
 .cabinet-clue-sheet{position:relative;width:85%;aspect-ratio:1786/888;max-height:85%;margin:0}
 .item-image-overlay .cabinet-clue-sheet>img{display:block;width:100%;height:100%;object-fit:fill}
 .cabinet-clue-sheet svg{position:absolute;left:14%;top:21%;width:72%;height:58%;pointer-events:none}
 .cabinet-clue-world:focus-visible{outline:2px solid #ffe6a0}
 `;document.head.append(style);
 const plants=['inredning-krukvaxt-04','inredning-krukvaxt-06-klattervaxt'];
 function render(){
  let added=false;
  for(const i of [0,1]){
   const host=document.querySelector(`[data-player="${i}"]`),decor=host.querySelector('[data-role="decor"]');
   let note=decor.querySelector('.cabinet-clue-world');
   if(state.players[i].wall!==3||state.players[i].inBackRoom||host.querySelector('.scene').classList.contains('memory-room')){note?.remove();continue;}
   const plant=decor.querySelector(`[data-layout-id="${plants[i]}"]`);if(!plant)continue;
   if(!note){added=true;note=document.createElement('button');note.type='button';note.className='cabinet-clue-world';note.dataset.cabinetClue=String(i);note.setAttribute('aria-label','Inspect the paper behind the plant');note.title='Cabinet clue paper — Player '+(i+1);note.innerHTML=`<img src="${paper}" alt="A paper edge behind the plant">`;decor.insertBefore(note,plant);}
   if(plant.style.zIndex!=='2')plant.style.zIndex='2';
   const saved=window.getCabinetClueLayout?.(i);
   if(saved){for(const k of ['left','top','width','height'])note.style[k]=saved[k]+'%';note.style.rotate=(saved.rotation||0)+'deg';continue;}
   const width=Math.max(36,Math.min(58,plant.offsetWidth*.65));
   Object.assign(note.style,{left:(plant.offsetLeft+plant.offsetWidth*(i===0?.10:.72))+'px',top:(plant.offsetTop+plant.offsetHeight*(i===0?.65:.68))+'px',width:width+'px',height:(width*.50)+'px'});
  }
  if(added)window.refreshMemoryLayout?.();
 }
 let frame;const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(render);};
 for(const decor of document.querySelectorAll('[data-role="decor"]'))new MutationObserver(records=>{if(records.some(r=>r.type==='childList'||plants.includes(r.target.dataset?.layoutId)))schedule();}).observe(decor,{childList:true,subtree:true,attributes:true,attributeFilter:['style']});
 window.addEventListener('resize',schedule);
 document.querySelector('#players').addEventListener('click',e=>{
  const note=e.target.closest('[data-cabinet-clue]');if(!note||document.body.classList.contains('layout-editing'))return;
  e.preventDefault();e.stopImmediatePropagation();const i=Number(note.closest('.player').dataset.player),overlay=note.closest('.player').querySelector('.item-image-overlay');
  overlay.dataset.mode='cabinet-clue';overlay.innerHTML=`<figure class="cabinet-clue-sheet" aria-label="A paper with ${i===0?'left':'right'} halves of four ink marks"><img src="${paper}" alt="Old paper with incomplete ink marks">${artwork(i)}</figure>`;overlay.hidden=false;
 },true);
 schedule();
})();
