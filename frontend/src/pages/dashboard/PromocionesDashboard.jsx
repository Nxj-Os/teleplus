import { useEffect, useState } from "react";
import DashboardShell from "./DashboardShell";
import {
  fetchPromociones,
  crearPromocion,
  actualizarPromocion,
  eliminarPromocion,
} from "../../services/PromocionService";

const INITIAL_FORM = {
  idPromocion: null,
  codigo: "",
  descuentoPorcentaje: "",
  fechaInicio: "",
  fechaFin: "",
  maximoUsos: "",
  stockDisponible: "",
  estado: "ACTIVA",
};

function PromocionesDashboard() {
  const [promociones, setPromociones] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cargarPromociones = async () => {
    try {
      const data = await fetchPromociones();
      setPromociones(data || []);
      setFeedback(null);
    } catch (error) {
      console.error("Error cargando promociones:", error);
      setFeedback({
        type: "danger",
        text: error?.message
          ? `Error al cargar promociones: ${error.message}`
          : "No se pudieron cargar las promociones. Verifica la conexión con el backend.",
      });
    }
  };

  useEffect(() => {
    const inicializar = async () => {
      await cargarPromociones();
    };
    inicializar();
  }, []);

  const abrirFormulario = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setFeedback(null);
    setIsFormOpen(true);
  };

  const obtenerEstadoPromocion = (promo) => {
    const estadoBackend = promo.estado?.toString().toUpperCase();
    const fechaInicio = promo.fechaInicio ? new Date(promo.fechaInicio) : null;
    const fechaFin = promo.fechaFin ? new Date(promo.fechaFin) : null;
    const hoy = new Date();

    if (estadoBackend === "INACTIVA") {
      return "INACTIVA";
    }

    if (fechaInicio && hoy < fechaInicio) {
      return "INACTIVA";
    }

    if (fechaFin && hoy > fechaFin) {
      return "INACTIVA";
    }

    return "ACTIVA";
  };

  const validarFormulario = (values) => {
    const validation = {};

    if (!values.codigo?.trim()) {
      validation.codigo = "El código es obligatorio.";
    } else if (values.codigo.trim().length > 50) {
      validation.codigo = "El código no puede superar 50 caracteres.";
    }

    const descuento = Number(values.descuentoPorcentaje);
    if (values.descuentoPorcentaje === "" || Number.isNaN(descuento)) {
      validation.descuentoPorcentaje = "El descuento es obligatorio.";
    } else if (descuento < 1 || descuento > 100) {
      validation.descuentoPorcentaje = "El descuento debe estar entre 1 y 100%.";
    }

    if (!values.fechaInicio) {
      validation.fechaInicio = "La fecha inicio es obligatoria.";
    }

    if (!values.fechaFin) {
      validation.fechaFin = "La fecha fin es obligatoria.";
    }

    if (values.fechaInicio && values.fechaFin) {
      const inicio = new Date(values.fechaInicio);
      const fin = new Date(values.fechaFin);
      if (fin < inicio) {
        validation.fechaFin = "La fecha fin no puede ser anterior a la fecha inicio.";
      }
    }

    const maximoUsos = Number(values.maximoUsos);
    if (values.maximoUsos === "" || Number.isNaN(maximoUsos)) {
      validation.maximoUsos = "El máximo de usos es obligatorio.";
    } else if (maximoUsos < 1) {
      validation.maximoUsos = "El máximo de usos debe ser al menos 1.";
    }

    const stockDisponible = Number(values.stockDisponible);
    if (values.stockDisponible === "" || Number.isNaN(stockDisponible)) {
      validation.stockDisponible = "El stock disponible es obligatorio.";
    } else if (stockDisponible < 1) {
      validation.stockDisponible = "El stock disponible debe ser al menos 1.";
    }

    return validation;
  };

  const limpiarFormulario = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setFeedback(null);
    setIsFormOpen(false);
  };

  const manejarCambio = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const manejarEnvio = async (event) => {
    event.preventDefault();

    const validation = validarFormulario(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const payload = {
      codigo: form.codigo.trim(),
      descuentoPorcentaje: Number(form.descuentoPorcentaje),
      fechaInicio: form.fechaInicio,
      fechaFin: form.fechaFin,
      maximoUsos: Number(form.maximoUsos),
      stockDisponible: Number(form.stockDisponible),
      estado: form.estado || "ACTIVA",
    };

    try {
      if (form.idPromocion) {
        await actualizarPromocion(form.idPromocion, payload);
        setFeedback({ type: "success", text: "Promoción actualizada correctamente." });
      } else {
        await crearPromocion(payload);
        setFeedback({ type: "success", text: "Promoción creada correctamente." });
      }
      limpiarFormulario();
      cargarPromociones();
    } catch (error) {
      setFeedback({
        type: "danger",
        text: error.message || "Error al guardar la promoción.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const manejarEdicion = (promo) => {
    setForm({
      idPromocion: promo.idPromocion,
      codigo: promo.codigo || "",
      descuentoPorcentaje: promo.descuentoPorcentaje?.toString() || "",
      fechaInicio: promo.fechaInicio || "",
      fechaFin: promo.fechaFin || "",
      maximoUsos: promo.maximoUsos?.toString() || "",
      stockDisponible: promo.stockDisponible?.toString() || promo.stock?.toString() || "",
      estado: promo.estado || "ACTIVA",
    });
    setErrors({});
    setFeedback(null);
    setIsFormOpen(true);
  };

  const manejarEliminacion = async (promo) => {
    const confirmacion = window.confirm(`¿Eliminar promoción ${promo.codigo}?`);
    if (!confirmacion) return;

    try {
      await eliminarPromocion(promo.idPromocion);
      setFeedback({ type: "success", text: "Promoción eliminada correctamente." });
      cargarPromociones();
    } catch (error) {
      setFeedback({ type: "danger", text: error.message || "Error al eliminar la promoción." });
    }
  };

  return (
    <DashboardShell
      activeSection="promociones"
      title="Promociones"
      subtitle="Administra descuentos y campañas"
    >
      <div className="card border-0 shadow-sm rounded-4 p-4 mt-3">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
          <div>
            <h4 className="fw-bold mb-1">Gestión de Promociones</h4>
            <p className="text-muted mb-1">Administra códigos promocionales y campañas directas desde el backend.</p>
            <span className="badge bg-info text-dark fw-semibold">
              {promociones.length} promoción{promociones.length === 1 ? "" : "es"} cargada{promociones.length === 1 ? "" : "s"}
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
            {isFormOpen ? "Cerrar formulario" : "+ Nueva promoción"}
          </button>
        </div>

        {feedback && (
          <div className={`alert alert-${feedback.type} rounded-4`} role="alert">
            {feedback.text}
          </div>
        )}

        {isFormOpen && (
          <div className="card card-body border-0 shadow-sm rounded-4 mb-4">
            <h5 className="fw-bold mb-3">{form.idPromocion ? "Editar promoción" : "Crear nueva promoción"}</h5>
            <form onSubmit={manejarEnvio} noValidate>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Código</label>
                  <input
                    name="codigo"
                    type="text"
                    className={`form-control ${errors.codigo ? "is-invalid" : ""}`}
                    value={form.codigo}
                    onChange={manejarCambio}
                    maxLength={50}
                    placeholder="PROMO10"
                  />
                  <div className="invalid-feedback">{errors.codigo}</div>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Descuento %</label>
                  <input
                    name="descuentoPorcentaje"
                    type="number"
                    className={`form-control ${errors.descuentoPorcentaje ? "is-invalid" : ""}`}
                    value={form.descuentoPorcentaje}
                    onChange={manejarCambio}
                    min={1}
                    max={100}
                    placeholder="10"
                  />
                  <div className="invalid-feedback">{errors.descuentoPorcentaje}</div>
                </div>

                <div className="col-md-4">
                  <label className="form-label">Estado</label>
                  <select
                    name="estado"
                    className="form-select"
                    value={form.estado}
                    onChange={manejarCambio}
                  >
                    <option value="ACTIVA">ACTIVA</option>
                    <option value="INACTIVA">INACTIVA</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Fecha inicio</label>
                  <input
                    name="fechaInicio"
                    type="date"
                    className={`form-control ${errors.fechaInicio ? "is-invalid" : ""}`}
                    value={form.fechaInicio}
                    onChange={manejarCambio}
                  />
                  <div className="invalid-feedback">{errors.fechaInicio}</div>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Fecha fin</label>
                  <input
                    name="fechaFin"
                    type="date"
                    className={`form-control ${errors.fechaFin ? "is-invalid" : ""}`}
                    value={form.fechaFin}
                    onChange={manejarCambio}
                  />
                  <div className="invalid-feedback">{errors.fechaFin}</div>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Máximo de usos</label>
                  <input
                    name="maximoUsos"
                    type="number"
                    inputMode="numeric"
                    step="1"
                    className={`form-control ${errors.maximoUsos ? "is-invalid" : ""}`}
                    value={form.maximoUsos}
                    onChange={manejarCambio}
                    min={1}
                    placeholder="1"
                  />
                  <div className="form-text text-muted">Cantidad de veces que la promoción puede usarse.</div>
                  <div className="invalid-feedback">{errors.maximoUsos}</div>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Stock disponible</label>
                  <input
                    name="stockDisponible"
                    type="number"
                    inputMode="numeric"
                    step="1"
                    className={`form-control ${errors.stockDisponible ? "is-invalid" : ""}`}
                    value={form.stockDisponible}
                    onChange={manejarCambio}
                    min={1}
                    placeholder="1"
                  />
                  <div className="form-text text-muted">Número de unidades que todavía están disponibles.</div>
                  <div className="invalid-feedback">{errors.stockDisponible}</div>
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
                  {isSubmitting ? "Guardando..." : form.idPromocion ? "Actualizar promoción" : "Crear promoción"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="border-bottom border-200 my-4" />

        <div className="table-responsive shadow-sm rounded-4 overflow-hidden">
          <table className="table align-middle table-hover bg-white mb-0">
            <thead className="table-light">
              <tr>
                <th>Código</th>
                <th>Descuento</th>
                <th>Stock</th>
                <th>Usos</th>
                <th>Fecha fin</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {promociones.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">
                    No hay promociones registradas.
                  </td>
                </tr>
              ) : (
                promociones.map((promo) => (
                  <tr key={promo.idPromocion}>
                    <td>
                      <strong>{promo.codigo}</strong>
                    </td>
                    <td>{promo.descuentoPorcentaje}%</td>
                    <td>{promo.stockDisponible ?? promo.stock ?? "-"}</td>
                    <td>
                      {promo.cantidadUsos ?? 0} / {promo.maximoUsos ?? "-"}
                    </td>
                    <td>{promo.fechaFin || "-"}</td>
                    <td>
                      <span className={`badge ${obtenerEstadoPromocion(promo) === "ACTIVA" ? "bg-success" : "bg-danger"}`}>
                        {obtenerEstadoPromocion(promo)}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => manejarEdicion(promo)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => manejarEliminacion(promo)}
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

export default PromocionesDashboard;
