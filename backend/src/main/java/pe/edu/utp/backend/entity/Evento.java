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

public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id_evento;

    @Column(length = 150, nullable = false)
    @NotBlank
    @Size(max = 150)
    private String titulo;

    @Size(max = 2000)
    private String descripcion;

    @NotNull
    private LocalDate fecha_evento;

    @NotNull
    private LocalTime hora_evento;

    @Size(max = 255)
    private String imagen;

    @Column(length = 30)
    @Size(max = 30)
    private String estado;

    @PastOrPresent
    private LocalDateTime fecha_creacion;

    @ManyToOne

    @JoinColumn(name = "id_lugar")

    @NotNull
    private Lugar lugar;
}