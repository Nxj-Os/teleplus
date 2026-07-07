package pe.edu.utp.backend.security;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import pe.edu.utp.backend.entity.Usuario;
import pe.edu.utp.backend.repository.UsuarioRepository;

import java.util.List;

@Component
@Order(1)
public class PasswordMigrationRunner implements ApplicationRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public PasswordMigrationRunner(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        List<Usuario> usuarios = usuarioRepository.findAll();
        for (Usuario usuario : usuarios) {
            String contrasena = usuario.getContrasena();
            if (contrasena != null && !contrasena.startsWith("$2")) {
                usuario.setContrasena(passwordEncoder.encode(contrasena));
                usuarioRepository.save(usuario);
            }
        }
    }
}
