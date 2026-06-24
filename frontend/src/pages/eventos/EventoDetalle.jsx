import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useComprarEntrada } from "../../hooks/useComprarEntrada";
import {
  obtenerEventoPorId,
  obtenerZonasPorEvento,
} from "../../services/eventoService";

import styles from "../../css/evento1.module.css";

import LayoutPrincipal from "../../layouts/LayoutPrincipal";

import bannerFallback from "../../assets/img/banner-evento1.jpg";
import logoFallback from "../../assets/img/logo-evento1.png";

const BOTON_COLORES = {
  "PREVENTA FANS": "btn-dark",
  "PREVENTA INTERBANK": "btn-danger",
  "PRECIO FULL": "btn-secondary",
  CONADIS: "btn-warning",
};

function EventoDetalle() {
  const { id } = useParams();
  const { comprarEntrada } = useComprarEntrada();

  const [evento, setEvento] = useState(null);
  const [zonasPrecios, setZonasPrecios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      obtenerEventoPorId(id),
      obtenerZonasPorEvento(id),
    ])
      .then(([eventoData, zpData]) => {
        setEvento(eventoData);
        setZonasPrecios(zpData);
      })
      .catch((error) => {
        console.error("Error cargando evento:", error);
      })
      .finally(() => {
        setCargando(false);
      });
  }, [id]);

  const zonasAgrupadas = useMemo(() => {
    const mapa = {};

    zonasPrecios
      .filter((zp) => zp.activo)
      .forEach((zp) => {
        const nombreZona = zp.zona?.nombre_zona || "Sin zona";

        if (!mapa[nombreZona]) {
          mapa[nombreZona] = {
            nombre: nombreZona,
            idZona: zp.zona?.id_zona,
            tipos: {},
          };
        }

        mapa[nombreZona].tipos[zp.tipoPrecio] = {
          precio: zp.precio,
          stockDisponible: zp.stockDisponible,
          fechaInicio: zp.fechaInicio,
          fechaFin: zp.fechaFin,
          ezpId: zp.id,
        };
      });

    return Object.values(mapa);
  }, [zonasPrecios]);

  const tiposDisponibles = useMemo(() => {
    const tipos = new Map();

    zonasPrecios
      .filter((zp) => zp.activo && zp.stockDisponible > 0)
      .forEach((zp) => {
        if (!tipos.has(zp.tipoPrecio)) {
          tipos.set(zp.tipoPrecio, zp);
        }
      });

    return Array.from(tipos.entries());
  }, [zonasPrecios]);

  const estaEnVenta = (fechaInicio, fechaFin) => {
    const ahora = new Date();
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return ahora >= inicio && ahora <= fin;
  };

  const tieneStock = (stockDisponible) => stockDisponible > 0;

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "";

    const partes = fechaStr.split("-");

    if (partes.length === 3) {
      const [anio, mes, dia] = partes;
      const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
      ];
      return `${parseInt(dia)} ${meses[parseInt(mes) - 1]} ${anio}`;
    }

    return fechaStr;
  };

  const formatearHora = (horaStr) => {
    if (!horaStr) return "";

    const partes = horaStr.split(":");

    if (partes.length >= 2) {
      let horas = parseInt(partes[0]);
      const minutos = partes[1];
      const ampm = horas >= 12 ? "PM" : "AM";

      horas = horas % 12 || 12;

      return `${horas}:${minutos} ${ampm}`;
    }

    return horaStr;
  };

  if (cargando) {
    return (
      <LayoutPrincipal>
        <div className="container py-5 text-center">
          <h2>Cargando evento...</h2>
        </div>
      </LayoutPrincipal>
    );
  }

  if (!evento) {
    return (
      <LayoutPrincipal>
        <div className="container py-5 text-center">
          <h2>Evento no encontrado</h2>
        </div>
      </LayoutPrincipal>
    );
  }

  const bannerSrc = evento.imagen || bannerFallback;
  const lugarNombre = evento.lugar?.nombre || "Lugar por definir";
  const lugarDireccion = evento.lugar?.direccion || "";
  const lugarCiudad = evento.lugar?.ciudad || "";

  return (
    <LayoutPrincipal>

      {/* HERO */}
      <section
        className={styles["seccion-principal"]}
        style={{ height: "100%" }}
      >
        <img
          src={bannerSrc}
          alt={evento.titulo}
          className={`img-fluid ${styles["hero-image"]} ${styles["img-centrada"]}`}
          style={{ height: "100%" }}
        />
      </section>

      {/* INFORMACION DEL EVENTO */}
      <section className="py-4 bg-light">
        <div className="container">
          <div className="card shadow-lg border-0">
            <div className="card-body p-4">
              <h2 className="fw-bold mb-3">{evento.titulo}</h2>

              <div className="row">
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Fecha:</strong>{" "}
                    {formatearFecha(evento.fecha_evento)}
                  </p>
                  <p className="mb-1">
                    <strong>Hora:</strong>{" "}
                    {formatearHora(evento.hora_evento)}
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Lugar:</strong> {lugarNombre}
                  </p>
                  {lugarDireccion && (
                    <p className="mb-1 text-muted small">
                      {lugarDireccion}
                      {lugarCiudad ? ` - ${lugarCiudad}` : ""}
                    </p>
                  )}
                </div>
              </div>

              {evento.descripcion && (
                <>
                  <hr />
                  <p className="mb-0">{evento.descripcion}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MAPA + PRECIOS */}
      {zonasAgrupadas.length > 0 && (
        <div className={styles["campo-escenario"]}>
          <div className="container">
            <div className="row justify-content-center">
              {/* PRECIOS */}
              <div className={`${styles["caja-boletos"]} col-lg-8 col-12`}>
                <div className={styles["tabla-precios"]}>
                  {zonasAgrupadas.map((zona, indexZona) => (
                    <div
                      key={zona.idZona || indexZona}
                      className={`${styles["fila-precios"]} rounded shadow-sm bg-dark p-3 overflow-auto mb-3`}
                    >
                      <div className="d-flex align-items-center justify-content-center flex-nowrap gap-2">
                        <div
                          className={`${
                            indexZona % 2 === 0
                              ? "bg-white text-dark"
                              : "bg-warning text-dark"
                          } ${styles["etiqueta-fila"]} flex-shrink-0`}
                        >
                          {zona.nombre}
                        </div>

                        {Object.entries(zona.tipos).map(
                          ([tipoNombre, tipoData]) => (
                            <div
                              key={tipoData.ezpId}
                              className={`${styles["celda-precio"]} flex-shrink-0`}
                            >
                              <div className={styles["etiqueta"]}>
                                {tipoNombre}
                              </div>
                              <div className={styles["precio"]}>
                                S/ {Number(tipoData.precio).toFixed(2)}
                              </div>
                              {tipoData.stockDisponible <= 5 &&
                                tipoData.stockDisponible > 0 && (
                                  <div className="small text-warning mt-1">
                                    ¡Últimas {tipoData.stockDisponible}!
                                  </div>
                                )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOTONES DE COMPRA */}
      {tiposDisponibles.length > 0 && (
        <section className={`${styles["botones-seccion"]} py-5`}>
          <div className="container text-center">
            <h3 className="mb-5 text-dark fw-bold">
              Obtén tus tickets para ver a {evento.titulo}
            </h3>

            <div className="row g-3">
              {tiposDisponibles.map(([tipoNombre, ezp]) => {
                const enVenta = estaEnVenta(ezp.fechaInicio, ezp.fechaFin);
                const conStock = tieneStock(ezp.stockDisponible);
                const disponible = enVenta && conStock;
                const claseBoton = BOTON_COLORES[tipoNombre] || "btn-dark";

                let textoBoton = tipoNombre;
                if (!conStock) textoBoton = "Agotado";
                else if (!enVenta) textoBoton = "No disponible";

                return (
                  <div key={ezp.id} className="col-md-6 col-lg-3">
                    <button
                      className={`btn ${claseBoton} w-100 py-3 fw-bold`}
                      disabled={!disponible}
                      onClick={() =>
                        comprarEntrada({
                          evento: evento.titulo,
                          fecha: evento.fecha_evento,
                          lugar: lugarNombre,
                          zona: ezp.zona?.nombre_zona || "General",
                          tipo: tipoNombre,
                          precio: Number(ezp.precio),
                        })
                      }
                    >
                      {textoBoton}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SIN ENTRADAS DISPONIBLES */}
      {tiposDisponibles.length === 0 && zonasPrecios.length > 0 && (
        <section className={`${styles["botones-seccion"]} py-5`}>
          <div className="container text-center">
            <h3 className="mb-3 text-dark fw-bold">
              {evento.titulo}
            </h3>
            <p className="text-dark fs-5">
              No hay entradas disponibles para este evento en este momento.
            </p>
          </div>
        </section>
      )}

      {/* DESCRIPCION INFERIOR */}
      <section
        className={`${styles["descripcion"]} bg-dark py-5 text-center`}
      >
        <img
          src={logoFallback}
          alt={evento.titulo}
          className={`mb-3 img-fluid ${styles["img-centrada"]}`}
        />

        <p className="text-center mx-auto w-75">
          {evento.descripcion}
        </p>
      </section>

    </LayoutPrincipal>
  );
}

export default EventoDetalle;
