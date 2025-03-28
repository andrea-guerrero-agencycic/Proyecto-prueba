import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { coolGray } from 'tailwindcss/colors';
import { id } from 'date-fns/locale';


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
export class EmployeCreateUpdateComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: EmployeesTable | undefined,
    private dialogRef: MatDialogRef<EmployeCreateUpdateComponent>,
    private fb: FormBuilder
  ) {}
  
  form = this.fb.group({
    id: new FormControl(this.defaults?.id),
    name: new FormControl(this.defaults?.name ||'',[Validators.required]),
    phone: new FormControl(this.defaults?.phone ||'',[Validators.required,Validators.minLength(10),Validators.maxLength(10)]),
    email: new FormControl(this.defaults?.email ||'',[Validators.required,Validators.email]),
    address: new FormControl(this.defaults?.address ||'',[Validators.required]),
    time_in_company: new FormControl(this.defaults?.time_in_company ||'',[Validators.required]),
    position_employe: new FormControl(this.defaults?.position_employe ||'',[Validators.required]),
    contract_type: new FormControl(this.defaults?.contract_type ||'',[Validators.required]),
    employe_activate: new FormControl(this.defaults?.employe_activate),
  });
  mode: 'create' | 'update' = 'create';

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
    this.form.value.employe_activate=1
    const employe = this.form.value;
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
    employe.employe_activate = this.defaults.employe_activate;
    this.dialogRef.close(employe);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  errorMessage(){
    // console.log("email",this.form.get('email')?.errors)
    return true
  }
}
