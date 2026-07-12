import { useState } from "react";
import styles from "../css/pasarelaPago.module.css";

function PasarelaPago({ metodoPago, monto, onExito, onCancelar }) {
  const [estado, setEstado] = useState("form");
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const [cvv, setCvv] = useState("");
  const [celular, setCelular] = useState("");

  const formatNumeroTarjeta = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : v;
  };

  const handlePagar = () => {
    setEstado("procesando");
    setTimeout(() => {
      const aprobado = Math.random() < 0.9;
      setEstado(aprobado ? "aprobado" : "rechazado");
      if (aprobado) {
        setTimeout(() => onExito(), 1500);
      }
    }, 2000);
  };

  const esTarjeta = metodoPago === "Tarjeta de crédito" || metodoPago === "Tarjeta de débito";
  const esYapePlin = metodoPago === "Yape / Plin";

  if (estado === "procesando") {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.contenido}>
            <div className={styles.spinner}></div>
            <h4>Procesando pago...</h4>
            <p className="text-muted">Por favor espere</p>
          </div>
        </div>
      </div>
    );
  }

  if (estado === "aprobado") {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.contenido}>
            <div className={styles.exito}>✓</div>
            <h4 className="text-success">Pago aprobado</h4>
            <p>Tu compra se ha realizado correctamente</p>
          </div>
        </div>
      </div>
    );
  }

  if (estado === "rechazado") {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.contenido}>
            <div className={styles.error}>✗</div>
            <h4 className="text-danger">Pago rechazado</h4>
            <p>No se pudo procesar el pago. Intente con otro método.</p>
            <button className="btn btn-danger mt-3" onClick={() => setEstado("form")}>
              Intentar de nuevo
            </button>
            <button className="btn btn-secondary mt-3 ms-2" onClick={onCancelar}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h5>Pasarela de Pago</h5>
          <button className={styles.cerrar} onClick={onCancelar}>×</button>
        </div>

        <div className={styles.contenido}>
          <div className={styles.resumen}>
            <p className="fw-bold">{metodoPago}</p>
            <h3 className="text-danger">S/. {monto.toFixed(2)}</h3>
          </div>

          {esTarjeta && (
            <div className={styles.formulario}>
              <div className="mb-3">
                <label className="form-label">Número de tarjeta</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="0000 0000 0000 0000"
                  maxLength="19"
                  value={numeroTarjeta}
                  onChange={(e) => setNumeroTarjeta(formatNumeroTarjeta(e.target.value))}
                />
              </div>
              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label">Vencimiento</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="MM/AA"
                    maxLength="5"
                    value={vencimiento}
                    onChange={(e) => setVencimiento(e.target.value)}
                  />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label">CVV</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="123"
                    maxLength="4"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {esYapePlin && (
            <div className={styles.formulario}>
              <div className="text-center mb-3">
                <div className={styles.qrSimulado}>
                  <p className="mb-0">📱</p>
                  <small>Escanear código</small>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Número de celular</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="999 999 999"
                  maxLength="11"
                  value={celular}
                  onChange={(e) => setCelular(e.target.value)}
                />
              </div>
            </div>
          )}

          <button
            className="btn btn-danger w-100 fw-bold mt-3"
            onClick={handlePagar}
          >
            Pagar S/. {monto.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PasarelaPago;
