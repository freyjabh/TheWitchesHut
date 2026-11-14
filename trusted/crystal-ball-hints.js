/* Voluntary hints. Discoveries are shared; hint levels and puzzle checks are private. */
(() => {
  'use strict';
  const key='witches-hut-reginald-hints-v1',root=document.querySelector('#players');
  let discoveries=[],levels=[{},{}];
  try{const saved=JSON.parse(localStorage.getItem(key)||'{}');discoveries=Array.isArray(saved.discoveries)?saved.discoveries:[];levels=Array.isArray(saved.levels)&&saved.levels.length===2?saved.levels:[{},{}];}catch{}
  const selected=[null,null],data=window.CRYSTAL_BALL_HINTS;
  const topics=[['drawer','The writing desk',0],['jar','The red jar',1],['north-box','The north box',2],['chest','The chest',3],['deer','The deer painting',4],['fire','The fire bowl',6],['cabinet','The herb cabinet',7],['book','The spellbook',8],['brew','The cauldron',9],['raven','The raven painting',11],['door','The east door',12],['hatch','The dark-room hatch',13],['board','The noticeboard',14],['fox','The fox painting',15],['hand','The handprint',16],['echo','The tree painting',17],['east-box','The east box',18],['morse','The signalling lantern',19],['toad','The toad',21],['light','The skull and mirrors',22],['memories','Memory fragments',24]];
  const any=test=>state.players.some(test);
  topics.splice(topics.findIndex(t=>t[0]==='toad'),0,['fly','The fly',20]);
  const persist=()=>localStorage.setItem(key,JSON.stringify({discoveries,levels}));
  function mark(...ids){let changed=false;for(const id of ids)if(!discoveries.includes(id)){discoveries.push(id);changed=true;}if(changed)persist();}
  function memories(){try{return JSON.parse(localStorage.getItem('witches-hut-memories-v1')||'{}');}catch{return {};}}
  function collected(n,i){const m=memories(),id=`memory-${n}-${i}`;return m.completed?.includes(n)||m.desk?.includes(id)||state.players[i].inventory.includes(id);}
  function infer(){
    if(state.found)mark('book');if(state.bookUnlocked||state.recipeStep>0)mark('brew');
    if(state.cabinetUnlocked)mark('cabinet');if(state.fireLit||state.woodPlaced)mark('fire');
    if(state.eastDoorOpen)mark('door','raven');if(any(p=>p.chestUnlocked))mark('chest');
    if(any(p=>p.memoryDrawerOpen))mark('drawer');if(any(p=>p.memoryJarOpen))mark('jar');
    if(any(p=>p.memoryBoxOpen))mark('north-box');if(any(p=>p.deerOpen)||state.deerEyeOwner!==null)mark('deer');
    if(any(p=>p.southBoxOpen||p.noticeboardFlips?.length))mark('board');
    if(any(p=>p.foxSolved||p.foxInput?.length))mark('fox');if(any(p=>p.foxSolved))mark('hand');
    if(any(p=>p.echoSolved))mark('echo');if(any(p=>p.eastBoxOpen))mark('east-box');
    if(any(p=>p.morseFlyCaught))mark('morse','fly');if(any(p=>p.toadFed))mark('toad');
    if(any(p=>p.lightAwake||p.lightSolved))mark('light');if(any(p=>p.inBackRoom||p.darkHatchOpen))mark('hatch');
    const m=memories();if(m.completed?.length||m.desk?.length||any(p=>p.inventory.some(id=>id.startsWith('memory-'))))mark('memories');
  }
  const done='That thread of fate is already woven. Must I divine your own accomplishments for you as well?';
  const reward='The veil has parted. Take your glowing fragment, little fool; it will not crawl into your pocket.';
  function help(topic,i){
    const p=state.players[i],other=1-i;let row=topics.find(t=>t[0]===topic)?.[2],text=null,stage='';
    const memoryFor={drawer:0,'north-box':1,hatch:2,deer:3,fox:4,echo:5,'east-box':6,toad:7,light:8};
    const solved={drawer:p.memoryDrawerOpen,'north-box':p.memoryBoxOpen,hatch:state.players[0].darkHatchOpen,deer:state.deerEyeOwner===i&&p.deerOpen,fox:p.foxSolved,echo:p.echoSolved,'east-box':any(q=>q.eastBoxOpen),toad:p.toadFed,light:p.lightSolved};
    if(topic in memoryFor){const n=memoryFor[topic];
      if(collected(n,i)){text=done;stage='collected';if(topic==='deer'&&!collected(n,other)){text=null;row=5;stage='share-eye';}}
      else if(solved[topic]){text=reward;stage='reward';}
    }
    if(topic==='jar'&&(p.memoryBoxOpen||p.inventory.includes(`north-box-key-${i}`))){text='The key has already answered your summons, or served its purpose. Its fate belongs to the north-wall box, you forgetful little shade.';stage='key-taken';}
    if(topic==='chest'&&p.chestUnlocked){text=i===0?'Your chest is open. Take the wood if it remains, then pass the iron key to your companion. The embers will not feed themselves.':'Your chest is open. Take the enchanted eye if it remains, then pass the iron key to your companion. Another soul still waits for sight.';stage='open';}
    if(topic==='fire'&&state.fireLit||topic==='cabinet'&&state.cabinetUnlocked||topic==='book'&&state.bookUnlocked||topic==='raven'&&state.eastDoorOpen||topic==='board'&&any(q=>q.southBoxOpen)){text=done;stage='done';}
    if(topic==='brew'){
      if(p.lantern){text=done;stage='lantern';}
      else if(state.brewReady){row=10;stage=state.ladleCharged?'charged':'fill';if(state.ladleCharged)text='The ladle is already full. Select it and click an empty bottle in your inventory. Pour the captured glow before your thoughts wander into the mist again.';}
      else if(!state.fireLit){row=6;stage='needs-fire';}
      else if(!state.bookUnlocked){row=8;stage='needs-book';}
      else stage=`recipe-${state.recipeStep}`;
    }
    if(topic==='door'&&p.lantern&&state.eastDoorOpen){text='Use your lantern in the back room. Compare what the shadows reveal to each of you. Two sets of eyes might yet compensate for those dim little minds.';stage='search';}
    if(topic==='morse'&&p.morseFlyCaught){text='The fly is caught. Read the message you drew from the lantern: it foretells who shall dine, my inattentive little moth.';stage='caught';}
    if(topic==='fly'&&p.morseFlyCaught){text='Your winged offering is already caught. Select the fly and give it to the toad in its close-up. Even its tiny fate has more direction than yours.';stage='caught';}
    if(topic==='light'&&!text&&any(q=>q.lightAwake)){row=23;stage='mirrors';}
    if(topic==='fox'&&!p.foxSolved&&!any(q=>q.southBoxOpen)){row=14;stage='needs-note';}
    if(topic==='memories'&&memories().completed?.length===9){text='All nine memories are whole. The mist yields her past at last. How vexing: I foresaw rather less competence from you.';stage='complete';}
    if(topic==='inventory'){text='Ten possessions cling to you like hungry ghosts. Use Put down on an item that permits it; your companion may take it. The fly stays with you until fed to the toad.';stage='inventory';}
    const hints=topic==='explore'?['The mist shows many paths, and you standing quite uselessly between them. Inspect the room, little lost soul.','Drawers, lids and paintings conceal more than dust. Disturb them. I promise the furniture is not judging you as harshly as I am.','Begin at the north-wall writing desk and try its left drawer. Compare what each of you sees, and inspect objects before taking them.']:text?[text,text,text]:data[row]?.hints;
    return {key:`${topic}:${stage||row}`,hints:hints||[done,done,done],single:!!text};
  }
  const style=document.createElement('style');style.textContent=`
    .crystal-dialog{padding:3%;background:#080b14ed}
    .crystal-dialog article{width:100%;height:100%;max-width:none;max-height:none;display:flex;align-items:center;justify-content:center;gap:2%;box-sizing:border-box;padding:0;border:0;background:transparent;box-shadow:none;color:#e6edee;font-size:clamp(11px,1.2vw,15px);line-height:1.4;overflow:hidden}
    .crystal-ball-view{position:relative;width:70%;height:100%;flex-shrink:1;min-width:0}
    .crystal-ball-view>img{display:block;width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 0 15px #79bce244);pointer-events:none}
    .crystal-words{position:absolute;display:flex;align-items:center;justify-content:center;text-align:center;color:#edffff;font-family:Georgia,serif;line-height:1.45;text-shadow:0 0 3px #fff,0 0 9px #9fe7ff,0 0 20px #67bfff;animation:crystal-reveal 1.2s ease-out both}
    .crystal-words p{margin:0;min-height:0}
    .crystal-menu{width:28%;max-height:100%;overflow:auto;flex-shrink:0;padding:4px;box-sizing:border-box}
    .crystal-menu h3{font:18px Georgia,serif;color:#d8efff}.crystal-menu h4{margin:8px 0}
    .crystal-topics{display:grid;grid-template-columns:1fr;gap:4px}.crystal-topics button{margin:0!important;padding:5px;font-size:inherit}
    .crystal-controls{display:flex;justify-content:center;gap:8px;flex-wrap:wrap}.crystal-hint{min-height:3em}.crystal-level{font-size:.8em}
    @keyframes crystal-reveal{from{opacity:0;filter:blur(5px)}to{opacity:1;filter:blur(0)}}
    @media(prefers-reduced-motion:reduce){.crystal-words{animation:none}}
  `;document.head.append(style);
  const panel=i=>root.querySelector(`.player[data-player="${i}"]`);
  const button=(action,label,extra='')=>`<button type="button" data-crystal-hint="${action}" ${extra}>${label}</button>`;
  function open(i,intro=false){
    infer();panel(i).querySelector('.crystal-dialog')?.remove();
    const dialog=document.createElement('div');dialog.className='crystal-dialog';dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-label','Crystal ball');
    let content='',words='Choose the shadow that troubles you, little fool. Let us see what your eyes have failed to notice.';const topic=selected[i];
    if(intro){words='Ah, another lost little soul. Gaze into my depths when the path eludes you. I shall reveal your fate, though I make no promises for your dignity.';content=button('menu','Seek a vision');}
    else if(topic){
      const hint=help(topic,i),level=Math.max(0,Math.min(2,Number(levels[i][hint.key])||0));
      const title=topics.find(t=>t[0]===topic)?.[1]||(topic==='explore'?'Where should we begin?':'My inventory is full');
      content=`<h4>${title}</h4>${hint.single?'':`<p class="crystal-level">Hint ${level+1} of 3</p>`}<div class="crystal-controls">${button('menu','Back')}${!hint.single&&level<2?button('next','Another hint'):''}</div>`;
      words=hint.hints[level];
    }else{
      content='<div class="crystal-topics">'+button('choose','Where should we begin?','data-topic="explore"')+button('choose','My inventory is full','data-topic="inventory"')+topics.filter(t=>discoveries.includes(t[0])).map(t=>button('choose',t[1],`data-topic="${t[0]}"`)).join('')+'</div>';
    }
    dialog.innerHTML=`<article><div class="crystal-ball-view"><img src="Grafik/1_kristallkula.png" alt="Crystal ball"><div class="crystal-words"><p class="crystal-hint" aria-live="polite"></p></div></div><aside class="crystal-menu"><h3>Crystal ball</h3>${content}<div class="crystal-controls">${button('close','Close')}</div></aside></article>`;
    dialog.querySelector('.crystal-hint').textContent=words;
    panel(i).querySelector('.scene').append(dialog);fit(dialog);dialog.querySelector('img').addEventListener('load',()=>fit(dialog));dialog.querySelector('button').focus();
  }
  function fit(dialog){
    const image=dialog.querySelector('.crystal-ball-view>img'),area=dialog.querySelector('.crystal-words');if(!image?.complete||!image.naturalWidth)return;
    const r=visibleImageRect(image),parent=image.parentElement.getBoundingClientRect();
    Object.assign(area.style,{left:`${r.left-parent.left+r.width*.19}px`,top:`${r.top-parent.top+r.height*.20}px`,width:`${r.width*.62}px`,height:`${r.height*.40}px`});
    let size=Math.min(20,Math.max(12,r.width*.047));area.style.fontSize=`${size}px`;
    const text=area.querySelector('p');while(size>9&&(text.scrollHeight>area.clientHeight||text.scrollWidth>area.clientWidth)){size-=.5;area.style.fontSize=`${size}px`;}
  }
  window.addEventListener('resize',()=>root.querySelectorAll('.crystal-dialog').forEach(fit));
  window.openCrystalBallHints=(i,intro=false)=>{selected[i]=null;open(i,intro);};
  // Window capture runs before the game's inspection handlers can stop propagation.
  window.addEventListener('click',event=>{
    if(document.body.classList.contains('layout-editing'))return;
    const player=event.target.closest('.player');if(!player)return;
    const i=Number(player.dataset.player),control=event.target.closest('[data-crystal-hint]');
    if(control){event.preventDefault();event.stopImmediatePropagation();const action=control.dataset.crystalHint;
      if(action==='close'){control.closest('.crystal-dialog').remove();player.querySelector('.crystal-companion')?.focus();return;}
      if(action==='menu')selected[i]=null;
      if(action==='choose')selected[i]=control.dataset.topic;
      if(action==='next'){const hint=help(selected[i],i);levels[i][hint.key]=Math.min(2,(Number(levels[i][hint.key])||0)+1);persist();}
      open(i);return;
    }
    if(event.target.closest('.crystal-dialog,.crystal-home,[data-crystal]'))return;
    const action=event.target.closest('[data-action]')?.dataset.action;
    const map={'pickup-book':'book','open-book':'book','inspect-cabinet-lock':'cabinet','use-chest':'chest','use-firepit':'fire','use-kettle':'brew','inspect-raven':'raven','unlock-east-door':'door','enter-back-room':'door','inspect-noticeboard':'board','inspect-south-box':'board','read-box-note':'fox','echo-puzzle':'echo','inspect-morse':'morse','inspect-held-box':'hand'};
    if(map[action])mark(map[action]);if(action==='inspect-morse')mark('fly');
    const mem=event.target.closest('[data-memory]')?.dataset.memory;
    if(mem==='drawer')mark('drawer');if(mem==='jar-key')mark('jar');if(mem==='unlock-box')mark('north-box');if(mem==='east-box')mark('east-box');
    if(event.target.closest('.dark-wall-hatch,[data-dark-hatch-digit]'))mark('hatch');
    if(event.target.closest('[data-fox-hold]'))mark('hand');if(event.target.closest('[data-echo]'))mark('echo');if(event.target.closest('[data-light]'))mark('light');
    let world=event.target.closest('[data-layout-id]');
    if(!event.target.closest('.item-image-overlay,.inventory,.memory-layer')&&event.target.closest('.scene'))world=worldItemAtPoint(event.target.closest('.scene'),event.clientX,event.clientY)||world;
    const id=event.target.closest('[data-inventory-item]')?.dataset.inventoryItem||event.target.closest('[data-inspect-id]')?.dataset.inspectId||world?.dataset.layoutId;
    const ids={'painting-3':'deer','painting-2':'fox','burk-1':'jar','ask-1':'north-box','ask-2':'east-box','ask-3':'board','trinket-11':'toad','trinket-1':'light','inredning-tavla-03':'echo','inredning-lykta-03':'morse','key-14':'chest','trinket-14':'chest','deer-eye':'deer','ladle':'brew','firewood':'fire'};
    if(ids[id])mark(ids[id]);
    if(id?.startsWith('memory-'))mark('memories');
  },true);
  document.addEventListener('keydown',event=>{
    const dialog=document.activeElement?.closest('.crystal-dialog');if(!dialog)return;
    if(event.key==='Tab'){const buttons=[...dialog.querySelectorAll('button:not(:disabled)')],first=buttons[0],last=buttons.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
  });
  document.querySelector('#reset-game').addEventListener('click',()=>{discoveries=[];levels=[{},{}];selected.fill(null);localStorage.removeItem(key);});
})();
