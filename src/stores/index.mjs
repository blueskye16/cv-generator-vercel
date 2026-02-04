import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware"; // Import persist
import { createCvBiodata } from "./cvBiodata";
import { createCvDefaultData } from "./cvDefaultData";
import { createCvSlice } from "./cvSlice";
import { createCvManagerSlice } from "./cvManagerSlice";
import { createJobTrackerSlice } from "./jobTrackerSlice";

// tutor
// const data = JSON.parse(localStorage.getItem('vin-cv-storage'));
// copy(JSON.stringify(data1, null, 2));

export const useCvStore = create(
  devtools(
    persist(
      (...a) => ({
        ...createCvBiodata(...a),
        ...createCvDefaultData(...a),
        ...createCvSlice(...a),
        ...createCvManagerSlice(...a),
        ...createJobTrackerSlice(...a),
      }),
      {
        storage: createJSONStorage(() => localStorage),

        partialize: (state) => ({
          cvData: state.cvData,
          biodata: state.biodata,
          savedProfiles: state.savedProfiles,

          applications: state.applications,
        }),

        version: 3,
      },
    ),
  ),
);
