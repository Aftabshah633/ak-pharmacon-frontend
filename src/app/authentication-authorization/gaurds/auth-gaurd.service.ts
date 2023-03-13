import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { userUrl } from 'src/app/urls/angular.url';
import { AuthAuthService } from '../service/auth-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGaurdService implements CanActivate {

  constructor(
    private loginRegister: AuthAuthService,
    private router: Router,
  ) { }

  canActivate(route: any, state: RouterStateSnapshot) {
    if (this.loginRegister.getToken) {
      return true;
    }
    this.router.navigate([userUrl.login], {queryParams: {returnUrl : state.url}});
    return false;
  }
}
