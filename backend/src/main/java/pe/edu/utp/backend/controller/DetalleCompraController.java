package pe.edu.utp.backend.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import pe.edu.utp.backend.entity.DetalleCompra;

import pe.edu.utp.backend.service.DetalleCompraService;

import java.util.List;

@RestController

@RequestMapping("/api/detalle-compra")

@RequiredArgsConstructor

public class DetalleCompraController {

    private final DetalleCompraService service;

    @GetMapping
    public List<DetalleCompra> listar() {

        return service.listar();
    }

    @GetMapping("/{id}")
    public DetalleCompra buscarPorId(
            @PathVariable Long id) {

        return service.buscarPorId(id);
    }

    @PostMapping
    public DetalleCompra guardar(
            @RequestBody DetalleCompra detalleCompra) {

        return service.guardar(detalleCompra);
    }

    @PutMapping("/{id}")
    public DetalleCompra actualizar(
            @PathVariable Long id,

            @RequestBody DetalleCompra detalleCompra) {

        return service.actualizar(id, detalleCompra);
    }

    @DeleteMapping("/{id}")
    public void eliminar(
            @PathVariable Long id) {

        service.eliminar(id);
    }
}