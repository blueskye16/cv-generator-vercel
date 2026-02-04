import { nanoid } from "nanoid";
import { saveApplicationData, deleteApplicationData } from "../utils/db";

export const createJobTrackerSlice = (set, get) => ({
  applications: [],

  addApplication: async (payload) => {
    const newId = nanoid();
    const currentCvData = get().cvData;
    const currentBiodata = get().biodata;

    const heavyData = {
      jobDesc: payload.jobDesc || "",
      cvSnapshot: {
        cvData: currentCvData,
        biodata: currentBiodata,
      },

      notes: payload.notes || "",
    };

    await saveApplicationData(newId, heavyData);

    const lightData = {
      id: newId,
      company: payload.company,
      position: payload.position,
      platform: payload.platform,
      jobUrl: payload.jobUrl || "",
      status: "Applied",
      dateApplied: new Date().toISOString(),
      linkedProfileName: payload.linkedProfileName || "Unsaved Draft",
    };

    set((state) => ({
      applications: [lightData, ...state.applications],
    }));
  },

  updateApplicationStatus: (id, newStatus) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, status: newStatus } : app,
      ),
    })),

  deleteApplication: async (id) => {
    await deleteApplicationData(id);

    set((state) => ({
      applications: state.applications.filter((app) => app.id !== id),
    }));
  },
});
