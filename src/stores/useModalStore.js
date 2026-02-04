import { create } from "zustand";

export const useModalStore = create((set) => ({
  isModalEntryOpen: false,
  modalData: null,

  openModal: (data) =>
    set({
      isModalEntryOpen: true,
      modalData: data,
    }),

  closeModal: () =>
    set({
      isModalEntryOpen: false,
      modalData: null,
    }),
}));
