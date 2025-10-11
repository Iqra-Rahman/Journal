import axios from "axios";

export const createJournalApi = (backendUrl) => {
  const axiosInstance = axios.create({
    baseURL: backendUrl + "/api/journal",
    withCredentials: true,
  });

  return {
    getEntries: () => axiosInstance.get("/entries"),
    addEntry: (data) => axiosInstance.post("/add-entry", data),
    updateEntry: (entryId, data) => axiosInstance.put(`/update-entry/${entryId}`, data),
    deleteEntry: (entryId) => axiosInstance.delete(`/delete-entry/${entryId}`),
  };
};
