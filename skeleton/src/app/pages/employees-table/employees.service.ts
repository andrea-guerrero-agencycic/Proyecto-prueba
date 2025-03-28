import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { EmployeesTable } from './interface/employees-table.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  private apiUrl: string = 'http://127.0.0.1:5000/employees'

  constructor(private http: HttpClient) { }

  // deleteEmploye(id: String): Observable<{ success: boolean, message: string }> {
  //   const url = `${this.apiUrl}/${id}`;
  //   return this.http.delete<{ success: boolean, message: string }>(url)
  // }

  getAllEmployee(): Observable<{ success: boolean, data: EmployeesTable[] }> {
    return this.http.get<{ success: boolean, data: EmployeesTable }>(this.apiUrl).pipe(
      map(response => {
        if (response.success) {
          const employeList: EmployeesTable[] = Array.isArray(response.data)
            ? response.data.map((item: any) => new EmployeesTable(item))
            : [];
          return { success: true, message: "Empleados encontrados", data: employeList };
        } else {
          return { success: false, message: "No hay Empleados", data: [] };
        }
      })
    );
  }

  createEmploye(employe: EmployeesTable): Observable<{ success: boolean; message: string; data?: any }> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<{ success: boolean; message: string; data?: any }>(this.apiUrl, employe, { headers }).pipe(
      map(response => {
        console.log("res", response)
        return response
        if (response.success) {
          const newEmployee = new EmployeesTable(response.data);
          return { success: true, message: "Empleado creado", data: newEmployee };
        } else {
          console.error("Error al crear el empleado:", response);
          return { success: false, message: "Error al crear el empleado", data: response.data };
        }
      }),
      catchError(error => {
        console.error("API error:", error);
        return of({ success: false, message: error.message });
      })
    );
  }

  updateEmploye(employe: EmployeesTable): Observable<{ success: boolean; message: string; data?: any }> {
    const headers = new HttpHeaders().set("Content-Type", "application/json");
    return this.http.put<{ success: boolean; message: string; data?: any }>(`${this.apiUrl}/${employe.id}`, employe, { headers }).pipe(
      map(response => {
        if (response.success) {
          return { success: true, message: "Empleado actualizado", data: employe };
        } else {
          console.error("Error al actualizar el empleado:", response);
          return { success: false, message: "Error al actualizar el empleado", data: response.data };
        }
      }),
      catchError(error => {
        console.error("API error:", error);
        return of({ success: false, message: error.message, data: [] });
      })
    );
  }

  deleteEmployee(id: number): Observable<{ success: boolean; message: string }> {
      const headers = new HttpHeaders().set("Content-Type", "application/json");
      return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`, { headers }).pipe(
          map(response => {
              if (response.success) {
                  return { success: true, message: "Empleado eliminado"};
              } else {
                  console.error("Error al eliminar el empleado:", response);
                  return { success: false, message: "Error al eliminar el empleado" };
              }
          }),
          catchError(error => {
              console.error("API error:", error);
              return of({ success: false, message: error.message, data: [] });
          })
      );
  }
}
