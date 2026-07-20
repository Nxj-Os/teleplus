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
  "PREVENTA FANS": "btn-outline-light",
  "PREVENTA INTERBANK": "btn-danger",
  "PRECIO FULL": "btn-info",
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

  const tiposUnicos = useMemo(() => {
    const orden = [];
    const vistos = new Set();
    zonasPrecios
      .filter((zp) => zp.activo)
      .forEach((zp) => {
        if (!vistos.has(zp.tipoPrecio)) {
          vistos.add(zp.tipoPrecio);
          orden.push(zp.tipoPrecio);
        }
      });
    return orden;
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

  const bannerSrc = evento.imagenDetalle || evento.imagenCarrusel || bannerFallback;
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
      <section className="py-3" style={{ backgroundColor: "#0d1b30" }}>
        <div className="container">
          <div className="d-flex flex-wrap justify-content-center gap-4 text-white small">
            <span><strong>Fecha:</strong> {formatearFecha(evento.fecha_evento)}</span>
            <span><strong>Hora:</strong> {formatearHora(evento.hora_evento)}</span>
            <span><strong>Lugar:</strong> {lugarNombre}</span>
          </div>
        </div>
      </section>

      {/* PLANO DE UBICACION */}
      {evento.imagenMapa && (
        <section className="py-4" style={{ backgroundColor: "#081020" }}>
          <div className="container">
            <div className="card border-0 shadow-lg" style={{ backgroundColor: "#0d1b30" }}>
              <div className="card-body p-4 text-center">
                <h4 className="fw-bold mb-3 text-white">Plano de Ubicación del Recinto</h4>
                <img
                  src={evento.imagenMapa}
                  alt={`Plano de ${evento.titulo}`}
                  className="img-fluid rounded d-block mx-auto"
                  style={{ maxHeight: "600px", objectFit: "contain" }}
                />
                <p className="small mt-2 mb-0" style={{ color: "#94a3b8" }}>
                  Plano referencial. La distribución puede variar por razones técnicas, logísticas o por disposiciones de las autoridades competentes.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MAPA + PRECIOS */}
      {zonasAgrupadas.length > 0 && (
        <div className={styles["campo-escenario"]}>
          <div className="container">
            <div className="row justify-content-center">
              <div className={`${styles["caja-boletos"]} col-lg-10 col-12`}>
                <div className={styles["tabla-precios-container"]}>
                  <table className={styles["tabla-precios"]}>
                    <thead>
                      <tr>
                        <th className={styles["th-sectores"]}>SECTORES</th>
                        {tiposUnicos.map((tipo) => (
                          <th key={tipo} className={styles["th-precio"]}>
                            {tipo}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {zonasAgrupadas.map((zona, indexZona) => (
                        <tr
                          key={zona.idZona || indexZona}
                          className={styles["fila-zona"]}
                        >
                          <td className={styles["td-zona"]}>
                            {zona.nombre}
                          </td>
                          {tiposUnicos.map((tipo) => {
                            const tipoData = zona.tipos[tipo];
                            const sinStock = tipoData && tipoData.stockDisponible <= 0;
                            const stockBajo = tipoData && tipoData.stockDisponible > 0 && tipoData.stockDisponible <= 5;

                            return (
                              <td
                                key={tipo}
                                className={`${styles["td-precio"]} ${!tipoData ? styles["sin-precio"] : ""}`}
                              >
                                {tipoData ? (
                                  <>
                                    <span className={styles["precio-valor"]}>
                                      S/. {Number(tipoData.precio).toFixed(2)}
                                    </span>
                                    {sinStock && (
                                      <span className={styles["badge-agotado"]}>Agotado</span>
                                    )}
                                    {stockBajo && (
                                      <span className={styles["badge-ultimas"]}>
                                        ¡Últimas {tipoData.stockDisponible}!
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  <span className={styles["no-disponible"]}>-----</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
            <h3 className="mb-5 text-white fw-bold">
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
                          idEventoZonaPrecio: ezp.id,
                          imagen: evento.imagenPortada,
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
            <h3 className="mb-3 text-white fw-bold">
              {evento.titulo}
            </h3>
            <p className="text-white fs-5">
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
          src={evento.imagenFooter || logoFallback}
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
