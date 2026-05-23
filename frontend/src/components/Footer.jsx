import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container py-4">
        <div className="row">
          <h2 className="fw-bold text-start pb-3">Ticket +</h2>
          <div className="container">
            <p className="small text-secondary">
              Al continuar en esta página, usted acuerda registrarse por
              nuestros{" "}
            <Link
            to="/terminos-uso"
            className="text-white text-decoration-none"
            >
            Términos de Uso
            </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <div className="bg-black text-white py-4 border-top border-secondary">
        <div className="container">
          <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
            <Link
           to="/politica-compra"
            className="text-white text-decoration-none border-end pe-2 me-1"
            >
            Política de Compra
          </Link>
            <Link
            to="/politica-privacidad"
            className="text-white text-decoration-none border-end pe-2 me-1"
            >
            Política de privacidad
            </Link>
            <Link
            to="/politica-cookies"
            className="text-white text-decoration-none border-end pe-2 me-1"
            >
            Política de Cookies
            </Link>
            <Link
            to="/terminos-uso"
            className="text-white text-decoration-none"
            >
            Términos de Uso
            </Link>

            <span
              className="rounded-3 bg-success p-2 ms-md-3"
              style={{ fontSize: "0.8rem" }}
            >
              Preferencias de cookies.
            </span>
          </div>

          <p className="small text-secondary mb-0">
            © 2026 TicketBoost. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
