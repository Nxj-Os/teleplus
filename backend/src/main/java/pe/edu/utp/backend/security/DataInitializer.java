package pe.edu.utp.backend.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import pe.edu.utp.backend.entity.Rol;
import pe.edu.utp.backend.entity.Usuario;
import pe.edu.utp.backend.repository.RolRepository;
import pe.edu.utp.backend.repository.UsuarioRepository;

import java.time.LocalDate;

@Component
@Order(2)
public class DataInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UsuarioRepository usuarioRepository,
                           RolRepository rolRepository,
                           PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        crearSiNoExiste("admin@teleplus.com",    "Admin123",   "Admin",   "Teleplus", "ADMIN");
        crearSiNoExiste("manager@teleplus.com",  "Manager123", "Manager", "Teleplus", "MANAGER");
        crearSiNoExiste("cliente@teleplus.com",  "Cliente123", "Cliente", "Teleplus", "CLIENTE");
    }

    private void crearSiNoExiste(String correo, String contrasena,
                                  String nombre, String apellido, String rolNombre) {
        if (usuarioRepository.findByCorreo(correo).isPresent()) return;

        Rol rol = rolRepository.findByNombreRol(rolNombre).orElse(null);
        if (rol == null) {
            log.warn("Rol no encontrado: {} — omitiendo {}", rolNombre, correo);
            return;
        }

        try {
            Usuario u = new Usuario();
            u.setNombre(nombre);
            u.setApellido(apellido);
            u.setCorreo(correo);
            u.setContrasena(passwordEncoder.encode(contrasena));
            u.setEstado("activo");
            u.setFecha_registro(LocalDate.now());
            u.setRol(rol);
            u.setTelefono("000000000");

            usuarioRepository.save(u);
            log.info("Usuario creado: {}", correo);
        } catch (DataIntegrityViolationException e) {
            log.info("Usuario '{}' ya existe en la base de datos", correo);
        }
    }
}
