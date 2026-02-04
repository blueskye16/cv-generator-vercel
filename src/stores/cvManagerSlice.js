import { nanoid } from "nanoid";
import { getSavedTemplates, saveSavedTemplates } from "../utils/templateDb";

export const createCvManagerSlice = (set, get) => ({
  savedProfiles: [],
  templatesHydrated: false,

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

    const updatedProfiles = [...get().savedProfiles, newProfile];
    set({ savedProfiles: updatedProfiles });
    void saveSavedTemplates(updatedProfiles);
  },

  updateProfile: (profileId) => {
    const currentData = get().cvData;
    const currentBio = get().biodata;

    const updatedProfiles = get().savedProfiles.map((profile) =>
      profile.id === profileId
        ? {
            ...profile,
            data: currentData,
            biodata: currentBio,
            lastModified: new Date().toISOString(),
          }
        : profile,
    );

    set({ savedProfiles: updatedProfiles });
    void saveSavedTemplates(updatedProfiles);
  },

  hydrateTemplates: async () => {
    if (get().templatesHydrated) return;

    const storedTemplates = await getSavedTemplates();
    const localTemplates = get().savedProfiles;

    if (localTemplates.length > 0) {
      if (!storedTemplates || storedTemplates.length === 0) {
        await saveSavedTemplates(localTemplates);
      }
    } else if (storedTemplates && storedTemplates.length > 0) {
      set({ savedProfiles: storedTemplates });
    }

    set({ templatesHydrated: true });
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

  renameProfile: (id, newName) => {
    const updatedProfiles = get().savedProfiles.map((profile) =>
      profile.id === id
        ? { ...profile, name: newName, lastModified: Date.now() }
        : profile,
    );

    set({ savedProfiles: updatedProfiles });
    void saveSavedTemplates(updatedProfiles);
  },

  deleteProfile: (profileId) => {
    const updatedProfiles = get().savedProfiles.filter(
      (profile) => profile.id !== profileId,
    );

    set({ savedProfiles: updatedProfiles });
    void saveSavedTemplates(updatedProfiles);
  },
});
