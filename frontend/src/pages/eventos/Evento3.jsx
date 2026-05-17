import banner from "../../assets/img/banner-evento3.jpg";
import eventoSinFondo from "../../assets/img/evento3-sin fondo.jpg";
import "../../css/evento3.css";
import { useComprarEntrada } from "../../hooks/useComprarEntrada";
import LayoutPrincipal from "../../layouts/LayoutPrincipal";

function TablaPrecios() {
  return (
    <div className="ticket-table-wrapper">
      <table className="ticket-table" aria-label="Tabla de precios Maroon 5">
        <thead>
          <tr>
            <th className="th-sector">Sectores</th>
            <th>
              <span className="th-title">Preventa fans</span>
              <span className="th-sub">
                Válido del 13/04/26 hasta el 14/04/26 y/o agotar stock
              </span>
            </th>
            <th>
              <span className="th-title">Preventa Interbank</span>
              <span className="th-sub">
                Válido del 15/04/26 hasta el 16/04/26 y/o agotar stock
              </span>
            </th>
            <th>
              <span className="th-title">Precio full</span>
              <span className="th-sub">
                Válido del 17/04/26 hasta el 31/08/26 y/o agotar stock
              </span>
            </th>
            <th>
              <span className="th-title">Conadis</span>
              <span className="th-sub">
                Válido del 15/04/26 hasta el 31/08/26 y/o agotar stock
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="sector-cell">
              <div className="sector-wrap">
                <span
                  className="sector-color"
                  style={{ backgroundColor: "#c51c34" }}
                ></span>
                <div>
                  <span className="sector-title">Platinium Central</span>
                  <span className="sector-sub">Asiento numerado</span>
                </div>
              </div>
            </td>
            <td>
              <span className="price-prefix">S/</span>459
              <span className="price-decimals">.00</span>
            </td>
            <td className="price--highlight">
              <span className="price-prefix">S/</span>390
              <span className="price-decimals">.00</span>
            </td>
            <td>
              <span className="price-prefix">S/</span>459
              <span className="price-decimals">.00</span>
            </td>
            <td>----</td>
          </tr>
          <tr>
            <td className="sector-cell">
              <div className="sector-wrap">
                <span
                  className="sector-color"
                  style={{ backgroundColor: "#f5de34" }}
                ></span>
                <div>
                  <span className="sector-title">Plattinum Lateral</span>
                  <span className="sector-sub">Asiento numerado</span>
                </div>
              </div>
            </td>
            <td>
              <span className="price-prefix">S/</span>399
              <span className="price-decimals">.00</span>
            </td>
            <td className="price--highlight">
              <span className="price-prefix">S/</span>340
              <span className="price-decimals">.00</span>
            </td>
            <td>
              <span className="price-prefix">S/</span>399
              <span className="price-decimals">.00</span>
            </td>
            <td>----</td>
          </tr>
          <tr>
            <td className="sector-cell">
              <div className="sector-wrap">
                <span
                  className="sector-color"
                  style={{ backgroundColor: "#efefef" }}
                ></span>
                <div>
                  <span className="sector-title">VIP</span>
                  <span className="sector-sub">Asiento numerado</span>
                </div>
              </div>
            </td>
            <td>
              <span className="price-prefix">S/</span>342
              <span className="price-decimals">.00</span>
            </td>
            <td className="price--highlight">
              <span className="price-prefix">S/</span>290
              <span className="price-decimals">.00</span>
            </td>
            <td>
              <span className="price-prefix">S/</span>342
              <span className="price-decimals">.00</span>
            </td>
            <td>----</td>
          </tr>
          <tr>
            <td className="sector-cell">
              <div className="sector-wrap">
                <span
                  className="sector-color"
                  style={{ backgroundColor: "#f3d631" }}
                ></span>
                <div>
                  <span className="sector-title">Preferencial</span>
                  <span className="sector-sub">Stand up</span>
                </div>
              </div>
            </td>
            <td>
              <span className="price-prefix">S/</span>259
              <span className="price-decimals">.00</span>
            </td>
            <td className="price--highlight">
              <span className="price-prefix">S/</span>220
              <span className="price-decimals">.00</span>
            </td>
            <td>
              <span className="price-prefix">S/</span>259
              <span className="price-decimals">.00</span>
            </td>
            <td>----</td>
          </tr>
          <tr>
            <td className="sector-cell">
              <div className="sector-wrap">
                <span
                  className="sector-color"
                  style={{ backgroundColor: "#292929" }}
                ></span>
                <div>
                  <span className="sector-title">Tribuna Occidente 1</span>
                  <span className="sector-sub">Asiento numerado</span>
                </div>
              </div>
            </td>
            <td>
              <span className="price-prefix">S/</span>399
              <span className="price-decimals">.00</span>
            </td>
            <td className="price--highlight">
              <span className="price-prefix">S/</span>340
              <span className="price-decimals">.00</span>
            </td>
            <td>
              <span className="price-prefix">S/</span>399
              <span className="price-decimals">.00</span>
            </td>
            <td>
              <span className="price-prefix">S/</span>319
              <span className="price-decimals">.00</span>
            </td>
          </tr>
          <tr>
            <td className="sector-cell">
              <div className="sector-wrap">
                <span
                  className="sector-color"
                  style={{ backgroundColor: "#c51c34" }}
                ></span>
                <div>
                  <span className="sector-title">Tribuna Occidente 2</span>
                  <span className="sector-sub">Asiento numerado</span>
                </div>
              </div>
            </td>
            <td>
              <span className="price-prefix">S/</span>342
              <span className="price-decimals">.00</span>
            </td>
            <td className="price--highlight">
              <span className="price-prefix">S/</span>290
              <span className="price-decimals">.00</span>
            </td>
            <td>
              <span className="price-prefix">S/</span>342
              <span className="price-decimals">.00</span>
            </td>
            <td>----</td>
          </tr>
          <tr>
            <td className="sector-cell">
              <div className="sector-wrap">
                <span
                  className="sector-color"
                  style={{ backgroundColor: "#2a2a2a" }}
                ></span>
                <div>
                  <span className="sector-title">Tribuna Oriente 1</span>
                  <span className="sector-sub">Asiento numerado</span>
                </div>
              </div>
            </td>
            <td>
              <span className="price-prefix">S/</span>399
              <span className="price-decimals">.00</span>
            </td>
            <td className="price--highlight">
              <span className="price-prefix">S/</span>340
              <span className="price-decimals">.00</span>
            </td>
            <td>
              <span className="price-prefix">S/</span>399
              <span className="price-decimals">.00</span>
            </td>
            <td>----</td>
          </tr>
          <tr>
            <td className="sector-cell">
              <div className="sector-wrap">
                <span
                  className="sector-color"
                  style={{ backgroundColor: "#c51c34" }}
                ></span>
                <div>
                  <span className="sector-title">Tribuna Oriente 2</span>
                  <span className="sector-sub">Asiento numerado</span>
                </div>
              </div>
            </td>
            <td>
              <span className="price-prefix">S/</span>342
              <span className="price-decimals">.00</span>
            </td>
            <td className="price--highlight">
              <span className="price-prefix">S/</span>290
              <span className="price-decimals">.00</span>
            </td>
            <td>
              <span className="price-prefix">S/</span>342
              <span className="price-decimals">.00</span>
            </td>
            <td>----</td>
          </tr>
          <tr>
            <td className="sector-cell">
              <div className="sector-wrap">
                <span
                  className="sector-color"
                  style={{ backgroundColor: "#262626" }}
                ></span>
                <div>
                  <span className="sector-title">Tribuna Norte</span>
                  <span className="sector-sub">Asiento numerado</span>
                </div>
              </div>
            </td>
            <td>
              <span className="price-prefix">S/</span>142
              <span className="price-decimals">.00</span>
            </td>
            <td className="price--highlight">
              <span className="price-prefix">S/</span>120
              <span className="price-decimals">.00</span>
            </td>
            <td>
              <span className="price-prefix">S/</span>142
              <span className="price-decimals">.00</span>
            </td>
            <td>----</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function Evento3() {
  const { comprarEntrada } = useComprarEntrada();

  return (
    <LayoutPrincipal>
      <img
        src={banner}
        alt="Marron 5 banner"
        className="d-block w-100 object-fit-cover"
      />

      <section className="bs-body-bg-override py-5 px-4">
        <div className="container">
          <TablaPrecios />

          <div className="container">
            <p className="text-center border border-white text-white p-3 rounded-3 fw-bold fs-6">
              La descarga de los E-tickets estará disponible desde 2 días antes
              de la fecha de tu evento o función.
            </p>
          </div>
        </div>
      </section>

      <section className="bs-body-bg-override-yellow">
        <div className="container py-5">
          <h2 className="text-center fw-bold pb-5">
            Obtén tus tickets para ver a MAROON 5 en el Estadio Nacional
          </h2>
          <div className="mx-auto mb-5 container">
            <div className="row row-cols-1 row-cols-md-2 g-3">
              <div className="col">
                <button
                  className="btn btn-outline-dark border-3 w-100 py-4"
                  onClick={() =>
                    comprarEntrada({
                      evento: "MAROON 5 en el Estadio Nacional",
                      fecha: "25 Mayo 2026",
                      lugar: "Estadio Nacional",
                      zona: "Tribuna Oriente 1",
                      tipo: "Preventa fans",
                      precio: 342,
                    })
                  }
                >
                  Preventa fans
                </button>
              </div>
              <div className="col">
                <button
                  className="btn btn-outline-dark border-3 w-100 py-4"
                  onClick={() =>
                    comprarEntrada({
                      evento: "MAROON 5 en el Estadio Nacional",
                      fecha: "25 Mayo 2026",
                      lugar: "Estadio Nacional",
                      zona: "Tribuna Oriente 2",
                      tipo: "Preventa Interbank",
                      precio: 290,
                    })
                  }
                >
                  Preventa Interbank
                </button>
              </div>
              <div className="col">
                <button
                  className="btn btn-outline-dark border-3 w-100 py-4"
                  onClick={() =>
                    comprarEntrada({
                      evento: "MAROON 5 en el Estadio Nacional",
                      fecha: "25 Mayo 2026",
                      lugar: "Estadio Nacional",
                      zona: "Tribuna Oriente 3",
                      tipo: "Precio full",
                      precio: 342,
                    })
                  }
                >
                  Precio full
                </button>
              </div>
              <div className="col">
                <button
                  className="btn btn-outline-dark border-3 w-100 py-4"
                  onClick={() =>
                    comprarEntrada({
                      evento: "MAROON 5 en el Estadio Nacional",
                      fecha: "25 Mayo 2026",
                      lugar: "Estadio Nacional",
                      zona: "Tribuna Oriente 4",
                      tipo: "Conadis",
                      precio: 120,
                    })
                  }
                >
                  Conadis
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bs-body-bg-override py-5 px-4">
        <div className="container container-fluid px-5 py-5 text-center">
          <img src={eventoSinFondo} alt="" className="img-fluid" />
          <p>
            Maroon 5 regresó triunfalmente a Lima con su "Love Is Like Tour",
            apoderándose del Estadio Nacional en una noche electrizante.
            Liderados por un Adam Levine impecable, la banda fusionó sus grandes
            éxitos con una producción visual de vanguardia que hizo vibrar cada
            rincón del coloso. Desde los primeros acordes, el sonido impecable y
            la energía de los californianos transformaron el estadio en una
            celebración masiva del pop-rock global.
          </p>

          <p>
            El setlist fue un viaje de hits ininterrumpidos donde clásicos como
            "She Will Be Loved" desataron la euforia colectiva. El cierre
            explosivo con "Sugar" y "Moves Like Jagger" convirtió la cancha en
            una pista de baile gigante, reafirmando la vigencia de la banda y su
            conexión especial con el público peruano. Fue un espectáculo de
            primer nivel que dejó claro por qué siguen siendo referentes
            mundiales de la música.
          </p>
        </div>
      </section>
    </LayoutPrincipal>
  );
}
