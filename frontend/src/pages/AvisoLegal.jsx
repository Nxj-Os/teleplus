import LayoutPrincipal from "../layouts/LayoutPrincipal";

function AvisoLegal() {

  return (

    <LayoutPrincipal>

      {/* HERO */}
      <section className="bg-dark text-white py-5">

        <div className="container text-center">

          <h1 className="display-4 fw-bold">

            Aviso Legal

          </h1>

          <p className="lead mt-3">

            Información sobre el uso de cookies,
            almacenamiento local y tecnologías
            utilizadas por Ticket +.

          </p>

        </div>

      </section>

      {/* CONTENIDO */}
      <section className="py-5 bg-light">

        <div className="container">

          <div className="row g-4">

            {/* CARD 1 */}
            <div className="col-md-6">

              <div className="card border-0 shadow h-100">

                <div className="card-body p-4">

                  <h3 className="text-danger mb-3">

                    ¿Qué son las Cookies?

                  </h3>

                  <p>

                    Las cookies son pequeños
                    archivos almacenados en
                    el navegador del usuario
                    cuando visita una página web.

                  </p>

                  <p>

                    Estas permiten recordar
                    preferencias, sesiones activas
                    y mejorar la experiencia
                    de navegación dentro
                    de Ticket +.

                  </p>

                  <p>

                    Las cookies no dañan el equipo
                    ni contienen virus o software
                    malicioso.

                  </p>

                </div>

              </div>

            </div>

            {/* CARD 2 */}
            <div className="col-md-6">

              <div className="card border-0 shadow h-100">

                <div className="card-body p-4">

                  <h3 className="text-danger mb-3">

                    Uso de Cookies

                  </h3>

                  <p>

                    Ticket + utiliza cookies
                    para mantener sesiones iniciadas,
                    recordar preferencias y optimizar
                    el funcionamiento del sistema.

                  </p>

                  <p>

                    También pueden utilizarse
                    para mejorar búsquedas,
                    accesos rápidos y recomendaciones
                    relacionadas con eventos.

                  </p>

                  <p>

                    Algunas cookies son necesarias
                    para el correcto funcionamiento
                    de la plataforma.

                  </p>

                </div>

              </div>

            </div>

            {/* CARD 3 */}
            <div className="col-md-6">

              <div className="card border-0 shadow h-100">

                <div className="card-body p-4">

                  <h3 className="text-danger mb-3">

                    Cookies de Terceros

                  </h3>

                  <p>

                    Algunas funcionalidades pueden
                    integrar servicios externos
                    como mapas, análisis estadísticos
                    o pasarelas de pago.

                  </p>

                  <p>

                    Estos servicios podrían utilizar
                    cookies propias bajo sus
                    respectivas políticas
                    de privacidad.

                  </p>

                  <p>

                    Ticket + no controla directamente
                    las cookies generadas por
                    plataformas externas.

                  </p>

                </div>

              </div>

            </div>

            {/* CARD 4 */}
            <div className="col-md-6">

              <div className="card border-0 shadow h-100">

                <div className="card-body p-4">

                  <h3 className="text-danger mb-3">

                    Administración de Cookies

                  </h3>

                  <p>

                    El usuario puede eliminar,
                    bloquear o restringir cookies
                    desde la configuración
                    de su navegador.

                  </p>

                  <p>

                    Sin embargo, deshabilitar cookies
                    puede afectar ciertas funciones
                    de Ticket +.

                  </p>

                  <p>

                    Recomendamos mantener habilitadas
                    las cookies esenciales para
                    una mejor experiencia.

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


    </LayoutPrincipal>

  );

}

export default AvisoLegal;