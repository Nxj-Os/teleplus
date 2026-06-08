package pe.edu.utp.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Compra {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_compra;

    @NotNull
    private LocalDate fecha_compra;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    private Double total;

    @Column(length = 20)
    @Size(max = 20)
    private String estado;

    @ManyToMany
    private Set<Usuario> usuarios;

    @ManyToOne
    @JoinColumn(name = "id_promocion")
    private Promocion promocion;
}
