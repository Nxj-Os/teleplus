import banner from "../../assets/img/banner1-evento5.jpg";
import logoEvento from "../../assets/img/logo-evento5.png";
import mapa from "../../assets/img/mapa-evento5.png";
import styles from "../../css/evento5.module.css";
import LayoutPrincipal from "../../layouts/LayoutPrincipal";

export default function Evento5() {
  return (
    <LayoutPrincipal>
      <div className="bg-black text-white min-vh-100">
        {/* SECCIÓN PRINCIPAL (HERO) */}
        <section
          className={styles["seccion-principal"]}
          style={{ height: "100%" }}
        >
          <img
            src={banner}
            className={`${styles["hero-image"]} img-fluid w-100`}
            alt="Cenicienta El Musical Banner"
          />
        </section>

        <div className="container text-center py-5">
          {/* MAPA DEL ESCENARIO */}
          <div className={`${styles["mapa"]} mb-5`}>
            <img
              src={mapa}
              className={`${styles["imagen-mapa"]} img-fluid`}
              alt="Mapa del escenario Teatro Manuel Segura"
              style={{ maxWidth: "800px" }}
            />
          </div>

          {/* TABLA DE PRECIOS */}
          <div className={`${styles["tabla-zona"]} p-3 rounded shadow`}>
            <div className="row align-items-end text-center small fw-bold mb-2">
              <div className="col-3 text-start ps-4">SECTORES</div>
              <div className="col-3 py-2 bg-celeste rounded-top text-dark">
                PREVENTA
                <br />
                NUEVAS FUNCIONES
              </div>
              <div className="col-3 text-warning">
                REGULAR
                <br />
                <span
                  className="text-white fw-light"
                  style={{ fontSize: "0.7rem" }}
                >
                  TODOS LOS MEDIOS
                </span>
              </div>
              <div className="col-3 text-warning">
                CONADIS
                <br />
                <span
                  className="text-white fw-light"
                  style={{ fontSize: "0.7rem" }}
                >
                  TODOS LOS MEDIOS
                </span>
              </div>
            </div>

            {/* FILAS DE ZONAS */}
            {[
              {
                zona: "ZONA DIAMANTE",
                dot: "bg-danger",
                preventa: "S/ 119.00",
                regular: "S/ 150.00",
                conadis: "S/ 120.00",
              },
              {
                zona: "PALCOS REALES",
                dot: "bg-success",
                preventa: "S/ 99.00",
                regular: "S/ 125.00",
                conadis: "----",
              },
              {
                zona: "GALERÍA ENCANTADA",
                dot: "bg-info",
                preventa: "S/ 75.00",
                regular: "S/ 90.00",
                conadis: "----",
              },
              {
                zona: "VISTA DEL REINO",
                dot: "bg-primary",
                preventa: "S/ 45.00",
                regular: "S/ 60.00",
                conadis: "----",
              },
            ].map((item, index) => (
              <div
                key={index}
                className={`row align-items-center text-center ${styles["border-custom"]} py-2`}
              >
                <div className="col-3 text-start fw-bold">
                  <span className={`${styles["dot"]} ${item.dot}`}></span>{" "}
                  {item.zona}
                </div>
                <div
                  className={`col-3 ${styles["bg-celeste"]} py-2 h6 m-0 fw-bold text-dark`}
                >
                  {item.preventa}
                </div>
                <div className="col-3 h6 m-0 fw-bold">{item.regular}</div>
                <div className="col-3 h6 m-0 fw-bold">{item.conadis}</div>
              </div>
            ))}
          </div>

          {/* NOTA DE DESCARGA */}
          <div
            className="border border-warning rounded-3 p-2 mt-4 text-warning small mx-auto"
            style={{ maxWidth: "700px" }}
          >
            La descarga de los E-tickets estará disponible desde 2 días antes de
            la fecha de tu evento o función.
          </div>
        </div>

        {/* BOTONES DE COMPRA */}
        <section
          className="container text-center mb-5"
          style={{ maxWidth: "500px", background: "none", color: "#fff" }}
        >
          <h3 className="mb-4">Compra tus entradas aquí</h3>

          <a
            href="/compra?evento=Cenicienta&precio=119"
            className={`btn btn-info w-100 mb-3 fw-bold ${styles["bg-celeste"]} border-0 py-2`}
          >
            COMPRAR PREVENTA (S/ 119)
          </a>

          <a
            href="/compra?evento=Cenicienta&precio=150"
            className="btn btn-outline-warning w-100 mb-3 fw-bold py-2"
          >
            PRECIO REGULAR (S/ 150)
          </a>

          <small className="text-secondary d-block">
            ¿Cómo comprar en la web?
          </small>
        </section>

        {/* DESCRIPCIÓN DEL EVENTO */}
        <section className="descripcion bg-dark py-5 text-center px-4">
          <p
            className="h1 text-white fw-bold mb-4"
            style={{ fontFamily: "serif" }}
          >
            ¡Llega por primera vez al Perú!
          </p>

          <div
            className="container mx-auto"
            style={{ maxWidth: "800px", fontWeight: "300", lineHeight: "1.6" }}
          >
            <p className="mb-3">
              Por únicas funciones desde mayo, el histórico Teatro Manuel Segura
              se transforma en el escenario de una de las historias más queridas
              de todos los tiempos.
            </p>
            <p className="mb-3">
              Directamente de Broadway, Cenicienta El Musical llega al Perú con
              una producción de gran formato, un elenco de lujo y un equipo
              creativo de nivel internacional.
            </p>
            <p className="mb-3 fw-bold">
              Esta no es solo una obra de teatro: es un evento teatral de talla
              mundial.
            </p>
            <div className="mt-4">
              <p className="fw-bold mb-1">Vive la magia.</p>
              <p className="fw-bold mb-1">Siente la emoción.</p>
              <p className="fw-bold">Sé parte del cuento.</p>
            </div>
          </div>
        </section>

        {/* FOOTER DEL EVENTO */}
        <footer className="pie bg-black text-center py-4">
          <img
            src={logoEvento}
            alt="Cenicienta Logo"
            className="img-fluid mx-auto d-block"
            style={{ maxHeight: "100px" }}
          />
        </footer>
      </div>
    </LayoutPrincipal>
  );
}
