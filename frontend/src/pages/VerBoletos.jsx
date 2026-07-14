import LayoutPrincipal from "../layouts/LayoutPrincipal";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerEntradas, actualizarEntrada } from "../services/entradaService";
import { QRCodeSVG } from "qrcode.react";
import { cerrarSesion } from "../utils/usuario";

const getStoredUser = () => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

function getBadge(estado) {
  switch (estado) {
    case "DEVUELTO":
      return { label: "Devuelto", bg: "bg-danger" };
    case "Usado":
      return { label: "Usado", bg: "bg-secondary" };
    case "Reservado":
      return { label: "Reservado", bg: "bg-warning text-dark" };
    default:
      return { label: "Activo", bg: "bg-success" };
  }
}

function TicketCard({ boleto, onVer, onDevolver, mostrarDevolver }) {
  const badge = getBadge(boleto.estado);
  const fecha = boleto.fecha_generacion
    ? boleto.fecha_generacion.split("-").reverse().join("/")
    : "Sin fecha";

  return (
    <div className="col-md-6 col-lg-4">
      <div
        className="card h-100 shadow-sm border-0 overflow-hidden"
        style={{ borderRadius: "16px", transition: "transform 0.2s, box-shadow 0.2s" }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; }}
      >
        <div className="position-relative" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", padding: "24px 20px 16px" }}>
          <div className="d-flex justify-content-between align-items-start mb-2">
            <span className="badge bg-white text-dark fw-bold" style={{ fontSize: "10px", letterSpacing: "1px" }}>
              TICKET PLUS+
            </span>
            <span className={`badge ${badge.bg} px-2 py-1`} style={{ fontSize: "10px" }}>
              {badge.label}
            </span>
          </div>
          <h5 className="text-white fw-bold mb-1 mt-2" style={{ fontSize: "1.05rem" }}>
            {boleto.nombre_evento || "Evento registrado"}
          </h5>
          <div className="d-flex align-items-center gap-2 mt-2" style={{ opacity: 0.8 }}>
            <small className="text-white-50" style={{ fontSize: "11px" }}>{fecha}</small>
            <small className="text-white-50">|</small>
            <small className="text-white-50" style={{ fontSize: "11px" }}>{boleto.lugar || "Lugar"}</small>
          </div>
        </div>

        <div style={{ borderLeft: "2px dashed #dee2e6", borderRight: "2px dashed #dee2e6", margin: "0 16px", height: "1px" }}></div>

        <div className="card-body px-3 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <div className="text-muted small mb-1">Zona</div>
              <div className="fw-semibold">{boleto.zona || "General"}</div>
            </div>
            <div className="text-end">
              <div className="text-muted small mb-1">Precio</div>
              <div className="fw-bold text-danger fs-5">S/. {boleto.precio_final?.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="card-footer bg-transparent border-0 px-3 pb-3 pt-0 d-flex gap-2">
          <button
            className="btn btn-sm fw-semibold flex-grow-1"
            style={{ borderRadius: "8px", background: "#e8f5e9", color: "#2e7d32", border: "1px solid #c8e6c9" }}
            onClick={() => onVer(boleto)}
          >
            Ver Boleto
          </button>
          {mostrarDevolver && (
            <button
              className="btn btn-sm fw-semibold"
              style={{ borderRadius: "8px", background: "#ffebee", color: "#c62828", border: "1px solid #ffcdd2" }}
              onClick={() => onDevolver(boleto)}
            >
              Devolver
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ show, boleto, onConfirm, onCancel }) {
  if (!show || !boleto) return null;
  return (
    <>
      <div className="modal-backdrop fade show" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}></div>
      <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "16px" }}>
            <div className="modal-header border-0 pb-0">
              <div>
                <h5 className="modal-title fw-bold">Confirmar devolucion</h5>
                <small className="text-muted">Esta accion no se puede deshacer</small>
              </div>
              <button type="button" className="btn-close" onClick={onCancel}></button>
            </div>
            <div className="modal-body py-4">
              <div className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: "#fff3cd" }}>
                <div style={{ fontSize: "2rem" }}>&#9888;</div>
                <div>
                  <p className="fw-bold mb-1">Vas a devolver el boleto:</p>
                  <p className="mb-0 text-muted small">{boleto.nombre_evento || "Evento registrado"} - S/. {boleto.precio_final?.toFixed(2)}</p>
                </div>
              </div>
              <p className="mt-3 mb-0 text-muted small">Tu reembolso sera procesado dentro de los siguientes 7 dias habiles.</p>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancelar</button>
              <button type="button" className="btn btn-danger fw-bold" onClick={onConfirm}>Si, devolver boleto</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function VerBoletos() {
  const navigate = useNavigate();
  const [entradas, setEntradas] = useState([]);
  const [boletoSeleccionado, setBoletoSeleccionado] = useState(null);
  const [pestanaActiva, setPestanaActiva] = useState("TICKETS");
  const [showConfirm, setShowConfirm] = useState(false);
  const [boletoDevolver, setBoletoDevolver] = useState(null);

  const user = getStoredUser();

  useEffect(() => {
    const cargarEntradas = async () => {
      try {
        const data = await obtenerEntradas();
        setEntradas(data);
      } catch (error) {
        console.error("Error cargando entradas", error);
      }
    };
    cargarEntradas();
  }, []);

  const boletosMostrados = entradas.filter((boleto) => {
    if (pestanaActiva === "TICKETS") {
      return boleto.estado !== "DEVUELTO";
    }
    return boleto.estado === "DEVUELTO";
  });

  const handleDevolver = (boleto) => {
    setBoletoDevolver(boleto);
    setShowConfirm(true);
  };

  const confirmarDevolucion = async () => {
    if (!boletoDevolver) return;
    try {
      const boletoActualizado = { ...boletoDevolver, estado: "DEVUELTO" };
      await actualizarEntrada(boletoDevolver.id_entrada, boletoActualizado);
      setEntradas((prev) =>
        prev.map((ent) =>
          ent.id_entrada === boletoDevolver.id_entrada ? boletoActualizado : ent
        )
      );
      setShowConfirm(false);
      setBoletoDevolver(null);
    } catch (error) {
      console.error("Error al cancelar el boleto:", error);
      alert("Hubo un problema al procesar tu devolucion.");
      setShowConfirm(false);
    }
  };

  return (
    <LayoutPrincipal>
      <section
        className="py-5"
        style={{
          background: "linear-gradient(180deg, rgba(220,53,69,0.08) 0%, rgba(255,255,255,1) 32%, rgba(248,249,250,1) 100%)",
          minHeight: "calc(100vh - 140px)",
        }}
      >
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="fw-bold mb-1">Mis Boletos</h1>
              <p className="text-muted mb-0">Gestiona tus entradas y compras recientes</p>
            </div>
            <div className="dropdown">
              <button
                className="btn btn-dark dropdown-toggle fw-semibold"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ borderRadius: "10px" }}
              >
                Compras & E-Tickets
              </button>
              <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0" style={{ borderRadius: "12px" }}>
                <li>
                  <button className="dropdown-item fw-semibold" onClick={() => setPestanaActiva("TICKETS")}>
                    &#127915; E-Tickets
                  </button>
                </li>
                <li>
                  <button className="dropdown-item fw-semibold" onClick={() => setPestanaActiva("DEVOLUCIONES")}>
                    &#128260; Mis Devoluciones
                  </button>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item fw-semibold" onClick={() => navigate("/cambiar-contrasena")}>
                    &#128274; Cambiar Contrasena
                  </button>
                </li>
                <li>
                  <button className="dropdown-item fw-semibold text-danger" onClick={async () => { await cerrarSesion(); navigate("/"); }}>
                    &#10140; Cerrar Sesion
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="d-flex gap-2 mb-4">
            <button
              className="btn fw-semibold px-4"
              style={{
                borderRadius: "10px",
                background: pestanaActiva === "TICKETS" ? "#dc3545" : "white",
                color: pestanaActiva === "TICKETS" ? "white" : "#6c757d",
                border: pestanaActiva === "TICKETS" ? "2px solid #dc3545" : "2px solid #dee2e6",
                transition: "all 0.2s",
              }}
              onClick={() => setPestanaActiva("TICKETS")}
            >
              Mis Entradas
            </button>
            <button
              className="btn fw-semibold px-4"
              style={{
                borderRadius: "10px",
                background: pestanaActiva === "DEVOLUCIONES" ? "#dc3545" : "white",
                color: pestanaActiva === "DEVOLUCIONES" ? "white" : "#6c757d",
                border: pestanaActiva === "DEVOLUCIONES" ? "2px solid #dc3545" : "2px solid #dee2e6",
                transition: "all 0.2s",
              }}
              onClick={() => setPestanaActiva("DEVOLUCIONES")}
            >
              Devoluciones
            </button>
          </div>

          {boletosMostrados.length === 0 ? (
            <div className="text-center my-5 py-5">
              <div style={{ fontSize: "4rem", marginBottom: "16px" }}>
                {pestanaActiva === "TICKETS" ? "&#127915;" : "&#128260;"}
              </div>
              <h3 className="fw-bold text-dark mb-2">
                {pestanaActiva === "TICKETS"
                  ? "No tienes boletos disponibles"
                  : "No tienes boletos devueltos"}
              </h3>
              <p className="text-muted mb-4">
                {pestanaActiva === "TICKETS"
                  ? "Explora nuestros eventos y compra tu primera entrada"
                  : "Aun no has devuelto ningun boleto"}
              </p>
              {pestanaActiva === "TICKETS" && (
                <Link to="/" className="btn btn-danger btn-lg fw-bold px-5" style={{ borderRadius: "12px" }}>
                  Comprar Boletos
                </Link>
              )}
            </div>
          ) : (
            <div className="row g-4">
              {boletosMostrados.map((boleto) => (
                <TicketCard
                  key={boleto.id_entrada}
                  boleto={boleto}
                  onVer={(b) => setBoletoSeleccionado(b)}
                  onDevolver={handleDevolver}
                  mostrarDevolver={pestanaActiva === "TICKETS"}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {boletoSeleccionado && (
        <>
          <div className="modal-backdrop fade show" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={() => setBoletoSeleccionado(null)}></div>
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow-lg" style={{ borderRadius: "20px", overflow: "hidden" }}>
                <div className="position-relative" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", padding: "24px" }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-white fw-bold" style={{ fontSize: "1rem" }}>Ticket Plus+</span>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setBoletoSeleccionado(null)}></button>
                  </div>
                  <h3 className="text-white fw-bold text-center my-3">
                    {boletoSeleccionado.nombre_evento || "Evento registrado"}
                  </h3>
                  <div className="text-center">
                    <span className="badge bg-white text-dark px-3 py-2" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                      #{boletoSeleccionado.codigo_qr}
                    </span>
                  </div>
                </div>

                <div style={{ borderLeft: "2px dashed #dee2e6", borderRight: "2px dashed #dee2e6", margin: "0 24px", height: "1px", position: "relative" }}>
                  <div style={{ position: "absolute", left: "-32px", top: "-12px", width: "24px", height: "24px", borderRadius: "50%", background: "#f8f9fa" }}></div>
                  <div style={{ position: "absolute", right: "-32px", top: "-12px", width: "24px", height: "24px", borderRadius: "50%", background: "#f8f9fa" }}></div>
                </div>

                <div className="p-4">
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="bg-white border p-2 rounded-3 d-flex align-items-center justify-content-center" style={{ width: "120px", height: "120px", flexShrink: 0 }}>
                      <QRCodeSVG
                        value={boletoSeleccionado.codigo_qr}
                        size={100}
                        bgColor="#ffffff"
                        fgColor="#1a1a2e"
                        includeMargin={false}
                      />
                    </div>
                    <div style={{ fontSize: "13px" }}>
                      <div className="mb-2">
                        <span className="text-muted d-block" style={{ fontSize: "11px" }}>Cliente</span>
                        <strong>{user?.nombre} {user?.apellido}</strong>
                      </div>
                      <div className="mb-2">
                        <span className="text-muted d-block" style={{ fontSize: "11px" }}>Fecha</span>
                        <strong>{boletoSeleccionado.fecha_generacion?.split("-").reverse().join("/")}</strong>
                      </div>
                      <div className="mb-2">
                        <span className="text-muted d-block" style={{ fontSize: "11px" }}>Lugar</span>
                        <strong>{boletoSeleccionado.lugar || "Lugar"}</strong>
                      </div>
                      <div>
                        <span className="text-muted d-block" style={{ fontSize: "11px" }}>Zona</span>
                        <strong>{boletoSeleccionado.zona || "General"}</strong>
                      </div>
                    </div>
                  </div>

                  {boletoSeleccionado.estado === "DEVUELTO" ? (
                    <div className="alert alert-danger text-center fw-bold mb-3 py-2" style={{ borderRadius: "10px" }}>
                      Este boleto ha sido devuelto y no es valido
                    </div>
                  ) : (
                    <p className="text-muted small text-center mb-3">
                      Muestra el codigo QR desde tu celular para ingresar al evento.
                    </p>
                  )}

                  <div className="border rounded-3 p-3" style={{ borderRadius: "12px", background: "#f8f9fa" }}>
                    <div className="d-flex justify-content-between small mb-2">
                      <span className="text-muted">Cantidad</span>
                      <span>{boletoSeleccionado.cantidad || 1}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Total pagado</span>
                      <span className="text-danger fs-5">S/. {boletoSeleccionado.precio_final?.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="d-grid mt-4">
                    <button type="button" className="btn btn-dark fw-semibold py-2" style={{ borderRadius: "10px" }} onClick={() => setBoletoSeleccionado(null)}>
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <ConfirmModal
        show={showConfirm}
        boleto={boletoDevolver}
        onConfirm={confirmarDevolucion}
        onCancel={() => { setShowConfirm(false); setBoletoDevolver(null); }}
      />
    </LayoutPrincipal>
  );
}
