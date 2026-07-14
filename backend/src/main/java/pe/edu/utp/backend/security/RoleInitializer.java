package pe.edu.utp.backend.security;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import pe.edu.utp.backend.entity.Rol;
import pe.edu.utp.backend.repository.RolRepository;

@Component
@Order(0)
public class RoleInitializer implements ApplicationRunner {

    private final RolRepository rolRepository;

    public RoleInitializer(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        crearSiNoExiste("ADMIN");
        crearSiNoExiste("MANAGER");
        crearSiNoExiste("CLIENTE");
    }

    private void crearSiNoExiste(String nombreRol) {
        if (rolRepository.findByNombreRol(nombreRol).isPresent()) return;

        Rol rol = new Rol();
        rol.setNombreRol(nombreRol);
        rolRepository.save(rol);
        System.out.println("[RoleInitializer] Rol creado: " + nombreRol);
    }
}
