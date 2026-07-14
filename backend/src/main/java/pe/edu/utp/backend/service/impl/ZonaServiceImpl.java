package pe.edu.utp.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
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

    private boolean existeZonaDuplicada(String nombreZona, Long idLugar, Long excludeId) {
        boolean duplicada;
        if (idLugar != null) {
            duplicada = zonaRepository.existsByNombreZonaAndLugarId(nombreZona, idLugar);
        } else {
            duplicada = zonaRepository.existsByNombreZonaAndLugarIsNull(nombreZona);
        }
        if (duplicada && excludeId != null) {
            Zona existente = zonaRepository.findAll().stream()
                    .filter(z -> z.getNombre_zona().equalsIgnoreCase(nombreZona)
                            && ((idLugar != null && idLugar.equals(z.getLugar() != null ? z.getLugar().getId_lugar() : null))
                                || (idLugar == null && z.getLugar() == null)))
                    .filter(z -> !z.getId_zona().equals(excludeId))
                    .findFirst().orElse(null);
            return existente != null;
        }
        return duplicada;
    }

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

        Long idLugar = zona.getLugar() != null ? zona.getLugar().getId_lugar() : null;
        if (existeZonaDuplicada(zona.getNombre_zona(), idLugar, null)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe una zona con ese nombre en ese lugar");
        }

        return zonaRepository.save(zona);
    }

    @Override
    public Zona actualizar(Long id, Zona nueva) {
        Zona actual = zonaRepository.findById(id).orElseThrow();

        if (nueva.getLugar() != null && nueva.getLugar().getId_lugar() != null) {
            Lugar lugar = lugarRepository.findById(nueva.getLugar().getId_lugar()).orElseThrow();
            actual.setLugar(lugar);
        } else {
            actual.setLugar(null);
        }

        Long idLugar = actual.getLugar() != null ? actual.getLugar().getId_lugar() : null;
        if (existeZonaDuplicada(nueva.getNombre_zona(), idLugar, id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe una zona con ese nombre en ese lugar");
        }

        actual.setNombre_zona(nueva.getNombre_zona());
        actual.setCapacidad(nueva.getCapacidad());
        actual.setEstado(nueva.getEstado());

        return zonaRepository.save(actual);
    }

    @Override
    public void eliminar(Long id) {
        zonaRepository.deleteById(id);
    }
}