package pe.edu.utp.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
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
    private LocalDate fecha_generacion;

    @FutureOrPresent
    private LocalDateTime reservado_hasta;
}
