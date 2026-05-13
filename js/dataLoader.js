export async function loadJSON(path) {

  const res = await fetch(path);
  if(!res.ok) throw new Error('Не удалось загрузить ' + path);
  return res.json();
}

export async function loadAllData() {
    
  const [items, npcs, locations] = await Promise.all([
    loadJSON('data/items.json'),
    loadJSON('data/npcs.json'),
    loadJSON('data/locations.json')
  ]);
  return { items, npcs, locations };
}