package pe.edu.utp.backend.dto;

public record CambiarContrasenaDTO(
    String contrasenaActual,
    String nuevaContrasena,
    String confirmarContrasena
) {}
