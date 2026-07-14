package pe.edu.utp.backend.dto;

public record PagoRequestDTO(
    String metodoPago,
    Double monto,
    String numeroTarjeta,
    String vencimiento,
    String cvv,
    String celular
) {}
