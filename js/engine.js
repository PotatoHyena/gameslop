import { getItemById, applyItemEffect } from './items.js';
import { addItemToInventory, removeItemFromInventory } from './player.js';
import { talkToNpc } from './npc.js';
import { runBattle } from './battle.js';
import { out, updateStatus } from './ui.js';

export function describeLocation(state, data){
  const loc = data.locations.find(l=>l.id===state.player.locationId);
  if(!loc){ out('Локация не найдена'); return; }
  out(`<strong>${loc.name}</strong>: ${loc.description}`);
  if(loc.items && loc.items.length) out('Здесь: ' + loc.items.map(id=>getItemById(data.items,id).name).join(', '));
  if(loc.npcs && loc.npcs.length) out('Здесь: ' + loc.npcs.map(id=>data.npcs.find(n=>n.id===id).name).join(', '));
}

export function move(state, dir, data){
  const loc = data.locations.find(l=>l.id===state.player.locationId);
  const next = loc.exits && loc.exits[dir];
  if(!next){ out('Нельзя идти в этом направлении.'); return; }
  state.player.locationId = next;
  state.history.push(`Перешёл в ${next}`);
  describeLocation(state, data);
  updateStatus(state.player, data.items, data.locations);
}

export function take(state, itemName, data){
  const loc = data.locations.find(l=>l.id===state.player.locationId);
  const foundId = loc.items && loc.items.find(id => getItemById(data.items,id).name.toLowerCase() === itemName.toLowerCase());
  if(!foundId){ out('Такого предмета здесь нет.'); return; }
  loc.items = loc.items.filter(i=>i!==foundId);
  addItemToInventory(state.player, foundId);
  out('Вы взяли: ' + getItemById(data.items,foundId).name);
  state.history.push('Взял '+foundId);
  updateStatus(state.player, data.items, data.locations);
}

export function useItem(state, name, data){
  const inv = state.player.inventory;
  const foundId = inv.find(id => getItemById(data.items,id).name.toLowerCase() === name.toLowerCase());
  if(!foundId){ out('У вас нет такого предмета.'); return; }
  const item = getItemById(data.items, foundId);
  const res = applyItemEffect(state.player, item);
  if(res.ok){
    removeItemFromInventory(state.player, foundId);
    out(res.msg);
    state.history.push('Использовал '+foundId);
    updateStatus(state.player, data.items, data.locations);
  } else {
    out(res.msg);
  }
}

export function talk(state, npcName, data){
  const npc = data.npcs.find(n=>n.name.toLowerCase() === npcName.toLowerCase() || n.id === npcName);
  if(!npc){ out('Такого NPC нет.'); return; }
  const r = talkToNpc(state, npc.id, data);
  if(r.ok) out(r.text); else out(r.msg);
  updateStatus(state.player, data.items, data.locations);
}

export function fight(state, enemyTemplate){
  return runBattle(state, Object.assign({}, enemyTemplate), {});
}