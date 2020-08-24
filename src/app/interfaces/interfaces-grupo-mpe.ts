export interface RespuestaAPIGetDatos {

  'soap:Envelope': {
    '$': {
      'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema'
    },
    'soap:Body': [
      {
        'ObtenerDatosConsultorResponse': [
          {
            '$': {
              'xmlns': 'http://tempuri.org/'
            },
            'ObtenerDatosConsultorResult': [
              {
                'Nombre': [
                  string
                ],
                'Tipo': [
                  string
                ]
              }
            ]
          }
        ]
      }
    ]
  };

}



export interface ObtenerDatosConsultorResult {

  Nombre: string;
  Tipo: string;

}


export interface RespuestaAPIGetDocumentos {

  'soap:Envelope': {
    '$': {
      'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema'
    },
    'soap:Body': [
      {
        'ObtenerDocumentosTrabajadorResponse': [
          {
            '$': {
              'xmlns': 'http://tempuri.org/'
            },
            'ObtenerDocumentosTrabajadorResult': [
              {
                'DocumentoInfo': Documento[]
              }
            ]
          }
        ]
      }
    ]
  };
}

export interface ObtenerDocumentosTrabajadores {

  DocumentoInfo: Documento[];

}

export interface Documento {

  Id: number;
  Descripcion: string;
  FechaDocumento: string;

}

