import { loadAllData } from './dataLoader.js';
import { saveGame, loadGame } from './storage.js';
import { out, updateStatus } from './ui.js';
import { handleCommand } from './parser.js';
import { createPlayer } from './player.js';

let data = { items: [], npcs: [], locations: [] };
let gameState = {
  player: createPlayer(),
  history: []
};

async function init(){
  try{
    data = await loadAllData();
    out('Данные загружены. Введите "старт <имя>" чтобы начать игру или нажмите "Загрузить".');
    updateStatus(gameState.player, data.items, data.locations);
  }catch(e){
    out('Ошибка загрузки данных: ' + e.message);
  }
  bindUI();
}

function bindUI(){
  document.getElementById('send').addEventListener('click', ()=>{ const v=document.getElementById('cmd').value; handleCommand(v, gameState, data); document.getElementById('cmd').value=''; });
  document.getElementById('cmd').addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ document.getElementById('send').click(); }});
  document.getElementById('save').addEventListener('click', ()=>{ const r = saveGame(gameState); out(r.ok ? 'Игра сохранена.' : 'Ошибка: '+r.msg); });
  document.getElementById('load').addEventListener('click', ()=>{ const loaded = loadGame(); if(!loaded){ out('Сохранений не найдено.'); return; } gameState = loaded; out('Сохранение загружено.'); updateStatus(gameState.player, data.items, data.locations); });
  window.addEventListener('requestSave', ()=>{ const r = saveGame(gameState); out(r.ok ? 'Игра сохранена.' : 'Ошибка: '+r.msg); });
  window.addEventListener('requestLoad', ()=>{ const loaded = loadGame(); if(!loaded){ out('Сохранений не найдено.'); return; } gameState = loaded; out('Сохранение загружено.'); updateStatus(gameState.player, data.items, data.locations); });
  window.addEventListener('stateUpdated', ()=> updateStatus(gameState.player, data.items, data.locations));
}

init();