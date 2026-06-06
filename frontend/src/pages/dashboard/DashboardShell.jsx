import { NavLink, useNavigate } from "react-router-dom";
import styles from "../../css/dashboard.module.css";
import { cerrarSesionDashboard, recuperarSesionDashboard } from "../../utils/dashboardAuth";

function DashboardShell({ activeSection, title, subtitle, children }) {
  const navigate = useNavigate();
  const usuarioLogueado = recuperarSesionDashboard();
  const nombreDelRol = usuarioLogueado?.rol?.nombreRol;
  const navItems = [
    { to: "/dashboard", label: "Dashboard", section: "dashboard" },
    { to: "/dashboard/eventos", label: "Eventos", section: "eventos" },
    { to: "/dashboard/usuarios", label: "Usuarios", section: "usuarios" },
    { to: "/dashboard/promociones", label: "Promociones", section: "promociones" },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (item.section === "usuarios" && nombreDelRol === "MANAGER") {
      return false;
    }
    return true;
  });

  return (
    <div className={styles["dashboard-container"]}>
      <div
        className="offcanvas offcanvas-start d-md-none"
        tabIndex={-1}
        id="dashboardSidebar"
        aria-labelledby="dashboardSidebarLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="dashboardSidebarLabel">
            TelePlus
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>
        <div className="offcanvas-body p-0">
          <aside className={styles.sidebar + " p-3"}>
            <div className={styles["sidebar-brand"]}>
              <span className={styles["sidebar-kicker"]}>TelePlus</span>
              <h2>Admin Panel</h2>
            </div>

            <nav
              className={styles["sidebar-nav"]}
              aria-label="Navegación del dashboard"
            >
              {filteredNavItems.map((item) => (
                <a
                  key={item.to}
                  href={item.to}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.to);
                    const el = document.getElementById("dashboardSidebar");
                    if (el && window.bootstrap && window.bootstrap.Offcanvas) {
                      const instance =
                        window.bootstrap.Offcanvas.getInstance(el) ||
                        new window.bootstrap.Offcanvas(el);
                      try {
                        instance.hide();
                      } catch {
                        // ignore
                      }
                    }
                  }}
                  className={styles["sidebar-link"]}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className={styles["sidebar-footer"]}>
              <p className={styles["sidebar-footer-text"] || ""}>
                Gestión interna de eventos y usuarios
              </p>

              <button
                type="button"
                className={styles["sidebar-logout"]}
                onClick={() => {
                  cerrarSesionDashboard();
                  navigate("/dashboard/login", { replace: true });
                }}
              >
                Cerrar sesión
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className={styles.sidebar + " d-none d-md-flex"}>
        <div className={styles["sidebar-brand"]}>
          <span className={styles["sidebar-kicker"]}>TelePlus</span>
          <h2>Admin Panel</h2>
        </div>

        <nav
          className={styles["sidebar-nav"]}
          aria-label="Navegación del dashboard"
        >
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${styles["sidebar-link"]} ${
                  isActive || activeSection === item.section
                    ? styles.active
                    : ""
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles["sidebar-footer"]}>
          <p className={styles["sidebar-footer-text"] || ""}>
            Gestión interna de eventos y usuarios
          </p>

          <button
            type="button"
            className={styles["sidebar-logout"]}
            onClick={() => {
              cerrarSesionDashboard();
              navigate("/dashboard/login", { replace: true });
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className={styles["dashboard-content"]}>
        <header className={styles["dashboard-header"]}>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-light d-md-none me-3"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#dashboardSidebar"
                aria-controls="dashboardSidebar"
              >
                ☰
              </button>

              <div>
                <p className={styles["page-kicker"]}>Panel administrativo</p>
                <h1>{title}</h1>
                <p className={styles["page-subtitle"]}>{subtitle}</p>
              </div>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}

export default DashboardShell;
