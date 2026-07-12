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

public class Zona {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id_zona;

    @Column(length = 50, nullable = false)
    @NotBlank
    @Size(max = 50)
    private String nombre_zona;

    @Min(0)
    private Integer capacidad;

    @Column(length = 30)
    @Size(max = 30)
    private String estado;

    @ManyToOne
    @JoinColumn(name = "id_lugar")
    private Lugar lugar;
}