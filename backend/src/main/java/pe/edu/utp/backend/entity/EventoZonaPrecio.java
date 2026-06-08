package pe.edu.utp.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

import java.time.LocalDateTime;

@Entity

@Table(name = "evento_zona_precio")

@AllArgsConstructor
@NoArgsConstructor
@Data

public class EventoZonaPrecio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    // PREVENTA - FULL - INTERBANK
    @NotBlank
    @Size(max = 50)
    private String tipoPrecio;

    // PRECIO DE LA ENTRADA
    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal precio;

    // STOCK TOTAL
    @NotNull
    @Min(0)
    private Integer stock;

    // STOCK DISPONIBLE
    @NotNull
    @Min(0)
    private Integer stockDisponible;

    // SI ESTÁ ACTIVO
    @NotNull
    private Boolean activo;

    // FECHA INICIO VENTA
    @NotNull
    private LocalDateTime fechaInicio;

    // FECHA FIN VENTA
    @NotNull
    private LocalDateTime fechaFin;

    // EVENTO
    @ManyToOne

    @JoinColumn(name = "id_evento")

    @NotNull
    private Evento evento;

    // ZONA
    @ManyToOne

    @JoinColumn(name = "id_zona")

    @NotNull
    private Zona zona;
}