import apiClient from "./apiClient";

export const guardarEntrada = async (entrada) => {
  const { data } = await apiClient.post("/api/entradas", entrada);
  return data;
};

export const obtenerEntradas = async () => {
  const { data } = await apiClient.get("/api/entradas");
  return data;
};
