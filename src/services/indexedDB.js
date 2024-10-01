import { openDB } from 'idb';

const dbPromise = openDB('PomodoroApp', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('configurations')) {
      db.createObjectStore('configurations', { keyPath: 'id' });
    }
  },
});

export async function getConfigurations() {
  const db = await dbPromise;
  return db.getAll('configurations');
}

export async function saveConfiguration(configuration) {
  const db = await dbPromise;
  await db.put('configurations', configuration);
}

export async function deleteConfiguration(id) {
  const db = await dbPromise;
  await db.delete('configurations', id);
}

export async function clearConfigurations() {
  const db = await dbPromise;
  await db.clear('configurations');
}