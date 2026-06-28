import Eventos from "../../assets/img/evento4.png";
import EventosF from "../../assets/img/map4.png";
import styles from "../../css/evento4.module.css";
import { useComprarEntrada } from "../../hooks/useComprarEntrada";
import LayoutPrincipal from "../../layouts/LayoutPrincipal";

function Evento4() {
  const { comprarEntrada } = useComprarEntrada();
  const evento = "Voces del Rock Latino Moyobamba";
  const fecha = "15 Agosto 2026";
  const lugar = "Estadio Municipal Moyobamba";

  return (
    <LayoutPrincipal>
      {/* Sección Hero */}
      <section
        className={styles["seccion-principal"]}
        style={{ height: "100%" }}
      >
        <img
          src={Eventos}
          alt="Banner Evento"
          className="hero-image img-fluid w-100"
        />
      </section>

      {/* Mapa y Tabla de Precios */}
      <div className={styles["campo-escenario"]}>
        <div
          className={`${styles["contenedor-escenario"]} ${styles["contenedor-vertical"]}`}
        >
          <div className="escenario mb-4">
            <div className="mapa">
              <img
                className={`${styles["imagen-mapa"]} img-fluid`}
                src={EventosF}
                alt="Mapa del escenario"
              />
            </div>
          </div>

          <div className={`${styles["caja-boletos"]} pb-4`}>
            <div className={styles["tabla-precios"]}>
              {/* PLATINUM */}
              <div
                className={`${styles["fila-precios"]} d-flex align-items-center border-bottom py-2`}
              >
                <div
                  className={`bg-success text-white p-2 ${styles["etiqueta-fila"]}`}
                  style={{ minWidth: "100px" }}
                >
                  PLATINUM
                </div>
                <div className={`${styles["celda-precio"]} px-3 text-center`}>
                  <div className="small fw-bold">PREVENTA FANS</div>
                  <div className={styles["precio"]}>S/. 230.00</div>
                </div>
                <div
                  className={`${styles["celda-precio"]} ${styles["destacado"]} px-3 text-center bg-light`}
                >
                  <div className="small fw-bold">PREVENTA INTERBANK</div>
                  <div className={styles["precio"]}>S/. 210.00</div>
                </div>
              </div>

              {/* VIP */}
              <div
                className={`${styles["fila-precios"]} d-flex align-items-center border-bottom py-2`}
              >
                <div
                  className={`bg-secondary text-white p-2 ${styles["etiqueta-fila"]}`}
                  style={{ minWidth: "100px" }}
                >
                  VIP
                </div>
                <div className={`${styles["celda-precio"]} px-3 text-center`}>
                  <div className="small fw-bold">PREVENTA FANS</div>
                  <div className={styles["precio"]}>S/. 200.00</div>
                </div>
                <div
                  className={`${styles["celda-precio"]} ${styles["destacado"]} px-3 text-center bg-light`}
                >
                  <div className="small fw-bold">PREVENTA INTERBANK</div>
                  <div className={styles["precio"]}>S/. 180.00</div>
                </div>
              </div>

              {/* GENERAL */}
              <div
                className={`${styles["fila-precios"]} d-flex align-items-center py-2`}
              >
                <div
                  className={`bg-primary text-white p-2 ${styles["etiqueta-fila"]}`}
                  style={{ minWidth: "100px" }}
                >
                  GENERAL
                </div>
                <div className={`${styles["celda-precio"]} px-3 text-center`}>
                  <div className="small fw-bold">PREVENTA FANS</div>
                  <div className={styles["precio"]}>S/. 150.00</div>
                </div>
                <div
                  className={`${styles["celda-precio"]} ${styles["destacado"]} px-3 text-center bg-light`}
                >
                  <div className="small fw-bold">PREVENTA INTERBANK</div>
                  <div className={styles["precio"]}>S/. 130.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <section className={`${styles["botones-seccion"]} text-center py-4`}>
        <h3 className="mb-4">
          Obtén tus tickets para ver VOCES DEL ROCK LATINO MOYOBAMBA
        </h3>

        <div className="d-grid gap-3 col-lg-6 mx-auto container">
          <button
            className="btn btn-dark w-100 py-3 fw-bold"
            onClick={() =>
              comprarEntrada({
                evento,
                fecha,
                lugar,
                tipo: "PREVENTA FANS",
                precio: 230.0,
                zona: "PLATINUM",
              })
            }
          >
            PREVENTA FANS
          </button>

          <button
            className="btn btn-dark w-100 py-3 fw-bold"
            onClick={() =>
              comprarEntrada({
                evento,
                fecha,
                lugar,
                tipo: "PREVENTA INTERBANK",
                precio: 210.0,
                zona: "GOLD",
              })
            }
          >
            PREVENTA INTERBANK
          </button>

          <button
            className="btn btn-danger fw-bold py-2"
            onClick={() =>
              comprarEntrada({
                evento,
                fecha,
                lugar,
                tipo: "PRECIO FULL",
                precio: 250.0,
                zona: "SILVER",
              })
            }
          >
            PRECIO FULL
          </button>
          <button
            className="btn btn-dark fw-bold py-2"
            onClick={() =>
              comprarEntrada({
                evento,
                fecha,
                lugar,
                tipo: "CONADIS",
                precio: 120,
                zona: "CONADIS",
              })
            }
          >
            CONADIS
          </button>
        </div>

        <div className="mt-3">
          <small
            className="text-muted text-decoration-underline"
            style={{ cursor: "pointer" }}
          >
            ¿Cómo comprar en la web?
          </small>
        </div>
      </section>

      {/* Descripción */}
      <section className="descripcion bg-dark py-5 text-center text-white">
        <div className="container">
          <p className="h4 text-uppercase mb-3">
            <strong>Prepárate Moyobamba</strong>
          </p>
          <p className="lead">
            Para una noche que marcará generaciones. Un concierto donde la
            nostalgia, la rebeldía y el amor por el rock en español se unen en
            un mismo escenario.
          </p>
          <p>
            Revive la energía de <strong>Fer Sosa - GUSTAVO CERATI</strong>,
            canta a todo pulmón los clásicos de <strong>ENANITOS VERDES</strong>{" "}
            con Gael García, siente la fuerza de{" "}
            <strong>LOS PRISIONEROS</strong> con Chris Victorio.
          </p>
        </div>
      </section>
    </LayoutPrincipal>
  );
}

export default Evento4;
