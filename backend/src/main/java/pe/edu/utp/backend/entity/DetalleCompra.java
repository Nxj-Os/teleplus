package pe.edu.utp.backend.entity;

import java.math.BigDecimal;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class DetalleCompra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_detalle;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal precio_unitario;

    @NotNull
    @Min(1)
    private Integer cantidad;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    private BigDecimal subtotal;

    @ManyToOne
    @JoinColumn(name = "id_compra")
    @NotNull
    private Compra compra;

    @ManyToOne
    @JoinColumn(name = "id_evento_zona_precio")

    @NotNull
    private EventoZonaPrecio eventoZonaPrecio;

}
