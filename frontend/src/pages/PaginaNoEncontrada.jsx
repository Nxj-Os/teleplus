import { Link } from "react-router-dom";
import styles from "../css/paginaNoEncontrada.module.css";
import LayoutPrincipal from "../layouts/LayoutPrincipal";

export default function PaginaNoEncontrada() {
  return (
    <LayoutPrincipal>
      <main className={`${styles.page} d-flex align-items-center`}>
        <div className={`container position-relative ${styles.content}`}>
          <div className={styles.glow} aria-hidden="true" />

          <div className="row justify-content-center">
            <div className="col-12 col-lg-10 col-xl-8 text-center">
              <span className={styles.badge}>Error 404</span>

              <h1 className={styles.title}>Página no encontrada</h1>

              <p className={`${styles.lead} mx-auto`}>
                La dirección que intentaste abrir no está disponible, fue movida
                o nunca existió.
              </p>

              <div className={styles.panel}>
                <div className={styles.code}>404</div>
                <p className="mb-0 text-secondary">
                  Vuelve al inicio o navega a una sección conocida para seguir
                  explorando Ticket +.
                </p>
              </div>

              <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mt-4">
                <Link to="/" className="btn btn-danger btn-lg px-4 fw-semibold">
                  Ir al inicio
                </Link>
                <Link
                  to="/nosotros"
                  className="btn btn-outline-light btn-lg px-4"
                >
                  Conocer más
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </LayoutPrincipal>
  );
}
