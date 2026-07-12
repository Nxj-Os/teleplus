import apiClient from "./apiClient";

export const crearDetalleCompra = async (detalle) => {
  const { data } = await apiClient.post("/api/detalle-compra", detalle);
  return data;
};

export const obtenerDetalleCompra = async (id) => {
  const { data } = await apiClient.get(`/api/detalle-compra/${id}`);
  return data;
};
