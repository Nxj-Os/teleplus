package pe.edu.utp.backend.entity;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "entradas")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Entrada {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id_entrada;

    @Column(name = "codigo_qr", unique = true)
    @NotBlank
    @Size(max = 255)
    private String codigo_qr;

    @Column(length = 30)
    @Size(max = 30)
    private String estado;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    private Float precio_final;

    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fecha_generacion;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") 
    private LocalDateTime reservado_hasta;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    @NotNull
    private Usuario usuario;
    
    @ManyToOne
    @JoinColumn(name = "id_evento_zona_precio")
    @NotNull
    private EventoZonaPrecio eventoZonaPrecio;
}
