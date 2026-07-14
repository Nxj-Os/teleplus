package pe.edu.utp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pe.edu.utp.backend.entity.Zona;

import java.util.List;

@Repository
public interface ZonaRepository extends JpaRepository<Zona, Long> {

    @Query("SELECT z FROM Zona z WHERE z.lugar.id_lugar = :idLugar")
    List<Zona> buscarZonasPorLugar(@Param("idLugar") Long idLugar);

    @Query("SELECT COUNT(z) > 0 FROM Zona z WHERE LOWER(z.nombre_zona) = LOWER(:nombreZona) AND z.lugar.id_lugar = :idLugar")
    boolean existeZonaDuplicadaEnLugar(@Param("nombreZona") String nombreZona, @Param("idLugar") Long idLugar);

    @Query("SELECT COUNT(z) > 0 FROM Zona z WHERE LOWER(z.nombre_zona) = LOWER(:nombreZona) AND z.lugar IS NULL")
    boolean existeZonaDuplicadaSinLugar(@Param("nombreZona") String nombreZona);
}
