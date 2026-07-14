package pe.edu.utp.backend.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import pe.edu.utp.backend.entity.Compra;
import pe.edu.utp.backend.entity.Entrada;
import pe.edu.utp.backend.service.CompraService;

@RestController
@RequestMapping("/api/compra")
public class CompraController {
    @Autowired
    private CompraService compraService;

    @PostMapping
    public ResponseEntity<Compra> crearCompra(@Valid @RequestBody Compra compra) {
        return ResponseEntity.status(HttpStatus.CREATED).body(compraService.Newcompra(compra));
    }
    @PutMapping("/{id}")
    public ResponseEntity<Compra> actualizarCompra(@PathVariable Long id, @RequestBody Compra compra) {
        return ResponseEntity.ok(compraService.actualizarCompra(id, compra));
    }
    @PatchMapping("/entrada/{id}")
    public ResponseEntity<Entrada> actualizarEstadoEntrada(
            @PathVariable Long id, 
            @RequestParam String estado) {
        return ResponseEntity.ok(compraService.actualizarEntrada(id, estado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        compraService.DeleteCompra(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/{id}")
	public ResponseEntity<Compra> compraPorid(@PathVariable Long id) {
		return ResponseEntity.of(compraService.compraPorId(id));
	}
    @GetMapping
	public ResponseEntity<List<Compra>> obtenerTodos() {
		return ResponseEntity.ok(compraService.listcompras());
	}
	}
