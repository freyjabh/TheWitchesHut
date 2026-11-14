/* Memory 2 mechanics sandbox. Shared state lives in the existing memory save. */
(() => {
  const latin=['Noctiluna','Verridra','Sanguinor','Luminthra','Caelthym','Umbrafol','Ignispetra','Mortelana','Aetheris'];
  const english=['Moonblossom','Greenvein','Bloodmoss','Starroot','Skythyme','Shadowleaf','Firepetal','Deathbloom','Windfern'];
  const orders=[[0,4,7,2,8,1,6,3,5],[5,2,0,8,3,6,1,7,4]];
  // Each pair contains the request shown to P1 and the request shown to P2.
  const legacyRounds=[[0,4],[7,1],[2,8],[5,3],[6,0]];
  function questions(previous=[],failed=[]){
    const pools=[Array.from({length:9},(_,n)=>n),Array.from({length:9},(_,n)=>n)];
    const pick=(pool,excluded)=>{const options=pool.filter(n=>!excluded.includes(n));const n=options[Math.floor(Math.random()*options.length)];pool.splice(pool.indexOf(n),1);return n;};
    return Array.from({length:5},(_,r)=>{
      const a=pick(pools[0],[previous[r]?.[0],...(r===0?[failed[0]]:[])]);
      const b=pick(pools[1],[a,previous[r]?.[1],...(r===0?[failed[1]]:[])]);
      return [a,b];
    });
  }
  const fresh=previous=>({phase:'study',previousQuestions:previous,questions:questions(previous),round:0,ready:[false,false],choices:[null,null],confirmed:[false,false],books:[false,false],examOpen:[false,false],notice:'Study the plants together, then both start the test.'});
  const data=p=>{const s=p.apprentice??=fresh();s.questions??=legacyRounds.map(pair=>[...pair]);s.examOpen??=[false,false];return s;};
  const image=n=>`<img src="Grafik/2_ört${n+1}.png" alt="Plant specimen ${n+1}" draggable="false">`;
  const names=i=>i===0?latin:english;
  const book=i=>`Grafik/minne2-vaxtbok-${i===0?'latin':'engelska'}-v1.png`;
  const control=(action,text,extra='')=>`<button type="button" data-memory="apprentice" data-ap="${action}" ${extra}>${text}</button>`;
  let dragging=null,keyboardPlant=null;
  const editing=()=>document.body.classList.contains('layout-editing');
  function dropPlant(table,n){
    if(!table?.isConnected)return;
    const command=document.createElement('button');command.hidden=true;command.dataset.memory='apprentice';command.dataset.ap='drop';command.dataset.plant=n;table.append(command);command.click();command.remove();
  }
  function clearDrag(){
    if(dragging){dragging.ghost.remove();dragging.source.classList.remove('ap-dragging');dragging.table.classList.remove('ap-drag-active');}
    dragging=null;
  }
  document.addEventListener('pointerdown',event=>{
    const source=event.target.closest('.ap-plant');if(!source||editing()||event.button!==0)return;
    clearDrag();const table=source.closest('.ap-exam-table'),r=table.getBoundingClientRect(),s=source.getBoundingClientRect();
    const ghost=document.createElement('div');ghost.className='ap-drag-preview';ghost.innerHTML=image(Number(source.dataset.plant));ghost.style.width=s.width/r.width*100+'%';ghost.style.height=s.height/r.height*100+'%';table.append(ghost);
    dragging={source,table,ghost,id:event.pointerId,n:Number(source.dataset.plant)};
    source.classList.add('ap-dragging');table.classList.add('ap-drag-active');
    ghost.style.left=(event.clientX-r.left)/r.width*100+'%';ghost.style.top=(event.clientY-r.top)/r.height*100+'%';
    try{source.setPointerCapture(event.pointerId);}catch{}
    event.preventDefault();
  },true);
  document.addEventListener('pointermove',event=>{
    if(!dragging||event.pointerId!==dragging.id)return;
    if(!dragging.table.isConnected||editing()){clearDrag();return;}
    const r=dragging.table.getBoundingClientRect();dragging.ghost.style.left=(event.clientX-r.left)/r.width*100+'%';dragging.ghost.style.top=(event.clientY-r.top)/r.height*100+'%';event.preventDefault();
  },true);
  document.addEventListener('pointerup',event=>{
    if(!dragging||event.pointerId!==dragging.id)return;
    const {table,n}=dragging,r=table.querySelector('.ap-bowl')?.getBoundingClientRect();
    const inside=r&&event.clientX>=r.left&&event.clientX<=r.right&&event.clientY>=r.top&&event.clientY<=r.bottom;
    clearDrag();if(inside&&!editing())dropPlant(table,n);
  },true);
  document.addEventListener('pointercancel',clearDrag,true);
  window.addEventListener('blur',clearDrag);
  document.addEventListener('keydown',event=>{
    const scene=event.target.closest('.apprentice-scene');if(!scene||editing())return;
    if(event.key==='Escape'){
      const close=scene.querySelector('.ap-book-overlay [data-ap="book"],.ap-exam-overlay [data-ap="close-exam"]');
      if(close){event.preventDefault();close.click();}keyboardPlant=null;clearDrag();return;
    }
    if(event.key!==' '&&event.key!=='Enter')return;
    const source=event.target.closest('.ap-plant'),bowl=event.target.closest('.ap-bowl');
    if(source){event.preventDefault();event.stopImmediatePropagation();keyboardPlant={table:source.closest('.ap-exam-table'),n:Number(source.dataset.plant)};keyboardPlant.table.querySelector('.ap-bowl').focus();}
    else if(bowl&&keyboardPlant?.table===bowl.closest('.ap-exam-table')){event.preventDefault();event.stopImmediatePropagation();dropPlant(keyboardPlant.table,keyboardPlant.n);keyboardPlant=null;}
  },true);
  window.renderApprenticeMemory=(layer,i,progress)=>{
    const s=data(progress),study=s.phase==='study',solved=s.phase==='solved';
    layer.innerHTML=`<section class="memory-scene apprentice-scene" data-ap-player="${i}" aria-label="Apprenticeship mechanics test">
      <button type="button" class="ap-leave" data-memory="leave" aria-label="Return to hut" title="Return to hut">←</button>
      <div class="ap-painted-targets" style="--ap-art-ratio:${i===0?'1177 / 823':'1448 / 1086'};--ap-art-scale:${i===0?1177/823:1448/1086}">
        ${control('book','',`class="ap-book ap-painted-hotspot" aria-label="Study plant book" title="Study plant book" ${s.phase==='exam'?'disabled':''}`)}
        ${control('bowl','','class="ap-open-bowl ap-painted-hotspot" aria-label="Open plant test" title="Open plant test"')}
      </div>
      ${s.examOpen[i]?`<div class="ap-exam-overlay" role="dialog" aria-modal="true" aria-label="Plant test"><div class="ap-exam-content">
      <header><strong>Plant test · ${s.round}/5 pairs</strong>${control('close-exam','Back to desk')}</header>
      <p class="ap-notice" role="status">${s.notice}</p>
      ${study?`<div class="ap-test-intro"><p>Identify the plant your companion requests. Both players must confirm each pair. Five correct pairs complete the lesson; a mistake restarts the test with new questions.</p><p>Books are unavailable to both players during the test. You may use your notepad.</p>${control('start',s.ready[i]?'Waiting for your companion…':'Start test',s.ready[i]?'disabled':'')}</div>`:''}
      ${s.phase==='exam'?`<div class="ap-exam-table"><img class="ap-table-art" src="Grafik/2_skrivbordsyta.png" alt="Wooden desktop"><div class="ap-request"><img src="Grafik/3_lapp.${names(i)[s.questions[s.round][i]].toLowerCase()}.png" alt="${names(i)[s.questions[s.round][i]]}"></div>`:''}
      ${s.phase==='exam'?`<div class="ap-plants" aria-label="Nine plant specimens">${orders[i].map((n,slot)=>control('choose',image(n),`class="ap-plant apprentice-prop ${s.choices[i]===n?'chosen':''}" data-layout-id="herb-${n}" data-plant="${n}" style="left:${8+(slot%5)*10.2}%;top:${32+Math.floor(slot/5)*26}%;width:10.2%;height:26%;rotate:${slot%3===2?-26:slot%2?16:-13}deg" aria-label="Drag specimen ${n+1} to the bowl" aria-pressed="${s.choices[i]===n}"`)).join('')}</div>`:''}
      ${s.phase==='exam'?`<div class="ap-submit"><div class="ap-tray apprentice-prop" data-layout-id="bowl" aria-label="Bowl for your chosen plant"><div class="ap-bowl" tabindex="0" role="button" aria-label="Bowl: press Enter to drop the plant you picked up"><img class="ap-bowl-art" src="Grafik/3_skal.png" alt="Wooden bowl">${s.choices[i]!==null?`<div class="ap-bowl-plant">${image(s.choices[i])}</div>`:''}</div><span>${s.choices[i]!==null?'Your chosen plant':'Drag a plant into the bowl'}</span></div><div>${control('confirm',s.confirmed[i]?'Confirmed · waiting…':'Ready',s.choices[i]===null||s.confirmed[i]?'disabled':'')}<p>You can change your plant while waiting.</p>${control('study','Return to studies · restart test')}</div></div>`:''}
      ${s.phase==='exam'?'</div>':''}
      ${solved?`<div class="ap-success"><p>The wise woman accepts your work. Five pairs correctly identified.</p>${progress.puzzlePieces?.includes(2)?'<p>Puzzle piece collected ✓</p>':control('collect',window.illnessPieceSVG||'Collect puzzle piece','class="ap-piece" aria-label="Collect apprenticeship puzzle piece"')}${control('restart','Test: restart lesson')}</div>`:''}
      </div></div>`:''}
      ${s.phase!=='exam'&&s.books[i]?`<div class="ap-book-overlay" role="dialog" aria-modal="true" aria-label="${i===0?'Latin':'English'} plant book">${control('book','Close book')}<img src="${book(i)}" alt="Nine plants with ${i===0?'Latin':'English'} names"></div>`:''}
    </section>`;
    requestAnimationFrame(()=>window.refreshMemoryLayout?.());
  };
  window.handleApprenticeMemory=(button,i,progress,visiting)=>{
    const s=data(progress),action=button.dataset.ap;
    if(action==='book'&&s.phase!=='exam'){s.books[i]=!s.books[i];s.examOpen[i]=false;s.ready[i]=false;}
    if(action==='bowl'){
      if(s.phase==='study'&&!s.examOpen.some(Boolean)){s.questions=questions(s.previousQuestions||s.questions,s.lastFailed);s.round=0;s.ready=[false,false];}
      s.books[i]=false;s.examOpen[i]=true;
    }
    if(action==='close-exam'){
      if(s.phase==='exam'){progress.apprentice=fresh(s.questions);progress.apprentice.notice='Test closed. Study your books, then open the bowl for a new test.';}
      else {s.examOpen[i]=false;if(s.phase==='study')s.ready[i]=false;}
    }
    if(action==='start'&&s.phase==='study'&&s.examOpen[i]){
      s.ready[i]=true;
      if(s.ready.every(Boolean)&&s.examOpen.every(Boolean)&&visiting.every(n=>n===2)){s.phase='exam';s.books=[false,false];s.notice='Describe your request. Drag the plant your companion asks for into the bowl, then both confirm.';}
      else s.notice='Waiting for both players to enter this memory and start the test.';
    }
    if(action==='drop'&&s.phase==='exam'&&s.examOpen[i]){
      const n=Number(button.dataset.plant);if(!Number.isInteger(n)||n<0||n>8)return;
      s.choices[i]=n;s.confirmed[i]=false;
    }
    if(action==='confirm'&&s.phase==='exam'&&s.examOpen[i]&&s.choices[i]!==null&&visiting.every(n=>n===2)){
      s.confirmed[i]=true;
      if(s.confirmed.every(Boolean)){
        const pair=s.questions[s.round],correct=s.choices[0]===pair[1]&&s.choices[1]===pair[0];
        if(correct){s.round++;s.notice='Correct. The wise woman gives you the next pair.';if(s.round===s.questions.length){s.phase='solved';s.notice='The lesson is complete.';}}
        else {progress.apprentice=fresh(s.questions);progress.apprentice.lastFailed=pair;progress.apprentice.notice='“Keep studying, fool!” Open the bowl when you are ready to try a new test.';}
        s.choices=[null,null];s.confirmed=[false,false];
      }else s.notice='One choice confirmed. Waiting for the other player.';
    }
    if(action==='study'&&s.phase==='exam'){progress.apprentice=fresh(s.questions);progress.apprentice.notice='Back to studying. Both players must start the test again.';}
    if(action==='restart'&&s.phase==='solved')progress.apprentice=fresh(s.questions);
    if(action==='collect'&&s.phase==='solved'){progress.puzzlePieces??=[];if(!progress.puzzlePieces.includes(2))progress.puzzlePieces.push(2);}
  };
})();
