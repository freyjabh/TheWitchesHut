/* Shared childhood-memory brew. Ingredients remain in each player's bag. */
(() => {
  const recipes=[[1,3,5,7],[2,4,6,8],[1,4,5,9]];
  const reaction=n=>n<=2?'milk':n<=4?'bubbles':n<=6?'steam':'gold';
  window.illnessBrewState=progress=>{
    if(!progress.illnessBrew)progress.illnessBrew={ingredients:[],effect:'clear',spoiled:false,solved:false};
    return progress.illnessBrew;
  };
  window.addIllnessIngredient=(progress,id)=>{
    const brew=window.illnessBrewState(progress);
    if(brew.solved)return 'The medicine is already complete.';
    if(brew.spoiled)return 'Empty the spoiled brew before trying again.';
    if(!/^childhood-herb-[1-9]$/.test(id||''))return 'Select a herb in your memory inventory first.';
    const n=Number(id.split('-').at(-1)),next=[...brew.ingredients,n];
    if(brew.ingredients.includes(n)||!recipes.some(recipe=>next.every(herb=>recipe.includes(herb)))){
      brew.effect='smoke';brew.spoiled=true;
      return 'Black smoke rises. The entire brew is spoiled.';
    }
    brew.ingredients=next;brew.effect=reaction(n);
    if(next.length===4)brew.solved=true;
    return {milk:'The liquid turns milky white.',bubbles:'Slow bubbles rise and burst.',steam:'Thin white steam rises.',gold:'The liquid becomes clear and golden.'}[brew.effect];
  };
  window.emptyIllnessBrew=progress=>{
    if(window.illnessBrewState(progress).solved)return false;
    progress.illnessBrew={ingredients:[],effect:'clear',spoiled:false,solved:false};return true;
  };
  window.illnessPieceSVG='<svg viewBox="0 0 80 80" aria-hidden="true"><path d="M8 8h22c-5 17 19 17 14 0h23v22c-17-5-17 19 0 14v23H44c5-17-19-17-14 0H8V44c17 5 17-19 0-14Z" fill="#cba665" stroke="#503b23" stroke-width="3"/></svg>';
  window.illnessKettleHTML=brew=>`<div class="illness-kettle-picture" data-memory="inspect-memory-kettle" role="button" tabindex="0" aria-label="Add selected herb to the cauldron"><img src="Grafik/0_kittel.PNG" alt="Cauldron"><div class="illness-brew-effect" data-effect="${brew.effect}" aria-hidden="true"><div class="illness-liquid"></div>${Array.from({length:6},(_,n)=>`<i style="--n:${n}"></i>`).join('')}</div></div>`;
})();
