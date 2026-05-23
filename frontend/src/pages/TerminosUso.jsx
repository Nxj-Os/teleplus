import LayoutPrincipal from "../layouts/LayoutPrincipal";

function TerminosUso() {

  return (

    <LayoutPrincipal>

      {/* HERO */}
      <section className="bg-dark text-white py-5">

        <div className="container text-center">

          <h1 className="display-4 fw-bold">

            Términos de Uso

          </h1>

          <p className="lead mt-3">

            Condiciones generales para el uso
            de la plataforma Ticket + y
            sus servicios digitales.

          </p>

        </div>

      </section>

      {/* CONTENIDO */}
      <section className="py-5 bg-light">

        <div className="container">

          <div className="row g-4">

            {/* CARD 1 */}
            <div className="col-md-6">

              <div className="card shadow border-0 h-100">

                <div className="card-body p-4">

                  <h3 className="text-danger mb-3">

                    Aceptación de Condiciones

                  </h3>

                  <p>

                    Al acceder y utilizar
                    Ticket +, el usuario acepta
                    cumplir estos términos
                    y condiciones.

                  </p>

                  <p>

                    Si el usuario no está
                    de acuerdo con alguna
                    de las disposiciones,
                    deberá abstenerse de utilizar
                    la plataforma.

                  </p>

                  <p>

                    Ticket + podrá actualizar
                    los términos en cualquier momento.

                  </p>

                </div>

              </div>

            </div>

            {/* CARD 2 */}
            <div className="col-md-6">

              <div className="card shadow border-0 h-100">

                <div className="card-body p-4">

                  <h3 className="text-danger mb-3">

                    Uso Correcto de la Plataforma

                  </h3>

                  <p>

                    El usuario se compromete
                    a utilizar Ticket + únicamente
                    para actividades legales
                    y autorizadas.

                  </p>

                  <p>

                    Está prohibido manipular,
                    vulnerar o intentar afectar
                    la seguridad del sistema.

                  </p>

                  <p>

                    Cualquier actividad sospechosa
                    podrá ocasionar suspensión
                    permanente de la cuenta.

                  </p>

                </div>

              </div>

            </div>

            {/* CARD 3 */}
            <div className="col-md-6">

              <div className="card shadow border-0 h-100">

                <div className="card-body p-4">

                  <h3 className="text-danger mb-3">

                    Compra de Entradas

                  </h3>

                  <p>

                    Las entradas adquiridas
                    mediante Ticket + son
                    personales e intransferibles
                    salvo indicación contraria.

                  </p>

                  <p>

                    Ticket + no se responsabiliza
                    por pérdidas ocasionadas
                    por errores del usuario
                    durante el proceso de compra.

                  </p>

                  <p>

                    El usuario deberá verificar
                    correctamente todos los datos
                    antes de confirmar el pago.

                  </p>

                </div>

              </div>

            </div>

            {/* CARD 4 */}
            <div className="col-md-6">

              <div className="card shadow border-0 h-100">

                <div className="card-body p-4">

                  <h3 className="text-danger mb-3">

                    Restricciones y Seguridad

                  </h3>

                  <p>

                    Ticket + podrá limitar accesos,
                    cancelar promociones o bloquear
                    cuentas relacionadas con fraude
                    o uso indebido.

                  </p>

                  <p>

                    Está prohibida la reventa
                    no autorizada de entradas.

                  </p>

                  <p>

                    Las entradas duplicadas,
                    alteradas o manipuladas
                    podrán ser invalidadas.

                  </p>

                </div>

              </div>

            </div>

            {/* CARD 5 */}
            <div className="col-md-6">

              <div className="card shadow border-0 h-100">

                <div className="card-body p-4">

                  <h3 className="text-danger mb-3">

                    Propiedad Intelectual

                  </h3>

                  <p>

                    Todo el contenido visual,
                    marcas, logos y diseño
                    de Ticket + pertenece
                    a la plataforma o sus
                    respectivos propietarios.

                  </p>

                  <p>

                    Queda prohibida la reproducción
                    no autorizada del contenido.

                  </p>

                </div>

              </div>

            </div>

            {/* CARD 6 */}
            <div className="col-md-6">

              <div className="card shadow border-0 h-100">

                <div className="card-body p-4">

                  <h3 className="text-danger mb-3">

                    Modificaciones del Servicio

                  </h3>

                  <p>

                    Ticket + se reserva el derecho
                    de modificar funcionalidades,
                    servicios o condiciones
                    sin previo aviso.

                  </p>

                  <p>

                    También podrá suspender
                    temporalmente servicios
                    por mantenimiento técnico
                    o mejoras del sistema.

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

export default TerminosUso;