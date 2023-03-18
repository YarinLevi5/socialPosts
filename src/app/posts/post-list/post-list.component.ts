import { AuthService } from 'src/app/services/auth.service';
import { PostsService } from '../../services/posts.service';
import { Component, Input } from "@angular/core";
import { Post } from "src/app/interfaces/post";
import { OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css'],
})

export class PostListComponent implements OnInit, OnDestroy {
    @Input() posts: Post[] = []
    private postsSub: Subscription
    isLoading: boolean = false
    totalPosts: number = 0
    postsPerPage: number = 2
    currentPage: number = 1
    pageSizeOptions: number[] = [1, 2, 5, 10]
    userIsAuthenticated = false
    private authStatusSub: Subscription

    constructor(public postsService: PostsService, private authService: AuthService) { }
    ngOnInit() {
        this.isLoading = true
        this.postsService.getPosts(this.postsPerPage, this.currentPage)
        this.postsService.getPostUpdatedListener().subscribe((postData: { posts: Post[], postCount: number }) => {
            this.isLoading = false
            this.totalPosts = postData.postCount
            this.posts = postData.posts
        })
        this.userIsAuthenticated = this.authService.getIsAuth()
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated
        })
    }

    onDelete(postId: string) {
        this.postsService.deletePost(postId).subscribe(() => {
            this.postsService.getPosts(this.postsPerPage, this.currentPage)
        })
    }

    onChangedPage(pageData: PageEvent) {
        this.isLoading = true
        this.currentPage = pageData.pageIndex + 1
        this.postsPerPage = pageData.pageSize
        this.postsService.getPosts(this.postsPerPage, this.currentPage)
    }

    ngOnDestroy() {
        if (this.postsSub) {
            this.postsSub.unsubscribe()
        }
        this.authStatusSub.unsubscribe()
    }
}