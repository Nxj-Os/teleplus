import { useEffect, useMemo, useState } from "react";
import DashboardShell from "./DashboardShell";
import {
  obtenerEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
  obtenerLugares,
  obtenerZonasPorLugar,
  obtenerZonasPorEvento,
  crearEventoZonaPrecio,
  actualizarEventoZonaPrecio,
  eliminarEventoZonaPrecio,
} from "../../services/eventoService";

const INITIAL_EVENTO = {
  titulo: "",
  descripcion: "",
  fecha_evento: "",
  hora_evento: "",
  estado: "programado",
  imagenCarrusel: "",
  imagenPortada: "",
  imagenDetalle: "",
  lugar: "",
};

const INITIAL_EZP = {
  zona: "",
  tipoPrecio: "",
  precio: "",
  stock: "",
  fechaInicio: "",
  fechaFin: "",
};

function EventosDashboard() {
  const [eventos, setEventos] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState(INITIAL_EVENTO);
  const [editandoId, setEditandoId] = useState(null);

  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [zonaPrecioLista, setZonaPrecioLista] = useState([]);
  const [cargandoPrecios, setCargandoPrecios] = useState(false);
  const [formEzp, setFormEzp] = useState(INITIAL_EZP);
  const [editandoEzpId, setEditandoEzpId] = useState(null);
  const [isSubmittingEzp, setIsSubmittingEzp] = useState(false);

  const cargarEventos = async () => {
    try {
      const data = await obtenerEventos();
      setEventos(data || []);
      setFeedback(null);
    } catch (error) {
      console.error("Error cargando eventos:", error);
      setFeedback({
        type: "danger",
        text: "No se pudieron cargar los eventos. Verifica la conexión con el backend.",
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

  const cargarZonasPorLugar = async (idLugar) => {
    try {
      if (!idLugar) {
        setZonas([]);
        return;
      }
      const data = await obtenerZonasPorLugar(idLugar);
      setZonas(data || []);
    } catch (error) {
      console.error("Error cargando zonas del lugar:", error);
      setZonas([]);
    }
  };

  useEffect(() => {
    cargarEventos();
    cargarLugares();
  }, []);

  const abrirFormulario = () => {
    setForm(INITIAL_EVENTO);
    setFeedback(null);
    setIsFormOpen(true);
  };

  const limpiarFormulario = () => {
    setForm(INITIAL_EVENTO);
    setFeedback(null);
    setIsFormOpen(false);
    setEditandoId(null);
  };

  const abrirEdicion = (evento) => {
    setEditandoId(evento.id_evento);
    setForm({
      titulo: evento.titulo || "",
      descripcion: evento.descripcion || "",
      fecha_evento: evento.fecha_evento || "",
      hora_evento: evento.hora_evento || "",
      estado: evento.estado || "programado",
      imagenCarrusel: evento.imagenCarrusel || "",
      imagenPortada: evento.imagenPortada || "",
      imagenDetalle: evento.imagenDetalle || "",
      lugar: evento.lugar?.id_lugar || "",
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

    if (!form.titulo.trim() || !form.fecha_evento || !form.hora_evento) {
      setFeedback({ type: "danger", text: "Título, fecha y hora son obligatorios." });
      return;
    }

    if (!form.lugar) {
      setFeedback({ type: "danger", text: "Debes seleccionar un lugar." });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    const payload = {
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim(),
      fecha_evento: form.fecha_evento,
      hora_evento: form.hora_evento,
      estado: form.estado || "programado",
      imagenCarrusel: form.imagenCarrusel.trim() || null,
      imagenPortada: form.imagenPortada.trim() || null,
      imagenDetalle: form.imagenDetalle.trim() || null,
      lugar: { id_lugar: Number(form.lugar) },
    };

    try {
      if (editandoId) {
        await actualizarEvento(editandoId, payload);
        setFeedback({ type: "success", text: "Evento actualizado correctamente." });
      } else {
        await crearEvento(payload);
        setFeedback({ type: "success", text: "Evento creado correctamente." });
      }
      limpiarFormulario();
      cargarEventos();
    } catch (error) {
      console.error("Error al guardar evento:", error);
      setFeedback({ type: "danger", text: error.message || "Error al guardar el evento." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const manejarEliminar = async (evento) => {
    const confirmacion = window.confirm(`¿Eliminar evento "${evento.titulo}"?`);
    if (!confirmacion) return;

    try {
      await eliminarEvento(evento.id_evento);
      setFeedback({ type: "success", text: "Evento eliminado correctamente." });
      if (eventoSeleccionado?.id_evento === evento.id_evento) {
        setEventoSeleccionado(null);
        setZonaPrecioLista([]);
      }
      cargarEventos();
    } catch (error) {
      setFeedback({ type: "danger", text: error.message || "Error al eliminar el evento." });
    }
  };

  const seleccionarEvento = async (evento) => {
    if (eventoSeleccionado?.id_evento === evento.id_evento) {
      setEventoSeleccionado(null);
      setZonaPrecioLista([]);
      setZonas([]);
      return;
    }

    setEventoSeleccionado(evento);
    setCargandoPrecios(true);
    setFormEzp(INITIAL_EZP);
    setEditandoEzpId(null);

    try {
      const [ezpData, zonasData] = await Promise.all([
        obtenerZonasPorEvento(evento.id_evento),
        cargarZonasPorLugar(evento.lugar?.id_lugar),
      ]);
      setZonaPrecioLista(ezpData || []);
    } catch (error) {
      console.error("Error cargando precios:", error);
      setZonaPrecioLista([]);
    } finally {
      setCargandoPrecios(false);
    }
  };

  const manejarCambioEzp = (e) => {
    const { name, value } = e.target;
    setFormEzp((prev) => ({ ...prev, [name]: value }));
  };

  const abrirEdicionEzp = (ezp) => {
    setEditandoEzpId(ezp.id);
    setFormEzp({
      zona: ezp.zona?.id_zona || "",
      tipoPrecio: ezp.tipoPrecio || "",
      precio: ezp.precio || "",
      stock: ezp.stock || "",
      fechaInicio: ezp.fechaInicio ? ezp.fechaInicio.slice(0, 16) : "",
      fechaFin: ezp.fechaFin ? ezp.fechaFin.slice(0, 16) : "",
    });
  };

  const manejarEnvioEzp = async (e) => {
    e.preventDefault();

    if (!formEzp.zona || !formEzp.tipoPrecio.trim() || !formEzp.precio || !formEzp.stock || !formEzp.fechaInicio || !formEzp.fechaFin) {
      setFeedback({ type: "danger", text: "Todos los campos son obligatorios: zona, tipo de precio, precio, stock, fecha inicio y fecha fin." });
      return;
    }

    setIsSubmittingEzp(true);
    setFeedback(null);

    const payload = {
      tipoPrecio: formEzp.tipoPrecio.trim(),
      precio: Number(formEzp.precio),
      stock: Number(formEzp.stock),
      stockDisponible: Number(formEzp.stock),
      activo: true,
      fechaInicio: formEzp.fechaInicio,
      fechaFin: formEzp.fechaFin,
      evento: { id_evento: eventoSeleccionado.id_evento },
      zona: { id_zona: Number(formEzp.zona) },
    };

    try {
      if (editandoEzpId) {
        const existente = zonaPrecioLista.find((e) => e.id === editandoEzpId);
        payload.stockDisponible = existente?.stockDisponible ?? Number(formEzp.stock);
        await actualizarEventoZonaPrecio(editandoEzpId, payload);
        setFeedback({ type: "success", text: "Precio de zona actualizado correctamente." });
      } else {
        await crearEventoZonaPrecio(payload);
        setFeedback({ type: "success", text: "Precio de zona agregado correctamente." });
      }
      setFormEzp(INITIAL_EZP);
      setEditandoEzpId(null);
      const data = await obtenerZonasPorEvento(eventoSeleccionado.id_evento);
      setZonaPrecioLista(data || []);
    } catch (error) {
      console.error("Error al guardar precio:", error);
      setFeedback({ type: "danger", text: error.message || "Error al guardar el precio." });
    } finally {
      setIsSubmittingEzp(false);
    }
  };

  const manejarEliminarEzp = async (ezp) => {
    const confirmacion = window.confirm(`¿Eliminar precio "${ezp.tipoPrecio}" de zona ${ezp.zona?.nombre_zona || ezp.zona?.id_zona}?`);
    if (!confirmacion) return;

    try {
      await eliminarEventoZonaPrecio(ezp.id);
      setFeedback({ type: "success", text: "Precio eliminado correctamente." });
      const data = await obtenerZonasPorEvento(eventoSeleccionado.id_evento);
      setZonaPrecioLista(data || []);
    } catch (error) {
      setFeedback({ type: "danger", text: error.message || "Error al eliminar el precio." });
    }
  };

  const eventosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return eventos;

    return eventos.filter((evento) => {
      const titulo = (evento.titulo || "").toLowerCase();
      const estado = (evento.estado || "").toLowerCase();
      const fecha = String(evento.fecha_evento || "").toLowerCase();
      const lugar = (evento.lugar?.nombre || "").toLowerCase();

      return (
        titulo.includes(texto) ||
        estado.includes(texto) ||
        fecha.includes(texto) ||
        lugar.includes(texto)
      );
    });
  }, [busqueda, eventos]);

  const totalEventos = eventos.length;
  const eventosActivos = eventos.filter(
    (e) => (e.estado || "").toLowerCase() === "activo"
  ).length;
  const eventosProgramados = eventos.filter(
    (e) => (e.estado || "").toLowerCase() === "programado"
  ).length;

  return (
    <DashboardShell
      activeSection="eventos"
      title="Gestión de Eventos"
      subtitle="Administra eventos, zonas y precios de entrada"
    >
      <section className="cards" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", margin: "24px 0" }}>
        <article style={{ background: "rgba(255,255,255,0.9)", padding: "22px", borderRadius: "20px", boxShadow: "0 14px 35px rgba(15,23,42,0.08)", border: "1px solid rgba(148,163,184,0.16)" }}>
          <h3 style={{ color: "#475569", fontSize: "0.96rem", fontWeight: 600, marginBottom: 8 }}>Total eventos</h3>
          <p style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>{totalEventos}</p>
        </article>

        <article style={{ background: "rgba(255,255,255,0.9)", padding: "22px", borderRadius: "20px", boxShadow: "0 14px 35px rgba(15,23,42,0.08)", border: "1px solid rgba(148,163,184,0.16)" }}>
          <h3 style={{ color: "#475569", fontSize: "0.96rem", fontWeight: 600, marginBottom: 8 }}>Activos</h3>
          <p style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>{eventosActivos}</p>
        </article>

        <article style={{ background: "rgba(255,255,255,0.9)", padding: "22px", borderRadius: "20px", boxShadow: "0 14px 35px rgba(15,23,42,0.08)", border: "1px solid rgba(148,163,184,0.16)" }}>
          <h3 style={{ color: "#475569", fontSize: "0.96rem", fontWeight: 600, marginBottom: 8 }}>Programados</h3>
          <p style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0f172a", margin: 0 }}>{eventosProgramados}</p>
        </article>
      </section>

      <div className="card border-0 shadow-sm rounded-4 p-4 mt-3">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
          <div>
            <h4 className="fw-bold mb-1">Listado de eventos</h4>
            <p className="text-muted mb-1">Crea, consulta y administra eventos y precios de entrada.</p>
            <span className="badge bg-info text-dark fw-semibold">
              {eventos.length} evento{eventos.length === 1 ? "" : "s"}
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
            {isFormOpen ? "Cerrar formulario" : "+ Nuevo Evento"}
          </button>
        </div>

        {feedback && (
          <div className={`alert alert-${feedback.type} rounded-4`} role="alert">
            {feedback.text}
          </div>
        )}

        {isFormOpen && (
          <div className="card card-body border-0 shadow-sm rounded-4 mb-4">
            <h5 className="fw-bold mb-3">{editandoId ? "Editar evento" : "Registrar nuevo evento"}</h5>
            <form onSubmit={manejarEnvio} noValidate>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Título del Evento</label>
                  <input
                    type="text"
                    className="form-control"
                    name="titulo"
                    value={form.titulo}
                    onChange={manejarCambio}
                    required
                    placeholder="Concierto de Rock"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Lugar</label>
                  <select
                    className="form-select"
                    name="lugar"
                    value={form.lugar}
                    onChange={manejarCambio}
                    required
                  >
                    <option value="">Seleccionar lugar...</option>
                    {lugares.map((l) => (
                      <option key={l.id_lugar} value={l.id_lugar}>
                        {l.nombre} — {l.ciudad}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-12">
                  <label className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    name="descripcion"
                    value={form.descripcion}
                    onChange={manejarCambio}
                    rows="2"
                    placeholder="Descripción del evento..."
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Fecha del Evento</label>
                  <input
                    type="date"
                    className="form-control"
                    name="fecha_evento"
                    value={form.fecha_evento}
                    onChange={manejarCambio}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Hora del Evento</label>
                  <input
                    type="time"
                    className="form-control"
                    name="hora_evento"
                    value={form.hora_evento}
                    onChange={manejarCambio}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Estado</label>
                  <select
                    className="form-select"
                    name="estado"
                    value={form.estado}
                    onChange={manejarCambio}
                  >
                    <option value="programado">Programado</option>
                    <option value="activo">Activo</option>
                    <option value="finalizado">Finalizado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                <div className="col-md-12">
                  <label className="form-label">URL imagen carrusel (inicio)</label>
                  <input
                    type="url"
                    className="form-control"
                    name="imagenCarrusel"
                    value={form.imagenCarrusel}
                    onChange={manejarCambio}
                    placeholder="https://ejemplo.com/carrusel.jpg"
                  />
                  <div className="form-text text-muted">
                    Imagen del carrusel en la página principal. Tamaño recomendado: 1200x600px.
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">URL imagen portada (tarjeta inicio)</label>
                  <input
                    type="url"
                    className="form-control"
                    name="imagenPortada"
                    value={form.imagenPortada}
                    onChange={manejarCambio}
                    placeholder="https://ejemplo.com/portada.jpg"
                  />
                  <div className="form-text text-muted">
                    Imagen de la tarjeta en la grilla de eventos. Tamaño recomendado: 400x300px.
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">URL imagen detalle del evento</label>
                  <input
                    type="url"
                    className="form-control"
                    name="imagenDetalle"
                    value={form.imagenDetalle}
                    onChange={manejarCambio}
                    placeholder="https://ejemplo.com/detalle-banner.jpg"
                  />
                  <div className="form-text text-muted">
                    Banner en la página de detalle del evento. Tamaño recomendado: 1200x500px.
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
                  {isSubmitting ? "Guardando..." : editandoId ? "Guardar cambios" : "Crear evento"}
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
            placeholder="Buscar por título, fecha, estado o lugar..."
            style={{ maxWidth: 360 }}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="table-responsive shadow-sm rounded-4 overflow-hidden">
          <table className="table align-middle table-hover bg-white mb-0">
            <thead className="table-light">
              <tr>
                <th>Evento</th>
                <th>Lugar</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {eventosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-4">
                    No hay eventos que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                eventosFiltrados.map((evento) => (
                  <tr
                    key={evento.id_evento}
                    style={{
                      background: eventoSeleccionado?.id_evento === evento.id_evento ? "#f0f7ff" : undefined,
                    }}
                  >
                    <td>
                      <div className="fw-bold">{evento.titulo}</div>
                      <div className="text-muted" style={{ fontSize: "0.88rem" }}>
                        ID {evento.id_evento}
                      </div>
                    </td>
                    <td>{evento.lugar?.nombre || "—"}</td>
                    <td>{evento.fecha_evento || "—"}</td>
                    <td>{evento.hora_evento || "—"}</td>
                    <td>
                      <span
                        className={`badge ${
                          (evento.estado || "").toLowerCase() === "activo"
                            ? "bg-success"
                            : (evento.estado || "").toLowerCase() === "programado"
                            ? "bg-warning text-dark"
                            : (evento.estado || "").toLowerCase() === "finalizado"
                            ? "bg-secondary"
                            : "bg-danger"
                        }`}
                      >
                        {evento.estado || "Sin estado"}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-warning me-2"
                        onClick={() => abrirEdicion(evento)}
                        title="Editar evento"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-info me-2"
                        onClick={() => seleccionarEvento(evento)}
                        title="Gestionar precios de zonas"
                      >
                        {eventoSeleccionado?.id_evento === evento.id_evento ? "Ocultar precios" : "Precios"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => manejarEliminar(evento)}
                        title="Eliminar evento"
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

      {eventoSeleccionado && (
        <div className="card border-0 shadow-sm rounded-4 p-4 mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="fw-bold mb-1">
                Precios de zonas — {eventoSeleccionado.titulo}
              </h5>
              <span className="badge bg-secondary">
                {zonaPrecioLista.length} precio{zonaPrecioLista.length === 1 ? "" : "s"} configurado{zonaPrecioLista.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>

          <div className="card card-body border-0 shadow-sm rounded-4 mb-4">
            <h6 className="fw-bold mb-3">{editandoEzpId ? "Editar precio de zona" : "Agregar nuevo precio de zona"}</h6>
            <form onSubmit={manejarEnvioEzp} noValidate>
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Zona</label>
                  <select
                    className="form-select"
                    name="zona"
                    value={formEzp.zona}
                    onChange={manejarCambioEzp}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {zonas.map((z) => (
                      <option key={z.id_zona} value={z.id_zona}>
                        {z.nombre_zona} (cap. {z.capacidad})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Tipo de precio</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tipoPrecio"
                    value={formEzp.tipoPrecio}
                    onChange={manejarCambioEzp}
                    required
                    placeholder="PREVENTA FANS"
                  />
                </div>

                <div className="col-md-2">
                  <label className="form-label">Precio (S/.)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="precio"
                    value={formEzp.precio}
                    onChange={manejarCambioEzp}
                    required
                    min="0"
                    step="0.01"
                    placeholder="150.00"
                  />
                </div>

                <div className="col-md-2">
                  <label className="form-label">Stock total</label>
                  <input
                    type="number"
                    className="form-control"
                    name="stock"
                    value={formEzp.stock}
                    onChange={manejarCambioEzp}
                    required
                    min="1"
                    placeholder="500"
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Inicio de venta</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    name="fechaInicio"
                    value={formEzp.fechaInicio}
                    onChange={manejarCambioEzp}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Fin de venta</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    name="fechaFin"
                    value={formEzp.fechaFin}
                    onChange={manejarCambioEzp}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end mt-3">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmittingEzp}
                >
                  {isSubmittingEzp ? "Guardando..." : editandoEzpId ? "Guardar cambios" : "Agregar precio"}
                </button>
              </div>
            </form>
          </div>

          {cargandoPrecios ? (
            <div className="text-center text-muted py-3">Cargando precios...</div>
          ) : zonaPrecioLista.length === 0 ? (
            <div className="text-center text-muted py-3">
              No hay precios configurados para este evento.
            </div>
          ) : (
            <div className="table-responsive shadow-sm rounded-4 overflow-hidden">
              <table className="table align-middle table-hover bg-white mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Zona</th>
                    <th>Tipo de precio</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Disponible</th>
                    <th>Inicio venta</th>
                    <th>Fin venta</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {zonaPrecioLista.map((ezp) => (
                    <tr key={ezp.id}>
                      <td className="fw-bold">{ezp.zona?.nombre_zona || `Zona ${ezp.zona?.id_zona}`}</td>
                      <td>
                        <span className="badge bg-dark">{ezp.tipoPrecio}</span>
                      </td>
                      <td>S/. {Number(ezp.precio).toFixed(2)}</td>
                      <td>{ezp.stock}</td>
                      <td>{ezp.stockDisponible}</td>
                      <td style={{ fontSize: "0.85rem" }}>
                        {ezp.fechaInicio
                          ? new Date(ezp.fechaInicio).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })
                          : "—"}
                      </td>
                      <td style={{ fontSize: "0.85rem" }}>
                        {ezp.fechaFin
                          ? new Date(ezp.fechaFin).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })
                          : "—"}
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-warning me-2"
                          onClick={() => abrirEdicionEzp(ezp)}
                          title="Editar precio"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => manejarEliminarEzp(ezp)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </DashboardShell>
  );
}

export default EventosDashboard;
