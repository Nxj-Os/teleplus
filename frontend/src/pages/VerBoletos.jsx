import LayoutPrincipal from "../layouts/LayoutPrincipal";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerEntradas } from "../services/entradaService";

const boletosDummy = [
  {
    nombre_evento: 1024589,
    codigo_qr: "QR_748392X93",
    estado: "Activo",
    fecha_generacion: "2026-05-28",
    precio_final: 45.5,
    reservado_hasta: null,
  },
  {
    nombre_evento: 1024590,
    codigo_qr: "QR_992011A12",
    estado: "Reservado",
    fecha_generacion: "2026-05-30",
    precio_final: 35.0,
  },
];

export default function VerBoletos() {
  const [entradas, setEntradas] = useState([]);
  const allBoletos = [...boletosDummy, ...entradas];

  const getBadgeClass = (estado) => {
    switch (estado?.toLowerCase()) {
      case "activo":
        return "bg-success";
      case "reservado":
        return "bg-warning text-dark";
      case "cancelado":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  useEffect(() => {
    const cargarEntradas = async () => {
      try {
        const data = await obtenerEntradas();

        setEntradas(data);
      } catch (error) {
        console.error("Error cargando entradas", error);
      }
    };

    cargarEntradas();
  }, []);

  return (
    <LayoutPrincipal>
      <div className="container py-5">
        <main className="container py-2 mb-5">
          {/* Encabezado */}
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

          <ul className="row list-unstyled text-center bg-light mb-4">
            <li className="col-4 btn py-3 btn-outline-secondary rounded-0">
              MIS COMPRAS
            </li>
            <li className="col-4 btn py-3 btn-outline-secondary rounded-0 active">
              ETICKETS
            </li>
            <li className="col-4 btn py-3 btn-outline-secondary rounded-0">
              MIS DEVOLUCIONES
            </li>
          </ul>

          {allBoletos.length === 0 ? (
            <div className="container text-center my-5 py-5">
              <h3 className="text-dark">No tiene boletos disponibles</h3>
              <Link to="/" className="btn btn-primary">
                Comprar Boletos
              </Link>
            </div>
          ) : (
            <div className="row g-4">
              {allBoletos.map((boleto, index) => (
                <div className="col-md-6 col-lg-4" key={index}>
                  <div className="card h-100 shadow-sm border-secondary-subtle">
                    <div className="card-header d-flex justify-content-between align-items-center bg-dark text-white">
                      <span className="small fw-bold">
                        Evento: {boleto.nombre_evento || "Evento registrado"}
                      </span>
                      <span className={`badge ${getBadgeClass(boleto.estado)}`}>
                        {boleto.estado.toUpperCase()}
                      </span>
                    </div>
                    {/* Cuerpo del Boleto */}
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-4 text-center">
                          <div
                            className="bg-light border d-flex flex-column align-items-center justify-content-center p-2 rounded"
                            style={{
                              height: "80px",
                              width: "80px",
                              fontSize: "10px",
                            }}
                          >
                            <span className="fw-bold text-muted">
                              [QR CODE]
                            </span>
                          </div>
                          <small
                            className="text-muted d-block text-truncate mt-1"
                            style={{ fontSize: "11px" }}
                          >
                            {boleto.codigo_qr}
                          </small>
                        </div>
                        <div className="col-8">
                          <p className="mb-1 text-muted small">
                            <strong>Emisión:</strong>{" "}
                            {new Date(
                              boleto.fecha_generacion,
                            ).toLocaleDateString()}
                          </p>

                          <h4 className="text-primary m-0 mt-2">
                            ${boleto.precio_final?.toFixed(2)}
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer bg-transparent d-grid gap-2 border-top-0">
                      <button className="btn btn-sm btn-outline-danger">
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </LayoutPrincipal>
  );
}
