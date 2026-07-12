import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LayoutPrincipal from "../layouts/LayoutPrincipal";

export default function Inicio() {
  const [eventos, setEventos] = useState([]);
  useEffect(() => {

  axios
    .get("http://localhost:8080/api/eventos")
    .then((response) => {

      console.log(response.data);

      setEventos(response.data);

    })
    .catch((error) => {

      console.error(error);

    });

}, []); 

  const heroSlides = eventos.map((evento, index) => ({
    ...evento,
    title: evento.titulo,
    subtitle: evento.descripcion,
    img: evento.imagenCarrusel || "https://placehold.co/1200x600?text=Evento",
    ruta: `/evento/${evento.id_evento}`,
    active: index === 0,
  }));

  return (
    <LayoutPrincipal>
      <div className="d-flex flex-column min-vh-100 bg-light index-page">
        {/* SECCIÓN HERO */}
        <section className="hero">
          <div className="container-fluid p-0">
            <div
              id="heroCarousel"
              className="carousel slide"
              data-bs-ride="carousel"
              data-bs-interval="4500"
            >
              <div className="carousel-indicators">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.id_evento}
                    type="button"
                    data-bs-target="#heroCarousel"
                    data-bs-slide-to={index}
                    className={slide.active ? "active" : ""}
                    aria-current={slide.active ? "true" : undefined}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>

              <div className="carousel-inner">
                {heroSlides.map((slide) => (
                  <div
                    key={slide.id_evento}
                    className={`carousel-item ${slide.active ? "active" : ""}`}
                  >
                    <Link
                      to={slide.ruta}
                      className="d-block text-decoration-none"
                    >
                      <div className="position-relative">
                        <img
                          src={slide.img}
                          className="d-block w-100 img-fluid"
                          alt={slide.title}
                          style={{
                            height: "clamp(420px, 70vh, 760px)",
                            objectFit: "cover",
                          }}
                        />
                        <div className="carousel-caption d-none d-md-block text-start">
                          <div
                            className="bg-dark bg-opacity-50 rounded-4 p-4"
                            style={{ maxWidth: "520px" }}
                          >
                            <p className="text-uppercase fw-semibold mb-2 text-warning">
                              Evento destacado
                            </p>
                            <h2 className="display-6 fw-bold mb-2">
                              {slide.title}
                            </h2>
                            <p className="mb-0">{slide.subtitle}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#heroCarousel"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                />
                <span className="visually-hidden">Anterior</span>
              </button>

              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#heroCarousel"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                />
                <span className="visually-hidden">Siguiente</span>
              </button>
            </div>
          </div>
        </section>

        {/* LISTA DE EVENTOS */}
        <main className="container my-4 flex-fill">
          <h3 className="pb-4">Eventos destacados</h3>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {eventos.map((evento) => (
              <div className="col" key={evento.id_evento}>
                <div className="card h-100 border-0 shadow-sm overflow-hidden">
                  <Link to={`/evento/${evento.id_evento}`}>
                    <img
                      src={evento.imagenPortada || "https://placehold.co/400x300?text=Evento"}
                      alt={`Evento ${evento.id_evento}`}
                      className="card-img-top"
                      style={{
                        height: "220px",
                        objectFit: "cover",
                        transition: "transform 0.3s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                  </Link>
                  <div className="card-body">
                    <p
                      className="card-text mb-0 fw-bold"
                      style={{ color: "black", fontSize: "1.5rem" }}
                    >
                      {evento.titulo}
                    </p>
                    <p
                      className="card-text text-secondary small"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {evento.fecha_evento}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </LayoutPrincipal>
  );
}
