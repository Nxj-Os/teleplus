package pe.edu.utp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import pe.edu.utp.backend.entity.EventoZonaPrecio;

import java.util.List;

public interface EventoZonaPrecioRepository
        extends JpaRepository<EventoZonaPrecio, Long> {

    @Query("SELECT ezp FROM EventoZonaPrecio ezp WHERE ezp.evento.id_evento = :eventoId")
    List<EventoZonaPrecio> findByEventoId(@Param("eventoId") Long eventoId);
}