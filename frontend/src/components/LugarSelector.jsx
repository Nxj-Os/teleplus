import { useEffect, useState, useRef, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchLugares, crearLugar } from "../services/lugarService";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";

function extractCity(address) {
  if (!address) return "";
  const district = (address.city_district || address.suburb || "").toLowerCase();
  const city = address.city || "";
  if (city && city.toLowerCase() !== district) return city;
  return address.state || address.town || address.village || address.municipality || city || "";
}

async function forwardGeocode(query) {
  const res = await fetch(
    `${NOMINATIM_BASE}/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
    { headers: { "Accept-Language": "es" } }
  );
  return res.json();
}

async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `${NOMINATIM_BASE}/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      { headers: { "Accept-Language": "es" } }
    );
    const data = await res.json();
    return {
      direccion: data.display_name || "",
      ciudad: extractCity(data.address),
    };
  } catch {
    return { direccion: "", ciudad: "" };
  }
}

const BuscadorControl = L.Control.extend({
  initialize(callback) {
    this._callback = callback;
  },
  onAdd() {
    const container = L.DomUtil.create("div", "leaflet-bar leaflet-control");
    container.style.cssText = "background:#fff;padding:4px;border-radius:6px;box-shadow:0 2px 6px rgba(0,0,0,.3);display:flex;flex-direction:column;width:260px;";

    const input = L.DomUtil.create("input", "", container);
    input.type = "text";
    input.placeholder = "Buscar direccion...";
    input.style.cssText = "border:none;outline:none;padding:6px 8px;font-size:13px;width:100%;";

    const results = L.DomUtil.create("div", "", container);
    results.style.cssText = "max-height:180px;overflow-y:auto;display:none;";

    let debounceTimer;

    input.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      const q = input.value.trim();
      if (q.length < 3) {
        results.style.display = "none";
        results.innerHTML = "";
        return;
      }
      debounceTimer = setTimeout(async () => {
        try {
          const data = await forwardGeocode(q);
          if (!data.length) {
            results.innerHTML = '<div style="padding:6px 8px;font-size:12px;color:#999;">Sin resultados</div>';
            results.style.display = "block";
            return;
          }
          results.innerHTML = "";
          data.forEach((item) => {
            const row = L.DomUtil.create("div", "", results);
            row.style.cssText = "padding:6px 8px;font-size:12px;cursor:pointer;border-bottom:1px solid #eee;";
            row.textContent = item.display_name;
            row.addEventListener("mouseenter", () => (row.style.background = "#f0f0f0"));
            row.addEventListener("mouseleave", () => (row.style.background = ""));
            row.addEventListener("click", () => {
              const ciudad = extractCity(item.address);
              this._callback(parseFloat(item.lat), parseFloat(item.lon), item.display_name, ciudad);
              results.style.display = "none";
              input.value = item.display_name;
            });
          });
          results.style.display = "block";
        } catch {
          results.innerHTML = '<div style="padding:6px 8px;font-size:12px;color:#999;">Error al buscar</div>';
          results.style.display = "block";
        }
      }, 350);
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        results.style.display = "none";
      }
    });

    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);

    this._container = container;
    return container;
  },
});

