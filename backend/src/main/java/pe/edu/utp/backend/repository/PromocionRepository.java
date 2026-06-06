package pe.edu.utp.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.edu.utp.backend.entity.Promocion;

@Repository
public interface PromocionRepository extends JpaRepository<Promocion, Integer> {
    Optional<Promocion> findByCodigo(String codigo);

    boolean existsByCodigo(String codigo);
}
