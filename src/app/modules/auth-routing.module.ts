import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SignUpComponent } from '../auth/sign-up/sign-up.component';
import { SignInComponent } from '../auth/sign-in/sign-in.component';


const routes: Routes = [
    { path: 'login', component: SignInComponent },
    { path: 'signup', component: SignUpComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ]
})

export class AuthRoutingModule { }