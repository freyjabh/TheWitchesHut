/* Lantern signal and its partner's decoding sheet. */
(() => {
  'use strict';
  const alphabet = {
    A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.',
    G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..',
    M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.',
    S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
    0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-',
    5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.'
  };
  const signalWords = 'FEED THE FROG SOME FLIES'.split(' ');
  const letters = signalWords.flatMap((word, wordIndex) => [...word].map((letter, letterIndex) => ({ letter, wordIndex, letterIndex, wordLength: word.length })));
  let letterPosition = 0;
  const unit = 280;
  const root = document.querySelector('#players');
  const anchor = 'inredning-lykta-03';
  let timer, run = 0;
  const flyTimers = new Map();
  const flyListeners = new Map();
  // Recover flies lost through the former generic inventory drop action once.
  state.players.forEach(p=>{
    if(p.flyDropRecoveryVersion===2)return;
    if(p.morseFlyCaught&&!p.toadFed&&!p.inventory.includes('caught-fly')){
      if(p.inventory.length+(p.lantern?1:0)<10)p.inventory.push('caught-fly');
      else p.morseFlyCaught=false;
    }
    p.flyDropRecoveryVersion=2;
  });
  save();
  const style = document.createElement('style');
  style.textContent = `
    .room-furnishing[data-action="inspect-morse"]{pointer-events:auto;cursor:pointer;z-index:3}
    .morse-overlay{position:absolute;inset:0;z-index:115;display:grid;place-items:center;padding:2%;background:#0b0a08ed}
    .morse-close{position:absolute;right:8px;top:8px;z-index:2;font-size:1.1rem}
    .morse-lantern-view{position:absolute;inset:7% 5%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px}
    .morse-lantern-view h3{margin:0;color:#dfcba1;font:clamp(12px,2vw,20px) Georgia,serif}
    .morse-lantern{position:relative;flex:1;min-height:0;width:40%;isolation:isolate}
    .morse-navigation{display:flex;align-items:center;justify-content:center;gap:12px}
    .morse-position{text-align:center;min-width:150px;color:#dfcba1;font-size:clamp(10px,1.3vw,14px)}
    .morse-lantern img{width:100%;height:100%;object-fit:contain;filter:brightness(.35);transition:filter 40ms linear}
    .morse-lantern::after{content:'';position:absolute;inset:18% 8%;background:radial-gradient(ellipse,#fffbd6bb, #ffd36955 26%,transparent 68%);opacity:0;pointer-events:none;mix-blend-mode:screen}
    .morse-lantern.is-lit img{filter:brightness(1.9) drop-shadow(0 0 12px #ffd56c)}
    .morse-lantern.is-lit::after{opacity:1}
    .morse-lantern-view p{margin:0;color:#bcb099;font-size:clamp(10px,1.3vw,14px)}
    .morse-paper{display:block;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);height:92%;width:auto;max-width:85%;object-fit:contain;filter:drop-shadow(0 8px 18px #0009)}
    .players>.player{position:relative}
    .morse-fly,.morse-fly:hover:not(:disabled){position:absolute;left:105px;top:8px;width:30px;height:30px;padding:0;border:0;background:transparent;z-index:200;cursor:crosshair;touch-action:manipulation;transition:left 180ms ease-out,top 180ms ease-out}
    .morse-fly img{width:100%;height:100%;object-fit:contain;pointer-events:none;filter:drop-shadow(0 1px 1px #000)}
    .morse-fly::before{content:'';position:absolute;inset:-12px;border-radius:50%;pointer-events:auto}
    .layout-editing .morse-fly::before{display:none}
    .layout-editing .morse-fly{transition:none}
  `;
  document.head.append(style);
  function stopSignal() {
    run++;
    clearTimeout(timer);
    root.querySelector('.morse-lantern')?.classList.remove('is-lit');
  }
  function close() {
    stopSignal();
    flyTimers.forEach(clearTimeout);flyTimers.clear();
    flyListeners.forEach(controller=>controller.abort());flyListeners.clear();
    root.querySelectorAll('.morse-overlay,.morse-fly').forEach(el => el.remove());
    window.refreshMemoryLayout?.();
  }
  function addFly(overlay,i){
    if(state.players[i].morseFlyCaught&&!document.body.classList.contains('layout-editing'))return;
    const fly=document.createElement('button');fly.type='button';fly.className='morse-fly';
    fly.dataset.layoutId=`morse-fly-${i}`;fly.setAttribute('aria-label','Catch the fly');
    fly.innerHTML='<img src="Grafik/1_fluga.png" alt="A small fly">';overlay.append(fly);
    const note=overlay.querySelector('.notes-body:not([hidden]) .notepad-sheet')||overlay.querySelector('.notes-toggle');
    const bounds=overlay.getBoundingClientRect(),noteBounds=note.getBoundingClientRect();
    function landing(target,escape=false){
      const bounds=overlay.getBoundingClientRect(),maxX=overlay.clientWidth-fly.offsetWidth-12,maxY=overlay.clientHeight-fly.offsetHeight-12;
      const blocked=[...overlay.querySelectorAll('button,[role="button"],input,textarea,select,a[href],[contenteditable="true"],[data-inventory-item]')]
        .filter(el=>el!==fly&&el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden').map(el=>el.getBoundingClientRect());
      const safe=(x,y)=>!blocked.some(r=>bounds.left+x-24<r.right&&bounds.left+x+fly.offsetWidth+24>r.left&&bounds.top+y-24<r.bottom&&bounds.top+y+fly.offsetHeight+24>r.top);
      let best=null;
      function consider(x,y){
        x=Math.max(12,Math.min(maxX,x));y=Math.max(12,Math.min(maxY,y));if(!safe(x,y))return;
        const distance=Math.hypot(bounds.left+x+fly.offsetWidth/2-target.x,bounds.top+y+fly.offsetHeight/2-target.y),score=escape?distance:-distance;
        if(!best||score>best.score)best={x,y,score};
      }
      consider(target.x-bounds.left-fly.offsetWidth/2,target.y-bounds.top-fly.offsetHeight/2);
      for(let n=0;n<64;n++)consider(12+Math.random()*Math.max(0,maxX-12),12+Math.random()*Math.max(0,maxY-12));
      for(let y=12;y<=maxY;y+=16)for(let x=12;x<=maxX;x+=16)consider(x,y);
      return best;
    }
    const start=landing({x:noteBounds.left+noteBounds.width*.5,y:noteBounds.top+noteBounds.height*.3});
    if(start){fly.style.left=`${start.x}px`;fly.style.top=`${start.y}px`;}else{fly.remove();return;}
    const controller=new AbortController();flyListeners.set(fly,controller);
    let pointer=null,lastEscape=0;
    overlay.addEventListener('pointermove',event=>{
      if(event.pointerType==='touch'||document.body.classList.contains('layout-editing')||!fly.isConnected)return;
      pointer={x:event.clientX,y:event.clientY};
      const r=fly.getBoundingClientRect(),near=Math.hypot(pointer.x-r.left-r.width/2,pointer.y-r.top-r.height/2)<65;
      if(!near){clearTimeout(flyTimers.get(fly));flyTimers.delete(fly);return;}
      if(flyTimers.has(fly)||performance.now()-lastEscape<500)return;
      flyTimers.set(fly,setTimeout(()=>{
        flyTimers.delete(fly);
        if(!fly.isConnected||document.body.classList.contains('layout-editing'))return;
        const current=fly.getBoundingClientRect();
        if(Math.hypot(pointer.x-current.left-current.width/2,pointer.y-current.top-current.height/2)>=65)return;
        const best=landing(pointer,true);if(!best)return;
        fly.style.left=`${best.x}px`;fly.style.top=`${best.y}px`;lastEscape=performance.now();
      },280));
    },{signal:controller.signal});
    overlay.addEventListener('pointerleave',()=>{clearTimeout(flyTimers.get(fly));flyTimers.delete(fly);},{signal:controller.signal});
    fly.addEventListener('click',event=>{
      if(document.body.classList.contains('layout-editing'))return;
      event.preventDefault();event.stopPropagation();const p=state.players[i];
      if(p.morseFlyCaught)return;
      const status=root.querySelector(`[data-player="${i}"] [data-role="status"]`);
      if(p.inventory.length+(p.lantern?1:0)>=10){status.textContent='Your inventory is full. Make room for the fly.';return;}
      clearTimeout(flyTimers.get(fly));flyTimers.delete(fly);controller.abort();flyListeners.delete(fly);p.morseFlyCaught=true;p.inventory.push('caught-fly');save();fly.remove();drawAll();status.textContent='You caught the fly!';
    });
  }
  function play() {
    stopSignal();
    const current = run;
    const lantern = root.querySelector('.morse-lantern');
    if (!lantern) return;
    const steps = [{ lit: false, time: unit * 3 }];
      [...alphabet[letters[letterPosition].letter]].forEach((mark, index, marks) => {
        steps.push({ lit: true, time: unit * (mark === '.' ? 1 : 3) });
        steps.push({ lit: false, time: unit * (index < marks.length - 1 ? 1 : 7) });
      });
    let cursor = 0;
    function tick() {
      if (current !== run || !lantern.isConnected) return;
      const step = steps[cursor];
      lantern.classList.toggle('is-lit', step.lit);
      cursor = (cursor + 1) % steps.length;
      timer = setTimeout(tick, step.time);
    }
    tick();
  }
  function updatePosition() {
    const current = letters[letterPosition];
    root.querySelectorAll('.morse-position').forEach(el => { el.textContent = `Word ${current.wordIndex + 1} of ${signalWords.length} · Letter ${current.letterIndex + 1} of ${current.wordLength}`; });
    const previous = root.querySelector('[data-morse="previous"]'),next = root.querySelector('[data-morse="next"]');
    if(previous)previous.disabled=letterPosition===0;
    if(next)next.disabled=letterPosition===letters.length-1;
  }
  function show() {
    close();
    state.players.forEach((player, i) => {
      const scene = root.querySelector(`.player[data-player="${i}"] .scene`);
      // Each player opens their own view, without moving the other player's room.
      if (player.wall !== 2 || player.inBackRoom) return;
      const overlay = document.createElement('section');
      overlay.className = 'morse-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-label', i === 0 ? 'Flashing lantern' : 'Morse alphabet');
      overlay.innerHTML = `<button type="button" class="morse-close" data-morse="close" aria-label="Close the Morse puzzle">×</button>` + (i === 0
        ? `<div class="morse-lantern-view"><h3>Listen with your eyes</h3><div class="morse-lantern"><img src="Grafik/inredning-lykta-03.png" alt="A lantern flashing in Morse code"></div><p>The same letter repeats. Use the arrows when you are ready to move on.</p><div class="morse-navigation"><button type="button" data-morse="previous" aria-label="Previous letter">←</button><span class="morse-position" role="status" aria-live="polite"></span><button type="button" data-morse="next" aria-label="Next letter">→</button></div><button type="button" data-morse="replay">Replay this letter</button></div>`
        : `<img class="morse-paper" src="Grafik/morse-paper-handwritten.png" alt="Handwritten Morse alphabet on parchment: ${[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'].map(letter => `${letter}: ${alphabet[letter]}`).join(', ')}">`);
      scene.append(overlay);
      addFly(scene.closest('.player'),i);
    });
    window.refreshMemoryLayout?.();
    updatePosition();play();
  }
  window.addEventListener('click', event => {
    if (document.body.classList.contains('layout-editing')) return;
    const control = event.target.closest('[data-morse]');
    if (control) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const action=control.dataset.morse;
      if(action==='previous'||action==='next'){
        letterPosition=Math.max(0,Math.min(letters.length-1,letterPosition+(action==='next'?1:-1)));
        updatePosition();play();
      }else if (action === 'replay') play(); else close();
      return;
    }
    if (event.target.closest('[data-action="inspect-morse"]')) { event.preventDefault(); event.stopImmediatePropagation(); show(); }
    if (event.target.closest('[data-action="left"], [data-action="right"], [data-action="enter-back-room"], [data-action="enter-dark"]')) close();
  }, true);
  window.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
  document.querySelector('#reset-game').addEventListener('click', () => {letterPosition=0;close();});
  function decorate() {
    root.querySelectorAll(`[data-layout-id="${anchor}"]`).forEach(el => {
      el.dataset.action = 'inspect-morse';
      el.setAttribute('role', 'button');
      el.tabIndex = 0;
      el.setAttribute('aria-label', 'Inspect the Morse lantern');
    });
  }
  new MutationObserver(decorate).observe(root, { childList: true, subtree: true });
  decorate();
})();
