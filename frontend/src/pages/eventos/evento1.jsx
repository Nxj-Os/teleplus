import styles from "../../css/evento1.module.css";

import bannerEvento from "../../assets/img/banner-evento1.jpg";
import logoEvento from "../../assets/img/logo-evento1.png";
import mapaEvento from "../../assets/img/mapa_evento1.png";

import LayoutPrincipal from "../../layouts/LayoutPrincipal";

import { useComprarEntrada } from "../../hooks/useComprarEntrada";

function Evento1() {
  const { comprarEntrada } = useComprarEntrada();

  const evento = "Megadeth en Lima";
  const fecha = "25 Mayo 2026";
  const lugar = "Estadio Nacional";

  return (
    <LayoutPrincipal>
      {/* HERO */}
      <section
        className={styles["seccion-principal"]}
        style={{ height: "100%" }}
      >
        <img
          src={bannerEvento}
          alt="Banner Evento"
          className={`img-fluid ${styles["hero-image"]} ${styles["img-centrada"]}`}
          style={{ height: "100%" }}
        />
      </section>

      {/* MAPA + PRECIOS */}
      <div className={styles["campo-escenario"]}>
        <div className="container">
          <div className="row">
            {/* MAPA */}
            <div className={`col-lg-6 col-12 ${styles["escenario"]}`}>
              <div className={styles["mapa"]}>
                <img
                  className={`${styles["imagen-mapa"]} ${styles["img-centrada"]} img-fluid`}
                  src={mapaEvento}
                  alt="Mapa"
                />
              </div>
            </div>

            {/* PRECIOS */}
            <div className={`${styles["caja-boletos"]} col-lg-6 col-12`}>
              <div className={styles["tabla-precios"]}>
                {/* CAMPO A */}
                <div
                  className={`${styles["fila-precios"]} rounded shadow-sm bg-dark p-3 overflow-auto mb-3`}
                >
                  <div className="d-flex align-items-center justify-content-center flex-nowrap gap-2">
                    <div
                      className={`bg-white text-dark ${styles["etiqueta-fila"]} flex-shrink-0`}
                    >
                      CAMPO A
                    </div>

                    {/* PREVENTA FANS */}
                    <div className={`${styles["celda-precio"]} flex-shrink-0`}>
                      <div className={styles["etiqueta"]}>PREVENTA FANS</div>

                      <div className={styles["precio"]}>S/. 330.00</div>
                    </div>

                    {/* INTERBANK */}
                    <div
                      className={`${styles["celda-precio"]} ${styles["destacado"]} flex-shrink-0`}
                    >
                      <div className={styles["etiqueta"]}>
                        PREVENTA INTERBANK
                      </div>

                      <div className={styles["precio"]}>S/. 280.00</div>
                    </div>

                    {/* FULL */}
                    <div className={`${styles["celda-precio"]} flex-shrink-0`}>
                      <div className={styles["etiqueta"]}>PRECIO FULL</div>

                      <div className={styles["precio"]}>S/. 400.00</div>
                    </div>

                    {/* CONADIS */}
                    <div className={`${styles["celda-precio"]} flex-shrink-0`}>
                      <div className={styles["etiqueta"]}>CONADIS</div>

                      <div className={styles["precio"]}>S/. 153.00</div>
                    </div>
                  </div>
                </div>

                {/* CAMPO B */}
                <div
                  className={`${styles["fila-precios"]} rounded shadow-sm bg-dark p-3 overflow-auto`}
                >
                  <div className="d-flex align-items-center justify-content-center flex-nowrap gap-2">
                    <div
                      className={`bg-warning text-dark ${styles["etiqueta-fila"]} flex-shrink-0`}
                    >
                      CAMPO B
                    </div>

                    <div className={`${styles["celda-precio"]} flex-shrink-0`}>
                      <div className={styles["etiqueta"]}>PREVENTA FANS</div>

                      <div className={styles["precio"]}>S/. 153.00</div>
                    </div>

                    <div
                      className={`${styles["celda-precio"]} ${styles["destacado"]} flex-shrink-0`}
                    >
                      <div className={styles["etiqueta"]}>
                        PREVENTA INTERBANK
                      </div>

                      <div className={styles["precio"]}>S/. 123.00</div>
                    </div>

                    <div className={`${styles["celda-precio"]} flex-shrink-0`}>
                      <div className={styles["etiqueta"]}>PRECIO FULL</div>

                      <div className={styles["precio"]}>S/. 210.00</div>
                    </div>

                    <div className={`${styles["celda-precio"]} flex-shrink-0`}>
                      <div className={styles["etiqueta"]}>CONADIS</div>

                      <div className={styles["precio"]}>S/. 99.00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTONES */}
      <section className={`${styles["botones-seccion"]} py-5`}>
        <div className="container text-center">
          <h3 className="mb-5 text-dark fw-bold">
            Obtén tus tickets para ver a MEGADETH
          </h3>

          <div className="row g-3">
            {/* BOTÓN 1 */}
            <div className="col-md-6">
              <button
                className="btn btn-dark w-100 py-3 fw-bold"
                onClick={() =>
                  comprarEntrada({
                    evento,
                    fecha,
                    lugar,
                    zona: "CAMPO A",
                    tipo: "PREVENTA FANS",
                    precio: 330,
                    imagen: bannerEvento,
                  })
                }
              >
                PREVENTA FANS
              </button>
            </div>

            {/* BOTÓN 2 */}
            <div className="col-md-6">
              <button
                className="btn btn-danger w-100 py-3 fw-bold"
                onClick={() =>
                  comprarEntrada({
                    evento,
                    fecha,
                    lugar,
                    zona: "CAMPO A",
                    tipo: "PREVENTA INTERBANK",
                    precio: 280,
                    imagen: bannerEvento,
                  })
                }
              >
                PREVENTA INTERBANK
              </button>
            </div>

            {/* BOTÓN 3 */}
            <div className="col-md-6">
              <button
                className="btn btn-secondary w-100 py-3 fw-bold"
                onClick={() =>
                  comprarEntrada({
                    evento,
                    fecha,
                    lugar,
                    zona: "CAMPO A",
                    tipo: "PRECIO FULL",
                    precio: 400,
                    imagen: bannerEvento,
                  })
                }
              >
                PRECIO FULL
              </button>
            </div>

            {/* BOTÓN 4 */}
            <div className="col-md-6">
              <button
                className="btn btn-warning w-100 py-3 fw-bold"
                onClick={() =>
                  comprarEntrada({
                    evento,
                    fecha,
                    lugar,
                    zona: "CAMPO A",
                    tipo: "CONADIS",
                    precio: 153,
                    imagen: bannerEvento,
                  })
                }
              >
                CONADIS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* DESCRIPCIÓN */}
      <section className={`${styles["descripcion"]} bg-dark py-5 text-center`}>
        <img
          src={logoEvento}
          alt="Megadeth"
          className={`mb-3 img-fluid ${styles["img-centrada"]}`}
        />

        <p className="text-center mx-auto w-75">
          Los íconos del thrash metal,
          <strong> Megadeth </strong>
          llegan a Perú.
        </p>
      </section>
    </LayoutPrincipal>
  );
}

export default Evento1;
