import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  isLoading = false
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSignIn(form: NgForm) {
    if (form.invalid) return
    this.isLoading = true
    this.authService.loginUser(form.value.email, form.value.password)
  }

}
