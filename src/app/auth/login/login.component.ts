import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { LoginRequestPayload } from './login-request-payload';
import { AuthService } from '../shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup;
  loginRequestPayload:LoginRequestPayload;
  registerSuccessMessage: string;
  isError: boolean;

  constructor(private authService:AuthService,
              private router:Router,
              private activatedRoute:ActivatedRoute,
              private toastr :ToastrService) {
    this.loginRequestPayload={
      username:'',
      password:''
    };
  }

  ngOnInit(): void {
    this.loginForm=new FormGroup({
      username:new FormControl('',Validators.required),
      password:new FormControl('',Validators.required)
    });

    this.activatedRoute.queryParams
          .subscribe(params=>{
            console.log(params.registerd);
            if(params.registerd!==undefined && params.registerd==='true'){
              console.log(params.registerd);
              this.toastr.success("Signup Succesfully");
              this.registerSuccessMessage='Please Check your Inbox for activate Link '
                            +' Activate Account Before Login'
            }
          });
  }

  login(){
    this.loginRequestPayload.username=this.loginForm.get('username').value;
    this.loginRequestPayload.password=this.loginForm.get('password').value;

    this.authService.login(this.loginRequestPayload)
              .subscribe(data=>{
                if(data){
                  this.isError = false;
                  this.router.navigateByUrl('/');
                  this.toastr.success('Login Successfully')
                }else{
                  this.isError= true;
                }
              });
  }
}
