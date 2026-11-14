// Decorative locks follow the existing box sprites, including saved layout edits.
(() => {
  const frames = new Map();
  let pending = false;
  const resize = new ResizeObserver(schedule);
  function schedule() {
    if (!pending) { pending = true; requestAnimationFrame(update); }
  }
  function update() {
    pending = false;
    for (const [box, frame] of frames) {
      if (!box.isConnected || box.src.includes('.oppen.')) {
        resize.unobserve(box); frame.remove(); frames.delete(box);
      }
    }
    document.querySelectorAll('.room-box.east-box,.room-box.south-box').forEach(box => {
      if (box.src.includes('.oppen.')) return;
      let frame = frames.get(box);
      if (!frame) {
        frame = document.createElement('span');
        frame.className = 'room-combination-lock';
        frame.setAttribute('aria-hidden', 'true');
        frame.innerHTML = '<span><img src="Grafik/1_kodlas2.png" alt=""></span>';
        box.after(frame); frames.set(box, frame); resize.observe(box);
      }
      const css = getComputedStyle(box);
      frame.style.cssText = `position:absolute;pointer-events:none;left:${box.offsetLeft}px;top:${box.offsetTop}px;width:${box.offsetWidth}px;height:${box.offsetHeight}px;rotate:${css.rotate};transform:${css.transform};transform-origin:${css.transformOrigin};z-index:${css.zIndex}`;
      const scale = Math.min(box.clientWidth / (box.naturalWidth || 1448), box.clientHeight / (box.naturalHeight || 1086));
      const width = (box.naturalWidth || 1448) * scale, height = (box.naturalHeight || 1086) * scale;
      frame.firstElementChild.style.cssText = `position:absolute;left:${(box.clientWidth-width)/2}px;top:${(box.clientHeight-height)/2}px;width:${width}px;height:${height}px`;
    });
  }
  const style = document.createElement('style');
  style.textContent = '.room-combination-lock img{position:absolute;left:31%;top:55%;width:25%;height:auto;filter:drop-shadow(1px 2px 1px #21140ca0);pointer-events:none}';
  document.head.append(style);
  new MutationObserver(records => {
    if (records.some(record => record.type === 'attributes'
      ? record.target.matches('.room-box')
      : [...record.addedNodes, ...record.removedNodes].some(node => node.nodeType === 1 && (node.matches('.room-box') || node.querySelector('.room-box'))))) schedule();
  }).observe(document.querySelector('#players'), {subtree:true,childList:true,attributes:true,attributeFilter:['src','style','class']});
  document.addEventListener('load', event => {if(event.target.matches?.('.room-box')) schedule();}, true);
  window.addEventListener('resize', schedule);
  schedule();
})();
