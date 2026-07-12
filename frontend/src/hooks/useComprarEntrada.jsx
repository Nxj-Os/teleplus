import { useNavigate } from "react-router-dom";

export const useComprarEntrada = () => {
  const navigate = useNavigate();

  const comprarEntrada = ({ evento, fecha, lugar, zona, tipo, precio, idEventoZonaPrecio }) => {
    navigate("/compras", {
      state: {
        evento,
        fecha,
        lugar,
        zona,
        tipo,
        precio,
        idEventoZonaPrecio,
      },
    });
  };
  return { comprarEntrada };
};
