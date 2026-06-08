import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useComprarEntrada } from "../../hooks/useComprarEntrada";
import axios from "axios";

import styles from "../../css/evento1.module.css";

import LayoutPrincipal from "../../layouts/LayoutPrincipal";

import bannerEvento from "../../assets/img/banner-evento1.jpg";
import logoEvento from "../../assets/img/logo-evento1.png";

function EventoDetalle() {

  const { id } = useParams();

  const [evento, setEvento] = useState(null);

  const { comprarEntrada } = useComprarEntrada();

  useEffect(() => {

    axios
      .get(`http://localhost:8080/api/eventos/${id}`)
      .then((response) => {

        setEvento(response.data);

      })
      .catch((error) => {

        console.error(error);

      });

  }, [id]);

  if (!evento) {
    return (
      <LayoutPrincipal>
        <div className="container py-5">
          <h2>Cargando evento...</h2>
        </div>
      </LayoutPrincipal>
    );
  }

  return (
    <LayoutPrincipal>

      {/* HERO */}
      <section
        className={styles["seccion-principal"]}
        style={{ height: "100%" }}
      >
        <img
          src={bannerEvento}
          alt={evento.titulo}
          className={`img-fluid ${styles["hero-image"]} ${styles["img-centrada"]}`}
          style={{ height: "100%" }}
        />
      </section>

      {/* INFORMACIÓN DEL EVENTO */}
      <section className="py-5 bg-light">

        <div className="container">

          <div className="card shadow-lg border-0">

            <div className="card-body p-4">

              <h2 className="fw-bold mb-4">
                {evento.titulo}
              </h2>

              <h4>Descripción</h4>

              <p>
                {evento.descripcion}
              </p>

              <hr />

              <p>
                <strong>Fecha:</strong>{" "}
                {evento.fecha_evento}
              </p>

              <p>
                <strong>Hora:</strong>{" "}
                {evento.hora_evento}
              </p>

              <p>
                <strong>Estado:</strong>{" "}
                {evento.estado}
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* BOTONES TEMPORALES */}
<section className={`${styles["botones-seccion"]} py-5`}>

  <div className="container text-center">

    <h3 className="mb-5 text-dark fw-bold">
      Obtén tus tickets para ver a {evento.titulo}
    </h3>

    <div className="row g-3">

      <div className="col-md-6">
        <button
          className="btn btn-dark w-100 py-3 fw-bold"
          onClick={() =>
            comprarEntrada({
              evento: evento.titulo,
              fecha: evento.fecha_evento,
              lugar: "Por definir",
              zona: "General",
              tipo: "PREVENTA",
              precio: 100,
            })
          }
        >
          PREVENTA
        </button>
      </div>

      <div className="col-md-6">
        <button
          className="btn btn-danger w-100 py-3 fw-bold"
          onClick={() =>
            comprarEntrada({
              evento: evento.titulo,
              fecha: evento.fecha_evento,
              lugar: "Por definir",
              zona: "VIP",
              tipo: "VIP",
              precio: 200,
            })
          }
        >
          VIP
        </button>
      </div>

    </div>

  </div>

</section>

      {/* DESCRIPCIÓN INFERIOR */}
      <section
        className={`${styles["descripcion"]} bg-dark py-5 text-center`}
      >

        <img
          src={logoEvento}
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
