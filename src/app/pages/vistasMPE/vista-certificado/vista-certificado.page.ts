import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CertificadosAptitudService } from '../../../providers/certificadosAptitud/certificados-aptitud.service';

@Component({
  selector: 'app-vista-certificado',
  templateUrl: './vista-certificado.page.html',
  styleUrls: ['./vista-certificado.page.scss'],
})
export class VistaCertificadoPage implements OnInit {

  certificado: any;
  certificadoID: any = this.route.snapshot.paramMap.get('id');

  constructor(
    public route: ActivatedRoute,
    public certificadoService: CertificadosAptitudService
  ) { }

  ngOnInit() {
    // tslint:disable-next-line: max-line-length
    this.certificado = this.certificadoService.getItem(this.certificadoID) ? this.certificadoService.getItem(this.certificadoID) : this.certificadoService.findAll()[0];
  }
}
