import styles from "../../css/dashboard.module.css";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardShell from "./DashboardShell";
import apiClient from "../../services/apiClient";

function IndexDashboard() {
  // ===== STATES =====

  const [totalEventos, setTotalEventos] = useState(0);

  const [totalUsuarios, setTotalUsuarios] = useState(0);

  const [totalEntradas, setTotalEntradas] = useState(0);

  const [totalGanancias, setTotalGanancias] = useState(0);

  const [eventosRecientes, setEventosRecientes] = useState([]);

  // ===== CARGAR DATOS =====

  useEffect(() => {
    // EVENTOS
    apiClient
      .get("/api/eventos")
      .then((response) => {
        setTotalEventos(response.data.length);

        setEventosRecientes(response.data.slice(0, 10));
      })
      .catch((error) => {
        console.error(error);
      });

    // USUARIOS
    apiClient
      .get("/api/usuarios")
      .then((response) => {
        setTotalUsuarios(response.data.length);
      })
      .catch((error) => {
        console.error(error);
      });

    // ENTRADAS
    apiClient
      .get("/api/entradas")
      .then((response) => {
        setTotalEntradas(response.data.length);
      })
      .catch((error) => {
        console.error(error);
      });

    // GANANCIAS
    apiClient
      .get("/api/pagos")
      .then((response) => {
        const total = response.data.reduce((sum, pago) => sum + (pago.monto || 0), 0);
        setTotalGanancias(total);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <DashboardShell
      activeSection="dashboard"
      title="Dashboard Administrador"
      subtitle="Resumen general de la plataforma"
    >
      <section className={styles.cards} style={{ background: "none" }}>
        <article className={styles.card}>
          <h3>Eventos</h3>
          <p>{totalEventos}</p>
          <Link className={styles["card-link"]} to="/dashboard/eventos">
            Ver eventos
          </Link>
        </article>

        <article className={styles.card}>
          <h3>Tickets vendidos</h3>
          <p>{totalEntradas}</p>
          <span className={styles["card-caption"]}>Entradas registradas</span>
        </article>

        <article className={styles.card}>
          <h3>Usuarios</h3>
          <p>{totalUsuarios}</p>
          <Link className={styles["card-link"]} to="/dashboard/usuarios">
            Ver usuarios
          </Link>
        </article>

        <article className={styles.card}>
          <h3>Ganancias</h3>
          <p>S/. {totalGanancias.toLocaleString("es-PE", { minimumFractionDigits: 2 })}</p>
          <span className={styles["card-caption"]}>Estimado del periodo</span>
        </article>
      </section>

      <section className={styles["table-section"]}>
        <div className={styles["section-header"]}>
          <div>
            <h2>Eventos recientes</h2>
            <p>Últimos registros disponibles en el sistema</p>
          </div>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Evento</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {eventosRecientes.map((evento) => (
              <tr key={evento.id_evento}>
                <td>{evento.titulo}</td>

                <td>{evento.fecha_evento}</td>

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
      </section>
    </DashboardShell>
  );
}

export default IndexDashboard;
