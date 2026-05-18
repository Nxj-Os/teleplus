import LayoutPrincipal from "../layouts/LayoutPrincipal";

export default function VerBoletos() {
  return (
    <LayoutPrincipal>
      <div className="container py-5">
        <main className="container py-2 mb-5">
          <div className="d-flex justify-content-between align-items-center my-4">
            <h1 className="h3 text-dark">Mis Boletos</h1>

            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                COMPRAS & E-TICKETS
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    MIS COMPRAS
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    E-TICKETS
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    MIS DEVOLUCIONES
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    CAMBIAR CONTRASEÑA
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    CERRAR SESIÓN
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <h2></h2>
          <p></p>

          <ul className="row list-unstyled text-center bg-light">
            <li className="col-4 btn py-3 btn-outline-secondary rounded-0">
              MIS COMPRAS
            </li>
            <li className="col-4 btn py-3 btn-outline-secondary rounded-0">
              ETICKETS
            </li>
            <li className="col-4 btn py-3 btn-outline-secondary rounded-0">
              MIS DEVOLUCIONES
            </li>
          </ul>

          <div className="container text-center my-5 py-5">
            <h3 className="text-dark">No tiene boletos disponibles</h3>
            <a href="#" className="btn btn-primary">
              Comprar Boletos
            </a>
          </div>
        </main>
      </div>
    </LayoutPrincipal>
  );
}
