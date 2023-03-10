import { PostsService } from './../../posts.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from 'src/app/post';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit {
    enteredContent: string = ''
    enteredTitle: string = ''
    mode: string = 'create'
    postId: string = ''
    post: Post

    constructor(public postsService: PostsService, public route: ActivatedRoute) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (!paramMap.has('postId')) {
                this.mode = 'create'
                this.postId = null
                return
            }
            this.mode = 'edit'
            this.postId = paramMap.get('postId')
            this.postsService.getPost(this.postId).subscribe(postData => {
                let { _id, title, content } = postData.post
                this.post = { id: _id, title, content }
            })
        })
    }

    onSavePost(form: NgForm) {
        if (form.invalid) return
        switch (this.mode) {
            case 'create':
                this.postsService.addPost(form.value.title, form.value.content)
                break;
            case 'edit':
                this.postsService.updatePost(this.postId, form.value.title, form.value.content)
                break;
        }
        form.resetForm()
    }
}