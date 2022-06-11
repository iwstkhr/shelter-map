import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  imports: [
    /** Angular */
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    /** Angular Material */
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatRadioModule,
    MatTableModule,
  ],
  exports: [
    /** Angular */
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    /** Angular Material */
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatRadioModule,
    MatTableModule,
  ]
})
export class SharedModule {}
