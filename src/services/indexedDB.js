import { openDB } from 'idb';

const DB_NAME = 'PomodoroApp';
const DB_VERSION = 1;
const CONFIGURATIONS_STORE = 'configurations';
const USER_STORE = 'user';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    // Create a store of objects for the user and configs
    db.createObjectStore(CONFIGURATIONS_STORE, { keyPath: '_id' });
    db.createObjectStore(USER_STORE, { keyPath: 'id' });
  },
});

// Configuration functions
export async function getConfigurations() {
  return (await dbPromise).getAll(CONFIGURATIONS_STORE);
}

export async function getConfiguration(id) {
  return (await dbPromise).get(CONFIGURATIONS_STORE, id);
}

export async function saveConfiguration(configuration) {
  return (await dbPromise).put(CONFIGURATIONS_STORE, configuration);
}

export async function deleteConfiguration(id) {
  return (await dbPromise).delete(CONFIGURATIONS_STORE, id);
}

// User functions
export async function getUser() {
  return (await dbPromise).get(USER_STORE, 'currentUser');
}

export async function saveUser(userData) {
  return (await dbPromise).put(USER_STORE, { ...userData, id: 'currentUser' });
}

export async function deleteUser() {
  return (await dbPromise).delete(USER_STORE, 'currentUser');
}

// Utility function to clear all data - use for logging out 
export async function clearAllData() {
  const db = await dbPromise;
  const tx = db.transaction([CONFIGURATIONS_STORE, USER_STORE], 'readwrite');
  await Promise.all([
    tx.objectStore(CONFIGURATIONS_STORE).clear(),
    tx.objectStore(USER_STORE).clear(),
    tx.done
  ]);
}