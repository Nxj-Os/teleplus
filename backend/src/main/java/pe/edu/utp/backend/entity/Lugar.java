package pe.edu.utp.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Lugar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_lugar;

    @Column(length = 150)
    @NotBlank
    @Size(max = 150)
    private String nombre;

    @Column(length = 150)
    @NotBlank
    @Size(max = 150)
    private String direccion;

    @Column(length = 150)
    @NotBlank
    @Size(max = 150)
    private String ciudad;

    @NotNull
    @Min(0)
    private Integer capacidad_total;
}