export function MapaInteractivo({ posicion, onPosicionChange }) {
  const map = useMap();

  useEffect(() => {
    const control = new BuscadorControl((lat, lng, direccion, ciudad) => {
      onPosicionChange(lat, lng, direccion, ciudad);
      map.setView([lat, lng], 16);
    });
    control.addTo(map);
    return () => map.removeControl(control);
  }, [map, onPosicionChange]);

  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      const { direccion, ciudad } = await reverseGeocode(lat, lng);
      onPosicionChange(lat, lng, direccion, ciudad);
    },
  });

  return posicion ? <Marker position={posicion} icon={defaultIcon} /> : null;
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalStyle = {
  backgroundColor: "#1e293b",
  color: "#fff",
  border: "1px solid #334155",
  borderRadius: "16px",
  width: "95vw",
  maxWidth: "1100px",
  maxHeight: "90vh",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

function LugarSelector({ onSelect, onCerrar }) {
  const [lugares, setLugares] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [lugarSeleccionado, setLugarSeleccionado] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    capacidad_total: "",
  });
  const [posicion, setPosicion] = useState([-12.0464, -77.0428]);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchLugares()
      .then((data) => { if (!cancelled) setLugares(data); })
      .catch(console.error)
      .finally(() => { if (!cancelled) setCargando(false); });
    return () => { cancelled = true; };
  }, []);

  const handlePosicionChange = (lat, lng, direccion, ciudad) => {
    setPosicion([lat, lng]);
    setForm((prev) => ({
      ...prev,
      ...(direccion && { direccion }),
      ...(ciudad && { ciudad }),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.direccion || !form.ciudad || !form.capacidad_total) {
      alert("Completa todos los campos del lugar.");
      return;
    }

    const nombreNormalizado = form.nombre.trim().toLowerCase();
    const duplicado = lugares.some((l) => l.nombre.toLowerCase() === nombreNormalizado);
    if (duplicado) {
      alert("Ya existe un lugar con ese nombre.");
      return;
    }

    setGuardando(true);
    try {
      const nuevoLugar = {
        nombre: form.nombre,
        direccion: form.direccion,
        ciudad: form.ciudad,
        capacidad_total: parseInt(form.capacidad_total, 10),
        latitud: posicion[0],
        longitud: posicion[1],
      };
      const creado = await crearLugar(nuevoLugar);
      setLugares((prev) => [...prev, creado]);
      setForm({ nombre: "", direccion: "", ciudad: "", capacidad_total: "" });
      setPosicion([-12.0464, -77.0428]);
      setMostrarFormulario(false);
    } catch (err) {
      console.error(err);
      alert("Error al guardar el lugar.");
    } finally {
      setGuardando(false);
    }
  };

  const handleSeleccionar = (lugar) => {
    setLugarSeleccionado(lugar);
  };

  const handleConfirmar = () => {
    if (lugarSeleccionado) {
      onSelect(lugarSeleccionado);
      onCerrar();
    }
  };

  return (
    <div style={overlayStyle} onMouseDown={(e) => e.stopPropagation()}>
      <div style={modalStyle} onMouseDown={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: "16px 24px", borderBottom: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h5 style={{ margin: 0 }}>Seleccionar Lugar</h5>
          <button
            type="button"
            className="btn btn-sm btn-outline-light"
            onClick={onCerrar}
          >
            Cerrar
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px", overflow: "auto", flex: 1 }}>
          <div className="row g-3">
            {/* Panel izquierdo: lista de lugares */}
            <div className="col-md-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Lugares existentes</h6>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-warning"
                  onClick={() => setMostrarFormulario(!mostrarFormulario)}
                >
                  {mostrarFormulario ? "Ver lista" : "+ Nuevo lugar"}
                </button>
              </div>

              {mostrarFormulario ? (
                <form onSubmit={handleGuardar}>
                  <div className="mb-2">
                    <label className="form-label form-label-sm">Nombre del lugar</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label form-label-sm">Dirección</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="direccion"
                      value={form.direccion}
                      onChange={handleChange}
                      placeholder="Escribe y busca en el mapa..."
                      required
                    />
                    <small className="text-muted">
                      Usa el buscador en el mapa o haz click para ubicar
                    </small>
                  </div>
                  <div className="mb-2">
                    <label className="form-label form-label-sm">Ciudad</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="ciudad"
                      value={form.ciudad}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label form-label-sm">Capacidad total</label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      name="capacidad_total"
                      value={form.capacidad_total}
                      onChange={handleChange}
                      min="0"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <small className="text-muted">
                      Coordenadas: {posicion[0].toFixed(6)}, {posicion[1].toFixed(6)}
                    </small>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-sm btn-danger w-100"
                    disabled={guardando}
                  >
                    {guardando ? "Guardando..." : "Guardar lugar"}
                  </button>
                </form>
              ) : (
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {cargando ? (
                    <p className="text-muted">Cargando lugares...</p>
                  ) : lugares.length === 0 ? (
                    <p className="text-muted">No hay lugares registrados.</p>
                  ) : (
                    lugares.map((lugar) => (
                      <div
                        key={lugar.id_lugar}
                        className={`p-2 mb-2 rounded ${
                          lugarSeleccionado?.id_lugar === lugar.id_lugar
                            ? "bg-warning bg-opacity-25 border border-warning"
                            : "bg-secondary bg-opacity-25 border border-secondary"
                        }`}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleSeleccionar(lugar)}
                      >
                        <div className="fw-bold">{lugar.nombre}</div>
                        <small className="text-muted">
                          {lugar.direccion}, {lugar.ciudad}
                        </small>
                        <br />
                        <small className="text-muted">
                          Cap: {lugar.capacidad_total}
                        </small>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Panel derecho: mapa */}
            <div className="col-md-7">
              <div
                className="rounded overflow-hidden"
                style={{ height: "450px", border: "2px solid #444" }}
              >
                <MapContainer
                  center={posicion}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapaInteractivo
                    posicion={posicion}
                    onPosicionChange={handlePosicionChange}
                  />
                </MapContainer>
              </div>
              <small className="text-muted d-block mt-1">
                Haz click en el mapa para ubicar el marcador, o usa el buscador arriba a la derecha
              </small>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #334155", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCerrar}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleConfirmar}
            disabled={!lugarSeleccionado}
          >
            Seleccionar lugar
          </button>
        </div>
      </div>
    </div>
  );
}

export default LugarSelector;
