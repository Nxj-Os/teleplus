package pe.edu.utp.backend.dto;

import lombok.Data;

@Data
public class PagoDTO {
    private String metodoPago;
    private Double monto;
    private String estado;
    private String codigoTransaccion;
    private Long idCompra;
}
