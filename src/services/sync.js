import * as api from './api';
import * as idb from './indexedDB';

export const syncConfigurations = async () => {
  try {
    // fetch all configurations from IndexedDB
    const localConfigurations = await idb.getConfigurations();
    
    // fetch all configurations from the server
    const response = await api.getConfigurations();
    const serverConfigurations = response.data;

    // find the difference between server and idb 
    const localOnlyConfigs = localConfigurations.filter(config => config.isLocalOnly);

    // Create new configurations on the server
    for (const config of localOnlyConfigs) {
      const { _id, isLocalOnly, ...configData } = config;
      const newConfig = await api.createConfiguration(configData);
      await idb.deleteConfiguration(_id);
      await idb.saveConfiguration(newConfig.data);
    }

    // Update existing configurations
    for (const serverConfig of serverConfigurations) {
      const localConfig = localConfigurations.find(c => c._id === serverConfig._id && !c.isLocalOnly);
      if (localConfig && new Date(localConfig.lastModified) > new Date(serverConfig.lastModified)) {
        await api.updateConfiguration(serverConfig._id, localConfig);
      } else {
        await idb.saveConfiguration(serverConfig);
      }
    }

    // fetch the final list of configurations
    const finalResponse = await api.getConfigurations();
    const finalConfigurations = finalResponse.data;

    // Update IndexedDB with the final list
    await Promise.all(finalConfigurations.map(config => idb.saveConfiguration(config)));

    return finalConfigurations;
  } catch (error) {
    console.error('Error syncing configurations:', error);
    throw error;
  }
};

export const syncQuickAccessConfigurations = async () => {
  try {
    const user = await idb.getUser();
    if (user && user.quickAccessConfigurations) {
      const response = await api.updateQuickAccessConfigurations(user.quickAccessConfigurations);
      const updatedQuickAccess = response.data.quickAccessConfigurations;
      await idb.saveUser({ ...user, quickAccessConfigurations: updatedQuickAccess });
      return updatedQuickAccess;
    }
    return null;
  } catch (error) {
    console.error('Error syncing quick access configurations:', error);
    throw error;
  }
};

export const syncAll = async () => {
  try {
    const configurations = await syncConfigurations();
    const quickAccessConfigurations = await syncQuickAccessConfigurations();
    return { configurations, quickAccessConfigurations };
  } catch (error) {
    console.error('Error syncing all data:', error);
    throw error;
  }
};