import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserLoginBehavior } from 'src/app/interfaces/user-login-behavior';
import { billingUrl } from 'src/app/urls/angular.url';
import { userApiUrl } from 'src/app/urls/api.url';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthAuthService {
  /**
   * We are using BehaviorSubject which will do state managment of data
   * among components
   *
   * Here, userLoginData is observable which contains object having login status and username
   * user:BehaviorSubject is updated by updateUserData method
   *
   * updateUserData is called by loginData in login-register.component and
   * ngOnInit in app.component
   */
  private user: BehaviorSubject<UserLoginBehavior> = new BehaviorSubject<UserLoginBehavior>(
    {
      isLoggedin: false,
      userName: '',
      userlevel: null
  });
  userLoginData = this.user.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  // to update user:BehaviorSubject for keeping state info
  updateUserData(data: UserLoginBehavior) {
    this.user.next(data);
  }

  login = (data:any): Observable<any> => {
    // console.log('login data service', data);
    
    return this.http.post(userApiUrl.login, data);
  }

  logout = () => {
    return this.http.get(userApiUrl.logout);
  }

  // create interface for dataTypes
  createUser = (data:any) => {
    return this.http.post(userApiUrl.createUser, data);
  }

  get getToken(){
    return localStorage.getItem(environment.localStorageToken);
  }

  // in case if the token is removed from backend then user should
  // be logged out from front end as well
  getUserInfo = () => {
    // return this.http.get(this.apiUrls.getUserInfoUrl);
  }

  loginProcess = async (data: any) => {
    localStorage.setItem(environment.localStorageToken, data.token);
    const decoded = new JwtHelperService().decodeToken(data.token);
    this.updateUserData({
      isLoggedin: true,
      userName: decoded.name,
      userlevel: decoded.user
    });
  }

  logoutProcess() {
        /**
         * removing this status check
         * irrespective of of status code the stored token will be removed browser
         * Scenario: when reset password the token will be removed from DB
         * and when user will try to logout from another logged in browser
         * he will not be able to logout as token is removed from DB and backend
         * will return other tha 200
         *
         */
        // temporary fix for logout error handling
        // if (error.status === 200) {
          alert('Successfully logged out, Thank you!');
          localStorage.removeItem(environment.localStorageToken);
          // localStorage.removeItem('user');
          // update user:BehaviorSubject for state mangment
          this.updateUserData({isLoggedin: false, userName: ''});
          this.router.navigate([billingUrl]);
        // } else {
        //   alert(error)
        // }
        // alert(error);
  }

  // create interface
  /**
   * mobile: for which mobile
   * generateFor: login|forgot password
   */
  

  // create interface
 

  // create interface
  
}
