import banner from "../../assets/img/banner-evento6.jpeg";
import logoEvento from "../../assets/img/logo-evento6.jpeg";
import mapa from "../../assets/img/mapa_evento6.jpeg";
import styles from "../../css/evento6.module.css";
import { useComprarEntrada } from "../../hooks/useComprarEntrada";
import LayoutPrincipal from "../../layouts/LayoutPrincipal";

export default function Evento6() {
  const { comprarEntrada } = useComprarEntrada();

  const evento = "Sebastian Yatra en Lima";
  const fecha = "10 Octubre 2026";
  const lugar = "Arena Perú";

  return (
    <LayoutPrincipal>
      <div className={styles["page"]}>
        <section
          className={styles["seccion-principal"]}
          style={{ height: "100%" }}
        >
          <img
            src={banner}
            className={`img-fluid hero-img`}
            style={{ width: "100%" }}
            alt="Sebastian Yatra Banner"
          />
        </section>

        <div className={`${styles["campo-escenario"]} py-5`}>
          <div className="container">
            <div className="row">
              <div className="col-lg-6 text-center mb-4">
                <img
                  src={mapa}
                  className={`img-fluid ${styles["mapa"]}`}
                  alt=""
                />
              </div>

              <div className="col-lg-6">
                <div className={`${styles["zona"]} ${styles["vip"]}`}>
                  <h5>PRIMERAS FILAS</h5>
                  <p>Preventa: S/. 617.50</p>
                  <p>Regular: S/. 747.50</p>
                  <button
                    className="btn btn-danger w-100"
                    onClick={() =>
                      comprarEntrada({
                        evento,
                        fecha,
                        lugar,
                        zona: "PRIMERAS FILAS",
                        tipo: "REGULAR",
                        precio: 747.5,
                        imagen: banner,
                      })
                    }
                  >
                    Comprar
                  </button>
                </div>

                <div className={styles["zona"]}>
                  <h5>DIAMANTE</h5>
                  <p>Preventa: S/. 522.50</p>
                  <p>Regular: S/. 632.50</p>
                  <button
                    className="btn btn-primary w-100"
                    onClick={() =>
                      comprarEntrada({
                        evento,
                        fecha,
                        lugar,
                        zona: "DIAMANTE",
                        tipo: "REGULAR",
                        precio: 632.5,
                        imagen: banner,
                      })
                    }
                  >
                    Comprar
                  </button>
                </div>

                <div className={styles["zona"]}>
                  <h5>PLATINUM</h5>
                  <p>Preventa: S/. 380.00</p>
                  <p>Regular: S/. 460.00</p>
                  <button
                    className="btn btn-primary w-100"
                    onClick={() =>
                      comprarEntrada({
                        evento,
                        fecha,
                        lugar,
                        zona: "PLATINUM",
                        tipo: "REGULAR",
                        precio: 460.0,
                        imagen: banner,
                      })
                    }
                  >
                    Comprar
                  </button>
                </div>

                <div className={styles["zona"]}>
                  <h5>GOLDEN</h5>
                  <p>Preventa: S/. 285.00</p>
                  <p>Regular: S/. 345.00</p>
                  <button
                    className="btn btn-primary w-100"
                    onClick={() =>
                      comprarEntrada({
                        evento,
                        fecha,
                        lugar,
                        zona: "GOLDEN",
                        tipo: "REGULAR",
                        precio: 345.0,
                        imagen: banner,
                      })
                    }
                  >
                    Comprar
                  </button>
                </div>

                <div className={styles["zona"]}>
                  <h5>SILVER</h5>
                  <p>Preventa: S/. 237.50</p>
                  <p>Regular: S/. 287.50</p>
                  <button
                    className="btn btn-secondary w-100"
                    onClick={() =>
                      comprarEntrada({
                        evento,
                        fecha,
                        lugar,
                        zona: "SILVER",
                        tipo: "REGULAR",
                        precio: 287.5,
                        imagen: banner,
                      })
                    }
                  >
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section
          className={`${styles["descripcion"]} bg-dark py-5 text-center`}
        >
          <img
            src={logoEvento}
            className="mb-3 img-fluid"
            alt="Sebastian Yatra Logo"
          />

          <p className="text-center mx-auto w-75">
            Sebastián Yatra llega a Lima con su gira internacional. Vive una
            noche única con sus mejores éxitos como
            <strong>“Tacones Rojos”</strong> y <strong>“Cristina”</strong>.
          </p>
        </section>
      </div>
    </LayoutPrincipal>
  );
}
