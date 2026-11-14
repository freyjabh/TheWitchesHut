(() => {
  'use strict';
  const storageKey = 'witch-hut-settings-v1';
  const defaults = { brightness: 100, contrast: 100, saturation: 100, volume: 70 };
  const controls = [
    { key: 'brightness', label: 'Brightness', min: 0, max: 200 },
    { key: 'contrast', label: 'Contrast', min: 50, max: 150 },
    { key: 'saturation', label: 'Saturation', min: 0, max: 150 },
    { key: 'volume', label: 'Sound volume', min: 0, max: 100, hint: 'Saved for future audio. The game has no audio yet.' }
  ];
  let saved;
  try { saved = JSON.parse(localStorage.getItem(storageKey)); } catch {}
  const settings = { ...defaults };
  for (const { key, min, max } of controls) {
    if (typeof saved?.[key] === 'number' && Number.isFinite(saved[key])) {
      settings[key] = Math.max(min, Math.min(max, Math.round(saved[key])));
    }
  }
  const dialog = document.createElement('dialog');
  dialog.className = 'settings-dialog';
  dialog.setAttribute('aria-labelledby', 'settings-title');
  dialog.innerHTML = `<div class="settings-heading"><h2 id="settings-title">Settings</h2><button type="button" class="settings-close" aria-label="Close settings" autofocus>×</button></div>
    <p class="settings-description">Adjust the light and atmosphere of the hut.</p>
    ${controls.map(({ key, label, min, max, hint }) => `<label class="settings-control" for="setting-${key}"><span class="settings-label"><span>${label}</span><output id="value-${key}" for="setting-${key}"></output></span><input id="setting-${key}" data-setting="${key}" type="range" min="${min}" max="${max}" step="1"${hint ? ` aria-describedby="hint-${key}"` : ''}>${hint ? `<span class="settings-hint" id="hint-${key}">${hint}</span>` : ''}</label>`).join('')}
    <div class="settings-footer"><button type="button" data-settings-reset>Restore defaults</button><button type="button" data-settings-done>Done</button></div>
    <div class="settings-game-reset"><button type="button" data-settings-reset-game>Reset game</button><p>Restart the game for both players. Your room layout is kept.</p></div>`;
  document.body.append(dialog);
  function apply() {
    document.documentElement.classList.toggle('lights-out', settings.brightness === 0);
    for (const { key } of controls) {
      dialog.querySelector(`[data-setting="${key}"]`).value = settings[key];
      dialog.querySelector(`#value-${key}`).value = `${settings[key]} %`;
      if (key !== 'volume') document.documentElement.style.setProperty(`--game-${key}`, settings[key] / 100);
    }
    document.querySelectorAll('audio, video').forEach(media => { media.volume = settings.volume / 100; });
    window.dispatchEvent(new CustomEvent('game-settings-change', { detail: { ...settings } }));
  }
  function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify(settings)); } catch {}
  }
  dialog.addEventListener('input', event => {
    const key = event.target.dataset.setting;
    if (!Object.hasOwn(defaults, key)) return;
    settings[key] = Number(event.target.value);
    apply();
    persist();
  });
  document.querySelectorAll('.player > h2').forEach(heading => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'player-settings-button';
    button.setAttribute('aria-label', 'Settings');
    button.setAttribute('aria-haspopup', 'dialog');
    button.title = 'Settings';
    button.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m9 3-.6 2.4-2 .9L4 5.6 2 9l1.8 1.7v2.6L2 15l2 3.4 2.4-.7 2 .9L9 21h4l.6-2.4 2-.9 2.4.7 2-3.4-1.8-1.7v-2.6L20 9l-2-3.4-2.4.7-2-.9L13 3Z"/><circle cx="11" cy="12" r="3.2"/></svg>';
    button.addEventListener('click', () => dialog.showModal());
    heading.append(button);
  });
  dialog.querySelector('.settings-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-settings-done]').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-settings-reset-game]').addEventListener('click', () => {
    dialog.close();
    document.querySelector('#reset-game').click();
  });
  dialog.querySelector('[data-settings-reset]').addEventListener('click', () => {
    Object.assign(settings, defaults);
    apply();
    persist();
  });
  apply();
})();
