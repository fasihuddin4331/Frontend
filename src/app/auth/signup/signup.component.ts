import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SignUpRequestPayload } from './signup-request-payload';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signrequestPayload:SignUpRequestPayload;
  signupForm: FormGroup;

  constructor(private authservice:AuthService,
              private router:Router,
              private toastr:ToastrService) {
    this.signrequestPayload={
      username:'',
      email:'',
      password:''
    }
  }

  ngOnInit(): void {
    this.signupForm=new FormGroup({
      username:new FormControl('',Validators.required),
      email:new FormControl('',[Validators.required,Validators.email]),
      password:new FormControl('',Validators.required),
    });
  }

  signup(){
    this.signrequestPayload.username=this.signupForm.get('username').value;
    this.signrequestPayload.email=this.signupForm.get('email').value;
    this.signrequestPayload.password=this.signupForm.get('password').value;

    this.authservice.signup(this.signrequestPayload).subscribe(
      ()=>{
        this.router.navigate(['/login'],{queryParams:{registerd:'true'}})
      },
      ()=>{
        this.toastr.error('Registration Failed Please Try Again!');
      }
    );
  }
}
