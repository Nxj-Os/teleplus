import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/img/logo v2.png";
import { cerrarSesion } from "../utils/usuario";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const userRole = user?.rol?.nombreRol;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid p-0">
        <a className="navbar-brand px-3" href="/">
          <img
            src={logo}
            alt="Ticket Plus Logo"
            style={{
              height: "70px",
            }}
          />
        </a>

        {/* BOTÓN MÓVIL (HAMBURGUESA) */}
        <button
          className="navbar-toggler mx-3"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menu"
          aria-controls="menu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* LINKS DEL MENÚ */}
        <div className="collapse navbar-collapse" id="menu">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 px-3 align-items-lg-center">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="/"
              >
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="/nosotros"
              >
                Nosotros
              </NavLink>
            </li>

            {user === null ? (
              <>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    to="/login"
                  >
                    Iniciar Sesion
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    to="/registro"
                  >
                    Registrarse
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                {userRole === "CLIENTE" && (
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                      }
                      to="/ver-boletos"
                    >
                      Ver boletos
                    </NavLink>
                  </li>
                )}

                {userRole === "MANAGER" && (
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "nav-link active text-warning fw-bold" : "nav-link text-warning"
                      }
                      to="/dashboard"
                    >
                      Gestionar Eventos
                    </NavLink>
                  </li>
                )}

                {userRole === "ADMIN" && (
                  <li className="nav-item">
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "nav-link active text-danger fw-bold" : "nav-link text-danger"
                      }
                      to="/dashboard"
                    >
                      Panel Admin
                    </NavLink>
                  </li>
                )}

                <li className="nav-item">
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    to="/perfil"
                  >
                    Mi Perfil
                  </NavLink>
                </li>

                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link text-start"
                    style={{ textDecoration: 'none' }}
                    onClick={async () => {
                      await cerrarSesion();
                      navigate("/");
                    }}
                  >
                    Cerrar Sesion
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
