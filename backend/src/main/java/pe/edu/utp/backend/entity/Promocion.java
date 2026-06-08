package pe.edu.utp.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "promociones")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Promocion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_promocion")
    private Integer idPromocion;

    @Column(nullable = false, unique = true, length = 50)
    @NotBlank
    @Size(max = 50)
    private String codigo;

    @Column(nullable = false, precision = 5, scale = 2)
    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    @DecimalMax(value = "100.0", inclusive = true)
    private BigDecimal descuentoPorcentaje;

    @Column(nullable = false)
    @NotNull
    private LocalDate fechaInicio;

    @Column(nullable = false)
    @NotNull
    private LocalDate fechaFin;

    @Column(nullable = false, length = 20)
    @NotBlank
    @Size(max = 20)
    private String estado;

    @Column(nullable = false)
    @NotNull
    @Min(0)
    private Integer cantidadUsos = 0;

    @Column(nullable = false)
    @NotNull
    @Min(0)
    private Integer maximoUsos;

    @Column(length = 200)
    private String descripcion;

    @Column(nullable = false)
    @NotNull
    @Min(0)
    private Integer stockDisponible;

    @Column(nullable = false)
    private LocalDate fechaCreacion;
}