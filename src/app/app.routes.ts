import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'lists/:id', component: MainComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
