package pe.edu.utp.backend.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import pe.edu.utp.backend.entity.Pago;
import pe.edu.utp.backend.service.PagoService;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    @Autowired
    private PagoService pagoService;

    @PostMapping
    public ResponseEntity<Pago> crearpago(@RequestBody Pago pago) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pagoService.guardarpago(pago));
    }
    @GetMapping("/{id}")
    public ResponseEntity<Pago> getId(@PathVariable Long id) {
        return ResponseEntity.of(pagoService.getId(id));
    }
    @GetMapping
    public ResponseEntity<List<Pago>> getall() {
        return ResponseEntity.ok(pagoService.getall());
    }
}