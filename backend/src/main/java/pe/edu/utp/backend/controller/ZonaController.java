package pe.edu.utp.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pe.edu.utp.backend.entity.Zona;
import pe.edu.utp.backend.service.ZonaService;

import java.util.List;

@RestController
@RequestMapping("/api/zonas")
@RequiredArgsConstructor
public class ZonaController {

    private final ZonaService zonaService;

    @GetMapping
    public List<Zona> listar() {
        return zonaService.listar();
    }

    @GetMapping("/lugar/{idLugar}")
    public List<Zona> listarPorLugar(@PathVariable Long idLugar) {
        return zonaService.listarPorLugar(idLugar);
    }

    @GetMapping("/{id}")
    public Zona buscarPorId(@PathVariable Long id) {
        return zonaService.buscarPorId(id);
    }

    @PostMapping
    public Zona guardar(@RequestBody Zona zona) {
        return zonaService.guardar(zona);
    }

    @PutMapping("/{id}")
    public Zona actualizar(
            @PathVariable Long id,
            @RequestBody Zona zona) {
        return zonaService.actualizar(id, zona);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        zonaService.eliminar(id);
    }
}