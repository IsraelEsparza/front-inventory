import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { NewCategoryComponent } from '../new-category/new-category.component';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  constructor(
    private categoryService: CategoryService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<CategoryElement>();

  getCategories() {
    this.categoryService.getCategories().subscribe(
      (data) => {
        console.log('RPTA', data);
        this.processCategoryResponse(data);
      },
      (error) => {
        console.log('error', error);
      }
    );
  }

  processCategoryResponse(resp: any) {
    const dataCategory: CategoryElement[] = [];
    if (resp.metadata[0].code == '00') {
      let listCategory = resp.categoryResponse.category;
      listCategory.forEach((element: CategoryElement) => {
        dataCategory.push(element);
        this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory);
      });
    }
  }

  openCategoryDialog() {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackbar('Categoria Agregada', 'Exitosa');
        this.getCategories();
      } else if (result == 2) {
        this.openSnackbar('Se produjo un error al guardar Categoria', 'Error');
      }
    });
  }

  edit(id: number, name: string, description: string) {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      data: { id: id, name: name, description: description },
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackbar('Categoria Actualizada', 'Exitosa');
        this.getCategories();
      } else if (result == 2) {
        this.openSnackbar(
          'Se produjo un error al actualizar Categoria',
          'Error'
        );
      }
    });
  }

  delete(id: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackbar('Categoria Eliminada', 'Exitosa');
        this.getCategories();
      } else if (result == 2) {
        this.openSnackbar('Se produjo un error al eliminar Categoria', 'Error');
      }
    });
  }

  openSnackbar(
    message: string,
    actions: string
  ): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, actions, {
      duration: 2000,
    });
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      this.categoryService.getCategories();
    }
    this.categoryService.getCategoryById(termino).subscribe((resp: any) => {
      this.processCategoryResponse(resp);
    });
  }
}

export interface CategoryElement {
  description: string;
  id: number;
  name: string;
}
