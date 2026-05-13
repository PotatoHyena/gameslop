export function createPlayer (name='goga') {
  return {
    id: 'player1',
    name,
    health: 100,
    maxHealth: 100,
    strength: 5,
    defense: 1,
    level: 1,
    exp: 0,
    inventory: [],
    locationId: 'village',
    equipment: {}
  };
}

export function addItemToInventory (player, itemId) {
  player.inventory.push(itemId);
}

export function removeItemFromInventory (player, itemId) {
  player.inventory = player.inventory.filter(id=>id!==itemId);
}

export function gainExp (player, amount) {
  player.exp += amount;
  const need = player.level * 20;
  if(player.exp >= need){
    player.exp -= need;
    player.level += 1;
    player.maxHealth += 10;
    player.health = player.maxHealth;
    player.strength += 2;
    return { leveled:true, newLevel:player.level };
  }
  return { leveled:false };
}