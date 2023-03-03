import { PostsService } from './../../posts.service';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from 'src/app/post';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent {
    enteredContent: string = ''
    enteredTitle: string = ''

    constructor(public postsService: PostsService) { }

    onAddPost(form: NgForm) {
        if (form.invalid) return
        const post: Post = { title: form.value.title, content: form.value.content }

        this.postsService.addPost(form.value.title, form.value.content)
        form.resetForm()
    }
}