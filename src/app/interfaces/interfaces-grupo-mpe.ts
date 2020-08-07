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
  }
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
}
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