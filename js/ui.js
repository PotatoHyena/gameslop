export function out (text) {

  const o = document.getElementById('output');
  const el = document.createElement('div');
  el.innerHTML = text;
  o.appendChild(el);
  o.scrollTop = o.scrollHeight;
}

export function updateStatus(player, items, locations) {
    
  document.getElementById('playerName').textContent = player.name || '—';
  document.getElementById('hp').textContent = player.health + '/' + player.maxHealth;
  document.getElementById('lvl').textContent = player.level;
  document.getElementById('exp').textContent = player.exp;
  document.getElementById('inv').textContent = player.inventory.map(id => items.find(i=>i.id===id)?.name || id).join(', ') || 'Пусто';
  const loc = locations.find(l=>l.id===player.locationId);
  document.getElementById('loc').textContent = loc ? loc.name : '—';
}