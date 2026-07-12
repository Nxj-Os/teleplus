const BASE_URL = "http://localhost:8080/api/lugares";

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

export const fetchLugares = async () => {
  const response = await fetch(BASE_URL);
  return parseResponse(response);
};

export const fetchLugarPorId = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`);
  return parseResponse(response);
};

export const crearLugar = async (lugar) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(lugar),
  });
  return parseResponse(response);
};

export const actualizarLugar = async (id, lugar) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(lugar),
  });
  return parseResponse(response);
};

export const eliminarLugar = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  return parseResponse(response);
};
