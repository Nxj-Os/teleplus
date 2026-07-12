package pe.edu.utp.backend.dto;

import lombok.Data;

@Data
public class LugarDTO {

    private Long id_lugar;

    private String nombre;

    private String direccion;

    private String ciudad;

    private Integer capacidad_total;

    private Double latitud;

    private Double longitud;
}