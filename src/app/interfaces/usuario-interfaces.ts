export interface UsuarioLogin {

    Usuario: string;
    Password: string;
    FingerID: boolean;
    Tipo: string;
    Nombre: string;
    Recordarme: boolean;

}

export interface Notificacion {
    IdNotificacion: number;
    Titulo: string;
    Mensaje: string;
    Leido: boolean;
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
