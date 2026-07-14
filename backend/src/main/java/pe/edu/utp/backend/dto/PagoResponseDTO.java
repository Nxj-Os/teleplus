package pe.edu.utp.backend.dto;

public record PagoResponseDTO(
    boolean aprobado,
    String mensaje,
    String codigoTransaccion
) {}
