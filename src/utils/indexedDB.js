import { openDB } from 'idb';

const dbPromise = openDB('pomodoro-store', 1, {
  upgrade(db) {
    db.createObjectStore('cycles');
  },
});

export const saveCycles = async (cycles) => {
  const db = await dbPromise;
  const tx = db.transaction('cycles', 'readwrite');
  await tx.store.put(cycles, 'cycles');
  return tx.done;
};

export const getCycles = async () => {
  const db = await dbPromise;
  return db.get('cycles', 'cycles');
};