import apiClient from "./apiClient";

const API_PATH = "/api/usuarios";

export const loginUsuario = async (credenciales) => {
  try {
    const respuesta = await apiClient.post(`${API_PATH}/login`, credenciales);
    return respuesta.data;
  } catch (error) {
    const err = new Error(error.response?.data || "Credenciales incorrectas");
    err.response = error.response
      ? { status: error.response.status, data: error.response.data }
      : null;
    throw err;
  }
};

export const loginAdministrador = async (credenciales) => {
  try {
    const respuesta = await apiClient.post(`${API_PATH}/login-admin`, credenciales);
    return respuesta.data;
  } catch (error) {
    const err = new Error(
      error.response?.data || "Error de autenticación administrativa"
    );
    err.response = error.response
      ? { status: error.response.status, data: error.response.data }
      : null;
    throw err;
  }
};

export const registrarUsuario = async (nuevoUsuario) => {
  try {
    const respuesta = await apiClient.post(`${API_PATH}/registro`, nuevoUsuario);
    return respuesta.data;
  } catch (error) {
    throw new Error(error.response?.data || "Error al registrar el usuario");
  }
};

export const actualizarUsuario = async (id, datosUsuario) => {
  try {
    const respuesta = await apiClient.put(`${API_PATH}/${id}`, datosUsuario);
    return respuesta.data;
  } catch (error) {
    throw new Error(error.response?.data || "Error al actualizar el usuario");
  }
};
