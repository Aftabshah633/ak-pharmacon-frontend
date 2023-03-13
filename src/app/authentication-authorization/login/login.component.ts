import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthAuthService } from '../service/auth-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  smallSpinner: boolean = false;
  disableButton: boolean = false;
  // loginUI: boolean = false;
  hidePassword: boolean = true;
  loginUI: boolean = true;
  verifyLoginOtpUI: boolean = false;
  loginWrongCredentialsAlert: boolean = false;
  loginOtpWrongCredentialsAlert: boolean = false;
  acDeactivatedAlert: boolean = false;
  errorAlertLogin: boolean = false;
  errorOtpGenAlert: boolean = false;
  errorloginOtpAlert: boolean = false;
  loginOtpWronCredFinalAlert: boolean = false;
  logOtpErrorFinalAlert: boolean = false;
  regenOtpAlert: boolean = false;

  // tslint:disable-next-line: no-input-rename
  @Input() returnUrl: any;
  // tslint:disable-next-line: no-output-native
  @Output() close =  new EventEmitter<any>();
  constructor(
    private loginRegister: AuthAuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

    // Login Form
    loginForm = new FormGroup({
      mobile1: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        // formCustomValidator.connotContainSpace
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ])
    });

    

   
    loginData = () => {
      this.smallSpinner = true;
      this.disableButton = true;
      if (this.loginForm.invalid){
        this.smallSpinner = false;
        this.disableButton = false;
        // if form is invalid do not talk to backend
        return;
      }

      // console.log(this.loginForm.value);
      this.loginRegister.login(this.loginForm.value).subscribe(
        data => {
          this.smallSpinner = false;
          this.disableButton = false;
          this.loginRegister.loginProcess(data);
          this.router.navigate([this.returnUrl]);
        },
        (error: Response) => {
          this.smallSpinner = false;
          this.disableButton = false;
          if (error.status === 432){
            this.loginWrongCredentialsAlert = true;
          }
          else if (error.status === 409){
            this.acDeactivatedAlert = true;
          }else {
            // this.logOtpErrorFinalAlert = true;
            this.errorAlertLogin = true;
          }
          console.log(error);
        }
      );
    }

  

    

  ngOnInit(): void {
    this.loginUI = true;
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/'
    console.log('return url', this.returnUrl);
  }
}
