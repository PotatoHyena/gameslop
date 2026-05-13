export function getNpcById (npcs, id) { 
    return npcs.find(n=>n.id===id); 
}

export function talkToNpc (state, npcId, data) {
  const loc = data.locations.find(l=>l.id===state.player.locationId);
  if(!loc || !loc.npcs.includes(npcId)) return { ok:false, msg:'NPC не здесь' };
  const npc = getNpcById(data.npcs, npcId);
  const line = (npc.dialogues && npc.dialogues[0]) || '';
  state.history.push(`Поговорил с ${npcId}`);
  return { ok:true, text: `${npc.name} говорит: "${line}"` };
}