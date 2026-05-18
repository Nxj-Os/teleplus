const API_URL = "http://localhost:8080/api/usuarios";

export const loginUsuario = async (credenciales) => {
  try {
    const respuesta = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credenciales),
    });

    if (!respuesta.ok) {
      throw new Error("Credenciales incorrectas");
    }

    return await respuesta.json();
  } catch (error) {
    console.error("Error en loginUsuario:", error);
    throw error;
  }
};

export const registrarUsuario = async (nuevoUsuario) => {
  try {
    const respuesta = await fetch(`${API_URL}/registro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoUsuario),
    });

    if (!respuesta.ok) {
      const errorData = await respuesta.text();
      throw new Error(errorData || "Error al registrar el usuario");
    }

    return await respuesta.json();
  } catch (error) {
    console.error("Error en registrarUsuario:", error);
    throw error;
  }
};

export const actualizarUsuario = async (id, datosUsuario) => {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosUsuario),
    });

    if (!respuesta.ok) {
      const errorData = await respuesta.text();
      throw new Error(errorData || "Error al actualizar el usuario");
    }

    return await respuesta.json();
  } catch (error) {
    console.error("Error en actualizarUsuario:", error);
    throw error;
  }
};
