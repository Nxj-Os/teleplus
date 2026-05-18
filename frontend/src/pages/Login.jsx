import { useState } from "react";
import { FaCheckCircle, FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";
import styles from "../css/login.module.css";
import LayoutPrincipal from "../layouts/LayoutPrincipal";
import { loginUsuario } from "../services/UsuarioService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const [language, setLanguage] = useState("es");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const texts = {
    es: {
      welcome: "¡Bienvenido a Ticket Plus+!",
      successTitle: "Bienvenido a Ticket Plus+ 🥳",
      success: "Login exitoso",
      continue: "Continuar",
      subtitle: "Ingresa para vivir la mejor experiencia en eventos.",
      badge: "Inicio de Sesión",
      email: "Correo Electrónico",
      emailPlaceholder: "Ingresa tu correo",
      password: "Contraseña",
      passwordPlaceholder: "Ingresa tu contraseña",
      login: "Ingresar",
      forgot: "¿Olvidaste tu contraseña?",
      register: "¿Aún no tienes cuenta? Regístrate",
      errorEmail: "Debes ingresar el correo",
      errorPass: "Debes ingresar la contraseña",
      errorInvalidEmail: "Correo no válido",
      errorAuth: "Correo o contraseña incorrectos",
      footer: "Vive la música. Siente la experiencia 🎶",
    },

    en: {
      welcome: "Welcome to Ticket Plus+!",
      successTitle: "Welcome to Ticket Plus+ 🥳",
      success: "Login successful",
      continue: "Continue",
      subtitle: "Sign in for the best event experience.",
      badge: "Login",
      email: "Email Address",
      emailPlaceholder: "Enter your email",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      login: "Sign In",
      forgot: "Forgot your password?",
      register: "Don't have an account yet? Sign up",
      errorEmail: "You must enter your email",
      errorPass: "You must enter your password",
      errorInvalidEmail: "Invalid email",
      errorAuth: "Invalid email or password",
      footer: "Live the music. Feel the experience 🎶",
    },
  };

  const t = texts[language];

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.trim() === "") {
      newErrors.push(t.errorEmail);
    } else if (!emailRegex.test(email)) {
      newErrors.push(t.errorInvalidEmail);
    }

    if (password.trim() === "") {
      newErrors.push(t.errorPass);
    }

    setErrors(newErrors);

    if (newErrors.length === 0) {
      try {
        const data = await loginUsuario({
          correo: email,
          contrasena: password,
        });

        if (data) {
          localStorage.setItem("user", JSON.stringify(data));
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error capturado:", error);
        setErrors([t.errorAuth]);
      }
    }
  };

  return (
    <LayoutPrincipal>
      <div className={`container-fluid p-0 ${styles.page}`}>
        {/* MODAL ÉXITO */}
        {isLoggedIn && (
          <div className={styles.modalOverlay}>
            <div className={`${styles.modalBox}`}>
              <FaCheckCircle
                className="text-success mb-3"
                style={{ fontSize: "3rem" }}
              />

              <h2 className="fw-bold mb-1" style={{ color: "#333" }}>
                {t.successTitle}
              </h2>

              <p className="text-muted mb-4">{t.success}</p>

              <button
                className="btn btn-success w-100 py-2 fw-bold"
                style={{
                  backgroundColor: "#198754",
                  border: "none",
                  borderRadius: "10px",
                }}
                onClick={() => (window.location.href = "/")}
              >
                {t.continue}
              </button>
            </div>
          </div>
        )}

        <div className="row g-0 vh-100">
          {/* FORMULARIO */}
          <div className="col-md-6 d-flex flex-column justify-content-center align-items-center bg-white p-4 shadow">
            {/* IDIOMAS */}
            <div className="mb-4">
              <span
                className="px-2"
                onClick={() => setLanguage("es")}
                style={{
                  cursor: "pointer",
                  fontWeight: language === "es" ? "bold" : "normal",
                  color: language === "es" ? "#dc3545" : "black",
                }}
              >
                ES
              </span>

              <span className="text-muted">|</span>

              <span
                className="px-2"
                onClick={() => setLanguage("en")}
                style={{
                  cursor: "pointer",
                  fontWeight: language === "en" ? "bold" : "normal",
                  color: language === "en" ? "#dc3545" : "black",
                }}
              >
                EN
              </span>
            </div>

            <form className={styles.formWrapper} onSubmit={handleSubmit}>
              {/* TITULOS */}
              <div className="text-center mb-4">
                <div className="badge bg-danger mb-2 px-3 py-2 text-uppercase">
                  {t.badge}
                </div>

                <h2 className="fw-bold text-dark m-0">{t.welcome}</h2>

                <p className="text-muted small">{t.subtitle}</p>
              </div>

              {/* EMAIL */}
              <div className="mb-3">
                <label className="fw-semibold text-muted small mb-1">
                  {t.email}
                </label>

                <input
                  type="email"
                  className="form-control form-control-lg shadow-sm"
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-3">
                <label className="fw-semibold text-muted small mb-1">
                  {t.password}
                </label>

                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control form-control-lg shadow-sm border-end-0"
                    placeholder={t.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <span
                    className="input-group-text bg-white border-start-0 shadow-sm"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: "pointer" }}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>
              </div>

              {/* ERRORES */}
              {errors.length > 0 && (
                <div className="alert alert-danger py-2 small text-center border-0 shadow-sm">
                  {errors.map((err, index) => (
                    <div key={index}>{err}</div>
                  ))}
                </div>
              )}

              {/* BOTON */}
              <button
                type="submit"
                className="btn btn-danger btn-lg w-100 mb-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
              >
                <FaSignInAlt /> {t.login}
              </button>

              {/* LINKS */}
              <div className="text-center mt-3 pt-3 border-top">
                <div className="mb-2">
                  <a href="#" className="text-decoration-none small text-muted">
                    {t.forgot}
                  </a>
                </div>

                <a
                  href="/registro"
                  className="text-decoration-none small text-danger fw-bold"
                >
                  {t.register}
                </a>
              </div>
            </form>
          </div>

          {/* IMAGEN */}
          <div
            className={`col-md-6 d-none d-md-block position-relative ${styles.rightColumn}`}
          >
            <div className={styles.heroTextWrapper}>
              <h1 className="display-4 fw-bold m-0">Ticket Plus+</h1>

              <p className="lead opacity-75">
                Tu entrada a los mejores eventos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </LayoutPrincipal>
  );
}

export default Login;
