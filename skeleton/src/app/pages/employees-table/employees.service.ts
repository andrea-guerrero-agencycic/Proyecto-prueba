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
    
    createEmploye(employe:EmployeesTable):Observable<{success:boolean,message:string}>{
      var resultado= this.http.post<{success:boolean,message:string}>(this.apiUrl,employe);    
      return resultado;
    }

    updateEmploye(newEmploye:EmployeesTable):Observable<{success:boolean,message:string}>{
      const url = `${this.apiUrl}/${newEmploye.id}`;  
      return this.http.put<{success:boolean,message:string}>(url,newEmploye);
    }

    deleteEmploye(id:String):Observable<{success:boolean,message:string}>{
      const url = `${this.apiUrl}/${id}`;
      return this.http.delete<{success:boolean,message:string}>(url)
      }
}
