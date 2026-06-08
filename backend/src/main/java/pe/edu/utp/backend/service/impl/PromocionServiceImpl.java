package pe.edu.utp.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pe.edu.utp.backend.dto.*;
import pe.edu.utp.backend.entity.Promocion;
import pe.edu.utp.backend.repository.PromocionRepository;
import pe.edu.utp.backend.service.PromocionService;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PromocionServiceImpl
        implements PromocionService {

    private final PromocionRepository promocionRepository;

    @Override
    public PromocionDTO crearPromocion(
            PromocionRequest request) {

        if (request.getCodigo() == null
                || request.getCodigo().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El código de la promoción es obligatorio");
        }

        if (promocionRepository.existsByCodigo(
                request.getCodigo())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "El código ya existe");
        }

        if (request.getFechaInicio() == null
                || request.getFechaFin() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha inicio y la fecha fin son obligatorias");
        }

        if (request.getFechaFin()
                .isBefore(request.getFechaInicio())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha fin no puede ser menor que la fecha inicio");
        }

        String estado = request.getEstado();
        if (estado == null || estado.isBlank()) {
            estado = "ACTIVA";
        }

        System.out.println("========== DEBUG ==========");
        System.out.println("Codigo: " + request.getCodigo());
        System.out.println("Stock: " + request.getStockDisponible());
        System.out.println("Maximo usos: " + request.getMaximoUsos());
        System.out.println("===========================");

        Promocion promocion = Promocion.builder()
                .codigo(request.getCodigo())
                .descuentoPorcentaje(
                        request.getDescuentoPorcentaje())
                .fechaCreacion(LocalDate.now())
                .fechaInicio(
                        request.getFechaInicio())
                .fechaFin(
                        request.getFechaFin())
                .maximoUsos(
                        request.getMaximoUsos())
                .stockDisponible(
                        request.getStockDisponible())
                .cantidadUsos(0)
                .estado(estado)
                .build();

        promocion = promocionRepository.save(promocion);

        return convertirDTO(promocion);
    }

    @Override
    public List<PromocionDTO> listarPromociones() {

        return promocionRepository.findAll()
                .stream()
                .map(this::convertirDTO)
                .toList();
    }

    @Override
    public PromocionDTO obtenerPromocion(Integer id) {

        Promocion promocion = promocionRepository.findById(id)
                .orElseThrow();

        return convertirDTO(promocion);
    }

    @Override
    public PromocionDTO actualizarPromocion(
            Integer id,
            PromocionRequest request) {

        Promocion promocion = promocionRepository.findById(id)
                .orElseThrow();

        promocion.setCodigo(
                request.getCodigo());

        promocion.setDescuentoPorcentaje(
                request.getDescuentoPorcentaje());

        promocion.setFechaInicio(
                request.getFechaInicio());

        promocion.setFechaFin(
                request.getFechaFin());

        promocion.setMaximoUsos(
                request.getMaximoUsos());

        promocion.setStockDisponible(
                request.getStockDisponible());

        promocion.setEstado(
                request.getEstado());

        promocion = promocionRepository.save(promocion);

        return convertirDTO(promocion);
    }

    @Override
    public void eliminarPromocion(Integer id) {

        promocionRepository.deleteById(id);

    }

    @Override
    public PromocionResponse validarPromocion(
            String codigo) {

        var promo = promocionRepository
                .findByCodigo(codigo);

        if (promo.isEmpty()) {

            return new PromocionResponse(
                    false,
                    "Código inexistente",
                    null);
        }

        Promocion p = promo.get();

        LocalDate hoy = LocalDate.now();

        if (hoy.isBefore(p.getFechaInicio())
                || hoy.isAfter(p.getFechaFin())) {

            return new PromocionResponse(
                    false,
                    "Promoción vencida",
                    null);
        }

        if (p.getStockDisponible() == null || p.getStockDisponible() <= 0) {

            return new PromocionResponse(
                    false,
                    "Promoción sin stock",
                    null);
        }

        if (p.getCantidadUsos() >= p.getMaximoUsos()) {

            return new PromocionResponse(
                    false,
                    "Promoción agotada",
                    null);
        }

        return new PromocionResponse(
                true,
                "Promoción válida",
                p.getDescuentoPorcentaje());
    }

    @Override
    public PromocionResponse aplicarPromocion(
            String codigo) {

        var promo = promocionRepository
                .findByCodigo(codigo);

        if (promo.isEmpty()) {
            return new PromocionResponse(
                    false,
                    "Código inexistente",
                    null);
        }

        Promocion p = promo.get();
        LocalDate hoy = LocalDate.now();

        if (hoy.isBefore(p.getFechaInicio())
                || hoy.isAfter(p.getFechaFin())) {

            return new PromocionResponse(
                    false,
                    "Promoción vencida",
                    null);
        }

        if (p.getStockDisponible() == null || p.getStockDisponible() <= 0) {
            return new PromocionResponse(
                    false,
                    "Promoción sin stock",
                    null);
        }

        if (p.getCantidadUsos() >= p.getMaximoUsos()) {

            return new PromocionResponse(
                    false,
                    "Promoción agotada",
                    null);
        }

        p.setCantidadUsos(p.getCantidadUsos() + 1);
        p.setStockDisponible(p.getStockDisponible() - 1);
        promocionRepository.save(p);

        return new PromocionResponse(
                true,
                "Promoción aplicada",
                p.getDescuentoPorcentaje());
    }

    private PromocionDTO convertirDTO(
            Promocion promocion) {

        PromocionDTO dto = new PromocionDTO();

        dto.setIdPromocion(
                promocion.getIdPromocion());

        dto.setCodigo(
                promocion.getCodigo());

        dto.setDescuentoPorcentaje(
                promocion.getDescuentoPorcentaje());

        dto.setFechaInicio(
                promocion.getFechaInicio());

        dto.setFechaFin(
                promocion.getFechaFin());

        dto.setEstado(
                promocion.getEstado());

        dto.setCantidadUsos(
                promocion.getCantidadUsos());

        dto.setMaximoUsos(
                promocion.getMaximoUsos());

        dto.setStockDisponible(
                promocion.getStockDisponible());

        dto.setDescripcion(
                promocion.getDescripcion());

        dto.setFechaCreacion(
                promocion.getFechaCreacion());

        return dto;
    }
}