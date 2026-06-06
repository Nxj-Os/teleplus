package pe.edu.utp.backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PromocionDTO {

    private Integer idPromocion;

    private String codigo;

    private BigDecimal descuentoPorcentaje;

    private LocalDate fechaInicio;

    private LocalDate fechaFin;

    private String estado;

    private Integer cantidadUsos;

    private Integer maximoUsos;

    private Integer stockDisponible;

    private String descripcion;

    private LocalDate fechaCreacion;
}