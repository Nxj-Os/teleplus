import apiClient from "./apiClient";

export const crearCompra = async (compra) => {
  const { data } = await apiClient.post("/api/compra", compra);
  return data;
};

export const actualizarCompra = async (id, compra) => {
  const { data } = await apiClient.put(`/api/compra/${id}`, compra);
  return data;
};

export const obtenerCompra = async (id) => {
  const { data } = await apiClient.get(`/api/compra/${id}`);
  return data;
};
