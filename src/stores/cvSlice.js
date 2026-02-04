import { nanoid } from "nanoid";
import { INITIAL_BIODATA, INITIAL_CV_DATA } from "./initialData";
import {
  createDescriptionTemplate,
  createNormalTemplate,
  createSimpleTemplate,
} from "./cvSectionTemplate";

export const createCvSlice = (set, get) => ({
  printRef: null,
  aiDraftData: null, 
  isAiPreviewMode: false, 

  setAiDraft: (draftData) => {
    set({
      aiDraftData: draftData,
      isAiPreviewMode: true,
    });
  },

  
  toggleAiPreviewMode: () => {
    set((state) => ({
      isAiPreviewMode: !state.isAiPreviewMode,
    }));
  },

  
  applyAiDraft: () => {
    const draft = get().aiDraftData;
    if (draft) {
      set({
        cvData: draft,
        aiDraftData: null,
        isAiPreviewMode: false,
      });
    }
  },

  
  discardAiDraft: () => {
    set({
      aiDraftData: null,
      isAiPreviewMode: false,
    });
  },

  updateSectionTitle: (sectionKey, newTitle) => {
    set((state) => ({
      cvData: {
        ...state.cvData,
        [sectionKey]: {
          ...state.cvData[sectionKey],
          title: newTitle,
        },
      },
    }));
  },

  setPrintRef: (ref) => set({ printRef: ref }),

  updateSectionTemplate: (sectionKey, newTemplate) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        [sectionKey]: {
          ...state.cvData[sectionKey],
          template: newTemplate,
        },
      },
    })),

  addNewSection: (template) => {
    const newId = nanoid();
    const currentCvData = get().cvData;
    const existingKeys = Object.keys(currentCvData);
    const baseName = "customSection";
    let uniqueName = baseName;
    let counter = 1;
    while (existingKeys.includes(uniqueName)) {
      uniqueName = `${baseName}-${counter}`;
      counter++;
    }
    
    
    set((state) => {
      let firstEntry = "normal"
        ? createNormalTemplate()
        : createSimpleTemplate();
      firstEntry.id = newId;
      firstEntry.title = "Custom Section";

      const newSectionStructure = {
        title: "Custom Section",
        template: template,
        entries: [firstEntry],
      };
      return {
        cvData: {
          ...state.cvData,
          [uniqueName]: newSectionStructure,
        },
      };
    });
    return { sectionKey: uniqueName, id: newId };
  },

  addEntry: (sectionKey) => {
    const newId = nanoid();
    set((state) => {
      const templateName = state.cvData[sectionKey].template;
      let newEntry;

      if (templateName === "normal") {
        newEntry = createNormalTemplate();
      } else if (templateName === "description") {
        newEntry = createDescriptionTemplate();
      } else {
        newEntry = createNormalTemplate();
      }

      newEntry.id = newId;
      return {
        cvData: {
          ...state.cvData,
          [sectionKey]: {
            ...state.cvData[sectionKey],
            entries: [...state.cvData[sectionKey].entries, newEntry],
          },
        },
      };
    });
    return newId;
  },

  updateEntryField: (sectionKey, entryId, name, value) =>
    set((state) => {
      const newEntries = state.cvData[sectionKey].entries.map((entry) =>
        entry.id === entryId ? { ...entry, [name]: value } : entry,
      );
      return {
        cvData: {
          ...state.cvData,
          [sectionKey]: {
            ...state.cvData[sectionKey],
            entries: newEntries,
          },
        },
      };
    }),

  updateEntryProfile: (fieldName, value) =>
    set((state) => ({
      biodata: {
        ...state.biodata,
        [fieldName]: value,
      },
    })),

  deleteEntry: (sectionKey, entryId) =>
    set((state) => {
      const targetSection = state.cvData[sectionKey];

      const newEntries = targetSection.entries.filter((e) => e.id !== entryId);
      if (newEntries.length === 0) {
        const newCvData = { ...state.cvData };
        delete newCvData[sectionKey];
        return { cvData: newCvData };
      } else {
        return {
          cvData: {
            ...state.cvData,
            [sectionKey]: {
              ...targetSection,
              entries: newEntries,
            },
          },
        };
      }
    }),

  deleteSectionEntry: (sectionKey) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        [sectionKey]: {
          ...state.cvData[sectionKey].filter((e) => sectionKey !== sectionKey),
        },
      },
    })),

  toggleEntryVisibility: (sectionKey, entryId) =>
    set((state) => {
      const targetSection = state.cvData[sectionKey];
      
      if (!targetSection) return state;

      const newEntries = targetSection.entries.map((entry) => {
        if (entry.id === entryId) {
          
          const currentStatus = entry.isVisible !== false;
          return { ...entry, isVisible: !currentStatus };
        }
        return entry;
      });

      return {
        cvData: {
          ...state.cvData,
          [sectionKey]: {
            ...targetSection,
            entries: newEntries,
          },
        },
      };
    }),

  
  updateSectionTitle: (sectionKey, newTitle) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        [sectionKey]: {
          ...state.cvData[sectionKey],
          title: newTitle,
        },
      },
    })),

  applyAiRevision: (newCvData) => {
    set((state) => ({
      cvData: newCvData, 
    }));
  },

  resetAllData: () => {
    
    set({
      cvData: INITIAL_CV_DATA,
      biodata: INITIAL_BIODATA,
    });
  },
});
