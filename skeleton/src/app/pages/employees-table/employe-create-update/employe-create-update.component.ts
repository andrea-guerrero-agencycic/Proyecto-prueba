import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { EmployeesTable } from '../interface/employees-table.model';


@Component({
  selector: 'vex-employe-create-update',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    NgIf,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './employe-create-update.component.html',
  styleUrl: './employe-create-update.component.scss'
})
export class EmployeCreateUpdateComponent {
  static id = 100;

  form = this.fb.group({
    name: [this.defaults?.name || ''],
    phone: [this.defaults?.phone || ''],
    email: this.defaults?.email || '',
    address: this.defaults?.address || '',
    time_in_company: this.defaults?.time_in_company || '',
    position_employe: this.defaults?.position_employe || '',
    contract_type: this.defaults?.contract_type || '',
    employe_activate: this.defaults?.employe_activate || true,
  });
  mode: 'create' | 'update' = 'create';

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: EmployeesTable | undefined,
    private dialogRef: MatDialogRef<EmployeCreateUpdateComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as EmployeesTable;
    }

    this.form.patchValue(this.defaults);
  }

  save() {
    if (this.mode === 'create') {
      this.createEmploye();
    } else if (this.mode === 'update') {
      this.updateEmploye();
    }
  }

  createEmploye() {
    const employe = this.form.value;

    if (!employe.imageSrc) {
      employe.imageSrc = 'assets/img/avatars/1.jpg';
    }

    this.dialogRef.close(employe);
  }

  updateEmploye() {
    const employe = this.form.value;

    if (!this.defaults) {
      throw new Error(
        'employe ID does not exist, this employe cannot be updated'
      );
    }

    employe.id = this.defaults.id;

    this.dialogRef.close(employe);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }
}
