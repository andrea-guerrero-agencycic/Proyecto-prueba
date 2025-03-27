import { LayoutComponent } from './layouts/layout/layout.component';
import { VexRoutes } from '@vex/interfaces/vex-route.interface';

export const appRoutes: VexRoutes = [
  {
    path: '',
    component: LayoutComponent,
    children: [ {
      path: 'employees',
      loadComponent: () =>
        import('./pages/employees-table/employees-table.component').then(
          (m) => m.EmployeesTableComponent
        ),
      data: {
        toolbarShadowEnabled: false
      }
    },]
  },
 
];
