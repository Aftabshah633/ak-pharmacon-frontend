import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGaurdService } from './authentication-authorization/gaurds/auth-gaurd.service';
import { LoginComponent } from './authentication-authorization/login/login.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PreLoadingStrategyService } from './services/pre-loading-strategy.service';
import { modulesUrl, userUrl } from './urls/angular.url';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },

  {
    path: userUrl.login,
    component: LoginComponent,
  },

  {
    path: modulesUrl.billing,
    data: { preload: true },
    // loadChildren : './pre/pre.module#PreModule'
    // the above syntax is not working in newer angular version so we are
    // using modern syntax to preLazyload
    loadChildren: () =>
      import('./billing/billing.module').then((module) => module.BillingModule),
    // pathMatch: 'full'
    canActivate: [AuthGaurdService],
  },
  {
    path: modulesUrl.product,
    loadChildren: () =>
      import('./product/product.module').then((module) => module.ProductModule),
    // pathMatch: 'full'
    canActivate: [AuthGaurdService],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      preloadingStrategy: PreLoadingStrategyService,
      anchorScrolling: 'enabled',
      scrollOffset: [0, 64],
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
