import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestMenuPage } from './test-menu.page';

const routes: Routes = [
  {
    path: '',
    component: TestMenuPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestMenuPageRoutingModule {}
