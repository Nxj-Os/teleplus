import LayoutPrincipal from "../layouts/LayoutPrincipal";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerEntradas,actualizarEntrada } from "../services/entradaService";
import { QRCodeSVG } from "qrcode.react";


export default function VerBoletos() {
  const [entradas, setEntradas] = useState([]);
  const [boletoSeleccionado, setBoletoSeleccionado] = useState(null);
  const [pestañaActiva, setPestañaActiva] = useState("TICKETS");

  useEffect(() => {
    const cargarEntradas = async () => {
      try {
        const data = await obtenerEntradas();
        console.log("Datos recibidos del backend:", data);
        setEntradas(data);
      } catch (error) {
        console.error("Error cargando entradas", error);
      }
    };
 
    cargarEntradas();
  }, []);
//filtro
  const boletosMostrados = entradas.filter((boleto) => {
    if (pestañaActiva === "TICKETS") {
      return boleto.estado !== "DEVUELTO"; 
    } else {
      return boleto.estado === "DEVUELTO";
    }
  });
const Cancelarbole = async (boleto) => {
   
    const confirmar = window.confirm("¿Estás seguro de que deseas cancelar y devolver este boleto?");
    if (!confirmar) return;

    try {
      const boletoActualizado = { ...boleto, estado: "DEVUELTO" };
      await actualizarEntrada(boleto.id_entrada, boletoActualizado);
      setEntradas((entradasPrevias) =>
        entradasPrevias.map((ent) =>
          ent.id_entrada === boleto.id_entrada ? boletoActualizado : ent
        )
      );
      alert("Boleto devuelto exitosamente, su rembolso se le sera notificado y efectuado dentro de los siguientes 7 dias.");
    } catch (error) {
      console.error("Error al cancelar el boleto:", error);
      alert("Hubo un problema al procesar tu devolución.");
    }
    
  };
  const getStoredUser = () => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

const user = getStoredUser();
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
                <li><a className="dropdown-item" href="#">E-TICKETS</a></li>
                <li><a className="dropdown-item" href="#">MIS DEVOLUCIONES</a></li>
                <li><a className="dropdown-item" href="#">CAMBIAR CONTRASEÑA</a></li>
                <li><a className="dropdown-item" href="#">CERRAR SESIÓN</a></li>
              </ul>
            </div>
          </div>
          <ul className="row list-unstyled text-center bg-light mb-4">
            <li 
              className={`col-4 btn py-3 btn-outline-secondary rounded-0 ${pestañaActiva === "TICKETS" ? "active" : ""}`}
              onClick={() => setPestañaActiva("TICKETS")}
            >
              TICKETS
            </li>
            <li 
              className={`col-4 btn py-3 btn-outline-secondary rounded-0 ${pestañaActiva === "DEVOLUCIONES" ? "active" : ""}`}
              onClick={() => setPestañaActiva("DEVOLUCIONES")}
            >
              MIS DEVOLUCIONES
            </li>
          </ul>
          {boletosMostrados.length === 0 ? (
            <div className="container text-center my-5 py-5">
              <h3 className="text-dark">
                {pestañaActiva === "TICKETS" 
                  ? "No tiene boletos disponibles" 
                  : "No tiene boletos devueltos"}
              </h3>
              {pestañaActiva === "TICKETS" && (
                <Link to="/" className="btn btn-primary mt-3">
                  Comprar Boletos
                </Link>
              )}
            </div>
          ) : (
            <div className="row g-4">
              {boletosMostrados.map((boleto, index) => (
                <div className="col-md-6 col-lg-4" key={index}>
                  <div className="card h-100 shadow-sm border-secondary-subtle">
                    <div className="card-header d-flex justify-content-between align-items-center bg-dark text-white">
                      <span className="small fw-bold">
                        Evento: {boleto.nombre_evento || "Evento registrado"}
                      </span>
                      {boleto.estado === "DEVUELTO" && (
                         <span className="badge bg-danger">Devuelto</span>
                      )}
                    </div>
                    {/* Cuerpo del Boleto */}
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-4 text-center">
                          <small className="text-muted d-block text-truncate mt-1" style={{ fontSize: "11px" }}></small>
                        </div>
                        <div className="col-8">
                          <p className="mb-1 text-muted small">
                            <strong>Emisión:</strong>{" "}
                            {boleto.fecha_generacion.split("-").reverse().join("/")}
                          </p>

                          <h4 className="text-primary m-0 mt-2">
                            S/. {boleto.precio_final?.toFixed(2)}
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="card-footer bg-transparent d-grid gap-2 border-top-0">
                      {pestañaActiva === "TICKETS" && (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => Cancelarbole(boleto)}>
                          Rembolsar
                        </button>
                      )}
                      <button className="btn max-w:30px btn-sm btn-outline-primary" 
                        data-bs-toggle="modal"
                        data-bs-target="#ticketModal"
                        onClick={() => setBoletoSeleccionado(boleto)}>
                        Ver Boleto
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      {/* Ventana Flotante Modal */}
      <div className="modal fade" id="ticketModal" tabIndex="-1" aria-labelledby="ticketModalLabel" aria-hidden="true">
        <div className="modal-content modal-dialog modal-dialog-centered" style={{ maxWidth: "450px", border: "none", borderRadius: "15px" }}>
          {boletoSeleccionado && (
            <div className="modal-body p-4 bg-white rounded shadow-lg">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-danger fw-bold">Ticket +</span>
                <span className="badge bg-dark p-2" style={{ fontSize: "11px" }}>
                  Nro. de Compra: {boletoSeleccionado.codigo_qr}
                </span> 
              </div>

              <h2 className="text-center my-3 fw-bold text-navy">
                {boletoSeleccionado.nombre_evento}
              </h2>
              <div className="row g-2 align-items-center bg-light p-3 rounded border mb-3">
                <div className="col-5 text-center">
                  <div className="bg-white border p-2 rounded d-flex align-items-center justify-content-center mx-auto" style={{ width: "110px", height: "110px" }}>
                    <QRCodeSVG 
                      value={boletoSeleccionado.codigo_qr} 
                      size={110}
                      bgColor={"#ffffff"}
                      fgColor={"#000000"}
                      includeMargin={true}
                    />
                  </div>
                </div>
                <div className="col-7" style={{ fontSize: "12px" }}>
                  <div className="mb-2 text-truncate">
                    <strong>Cliente: {user?.nombre} {user?.apellido}</strong>
                  </div>
                  <div className="mb-2">
                  <span className=" text-truncate"><strong>Fecha de compra: </strong></span>{boletoSeleccionado.fecha_generacion.split("-").reverse().join("/")}
                  </div>
                  <div className="mb-2 text-truncate">
                    <strong>{boletoSeleccionado.lugar || "Lugar"}</strong>
                  </div>
                  <div className="mb-2 text-truncate">
                    <strong>{boletoSeleccionado.zona || "Zona"}</strong>
                  </div>
                </div>
              </div>
              {boletoSeleccionado.estado === "DEVUELTO" ? (
                 <p className="text-danger fw-bold small text-center mb-3">
                   ESTE BOLETO HA SIDO DEVUELTO Y NO ES VÁLIDO.
                 </p>
              ) : (
                <p className="text-danger small text-center mb-3">
                  Muestra el código QR desde tu celular para ingresar.  
                </p>
              )}

              <div className="border rounded p-3 mb-4">
                <div className="d-flex align-items-center border-bottom pb-2 mb-2 text-danger fw-bold">
                   <span className="ms-2">Boleto</span>
                </div>
                <div className="d-flex justify-content-between small text-muted mb-2">
                  <span>Cant: {boletoSeleccionado.cantidad || 1}</span>
                  <span>S/. {(boletoSeleccionado.precio_final).toFixed(2)}</span>
                </div>
                <hr className="my-2 border-dashed" />
                <div className="d-flex justify-content-between fw-bold fs-5 text-dark mt-2">
                  <span>Costo Total</span>
                  <span>S/. {(boletoSeleccionado.precio_final).toFixed(2)}</span>
                </div>
              </div>
              <div>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Cerrar Ventana  
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </LayoutPrincipal>
  );
}