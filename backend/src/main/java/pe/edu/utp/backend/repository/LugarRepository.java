package pe.edu.utp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import pe.edu.utp.backend.entity.Lugar;

public interface LugarRepository
        extends JpaRepository<Lugar, Long> {

    boolean existsByNombreIgnoreCase(String nombre);
}