import * as Engine from './engine.js';
import { out } from './ui.js';

const COMMANDS = [
  { names: ['старт','start'], exec: (s,a,d)=> {
      const name = a.join(' ') || prompt('Введите имя персонажа:') || 'goga';
      s.player.name = name;
      s.player.health = s.player.maxHealth = 100;
      s.player.strength = 5;
      s.player.level = 1;
      s.player.exp = 0;
      s.player.inventory = [];
      s.player.locationId = 'village';
      s.history = [];
      out('Игра начата. Привет, ' + s.player.name + '!');
      Engine.describeLocation(s,d);
      window.dispatchEvent(new Event('stateUpdated'));
  }},

  { names: ['идти','go'], exec: (s,a,d)=> Engine.move(s, a[0], d) },
  { names: ['осмотреть','look'], exec: (s,a,d)=> Engine.describeLocation(s,d) },
  { names: ['взять','take','get'], exec: (s,a,d)=> Engine.take(s, a.join(' '), d) },
  { names: ['использовать','use'], exec: (s,a,d)=> Engine.useItem(s, a.join(' '), d) },
  { names: ['говорить','talk'], exec: (s,a,d)=> Engine.talk(s, a.join(' '), d) },
  { names: ['сражаться','fight'], exec: (s,a,d)=> {
      const enemy = { id:'wolf', name:'Волк', health:30, strength:4, defense:0, exp:15 };
      Engine.fight(s, enemy);
  }},
  { names: ['сохранить','save'], exec: ()=> window.dispatchEvent(new Event('requestSave')) },
  { names: ['загрузить','load'], exec: ()=> window.dispatchEvent(new Event('requestLoad')) },
  { names: ['история','history'], exec: (s)=> out('История: ' + (s.history.length ? s.history.join(' | ') : 'Пусто')) }
];

function normalize(input){
  return input.trim().replace(/\s+/g,' ');
}

function findCommand(verb){
  const v = verb.toLowerCase();
  return COMMANDS.find(c => c.names.includes(v));
}

export function handleCommand(input, state, data){
  if(!input) return;
  const raw = normalize(input);
  out('> ' + raw);
  const parts = raw.split(' ');
  const verb = parts[0];
  const args = parts.slice(1);
  const cmd = findCommand(verb);
  if(!cmd){
    out('Неизвестная команда. Попробуйте: старт, идти <направление>, осмотреть, взять <предмет>, использовать <предмет>, говорить <имя>, сражаться, сохранить, загрузить, история.');
    return;
  }
  try{
    cmd.exec(state, args, data);
  }catch(e){
    console.error('Ошибка при выполнении команды', e);
    out('Во время выполнения команды произошла ошибка.');
  }
}