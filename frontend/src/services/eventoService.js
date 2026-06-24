const API = "http://localhost:8080/api";

export async function obtenerEventos() {
  const response = await fetch(`${API}/eventos`);
  return await response.json();
}

export async function obtenerEventoPorId(id) {
  const response = await fetch(`${API}/eventos/${id}`);
  return await response.json();
}

export async function crearEvento(evento) {
  const response = await fetch(`${API}/eventos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(evento),
  });
  if (!response.ok) {
    const msg = await response.text();
    throw new Error(msg || "Error al crear el evento");
  }
  return await response.json();
}

export async function actualizarEvento(id, evento) {
  const response = await fetch(`${API}/eventos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(evento),
  });
  if (!response.ok) {
    const msg = await response.text();
    throw new Error(msg || "Error al actualizar el evento");
  }
  return await response.json();
}

export async function eliminarEvento(id) {
  const response = await fetch(`${API}/eventos/${id}`, { method: "DELETE" });
  if (!response.ok) {
    const msg = await response.text();
    throw new Error(msg || "Error al eliminar el evento");
  }
}

export async function obtenerLugares() {
  const response = await fetch(`${API}/lugares`);
  return await response.json();
}

export async function crearLugar(lugar) {
  const response = await fetch(`${API}/lugares`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lugar),
  });
  return await response.json();
}

export async function eliminarLugar(id) {
  await fetch(`${API}/lugares/${id}`, { method: "DELETE" });
}

export async function obtenerZonas() {
  const response = await fetch(`${API}/zonas`);
  return await response.json();
}

export async function crearZona(zona) {
  const response = await fetch(`${API}/zonas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(zona),
  });
  return await response.json();
}

export async function actualizarZona(id, zona) {
  const response = await fetch(`${API}/zonas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(zona),
  });
  return await response.json();
}

export async function eliminarZona(id) {
  await fetch(`${API}/zonas/${id}`, { method: "DELETE" });
}

export async function obtenerEventoZonaPrecio() {
  const response = await fetch(`${API}/evento-zona-precio`);
  return await response.json();
}

export async function obtenerZonasPorEvento(eventoId) {
  const response = await fetch(`${API}/evento-zona-precio/evento/${eventoId}`);
  return await response.json();
}

export async function crearEventoZonaPrecio(ezp) {
  const response = await fetch(`${API}/evento-zona-precio`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ezp),
  });
  return await response.json();
}

export async function actualizarEventoZonaPrecio(id, ezp) {
  const response = await fetch(`${API}/evento-zona-precio/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ezp),
  });
  if (!response.ok) {
    const msg = await response.text();
    throw new Error(msg || "Error al actualizar el precio de zona");
  }
  return await response.json();
}

export async function eliminarEventoZonaPrecio(id) {
  await fetch(`${API}/evento-zona-precio/${id}`, { method: "DELETE" });
}
