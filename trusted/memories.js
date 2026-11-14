/* Memory prototype: puzzle content and final hiding places remain to be designed. */
(() => {
  const jarBase=new WeakMap();
  window.alignOpenMemoryJar=(jar,rect)=>{
    if(jar.dataset.layoutId!=='burk-1'||!jar.src?.includes('1_burk1.oppen'))return;
    const parent=jar.offsetParent;if(!parent)return;
    if(!jarBase.has(jar))jarBase.set(jar,{w:jar.offsetWidth,h:jar.offsetHeight,left:jar.offsetLeft,top:jar.offsetTop});
    const {w,h,left,top}=rect?{w:parent.clientWidth*rect.width/100,h:parent.clientHeight*rect.height/100,left:parent.clientWidth*rect.left/100,top:parent.clientHeight*rect.top/100}:jarBase.get(jar);
    const scale=Math.min(w/1183,h/1329),openScale=1145*scale/1040,openScaleY=1275*scale/862;
    Object.assign(jar.style,{left:((left+(w-1183*scale)/2+19*scale-41*openScale)/parent.clientWidth*100)+'%',top:((top+(h-1329*scale)/2+1305*scale-975*openScaleY)/parent.clientHeight*100)+'%',width:(1536*openScale/parent.clientWidth*100)+'%',height:(1024*openScaleY/parent.clientHeight*100)+'%',objectFit:'fill'});
  };
  const colors=['#ffb86b','#9bd5ff','#d5a0ff','#ff93b4','#b7e787','#ffe58a','#7fe4ce','#aab7ff','#efb6e6'];
  const key='witches-hut-memories-v1';
  let progress;try{progress=JSON.parse(localStorage.getItem(key)||'null')}catch{}
  if(!progress||!Array.isArray(progress.desk)||!Array.isArray(progress.completed))progress={desk:[],completed:[]};
  const valid=id=>/^memory-[0-8]-[01]$/.test(id);
  progress.desk=[...new Set(progress.desk.filter(valid))];
  progress.completed=[...new Set(progress.completed.filter(n=>Number.isInteger(n)&&n>=0&&n<9))];
  progress.desk=progress.desk.filter(id=>!progress.completed.includes(Number(id.split('-')[1])));
  const visitKey='witches-hut-memory-visits-v1';
  let savedVisits;try{savedVisits=JSON.parse(sessionStorage.getItem(visitKey)||'null');}catch{}
  const visiting=[0,1].map(i=>Number.isInteger(savedVisits?.[i])&&savedVisits[i]>=0&&savedVisits[i]<9?savedVisits[i]:null),testRoom=[false,false];
  const saveVisits=()=>sessionStorage.setItem(visitKey,JSON.stringify(visiting));
  const number=id=>Number(id.split('-')[1]);
  // Keep legacy layout IDs/classes so saved fragment positions continue to work.
  const coinNames=['Sun','Moon','Mercury','Sulfur','Salt','Earth','Fire','Water','Air'];
  const boxKey=i=>`north-box-key-${i}`;
  const coinAsset=(n,whole=false,player=0)=>`Grafik/memory-coins/coin-${n+1}-${whole?'whole':player===0?'left':'right'}.png`;
  const coin=(n,whole=false,player=0)=>`<img class="memory-star memory-coin ${whole?'memory-whole':''}" src="${coinAsset(n,whole,player)}" alt="" aria-hidden="true" draggable="false">`;
  for(let n=0;n<9;n++)for(let p=0;p<2;p++){
    catalogAdd(`memory-${n}-${p}`,`Memory coin half — ${coinNames[n]}`,`Half of a copper memory coin engraved with the ${coinNames[n]} symbol. Join it with the other half on the north-wall desk.`,coinAsset(n,false,p));
  }
  state.players.forEach((p,i)=>{p.inventory=p.inventory.filter(id=>!valid(id)||(!progress.completed.includes(number(id))&&!progress.desk.includes(id)&&id.endsWith('-'+i)));});
  const persist=()=>{localStorage.setItem(key,JSON.stringify(progress));save();};
  window.getSharedPuzzleRewards=()=>[...(progress.puzzlePieces||[])];
  const panel=i=>document.querySelector(`[data-player="${i}"]`);
  // Memory bags never use or replace the hut's inventory or selected item.
  function memoryBag(i,n=visiting[i]){
    if(n===null)return null;
    progress.inventories??={};
    const bags=progress.inventories[n]??=[{items:[],selected:null},{items:[],selected:null}];
    const bag=bags[i]??={items:[],selected:null};
    if(!Array.isArray(bag.items))bag.items=[];
    bag.items=bag.items.filter(id=>itemCatalog[id]);
    const overflow=bag.items.splice(4);
    if(n===8&&progress.herbsTaken?.[i])progress.herbsTaken[i]=progress.herbsTaken[i].filter(id=>!overflow.includes(id));
    if(!bag.items.includes(bag.selected))bag.selected=null;
    return bag;
  }
  window.addMemoryItem=(i,id)=>{
    if(![0,1].includes(i)||visiting[i]===null||!itemCatalog[id])return false;
    const bag=memoryBag(i);if(bag.items.length>=4)return false;
    bag.items.push(id);persist();render(i);return true;
  };
  window.removeMemoryItem=(i,id)=>{
    if(![0,1].includes(i)||visiting[i]===null)return false;
    const bag=memoryBag(i),slot=bag.items.indexOf(id);if(slot<0)return false;
    bag.items.splice(slot,1);if(bag.selected===id)bag.selected=null;
    persist();render(i);return true;
  };
  window.getMemoryInventory=i=>[0,1].includes(i)&&visiting[i]!==null?structuredClone(memoryBag(i)):null;
  function renderMemoryInventory(i){
    const bag=memoryBag(i),host=panel(i);
    host.querySelector('.inventory-head h3').textContent=bag?'Memory inventory':'Inventory';
    host.querySelector('.inventory-head .small-note').textContent=bag?'4 item slots':'10 item slots';
    let returnButton=host.querySelector('[data-memory="return-memory-herb"]');
    if(!returnButton){returnButton=document.createElement('button');returnButton.type='button';returnButton.dataset.memory='return-memory-herb';returnButton.textContent='Return herb to shelf';host.querySelector('.inventory-head').append(returnButton);}
    returnButton.hidden=!bag||visiting[i]!==8||!/^childhood-herb-[1-9]$/.test(bag.selected||'');
    if(!bag)return;
    host.querySelector('[data-role="inventory-grid"]').innerHTML=Array.from({length:4},(_,slot)=>{
      const id=bag.items[slot];if(!id)return '<div class="slot" aria-label="Empty slot '+(slot+1)+'"><span class="slot-number">'+(slot+1)+'</span></div>';
      const art=itemCatalog[id];
      return '<button type="button" class="slot inventory-herb '+(bag.selected===id?'selected':'')+'" data-memory="select-memory-item" data-item="'+id+'" aria-label="'+art.name+'" aria-pressed="'+(bag.selected===id)+'"><span class="slot-number">'+(slot+1)+'</span><img src="'+art.src+'" alt="'+art.name+'"></button>';
    }).join('');
  }

  const message=(i,text)=>{panel(i).querySelector('[data-role="status"]').textContent=text;};
  function notice(i,text,id){
    const layer=panel(i).querySelector('.memory-layer');
    layer.innerHTML+=`<div class="memory-modal"><article>${valid(id)?`<img class="memory-found-coin" src="${coinAsset(number(id),false,i)}" alt="${itemCatalog[id].name}">`:''}<p>${text}</p><button data-memory="dismiss">Continue</button></article></div>`;
  }
  function flash(i,success){
    document.querySelectorAll('.memory-layer').forEach(layer=>{const fx=document.createElement('div');fx.className=success?'memory-flash':'memory-reject';if(success)fx.innerHTML=coin(progress.completed.at(-1),true);else fx.textContent='ϟ';layer.append(fx);setTimeout(()=>fx.remove(),850);});
    if(!success)try{const audio=new(window.AudioContext||window.webkitAudioContext)(),osc=audio.createOscillator(),gain=audio.createGain();osc.type='sawtooth';osc.frequency.setValueAtTime(110,audio.currentTime);gain.gain.setValueAtTime(.045,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.2);osc.connect(gain);gain.connect(audio.destination);osc.start();osc.stop(audio.currentTime+.22);osc.onended=()=>audio.close();}catch{}
  }
  function renderDeerMemory(i){
    const sheet=panel(i).querySelector('.deer-hatch-sheet');if(!sheet)return;
    sheet.querySelectorAll('.deer-memory-star').forEach(el=>el.remove());
    const id=`memory-3-${i}`,p=state.players[i];
    if(state.deerEyeOwner!==i||!p.deerOpen||progress.completed.includes(3)||progress.desk.includes(id)||p.inventory.includes(id))return;
    sheet.insertAdjacentHTML('beforeend',`<button class="memory-position deer-memory-star" data-layout-id="memory-deer-star-${i}" data-memory="collect" data-fragment="${id}" aria-label="Collect your memory fragment from behind the deer painting">${coin(3,false,i)}</button>`);
    requestAnimationFrame(()=>window.refreshMemoryLayout?.());
  }
  window.renderDeerMemory=renderDeerMemory;
  function renderFoxMemory(i){
    const picture=panel(i).querySelector('.fox-picture');if(!picture)return;
    picture.querySelectorAll('.fox-memory-star').forEach(el=>el.remove());
    const id=`memory-4-${i}`;if(!state.players[i].foxSolved||progress.completed.includes(4)||progress.desk.includes(id)||state.players[i].inventory.includes(id))return;
    picture.insertAdjacentHTML('beforeend',`<button class="memory-position fox-memory-star" data-layout-id="memory-fox-star-${i}" data-memory="collect" data-fragment="${id}" aria-label="Collect your fox painting memory fragment">${coin(4,false,i)}</button>`);
  }
  window.renderFoxMemory=renderFoxMemory;
  function renderToadMemory(i){
    const overlay=panel(i).querySelector('.item-image-overlay');
    if(overlay.hidden||overlay.dataset.mode!=='inspection'||overlay.dataset.inspectId!=='trinket-11')return;
    const sheet=overlay.querySelector('.inspection-sheet'),image=sheet?.querySelector(':scope > img');if(!image)return;
    image.dataset.memory='feed-toad';image.setAttribute('role','button');image.tabIndex=0;image.style.cursor='pointer';image.setAttribute('aria-label','Ge den valda flugan till paddan');
    sheet.style.position='relative';sheet.querySelectorAll('.toad-memory-star').forEach(el=>el.remove());
    const p=state.players[i],id=`memory-7-${i}`;
    if(!p.toadFed||progress.completed.includes(7)||progress.desk.includes(id)||p.inventory.includes(id))return;
    sheet.insertAdjacentHTML('beforeend',`<button class="memory-position toad-memory-star" style="position:absolute;left:44%;top:24%;width:12%;height:16%;z-index:3" data-memory="collect" data-fragment="${id}" aria-label="Collect the memory coin half above the toad">${coin(7,false,i)}</button>`);
  }
  window.renderToadMemory=renderToadMemory;
  window.useInventoryOnToad=i=>{
    const p=state.players[i];
    if(p.toadFed||p.selectedItem!=='caught-fly'||!p.inventory.includes('caught-fly'))return false;
    p.inventory=p.inventory.filter(id=>id!=='caught-fly');p.selectedItem=null;p.toadFed=true;
    persist();drawAll();renderToadMemory(i);message(i,'The toad swallows the fly. A memory coin half appears!');return true;
  };
  function renderLightMemory(i){
    const board=panel(i).querySelector('.light-board');if(!board)return;
    board.querySelectorAll('.light-memory-star').forEach(el=>el.remove());
    const p=state.players[i],id=`memory-8-${i}`;
    if(!p.lightSolved||progress.completed.includes(8)||progress.desk.includes(id)||p.inventory.includes(id))return;
    const portal=board.querySelector('.light-portal-final');if(!portal)return;
    board.insertAdjacentHTML('beforeend',`<button class="memory-position light-memory-star" style="position:absolute;left:${portal.style.left};top:${portal.style.top};width:8%;height:14%;transform:translate(-50%,-50%);display:grid;place-items:center;pointer-events:auto;z-index:5" data-memory="collect" data-fragment="${id}" aria-label="Collect the memory coin half from the light puzzle">${coin(8,false,i)}</button>`);
  }
  window.renderLightMemory=renderLightMemory;
  // Temporary slot 7; the story assigned to this hiding place remains undecided.
  function showEastBox(i){
    const p=state.players[i],overlay=panel(i).querySelector('.item-image-overlay');
    if(!Array.isArray(p.eastBoxDigits)||p.eastBoxDigits.length!==5)p.eastBoxDigits=[0,0,0,0,0];
    const open=state.players.some(player=>player.eastBoxOpen===true),id=`memory-6-${i}`,found=progress.completed.includes(6)||progress.desk.includes(id)||p.inventory.includes(id);
    overlay.dataset.mode='east-box';
    overlay.innerHTML=`<section class="south-box-sheet" aria-label="The east-wall box"><img src="Grafik/1_ask3${open?'.oppen.PNG':'.utan-nyckelhal.png'}" alt="${open?'Open box':'Locked box'}">${open?(found?'':`<button class="memory-position east-box-memory-star" style="position:absolute;left:42%;top:49%;width:16%;height:20%" data-memory="collect" data-fragment="${id}" aria-label="Collect the memory coin half in the east box">${coin(6,false,i)}</button>`):`<div class="south-box-lock"><img src="Grafik/1_kodlas2.png" alt="Five-digit combination lock">${p.eastBoxDigits.map((digit,n)=>`<button class="south-box-digit" type="button" data-memory="east-digit" data-digit="${n}" style="left:${16+n*14.5}%" aria-label="Digit ${n+1}: ${digit}. Click to change."><span class="south-box-digit-face">${digit}</span></button>`).join('')}</div>`}</section>`;
    overlay.hidden=false;
  }
  function renderEchoMemory(i){
    const host=panel(i),p=state.players[i],id=`memory-5-${i}`;
    host.querySelectorAll('.echo-memory-star').forEach(el=>el.remove());
    if(!p.echoSolved||p.wall!==2||p.inBackRoom||p.testDark||visiting[i]!==null||progress.completed.includes(5)||progress.desk.includes(id)||p.inventory.includes(id))return;
    const painting=host.querySelector('[data-layout-id="inredning-tavla-03"]'),layer=host.querySelector('[data-role="decor"]');
    if(!painting||!layer)return;
    layer.insertAdjacentHTML('beforeend',`<button class="memory-position echo-memory-star" data-memory="collect" data-fragment="${id}" aria-label="Collect your memory fragment from the painting">${coin(5,false,i)}</button>`);
    requestAnimationFrame(()=>{
      const button=layer.querySelector('.echo-memory-star');if(!button||!painting.isConnected)return;
      const r=painting.getBoundingClientRect(),s=host.querySelector('.scene').getBoundingClientRect();
      button.style.cssText=`position:absolute;padding:0;display:grid;place-items:center;left:${r.left-s.left+r.width*.25}px;top:${r.top-s.top+r.height*.25}px;width:${r.width*.5}px;height:${r.height*.5}px;z-index:90;pointer-events:auto`;
    });
  }
  function render(i){
    const host=panel(i),scene=host.querySelector('.scene'),p=state.players[i];
    host.querySelectorAll('.memory-jar-key').forEach(el=>el.remove());
    // Register one direct entry per implemented memory, independently of earned coins.
    const implementedMemories=[{id:8,title:'Mammans sjukdom'},{id:2,title:'Lärlingstiden (testrum)'},{id:3,title:'Kärleksmötet – tavlan'}];
    const testTools=host.querySelector('.test-tools');
    testTools.querySelectorAll('[data-memory="test-enter"]').forEach(el=>el.remove());
    implementedMemories.forEach(memory=>{const button=document.createElement('button');button.type='button';button.dataset.memory='test-enter';button.dataset.number=memory.id;button.textContent='Test: minne – '+memory.title;testTools.append(button);});
    let layer=scene.querySelector('.memory-layer');if(!layer){layer=document.createElement('div');layer.className='memory-layer';scene.append(layer);}
    layer.innerHTML='';
    const inMemory=visiting[i]!==null;
    scene.classList.toggle('memory-room',inMemory);
    host.classList.toggle('visiting-memory',inMemory);
    renderMemoryInventory(i);
    let pieces=host.querySelector('.memory-pieces');
    if(!pieces){pieces=document.createElement('button');pieces.type='button';pieces.className='memory-pieces permanent-slot collection-slot';pieces.setAttribute('aria-label','Shared puzzle pieces');host.querySelector('.permanent-item').append(pieces);}
    let envelope=host.querySelector('.word-envelope');
    if(!envelope){envelope=document.createElement('button');envelope.type='button';envelope.className='word-envelope permanent-slot collection-slot';envelope.innerHTML='<img src="Grafik/0_kuvert.PNG" alt="Envelope for shared words" draggable="false">';pieces.before(envelope);}
    pieces.hidden=false;
    pieces.innerHTML='<img class="puzzle-sack-art" src="Grafik/0_säck.PNG" alt="Sack for shared puzzle pieces" draggable="false">'+(progress.puzzlePieces||[]).map(n=>'<span class="memory-collected-piece" title="'+(n===8?'Childhood':n===3?'Forest painting':'Apprenticeship')+' memory puzzle piece">'+illnessPieceSVG+'</span>').join('')+(progress.puzzlePieces?.length?'<span>Puzzle pieces: '+progress.puzzlePieces.length+'</span>':'');
    if(inMemory){
      // Replace the hut's contents: it must not remain a hit-testable room underneath.
      host.querySelector('[data-role="decor"]').replaceChildren();
      scene.querySelectorAll('.item-image-overlay,.player-cover,.morse-overlay').forEach(el=>{el.hidden=true;});
      host.querySelector('[data-role="status"]').textContent='You are exploring a memory.';
      host.querySelector('[data-role="wall-count"]').textContent='Memory';
    }
    if(!p.testDark&&!p.inBackRoom&&visiting[i]===null&&!testRoom[i]){
      const eastBox=host.querySelector('[data-layout-id="ask-2"]');
      if(eastBox){eastBox.src=`Grafik/1_ask3${state.players.some(player=>player.eastBoxOpen)?'.oppen.PNG':'.utan-nyckelhal.png'}`;eastBox.dataset.memory='east-box';eastBox.setAttribute('role','button');eastBox.tabIndex=0;eastBox.style.cursor='pointer';eastBox.setAttribute('aria-label','Inspect the box on the east wall');}
      const box=host.querySelector('[data-layout-id="ask-1"]');
      if(box){
        box.src=p.memoryBoxOpen?'Grafik/1_ask1.oppen.PNG':'Grafik/1_ask1.PNG';
        box.dataset.memory='unlock-box';box.setAttribute('role','button');box.tabIndex=0;
        box.setAttribute('aria-label',p.memoryBoxOpen?'Open memory box':'Unlock the small box');
      }
      const jar=host.querySelector('[data-layout-id="burk-1"]');
      if(jar){
        jar.dataset.memory='jar-key';jar.setAttribute('aria-label','Open the red jar');
        if(p.memoryJarOpen||p.memoryBoxOpen||p.inventory.includes(boxKey(i)))jar.src='Grafik/1_burk1.oppen.png';
      }
    }
    if(visiting[i]===8){
      renderIllnessMemory(layer,i,progress);
    }else if(visiting[i]===2){
      renderApprenticeMemory(layer,i,progress);
    }else if(visiting[i]===3){
      renderForestMemory(layer,i,progress);
    }else if(visiting[i]!==null){
      layer.innerHTML=`<section class="memory-scene"><span class="memory-eyebrow">Memory scene prototype · Player ${i+1}'s perspective</span>${coin(visiting[i],true)}<h3>Memory ${visiting[i]+1}</h3><p>${i===0?'Perspective A':'Perspective B'}</p><p>This scene and its point-and-click puzzle are still to be designed.</p><button data-memory="leave">Return to hut (test)</button></section>`;
    }else if(testRoom[i]){
      layer.innerHTML=`<section class="memory-test"><p>Fragment test locations · Player ${i+1} only</p><small>Temporary locations. Explore in any order.</small><div class="memory-test-grid">${colors.map((_,n)=>{const id=`memory-${n}-${i}`,found=progress.completed.includes(n)||progress.desk.includes(id)||p.inventory.includes(id);return `<button data-memory="collect" data-fragment="${id}" ${found?'disabled':''} aria-label="${found?'Found':'Collect'} fragment ${n+1}">${coin(n,false,i)}<small>${found?'Found':n+1}</small></button>`;}).join('')}</div></section>`;
    }else if(!p.testDark&&!p.inBackRoom&&p.wall===0){
      let shelf=host.querySelector('[data-layout-id="memory-storage-shelf"]');
      if(!shelf){shelf=document.createElement('div');shelf.className='wall-shelf memory-storage-shelf';shelf.dataset.layoutId='memory-storage-shelf';shelf.setAttribute('aria-label','Memory shelf above the desk');host.querySelector('[data-role="decor"]').append(shelf);}
      const desk=host.querySelector('.desk');
      if(desk){
        desk.querySelectorAll('.memory-drawer-controls').forEach(el=>el.remove());
        desk.classList.toggle('memory-drawer-open',p.memoryDrawerOpen===true);
        const id=`memory-0-${i}`,found=progress.completed.includes(0)||progress.desk.includes(id)||p.inventory.includes(id);
        const controls=document.createElement('div');controls.className='memory-drawer-controls';
        controls.innerHTML=`<button class="memory-drawer-hit" data-memory="drawer" aria-label="${p.memoryDrawerOpen?'Close':'Open'} left desk drawer" aria-expanded="${p.memoryDrawerOpen===true}"></button>${p.memoryDrawerOpen&&!found?`<button class="memory-drawer-star memory-position" data-layout-id="memory-drawer-star" data-memory="collect" data-fragment="${id}" aria-label="Collect memory fragment 1 from the drawer">${coin(0,false,i)}</button>`:''}`;
        desk.append(controls);
        const fitDrawer=()=>{if(!controls.isConnected)return;const w=desk.clientWidth,h=desk.clientHeight,scale=Math.min(w/413,h/551);controls.style.cssText=`width:${413*scale}px;height:${551*scale}px;left:${(w-413*scale)/2}px;top:${(h-551*scale)/2}px`;};
        requestAnimationFrame(fitDrawer);
      }
      if(desk){layer.innerHTML=`<div class="memory-desk"><button class="memory-desk-target" data-memory="place" aria-label="Place selected fragment on the desk">Place fragment</button><div class="memory-desk-slots">${progress.desk.map((id,slot)=>`<button class="memory-position memory-desk-star" data-layout-id="memory-desk-${id}" style="left:${number(id)*100/9}%;top:0%" data-memory="combine" data-fragment="${id}" aria-label="Combine with fragment ${number(id)+1}">${coin(number(id),false,Number(id.split('-')[2]))}</button>`).join('')}</div></div>`;}
      if(shelf)layer.innerHTML+=`<div class="memory-shelf" aria-label="Completed memories in completion order">${progress.completed.map((n,slot)=>`<button class="memory-position memory-shelf-star" data-layout-id="memory-shelf-slot-${slot}" style="left:${slot*100/9}%;top:-15%" data-memory="enter" data-number="${n}" aria-label="Enter ${coinNames[n]} memory">${coin(n,true)}</button>`).join('')}</div>`;
      const align=()=>{
        const sr=scene.getBoundingClientRect(),target=layer.querySelector('.memory-desk');
        if(target&&desk){const r=desk.getBoundingClientRect(),scale=Math.min(desk.clientWidth/413,desk.clientHeight/551),w=413*scale,h=551*scale;
          target.style.cssText=`left:${r.left-sr.left-scene.clientLeft+(r.width-w)/2+w*.05}px;top:${r.top-sr.top-scene.clientTop+(r.height-h)/2+h*.24}px;width:${w*.90}px;height:${h*.14}px`;}
        const shelfTarget=layer.querySelector('.memory-shelf');if(shelfTarget&&shelf){const r=shelf.getBoundingClientRect();shelfTarget.style.cssText=`left:${r.left-sr.left}px;top:${r.top-sr.top+r.height*.30}px;width:${r.width}px`;}
      };
      requestAnimationFrame(()=>{window.refreshMemoryLayout?.();align();window.refreshMemoryLayout?.();});
    }
    if(!p.testDark&&!p.inBackRoom&&p.wall===0&&visiting[i]===null&&!testRoom[i]&&p.memoryBoxOpen){
      const id=`memory-1-${i}`,found=progress.completed.includes(1)||progress.desk.includes(id)||p.inventory.includes(id);
      if(!found){
        layer.insertAdjacentHTML('beforeend',`<button class="memory-position memory-box-star" data-layout-id="memory-north-box-star" data-memory="collect" data-fragment="${id}" aria-label="Collect memory fragment from the small box">${coin(1,false,i)}</button>`);
        requestAnimationFrame(()=>{
          window.refreshMemoryLayout?.();
          const box=host.querySelector('[data-layout-id="ask-1"]'),button=layer.querySelector('.memory-box-star');if(!box||!button)return;
          const b=visibleImageRect(box),s=scene.getBoundingClientRect();
          button.style.left=`${(b.left+b.width*.5-s.left-scene.clientLeft)/scene.clientWidth*100-3}%`;
          button.style.top=`${(b.top+b.height*.43-s.top-scene.clientTop)/scene.clientHeight*100-9}%`;
          window.refreshMemoryLayout?.();
        });
      }
    }
    if(!p.testDark&&!p.inBackRoom&&p.wall===2&&visiting[i]===null&&!testRoom[i]&&p.memoryJarOpen&&!p.memoryBoxOpen&&!p.inventory.includes(boxKey(i))){
      const jar=host.querySelector('[data-layout-id="burk-1"]');
      if(jar){
        layer.insertAdjacentHTML('beforeend',`<button class="memory-jar-key" data-memory="take-jar-key" aria-label="Take the key above the open red jar"><img src="${itemCatalog[boxKey(i)].src}" alt="Small brass key"></button>`);
        requestAnimationFrame(()=>{
          window.refreshMemoryLayout?.();const key=layer.querySelector('.memory-jar-key');if(!key||!jar.isConnected)return;
          // A scene-level sibling escapes the shelf's stacking context.
          scene.append(key);
          const image=jar.getBoundingClientRect(),sr=scene.getBoundingClientRect(),scale=image.width/1536;
          const w=Math.max(40,1040*scale*.9)*.8,h=w*1.5,sx=sr.width/scene.offsetWidth,sy=sr.height/scene.offsetHeight;
          Object.assign(key.style,{left:((image.left+(41+520)*scale-w/2-sr.left-scene.clientLeft*sx)/(scene.clientWidth*sx)*100)+'%',top:((image.top+113*image.height/1024-h-5-sr.top-scene.clientTop*sy)/(scene.clientHeight*sy)*100)+'%',width:(w/(scene.clientWidth*sx)*100)+'%',height:(h/(scene.clientHeight*sy)*100)+'%'});
        });
      }
    }
    if(p.inBackRoom&&visiting[i]===null&&!testRoom[i]&&state.players[0].darkHatchOpen){
      const id=`memory-2-${i}`,found=progress.completed.includes(2)||progress.desk.includes(id)||p.inventory.includes(id);
      if(!found){
        layer.insertAdjacentHTML('beforeend',`<button class="memory-position memory-dark-star" data-layout-id="memory-dark-star-${i}" data-memory="collect" data-fragment="${id}" style="left:48%;top:45%;width:6%;height:10%" aria-label="Collect memory fragment from the dark room">${coin(2,false,i)}</button>`);
        requestAnimationFrame(()=>{
          window.refreshMemoryLayout?.();const button=layer.querySelector('.memory-dark-star'),hatch=host.querySelector('.dark-wall-hatch');
          if(i===0&&button&&hatch){const h=hatch.getBoundingClientRect(),s=scene.getBoundingClientRect();button.style.left=`${(h.left+h.width*.7-s.left-scene.clientLeft)/scene.clientWidth*100-3}%`;button.style.top=`${(h.top+h.height*.5-s.top-scene.clientTop)/scene.clientHeight*100-5}%`;}
          window.refreshMemoryLayout?.();
        });
      }
    }
    host.querySelectorAll('[data-inventory-item]').forEach(button=>{const id=button.dataset.inventoryItem;if(id===boxKey(i)){button.dataset.memory='select-box-key';}if(id==='burk-1'){button.dataset.memory='jar-key';}if(valid(id)){button.classList.add('memory-inventory');button.dataset.memory='select';button.dataset.fragment=id;button.title='Select fragment, then click the desk or another fragment';}});
    const blocked=visiting[i]!==null||testRoom[i];host.querySelectorAll('.nav button').forEach(button=>button.disabled=blocked);
    renderDeerMemory(i);
    renderFoxMemory(i);
    renderEchoMemory(i);
    renderToadMemory(i);
    renderLightMemory(i);
    window.renderSharedPuzzle?.();
  }
  window.renderMemories=render;
  document.addEventListener('click',event=>{
    if(event.target.closest('#reset-game')){progress={desk:[],completed:[]};visiting.fill(null);saveVisits();testRoom.fill(false);localStorage.removeItem(key);return;}
    const flySlot=event.target.closest('[data-inventory-item="caught-fly"]');
    if(flySlot&&!document.body.classList.contains('layout-editing')){
      const i=Number(flySlot.closest('.player').dataset.player),overlay=panel(i).querySelector('.item-image-overlay');
      if(!overlay.hidden&&overlay.dataset.mode==='inspection'&&overlay.dataset.inspectId==='trinket-11'){
        event.preventDefault();event.stopImmediatePropagation();state.players[i].selectedItem='caught-fly';persist();drawAll();message(i,'Fly selected.');return;
      }
    }
    let button=event.target.closest('[data-memory]');
    if(!button&&event.target.closest('.memory-room')){if(event.target.matches('.illness-herb-modal,.illness-book-modal'))event.target.remove();event.preventDefault();event.stopImmediatePropagation();return;}
    if(!button&&!document.body.classList.contains('layout-editing')){
      const scene=event.target.closest('.scene'),item=worldItemAtPoint(scene,event.clientX,event.clientY);
      if(item?.dataset.layoutId==='burk-1')button=item;
    }
    if(!button){const host=event.target.closest('.player');if(!host)return;const i=Number(host.dataset.player);if(visiting[i]!==null&&event.target.closest('.inventory,.test-tools,.player-cover')){event.preventDefault();event.stopImmediatePropagation();return;}if(event.target.closest('.desk')&&valid(state.players[i].selectedItem)&&!testRoom[i]&&visiting[i]===null)button=host.querySelector('[data-memory="place"]');}
    if(!button)return;
    event.preventDefault();event.stopImmediatePropagation();if(document.body.classList.contains('layout-editing'))return;
    const i=Number(button.closest('.player').dataset.player),p=state.players[i],action=button.dataset.memory,id=button.dataset.fragment;
    if(action==='forest'){
      if(visiting[i]!==3)return;
      handleForestMemory(button,i,progress,visiting);persist();
      for(let player=0;player<2;player++)if(visiting[player]===3)render(player);
      return;
    }
    if(action==='apprentice'){
      if(visiting[i]!==2)return;
      handleApprenticeMemory(button,i,progress,visiting);persist();
      for(let player=0;player<2;player++)if(visiting[player]===2)render(player);
      return;
    }
    if(action==='take-memory-herb'){
      const herbId=button.dataset.herb;
      if(visiting[i]!==8||!/^childhood-herb-[1-9]$/.test(herbId)||!button.closest('.illness-herb-modal'))return;
      progress.herbsTaken??=[[],[]];progress.herbsTaken[i]??=[];
      if(progress.herbsTaken[i].includes(herbId))return;
      const bag=memoryBag(i);
      if(bag.items.length>=10){message(i,'Your memory inventory is full.');return;}
      bag.items.push(herbId);bag.selected=herbId;progress.herbsTaken[i].push(herbId);
      persist();render(i);message(i,'The herb is now in your memory inventory.');return;
    }
    if(action==='return-memory-herb'){
      if(visiting[i]!==8)return;
      const bag=memoryBag(i),herb=bag.selected;
      if(!/^childhood-herb-[1-9]$/.test(herb||'')||!bag.items.includes(herb))return;
      bag.items=bag.items.filter(id=>id!==herb);bag.selected=null;
      if(progress.herbsTaken?.[i])progress.herbsTaken[i]=progress.herbsTaken[i].filter(id=>id!==herb);
      persist();render(i);message(i,'The herb is back on the shelf.');return;
    }
    if(action==='select-memory-item'){
      if(visiting[i]===null)return;
      const bag=memoryBag(i);if(!bag.items.includes(button.dataset.item))return;
      const kettleOpen=!!panel(i).querySelector('.illness-kettle-modal');
      bag.selected=bag.selected===button.dataset.item?null:button.dataset.item;
      persist();render(i);
      if(kettleOpen)window.inspectMemoryKettle(panel(i).querySelector('.memory-layer'),illnessBrewState(progress));
      return;
    }
    if(action==='inspect-memory-wall-art'){window.inspectMemoryWallArt(panel(i).querySelector('.memory-layer'),button.dataset.wallArt);return;}
    if(action==='inspect-memory-kettle'){
      if(visiting[i]!==8||i!==0)return;
      const bag=memoryBag(i);
      const opening=!button.closest('.illness-kettle-modal');
      if(opening){bag.selected=null;emptyIllnessBrew(progress);}
      const brew=illnessBrewState(progress);
      let text='Select a herb in your memory inventory, then click the cauldron.';
      if(!opening&&bag.selected&&bag.items.includes(bag.selected))text=addIllnessIngredient(progress,bag.selected);
      persist();render(i);window.inspectMemoryKettle(panel(i).querySelector('.memory-layer'),illnessBrewState(progress));message(i,text);
      if(brew.solved&&visiting[1]===8)render(1);
      return;
    }
    if(action==='empty-illness-brew'){
      if(visiting[i]!==8||i!==0)return;
      emptyIllnessBrew(progress);persist();render(i);window.inspectMemoryKettle(panel(i).querySelector('.memory-layer'),illnessBrewState(progress));message(i,'The pot is empty. You can start again.');return;
    }
    if(action==='collect-illness-piece'){
      if(visiting[i]!==8||!illnessBrewState(progress).solved)return;
      progress.puzzlePieces??=[];
      if(!progress.puzzlePieces.includes(8))progress.puzzlePieces.push(8);
      persist();render(0);render(1);message(i,'A puzzle piece has been added to your shared collection.');return;
    }
    if(action==='inspect-memory-portrait'){window.inspectMemoryPortrait(panel(i).querySelector('.memory-layer'));return;}
    if(action==='inspect-memory-book'){window.inspectMemoryBook(panel(i).querySelector('.memory-layer'),button.dataset.book);return;}
    if(action==='inspect-herb'){window.inspectMemoryHerb(panel(i).querySelector('.memory-layer'),button.dataset.herb);return;}
    if(action==='feed-toad'){
      if(p.toadFed){message(i,'The toad has already been fed.');return;}
      if(p.selectedItem!=='caught-fly'||!p.inventory.includes('caught-fly')){message(i,'Select a fly in your inventory first.');return;}
      window.useInventoryOnToad(i);return;
    }
    if(action==='east-box'){showEastBox(i);return;}
    if(action==='east-digit'){
      if(state.players.some(player=>player.eastBoxOpen))return;
      const n=Number(button.dataset.digit);p.eastBoxDigits[n]=(p.eastBoxDigits[n]+1)%10;
      if(p.eastBoxDigits.join('')==='73053')p.eastBoxOpen=true;
      persist();showEastBox(i);
      if(state.players.some(player=>player.eastBoxOpen)){drawAll();document.querySelectorAll('.item-image-overlay[data-mode="east-box"]:not([hidden])').forEach(overlay=>showEastBox(Number(overlay.closest('.player').dataset.player)));}
      return;
    }
    if(action==='select-box-key'){p.selectedItem=p.selectedItem===boxKey(i)?null:boxKey(i);persist();drawPlayer(i);return;}
    if(action==='jar-key'){
      if(!p.memoryJarOpen){p.memoryJarOpen=true;persist();drawPlayer(i);message(i,'The jar is open.');return;}
      message(i,p.memoryBoxOpen||p.inventory.includes(boxKey(i))?'The red jar is empty.':'The jar is open.');return;
    }
    if(action==='take-jar-key'){
      if(!p.memoryJarOpen)return;
      if(p.memoryBoxOpen||p.inventory.includes(boxKey(i))){message(i,'The red jar is empty.');return;}
      if(p.inventory.length+(p.lantern?1:0)>=10){message(i,'Your inventory is full. Free a slot before taking the key.');return;}
      const origin=button.getBoundingClientRect();p.inventory.push(boxKey(i));p.selectedItem=boxKey(i);persist();drawAll();
      const target=panel(i).querySelector(`[data-inventory-item="${boxKey(i)}"]`).getBoundingClientRect();
      const flying=document.createElement('img');flying.src=itemCatalog[boxKey(i)].src;flying.className='memory-flying-key';
      Object.assign(flying.style,{left:`${origin.left}px`,top:`${origin.top}px`});document.body.append(flying);
      flying.animate([{transform:'translateY(0) scale(.5)',opacity:0},{transform:'translateY(-45px) scale(1.2)',opacity:1,offset:.3},{transform:`translate(${target.left-origin.left}px,${target.top-origin.top}px) scale(.4)`,opacity:1}],{duration:850,easing:'ease-in-out'}).onfinish=()=>flying.remove();
      message(i,'Key collected.');return;
    }
    if(action==='unlock-box'){
      if(p.memoryBoxOpen){message(i,'The small box is open.');return;}
      if(p.selectedItem!==boxKey(i)||!p.inventory.includes(boxKey(i))){message(i,'You need a key.');return;}
      p.memoryBoxOpen=true;p.inventory=p.inventory.filter(item=>item!==boxKey(i));p.selectedItem=null;persist();drawAll();message(i,'The key turns. Half of a copper memory coin rises from the box.');return;
    }
    if(action==='drawer'){p.memoryDrawerOpen=!p.memoryDrawerOpen;persist();drawPlayer(i);return;}
    if(action==='test'){testRoom[i]=!testRoom[i];visiting[i]=null;saveVisits();render(i);return;}
    if(action==='dismiss'){button.closest('.memory-modal').remove();return;}
    if(action==='leave'){visiting[i]=null;saveVisits();testRoom[i]=false;drawAll();return;}
    if(action==='enter'||action==='test-enter'){visiting[i]=Number(button.dataset.number);saveVisits();state.bookPanelOpen[i]=false;if(state.bookOwner===i)state.bookOwner=null;panel(i).querySelectorAll('.player-cover').forEach(el=>el.hidden=true);drawAll();return;}
    if(action==='collect'){
      if(p.inBackRoom&&!p.darkRoomTestLight&&(!p.lantern||!p.lightSelected))return;
      if(!valid(id)||!id.endsWith('-'+i)||progress.completed.includes(number(id))||progress.desk.includes(id)||p.inventory.includes(id))return;
      if(p.inventory.length+(p.lantern?1:0)>=10){message(i,'Your inventory is full. Free a slot before collecting this fragment.');return;}
      if(button.matches('.deer-memory-star,.fox-memory-star,.east-box-memory-star,.toad-memory-star')){button.closest('.item-image-overlay').hidden=true;}
      p.inventory.push(id);p.selectedItem=id;persist();drawAll();notice(i,'You have found half of a memory coin. Find the matching engraved half and join them on the desk.',id);return;
    }
    if(action==='select'){p.selectedItem=id;persist();drawPlayer(i);message(i,'Memory coin half selected.');return;}
    const selected=p.selectedItem;
    if(!valid(selected)||!p.inventory.includes(selected)){message(i,'Select a memory fragment in your inventory first.');return;}
    if(action==='place'){
      const matching=progress.desk.find(item=>number(item)===number(selected)&&item!==selected);
      if(matching){const n=number(selected);progress.desk=progress.desk.filter(item=>number(item)!==n);progress.completed.push(n);}
      else progress.desk.push(selected);
      p.inventory=p.inventory.filter(item=>item!==selected);p.selectedItem=null;persist();drawAll();if(matching){flash(i,true);message(i,'The two halves form a whole memory coin.');}return;
    }
    if(action==='combine'&&progress.desk.includes(id)){
      if(number(selected)!==number(id)||selected===id){message(i,'Bzz! These fragments push each other away.');flash(i,false);return;}
      const n=number(id);progress.desk=progress.desk.filter(item=>number(item)!==n);progress.completed.push(n);
      p.inventory=p.inventory.filter(item=>item!==selected);p.selectedItem=null;persist();drawAll();flash(i,true);message(i,'The two halves form a whole memory coin.');
    }
  },true);
  document.addEventListener('keydown',event=>{
    if((event.key==='Enter'||event.key===' ')&&event.target.matches('[data-memory="unlock-box"],[data-memory="jar-key"],[data-memory="east-box"],[data-memory="feed-toad"]')){event.preventDefault();event.stopImmediatePropagation();event.target.click();}
  },true);
  window.addEventListener('resize',()=>{for(let i=0;i<2;i++)if(visiting[i]===null)render(i);window.refreshMemoryLayout?.();});
  drawAll();
})();



