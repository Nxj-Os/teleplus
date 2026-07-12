package pe.edu.utp.backend.service;

import pe.edu.utp.backend.entity.Zona;

import java.util.List;

public interface ZonaService {

    List<Zona> listar();

    List<Zona> listarPorLugar(Long idLugar);

    Zona buscarPorId(Long id);

    Zona guardar(Zona zona);

    Zona actualizar(Long id, Zona zona);

    void eliminar(Long id);
}