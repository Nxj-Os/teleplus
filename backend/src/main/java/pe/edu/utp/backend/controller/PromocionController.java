package pe.edu.utp.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import pe.edu.utp.backend.dto.PromocionDTO;
import pe.edu.utp.backend.dto.PromocionRequest;
import pe.edu.utp.backend.dto.PromocionResponse;
import pe.edu.utp.backend.service.PromocionService;

import java.util.List;

@RestController
@RequestMapping("/api/promociones")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class PromocionController {

    private final PromocionService service;

    @GetMapping
    public ResponseEntity<List<PromocionDTO>> listarPromociones() {

        return ResponseEntity.ok(
                service.listarPromociones());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PromocionDTO> obtenerPromocion(
            @PathVariable Integer id) {

        return ResponseEntity.ok(
                service.obtenerPromocion(id));
    }

    @PostMapping
    public ResponseEntity<PromocionDTO> crearPromocion(
            @Valid @RequestBody PromocionRequest request) {

        return ResponseEntity.ok(
                service.crearPromocion(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PromocionDTO> actualizarPromocion(
            @PathVariable Integer id,
            @Valid @RequestBody PromocionRequest request) {

        return ResponseEntity.ok(
                service.actualizarPromocion(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminarPromocion(
            @PathVariable Integer id) {

        service.eliminarPromocion(id);

        return ResponseEntity.ok(
                "Promoción eliminada correctamente");
    }

    @PostMapping("/validar")
    public ResponseEntity<PromocionResponse> validarPromocion(
            @RequestBody PromocionRequest request) {

        return ResponseEntity.ok(
                service.validarPromocion(
                        request.getCodigo()));
    }

    @PostMapping("/aplicar")
    public ResponseEntity<PromocionResponse> aplicarPromocion(
            @RequestBody PromocionRequest request) {

        return ResponseEntity.ok(
                service.aplicarPromocion(
                        request.getCodigo()));
    }
}