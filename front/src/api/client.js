import axios from "axios";

// Dev: falls through to the Vite proxy. Prod: set VITE_API_URL at build time.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

// Surface the server's Uzbek message instead of axios's generic English one.
const unwrapError = (err) => {
  const data = err.response?.data;
  const fieldError = data?.errors && Object.values(data.errors)[0];
  throw new Error(fieldError || data?.message || "Serverga ulanib bo'lmadi");
};

export const getCredits = (search = "") =>
  api.get("/credits", { params: search ? { search } : {} })
    .then((r) => r.data)
    .catch(unwrapError);

export const createCredit = (data) =>
  api.post("/credits", data).then((r) => r.data).catch(unwrapError);

export const updateCredit = (id, data) =>
  api.put(`/credits/${id}`, data).then((r) => r.data).catch(unwrapError);

export const adjustAmount = (id, delta) =>
  api.patch(`/credits/${id}/amount`, { delta }).then((r) => r.data).catch(unwrapError);

export const deleteCredit = (id) =>
  api.delete(`/credits/${id}`).then((r) => r.data).catch(unwrapError);
