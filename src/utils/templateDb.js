import { get, set } from "idb-keyval";

const TEMPLATE_KEY = "vin_saved_templates";

export const saveSavedTemplates = async (templates) => {
  await set(TEMPLATE_KEY, templates);
};

export const getSavedTemplates = async () => {
  return await get(TEMPLATE_KEY);
};
