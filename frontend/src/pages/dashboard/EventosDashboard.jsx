import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import styles from "../../css/dashboard.module.css";
import DashboardShell from "./DashboardShell";

function EventosDashboard() {
  const [eventos, setEventos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/eventos")
      .then((response) => {
        setEventos(response.data);
        setError("");
      })
      .catch((errorResponse) => {
        console.error(errorResponse);
        setError("No se pudieron cargar los eventos.");
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  const eventosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) {
      return eventos;
    }

    return eventos.filter((evento) => {
      const titulo = (evento.titulo || "").toLowerCase();
      const estado = (evento.estado || "").toLowerCase();
      const fecha = String(evento.fecha_evento || "").toLowerCase();

      return (
        titulo.includes(texto) ||
        estado.includes(texto) ||
        fecha.includes(texto)
      );
    });
  }, [busqueda, eventos]);

  const totalEventos = eventos.length;
  const eventosActivos = eventos.filter(
    (evento) => (evento.estado || "").toLowerCase() === "activo",
  ).length;
  const eventosProgramados = eventos.filter(
    (evento) => (evento.estado || "").toLowerCase() === "programado",
  ).length;

  return (
    <DashboardShell
      activeSection="eventos"
      title="Gestión de Eventos"
      subtitle="Consulta, filtra y revisa los eventos registrados en la plataforma"
    >
      <section className={styles.cards} style={{ background: "none" }}>
        <article className={styles.card}>
          <h3>Total eventos</h3>
          <p>{totalEventos}</p>
        </article>

        <article className={styles.card}>
          <h3>Activos</h3>
          <p>{eventosActivos}</p>
        </article>

        <article className={styles.card}>
          <h3>Programados</h3>
          <p>{eventosProgramados}</p>
        </article>

        <article className={styles.card}>
          <h3>Estado</h3>
          <p>{cargando ? "Cargando" : "Listo"}</p>
        </article>
      </section>

      <section className={styles["table-section"]}>
        <div className={`${styles["section-header"]} section-header-row`}>
          <div>
            <h2>Listado de eventos</h2>
            <p>Visualiza la información principal de cada evento</p>
          </div>

          <input
            className={styles["dashboard-search"]}
            type="search"
            placeholder="Buscar por título, fecha o estado"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
          />
        </div>

        {error ? (
          <div className={`${styles["empty-state"]} ${styles["error-state"]}`}>
            {error}
          </div>
        ) : null}

        {!error && cargando ? (
          <div className={styles["empty-state"]}>Cargando eventos...</div>
        ) : null}

        {!error && !cargando && eventosFiltrados.length === 0 ? (
          <div className={styles["empty-state"]}>
            No hay eventos que coincidan con la búsqueda.
          </div>
        ) : null}

        {!error && !cargando && eventosFiltrados.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Evento</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {eventosFiltrados.map((evento) => (
                <tr key={evento.id_evento}>
                  <td>
                    <div className={styles["table-primary-text"]}>
                      {evento.titulo}
                    </div>
                    <div className={styles["table-secondary-text"]}>
                      ID {evento.id_evento}
                    </div>
                  </td>
                  <td>{evento.fecha_evento || "--"}</td>
                  <td>{evento.hora_evento || "--"}</td>
                  <td>
                    <span
                      className={`${styles["status-badge"]} ${
                        styles[
                          `status-${(evento.estado || "sin-estado").toLowerCase()}`
                        ] || ""
                      }`}
                    >
                      {evento.estado || "Sin estado"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </section>
    </DashboardShell>
  );
}

export default EventosDashboard;
