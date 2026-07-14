package pe.edu.utp.backend.service;

import pe.edu.utp.backend.dto.PromocionDTO;
import pe.edu.utp.backend.dto.PromocionRequest;
import pe.edu.utp.backend.dto.PromocionResponse;
import java.util.List;

public interface PromocionService {

    PromocionDTO crearPromocion(PromocionRequest request);

    List<PromocionDTO> listarPromociones();

    PromocionDTO obtenerPromocion(Integer id);

    PromocionDTO actualizarPromocion(
            Integer id,
            PromocionRequest request);

    void eliminarPromocion(Integer id);

    PromocionResponse validarPromocion(String codigo);

    PromocionResponse aplicarPromocion(String codigo);

}