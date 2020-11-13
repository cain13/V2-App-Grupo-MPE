import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '',     loadChildren: () => import('./pages/vistasMPE/blanco/blanco.module').then( m => m.BlancoPageModule)},
  { path: 'walkthrough', loadChildren: () => import('./pages/walkthrough/walkthrough.module').then(m => m.WalkthroughPageModule) },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
  { path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule) },
  { path: 'home-location', loadChildren: () => import('./pages/home-location/home-location.module').then(m => m.HomeLocationPageModule) },
  { path: 'about', loadChildren: () => import('./pages/about/about.module').then(m => m.AboutPageModule) },
  { path: 'support', loadChildren: () => import('./pages/support/support.module').then(m => m.SupportPageModule) },
  { path: 'settings', loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule) },
  { path: 'edit-profile', loadChildren: () => import('./pages/edit-profile/edit-profile.module').then(m => m.EditProfilePageModule) },
  { path: 'messages', loadChildren: () => import('./pages/messages/messages.module').then(m => m.MessagesPageModule) },
  { path: 'message/:id', loadChildren: () => import('./pages/message/message.module').then(m => m.MessagePageModule) },
  { path: 'home-results', loadChildren: () => import('./pages/home-results/home-results.module').then(m => m.HomeResultsPageModule) },
  { path: 'search-filter', loadChildren: () => import('./pages/modal/search-filter/search-filter.module').then(m => m.SearchFilterPageModule) },
  { path: 'nearby', loadChildren: () => import('./pages/nearby/nearby.module').then(m => m.NearbyPageModule) },
  { path: 'schedule-visit', loadChildren: () => import('./pages/schedule-visit/schedule-visit.module').then(m => m.ScheduleVisitPageModule) },
  { path: 'bycategory', loadChildren: () => import('./pages/bycategory/bycategory.module').then(m => m.BycategoryPageModule) },
  { path: 'property-list', loadChildren: () => import('./pages/property-list/property-list.module').then(m => m.PropertyListPageModule) },
  { path: 'property-detail', loadChildren: () => import('./pages/property-detail/property-detail.module').then(m => m.PropertyDetailPageModule) },
  { path: 'broker-list', loadChildren: () => import('./pages/broker-list/broker-list.module').then(m => m.BrokerListPageModule) },
  { path: 'broker-detail', loadChildren: () => import('./pages/broker-detail/broker-detail.module').then(m => m.BrokerDetailPageModule) },
  { path: 'broker-chat', loadChildren: () => import('./pages/broker-chat/broker-chat.module').then(m => m.BrokerChatPageModule) },
  { path: 'checkout', loadChildren: () => import('./pages/checkout/checkout.module').then(m => m.CheckoutPageModule) },
  { path: 'favorites', loadChildren: () => import('./pages/favorites/favorites.module').then(m => m.FavoritesPageModule) },
  { path: 'invoices', loadChildren: () => import('./pages/invoices/invoices.module').then(m => m.InvoicesPageModule) },
  { path: 'extras', loadChildren: () => import('./pages/extras/extras.module').then(m => m.ExtrasPageModule) },
  { path: 'extras/profile-one', loadChildren: () => import('./pages/extras/profile-one/profile-one.module').then(m => m.ProfileOnePageModule) },
  { path: 'extras/profile-two', loadChildren: () => import('./pages/extras/profile-two/profile-two.module').then(m => m.ProfileTwoPageModule) },
  { path: 'extras/timeline', loadChildren: () => import('./pages/extras/timeline/timeline.module').then(m => m.TimelinePageModule) },
  { path: 'extras/authentication', loadChildren: () => import('./pages/extras/authentication/authentication.module').then(m => m.AuthenticationPageModule) },
  { path: 'extras/popupmenu', loadChildren: () => import('./pages/extras/popupmenu/popupmenu.module').then(m => m.PopupmenuPageModule) },
  { path: 'extras/charts', loadChildren: () => import('./pages/extras/charts/charts.module').then(m => m.ChartsPageModule) },
  { path: 'extras/post', loadChildren: () => import('./pages/extras/post/post.module').then(m => m.PostPageModule) },
  { path: '', redirectTo: '/tab-inicio', pathMatch: 'full' },
  {
    path: 'filtro-documentos',
    loadChildren: () => import('./pages/modal/filtro-documentos/filtro-documentos.module').then( m => m.FiltroDocumentosPageModule)
  },
  {
    path: 'documentos',
    loadChildren: () => import('./pages/documentos/documentos.module').then( m => m.DocumentosPageModule)
  },
  {
    path: 'certificado-aptitud',
    loadChildren: () => import('./pages/vistasMPE/certificado-aptitud/certificado-aptitud.module').then( m => m.CertificadoAptitudPageModule)
  },
  {
    path: 'planficacion-vs',
    loadChildren: () => import('./pages/vistasMPE/planficacion-vs/planficacion-vs.module').then( m => m.PlanficacionVSPageModule)
  },
  {
    path: 'memoria-anual',
    loadChildren: () => import('./pages/vistasMPE/memoria-anual/memoria-anual.module').then( m => m.MemoriaAnualPageModule)
  },
  {
    path: 'estudio-epidemiologico',
    loadChildren: () => import('./pages/vistasMPE/estudio-epidemiologico/estudio-epidemiologico.module').then( m => m.EstudioEpidemiologicoPageModule)
  },
  {
    path: 'citas-pendientes',
    loadChildren: () => import('./pages/vistasMPE/citas-pendientes/citas-pendientes.module').then( m => m.CitasPendientesPageModule)
  },
  {
    path: 'asistencia',
    loadChildren: () => import('./pages/vistasMPE/asistencia/asistencia.module').then( m => m.AsistenciaPageModule)
  },
  {
    path: 'vista-certificado',
    loadChildren: () => import('./pages/vistasMPE/vista-certificado/vista-certificado.module').then( m => m.VistaCertificadoPageModule)
  },
  {
    path: 'documentos-trabajador',
    loadChildren: () => import('./pages/vistasMPE/documentos-trabajador/documentos-trabajador.module').then( m => m.DocumentosTrabajadorPageModule)
  },
  {
    path: 'blanco',
    loadChildren: () => import('./pages/vistasMPE/blanco/blanco.module').then( m => m.BlancoPageModule)
  },
  {
    path: 'cambiar-password',
    loadChildren: () => import('./pages/vistasMPE/cambiar-password/cambiar-password.module').then( m => m.CambiarPasswordPageModule)
  },
  {
    path: 'modal-mas-info',
    loadChildren: () => import('./pages/vistasMPE/modal-mas-info/modal-mas-info.module').then( m => m.ModalMasInfoPageModule)
  },
  {
    path: 'historial-notificaciones',
    loadChildren: () => import('./pages/vistasMPE/historial-notificaciones/historial-notificaciones.module').then( m => m.HistorialNotificacionesPageModule)
  },
  {
    path: 'filtro-historial',
    loadChildren: () => import('./pages/modal/filtro-historial/filtro-historial.module').then( m => m.FiltroHistorialPageModule)
  },
  {
    path: 'filtro-asistencia',
    loadChildren: () => import('./pages/modal/filtro-asistencia/filtro-asistencia.module').then( m => m.FiltroAsistenciaPageModule)
  },
  {
    path: 'filtro-citas',
    loadChildren: () => import('./pages/modal/filtro-citas/filtro-citas.module').then( m => m.FiltroCitasPageModule)
  },
  {
    path: 'seleccionar-cliente',
    loadChildren: () => import('./pages/modal/seleccionar-cliente/seleccionar-cliente.module').then( m => m.SeleccionarClientePageModule)
  },
  {
    path: 'test',
    loadChildren: () => import('./pages/vistasMPE/test/test.module').then( m => m.TestPageModule)
  },
  {
    path: 'elegir-test',
    loadChildren: () => import('./components/elegir-test/elegir-test.module').then( m => m.ElegirTestPageModule)
  },
  {
    path: 'subrespuesta-modal',
    loadChildren: () => import('./pages/vistasMPE/subrespuesta-modal/subrespuesta-modal.module').then( m => m.SubrespuestaModalPageModule)
  },
  {
    path: 'documentos-covid',
    loadChildren: () => import('./pages/vistasMPE/documentos-covid/documentos-covid.module').then( m => m.DocumentosCOVIDPageModule)
  },
  {
    path: 'notificaciones',
    loadChildren: () => import('./pages/vistasMPE/notificaciones/notificaciones.module').then( m => m.NotificacionesPageModule)
  },
  {
    path: 'citas-pendientes-trabajador',
    loadChildren: () => import('./pages/vistasMPE/citas-pendientes-trabajador/citas-pendientes-trabajador.module').then( m => m.CitasPendientesTrabajadorPageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/vistasMPE/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'noticias-mas-info',
    loadChildren: () => import('./pages/vistasMPE/noticias-mas-info/noticias-mas-info.module').then( m => m.NoticiasMasInfoPageModule)
  },
  {
    path: 'tab-inicio',
    loadChildren: () => import('./pages/vistasMPE/tab-inicio/tab-inicio.module').then( m => m.TabInicioPageModule)
  },
  {
    path: 'vigilancia-salud',
    loadChildren: () => import('./pages/vistasMPE/vigilancia-salud/vigilancia-salud.module').then( m => m.VigilanciaSaludPageModule)
  },
  {
    path: 'home-location-menu',
    loadChildren: () => import('./pages/vistasMPE/home-location-menu/home-location-menu.module').then( m => m.HomeLocationMenuPageModule)
  },
  {
    path: 'certificado-aptitud-menu',
    loadChildren: () => import('./pages/vistasMPE/certificado-aptitud-menu/certificado-aptitud-menu.module').then( m => m.CertificadoAptitudMenuPageModule)
  },
  {
    path: 'citas-pendientes-menu',
    loadChildren: () => import('./pages/vistasMPE/citas-pendientes-menu/citas-pendientes-menu.module').then( m => m.CitasPendientesMenuPageModule)
  },
  {
    path: 'documentos-trabajador-menu',
    loadChildren: () => import('./pages/vistasMPE/documentos-trabajador-menu/documentos-trabajador-menu.module').then( m => m.DocumentosTrabajadorMenuPageModule)
  },
  {
    path: 'documentos-covid-menu',
    loadChildren: () => import('./pages/vistasMPE/documentos-covid-menu/documentos-covid-menu.module').then( m => m.DocumentosCovidMenuPageModule)
  },
  {
    path: 'citas-pendientes-trabajador-menu',
    loadChildren: () => import('./pages/vistasMPE/citas-pendientes-trabajador-menu/citas-pendientes-trabajador-menu.module').then( m => m.CitasPendientesTrabajadorMenuPageModule)
  },
  {
    path: 'test-menu',
    loadChildren: () => import('./pages/vistasMPE/test-menu/test-menu.module').then( m => m.TestMenuPageModule)
  },
  {
    path: 'contacto-mpe',
    loadChildren: () => import('./pages/vistasMPE/contacto-mpe/contacto-mpe.module').then( m => m.ContactoMpePageModule)
  },
  {
    path: 'modal-condiciones',
    loadChildren: () => import('./pages/vistasMPE/modal-condiciones/modal-condiciones.module').then( m => m.ModalCondicionesPageModule)
  },
  {
    path: 'construccion',
    loadChildren: () => import('./pages/vistasMPE/construccion/construccion.module').then( m => m.ConstruccionPageModule)
  },
  {
    path: 'modal-terminos',
    loadChildren: () => import('./pages/vistasMPE/modal-terminos/modal-terminos.module').then( m => m.ModalTerminosPageModule)
  },
  {
    path: 'vista-tubirculina',
    loadChildren: () => import('./pages/vistasMPE/vista-tubirculina/vista-tubirculina.module').then( m => m.VistaTubirculinaPageModule)
  },
  {
    path: 'vista-tuberculina-inicio',
    loadChildren: () => import('./pages/vistasMPE/vista-tuberculina-inicio/vista-tuberculina-inicio.module').then( m => m.VistaTuberculinaInicioPageModule)
  },
  {
    path: 'mensaje-mantoux',
    loadChildren: () => import('./pages/vistasMPE/mensaje-mantoux/mensaje-mantoux.module').then( m => m.MensajeMantouxPageModule)
  },







];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
