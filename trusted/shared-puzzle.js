/* Shared twelve-piece puzzle. Test pieces never change memory completion. */
(() => {
  const key='witches-hut-shared-puzzle-v1', root=document.querySelector('#players');
  const W=800,H=560,C=4,R=3,w=W/C,h=H/R,pad=27;
  let data;try{data=JSON.parse(localStorage.getItem(key)||'null');}catch{}
  data=data&&typeof data==='object'?data:{};
  data.placed=Array.isArray(data.placed)?[...new Set(data.placed.filter(n=>Number.isInteger(n)&&n>=0&&n<12))]:[];
  const open=[false,false],selected=[null,null];let drag=null, revealTimer=null, revealUntil=0;
  const letterArt=`<svg viewBox="0 0 420 290" role="img" aria-label="A folded parchment letter"><defs><linearGradient id="letter-paper" x2=".8" y2="1"><stop stop-color="#f3dfb3"/><stop offset="1" stop-color="#b79660"/></linearGradient></defs><path d="M22 48 397 40 403 251 18 259Z" fill="url(#letter-paper)" stroke="#684c30" stroke-width="3"/><path d="M23 251 162 132M399 247 257 130" fill="none" stroke="#8f7048" stroke-width="2"/><path d="M22 48 211 182 397 40" fill="#e8d1a0" stroke="#795a36" stroke-width="3"/><path d="m211 182-4 24" stroke="#9d7b4a" stroke-width="2"/><circle cx="210" cy="187" r="23" fill="#843c32" stroke="#5e2e26" stroke-width="3"/><path d="m202 194 8-17 8 17m-12-6h9" fill="none" stroke="#b87355" stroke-width="2"/></svg>`;
  function stopReveal(){clearTimeout(revealTimer);revealTimer=null;revealUntil=0;}
  function reveal(){data.letterUnlocked=true;revealUntil=Date.now()+(matchMedia("(prefers-reduced-motion: reduce)").matches?0:2400);clearTimeout(revealTimer);revealTimer=setTimeout(()=>{revealUntil=0;render();},Math.max(0,revealUntil-Date.now()));}
  const available=()=>data.testAll?Array.from({length:12},(_,n)=>n):(window.getSharedPuzzleRewards?.()||[]).map(n=>n===8?1:n===2?2:null).filter(n=>n!==null);
  const save=()=>localStorage.setItem(key,JSON.stringify(data));
  function path(n){
    let x=0,y=0,s='M0 0';const c=n%C,r=Math.floor(n/C);
    function edge(dx,dy,sign){
      const X=t=>x+dx*t,Y=t=>y+dy*t,NX=dy/Math.hypot(dx,dy)*23*sign,NY=-dx/Math.hypot(dx,dy)*23*sign;
      if(!sign)s+=` L${X(1)} ${Y(1)}`;
      else s+=` L${X(.35)} ${Y(.35)} C${X(.43)} ${Y(.43)} ${X(.38)+NX} ${Y(.38)+NY} ${X(.5)+NX} ${Y(.5)+NY} C${X(.62)+NX} ${Y(.62)+NY} ${X(.57)} ${Y(.57)} ${X(.65)} ${Y(.65)} L${X(1)} ${Y(1)}`;
      x+=dx;y+=dy;
    }
    edge(w,0,r===0?0:1);edge(0,h,c===C-1?0:1);edge(-w,0,r===R-1?0:-1);edge(0,-h,c===0?0:-1);return s+' Z';
  }
  function art(n,uid){const d=path(n),c=n%C,r=Math.floor(n/C);return `<svg viewBox="${-pad} ${-pad} ${w+pad*2} ${h+pad*2}" aria-hidden="true"><defs><clipPath id="${uid}"><path d="${d}"/></clipPath></defs><image href="Grafik/0_pussel.jpg" x="${-c*w}" y="${-r*h}" width="${W}" height="${H}" preserveAspectRatio="none" clip-path="url(#${uid})"/><path d="${d}" fill="none" stroke="#2d2119" stroke-width="1.4"/></svg>`;}
  function render(){
    const ids=available(),placed=data.placed.filter(n=>ids.includes(n));
    if(placed.length===12&&!data.letterUnlocked){data.letterUnlocked=true;save();}
    const transforming=!!data.letterUnlocked&&Date.now()<revealUntil;
    for(let i=0;i<2;i++){
      const host=root.querySelector(`[data-player="${i}"]`),bag=host.querySelector('.memory-pieces');
      if(bag){bag.setAttribute('role','button');bag.tabIndex=0;bag.setAttribute('aria-label',`Open shared puzzle sack, ${ids.length} of 12 pieces`);bag.dataset.puzzle='open';}
      if(!host.querySelector('[data-puzzle="test"]')){const b=document.createElement('button');b.type='button';b.dataset.puzzle='test';b.textContent='Test: get all puzzle pieces';host.querySelector('.test-tools').append(b);}
      let overlay=host.querySelector('.shared-puzzle-overlay');
      if(!open[i]){overlay?.remove();continue;}
      if(!overlay){overlay=document.createElement('section');overlay.className='shared-puzzle-overlay';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Shared picture puzzle');host.querySelector('.scene').append(overlay);}
      overlay.classList.toggle('is-transforming',transforming);
      if(data.letterUnlocked&&!transforming){
        overlay.innerHTML=`<header><span>A letter remains${data.testAll?' · Test':''}</span><button type="button" data-puzzle="close" aria-label="Close letter">×</button></header><button type="button" class="shared-puzzle-letter" data-story="open" aria-label="Open the letter and tell my story">${letterArt}</button><footer>${data.testAll?'<button type="button" data-puzzle="scatter">Test: assemble again</button><button type="button" data-puzzle="end-test">End test</button>':''}</footer>`;
        continue;
      }
      overlay.innerHTML=`<header><span>${placed.length}/12 placed · ${ids.length}/12 found${data.testAll?' · Test':''}</span><button type="button" data-puzzle="close" aria-label="Close puzzle">×</button></header><div class="shared-puzzle-board" aria-label="Puzzle board">${placed.map(n=>`<span class="shared-puzzle-fixed" style="left:${(n%C*w-pad)/W*100}%;top:${(Math.floor(n/C)*h-pad)/H*100}%;width:${(w+pad*2)/W*100}%;height:${(h+pad*2)/H*100}%">${art(n,`fixed-${i}-${n}`)}</span>`).join('')}</div><p role="status">${placed.length===12?'The picture is complete!':ids.length?'Drag a piece into the picture. You can also select a piece and click its place.':'Find puzzle pieces in the memories.'}</p><div class="shared-puzzle-tray" aria-label="Found puzzle pieces">${ids.filter(n=>!placed.includes(n)).sort((a,b)=>(a*7%13)-(b*7%13)).map(n=>`<button type="button" class="shared-puzzle-piece ${selected[i]===n?'is-selected':''}" data-puzzle="piece" data-piece="${n}" aria-label="Puzzle piece ${n+1}" aria-pressed="${selected[i]===n}" style="rotate:${(n%3-1)*9}deg">${art(n,`tray-${i}-${n}`)}</button>`).join('')}</div><footer><button type="button" data-puzzle="scatter">Scatter collected pieces</button>${data.testAll?'<button type="button" data-puzzle="end-test">End test</button>':''}</footer>`;
    }
  }
  function place(i,n,x,y){
    const board=root.querySelector(`[data-player="${i}"] .shared-puzzle-board`);if(!board||!available().includes(n)||data.placed.includes(n))return false;
    const b=board.getBoundingClientRect(),cx=(n%C+.5)/C,cy=(Math.floor(n/C)+.5)/R;
    if(x<b.left||x>b.right||y<b.top||y>b.bottom||Math.abs((x-b.left)/b.width-cx)>.5/C||Math.abs((y-b.top)/b.height-cy)>.5/R)return false;
    data.placed.push(n);selected[i]=null;if(data.placed.length===12)reveal();save();render();return true;
  }
  window.addEventListener('click',e=>{
    const b=e.target.closest('[data-puzzle]'),host=e.target.closest('.player');if(!host)return;const i=Number(host.dataset.player);
    if(!b){if(e.target.closest('.shared-puzzle-board')&&selected[i]!==null){e.preventDefault();e.stopImmediatePropagation();place(i,selected[i],e.clientX,e.clientY);}return;}
    e.preventDefault();e.stopImmediatePropagation();
    const a=b.dataset.puzzle;
    if(a==='open')open[i]=true;if(a==='close')open[i]=false;
    if(a==='test'){data.testAll=true;open[i]=true;}
    if(a==='piece')selected[i]=Number(b.dataset.piece);
    if(a==='scatter'){stopReveal();data.letterUnlocked=false;data.placed=[];selected.fill(null);}
    if(a==='end-test'){stopReveal();data.letterUnlocked=false;data.testAll=false;data.placed=data.placed.filter(n=>available().includes(n));selected.fill(null);}
    save();render();
  },true);
  window.addEventListener('pointerdown',e=>{
    const b=e.target.closest('.shared-puzzle-piece');if(!b||e.button!==0)return;
    e.preventDefault();e.stopImmediatePropagation();const ghost=b.cloneNode(true);ghost.removeAttribute('data-puzzle');ghost.classList.add('shared-puzzle-drag');ghost.style.width=b.getBoundingClientRect().width+'px';document.body.append(ghost);
    drag={i:Number(b.closest('.player').dataset.player),n:Number(b.dataset.piece),x:e.clientX,y:e.clientY,ghost,id:e.pointerId,moved:false};ghost.style.left=e.clientX+'px';ghost.style.top=e.clientY+'px';b.setPointerCapture(e.pointerId);
  },true);
  window.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;e.preventDefault();drag.moved||=Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>5;drag.ghost.style.left=e.clientX+'px';drag.ghost.style.top=e.clientY+'px';},{passive:false});
  window.addEventListener('pointerup',e=>{if(!drag||e.pointerId!==drag.id)return;const d=drag;drag=null;d.ghost.remove();if(d.moved){e.preventDefault();place(d.i,d.n,e.clientX,e.clientY);}},true);
  const cancel=()=>{drag?.ghost.remove();drag=null;};window.addEventListener('pointercancel',cancel);window.addEventListener('blur',cancel);
  window.addEventListener('keydown',e=>{const host=e.target.closest('.player');if(!host)return;const i=Number(host.dataset.player);if(e.key==='Escape'&&open[i]){open[i]=false;cancel();render();}if((e.key==='Enter'||e.key===' ')&&e.target.matches('.memory-pieces')){e.preventDefault();open[i]=true;render();}});
  document.querySelector('#reset-game').addEventListener('click',()=>{cancel();stopReveal();data={placed:[]};open.fill(false);selected.fill(null);localStorage.removeItem(key);render();});
  window.renderSharedPuzzle=render;
  new MutationObserver(()=>{for(let i=0;i<2;i++){const host=root.querySelector(`[data-player="${i}"]`),bag=host.querySelector('.memory-pieces');if(bag&&!bag.dataset.puzzle)render();}}).observe(root,{childList:true,subtree:true});
  render();
})();
