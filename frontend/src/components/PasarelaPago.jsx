import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import styles from "../css/pasarelaPago.module.css";
import { procesarPago } from "../services/pagoService";

function PasarelaPago({ metodoPago, monto, onExito, onCancelar }) {
  const [estado, setEstado] = useState("form");
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const [cvv, setCvv] = useState("");
  const [celular, setCelular] = useState("");
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");

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

  const formatVencimiento = (value) => {
    const v = value.replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const validarCampo = (campo, valor) => {
    const nuevosErrores = { ...errores };
    delete nuevosErrores[campo];

    if (campo === "numeroTarjeta") {
      const limpio = valor.replace(/\s/g, "");
      if (limpio.length > 0 && limpio.length < 13) {
        nuevosErrores[campo] = "Minimo 13 digitos";
      } else if (limpio.length >= 13 && !validarLuhn(limpio)) {
        nuevosErrores[campo] = "Numero de tarjeta invalido";
      }
    }

    if (campo === "vencimiento") {
      if (valor.length === 5) {
        const [mes, anio] = valor.split("/");
        const mesNum = parseInt(mes);
        const anioNum = parseInt("20" + anio);
        if (mesNum < 1 || mesNum > 12) {
          nuevosErrores[campo] = "Mes invalido";
        } else {
          const ahora = new Date();
          const fechaVenc = new Date(anioNum, mesNum);
          if (fechaVenc <= ahora) {
            nuevosErrores[campo] = "Tarjeta vencida";
          }
        }
      }
    }

    if (campo === "cvv") {
      if (valor.length > 0 && (valor.length < 3 || valor.length > 4)) {
        nuevosErrores[campo] = "CVV invalido";
      }
    }

    if (campo === "celular") {
      const limpio = valor.replace(/\s/g, "");
      if (limpio.length > 0 && !/^9\d{8}$/.test(limpio)) {
        nuevosErrores[campo] = "Debe ser 9 digitos y empezar con 9";
      }
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const validarLuhn = (numero) => {
    let suma = 0;
    let alternar = false;
    for (let i = numero.length - 1; i >= 0; i--) {
      let digito = parseInt(numero[i]);
      if (alternar) {
        digito *= 2;
        if (digito > 9) digito -= 9;
      }
      suma += digito;
      alternar = !alternar;
    }
    return suma % 10 === 0;
  };

  const esTarjeta = metodoPago === "Tarjeta de credito" || metodoPago === "Tarjeta de debito";
  const esYapePlin = metodoPago === "Yape / Plin";

  const camposValidos = () => {
    if (esTarjeta) {
      const numLimpio = numeroTarjeta.replace(/\s/g, "");
      return (
        numLimpio.length >= 13 &&
        vencimiento.length === 5 &&
        cvv.length >= 3 &&
        Object.keys(errores).length === 0
      );
    }
    if (esYapePlin) {
      const celLimpio = celular.replace(/\s/g, "");
      return celLimpio.length === 9 && Object.keys(errores).length === 0;
    }
    return false;
  };

  const handlePagar = async () => {
    setErrorGeneral("");
    setEstado("procesando");

    try {
      const payload = {
        metodoPago,
        monto,
        numeroTarjeta: esTarjeta ? numeroTarjeta.replace(/\s/g, "") : null,
        vencimiento: esTarjeta ? vencimiento : null,
        cvv: esTarjeta ? cvv : null,
        celular: esYapePlin ? celular.replace(/\s/g, "") : null,
      };

      const response = await procesarPago(payload);

      if (response.aprobado) {
        setEstado("aprobado");
        setTimeout(() => onExito(response.codigoTransaccion), 1500);
      } else {
        setEstado("rechazado");
        setErrorGeneral(response.mensaje || "Pago rechazado");
      }
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || "Error al procesar el pago. Intente con otro metodo.";
      setEstado("rechazado");
      setErrorGeneral(mensaje);
    }
  };

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
            <div className={styles.exito}>&#10003;</div>
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
            <div className={styles.error}>&#10007;</div>
            <h4 className="text-danger">Pago rechazado</h4>
            <p className="text-danger fw-bold">{errorGeneral}</p>
            <button className="btn btn-danger mt-3" onClick={() => { setEstado("form"); setErrores({}); setErrorGeneral(""); }}>
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
          <button className={styles.cerrar} onClick={onCancelar}>&times;</button>
        </div>

        <div className={styles.contenido}>
          <div className={styles.resumen}>
            <p className="fw-bold">{metodoPago}</p>
            <h3 className="text-danger">S/. {monto.toFixed(2)}</h3>
          </div>

          {errorGeneral && (
            <div className="alert alert-danger py-2 text-center fw-bold">{errorGeneral}</div>
          )}

          {esTarjeta && (
            <div className={styles.formulario}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Numero de tarjeta</label>
                <input
                  type="text"
                  className={`form-control ${errores.numeroTarjeta ? "is-invalid" : ""}`}
                  placeholder="0000 0000 0000 0000"
                  maxLength="19"
                  value={numeroTarjeta}
                  onChange={(e) => {
                    const val = formatNumeroTarjeta(e.target.value);
                    setNumeroTarjeta(val);
                    validarCampo("numeroTarjeta", val);
                  }}
                />
                {errores.numeroTarjeta && <div className="invalid-feedback">{errores.numeroTarjeta}</div>}
              </div>
              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label fw-semibold">Vencimiento</label>
                  <input
                    type="text"
                    className={`form-control ${errores.vencimiento ? "is-invalid" : ""}`}
                    placeholder="MM/AA"
                    maxLength="5"
                    value={vencimiento}
                    onChange={(e) => {
                      const val = formatVencimiento(e.target.value);
                      setVencimiento(val);
                      validarCampo("vencimiento", val);
                    }}
                  />
                  {errores.vencimiento && <div className="invalid-feedback">{errores.vencimiento}</div>}
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label fw-semibold">CVV</label>
                  <input
                    type="password"
                    className={`form-control ${errores.cvv ? "is-invalid" : ""}`}
                    placeholder="123"
                    maxLength="4"
                    value={cvv}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "");
                      setCvv(val);
                      validarCampo("cvv", val);
                    }}
                  />
                  {errores.cvv && <div className="invalid-feedback">{errores.cvv}</div>}
                </div>
              </div>
            </div>
          )}

          {esYapePlin && (
            <div className={styles.formulario}>
              <div className="text-center mb-3">
                <div className={styles.qrSimulado}>
                  <QRCodeSVG
                    value={`yape://pay?amount=${monto}&phone=999999999`}
                    size={100}
                    bgColor="#ffffff"
                    fgColor="#1a1a2e"
                    includeMargin={false}
                  />
                  <small className="mt-2">Escanear codigo</small>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Numero de celular</label>
                <input
                  type="text"
                  className={`form-control ${errores.celular ? "is-invalid" : ""}`}
                  placeholder="999 999 999"
                  maxLength="9"
                  value={celular}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setCelular(val);
                    validarCampo("celular", val);
                  }}
                />
                {errores.celular && <div className="invalid-feedback">{errores.celular}</div>}
              </div>
            </div>
          )}

          <button
            className="btn btn-danger w-100 fw-bold mt-3"
            onClick={handlePagar}
            disabled={!camposValidos()}
          >
            Pagar S/. {monto.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PasarelaPago;
