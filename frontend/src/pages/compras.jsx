import styles from "../css/compras.module.css";
import LayoutPrincipal from "../layouts/LayoutPrincipal";

import { useState } from "react";

import { Link } from "react-router-dom";

import { validarPromocion } from "../services/promocionService";

import { useLocation } from "react-router-dom";

function Compras() {
  const location = useLocation();

  const datosCompra = location.state;

  const precioUnitario = datosCompra?.precio || 0;

  // STATES
  const [cantidad, setCantidad] = useState(1);

  const [codigoPromo, setCodigoPromo] = useState("");

  const [mensajePromo, setMensajePromo] = useState("");

  const [promoValida, setPromoValida] = useState(null);

  const [descuento, setDescuento] = useState(0);

  const [aceptaPoliticas, setAceptaPoliticas] = useState(false);

  // TOTAL
  const subtotal = precioUnitario * cantidad;

  const totalFinal = subtotal - (subtotal * descuento) / 100;

  // VALIDAR PROMO
  const aplicarPromocion = async () => {
    try {
      const data = await validarPromocion(codigoPromo);

      setMensajePromo(data.mensaje);

      setPromoValida(data.valido);

      if (data.valido) {
        setDescuento(data.descuento);
      } else {
        setDescuento(0);
      }
    } catch {
      setMensajePromo("Error del servidor");

      setPromoValida(false);
    }
  };

  return (
    <LayoutPrincipal>
      <div className={styles.page}>
        {/* HERO */}
        <section
          className={`d-flex align-items-center justify-content-center ${styles["seccion-principal"]}`}
        >
          <h1 className="text-white fw-bold">Compra tus entradas</h1>
        </section>

        {/* CONTENIDO */}
        <section
          className="container my-5"
          style={{ backgroundColor: "white" }}
        >
          <div className="row g-4">
            {/* RESUMEN */}
            <div className="col-md-6">
              <div className="card bg-dark text-white p-4 h-100">
                <h3 className="text-white">{datosCompra?.evento}</h3>

                <hr />

                <p className="text-white">{datosCompra?.fecha}</p>

                <p className="text-white">{datosCompra?.lugar}</p>

                <p className="text-white">{datosCompra?.zona}</p>

                <p className="text-white">{datosCompra?.tipo}</p>

                <h4 className="mt-3">Precio unitario</h4>

                <h2 className="text-danger">S/ {precioUnitario.toFixed(2)}</h2>
              </div>
            </div>

            {/* FORMULARIO */}
            <div className="col-md-6">
              <div className="card p-4 shadow h-100">
                <h4 className="mb-3">Selecciona tus entradas</h4>

                {/* CANTIDAD */}
                <label className="form-label">Cantidad de boletos</label>

                <input
                  type="number"
                  className="form-control mb-3"
                  value={cantidad}
                  min="1"
                  onChange={(e) => setCantidad(Number(e.target.value))}
                />

                {/* PAGO */}
                <label className="form-label">Método de pago</label>

                <select className="form-select mb-3">
                  <option>Tarjeta de crédito</option>

                  <option>Tarjeta de débito</option>

                  <option>Yape / Plin</option>
                </select>

                {/* PROMOCIÓN */}
                <label className="form-label fw-bold">Código promocional</label>

                <div className="d-flex gap-2 mb-2">
                  <input
                    type="text"
                    className={`form-control ${
                      promoValida === true
                        ? "border-success"
                        : promoValida === false
                          ? "border-danger"
                          : ""
                    }`}
                    placeholder="Ej: INTERBANK2026"
                    value={codigoPromo}
                    onChange={(e) => setCodigoPromo(e.target.value)}
                  />

                  <button className="btn btn-danger" onClick={aplicarPromocion}>
                    Aplicar
                  </button>
                </div>

                {/* MENSAJE */}
                {mensajePromo && (
                  <div
                    className={`fw-bold mb-3 ${
                      promoValida ? "text-success" : "text-danger"
                    }`}
                  >
                    {mensajePromo}
                  </div>
                )}

                {/* POLÍTICAS */}
               <div className="form-check mt-4 mb-3">

              <input
              className="form-check-input"

              type="checkbox"

              checked={aceptaPoliticas}

               onChange={(e) =>
                setAceptaPoliticas(e.target.checked)
               }

                id="aceptaPoliticas"
               />

              <label
              className="form-check-label"
              htmlFor="aceptaPoliticas"
              >

              He leído y acepto los{" "}

             <Link
             to="/politica-compra"
             target="_blank"
              className="text-danger fw-bold"
            >
            Términos de Compra
            </Link>

            {" "}y{" "}

            <Link
            to="/terminos-uso"
            target="_blank"
           className="text-danger fw-bold"
          > 
          Términos de Uso
          </Link>

        </label>

      </div>

                <hr />

                {/* TOTAL */}
                <h5>Total estimado</h5>

                {/* DESCUENTO */}
                {descuento > 0 && (
                  <p className="text-success fw-bold">
                    Descuento aplicado: {descuento}%
                  </p>
                )}

                <h3 className="text-danger">S/ {totalFinal.toFixed(2)}</h3>

                {/* BOTÓN */}
                <button className="btn btn-danger w-100 mt-3 fw-bold"
                
                disabled={!aceptaPoliticas}
                onClick={() => {

                if (!aceptaPoliticas) {

                 alert(
                "Debes aceptar las políticas"
                 );

                 return;
                 }

                 alert("Compra realizada");
 
                 }}
                >
                  Confirmar compra
                </button>
              </div>  
            </div>
          </div>
        </section>

        {/* INFO */}
        <section
          className="container text-center mb-5"
          style={{ backgroundColor: "white" }}
        >
          <small>Los boletos serán enviados a tu correo electrónico.</small>
        </section>
      </div>
    </LayoutPrincipal>
  );
}

export default Compras;
