package pe.edu.utp.backend.service.impl;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import pe.edu.utp.backend.entity.Lugar;

import pe.edu.utp.backend.repository.LugarRepository;

import pe.edu.utp.backend.service.LugarService;

import java.util.List;

@Service
@RequiredArgsConstructor

public class LugarServiceImpl
        implements LugarService {

    private final LugarRepository repository;

    @Override
    public List<Lugar> listar() {

        return repository.findAll();
    }

    @Override
    public Lugar buscarPorId(Long id) {

        return repository.findById(id).orElse(null);
    }

    @Override
    public Lugar guardar(Lugar lugar) {

        if (repository.existsByNombreIgnoreCase(lugar.getNombre())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe un lugar con ese nombre");
        }

        return repository.save(lugar);
    }

    @Override
    public Lugar actualizar(
            Long id,
            Lugar nuevo) {

        Lugar actual = repository.findById(id).orElseThrow();

        if (repository.existsByNombreIgnoreCase(nuevo.getNombre())
                && !actual.getNombre().equalsIgnoreCase(nuevo.getNombre())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe un lugar con ese nombre");
        }

        actual.setNombre(nuevo.getNombre());

        actual.setDireccion(nuevo.getDireccion());

        actual.setCiudad(nuevo.getCiudad());

        actual.setCapacidad_total(
                nuevo.getCapacidad_total());

        actual.setLatitud(nuevo.getLatitud());

        actual.setLongitud(nuevo.getLongitud());

        return repository.save(actual);
    }

    @Override
    public void eliminar(Long id) {

        repository.deleteById(id);
    }
}