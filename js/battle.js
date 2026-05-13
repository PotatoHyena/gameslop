import { gainExp } from './player.js';
import { out } from './ui.js';

function computeDamage (attacker, defender) {
  const base = attacker.strength || 1;
  const variance = Math.floor(Math.random()*3);
  const crit = Math.random() < 0.12 ? 2 : 1;
  const dmg = Math.max(1, Math.floor((base + variance - (defender.defense || 0)) * crit));
  return { dmg, crit: crit>1 };
}

export function runBattle (state, enemy, data) {
  out(`Сражение началось: ${enemy.name} (HP ${enemy.health})`);
  while(enemy.health > 0 && state.player.health > 0){
    // ход игрока
    const pd = computeDamage(state.player, enemy);
    enemy.health -= pd.dmg;
    out(`Вы наносите ${pd.dmg} урона${pd.crit? ' (крита!)':''}. (${enemy.name}: ${Math.max(0,enemy.health)} HP)`);
    if(enemy.health <= 0) break;
    // ход врага
    const ed = computeDamage(enemy, state.player);
    state.player.health -= ed.dmg;
    out(`${enemy.name} наносит вам ${ed.dmg} урона${ed.crit? ' (крита!)':''}. (Вы: ${Math.max(0, state.player.health)} HP)`);
    if(state.player.health <= 0) break;
  }
  if(state.player.health > 0){
    out(`Вы победили ${enemy.name}!`);
    state.player.exp += enemy.exp || 10;
    const lvl = gainExp(state.player, enemy.exp || 10);
    if(lvl.leveled) out(`Поздравляем — уровень ${lvl.newLevel}!`);
    state.history.push(`Победил ${enemy.id}`);
    return { result:'win' };
  } else {
    out('Вы были побеждены.');
    state.player.locationId = 'village';
    state.player.health = Math.floor(state.player.maxHealth / 2);
    state.history.push(`Поражение от ${enemy.id}`);
    return { result:'lose' };
  }
}