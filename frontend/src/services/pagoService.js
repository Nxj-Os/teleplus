import apiClient from "./apiClient";

export const crearPago = async (pago) => {
  const { data } = await apiClient.post("/api/pagos", pago);
  return data;
};

export const obtenerPago = async (id) => {
  const { data } = await apiClient.get(`/api/pagos/${id}`);
  return data;
};

export const obtenerPagos = async () => {
  const { data } = await apiClient.get("/api/pagos");
  return data;
};
