/* A single optical path across two adjacent views of the north wall. */
(() => {
  'use strict';
  const root=document.querySelector('#players'),H=56.25;
  const points=[[20,12],[120,12],[65,16],[180,18],[35,28],[135,29],[65,39],[175,39],[20,48],[130,48]];
  const originalPoints=points.map(p=>[...p]);
  const source=[8,48],goal=[190,28],initial=[2,5,1,6,3,7,2,4,6,1];
  let eyePlacement={left:30,top:34,width:18,height:20};
  let portalPlacement={left:90,top:28/H*100,width:10,height:25};
  let transferPlacement={left:90,top:28/H*100,width:10,height:25};
  const transfer=[90,28],entry=[108,28],order=[0,2,4,6,8,1,3,5,7,9];
  try{eyePlacement={...eyePlacement,...JSON.parse(localStorage.getItem('witches-hut-layout-v1')||'{}')['light:skull-eye']};}catch{}
  try{portalPlacement={...portalPlacement,...JSON.parse(localStorage.getItem('witches-hut-layout-v1')||'{}')['light:portal']};}catch{}
  try{transferPlacement={...transferPlacement,...JSON.parse(localStorage.getItem('witches-hut-layout-v1')||'{}')['light:transfer']};}catch{}
  const eyeCenter=()=>[(eyePlacement.left+eyePlacement.width/2)/100,(eyePlacement.top+eyePlacement.height/2)/100];
  const panel=i=>root.querySelector(`[data-player="${i}"]`);
  const controller=stage=>(state.players[0].lightStarter===1?1:0)^(stage===1?1:0);
  const dot=(a,b)=>a[0]*b[0]+a[1]*b[1],sub=(a,b)=>[a[0]-b[0],a[1]-b[1]],cross=(a,b)=>a[0]*b[1]-a[1]*b[0];
  const norm=v=>{const n=Math.hypot(...v);return v.map(x=>x/n);};
  function settings(){state.players.forEach((p,i)=>{if(!Array.isArray(p.lightMirrorSteps)||p.lightMirrorSteps.length!==5||p.lightMirrorSteps.some(n=>!Number.isInteger(n)||n<0||n>7))p.lightMirrorSteps=initial.filter((_,n)=>n%2===i);});}
  function solutionAngle(n){
    const previous=n<2?(n===0?source:entry):points[n-2];
    const next=n>=8?(n===8?transfer:goal):points[n+2];
    const incoming=norm(sub(points[n],previous)),outgoing=norm(sub(next,points[n]));
    const tangent=norm([incoming[0]+outgoing[0],incoming[1]+outgoing[1]]);
    return Math.atan2(tangent[1],tangent[0]);
  }
  function angle(n,solution=false){return (solution?solutionAngle(n):state.players[0].lightBaseAngles?.[n]??solutionAngle(n))+(solution?0:state.players[n%2].lightMirrorSteps[Math.floor(n/2)]*Math.PI/8);}
  function trace(solution=false){
    const segments=[],hits=[];let start=source,dir=state.players[0].lightRayDirection||norm(sub(originalPoints[0],source)),last=-1,solved=false,stage=0,transferred=false;
    for(let bounce=0;bounce<24;bounce++){
      let best=Infinity,which=-1,normal;
      for(let n=0;n<points.length;n++){
        if(n%2!==stage)continue;
        if(n===last)continue;const a=angle(n,solution),edge=[Math.cos(a)*5,Math.sin(a)*5],begin=sub(points[n],edge.map(x=>x/2)),delta=sub(begin,start),den=cross(dir,edge);
        if(Math.abs(den)<1e-8)continue;const t=cross(delta,edge)/den,u=cross(delta,dir)/den;
        if(t>.001&&u>=0&&u<=1&&t<best){best=t;which=n;normal=[-Math.sin(a),Math.cos(a)];}
      }
      let boundary=Infinity;
      for(const [axis,limit] of [[0,stage*100],[0,stage*100+100],[1,0],[1,H]]){const t=(limit-start[axis])/dir[axis];if(t>.001)boundary=Math.min(boundary,t);}
      const target=stage===0?transfer:goal,toGoal=sub(target,start),along=dot(toGoal,dir),distance=Math.abs(cross(toGoal,dir));
      if(along>0&&distance<2.2&&along<Math.min(best,boundary)){
        segments.push([start,target]);
        if(stage===0&&hits.length===5&&hits.every((n,i)=>n===order[i])){stage=1;transferred=true;start=entry;dir=solution?norm(sub(points[1],entry)):(state.players[0].lightEntryDirection||norm(sub(points[1],entry)));last=-1;continue;}
        solved=stage===1&&hits.length===10&&hits.every((n,i)=>n===order[i]);break;
      }
      if(which<0||boundary<best){segments.push([start,[start[0]+dir[0]*boundary,start[1]+dir[1]*boundary]]);break;}
      const end=[start[0]+dir[0]*best,start[1]+dir[1]*best];segments.push([start,end]);hits.push(which);
      const d=dot(dir,normal);dir=[dir[0]-2*d*normal[0],dir[1]-2*d*normal[1]];start=end;last=which;
    }
    return {segments,hits,solved,transferred};
  }
  function calibrate(){
    const signature=JSON.stringify([...source,...transfer,...goal].map(n=>Math.round(n*100)/100));
    if(state.players[0].lightCalibration===signature)return;
    // Validate real reflections, including unintended intersections, before using a layout.
    state.players[0].lightRayDirection=norm(sub(points[0],source));
    let candidate=trace(true),seed=8191;
    const random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
    for(let attempt=0;!candidate.solved&&attempt<1200;attempt++){
      for(let n=0;n<10;n++)points[n]=[n%2*100+12+random()*76,7+random()*(H-14)];
      state.players[0].lightRayDirection=norm(sub(points[0],source));candidate=trace(true);
    }
    if(!candidate.solved)return;
    state.players[0].lightBaseAngles=points.map((_,n)=>solutionAngle(n));
    state.players[0].lightSolutionPoints=points.map(p=>[...p]);
    state.players[0].lightFixedSource=[...source];
    state.players[0].lightEntryDirection=norm(sub(points[1],entry));
    state.players[0].lightCalibration=signature;
    state.players.forEach((p,i)=>{p.lightMirrorPositions=points.filter((_,n)=>n%2===i).map(p=>[...p]);p.lightMirrorSteps=initial.filter((_,n)=>n%2===i);});
    save();
  }
  const style=document.createElement('style');style.textContent=`
    .light-board{position:absolute;inset:0;z-index:4;pointer-events:none}
    .light-rays{position:absolute;inset:0;width:100%;height:100%;overflow:hidden;pointer-events:none}
    .light-rays line{stroke:#fff3a6;stroke-width:.22;filter:drop-shadow(0 0 .3px #ffd474)}
    .light-mirror,.light-mirror:hover:not(:disabled){position:absolute;width:5%;height:9%;padding:0;border:0;background:transparent;pointer-events:auto;transform:translate(-50%,-50%);border-radius:50%}
    .light-mirror svg{width:100%;height:100%;overflow:visible;filter:drop-shadow(1px 2px 2px #000)}
    .light-mirror.is-hit svg{filter:drop-shadow(0 0 5px #fff4aa)}
    .light-mirror span{position:absolute;left:35%;top:100%;font:10px Georgia,serif;color:#dfd0a7;text-shadow:0 1px 3px #000}
    .light-mirror{touch-action:none;cursor:grab}
    .light-mirror:disabled{opacity:1;cursor:default}
    .light-role{position:absolute;left:2%;bottom:1%;padding:3px 7px;background:#18150ed9;color:#e8d9b6;font:11px system-ui}
    .light-skull-movable{touch-action:none;cursor:grab!important}
    .light-dragging,.light-dragging *{cursor:grabbing!important;user-select:none!important}
    .light-portal{position:absolute;left:90%;top:${28/H*100}%;width:10%;height:25%;object-fit:contain;transform:translate(-50%,-50%);filter:brightness(.55);pointer-events:none}
    .light-portal.is-open{filter:brightness(1.6) drop-shadow(0 0 12px #b2ecff)}
    .light-portal-final{background:radial-gradient(ellipse,#b2ecff26,transparent 68%);outline:1px solid #a3c9dd66;border-radius:50%;filter:brightness(1.15) drop-shadow(0 0 4px #a8dfff)}
    .light-portal-final.is-open{background:radial-gradient(ellipse,#fff8cdbb,#b2ecff44 40%,transparent 72%);filter:brightness(2.2) drop-shadow(0 0 20px #cbf4ff)}
    .light-entry{position:absolute;left:8%;top:${28/H*100}%;width:7%;height:18%;object-fit:contain;transform:translate(-50%,-50%);filter:brightness(1.5) drop-shadow(0 0 10px #ffdda0)}
    .light-source{position:absolute;left:8%;top:${48/H*100}%;width:6px;height:6px;transform:translate(-50%,-50%);border-radius:50%;background:#fff3a6;box-shadow:0 0 12px 4px #ffcf74}
    .skull-light-view{position:relative;flex:1;min-height:0;width:100%}
    .skull-eye-anchor{position:absolute;pointer-events:none}
    .skull-eye-anchor .skull-eye{pointer-events:auto}
    .item-image-overlay .skull-light-view img{width:100%;height:100%;object-fit:contain}
    .skull-eye,.skull-eye:hover:not(:disabled){position:absolute;left:43%;top:43%;width:9%;height:12%;padding:0;border:0;background:transparent;border-radius:50%}
    .skull-eye::after{content:'';position:absolute;left:40%;top:40%;width:20%;height:20%;border-radius:50%;background:#e4d19a;box-shadow:0 0 4px #ffe3a0}
    .skull-eye.is-awake::after{background:#fffbe4;box-shadow:0 0 12px 5px #ffe196}
  `;document.head.append(style);
  function inspectSkull(i){
    const overlay=panel(i).querySelector('.item-image-overlay');
    if(overlay.hidden||overlay.dataset.mode!=='inspection'||overlay.dataset.inspectId!=='trinket-1')return;
    const image=overlay.querySelector('.inspection-sheet > img');
    if(image){const view=document.createElement('div');view.className='skull-light-view';image.replaceWith(view);view.append(image);const anchor=document.createElement('div');anchor.className='skull-eye-anchor';const eye=document.createElement('button');eye.type='button';eye.className='skull-eye';eye.dataset.light='ignite';eye.setAttribute('aria-label','Light the glow in the skull’s eye socket');eye.style.cssText=`left:${eyePlacement.left}%;top:${eyePlacement.top}%;width:${eyePlacement.width}%;height:${eyePlacement.height}%`;anchor.append(eye);view.append(anchor);}
    const awake=state.players.some(p=>p.lightAwake),toggle=overlay.querySelector('.skull-eye');
    toggle?.classList.toggle('is-awake',awake);
    toggle?.setAttribute('aria-pressed',String(awake));
    toggle?.setAttribute('aria-label',awake?'Extinguish the glow in the skull’s eye socket':'Light the glow in the skull’s eye socket');
    const skull=overlay.querySelector('.skull-light-view img'),eye=overlay.querySelector('.skull-eye');
    if(skull?.complete&&eye){const r=visibleImageRect(skull),v=skull.parentElement.getBoundingClientRect();eye.parentElement.style.cssText=`left:${r.left-v.left}px;top:${r.top-v.top}px;width:${r.width}px;height:${r.height}px`;}
    window.refreshMemoryLayout?.();
  }
  window.inspectLightSkull=inspectSkull;
  function render(){
    settings();
    for(let i=0;i<2;i++)if(!panel(i).querySelector('[data-light-test]')){const button=document.createElement('button');button.type='button';button.dataset.lightTest=String(i);button.textContent='Test: mirror puzzle';panel(i).querySelector('.test-tools').append(button);}
    goal[0]=100+portalPlacement.left;goal[1]=portalPlacement.top/100*H;
    transfer[0]=transferPlacement.left;transfer[1]=transferPlacement.top/100*H;
    for(let n=0;n<10;n++){const saved=state.players[n%2].lightMirrorPositions?.[Math.floor(n/2)];points[n]=Array.isArray(saved)&&saved.length===2&&saved.every(Number.isFinite)?[...saved]:[...originalPoints[n]];}
    for(let i=0;i<2;i++){
      const skull=panel(i).querySelector('[data-role="decor"] [data-layout-id="trinket-1"]'),pos=state.players[i].lightSkullPosition;
      if(skull){skull.classList.remove('light-skull-movable');skull.draggable=false;
        if(pos&&Number.isFinite(pos.left)&&Number.isFinite(pos.top)&&!document.body.classList.contains('layout-editing')){skull.style.left=`${pos.left}%`;skull.style.top=`${pos.top}%`;skull.style.right='auto';skull.style.bottom='auto';}}
    }
    const skull=panel(0).querySelector('[data-role="decor"] [data-layout-id="trinket-1"]')||panel(1).querySelector('[data-role="decor"] [data-layout-id="trinket-1"]');
    if(skull?.complete){const r=visibleImageRect(skull),s=skull.closest('.scene').getBoundingClientRect(),center=eyeCenter();source[0]=(r.left+r.width*center[0]-s.left)/s.width*100;source[1]=(r.top+r.height*center[1]-s.top)/s.height*H;}
    else if(state.players[0].lightFixedSource){source[0]=state.players[0].lightFixedSource[0];source[1]=state.players[0].lightFixedSource[1];}
    if(skull?.complete)calibrate();
    const awake=state.players.some(p=>p.lightAwake),path=awake?trace():{segments:[],hits:[],solved:false};
    if(path.solved&&!state.players.every(p=>p.lightSolved)){state.players.forEach(p=>p.lightSolved=true);save();}
    for(let i=0;i<2;i++){
      const host=panel(i),scene=host.querySelector('.scene');scene.querySelector('.light-board')?.remove();inspectSkull(i);
      const stage=state.players[i].wall;
      if(!awake||stage>1||state.players[i].inBackRoom||state.players[i].testDark)continue;
      const canMove=i===controller(stage);
      const board=document.createElement('div');board.className='light-board';board.setAttribute('aria-label','Light puzzle with five rotating mirrors');
      board.innerHTML=`<svg class="light-rays" viewBox="${stage*100} 0 100 ${H}" preserveAspectRatio="none" aria-hidden="true">${path.segments.filter(([a])=>(a[0]>=100?1:0)===stage).map(([a,b])=>`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`).join('')}</svg>`;
      for(let n=stage;n<10;n+=2){const mirror=document.createElement('button');mirror.type='button';mirror.className='light-mirror'+(path.hits.includes(n)?' is-hit':'');mirror.dataset.light='rotate';mirror.dataset.mirror=n;mirror.disabled=!canMove;
        mirror.style.cssText=`left:${points[n][0]-stage*100}%;top:${points[n][1]/H*100}%`;
        mirror.setAttribute('aria-label',canMove?`Rotate mirror ${Math.floor(n/2)+1}`:'Your companion’s mirror');
        mirror.innerHTML=`<svg viewBox="-3 -3 6 6" aria-hidden="true"><circle r="2.7" fill="#332c22" stroke="#a98d58" stroke-width=".22"/><g transform="rotate(${angle(n)*180/Math.PI})"><path d="M-2.5 0h5" stroke="#c6eff9" stroke-width=".42"/><path d="M-2.5 .4h5" stroke="#775f40" stroke-width=".25"/></g></svg>${canMove?`<span>${Math.floor(n/2)+1}</span>`:''}`;board.append(mirror);
      }
      board.insertAdjacentHTML('beforeend',`<span class="light-role">${canMove?'You control the mirrors':`Player ${controller(stage)+1} controls the mirrors`}</span>`);
      if(stage===0&&awake)board.insertAdjacentHTML('beforeend',`<span class="light-source" style="left:${source[0]}%;top:${source[1]/H*100}%"></span>`);
      if(stage===0)board.insertAdjacentHTML('beforeend',`<img class="light-portal ${path.transferred?'is-open':''}" data-light-portal="transfer" style="left:${transferPlacement.left}%;top:${transferPlacement.top}%;width:${transferPlacement.width}%;height:${transferPlacement.height}%" src="Grafik/1_portal.png" alt="Portal to your companion’s east wall">`);
      if(stage===1){
        if(path.transferred)board.insertAdjacentHTML('beforeend','<img class="light-entry" src="Grafik/1_portal.png" alt="Light arriving from your companion’s north wall">');
        board.insertAdjacentHTML('beforeend',`<img class="light-portal light-portal-final ${state.players[i].lightSolved?'is-open':''}" data-light-portal="final" style="left:${portalPlacement.left}%;top:${portalPlacement.top}%;width:${portalPlacement.width}%;height:${portalPlacement.height}%" src="Grafik/1_portal.png" alt="Final portal for the memory coin">`);
      }
      scene.append(board);window.renderLightMemory?.(i);
    }
    if(document.body.classList.contains('layout-editing'))window.refreshMemoryLayout?.();
  }
  window.renderLightPuzzle=render;
  let placementFrame;
  window.addEventListener('light-eye-layout',event=>{
    const next=event.detail;if(['left','top','width','height'].every(k=>eyePlacement[k]===next[k]))return;
    eyePlacement={...next};cancelAnimationFrame(placementFrame);placementFrame=requestAnimationFrame(render);
  });
  window.addEventListener('light-portal-layout',event=>{
    const {rect:next,transfer:isTransfer}=event.detail,current=isTransfer?transferPlacement:portalPlacement;
    if(['left','top','width','height','rotation'].every(k=>current[k]===next[k]))return;
    if(isTransfer)transferPlacement={...next};else portalPlacement={...next};cancelAnimationFrame(placementFrame);placementFrame=requestAnimationFrame(render);
  });
  document.addEventListener('click',event=>{
    const test=event.target.closest('[data-light-test]');
    if(test){
      event.preventDefault();event.stopImmediatePropagation();
      if(!state.players.some(p=>p.lightAwake))state.players[0].lightStarter=Number(test.dataset.lightTest);
      state.players.forEach((p,i)=>{p.lightAwake=true;p.inBackRoom=false;p.testDark=false;p.wall=i===controller(0)?0:1;});
      drawAll();render();
      const solution=state.players[0].lightSolutionPoints;
      state.players.forEach((p,i)=>{p.lightMirrorSteps=[0,0,0,0,0];if(solution)p.lightMirrorPositions=solution.filter((_,n)=>n%2===i).map(p=>[...p]);});
      save();drawAll();render();return;
    }
    const button=event.target.closest('[data-light]');if(!button||document.body.classList.contains('layout-editing'))return;
    event.preventDefault();event.stopImmediatePropagation();settings();
    if(button.dataset.light==='ignite'){const awake=!state.players.some(p=>p.lightAwake);if(awake&&!Number.isInteger(state.players[0].lightStarter))state.players[0].lightStarter=Number(button.closest('.player').dataset.player);state.players.forEach(p=>p.lightAwake=awake);}
    else{const n=Number(button.dataset.mirror);if(Number(button.closest('.player').dataset.player)!==controller(n%2))return;const p=state.players[n%2],j=Math.floor(n/2);p.lightMirrorSteps[j]=(p.lightMirrorSteps[j]+1)%8;}
    save();render();
  },true);
  let drag=null,suppressClick=false;
  window.addEventListener('click',event=>{if(suppressClick){suppressClick=false;event.preventDefault();event.stopImmediatePropagation();}},true);
  window.addEventListener('pointerdown',event=>{
    if(event.button!==0||document.body.classList.contains('layout-editing')||!state.players.some(p=>p.lightAwake))return;
    const mirror=event.target.closest('.light-mirror'),el=mirror;
    if(!el||el.closest('.scene').querySelector('.item-image-overlay:not([hidden])'))return;
    const i=Number(el.closest('.player').dataset.player),scene=el.closest('.scene'),stage=Number(mirror.dataset.mirror)%2;if(i!==controller(stage)||state.players[i].wall!==stage)return;
    const parent=el.offsetParent,r=scene.getBoundingClientRect();
    drag={i,scene,el,mirror:mirror?Number(mirror.dataset.mirror):null,x:event.clientX,y:event.clientY,id:event.pointerId,moved:false,r,
      left:el.offsetLeft/parent.clientWidth*100,top:el.offsetTop/parent.clientHeight*100,pw:parent.clientWidth,ph:parent.clientHeight};
  },true);
  window.addEventListener('pointermove',event=>{
    if(!drag||event.pointerId!==drag.id)return;const d=drag,dx=event.clientX-d.x,dy=event.clientY-d.y;
    if(!d.moved&&Math.hypot(dx,dy)<5)return;
    if(!d.moved){d.moved=true;d.scene.setPointerCapture(d.id);document.body.classList.add('light-dragging');}
    event.preventDefault();
    if(d.mirror!==null){
      const n=d.mirror,p=state.players[n%2],j=Math.floor(n/2),base=originalPoints[n];
      if(!p.lightMirrorPositions)p.lightMirrorPositions=[];
      const current=p.lightMirrorPositions[j]||base;
      if(!d.start)d.start=[...current];
      p.lightMirrorPositions[j]=[Math.max(n%2*100+3,Math.min(n%2*100+97,d.start[0]+dx/d.r.width*100)),Math.max(3,Math.min(H-3,d.start[1]+dy/d.r.height*H))];
    }else{
      const left=Math.max(0,Math.min(100-d.el.offsetWidth/d.pw*100,d.left+dx/d.pw*100)),top=Math.max(0,Math.min(100-d.el.offsetHeight/d.ph*100,d.top+dy/d.ph*100));
      state.players[d.i].lightSkullPosition={left,top};
      // Both views depict the same source skull, so its position stays shared.
      state.players[1-d.i].lightSkullPosition={left,top};
    }
    render();
  },{capture:true,passive:false});
  function finishDrag(event){
    if(!drag||event.pointerId!==drag.id)return;const d=drag;drag=null;document.body.classList.remove('light-dragging');
    if(d.moved){suppressClick=event.type!=='pointercancel';setTimeout(()=>{suppressClick=false;},0);save();if(d.scene.hasPointerCapture(d.id))d.scene.releasePointerCapture(d.id);}
  }
  window.addEventListener('pointerup',finishDrag,true);window.addEventListener('pointercancel',finishDrag,true);
  // Only child-list changes from the game's main render require rebuilding.
  const observer=new MutationObserver(()=>render());
  root.querySelectorAll('[data-role="decor"]').forEach(el=>observer.observe(el,{childList:true}));
  root.querySelectorAll('.item-image-overlay').forEach(el=>observer.observe(el,{childList:true,attributes:true,attributeFilter:['hidden']}));
  root.addEventListener('load',event=>{if(event.target.matches('img[data-layout-id="trinket-1"],.skull-light-view img'))render();},true);
  window.addEventListener('resize',render);
  render();
})();
