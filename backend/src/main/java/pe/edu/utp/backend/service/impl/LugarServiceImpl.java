package pe.edu.utp.backend.service.impl;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

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

        return repository.save(lugar);
    }

    @Override
    public Lugar actualizar(
            Long id,
            Lugar nuevo) {

        Lugar actual = repository.findById(id).orElseThrow();

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