import { nanoid } from "nanoid";

export const createCvManagerSlice = (set, get) => ({
  
  
  savedProfiles: [],

  
  saveAsNewProfile: (profileName) => {
    const currentData = get().cvData; 
    const currentBio = get().biodata; 

    const newProfile = {
      id: nanoid(),
      name: profileName || `CV Draft ${new Date().toLocaleDateString()}`,
      data: currentData,
      biodata: currentBio, 
      lastModified: new Date().toISOString(),
    };

    set((state) => ({
      savedProfiles: [...state.savedProfiles, newProfile],
    }));
  },

  
  updateProfile: (profileId) => {
    const currentData = get().cvData;
    const currentBio = get().biodata;

    set((state) => ({
      savedProfiles: state.savedProfiles.map((p) =>
        p.id === profileId
          ? {
              ...p,
              data: currentData,
              biodata: currentBio,
              lastModified: new Date().toISOString(),
            }
          : p,
      ),
    }));
  },

  
  loadProfile: (profileId) => {
    const targetProfile = get().savedProfiles.find((p) => p.id === profileId);

    if (targetProfile) {
      
      set({
        cvData: targetProfile.data,
        biodata: targetProfile.biodata, 
      });
    }
  },

  renameProfile: (id, newName) =>
    set((state) => ({
      savedProfiles: state.savedProfiles.map((profile) =>
        profile.id === id
          ? { ...profile, name: newName, lastModified: Date.now() } 
          : profile,
      ),
    })),

  
  deleteProfile: (profileId) => {
    set((state) => ({
      savedProfiles: state.savedProfiles.filter((p) => p.id !== profileId),
    }));
  },
});
