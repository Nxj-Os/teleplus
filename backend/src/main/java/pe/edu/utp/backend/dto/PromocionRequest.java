package pe.edu.utp.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class PromocionRequest {

    @NotBlank(message = "El código es obligatorio")
    @Size(max = 50)
    private String codigo;

    @NotNull(message = "El descuento es obligatorio")
    @DecimalMin(value = "1.0", message = "El descuento mínimo es 1%")
    @DecimalMax(value = "100.0", message = "El descuento máximo es 100%")
    private BigDecimal descuentoPorcentaje;

    @NotNull(message = "La fecha inicio es obligatoria")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate fechaInicio;

    @NotNull(message = "La fecha fin es obligatoria")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate fechaFin;

    @NotNull(message = "Debe indicar el máximo de usos")
    @Min(value = 1, message = "Debe permitir al menos 1 uso")
    private Integer maximoUsos;

    @NotNull(message = "El stock disponible es obligatorio")
    @Min(value = 1, message = "El stock disponible debe ser al menos 1")
    private Integer stockDisponible;

    private String estado;
}