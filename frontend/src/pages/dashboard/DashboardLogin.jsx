import { useState } from "react";
import { FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";
import { Navigate, useNavigate } from "react-router-dom";
import logoLogin from "../../assets/img/logo-login.jpeg";
import styles from "../../css/dashboardLogin.module.css";
import { loginUsuario } from "../../services/UsuarioService";
import {
  guardarSesionDashboard,
  recuperarSesionDashboard,
} from "../../utils/dashboardAuth";

function DashboardLogin() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const sesion = recuperarSesionDashboard();

  // Clear error when user types — handled in onChange handlers below

  if (sesion) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!correo.trim() || !contrasena.trim()) {
      setError("Ingresa correo y contraseña para acceder al dashboard.");
      return;
    }

    setCargando(true);
    setError("");

    try {
      const data = await loginUsuario({
        correo,
        contrasena,
      });

      if (data) {
        guardarSesionDashboard(data);
        navigate("/dashboard", { replace: true });
      }
    } catch (loginError) {
      console.error(loginError);
      setError("Correo o contraseña incorrectos.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className={styles["dashboard-login-page"]}>
      <div className={styles["dashboard-login-card"]}>
        <div className={styles["dashboard-login-copy"]}>
          <span className={styles["dashboard-login-badge"]}>Acceso admin</span>
          <h1>Panel de control</h1>
          <p>
            Ingresa con tu correo y contraseña para administrar eventos y
            usuarios.
          </p>
        </div>

        <form
          className={styles["dashboard-login-form"]}
          onSubmit={handleSubmit}
        >
          <div className={styles["dashboard-login-visual"]}>
            <img src={logoLogin} alt="Ticket Plus" />
          </div>

          <label className={styles["dashboard-login-label"]}>
            Correo electrónico
            <input
              type="email"
              value={correo}
              onChange={(event) => {
                setCorreo(event.target.value);
                setError("");
              }}
              placeholder="admin@correo.com"
            />
          </label>

          <label className={styles["dashboard-login-label"]}>
            Contraseña
            <div className={styles["dashboard-login-password"]}>
              <input
                type={mostrarContrasena ? "text" : "password"}
                value={contrasena}
                onChange={(event) => {
                  setContrasena(event.target.value);
                  setError("");
                }}
                placeholder="Ingresa tu contraseña"
              />

              <button
                type="button"
                className={styles["dashboard-login-toggle"]}
                onClick={() => setMostrarContrasena((actual) => !actual)}
              >
                {mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </label>

          {error ? (
            <div className={styles["dashboard-login-error"]}>{error}</div>
          ) : null}

          <button
            type="submit"
            className={styles["dashboard-login-button"]}
            disabled={cargando}
          >
            <FaSignInAlt />
            {cargando ? "Ingresando..." : "Entrar al dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default DashboardLogin;
