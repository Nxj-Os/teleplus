import { useEffect, useState } from "react";
import imagenNosotros from "../assets/img/informacion-fundadores.jpg";
import styles from "../css/informacion.module.css";
import LayoutPrincipal from "../layouts/LayoutPrincipal";

const tabs = [
  {
    titulo: "Somos Ticket +",
    contenido:
      " Una empresa apasionada por conectar personas con eventos, artistas y experiencias memorables. Cada día trabajamos paraque disfrutes tus momentos de forma fácil y segura.",
  },

  {
    titulo: "Valores",
    contenido:
      "La confianza, innovación y cercanía son la base de todo lo que hacemos.",
  },

  {
    titulo: "Plataformas",
    contenido: "Ofrecemos ticketing, streaming y marketplace para eventos.",
  },

  {
    titulo: "Impacto",
    contenido: "Ayudamos a artistas y organizadores a crecer junto a sus fans.",
  },
];

function Informacion() {
  const [tabActiva, setTabActiva] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTabActiva((prev) => (prev === tabs.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <LayoutPrincipal>
      <div className={`${styles.page} d-flex flex-column min-vh-100`}>
        <section className={`${styles.heroNosotros} text-center`}>
          <div className="container">
            <h1>Nosotros</h1>

            <p className="lead mt-3">
              Conoce más sobre Ticket +, nuestra historia, valores y el impacto
              que buscamos generar en el mundo de los eventos.
            </p>
          </div>
        </section>

        <section
          className={`container my-5 ${styles.contentSection}`}
          id="nosotros"
        >
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <div className={`card ${styles.cardNosotros} p-4 h-100`}>
                <h2 className="h4 mb-3">Nuestra historia</h2>

                <div className={styles.tabsRow}>
                  {tabs.map((tab, index) => (
                    <button
                      key={index}
                      className={`${styles.tabButton} ${
                        tabActiva === index ? styles.tabButtonActive : ""
                      }`}
                      onClick={() => setTabActiva(index)}
                    >
                      {tab.titulo}
                    </button>
                  ))}
                </div>

                <div className={`card p-4 shadow ${styles.contentCard}`}>
                  <h3>{tabs[tabActiva].titulo}</h3>

                  <p>{tabs[tabActiva].contenido}</p>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div
                className={`card ${styles.cardNosotros} overflow-hidden h-100`}
              >
                <img
                  src={imagenNosotros}
                  alt="Fundadores"
                  className={`img-fluid ${styles.imagenNosotros}`}
                />

                <div className="card-body">
                  <h3 className="h5">Los fundadores de Ticket +</h3>

                  <p className="mb-0 text-muted">
                    Conoce a las personas detrás de Ticket +.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </LayoutPrincipal>
  );
}

export default Informacion;
