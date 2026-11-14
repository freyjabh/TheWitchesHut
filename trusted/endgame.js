/* First playable layout for Tell My Story; wording can be replaced independently. */
(() => {
  const key='witches-hut-endgame-v1',root=document.querySelector('#players');
  const words=[['siblings','two younger siblings'],['healing','healing'],['inge','Inge'],['married','married'],['innocent','innocent'],['after','after'],['before','before'],['guilty','guilty']];
  words.sort((a,b)=>['married','before','siblings','innocent','inge','guilty','healing','after'].indexOf(a[0])-['married','before','siblings','innocent','inge','guilty','healing','after'].indexOf(b[0]));
  const names=Object.fromEntries(words),answers=['siblings','healing','inge','married','innocent','after'];
  let saved;try{saved=JSON.parse(localStorage.getItem(key)||'null');}catch{}
  let slots=Array.from({length:6},(_,n)=>names[saved?.slots?.[n]]?saved.slots[n]:null);
  slots=slots.map((word,n)=>word&&slots.indexOf(word)===n?word:null);
  const opened=[false,false],selected=[null,null];let drag=null,feedback='';
  const store=()=>localStorage.setItem(key,JSON.stringify({slots}));
  const solved=()=>slots.every((word,n)=>word===answers[n]);
  function blank(n){return `<button type="button" class="story-gap ${slots[n]?'is-filled':''}" data-story="gap" data-gap="${n}" aria-label="Story gap ${n+1}${slots[n]?': '+names[slots[n]]:''}">${slots[n]?names[slots[n]]:'<span>········</span>'}</button>`;}
  function render(){
    for(let i=0;i<2;i++){
      const host=root.querySelector(`[data-player="${i}"]`);
      let overlay=host.querySelector('.endgame-overlay');
      if(!opened[i]){overlay?.remove();continue;}
      if(!overlay){overlay=document.createElement('section');overlay.className='endgame-overlay';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Tell My Story');host.querySelector('.scene').append(overlay);}
      overlay.innerHTML=`<div class="story-paper"><header><span class="story-eyebrow">The words you remember</span><button type="button" data-story="close" aria-label="Close story">×</button></header><h2>Tell My Story</h2><div class="story-rule"></div><article class="story-text"><p>I cared for my ${blank(0)}. When illness came to our home, I began to learn the art of ${blank(1)}.</p><p>I fell in love with ${blank(2)}, though he was already ${blank(3)}.</p><p>When they first arrested me, I was ${blank(4)}. I turned to dark magic only ${blank(5)} my imprisonment and escape.</p></article><div class="story-word-bank" aria-label="Words for the story">${words.filter(([id])=>!slots.includes(id)).map(([id,label])=>`<button type="button" class="story-word ${selected[i]===id?'is-selected':''}" data-story="word" data-word="${id}" aria-pressed="${selected[i]===id}">${label}</button>`).join('')}</div><footer><p class="story-instruction">Drag words into the letter, or select a word and then a gap.</p><div class="story-actions"><button type="button" data-story="clear">Start again</button><button type="button" data-story="check">Read our story</button></div><p class="story-feedback" role="status">${feedback}</p></footer></div>`;
    }
  }
  function put(word,n){
    if(!names[word]||!Number.isInteger(n)||n<0||n>=6)return;
    slots=slots.map(w=>w===word?null:w);slots[n]=word;selected.fill(null);feedback='';store();render();
  }
  window.openEndgame=i=>{if(i!==0&&i!==1)return;opened[i]=true;feedback='';render();};
  window.addEventListener('click',e=>{
    const b=e.target.closest('[data-story]');if(!b)return;
    const i=Number(b.closest('.player').dataset.player),a=b.dataset.story;
    e.preventDefault();e.stopImmediatePropagation();
    if(a==='open')opened[i]=true;
    if(a==='close')opened[i]=false;
    if(a==='word')selected[i]=b.dataset.word;
    if(a==='gap'){const n=Number(b.dataset.gap);if(selected[i]){put(selected[i],n);return;}if(slots[n]){slots[n]=null;feedback='';store();}}
    if(a==='clear'){slots.fill(null);selected.fill(null);feedback='';store();}
    if(a==='check')feedback=slots.some(w=>!w)?'Some words are still missing.':solved()?'At last, my story is remembered.':'That is not quite my story. Remember what you saw together.';
    render();
  },true);
  function cancel(){drag?.ghost.remove();drag=null;}
  window.addEventListener('pointerdown',e=>{
    const b=e.target.closest('.story-word,.story-gap.is-filled');if(!b||e.button!==0)return;
    const word=b.dataset.word||slots[Number(b.dataset.gap)];if(!word)return;
    e.preventDefault();e.stopImmediatePropagation();cancel();
    const ghost=document.createElement('div');ghost.className='story-drag-ghost';ghost.textContent=names[word];document.body.append(ghost);
    drag={word,id:e.pointerId,x:e.clientX,y:e.clientY,moved:false,ghost,i:Number(b.closest('.player').dataset.player)};
    ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';b.setPointerCapture(e.pointerId);
  },true);
  window.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;e.preventDefault();drag.moved||=Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>5;drag.ghost.style.left=e.clientX+'px';drag.ghost.style.top=e.clientY+'px';},{passive:false});
  window.addEventListener('pointerup',e=>{
    if(!drag||drag.id!==e.pointerId)return;const d=drag;cancel();if(!d.moved)return;
    e.preventDefault();const gap=document.elementFromPoint(e.clientX,e.clientY)?.closest('.story-gap');
    if(gap&&Number(gap.closest('.player').dataset.player)===d.i)put(d.word,Number(gap.dataset.gap));
  },true);
  window.addEventListener('pointercancel',cancel);window.addEventListener('blur',cancel);
  window.addEventListener('keydown',e=>{if(e.key!=='Escape')return;const i=Number(e.target.closest('.player')?.dataset.player);if(opened[i]){opened[i]=false;cancel();render();}});
  document.querySelector('#reset-game').addEventListener('click',()=>{cancel();slots.fill(null);opened.fill(false);selected.fill(null);feedback='';localStorage.removeItem(key);render();});
  for(const host of root.querySelectorAll('.player')){const b=document.createElement('button');b.type='button';b.dataset.story='open';b.textContent='Test: endgame';host.querySelector('.test-tools').append(b);}
})();
