package pe.edu.utp.backend.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import pe.edu.utp.backend.entity.Usuario;
import pe.edu.utp.backend.repository.UsuarioRepository;
import pe.edu.utp.backend.service.UsuarioService;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Usuario registrar(Usuario usuario) {
        if (usuario.getEstado() == null) {
            usuario.setEstado("activo");
        }
        return usuarioRepository.save(usuario);
    }

    @Override
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    @Override
    public Optional<Usuario> obtenerPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    @Override
    public Usuario actualizar(Long id, Usuario datosNuevos) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setNombre(datosNuevos.getNombre());
            usuario.setApellido(datosNuevos.getApellido());
            usuario.setTelefono(datosNuevos.getTelefono());
            usuario.setCorreo(datosNuevos.getCorreo());
            usuario.setEstado(datosNuevos.getEstado());

            if (datosNuevos.getContrasena() != null && !datosNuevos.getContrasena().isEmpty()) {
                usuario.setContrasena(passwordEncoder.encode(datosNuevos.getContrasena()));
            }
            return usuarioRepository.save(usuario);
        }).orElse(null);
    }

    @Override
    public void eliminar(Long id) {
        usuarioRepository.deleteById(id);
    }

    @Override
    public Usuario login(String correo, String contrasena) {
        return usuarioRepository.findByCorreo(correo)
                .filter(user -> passwordEncoder.matches(contrasena, user.getContrasena()))
                .orElse(null);
    }

    @Override
    public Optional<Usuario> buscarPorCorreo(String correo) {
        return usuarioRepository.findByCorreo(correo);
    }
}