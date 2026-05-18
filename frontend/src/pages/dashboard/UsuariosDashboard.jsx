import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import styles from "../../css/dashboard.module.css";
import DashboardShell from "./DashboardShell";

function UsuariosDashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/usuarios")
      .then((response) => {
        setUsuarios(response.data);
        setError("");
      })
      .catch((errorResponse) => {
        console.error(errorResponse);
        setError("No se pudieron cargar los usuarios.");
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  const usuariosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) {
      return usuarios;
    }

    return usuarios.filter((usuario) => {
      const nombreCompleto =
        `${usuario.nombre || ""} ${usuario.apellido || ""}`.toLowerCase();
      const correo = (usuario.correo || "").toLowerCase();
      const estado = (usuario.estado || "").toLowerCase();
      const rol = (usuario.rol?.nombre || "").toLowerCase();

      return (
        nombreCompleto.includes(texto) ||
        correo.includes(texto) ||
        estado.includes(texto) ||
        rol.includes(texto)
      );
    });
  }, [busqueda, usuarios]);

  const totalUsuarios = usuarios.length;
  const usuariosActivos = usuarios.filter(
    (usuario) => (usuario.estado || "").toLowerCase() === "activo",
  ).length;
  const administradores = usuarios.filter((usuario) =>
    (usuario.rol?.nombre || "").toLowerCase().includes("admin"),
  ).length;
  const usuariosBloqueados = usuarios.filter(
    (usuario) => (usuario.estado || "").toLowerCase() === "bloqueado",
  ).length;

  return (
    <DashboardShell
      activeSection="usuarios"
      title="Gestión de Usuarios"
      subtitle="Revisa los usuarios registrados y su estado dentro de la plataforma"
    >
      <section className={styles.cards} style={{ background: "none" }}>
        <article className={styles.card}>
          <h3>Total usuarios</h3>
          <p>{totalUsuarios}</p>
        </article>

        <article className={styles.card}>
          <h3>Activos</h3>
          <p>{usuariosActivos}</p>
        </article>

        <article className={styles.card}>
          <h3>Administradores</h3>
          <p>{administradores}</p>
        </article>

        <article className={styles.card}>
          <h3>Bloqueados</h3>
          <p>{usuariosBloqueados}</p>
        </article>
      </section>

      <section className={styles["table-section"]}>
        <div className={`${styles["section-header"]} section-header-row`}>
          <div>
            <h2>Listado de usuarios</h2>
            <p>Administra la información básica de las cuentas registradas</p>
          </div>

          <input
            className={styles["dashboard-search"]}
            type="search"
            placeholder="Buscar por nombre, correo, rol o estado"
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
          <div className={styles["empty-state"]}>Cargando usuarios...</div>
        ) : null}

        {!error && !cargando && usuariosFiltrados.length === 0 ? (
          <div className={styles["empty-state"]}>
            No hay usuarios que coincidan con la búsqueda.
          </div>
        ) : null}

        {!error && !cargando && usuariosFiltrados.length > 0 ? (
          <div className={styles["table-responsive"]}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id_usuario}>
                    <td>
                      <div className={styles["table-primary-text"]}>
                        {usuario.nombre} {usuario.apellido}
                      </div>
                      <div className={styles["table-secondary-text"]}>
                        ID {usuario.id_usuario}
                      </div>
                    </td>
                    <td>{usuario.correo || "--"}</td>
                    <td>{usuario.telefono || "--"}</td>
                    <td>{usuario.rol?.nombre || "Sin rol"}</td>
                    <td>
                      <span
                        className={`${styles["status-badge"]} ${
                          styles[
                            `status-${(usuario.estado || "sin-estado").toLowerCase()}`
                          ] || ""
                        }`}
                      >
                        {usuario.estado || "Sin estado"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </DashboardShell>
  );
}

export default UsuariosDashboard;
