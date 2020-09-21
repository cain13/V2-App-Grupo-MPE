export interface UsuarioLogin {

    Usuario: string;
    Password: string;
    FingerID: boolean;
    Tipo: string;
    Nombre: string;
    Recordarme: boolean;
    EsBuzo: boolean;
    EsGuardiaCivil: boolean;
    RequiereMantoux: boolean;

}

export interface Notificacion {
    IdNotificacion: number;
    Titulo: string;
    Mensaje: string;
    Leido: number;
    TipoDocumento: string;
    Fecha: string;
    Ruta: string;
    Icono: string;

}

export interface EmpresaConsultor {

    Nif: string;
    NombreCliente: string;
}

export interface CambiarPassword {

    PassOld: string;
    PassNew: string;
    PassConfirmada: string;
}

export interface Notificaciones {

    Cantidad: number;
    ListaNotificaciones: NotificacionesMensajes[];
}

export interface NotificacionesMensajes {

    Icono: string;
    Ruta: string;
    Mensaje: string;
    Fecha: string;
    Id: number;
}

export interface DatosFiltros {

    fecha_desde: string;
    fecha_hasta: string;
    nombre?: string;
    dni?: string;
    noPresentado?: boolean;
    idCentro?: number;
    idCentroEspecificado?: number;

}

export interface CentrosMPEFiltros {

    codigoPostal?: string;
    provincia?: string;
    localidad?: string;
}

export interface UsuarioPost{

    tipoUsuario: string;

}

export interface RespuestaAPIPost {

    Direccion: string;
    Provincia: string;
    Fecha: string;
    Titulo: string;
    Texto: string;
    Imagen: string;
    Latitud: string;
    Longitud: string;

}

export interface Opciones {

    Titulo: string;
    Icon: string;
    Url: string;
    Tab?: string;
    direct: string;
}
