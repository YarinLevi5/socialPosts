import { ErrorComponent } from './../error/error.component';
import { MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private dialog: MatDialog) { }
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMsg = 'An unknown error occurred'
                if (error.error.message) {
                    errorMsg = error.error.message
                }
                this.dialog.open(ErrorComponent, { data: { message: errorMsg } })
                return throwError(error)
            })
        )
    }
}