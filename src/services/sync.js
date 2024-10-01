import * as api from './api';
import * as indexedDB from './indexedDB';

export async function syncConfigurations() {
  try {
    const response = await api.getConfigurations();
    const serverConfigurations = response.data;

    const localConfigurations = await indexedDB.getConfigurations();

    await indexedDB.clearConfigurations();

    for (const config of serverConfigurations) {
      await indexedDB.saveConfiguration(config);
    }

    for (const localConfig of localConfigurations) {
      if (!serverConfigurations.find(c => c.id === localConfig.id)) {
        const newConfig = await api.createConfiguration(localConfig);
        await indexedDB.saveConfiguration(newConfig.data);
      }
    }

    return serverConfigurations;
  } catch (error) {
    console.error('Sync error:', error);
    throw error;
  }
}

export async function saveConfiguration(configuration) {
  try {
    let savedConfig;
    if (configuration.id) {
      const response = await api.updateConfiguration(configuration.id, configuration);
      savedConfig = response.data;
    } else {
      const response = await api.createConfiguration(configuration);
      savedConfig = response.data;
    }
    await indexedDB.saveConfiguration(savedConfig);
    return savedConfig;
  } catch (error) {
    console.error('Save configuration error:', error);
    if (!navigator.onLine) {
      await indexedDB.saveConfiguration(configuration);
      return configuration;
    }
    throw error;
  }
}

export async function deleteConfiguration(id) {
  try {
    await api.deleteConfiguration(id);
    await indexedDB.deleteConfiguration(id);
  } catch (error) {
    console.error('Delete configuration error:', error);
    if (!navigator.onLine) {
      await indexedDB.deleteConfiguration(id);
    }
    throw error;
  }
}