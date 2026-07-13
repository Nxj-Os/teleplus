package pe.edu.utp.backend.repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pe.edu.utp.backend.entity.Entrada;
@Repository
public interface EntradaRepository extends JpaRepository<Entrada, Long> {
    @Query("SELECT e FROM Entrada e WHERE e.usuario.id_usuario = :id")
    List<Entrada> buscarPorUsuario(@Param("id") Long id);
}