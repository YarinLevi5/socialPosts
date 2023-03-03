import { PostsService } from './../../posts.service';
import { Component, Input } from "@angular/core";
import { Post } from "src/app/post";
import { OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css'],
})

export class PostListComponent implements OnInit, OnDestroy {
    @Input() posts: Post[] = []
    private postsSub: Subscription

    constructor(public postsService: PostsService) { }
    ngOnInit() {
        this.postsService.getPosts()
        this.postsService.getPostUpdatedListener().subscribe((posts: Post[]) => {
            this.posts = posts
        })
    }

    ngOnDestroy() {
        this.postsSub.unsubscribe()
    }
}