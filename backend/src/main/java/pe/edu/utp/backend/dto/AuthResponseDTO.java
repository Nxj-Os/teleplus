package pe.edu.utp.backend.dto;

public record AuthResponseDTO(
        String token,
        Long id,
        String nombre,
        String correo,
        String rol
) {}
