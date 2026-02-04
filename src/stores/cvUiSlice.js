export const createCvUiSlice = (set, get) => ({
  isSelectOpen: false,
  activeModal: null,
  isLoading: null,

  toggleSelect: () => set((state) => ({ isSelectOpen: !state.isSelectOpen })),
  openModal: (payload) => set({ activeModal: payload }),
  closeModal: () => set({ activeModal: null }),
  resetFlow: () => {
    set({ isSelectOpen: false, activeModal: null });
  },
});
