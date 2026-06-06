const BASE_URL = "http://localhost:8080/api/promociones";

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  const hasJson = contentType?.includes("application/json");

  const body = hasJson ? await response.json() : null;
  if (!response.ok) {
    const message =
      body?.message ||
      body?.error ||
      body?.mensaje ||
      JSON.stringify(body) ||
      response.statusText;
    throw new Error(message || `HTTP error ${response.status}`);
  }

  return body;
};

export const fetchPromociones = async () => {
  const response = await fetch(BASE_URL);
  return parseResponse(response);
};

export const crearPromocion = async (promocion) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(promocion),
  });
  return parseResponse(response);
};

export const actualizarPromocion = async (id, promocion) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(promocion),
  });
  return parseResponse(response);
};

export const eliminarPromocion = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  return parseResponse(response);
};

export const validarPromocion = async (codigo) => {
  const response = await fetch(`${BASE_URL}/validar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ codigo }),
  });
  return parseResponse(response);
};

export const aplicarPromocion = async (codigo) => {
  const response = await fetch(`${BASE_URL}/aplicar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ codigo }),
  });
  return parseResponse(response);
};
