/* Shared room sequence puzzle. The room artwork and saved layout remain intact. */
(() => {
  const style=document.createElement('style');
  style.textContent=`
    .echo-flash{filter:brightness(2.8) drop-shadow(0 0 12px #ffe899) drop-shadow(0 0 24px #fff4c6)!important}
    .echo-target{cursor:pointer!important;pointer-events:auto!important}.room-furnishing[data-action="echo-puzzle"]{pointer-events:auto;z-index:3}
    .echo-dialog{position:absolute;inset:18% 22%;z-index:110;background:#30251fee;color:#f9e8c4;border:2px solid #ad8755;padding:4%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:12px;box-shadow:0 12px 40px #0008}
    .echo-dialog h3,.echo-dialog p{margin:0}.echo-dialog img{width:auto;max-width:60%;height:45%;object-fit:contain}
    .echo-dialog button{min-height:36px}.echo-banner{padding:8px;color:inherit;display:flex;align-items:center;justify-content:center;gap:12px;font-variant-numeric:tabular-nums}
    .echo-dialog .echo-close{position:absolute;right:8px;top:8px}
    @media(max-width:600px){.echo-dialog{inset:12% 8%;gap:6px;padding:4%}.echo-dialog img{height:30%}.echo-banner{padding:4px}}
  `;
  document.head.append(style);
  const root=document.querySelector('#players');
  let game=null,token=0;
  const panel=i=>root.querySelector(`[data-player="${i}"]`);
  const scene=i=>panel(i).querySelector('.scene');
  const anchor='inredning-tavla-03';
  const sameWall=()=>state.players.every(p=>p.wall===2&&!p.inBackRoom&&!p.testDark);
  // Only individual artwork: a shelf/container filter would light every item inside it.
  const objects=i=>[...panel(i).querySelectorAll('[data-role="decor"] img[data-layout-id]')].filter(el=>el.dataset.layoutId!==anchor&&el.getBoundingClientRect().width>0);
  function label(text){
    for(let i=0;i<2;i++){
      let bar=panel(i).querySelector('.echo-banner');
      if(!bar){bar=document.createElement('div');bar.className='echo-banner';bar.setAttribute('role','status');panel(i).querySelector('.nav').before(bar);}
      bar.replaceChildren();
      const counter=document.createElement('span');counter.className='echo-counter';counter.textContent=text[i].match(/\d+\/\d+/)?.[0]||'1/10';
      const exit=document.createElement('button');exit.type='button';exit.dataset.echo='stop';exit.textContent='Exit';
      bar.append(counter,exit);
      bar.setAttribute('aria-label',text[i]);bar.dataset.phase=game?.phase||'';
    }
  }
  function stop(){token++;game=null;root.querySelectorAll('.echo-banner,.echo-dialog').forEach(el=>el.remove());root.querySelectorAll('.echo-flash,.echo-target').forEach(el=>el.classList.remove('echo-flash','echo-target'));}
  function show(i){
    stop();const dialog=document.createElement('section');dialog.className='echo-dialog';dialog.setAttribute('aria-label','Memory sequence puzzle preview');
    const won=state.players.every(p=>p.echoSolved);
    if(won)return;
    dialog.innerHTML=`<button class="echo-close" data-echo="close" aria-label="Close">×</button><img src="Grafik/inredning-tavla-03.png" alt="The painting on the south wall"><h3>Tell your friend to use <u>your</u> memories!</h3><button data-echo="${won?'reward':'start'}">${won?'Collect memory star':'Start'}</button>`;
    scene(i).append(dialog);
  }
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  async function play(){
    const run=++token,g=game;if(!g)return;
    g.phase='show';g.cursor=0;
    label([`Watch and describe · Round ${g.sequence.length}/10`,`Listen to your friend · Round ${g.sequence.length}/10`]);
    await wait(650);
    for(const id of g.sequence){
      if(run!==token)return;
      const el=objects(0).find(el=>el.dataset.layoutId===id);
      if(!el){stop();return;}
      root.querySelectorAll('.echo-flash').forEach(item=>item.classList.remove('echo-flash'));
      el.classList.add('echo-flash');await wait(700);el.classList.remove('echo-flash');await wait(300);
    }
    if(run!==token)return;
    g.phase='input';label([`Help your friend · Round ${g.sequence.length}/10`,`Click in the correct order · 0/${g.sequence.length}`]);
  }
  function nextItem(){const ids=game.ids;const choices=ids.filter(id=>id!==game.sequence.at(-1));return choices[Math.floor(Math.random()*choices.length)];}
  function start(){
    if(!sameWall()){state.players.forEach((p,i)=>{panel(i).querySelector('[data-role="status"]').textContent='Both players must face the south wall.';});return;}
    const other=new Set(objects(1).map(el=>el.dataset.layoutId));
    const ids=[...new Set(objects(0).map(el=>el.dataset.layoutId).filter(id=>other.has(id)))];
    if(ids.length<2)return;
    stop();state.bookPanelOpen=[false,false];state.bookOwner=null;
    root.querySelectorAll('.player-cover').forEach(el=>el.hidden=true);
    game={ids,sequence:[],cursor:0,phase:'show'};game.sequence.push(nextItem());
    for(let i=0;i<2;i++)objects(i).forEach(el=>{if(ids.includes(el.dataset.layoutId)){el.classList.add('echo-target');el.setAttribute('role','button');el.tabIndex=0;}});
    play();
  }
  function complete(){
    stop();state.players.forEach(p=>p.echoSolved=true);save();drawAll();
    state.players.forEach((p,i)=>{panel(i).querySelector('[data-role="status"]').textContent='Puzzle completed.';});
  }
  for(let i=0;i<2;i++){
    const button=document.createElement('button');button.type='button';button.dataset.echo='test-complete';button.textContent='Test: complete blink puzzle';panel(i).querySelector('.test-tools').append(button);
  }
  function input(id){
    const g=game;if(g.phase!=='input')return;
    if(id!==g.sequence[g.cursor]){g.sequence=[];g.sequence.push(nextItem());label(['Wrong order. Start again from one.','Wrong order. Start again from one.']);g.phase='pause';const run=token;setTimeout(()=>{if(run===token&&game===g)play();},1100);return;}
    g.cursor++;
    label([`Help your friend · Round ${g.sequence.length}/10`,`Correct · ${g.cursor}/${g.sequence.length}`]);
    if(g.cursor<g.sequence.length)return;
    if(g.sequence.length===10){complete();return;}
    g.phase='pause';g.sequence.push(nextItem());const run=token;setTimeout(()=>{if(run===token&&game===g)play();},750);
  }
  // Capture before normal room interactions: puzzle clicks never pick up or open objects.
  window.addEventListener('click',event=>{
    if(document.body.classList.contains('layout-editing'))return;
    const target=event.target,control=target.closest('[data-echo]');
    const painting=target.closest(`[data-layout-id="${anchor}"]`);
    if(!game&&!control&&!painting)return;
    if(target.closest('#reset-game')){stop();return;}
    if(!control&&!painting&&!target.closest('#players'))return;
    event.preventDefault();event.stopImmediatePropagation();
    if(control){const action=control.dataset.echo;if(action==='start')start();else if(action==='test-complete')complete();else stop();return;}
    if(game){const host=target.closest('.player');if(!host||Number(host.dataset.player)!==1||!target.closest('[data-role="decor"]'))return;
      const el=worldItemAtPoint(scene(1),event.clientX,event.clientY)||target.closest('[data-layout-id]');if(el&&game.ids.includes(el.dataset.layoutId))input(el.dataset.layoutId);return;}
    if(painting)show(Number(painting.closest('.player').dataset.player));
  },true);
  window.addEventListener('keydown',event=>{if(event.key==='Escape'){stop();return;}if(game&&(event.key==='Enter'||event.key===' ')&&event.target.matches('[data-layout-id]')){event.preventDefault();event.stopImmediatePropagation();if(Number(event.target.closest('.player').dataset.player)===1)input(event.target.dataset.layoutId);}},true);
  function decorate(){root.querySelectorAll(`[data-layout-id="${anchor}"]`).forEach(el=>{
    const solved=state.players[Number(el.closest('.player').dataset.player)].echoSolved;
    if(solved){delete el.dataset.action;el.removeAttribute('role');el.removeAttribute('tabindex');el.setAttribute('aria-label','Painting');el.style.cursor='default';el.style.pointerEvents='none';}
    else{el.dataset.action='echo-puzzle';el.setAttribute('role','button');el.tabIndex=0;el.setAttribute('aria-label','Tell your friend to use your memories!');el.style.cursor='pointer';el.style.removeProperty('pointer-events');}
  });}
  new MutationObserver(decorate).observe(root,{childList:true,subtree:true});decorate();
  if(new URLSearchParams(location.search).get('preview')==='echo'){
    state.players.forEach(p=>{p.wall=2;p.inBackRoom=false;p.testDark=false;});drawAll();show(0);
  }
})();



