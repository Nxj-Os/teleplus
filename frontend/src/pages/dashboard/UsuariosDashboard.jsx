import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import styles from "../../css/dashboard.module.css";
import { recuperarSesionDashboard } from "../../utils/dashboardAuth";
import DashboardShell from "./DashboardShell";
import apiClient from "../../services/apiClient";

function UsuariosDashboard() {
  const usuarioSesion = recuperarSesionDashboard();
  const nombreDelRol = usuarioSesion?.rol?.nombreRol;
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const obtenerTextoRol = (usuario) => {
    if (!usuario) return "Sin rol";
    if (typeof usuario.rol === "string") return usuario.rol;
    if (usuario.nombreRol) return usuario.nombreRol;
    if (usuario.rolUsuario) return usuario.rolUsuario;

    if (usuario.rol && typeof usuario.rol === "object") {
      return usuario.rol.nombre_rol || usuario.rol.nombreRol || usuario.rol.nombre || usuario.rol.name || "Objeto Rol";
    }
    if (usuario.idRol && typeof usuario.idRol === "object") {
      return usuario.idRol.nombre_rol || usuario.idRol.nombreRol || usuario.idRol.nombre || "Objeto Rol";
    }
    if (usuario.authorities && usuario.authorities.length > 0) {
      return usuario.authorities[0].authority?.replace("ROLE_", "") || "Sin rol";
    }
    return "Sin rol";
  };

  const cargarUsuarios = () => {
    setCargando(true);
    apiClient
      .get("/api/usuarios")
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
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      cargarUsuarios();
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const alternarEstadoUsuario = (usuario) => {
    const nuevoEstado = usuario.estado === "activo" ? "bloqueado" : "activo";
    apiClient
      .put(`/api/usuarios/${usuario.id_usuario || usuario.id}`, {
        ...usuario,
        estado: nuevoEstado
      })
      .then(() => {
        cargarUsuarios();
      })
      .catch((err) => {
        console.error(err);
        alert("No se pudo actualizar el estado del usuario.");
      });
  };

  const seleccionarUsuarioParaEditar = (usuario) => {
    setUsuarioEditando({
      ...usuario,
      rolTexto: obtenerTextoRol(usuario)
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setUsuarioEditando((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!usuarioEditando) return;

    const id = usuarioEditando.id_usuario || usuarioEditando.id;
    const usuarioOriginal = usuarios.find((u) => (u.id_usuario || u.id) === id);

    let idRolMapeado = usuarioOriginal?.rol?.id_rol || usuarioOriginal?.rol?.id;
    if (usuarioEditando.rolTexto === "ADMIN") idRolMapeado = 1;
    else if (usuarioEditando.rolTexto === "MANAGER") idRolMapeado = 2;
    else if (usuarioEditando.rolTexto === "CLIENTE") idRolMapeado = 3;

    const datosActualizados = {
      id_usuario: id,
      nombre: usuarioEditando.nombre,
      apellido: usuarioEditando.apellido,
      correo: usuarioEditando.correo,
      telefono: usuarioEditando.telefono,
      estado: usuarioEditando.estado || "activo",
      contrasena: usuarioOriginal?.contrasena || usuarioEditando.contrasena || "",
      fecha_registro: usuarioOriginal?.fecha_registro || usuarioEditando.fecha_registro,
      
      rol: {
        id_rol: idRolMapeado,
        id: idRolMapeado,
        nombre_rol: usuarioEditando.rolTexto,
        nombreRol: usuarioEditando.rolTexto
      }
    };

    apiClient
      .put(`/api/usuarios/${id}`, datosActualizados)
      .then(() => {
        const disparadorCierre = document.getElementById("btn-cerrar-modal-usuarios");
        if (disparadorCierre) disparadorCierre.click();

        alert("¡Usuario actualizado correctamente!");
        setUsuarioEditando(null);
        cargarUsuarios(); 
      })
      .catch((err) => {
        console.error("Error al actualizar:", err);
        alert("Hubo un problema al procesar la actualización.");
      });
  };

  const usuariosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return usuarios;

    return usuarios.filter((usuario) => {
      const nombreCompleto = `${usuario.nombre || ""} ${usuario.apellido || ""}`.toLowerCase();
      const correo = (usuario.correo || "").toLowerCase();
      const estado = (usuario.estado || "").toLowerCase();
      const rol = obtenerTextoRol(usuario).toLowerCase();

      return (
        nombreCompleto.includes(texto) ||
        correo.includes(texto) ||
        estado.includes(texto) ||
        rol.includes(texto)
      );
    });
  }, [busqueda, usuarios]);

  if (nombreDelRol === "MANAGER") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <DashboardShell activeSection="usuarios" title="Gestión de Usuarios" subtitle="Revisa los usuarios registrados y su estado">
      <section className={styles.cards} style={{ background: "none" }}>
        <article className={styles.card}><h3>Total usuarios</h3><p>{usuarios.length}</p></article>
        <article className={styles.card}><h3>Activos</h3><p>{usuarios.filter(u => u.estado === "activo").length}</p></article>
        <article className={styles.card}><h3>Administradores</h3><p>{usuarios.filter(u => ["ADMIN","MANAGER"].includes(obtenerTextoRol(u).toUpperCase())).length}</p></article>
        <article className={styles.card}><h3>Bloqueados</h3><p>{usuarios.filter(u => u.estado === "bloqueado").length}</p></article>
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

        {error && <div className={styles["empty-state"]}>{error}</div>}
        {cargando && <div className={styles["empty-state"]}>Cargando usuarios...</div>}
        {!cargando && usuariosFiltrados.length === 0 && <div className={styles["empty-state"]}>No hay coincidencias.</div>}

        {!cargando && usuariosFiltrados.length > 0 && (
          <div className={styles["table-responsive"]}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((usuario) => (
                  <tr key={usuario.id_usuario || usuario.id}>
                    <td>
                      <div className={styles["table-primary-text"]}>{usuario.nombre} {usuario.apellido}</div>
                      <div className={styles["table-secondary-text"]}>ID {usuario.id_usuario || usuario.id}</div>
                    </td>
                    <td>{usuario.correo || "--"}</td>
                    <td>{usuario.telefono || "--"}</td>
                    <td style={{ textTransform: "uppercase" }}>{obtenerTextoRol(usuario)}</td>
                    <td>
                      <span className={`${styles["status-badge"]} ${styles[`status-${(usuario.estado || "activo").toLowerCase()}`]}`}>
                        {usuario.estado || "Activo"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#modalEditarUsuario"
                          onClick={() => seleccionarUsuarioParaEditar(usuario)}
                        >
                          Editar
                        </button>
                        <button
                          className={`btn btn-sm ${usuario.estado === "activo" ? "btn-outline-danger" : "btn-outline-success"}`}
                          onClick={() => alternarEstadoUsuario(usuario)}
                        >
                          {usuario.estado === "activo" ? "Bloquear" : "Activar"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* MODAL GESTIÓN */}
      <div className="modal fade" id="modalEditarUsuario" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content bg-dark text-white border-secondary">
            <div className="modal-header border-secondary">
              <h5 className="modal-title">Modificar Datos de Usuario</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            {usuarioEditando && (
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nombre</label>
                      <input type="text" className="form-control bg-secondary text-white border-0" name="nombre" value={usuarioEditando.nombre || ""} onChange={handleEditChange} required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Apellido</label>
                      <input type="text" className="form-control bg-secondary text-white border-0" name="apellido" value={usuarioEditando.apellido || ""} onChange={handleEditChange} required />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Correo Electrónico</label>
                    <input type="email" className="form-control bg-secondary text-white border-0" name="correo" value={usuarioEditando.correo || ""} onChange={handleEditChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input type="text" className="form-control bg-secondary text-white border-0" name="telefono" value={usuarioEditando.telefono || ""} onChange={handleEditChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Rol del Sistema</label>
                    <select className="form-select bg-secondary text-white border-0" name="rolTexto" value={usuarioEditando.rolTexto} onChange={handleEditChange}>
                      <option value="CLIENTE">Cliente</option>
                      <option value="MANAGER">Manager</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button id="btn-cerrar-modal-usuarios" type="button" className="d-none" data-bs-dismiss="modal"></button>
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                  <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

export default UsuariosDashboard;