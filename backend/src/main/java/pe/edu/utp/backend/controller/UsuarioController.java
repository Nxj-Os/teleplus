package pe.edu.utp.backend.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import pe.edu.utp.backend.dto.AuthResponseDTO;
import pe.edu.utp.backend.dto.CambiarContrasenaDTO;
import pe.edu.utp.backend.dto.LoginRequestDTO;
import pe.edu.utp.backend.entity.RevokedToken;
import pe.edu.utp.backend.entity.Rol;
import pe.edu.utp.backend.entity.Usuario;
import pe.edu.utp.backend.repository.RevokedTokenRepository;
import pe.edu.utp.backend.repository.RolRepository;
import pe.edu.utp.backend.repository.UsuarioRepository;
import pe.edu.utp.backend.security.JwtUtil;
import pe.edu.utp.backend.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final UsuarioService usuarioService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RevokedTokenRepository revokedTokenRepository;

    public UsuarioController(UsuarioRepository usuarioRepository,
                              RolRepository rolRepository,
                              UsuarioService usuarioService,
                              PasswordEncoder passwordEncoder,
                              JwtUtil jwtUtil,
                              RevokedTokenRepository revokedTokenRepository) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.usuarioService = usuarioService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.revokedTokenRepository = revokedTokenRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginData) {
        if (loginData.correo() == null || loginData.contrasena() == null) {
            return ResponseEntity.badRequest().body("Faltan datos de acceso");
        }

        Optional<Usuario> userOpt = usuarioRepository.findByCorreo(loginData.correo());

        if (userOpt.isPresent()) {
            Usuario user = userOpt.get();
            if (passwordEncoder.matches(loginData.contrasena(), user.getContrasena())) {
                String token = jwtUtil.generateToken(user);
                return ResponseEntity.ok(new AuthResponseDTO(
                        token,
                        user.getId_usuario(),
                        user.getNombre(),
                        user.getCorreo(),
                        user.getRol().getNombreRol()
                ));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Correo o contraseña incorrectos");
    }

    @PostMapping("/login-admin")
    public ResponseEntity<?> loginAdmin(@RequestBody LoginRequestDTO loginData) {
        if (loginData.correo() == null || loginData.contrasena() == null) {
            return ResponseEntity.badRequest().body("Faltan datos de acceso");
        }

        Optional<Usuario> userOpt = usuarioRepository.findByCorreo(loginData.correo());

        if (userOpt.isPresent()) {
            Usuario user = userOpt.get();
            if (passwordEncoder.matches(loginData.contrasena(), user.getContrasena())) {
                if (user.getRol() != null && "CLIENTE".equalsIgnoreCase(user.getRol().getNombreRol())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body("Acceso denegado: Tu cuenta no cuenta con permisos de administrador.");
                }
                String token = jwtUtil.generateToken(user);
                return ResponseEntity.ok(new AuthResponseDTO(
                        token,
                        user.getId_usuario(),
                        user.getNombre(),
                        user.getCorreo(),
                        user.getRol().getNombreRol()
                ));
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Correo o contraseña incorrectos");
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@Valid @RequestBody Usuario usuario) {
        if (usuario.getEstado() == null) {
            usuario.setEstado("activo");
        }
        if (usuario.getFecha_registro() == null) {
            usuario.setFecha_registro(LocalDate.now());
        }
        if (usuario.getRol() == null) {
            Optional<Rol> rolCliente = rolRepository.findByNombreRol("CLIENTE");
            if (rolCliente.isPresent()) {
                usuario.setRol(rolCliente.get());
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Error: El rol 'CLIENTE' no está inicializado en la base de datos.");
            }
        }

        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));

        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioRepository.save(usuario));
    }

    @GetMapping
    public ResponseEntity<List<Usuario>> listarTodos() {
        return ResponseEntity.ok(usuarioRepository.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizar(@PathVariable Long id, @RequestBody Usuario usuario) {
        Usuario actualizado = usuarioService.actualizar(id, usuario);
        if (actualizado == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(actualizado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable Long id) {
        return usuarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuarioRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (!revokedTokenRepository.existsByToken(token)) {
                revokedTokenRepository.save(new RevokedToken(token));
            }
        }
        return ResponseEntity.ok("Sesion cerrada correctamente");
    }

    @PutMapping("/{id}/cambiar-contrasena")
    public ResponseEntity<?> cambiarContrasena(@PathVariable Long id,
                                                @RequestBody CambiarContrasenaDTO dto) {
        return usuarioRepository.findById(id).map(usuario -> {
            if (!passwordEncoder.matches(dto.contrasenaActual(), usuario.getContrasena())) {
                return ResponseEntity.badRequest().body("La contrasena actual es incorrecta");
            }
            if (dto.nuevaContrasena() == null || dto.nuevaContrasena().length() < 8) {
                return ResponseEntity.badRequest().body("La nueva contrasena debe tener al menos 8 caracteres");
            }
            if (!dto.nuevaContrasena().equals(dto.confirmarContrasena())) {
                return ResponseEntity.badRequest().body("Las contrasenas no coinciden");
            }
            usuario.setContrasena(passwordEncoder.encode(dto.nuevaContrasena()));
            usuarioRepository.save(usuario);
            return ResponseEntity.ok("Contrasena actualizada correctamente");
        }).orElse(ResponseEntity.notFound().build());
    }
}
