export interface UsuarioLogin {

    Usuario: string;
    Password: string;
    FingerID: boolean;
    Tipo: string;
    Nombre: string;
    Recordarme: boolean;

}

export interface CambiarPassword {

    PassOld: string;
    PassNew: string;
    PassConfirmada: string;
}

