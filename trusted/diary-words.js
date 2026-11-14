/* Shared words collected from two example diary pages. */
(() => {
  const key='witches-hut-diary-words-v1',root=document.querySelector('#players');
  const labels={mother:'Mother',siblings:'two younger siblings',healing:'healing',home:'home',breathing:'breathing',silence:'silence',sleep:'sleep',morning:'morning',herbs:'herbs',book:'book',rain:'rain',hands:'hands'};
  let saved;try{saved=JSON.parse(localStorage.getItem(key)||'[]');}catch{}
  let collected=Array.isArray(saved)?[...new Set(saved.filter(id=>labels[id]))]:[];
  const pages=[
    ['Beside her bed',`<p>I can hear {{mother}} {{breathing}} from where I sit. I count each breath, afraid of the {{silence}} between them. The room seems colder whenever the fire settles.</p><p>My {{siblings}} keep asking when she will get up. I tell them to {{sleep}}, though I cannot close my own eyes. Someone must stay awake.</p><p>I have folded the blankets and brought fresh water. Such small things, when I wish I could do so much more.</p><p>Perhaps the {{morning}} will be kinder. Until then, I will sit beside her.</p>`],
    ['A little hope',`<p>The wise woman came to our {{home}} today. She brought {{herbs}}, a {{book}}, and the smell of {{rain}} on her coat. I moved a chair nearer the fire for her.</p><p>I watched her {{hands}} as she worked. She never seemed to hurry, even when I could hardly keep still.</p><p>There is so much I do not understand about {{healing}}. I tried to remember everything she said, but some of the names had escaped me by evening.</p><p>I want to learn. If she returns tomorrow, perhaps she will let me help.</p>`]
  ];
  const view=[null,null];
  const store=()=>localStorage.setItem(key,JSON.stringify(collected));
  function word(id){return collected.includes(id)?`<span class="diary-word-taken" title="Saved in the shared envelope">${labels[id]}</span>`:`<button type="button" class="diary-word" data-diary="collect" data-word="${id}" aria-label="Save ${labels[id]} in the envelope">${labels[id]}</button>`;}
  function render(){
    for(let i=0;i<2;i++){
      const host=root.querySelector(`[data-player="${i}"]`),envelope=host.querySelector('.word-envelope');
      if(envelope){envelope.dataset.diary='envelope';envelope.setAttribute('role','button');envelope.tabIndex=0;envelope.setAttribute('aria-label',`Open shared word envelope, ${collected.length} words`);let count=envelope.querySelector('.diary-word-count');if(!count){count=document.createElement('span');count.className='diary-word-count';envelope.append(count);}count.textContent=collected.length?`${collected.length} words`:'';}
      let modal=host.querySelector('.diary-overlay');if(view[i]===null){modal?.remove();continue;}
      if(!modal){modal=document.createElement('section');modal.className='diary-overlay';modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');host.querySelector('.scene').append(modal);}
      const isPage=view[i]==='page';modal.setAttribute('aria-label',isPage?'Diary page':'Shared word envelope');
      modal.innerHTML=`<div class="diary-sheet"><img class="diary-paper" src="Grafik/morse-paper-blank.png" alt=""><div class="diary-ink"><header><span>${isPage?'A page from my diary':'Our collected words'}</span><button type="button" data-diary="close" aria-label="Close diary">×</button></header>${isPage?`<h3>${pages[i][0]}</h3><article>${pages[i][1].replace(/\{\{(\w+)\}\}/g,(_,id)=>word(id))}</article><p class="diary-help">Touch an inked word to keep it in your envelope.</p>`:`<h3>The words we kept</h3><div class="diary-saved-words">${collected.length?collected.map(id=>`<span>${labels[id]}</span>`).join(''):'<p>Words you save from diary pages will appear here.</p>'}</div><p class="diary-help">Shared between you and your companion.</p>`}</div></div>`;
    }
  }
  window.openDiaryPage=i=>{if(i!==0&&i!==1)return;view[i]='page';render();};
  window.getCollectedDiaryWords=()=>[...collected];
  window.addEventListener('click',e=>{
    const b=e.target.closest('[data-diary]');if(!b)return;const i=Number(b.closest('.player').dataset.player);
    e.preventDefault();e.stopImmediatePropagation();
    if(b.dataset.diary==='page')view[i]='page';
    if(b.dataset.diary==='envelope')view[i]='envelope';
    if(b.dataset.diary==='close')view[i]=null;
    if(b.dataset.diary==='collect'&&view[i]==='page'){
      const id=b.dataset.word;if(labels[id]&&!collected.includes(id)){collected.push(id);store();window.dispatchEvent(new CustomEvent('diary-words-changed'));}
    }
    render();
  },true);
  window.addEventListener('keydown',e=>{const i=Number(e.target.closest('.player')?.dataset.player);if(e.key==='Escape'&&view[i]!=null){view[i]=null;render();}if((e.key==='Enter'||e.key===' ')&&e.target.matches('.word-envelope')){e.preventDefault();view[i]='envelope';render();}});
  const inspect=window.inspectMemoryWallArt;
  window.inspectMemoryWallArt=(layer,kind)=>{if(kind==='paper'){window.openDiaryPage(Number(layer.closest('.player').dataset.player));return;}inspect(layer,kind);};
  document.querySelector('#reset-game').addEventListener('click',()=>{collected=[];view.fill(null);localStorage.removeItem(key);render();});
  for(const host of root.querySelectorAll('.player')){const b=document.createElement('button');b.type='button';b.dataset.diary='page';b.textContent='Test: diary page';host.querySelector('.test-tools').append(b);}
  new MutationObserver(()=>{if([...root.querySelectorAll('.word-envelope')].some(e=>!e.dataset.diary))render();}).observe(root,{childList:true,subtree:true});
  render();
})();
