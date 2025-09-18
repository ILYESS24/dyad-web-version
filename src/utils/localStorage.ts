export const localStorageUtils = {
  getUserSettings() {
    const stored = localStorage.getItem('dyad_user_settings');
    return stored ? JSON.parse(stored) : {};
  },
  
  setUserSettings(settings: any) {
    localStorage.setItem('dyad_user_settings', JSON.stringify(settings));
  },
  
  getApps() {
    const stored = localStorage.getItem('dyad_apps');
    return stored ? JSON.parse(stored) : [];
  },
  
  setApps(apps: any[]) {
    localStorage.setItem('dyad_apps', JSON.stringify(apps));
  }
};
