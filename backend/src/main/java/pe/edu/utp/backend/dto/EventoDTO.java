package pe.edu.utp.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import lombok.Data;

@Data
public class EventoDTO {

    private Long id_evento;

    private String titulo;

    private String descripcion;

    private LocalDate fecha_evento;

    private LocalTime hora_evento;

    private String imagenCarrusel;

    private String imagenPortada;

    private String imagenDetalle;

    private String imagenFooter;

    private String imagenMapa;

    private String estado;

    private LocalDateTime fecha_creacion;

    private Long id_lugar;
}