import { useEffect, useMemo, useState } from "react";
import DashboardShell from "./DashboardShell";
import {
  obtenerLugares,
  crearLugar,
  actualizarLugar,
  eliminarLugar,
} from "../../services/eventoService";

const INITIAL_LUGAR = {
  nombre: "",
  direccion: "",
  ciudad: "",
  capacidad_total: "",
};

function LugaresDashboard() {
  const [lugares, setLugares] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState(INITIAL_LUGAR);
  const [editandoId, setEditandoId] = useState(null);

  const cargarLugares = async () => {
    try {
      const data = await obtenerLugares();
      setLugares(data || []);
      setFeedback(null);
    } catch (error) {
      console.error("Error cargando lugares:", error);
      setFeedback({
        type: "danger",
        text: "No se pudieron cargar los lugares. Verifica la conexion con el backend.",
      });
    }
  };

  useEffect(() => {
    cargarLugares();
  }, []);

  const abrirFormulario = () => {
    setForm(INITIAL_LUGAR);
    setFeedback(null);
    setIsFormOpen(true);
  };

  const limpiarFormulario = () => {
    setForm(INITIAL_LUGAR);
    setFeedback(null);
    setIsFormOpen(false);
    setEditandoId(null);
  };

  const abrirEdicion = (lugar) => {
    setEditandoId(lugar.id_lugar);
    setForm({
      nombre: lugar.nombre || "",
      direccion: lugar.direccion || "",
      ciudad: lugar.ciudad || "",
      capacidad_total: lugar.capacidad_total || "",
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

    if (!form.nombre.trim() || !form.direccion.trim() || !form.ciudad.trim()) {
      setFeedback({ type: "danger", text: "Nombre, direccion y ciudad son obligatorios." });
      return;
    }

    if (!form.capacidad_total || Number(form.capacidad_total) < 0) {
      setFeedback({ type: "danger", text: "La capacidad total debe ser un numero positivo." });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const payload = {
      nombre: form.nombre.trim(),
      direccion: form.direccion.trim(),
      ciudad: form.ciudad.trim(),
      capacidad_total: Number(form.capacidad_total),
    };

    try {
      if (editandoId) {
        await actualizarLugar(editandoId, payload);
        setFeedback({ type: "success", text: "Lugar actualizado correctamente." });
      } else {
        await crearLugar(payload);
        setFeedback({ type: "success", text: "Lugar creado correctamente." });
      }
      limpiarFormulario();
      cargarLugares();
    } catch (error) {
      console.error("Error al guardar lugar:", error);
      setFeedback({ type: "danger", text: error.message || "Error al guardar el lugar." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const manejarEliminar = async (lugar) => {
    const confirmacion = window.confirm(`¿Eliminar lugar "${lugar.nombre}"?`);
    if (!confirmacion) return;

    try {
      await eliminarLugar(lugar.id_lugar);
      setFeedback({ type: "success", text: "Lugar eliminado correctamente." });
      cargarLugares();
    } catch (error) {
      setFeedback({ type: "danger", text: error.message || "Error al eliminar el lugar." });
    }
  };

  const lugaresFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return lugares;

    return lugares.filter((lugar) => {
      const nombre = (lugar.nombre || "").toLowerCase();
      const direccion = (lugar.direccion || "").toLowerCase();
      const ciudad = (lugar.ciudad || "").toLowerCase();

      return nombre.includes(texto) || direccion.includes(texto) || ciudad.includes(texto);
    });
  }, [busqueda, lugares]);

  const totalLugares = lugares.length;
  const ciudadesUnicas = [...new Set(lugares.map((l) => l.ciudad).filter(Boolean))].length;

  return (
    <DashboardShell
      activeSection="lugares"
      title="Gestion de Lugares"
      subtitle="Administra los espacios donde se realizan los eventos"
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
            Total lugares
          </h3>
          <p style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
            {totalLugares}
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
            Ciudades
          </h3>
          <p style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>
            {ciudadesUnicas}
          </p>
        </article>
      </section>

      <div className="card border-0 shadow-sm rounded-4 p-4 mt-3">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
          <div>
            <h4 className="fw-bold mb-1">Listado de lugares</h4>
            <p className="text-muted mb-1">Crea, consulta y administra los espacios de eventos.</p>
            <span className="badge bg-info text-dark fw-semibold">
              {lugares.length} lugar{lugares.length === 1 ? "" : "es"}
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
            {isFormOpen ? "Cerrar formulario" : "+ Nuevo Lugar"}
          </button>
        </div>

        {feedback && (
          <div className={`alert alert-${feedback.type} rounded-4`} role="alert">
            {feedback.text}
          </div>
        )}

        {isFormOpen && (
          <div className="card card-body border-0 shadow-sm rounded-4 mb-4">
            <h5 className="fw-bold mb-3">{editandoId ? "Editar lugar" : "Registrar nuevo lugar"}</h5>
            <form onSubmit={manejarEnvio} noValidate>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre del Lugar</label>
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    value={form.nombre}
                    onChange={manejarCambio}
                    required
                    placeholder="Estadio Nacional"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Ciudad</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ciudad"
                    value={form.ciudad}
                    onChange={manejarCambio}
                    required
                    placeholder="Lima"
                  />
                </div>

                <div className="col-md-8">
                  <label className="form-label">Direccion</label>
                  <input
                    type="text"
                    className="form-control"
                    name="direccion"
                    value={form.direccion}
                    onChange={manejarCambio}
                    required
                    placeholder="C. Jose Diaz s/n, Lima"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Capacidad Total</label>
                  <input
                    type="number"
                    className="form-control"
                    name="capacidad_total"
                    value={form.capacidad_total}
                    onChange={manejarCambio}
                    required
                    min="0"
                    placeholder="50000"
                  />
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
                  {isSubmitting ? "Guardando..." : editandoId ? "Guardar cambios" : "Crear lugar"}
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
            placeholder="Buscar por nombre, direccion o ciudad..."
            style={{ maxWidth: 360 }}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="table-responsive shadow-sm rounded-4 overflow-hidden">
          <table className="table align-middle table-hover bg-white mb-0">
            <thead className="table-light">
              <tr>
                <th>Lugar</th>
                <th>Direccion</th>
                <th>Ciudad</th>
                <th>Capacidad</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {lugaresFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-muted py-4">
                    No hay lugares que coincidan con la busqueda.
                  </td>
                </tr>
              ) : (
                lugaresFiltrados.map((lugar) => (
                  <tr key={lugar.id_lugar}>
                    <td>
                      <div className="fw-bold">{lugar.nombre}</div>
                      <div className="text-muted" style={{ fontSize: "0.88rem" }}>
                        ID {lugar.id_lugar}
                      </div>
                    </td>
                    <td>{lugar.direccion || "—"}</td>
                    <td>{lugar.ciudad || "—"}</td>
                    <td>{lugar.capacidad_total?.toLocaleString() || "—"}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-warning me-2"
                        onClick={() => abrirEdicion(lugar)}
                        title="Editar lugar"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => manejarEliminar(lugar)}
                        title="Eliminar lugar"
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

export default LugaresDashboard;
