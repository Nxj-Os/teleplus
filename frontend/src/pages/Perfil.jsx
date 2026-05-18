import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutPrincipal from "../layouts/LayoutPrincipal";
import { actualizarUsuario } from "../services/UsuarioService";

const getStoredUser = () => {
  const storedUser = localStorage.getItem("user");

  return storedUser ? JSON.parse(storedUser) : null;
};

const getProfileFormData = (user) => ({
  nombre: user?.nombre || "",
  apellido: user?.apellido || "",
  correo: user?.correo || "",
  telefono: user?.telefono || "",
  estado: user?.estado || "activo",
});

const formatDate = (value) => {
  if (!value) return "No registrada";

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) return value;

  return parsedDate.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const getInitials = (nombre, apellido) => {
  return `${nombre?.[0] || ""}${apellido?.[0] || ""}`.toUpperCase() || "U";
};

function Perfil() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getStoredUser);
  const [showEditModal, setShowEditModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(() =>
    getProfileFormData(getStoredUser()),
  );

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const openEditModal = () => {
    setSuccessMessage("");
    setErrorMessage("");
    setFormData(getProfileFormData(user));
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    const userId = user.id_usuario ?? user.id;

    if (!userId) {
      setErrorMessage(
        "No se pudo identificar tu usuario para guardar los cambios.",
      );
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    const updatedUser = {
      ...user,
      ...formData,
    };

    try {
      const responseUser = await actualizarUsuario(userId, updatedUser);
      const finalUser = responseUser || updatedUser;

      localStorage.setItem("user", JSON.stringify(finalUser));
      setUser(finalUser);
      setShowEditModal(false);
      setSuccessMessage("Tu perfil fue actualizado correctamente.");
    } catch (error) {
      setErrorMessage(
        error?.message || "No se pudo actualizar el perfil en el backend.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <LayoutPrincipal>
        <div
          className="container d-flex align-items-center justify-content-center py-5"
          style={{ minHeight: "70vh" }}
        >
          <div
            className="card shadow border-0 text-center p-4"
            style={{ maxWidth: "520px" }}
          >
            <div className="card-body">
              <div
                className="rounded-circle bg-danger text-white d-inline-flex align-items-center justify-content-center mb-3"
                style={{
                  width: "72px",
                  height: "72px",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                }}
              >
                U
              </div>
              <h3 className="fw-bold mb-2">No has iniciado sesión</h3>
              <p className="text-muted mb-4">
                Inicia sesión para ver y editar tu perfil, revisar tus datos y
                administrar tu cuenta.
              </p>
              <button
                className="btn btn-danger px-4"
                onClick={() => navigate("/login")}
              >
                Ir al Login
              </button>
            </div>
          </div>
        </div>
      </LayoutPrincipal>
    );
  }

  const roleName = user.rol?.nombreRol || user.rol?.nombre || "Usuario";
  const memberSince = formatDate(user.fecha_registro);

  return (
    <LayoutPrincipal>
      <section
        className="py-5"
        style={{
          background:
            "linear-gradient(180deg, rgba(220,53,69,0.08) 0%, rgba(255,255,255,1) 32%, rgba(248,249,250,1) 100%)",
          minHeight: "calc(100vh - 140px)",
        }}
      >
        <div className="container">
          <div className="row g-4 align-items-stretch">
            <div className="col-lg-4">
              <div className="card border-0 shadow-lg h-100 overflow-hidden">
                <div
                  className="p-4 text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, #dc3545 0%, #a61c2d 100%)",
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle bg-white text-danger d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: "84px",
                        height: "84px",
                        fontSize: "1.7rem",
                        fontWeight: 800,
                      }}
                    >
                      {getInitials(user.nombre, user.apellido)}
                    </div>
                    <div>
                      <div className="opacity-75 small">Mi perfil</div>
                      <h2 className="h4 fw-bold mb-1">
                        {user.nombre} {user.apellido}
                      </h2>
                      <div className="d-flex flex-wrap gap-2">
                        <span className="badge bg-light text-danger">
                          {roleName}
                        </span>
                        <span className="badge bg-success">
                          {user.estado || "activo"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-body p-4">
                  <p className="text-muted mb-4">
                    Desde aquí puedes revisar tu información personal, editar
                    tus datos y mantener tu cuenta al día.
                  </p>

                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-danger fw-semibold"
                      onClick={openEditModal}
                    >
                      Editar perfil
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </button>
                  </div>

                  <hr className="my-4" />

                  <div className="row g-3 text-center">
                    <div className="col-6">
                      <div className="rounded-3 bg-light p-3 h-100">
                        <div className="text-muted small">Estado</div>
                        <div className="fw-bold text-capitalize">
                          {user.estado || "activo"}
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="rounded-3 bg-light p-3 h-100">
                        <div className="text-muted small">Miembro desde</div>
                        <div className="fw-bold">{memberSince}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                  <h1 className="fw-bold mb-1">Panel de perfil</h1>
                  <p className="text-muted mb-0">
                    Gestiona tus datos, revisa tu información de cuenta y
                    personaliza tu experiencia.
                  </p>
                </div>
                <button
                  className="btn btn-outline-danger"
                  onClick={openEditModal}
                >
                  Editar información
                </button>
              </div>

              {successMessage && (
                <div className="alert alert-success border-0 shadow-sm">
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="alert alert-danger border-0 shadow-sm">
                  {errorMessage}
                </div>
              )}

              <div className="row g-4 mb-4">
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="text-muted small mb-1">
                        Correo electrónico
                      </div>
                      <div className="fw-semibold text-break">
                        {user.correo}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="text-muted small mb-1">Teléfono</div>
                      <div className="fw-semibold">
                        {user.telefono || "No registrado"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="text-muted small mb-1">
                        Tipo de cuenta
                      </div>
                      <div className="fw-semibold">{roleName}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row g-4">
                <div className="col-md-7">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-white border-0 pt-4 px-4">
                      <h5 className="fw-bold mb-0">Información personal</h5>
                    </div>
                    <div className="card-body px-4 pb-4">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <div className="p-3 bg-light rounded-3 h-100">
                            <div className="text-muted small">Nombre</div>
                            <div className="fw-semibold">{user.nombre}</div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="p-3 bg-light rounded-3 h-100">
                            <div className="text-muted small">Apellido</div>
                            <div className="fw-semibold">
                              {user.apellido || "No registrado"}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="p-3 bg-light rounded-3 h-100">
                            <div className="text-muted small">Correo</div>
                            <div className="fw-semibold text-break">
                              {user.correo}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="p-3 bg-light rounded-3 h-100">
                            <div className="text-muted small">Teléfono</div>
                            <div className="fw-semibold">
                              {user.telefono || "No registrado"}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="p-3 bg-light rounded-3 h-100">
                            <div className="text-muted small">
                              Estado de cuenta
                            </div>
                            <div className="fw-semibold text-capitalize">
                              {user.estado || "activo"}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="p-3 bg-light rounded-3 h-100">
                            <div className="text-muted small">
                              Fecha de registro
                            </div>
                            <div className="fw-semibold">{memberSince}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-5">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-white border-0 pt-4 px-4">
                      <h5 className="fw-bold mb-0">Actividad y seguridad</h5>
                    </div>
                    <div className="card-body px-4 pb-4">
                      <div className="d-flex align-items-start gap-3 mb-3">
                        <div
                          className="rounded-circle bg-success-subtle text-success d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: "42px", height: "42px" }}
                        >
                          <span className="fw-bold">✓</span>
                        </div>
                        <div>
                          <div className="fw-semibold">Cuenta verificada</div>
                          <div className="text-muted small">
                            Tu cuenta está activa y lista para comprar entradas.
                          </div>
                        </div>
                      </div>

                      <div className="d-flex align-items-start gap-3 mb-3">
                        <div
                          className="rounded-circle bg-danger-subtle text-danger d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: "42px", height: "42px" }}
                        >
                          <span className="fw-bold">@</span>
                        </div>
                        <div>
                          <div className="fw-semibold">Correo principal</div>
                          <div className="text-muted small text-break">
                            {user.correo}
                          </div>
                        </div>
                      </div>

                      <div className="d-flex align-items-start gap-3">
                        <div
                          className="rounded-circle bg-warning-subtle text-warning d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: "42px", height: "42px" }}
                        >
                          <span className="fw-bold">i</span>
                        </div>
                        <div>
                          <div className="fw-semibold">Perfil completo</div>
                          <div className="text-muted small">
                            Mantén tu nombre, apellido y teléfono actualizados
                            para mejorar la experiencia de compra.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showEditModal && (
          <>
            <div className="modal-backdrop fade show"></div>
            <div
              className="modal d-block"
              tabIndex="-1"
              role="dialog"
              aria-modal="true"
            >
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow-lg">
                  <div className="modal-header border-0 px-4 pt-4 pb-0">
                    <div>
                      <h5 className="modal-title fw-bold mb-1">
                        Editar perfil
                      </h5>
                      <p className="text-muted small mb-0">
                        Actualiza tus datos y guarda los cambios en tu sesión
                        actual.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Cerrar"
                      onClick={closeEditModal}
                    ></button>
                  </div>

                  <form onSubmit={handleSaveProfile}>
                    <div className="modal-body px-4 py-4">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Nombre
                          </label>
                          <input
                            type="text"
                            name="nombre"
                            className="form-control form-control-lg"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Apellido
                          </label>
                          <input
                            type="text"
                            name="apellido"
                            className="form-control form-control-lg"
                            value={formData.apellido}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Correo
                          </label>
                          <input
                            type="email"
                            name="correo"
                            className="form-control form-control-lg"
                            value={formData.correo}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Teléfono
                          </label>
                          <input
                            type="text"
                            name="telefono"
                            className="form-control form-control-lg"
                            value={formData.telefono}
                            onChange={handleChange}
                            placeholder="Ingresa tu número"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Estado
                          </label>
                          <select
                            className="form-select form-select-lg"
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                          >
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                            <option value="pendiente">Pendiente</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="modal-footer border-0 px-4 pb-4 pt-0">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={closeEditModal}
                        disabled={isSaving}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="btn btn-danger px-4"
                        disabled={isSaving}
                      >
                        {isSaving ? "Guardando..." : "Guardar cambios"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </LayoutPrincipal>
  );
}

export default Perfil;
