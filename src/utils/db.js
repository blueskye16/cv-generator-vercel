import { get, set, del, update } from "idb-keyval";

const PREFIX = "vin_job_";

export const saveApplicationData = async (id, data) => {
  await set(PREFIX + id, data);
};

export const getApplicationData = async (id) => {
  return await get(PREFIX + id);
};

export const deleteApplicationData = async (id) => {
  await del(PREFIX + id);
};
