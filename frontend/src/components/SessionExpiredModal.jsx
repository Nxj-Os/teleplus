import { FaClock } from "react-icons/fa";

function SessionExpiredModal({ visible, mensaje, onClose }) {
  if (!visible) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ zIndex: 9999, backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="bg-white rounded-4 shadow p-4 text-center"
        style={{ maxWidth: "400px", width: "90%" }}
      >
        <div className="mb-3">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle"
            style={{ width: "70px", height: "70px", backgroundColor: "#fef2f2" }}
          >
            <FaClock style={{ fontSize: "2rem", color: "#dc3545" }} />
          </div>
        </div>

        <h4 className="fw-bold mb-2" style={{ color: "#1f2937" }}>
          Sesión caducada
        </h4>

        <p className="text-muted mb-4 small">
          {mensaje || "Tu sesión ha expirado por seguridad. Inicia sesión nuevamente."}
        </p>

        <button
          className="btn btn-danger fw-bold w-100 py-2"
          style={{ borderRadius: "8px" }}
          onClick={onClose}
        >
          Volver al login
        </button>
      </div>
    </div>
  );
}

export default SessionExpiredModal;
