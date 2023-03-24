import { RouterModule } from '@angular/router';
import { NgModule } from "@angular/core";
import { PostCreateComponent } from '../posts/post-create/post-create.component';
import { PostListComponent } from '../posts/post-list/post-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from "./angular-material.module";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [
        PostListComponent,
        PostCreateComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        AngularMaterialModule
    ]
})

export class PostsModule { }