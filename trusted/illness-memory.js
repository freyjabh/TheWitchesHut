/* The Air coin, earned through the skull/mirror puzzle, recalls her childhood.
   Room props reuse the hut artwork; puzzle interactions will be built in the room. */
(() => {
  const memoryHerbs=Array.from({length:9},(_,n)=>({id:'childhood-herb-'+(n+1),src:'Grafik/2_ört'+(n+1)+'.png',fallback:'Grafik/1_ort'+(n+1)+'.'+(n===0?'PNG':'png'),name:'Herb '+(n+1)}));
  memoryHerbs.forEach(herb=>catalogAdd(herb.id,herb.name,'A herb from the childhood memory.',herb.src));
  const herbImage=herb=>`<img src="${herb.src}" alt="${herb.name}" onerror="this.onerror=null;this.src='${herb.fallback}'">`;
  window.inspectMemoryHerb=(layer,id)=>{
    const herb=memoryHerbs.find(herb=>herb.id===id);if(!herb)return;
    layer.querySelector('.illness-herb-modal')?.remove();
    const modal=document.createElement('div');modal.className='memory-modal illness-herb-modal';
    modal.innerHTML=`<article role="dialog" aria-modal="true" aria-label="${herb.name}"><button type="button" class="illness-herb-close" data-memory="dismiss" aria-label="Close">×</button>${herbImage(herb).replace('<img','<img data-memory="take-memory-herb" data-herb="'+id+'" role="button" tabindex="0" aria-label="Take herb"')}</article>`;
    modal.addEventListener('click',event=>{if(event.target===modal)modal.remove();});
    modal.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();modal.remove();layer.querySelector('[data-herb="'+id+'"]')?.focus();}if(event.key==='Tab'){event.preventDefault();const controls=[...modal.querySelectorAll('button,[role=button]')];const n=controls.indexOf(document.activeElement);controls[(n+(event.shiftKey?-1:1)+controls.length)%controls.length].focus();}});
    layer.append(modal);modal.querySelector('button').focus();
  };
  function enableMagnifier(modal){
    const image=modal.querySelector('article>img'),article=modal.querySelector('article');
    if(!image)return;
    image.classList.add('memory-magnifiable');
    const lens=document.createElement('div');lens.className='memory-magnifier';lens.hidden=true;lens.setAttribute('aria-hidden','true');article.append(lens);
    image.addEventListener('pointermove',event=>{
      if(!image.naturalWidth)return;
      const r=image.getBoundingClientRect(),a=article.getBoundingClientRect();
      const scale=Math.min(r.width/image.naturalWidth,r.height/image.naturalHeight);
      const width=image.naturalWidth*scale,height=image.naturalHeight*scale;
      const left=r.left+(r.width-width)/2,top=r.top+(r.height-height)/2;
      const x=event.clientX-left,y=event.clientY-top;
      if(x<0||y<0||x>width||y>height){lens.hidden=true;return;}
      const size=Math.min(190,a.width-12,a.height-12),zoom=2.8;
      lens.style.width=lens.style.height=size+'px';
      lens.style.left=Math.max(0,Math.min(a.width-size,event.clientX-a.left-size/2))+'px';
      lens.style.top=Math.max(0,Math.min(a.height-size,event.clientY-a.top-size/2))+'px';
      lens.style.backgroundImage='url("'+image.currentSrc+'")';
      lens.style.backgroundSize=width*zoom+'px '+height*zoom+'px';
      lens.style.backgroundPosition=(size/2-x*zoom)+'px '+(size/2-y*zoom)+'px';
      lens.hidden=false;
    });
    image.addEventListener('pointerleave',()=>lens.hidden=true);
    modal.addEventListener('keydown',()=>lens.hidden=true);
  }
  window.inspectMemoryBook=(layer,book)=>{
    if(book!=='1'&&book!=='2')return;
    layer.querySelector('.illness-book-modal')?.remove();
    const modal=document.createElement('div');modal.className='memory-modal illness-book-modal';
    modal.innerHTML=`<article role="dialog" aria-modal="true" aria-label="Open book ${book}"><button type="button" class="illness-herb-close" data-memory="dismiss" aria-label="Close">×</button><img src="Grafik/2_receptbok-${book}.png" alt="Recipe book ${book}" data-book="${book}"></article>`;
    modal.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();modal.remove();layer.querySelector('[data-memory="inspect-memory-book"][data-book="'+book+'"]')?.focus();}if(event.key==='Tab'){event.preventDefault();const controls=[...modal.querySelectorAll('button,[role=button]')];const n=controls.indexOf(document.activeElement);controls[(n+(event.shiftKey?-1:1)+controls.length)%controls.length].focus();}});
    layer.append(modal);enableMagnifier(modal);modal.querySelector('button').focus();
  };
  // Replace this with the supplied portrait asset when it is ready.
  const portraitImage=null;
  window.inspectMemoryPortrait=layer=>{
    const modal=document.createElement('div');modal.className='memory-modal illness-book-modal illness-portrait-modal';
    modal.innerHTML=`<article role="dialog" aria-modal="true" aria-label="Portrait"><button type="button" class="illness-herb-close" data-memory="dismiss" aria-label="Close">×</button>${portraitImage?'<img src="'+portraitImage+'" alt="Portrait">':'<p class="illness-portrait-placeholder">Portrait image coming soon</p>'}</article>`;
    modal.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();modal.remove();layer.querySelector('[data-memory="inspect-memory-portrait"]')?.focus();}if(event.key==='Tab'){event.preventDefault();modal.querySelector('button').focus();}});
    layer.append(modal);modal.querySelector('button').focus();
  };
  window.inspectMemoryKettle=(layer,brew)=>{
    const modal=document.createElement('div');modal.className='memory-modal illness-book-modal illness-kettle-modal';
    modal.innerHTML=`<article role="dialog" aria-modal="true" aria-label="Cauldron"><button type="button" class="illness-herb-close" data-memory="dismiss" aria-label="Close">×</button>${illnessKettleHTML(brew)}${!brew.solved?'<button type="button" class="illness-empty-brew" data-memory="empty-illness-brew">Empty pot</button>':''}</article>`;
    modal.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();modal.remove();layer.querySelector('[data-memory="inspect-memory-kettle"]')?.focus();}if(event.key==='Tab'){event.preventDefault();modal.querySelector('button').focus();}});
    layer.append(modal);modal.querySelector('button').focus();
  };
  document.addEventListener('keydown',event=>{
    if((event.key==='Enter'||event.key===' ')&&event.target.matches('[data-memory="inspect-memory-kettle"],[data-memory="inspect-memory-wall-art"],[data-memory="take-memory-herb"]')){event.preventDefault();event.target.click();}
  });
  window.inspectMemoryWallArt=(layer,kind)=>{
    const art=kind==='paper'?{src:'Grafik/morse-paper-blank.png',name:'Paper'}:kind==='plants'?{src:'Grafik/1_växttavla.png',name:'Botanical plant chart'}:null;
    if(!art)return;
    const modal=document.createElement('div');modal.className='memory-modal illness-book-modal illness-wall-art-modal';modal.dataset.wallArt=kind;
    modal.innerHTML=`<article role="dialog" aria-modal="true" aria-label="${art.name}"><button type="button" class="illness-herb-close" data-memory="dismiss" aria-label="Close">×</button><img src="${art.src}" alt="${art.name}"></article>`;
    modal.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();modal.remove();layer.querySelector('[data-wall-art="'+kind+'"]')?.focus();}if(event.key==='Tab'){event.preventDefault();modal.querySelector('button').focus();}});
    layer.append(modal);if(kind==='plants')enableMagnifier(modal);modal.querySelector('button').focus();
  };
  window.renderIllnessMemory=(layer,i,progress)=>{
    layer.innerHTML=`<section class="memory-scene illness-scene" aria-label="Childhood memory room">
      <div class="illness-stage"><img class="illness-background" src="Grafik/2_player${i+1}.png" alt="${i===0?'A woman tends a sick mother while two younger children wait beside her bed.':'A young girl stands beside the healer. A portrait and candle sit on a shelf; books lie on the table.'}">
      ${i===0?`<div class="illness-prop illness-shelf" data-layout-id="illness-shelf" role="group" aria-label="Wall shelf with herbs">
      <img class="illness-shelf-art" src="Grafik/0_vagghylla.PNG" alt="Wooden wall shelf">
      ${memoryHerbs.map((herb,n)=>progress.herbsTaken?.[i]?.includes(herb.id)?'':`<button type="button" class="illness-herb" data-memory="inspect-herb" data-herb="${herb.id}" aria-label="Inspect herb ${n+1}" style="left:${20+n*6.65}%">${herbImage(herb)}</button>`).join('')}</div>
      <img class="illness-prop illness-burning-wood" data-layout-id="illness-burning-wood" src="Grafik/2_ved.brinner.png" alt="Burning firewood">
      <img class="illness-prop illness-kettle" data-layout-id="illness-kettle" data-memory="inspect-memory-kettle" role="button" tabindex="0" aria-label="Inspect the cauldron" src="Grafik/0_kittel.PNG" alt="Cauldron">`:
      `<img class="illness-prop illness-plant-chart" data-layout-id="illness-plant-chart" data-memory="inspect-memory-wall-art" data-wall-art="plants" role="button" tabindex="0" src="Grafik/1_växttavla.png" alt="Botanical plant chart">
      <img class="illness-prop illness-board-paper" data-layout-id="illness-board-paper" data-memory="inspect-memory-wall-art" data-wall-art="paper" role="button" tabindex="0" src="Grafik/morse-paper-blank.png" alt="Blank paper on the board">
      <button type="button" class="illness-book-hotspot illness-portrait-hotspot" data-memory="inspect-memory-portrait" aria-label="Inspect the portrait on the shelf"></button>
      <button type="button" class="illness-book-hotspot illness-book-left" data-memory="inspect-memory-book" data-book="1" aria-label="Open the left book on the table"></button>
      <button type="button" class="illness-book-hotspot illness-book-right" data-memory="inspect-memory-book" data-book="2" aria-label="Open the right book on the table"></button>`}</div>
      <button class="illness-return" data-memory="leave">Return to hut</button>
      ${illnessBrewState(progress).solved&&!progress.puzzlePieces?.includes(8)?`<button type="button" class="illness-piece-reward" data-memory="collect-illness-piece" aria-label="Collect puzzle piece">${illnessPieceSVG}</button>`:''}
    </section>`;
    requestAnimationFrame(()=>window.refreshMemoryLayout?.());
  };
})();
