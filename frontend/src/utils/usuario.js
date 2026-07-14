import apiClient from "../services/apiClient";

export const recuperarUsuario = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

export const cerrarSesion = async () => {
    try {
        const token = localStorage.getItem("token");
        if (token) {
            await apiClient.post("/api/usuarios/logout");
        }
    } catch (error) {
        console.error("Error al cerrar sesion en el servidor:", error);
    } finally {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("dashboardUser");
    }
}