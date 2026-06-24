package pe.edu.utp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import pe.edu.utp.backend.entity.DetalleCompra;

import java.util.List;

@Repository
public interface DetalleCompraRepository extends JpaRepository<DetalleCompra, Long> {

    @Query("SELECT dc FROM DetalleCompra dc WHERE dc.eventoZonaPrecio.id = :ezpId")
    List<DetalleCompra> findByEventoZonaPrecioId(@Param("ezpId") Long ezpId);
}
