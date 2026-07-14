package pe.edu.utp.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import pe.edu.utp.backend.entity.Lugar;

import pe.edu.utp.backend.service.LugarService;

import java.util.List;

@RestController

@RequestMapping("/api/lugares")

@RequiredArgsConstructor

public class LugarController {

    private final LugarService service;

    @GetMapping
    public List<Lugar> listar() {

        return service.listar();
    }

    @GetMapping("/{id}")
    public Lugar buscarPorId(
            @PathVariable Long id) {

        return service.buscarPorId(id);
    }

    @PostMapping
    public Lugar guardar(
            @Valid @RequestBody Lugar lugar) {

        return service.guardar(lugar);
    }

    @PutMapping("/{id}")
    public Lugar actualizar(
            @PathVariable Long id,

            @RequestBody Lugar lugar) {

        return service.actualizar(id, lugar);
    }

    @DeleteMapping("/{id}")
    public void eliminar(
            @PathVariable Long id) {

        service.eliminar(id);
    }
}