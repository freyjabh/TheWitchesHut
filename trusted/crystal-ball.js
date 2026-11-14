/* Shared crystal ball. Legacy storage and layout keys preserve existing saves. */
(() => {
  'use strict';
  const storageKey='witches-hut-reginald-v1';
  let found=false;
  try{found=JSON.parse(localStorage.getItem(storageKey)||'{}').found===true;}catch{}
  const art='Grafik/1_kristallkula.png';
  const root=document.querySelector('#players');
  const style=document.createElement('style');
  style.textContent=`
    .crystal-pickup{position:absolute;left:64%;top:-45%;width:26%;height:95%;z-index:5;padding:0;border:0;background:transparent;filter:drop-shadow(1px 3px 2px #30201099)}
    .crystal-pickup:hover:not(:disabled){background:transparent;filter:brightness(1.12) drop-shadow(1px 3px 2px #30201099)}
    .crystal-pickup img,.crystal-companion img{width:100%;height:100%;object-fit:contain;pointer-events:none}
    .crystal-home{margin-top:12px;text-align:center}
    .crystal-companion{display:flex;flex-direction:column;align-items:center;gap:4px;width:100%;padding:6px;border:0;background:transparent;font:14px Georgia,serif}
    .crystal-companion img{width:90px;height:130px}
    .crystal-dialog{position:absolute;inset:0;z-index:180;display:grid;place-items:center;padding:5%;background:#080807d9}
    .crystal-dialog article{max-width:440px;max-height:100%;overflow:auto;padding:20px;background:#e0d1ae;color:#302719;border:3px solid #887149;box-shadow:0 8px 25px #0008;font:16px/1.5 Georgia,serif;text-align:center}
    .crystal-dialog h3{margin:0 0 10px}.crystal-dialog button{margin-top:8px}
  `;
  document.head.append(style);
  function render(i){
    const panel=root.querySelector(`[data-player="${i}"]`),p=state.players[i];
    panel.querySelectorAll('.crystal-pickup').forEach(el=>el.remove());
    let home=panel.querySelector('.crystal-home');
    if(found&&!home){
      home=document.createElement('div');home.className='crystal-home';
      home.innerHTML=`<button type="button" class="crystal-companion" data-crystal="talk" aria-label="Ask the crystal ball"><img src="${art}" alt="Crystal ball"><span>Crystal ball</span></button>`;
      const notes=panel.querySelector('.notes-panel');notes.append(home);
    }else if(!found&&home)home.remove();
    if(!found&&p.wall===2&&!p.inBackRoom&&!p.testDark&&!panel.querySelector('.memory-scene,.memory-test')){
      const table=panel.querySelector('.center-table');
      if(table)table.insertAdjacentHTML('beforeend',`<button type="button" class="crystal-pickup" data-layout-id="sir-reginald" data-crystal="take" aria-label="Pick up the crystal ball"><img src="${art}" alt="Crystal ball beside the notepad"></button>`);
    }
    window.refreshMemoryLayout?.();
  }
  function talk(i,introduction=false){
    if(window.openCrystalBallHints){window.openCrystalBallHints(i,introduction);return;}
    const scene=root.querySelector(`[data-player="${i}"] .scene`);
    scene.querySelector('.crystal-dialog')?.remove();
    const dialog=document.createElement('div');dialog.className='crystal-dialog';
    dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-label','Crystal ball');
    dialog.innerHTML=`<article><h3>Crystal ball</h3><p>${introduction?'Gaze into the crystal ball when you need a hint.':'The crystal ball waits to reveal a vision.'}</p><button type="button" data-crystal="close">Close</button></article>`;
    scene.append(dialog);dialog.querySelector('button').focus();
  }
  window.renderCrystalBall=render;
  window.addEventListener('click',event=>{
    const button=event.target.closest('[data-crystal]');if(!button)return;
    if(document.body.classList.contains('layout-editing'))return;
    event.preventDefault();event.stopImmediatePropagation();
    const i=Number(button.closest('.player').dataset.player);
    if(button.dataset.crystal==='take'){
      if(found)return;
      found=true;localStorage.setItem(storageKey,JSON.stringify({found:true}));
      [0,1].forEach(render);talk(i,true);
    }else if(button.dataset.crystal==='talk')talk(i);
    else{button.closest('.crystal-dialog').remove();root.querySelector(`[data-player="${i}"] .crystal-companion`)?.focus();}
  },true);
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape')root.querySelectorAll('.crystal-dialog').forEach(el=>el.remove());
  });
  document.querySelector('#reset-game').addEventListener('click',()=>{
    found=false;localStorage.removeItem(storageKey);
    root.querySelectorAll('.crystal-dialog').forEach(el=>el.remove());
    queueMicrotask(()=>[0,1].forEach(render));
  });
  [0,1].forEach(render);
})();
