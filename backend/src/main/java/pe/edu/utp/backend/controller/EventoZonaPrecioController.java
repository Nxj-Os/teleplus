package pe.edu.utp.backend.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import pe.edu.utp.backend.entity.EventoZonaPrecio;

import pe.edu.utp.backend.service.EventoZonaPrecioService;

import java.util.List;

@RestController

@RequestMapping("/api/evento-zona-precio")

@RequiredArgsConstructor

public class EventoZonaPrecioController {

    private final EventoZonaPrecioService service;

    @GetMapping
    public List<EventoZonaPrecio> listar() {

        return service.listar();
    }

    @GetMapping("/evento/{eventoId}")
    public List<EventoZonaPrecio> listarPorEvento(
            @PathVariable Long eventoId) {

        return service.listarPorEvento(eventoId);
    }

    @GetMapping("/{id}")
    public EventoZonaPrecio buscarPorId(
            @PathVariable Long id) {

        return service.buscarPorId(id);
    }

    @PostMapping
    public EventoZonaPrecio guardar(
            @RequestBody EventoZonaPrecio eventoZonaPrecio) {

        return service.guardar(eventoZonaPrecio);
    }

    @PutMapping("/{id}")
    public EventoZonaPrecio actualizar(
            @PathVariable Long id,

            @RequestBody EventoZonaPrecio eventoZonaPrecio) {

        return service.actualizar(id, eventoZonaPrecio);
    }

    @DeleteMapping("/{id}")
    public void eliminar(
            @PathVariable Long id) {

        service.eliminar(id);
    }
}