export interface RespuestaDocumentosTrabajador {
  'soap:Envelope': {
    '$': {
      'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema'
    },
    'soap:Body': [
      {
        'ObtenerTrabajadorRelacionDocumentosResponse': [
          {
            '$': {
              'xmlns': 'http://tempuri.org/'
            },
            'ObtenerTrabajadorRelacionDocumentosResult': [
              {
                'DocumentoInfo': [
                  {
                    'Id': number,
                    'Descripcion': string,
                    'FechaDocumento': string
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
}


export interface RespuestaDocumentoPDFTrabajador {
'soap:Envelope': {
  '$': {
    'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
    'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
    'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema'
  },
  'soap:Body': [
    {
      'ObtenerTrabajadorPdfResponse': [
        {
          '$': {
            'xmlns': 'http://tempuri.org/'
          },
          'ObtenerTrabajadorPdfResult': [
            {
              'NombreFichero': string,
              'Datos': Uint8Array
            }
          ]
        }
      ]
    }
  ]
};
}
export interface ObtenerDocumentoPDFTrabajador {

NombreFichero: string;
Datos: any;

}

export interface RespuestaGetAPICertificadosAptitud {
  'soap:Envelope': {
    '$': {
      'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema'
    },
    'soap:Body': [
      {
        'ObtenerCertificadosAptitudRelacionDocumentosResponse': [
          {
            '$': {
              'xmlns': 'http://tempuri.org/'
            },
            'ObtenerCertificadosAptitudRelacionDocumentosResult': [
              {
                'CertificadoAptitudInfo': Certificado[]
              }
            ]
          }
        ]
      }
    ]
  };
}

export interface ObtenerCertificados {

  CertificadoAptitudInfo: Certificado[];

}

export interface Certificado {

  'Id': string;
  'Descripcion': string;
  'FechaDocumento': string;
  'CentroTrabajo': string;
  'IdCentroTrabajo': number;
  'DomicilioCentroTrabajo': string;
  'TipoCentroTrabajo': string;
}

export interface RespuestaObtenerCertPDF {
 'soap:Envelope': {
    '$': {
      'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema'
    },
    'soap:Body': [
      {
        'ObtenerCertificadoAptitudPdfResponse': [
          {
            '$': {
              'xmlns': 'http://tempuri.org/'
            },
            'ObtenerCertificadoAptitudPdfResult': [
              {
                'NombreFichero': string
                'Datos': Uint8Array;
              }
            ]
          }
        ]
      }
    ]
  };
}


export interface CertificadoPDF {

  NombreFichero: string;
  Datos: any;

}

export interface RespuestaGetCentrosTrabajo {
  'soap:Envelope': {
    '$': {
      'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema'
    },
    'soap:Body': [
      {
        'ObtenerCentrosTrabajoResponse': [
          {
            '$': {
              'xmlns': 'http://tempuri.org/'
            },
            'ObtenerCentrosTrabajoResult': [
              {
                'CentroTrabajoInfo': Centro[];
              }
            ]
          }
        ]
      }
    ]
  };
}

export interface ObtenerCentros {

  CentroTrabajoInfo: Centro[];

}

export interface Centro {

  IdCentroTrabajo: string;
  NombreCentroTrabajo: string;

}
export interface CambioPassword {
  'soap:Envelope': {
    '$': {
      'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema'
    },
    'soap:Body': [
      {
        'CambiarPasswordResponse': [
          {
            '$': {
              'xmlns': 'http://tempuri.org/'
            }
          }
        ]
      }
    ]
  };
}

export interface RecuentoNotificacionesResponse {
  'soap:Envelope': {
    '$': {
      'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema'
    },
    'soap:Body': [
      {
        'ObtenerRecuentoDocumentosNuevosResponse': [
          {
            '$': {
              'xmlns': 'http://tempuri.org/'
            },
            'ObtenerRecuentoDocumentosNuevosResult': [

            ]
          }
        ]
      }
    ]
  };
}

export interface ObtenerHistoricoNotificacionesRelacionDocumentos {
  'soap:Envelope': {
    '$': {
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
      'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/'
    },
    'soap:Header': [
      {
        'AuthHeader': [
          {
            '$': {
              'xmlns': 'http://tempuri.org/'
            },
            'Usuario': string,
            'Password': string
          }
        ]
      }
    ],
    'soap:Body': [
      {
        'ObtenerHistoricoNotificacionesRelacionDocumentos': [
          {
            '$': {
              'xmlns': 'http://tempuri.org/'
            },
            'FiltroNot': [
              {
                'FechaDesde': string,
                'FechaHasta': string,
                'NifClienteConsultor': string
              }
            ]
          }
        ]
      }
    ]
  };
}

export interface FiltroNot {
  FechaDesde: string;
  FechaHasta: string;
  NifClienteConsultor: string;
}

export interface RespuestaHistorial {
  'soap:Envelope': {
    '$': {
      'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema'
    },
    'soap:Body': [
      {
        'ObtenerHistoricoNotificacionesRelacionDocumentosResponse': [
          {
            '$': {
              'xmlns': 'http://tempuri.org/'
            },
            'ObtenerHistoricoNotificacionesRelacionDocumentosResult': [
              {
                HistoricoNotificacionInfo: Notificacion[];
              }
            ]
          }
        ]
      }
    ]
  };
}

export interface ObtenerHistoriaDocumentos {

  HistoricoNotificacionInfo: Notificacion[];

}
export interface Notificacion {
  Referencia: string;
  FechaNotificacion: string;
  TipoDocumento: string;
  IdDocumento: number;
}

export interface RespuestaAsistencia {
  'soap:Envelope': {
    '$': {
      'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema'
    },
    'soap:Body': [
      {
        'ObtenerAsistenciasRelacionResponse': [
          {
            '$': {
              'xmlns': 'http://tempuri.org/'
            },
            'ObtenerAsistenciasRelacionResult': Asistencia[]
          }
        ]
      }
    ]
  };
}

export interface RespuestaAsistenciaInfo {

  AsistenciaInfo: Asistencia[];

}

export interface Asistencia {
    Trabajador: string;
    NifTrabajador: string;
    FechaDocumento: string;
    NombreCentroMedico: string;
    SituacionReconocimientoMedico: string;
}

export interface RespuestaCitasPendientes {
  'soap:Envelope': {
    '$': {
      'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema'
    },
    'soap:Body': [
      {
        'ObtenerCitasPendientesRelacionResponse': [
          {
            '$': {
              'xmlns': 'http://tempuri.org/'
            },
            'ObtenerCitasPendientesRelacionResult':  Citas[]
          }
        ]
      }
    ]
  };
}

export interface RespuestaCitasiaInfo {

  CitasInfo: Citas[];

}

export interface Citas {
    citapendiente: string;
}

export interface RespuestaClientes {
  'soap:Envelope': {
    '$': {
      'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema'
    },
    'soap:Body': [
      {
        'ObtenerListadoClientesResponse': [
          {
            '$': {
              'xmlns': 'http://tempuri.org/'
            },
            'ObtenerListadoClientesResult': [
              {
                'ClienteInfo': [
                  {
                    'Nif': [
                      'B32169831'
                    ],
                    'NombreCliente': [
                      'EXCLUSIVAS VILA, S.L.'
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
}

export interface RespuestaClienteInfo {
  ClienteInfo: Cliente[];
}

export interface Cliente {
    Nif: string;
    NombreCliente: string;

}

export interface RespuestaAPITest {
  'soap:Envelope': {
    '$': {
      'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema'
    },
    'soap:Body': [
      {
        'ObtenerTestsResponse': [
          {
            '$': {
              'xmlns': 'http://tempuri.org/'
            },
            'ObtenerTestsResult': [
              {
                'TestInfo': TestInfo[];
              }
            ]
          }
        ]
      }
    ]
  };
}

export interface TestInfo {

  Nombre: String;
  Permiso: String;
  Preguntas: PreguntaInfo;

}

export interface PreguntaInfo {

  PreguntaInfo: Pregunta[];


}
export interface Pregunta {

  IdPregunta: number;
  Pregunta: string;
  Respuestas: RespuestaInfo;

}


export interface RespuestaInfo {

  RespuestaInfo: Respuesta[];

}

export interface Respuesta {

  Respuesta: string;
  Valor: String;
  SubRespuestas: SubRespuestaInfo;
  ValorCheck: boolean;

}

export interface SubRespuestaInfo {

  IdPregunta: number;
  RespuestaSubPreguntas: RespuestaSubPreguntas;

}

export interface RespuestaSubPreguntas {

  RespuestaSubPreguntaInfo: RespuestaSubPreguntaInfo[];

}

export interface RespuestaSubPreguntaInfo {

  IdRespuesta: string;
  Respuesta: string;
  ValorCheck: boolean;

}

export interface RespuestasTestAPI {

  Usuario: string;
  Password: string;
  NombreTest: String;
  Permiso: String;
  FechaRealizacion: String;
  Respuestas: RespuestaTest[];

}

export interface RespuestaTest {

  IdPregunta: string;
  ValorRespuesta: string;
  SubRespuesta?: string[];

}

export interface MandarTokenAPI {

  Usuario: string;
  Token: string;
  TipoUsuario: string;

}

export interface RespuestaAPItoken {

  Codigo: number;
  Mensaje: string;

}
