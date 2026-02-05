package com.example.viajesservice.Dtos.Usuario;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioGetDto {
    private Integer usuario_id;
    private String nombre;
    private String apellido;
    private String email;
    private String rol;
    private Boolean estado;
}
