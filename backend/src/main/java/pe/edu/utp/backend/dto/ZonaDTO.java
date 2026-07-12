package pe.edu.utp.backend.dto;

import lombok.Data;

@Data
public class ZonaDTO {

    private Long id_zona;

    private String nombre_zona;

    private Integer capacidad;

    private String estado;

    private Long id_lugar;
}