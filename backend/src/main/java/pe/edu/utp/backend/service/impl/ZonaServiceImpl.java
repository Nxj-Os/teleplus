package pe.edu.utp.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.utp.backend.entity.Lugar;
import pe.edu.utp.backend.entity.Zona;
import pe.edu.utp.backend.repository.LugarRepository;
import pe.edu.utp.backend.repository.ZonaRepository;
import pe.edu.utp.backend.service.ZonaService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ZonaServiceImpl implements ZonaService {

    private final ZonaRepository zonaRepository;
    private final LugarRepository lugarRepository;

    @Override
    public List<Zona> listar() {
        return zonaRepository.findAll();
    }

    @Override
    public List<Zona> listarPorLugar(Long idLugar) {
        return zonaRepository.findZonasByLugarId(idLugar);
    }

    @Override
    public Zona buscarPorId(Long id) {
        return zonaRepository.findById(id).orElse(null);
    }

    @Override
    public Zona guardar(Zona zona) {
        if (zona.getLugar() != null && zona.getLugar().getId_lugar() != null) {
            Lugar lugar = lugarRepository.findById(zona.getLugar().getId_lugar()).orElseThrow();
            zona.setLugar(lugar);
        }
        return zonaRepository.save(zona);
    }

    @Override
    public Zona actualizar(Long id, Zona nueva) {
        Zona actual = zonaRepository.findById(id).orElseThrow();

        actual.setNombre_zona(nueva.getNombre_zona());
        actual.setCapacidad(nueva.getCapacidad());
        actual.setEstado(nueva.getEstado());

        if (nueva.getLugar() != null && nueva.getLugar().getId_lugar() != null) {
            Lugar lugar = lugarRepository.findById(nueva.getLugar().getId_lugar()).orElseThrow();
            actual.setLugar(lugar);
        }

        return zonaRepository.save(actual);
    }

    @Override
    public void eliminar(Long id) {
        zonaRepository.deleteById(id);
    }
}