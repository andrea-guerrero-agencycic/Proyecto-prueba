import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { Observable, of, ReplaySubject } from 'rxjs';
import { catchError, filter } from 'rxjs/operators';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl
} from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { EmployeesTable } from './interface/employees-table.model';
import { EmployeCreateUpdateComponent } from './employe-create-update/employe-create-update.component';
import { EmployeesService } from './employees.service';

@Component({
  selector: 'vex-employees-table',
  standalone: true,
  animations: [fadeInUp400ms, stagger40ms],
  imports: [
    VexPageLayoutComponent,
    VexPageLayoutHeaderDirective,
    VexBreadcrumbsComponent,
    MatButtonToggleModule,
    ReactiveFormsModule,
    VexPageLayoutContentDirective,
    NgIf,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    NgFor,
    NgClass,
    MatPaginatorModule,
    FormsModule,
    MatDialogModule,
    MatInputModule
  ],
  templateUrl: './employees-table.component.html',
  styleUrl: './employees-table.component.scss'
})
export class EmployeesTableComponent implements OnInit, AfterViewInit {
  layoutCtrl = new UntypedFormControl('boxed');

  /**
   * Simulating a service with HTTP that returns Observables
   * You probably want to remove this and do all requests in a service with HTTP
   */
  subject$: ReplaySubject<EmployeesTable[]> = new ReplaySubject<EmployeesTable[]>(1);
  data$: Observable<EmployeesTable[]> = this.subject$.asObservable();
  employees: EmployeesTable[] = [];

  @Input()
  columns: TableColumn<EmployeesTable>[] = [
    {
      label: 'Name',
      property: 'name',
      type: 'text',
      visible: true,
      cssClasses: ['font-medium']
    },
    {
      label: 'Phone',
      property: 'phone',
      type: 'text',
      visible: true,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: 'Email',
      property: 'email',
      type: 'text',
      visible: true,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: 'Address',
      property: 'address',
      type: 'text',
      visible: true,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: 'Time in company',
      property: 'time_in_company',
      type: 'text',
      visible: true,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: 'Position employe',
      property: 'position_employe',
      type: 'text',
      visible: true,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: 'Contract Type',
      property: 'contract_type',
      type: 'text',
      visible: true,
      cssClasses: ['text-secondary', 'font-medium']
    },
    {
      label: 'Employe Activate',
      property: 'employe_activate',
      type: 'text',
      visible: true,
      cssClasses: ['text-secondary', 'font-medium']
    },
    { label: 'Actions', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource!: MatTableDataSource<EmployeesTable>;
  selection = new SelectionModel<EmployeesTable>(true, []);
  searchCtrl = new UntypedFormControl();

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(private dialog: MatDialog, private service: EmployeesService) { }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  /**
   * Example on how to get data and pass it to the table - usually you would want a dedicated service with a HTTP request for this
   * We are simulating this request here.
   */

  ngOnInit() {
    this.getData();
    this.dataSource = new MatTableDataSource();

    this.data$.pipe(filter<EmployeesTable[]>(Boolean)).subscribe((employees) => {
      this.employees = employees;
      this.dataSource.data = employees;
    });

    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));
  }

  getData() {
    this.service.getAllEmployee().subscribe((employees) => {
      this.employees = employees.data;
      this.subject$.next(this.employees);
    });

  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  createEmploye() {
    this.dialog
      .open(EmployeCreateUpdateComponent)
      .afterClosed()
      .subscribe((employe: EmployeesTable) => {
        /**
         * EmployeesTable is the updated EmployeesTable (if the user pressed Save - otherwise it's null)
         */
        if (employe) {
          try {
            this.service.createEmploye(employe).subscribe((response) => {
              if(response.success){
                this.employees.unshift(new EmployeesTable(employe));
                this.subject$.next(this.employees);
              }
  
            })
            
          } catch (error) {
            console.error(error)
          }
          
        }
      });
  }

  updateEmploye(employe: EmployeesTable) {
    this.dialog
      .open(EmployeCreateUpdateComponent, {
        data: employe
      })
      .afterClosed()
      .subscribe((updateEmploye) => {
        /**
         * employee is the updated employee (if the user pressed Save - otherwise it's null)
         */
        if (updateEmploye) {
          try {
            this.service.updateEmploye(updateEmploye).subscribe((response) => {
              if (response.success) {
                const index = this.employees.findIndex(
                  (existingCustomer) => existingCustomer.id === updateEmploye.id
                );
                this.employees[index] = new EmployeesTable(updateEmploye);
                this.subject$.next(this.employees);
              }
            })

          } catch (error) {
            console.error(error)
          }



        }
      });
  }

  deleteEmploye(id:number) {
    if (id) {
      try {
        this.service.deleteEmployee(id).subscribe((response) => {
          if (response.success) {
            this.employees.splice(
              this.employees.findIndex(
                (existingCustomer) => existingCustomer.id === id
              ),
              1
            );
            this.subject$.next(this.employees);
          }
        })

      } catch (error) {
        console.error(error)
      }
    }
    else{
      console.error("id no existe")
    }
  }


  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  toggleColumnVisibility(column: TableColumn<EmployeesTable>, event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  // onLabelChange(change: MatSelectChange, row: EmployeesTable) {
  //   const index = this.employees.findIndex((c) => c === row);
  //   this.employees[index].labels = change.value;
  //   this.subject$.next(this.employees);
  // }
}
