import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeesTable } from './interface/employees-table.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  private apiUrl:string='http://127.0.0.1:5000/employees'
  
    constructor(private http:HttpClient) { }
  
    getAll():Observable<{success:boolean,data:EmployeesTable[]}>{
      return  this.http.get<{success:boolean,data:EmployeesTable[]}>(this.apiUrl);
    }
}
