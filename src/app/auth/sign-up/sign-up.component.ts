import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  isLoading = false
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSignUp(form: NgForm) {
    if (form.invalid) return
    this.isLoading = true
    this.authService.createUser(form.value.email, form.value.password)
  }
}
