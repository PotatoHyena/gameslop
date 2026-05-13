export function storageAvailable (type) {
  try {
    var storage = window[type], x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  }
  catch(e) {
    return false;
  }
}

export function saveGame(state, slot='save_slot_1') {
  if(!storageAvailable('localStorage')) return { ok:false, msg:'localStorage недоступен' };
  try{
    const snapshot = {
      meta: { savedAt: Date.now(), schema:1 },
      state
    };
    localStorage.setItem(slot, JSON.stringify(snapshot));
    return { ok:true };
  }catch(e){
    return { ok:false, msg:e.message };
  }
}

export function loadGame (slot='save_slot_1') {
  if(!storageAvailable('localStorage')) return null;
  const s = localStorage.getItem(slot);
  if(!s) return null;
  try{
    const parsed = JSON.parse(s);
    return parsed.state;
  }catch(e){
    console.error('Ошибка загрузки', e);
    return null;
  }
}