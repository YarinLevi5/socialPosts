import { NgModule } from "@angular/core";
import { MatInputModule } from '@angular/material/input'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    imports: [
        MatProgressSpinnerModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
        MatPaginatorModule,
        MatDialogModule,
        MatExpansionModule,
        MatButtonModule,
        MatInputModule,
    ],
    exports: [
        MatProgressSpinnerModule,
        MatInputModule,
        MatCardModule,
        MatButtonModule,
        MatToolbarModule,
        MatExpansionModule,
        MatPaginatorModule,
        MatDialogModule,
        MatExpansionModule,
        MatButtonModule,
        MatInputModule,
    ]
})

export class AngularMaterialModule { }