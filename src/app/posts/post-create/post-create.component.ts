import { PostsService } from '../../services/posts.service'
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Post } from 'src/app/interfaces/post';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';

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
    isLoading: boolean = false
    form: FormGroup
    imagePreview: string = ''

    constructor(public postsService: PostsService, public route: ActivatedRoute) { }

    ngOnInit(): void {
        this.form = new FormGroup({
            'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
            'content': new FormControl(null, { validators: [Validators.required] }),
            'image': new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
        })

        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (!paramMap.has('postId')) {
                this.mode = 'create'
                this.postId = null
                return
            }
            this.mode = 'edit'
            this.postId = paramMap.get('postId')
            this.isLoading = true
            this.postsService.getPost(this.postId).subscribe(postData => {
                this.isLoading = false
                let { _id, title, content, imagePath, creator } = postData.post
                this.post = { id: _id, title, content, imagePath, creator }
                this.form.setValue({ title: this.post.title, content: this.post.content, image: this.post.imagePath })
            })
        })
    }

    onSavePost() {
        if (this.form.invalid) return
        this.isLoading = true
        switch (this.mode) {
            case 'create':
                this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image)
                break;
            case 'edit':
                this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image)
                break;
        }
        this.form.reset()
    }

    onImagePicked(event: Event) {
        const file = (event.target as HTMLInputElement).files[0]
        this.form.patchValue({ image: file })
        this.form.get('image').updateValueAndValidity()
        const reader = new FileReader()
        reader.onload = () => {
            this.imagePreview = reader.result as string
        }
        reader.readAsDataURL(file)
    }
}