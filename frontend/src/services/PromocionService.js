import apiClient from "./apiClient";

const BASE_URL = "/api/promociones";

export const fetchPromociones = async () => {
  const { data } = await apiClient.get(BASE_URL);
  return data;
};

export const crearPromocion = async (promocion) => {
  const { data } = await apiClient.post(BASE_URL, promocion);
  return data;
};

export const actualizarPromocion = async (id, promocion) => {
  const { data } = await apiClient.put(`${BASE_URL}/${id}`, promocion);
  return data;
};

export const eliminarPromocion = async (id) => {
  const { data } = await apiClient.delete(`${BASE_URL}/${id}`);
  return data;
};

export const validarPromocion = async (codigo) => {
  const { data } = await apiClient.post(`${BASE_URL}/validar`, { codigo });
  return data;
};

export const aplicarPromocion = async (codigo) => {
  const { data } = await apiClient.post(`${BASE_URL}/aplicar`, { codigo });
  return data;
};
