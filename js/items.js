export function getItemById(items, id){ return items.find(i=>i.id===id); }

export function applyItemEffect(player, item){
  if(!item || !item.effect) return { ok:false, msg:'Неверный предмет' };
  if(item.effect.type === 'heal'){
    const before = player.health;
    player.health = Math.min(player.maxHealth, player.health + item.effect.value);
    return { ok:true, msg:`HP ${before} → ${player.health}` };
  }
  if(item.effect.type === 'equip') {
    player.strength += item.effect.value;
    return { ok:true, msg:`Сила увеличена на ${item.effect.value}` };
  }
  return { ok:false, msg:'Эффект не реализован' };
}