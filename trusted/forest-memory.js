/* Memory 3: both players identify the same location in different paintings. */
(() => {
  const objects=[
    ['branch',20.5,5,10,17,['Owl','Squirrel'],true],
    ['rock',12.5,79,8,9,['Snail','Beetle'],true],
    ['stream',57,73,10,11,['Frog','Mouse'],true],
    ['trunk',89,25,10,12,['Moth','Dragonfly'],true],
    ['lily',50.5,88,6,6,['Waterlily flower','Oak leaf'],true],
    ['raven',75,3,11,14,['Raven','Raven']],
    ['lantern-left',36,23,5,9,['Hanging lantern','Hanging lantern']],
    ['lantern-right',79.5,22,6,10,['Hanging lantern','Hanging lantern']],
    ['door',14,44,9,27,['Tree door','Tree door']],
    ['door-lantern',24,44,5,10,['Door lantern','Door lantern']],
    ['mushroom',33,55,9,10,['Spotted mushroom','Spotted mushroom']],
    ['bridge',47,44,20,13,['Stone bridge','Stone bridge']],
    ['cottage',64,16,12,17,['Cottage','Cottage']],
    ['moth-lower',89,39,10,9,['Orange moth','Orange moth']],
    ['moon-stone',77.5,35,5,9,['Moon stone','Moon stone']],
    ['rune-stone',80,45,5,9,['Rune stone','Rune stone']],
    ['spiral-stone',68,80,9,12,['Spiral stone','Spiral stone']],
    ['berries',88,62,11,18,['Berries','Berries']],
    ['flowers',5,71,8,10,['White flowers','White flowers']],
    ['shelf-fungi',4,27,14,21,['Bracket fungi','Bracket fungi']],
    ['reeds',43,58,8,15,['Reeds','Reeds']],
    ['mushrooms-right',89,86,10,12,['Brown mushrooms','Brown mushrooms']]
  ];
  const data=p=>p.forestPainting??={found:[],selections:[null,null],notice:['Compare your paintings. Both select the same place where you see different objects.','Compare your paintings. Both select the same place where you see different objects.']};
  window.renderForestMemory=(layer,i,progress)=>{
    const s=data(progress),solved=s.found.length===5;
    layer.innerHTML=`<section class="memory-scene forest-memory" aria-label="Memory 3 painting"><div class="forest-toolbar"><button data-memory="leave">Return to hut</button><span>Differences found: ${s.found.length} / 5</span></div><div class="forest-painting"><img src="Grafik/minne3-skog-spelare${i+1}.png" alt="An enchanted forest painting" draggable="false">${objects.map(([id,x,y,w,h,names])=>`<button type="button" class="forest-object ${s.found.includes(id)?'found':''} ${s.selections[i]===id?'selected':''}" data-memory="forest" data-object="${id}" aria-label="${names[i]}" aria-pressed="${s.selections[i]===id}" ${solved||s.found.includes(id)?'disabled':''} style="left:${x}%;top:${y}%;width:${w}%;height:${h}%"></button>`).join('')}</div><p class="forest-notice" role="status">Ask your friend what they see</p>${solved&&!progress.puzzlePieces?.includes(3)?`<button class="forest-reward" data-memory="forest" data-object="collect">${window.illnessPieceSVG||''} Collect puzzle piece</button>`:''}</section>`;
  };
  window.handleForestMemory=(button,i,progress,visiting)=>{
    const s=data(progress),id=button.dataset.object;
    if(id==='collect'){
      if(s.found.length!==5)return;
      progress.puzzlePieces??=[];if(!progress.puzzlePieces.includes(3))progress.puzzlePieces.push(3);return;
    }
    if(s.found.length===5||s.found.includes(id)||!objects.some(o=>o[0]===id))return;
    s.selections[i]=id;s.notice[i]='Your place is selected. Waiting for your companion to choose.';
    if(!visiting.every(n=>n===3)){s.notice[i]='Your place is selected. Your companion must enter this memory too.';return;}
    if(s.selections.every(Boolean)){
      const correct=s.selections[0]===s.selections[1]&&objects.some(o=>o[0]===id&&o[6]);
      if(correct){s.found.push(id);s.notice=['You both found a difference.','You both found a difference.'];}
      else s.notice=['Those choices do not identify a difference. Compare your views and try again.','Those choices do not identify a difference. Compare your views and try again.'];
      s.selections=[null,null];
    }
  };
})();
