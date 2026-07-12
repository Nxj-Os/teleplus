import { useEffect, useMemo, useState } from "react";
import DashboardShell from "./DashboardShell";
import {
  obtenerZonas,
  crearZona,
  actualizarZona,
  eliminarZona,
  obtenerLugares,
} from "../../services/eventoService";

const INITIAL_ZONA = {
  nombre_zona: "",
  capacidad: "",
  estado: "activo",
  lugar: "",
};

function ZonasDashboard() {
  const [zonas, setZonas] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState(INITIAL_ZONA);
  const [editandoId, setEditandoId] = useState(null);

  const cargarZonas = async () => {
    try {
      const data = await obtenerZonas();
      setZonas(data || []);
      setFeedback(null);
    } catch (error) {
      console.error("Error cargando zonas:", error);
      setFeedback({
        type: "danger",
        text: "No se pudieron cargar las zonas. Verifica la conexion con el backend.",
      });
    }
  };

  const cargarLugares = async () => {
    try {
      const data = await obtenerLugares();
      setLugares(data || []);
    } catch (error) {
      console.error("Error cargando lugares:", error);
    }
  };

  useEffect(() => {
    cargarZonas();
    cargarLugares();
  }, []);

  const abrirFormulario = () => {
    setForm(INITIAL_ZONA);
    setFeedback(null);
    setIsFormOpen(true);
  };

  const limpiarFormulario = () => {
    setForm(INITIAL_ZONA);
    setFeedback(null);
    setIsFormOpen(false);
    setEditandoId(null);
  };

  const abrirEdicion = (zona) => {
    setEditandoId(zona.id_zona);
    setForm({
      nombre_zona: zona.nombre_zona || "",
      capacidad: zona.capacidad || "",
      estado: zona.estado || "activo",
      lugar: zona.lugar?.id_lugar || "",
    });
    setIsFormOpen(true);
    setFeedback(null);
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!form.nombre_zona.trim()) {
      setFeedback({ type: "danger", text: "El nombre de la zona es obligatorio." });
      return;
    }

    if (!form.capacidad || Number(form.capacidad) < 0) {
      setFeedback({ type: "danger", text: "La capacidad debe ser un numero positivo." });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const payload = {
      nombre_zona: form.nombre_zona.trim(),
      capacidad: Number(form.capacidad),
      estado: form.estado || "activo",
      lugar: form.lugar ? { id_lugar: Number(form.lugar) } : null,
    };

    try {
      if (editandoId) {
        await actualizarZona(editandoId, payload);
        setFeedback({ type: "success", text: "Zona actualizada correctamente." });
      } else {
        await crearZona(payload);
        setFeedback({ type: "success", text: "Zona creada correctamente." });
      }
      limpiarFormulario();
      cargarZonas();
    } catch (error) {
      console.error("Error al guardar zona:", error);
      setFeedback({ type: "danger", text: error.message || "Error al guardar la zona." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const manejarEliminar = async (zona) => {
    const confirmacion = window.confirm(`¿Eliminar zona "${zona.nombre_zona}"?`);
    if (!confirmacion) return;

    try {
      await eliminarZona(zona.id_zona);
      setFeedback({ type: "success", text: "Zona eliminada correctamente." });
      cargarZonas();
    } catch (error) {
      setFeedback({ type: "danger", text: error.message || "Error al eliminar la zona." });
    }
  };

  const zonasFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return zonas;

    return zonas.filter((zona) => {
      const nombre = (zona.nombre_zona || "").toLowerCase();
      const estado = (zona.estado || "").toLowerCase();
      const lugar = (zona.lugar?.nombre || "").toLowerCase();

      return nombre.includes(texto) || estado.includes(texto) || lugar.includes(texto);
    });
  }, [busqueda, zonas]);

  const totalZonas = zonas.length;
  const zonasActivas = zonas.filter(
    (z) => (z.estado || "").toLowerCase() === "activo"
  ).length;

  return (
    <DashboardShell
      activeSection="zonas"
      title="Gestion de Zonas"
      subtitle="Administra las zonas de cada lugar y su capacidad"
    >
      <section
        className="cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          margin: "24px 0",
        }}
      >
        <article
          style={{
            background: "rgba(255,255,255,0.9)",
            padding: "22px",
            borderRadius: "20px",
            boxShadow: "0 14px 35px rgba(15,23,42,0.08)",
            border: "1px solid rgba(148,163,184,0.16)",
          }}
        >
          <h3 style={{ color: "#475569", fontSize: "0.96rem", fontWeight: 600, marginBottom: 8 }}>
            Total zonas
          </h3>
          <p style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
            {totalZonas}
          </p>
        </article>

        <article
          style={{
            background: "rgba(255,255,255,0.9)",
            padding: "22px",
            borderRadius: "20px",
            boxShadow: "0 14px 35px rgba(15,23,42,0.08)",
            border: "1px solid rgba(148,163,184,0.16)",
          }}
        >
          <h3 style={{ color: "#475569", fontSize: "0.96rem", fontWeight: 600, marginBottom: 8 }}>
            Activas
          </h3>
          <p style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
            {zonasActivas}
          </p>
        </article>
      </section>

      <div className="card border-0 shadow-sm rounded-4 p-4 mt-3">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
          <div>
            <h4 className="fw-bold mb-1">Listado de zonas</h4>
            <p className="text-muted mb-1">Crea, consulta y administra las zonas de los lugares.</p>
            <span className="badge bg-info text-dark fw-semibold">
              {zonas.length} zona{zonas.length === 1 ? "" : "s"}
            </span>
          </div>

          <button
            type="button"
            className="btn btn-warning fw-bold px-4 py-2 shadow-sm"
            onClick={() => {
              if (isFormOpen) {
                limpiarFormulario();
              } else {
                abrirFormulario();
              }
            }}
          >
            {isFormOpen ? "Cerrar formulario" : "+ Nueva Zona"}
          </button>
        </div>

        {feedback && (
          <div className={`alert alert-${feedback.type} rounded-4`} role="alert">
            {feedback.text}
          </div>
        )}

        {isFormOpen && (
          <div className="card card-body border-0 shadow-sm rounded-4 mb-4">
            <h5 className="fw-bold mb-3">{editandoId ? "Editar zona" : "Registrar nueva zona"}</h5>
            <form onSubmit={manejarEnvio} noValidate>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Nombre de la Zona</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre_zona"
                    value={form.nombre_zona}
                    onChange={manejarCambio}
                    required
                    placeholder="VIP, General, Palcos..."
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Capacidad</label>
                  <input
                    type="number"
                    className="form-control"
                    name="capacidad"
                    value={form.capacidad}
                    onChange={manejarCambio}
                    required
                    min="0"
                    placeholder="500"
                  />
                </div>

                <div className="col-md-2">
                  <label className="form-label">Estado</label>
                  <select
                    className="form-select"
                    name="estado"
                    value={form.estado}
                    onChange={manejarCambio}
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="mantenimiento">Mantenimiento</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Lugar</label>
                  <select
                    className="form-select"
                    name="lugar"
                    value={form.lugar}
                    onChange={manejarCambio}
                  >
                    <option value="">Sin lugar asignado</option>
                    {lugares.map((l) => (
                      <option key={l.id_lugar} value={l.id_lugar}>
                        {l.nombre} — {l.ciudad}
                      </option>
                    ))}
                  </select>
                  <div className="form-text text-muted">
                    Asocia la zona a un lugar especifico.
                  </div>
                </div>
              </div>

              <div className="d-flex flex-column flex-md-row gap-2 justify-content-end mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={limpiarFormulario}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Guardando..." : editandoId ? "Guardar cambios" : "Crear zona"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="border-bottom border-200 my-4" />

        <div className="d-flex justify-content-end mb-3">
          <input
            className="form-control"
            type="search"
            placeholder="Buscar por nombre, estado o lugar..."
            style={{ maxWidth: 360 }}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="table-responsive shadow-sm rounded-4 overflow-hidden">
          <table className="table align-middle table-hover bg-white mb-0">
            <thead className="table-light">
              <tr>
                <th>Zona</th>
                <th>Capacidad</th>
                <th>Estado</th>
                <th>Lugar</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {zonasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">
                    No hay zonas que coincidan con la busqueda.
                  </td>
                </tr>
              ) : (
                zonasFiltradas.map((zona) => (
                  <tr key={zona.id_zona}>
                    <td>
                      <div className="fw-bold">{zona.nombre_zona}</div>
                      <div className="text-muted" style={{ fontSize: "0.88rem" }}>
                        ID {zona.id_zona}
                      </div>
                    </td>
                    <td>{zona.capacidad?.toLocaleString() || "—"}</td>
                    <td>
                      <span
                        className={`badge ${
                          (zona.estado || "").toLowerCase() === "activo"
                            ? "bg-success"
                            : (zona.estado || "").toLowerCase() === "inactivo"
                            ? "bg-secondary"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {zona.estado || "Sin estado"}
                      </span>
                    </td>
                    <td>{zona.lugar?.nombre || "—"}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-warning me-2"
                        onClick={() => abrirEdicion(zona)}
                        title="Editar zona"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => manejarEliminar(zona)}
                        title="Eliminar zona"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}

export default ZonasDashboard;
