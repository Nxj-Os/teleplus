package pe.edu.utp.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import pe.edu.utp.backend.entity.Rol;
import pe.edu.utp.backend.repository.RolRepository;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RolController {

    @Autowired
    private RolRepository repository;

    // ===== LISTAR =====
    @GetMapping
    public List<Rol> listar() {
        return repository.findAll();
    }

    // ===== BUSCAR POR ID =====
    @GetMapping("/{id}")
    public Rol obtener(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    // ===== CREAR =====
    @PostMapping
    public Rol guardar(@RequestBody Rol rol) {
        return repository.save(rol);
    }

    // ===== ACTUALIZAR =====
    @PutMapping("/{id}")
    public Rol actualizar(
            @PathVariable Long id,
            @RequestBody Rol rol
    ) {

        Rol actual =
                repository.findById(id).orElse(null);

        if (actual != null) {

            actual.setNombreRol(
                    rol.getNombreRol()
            );

            return repository.save(actual);
        }

        return null;
    }

    // ===== ELIMINAR =====
    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        repository.deleteById(id);
    }
}