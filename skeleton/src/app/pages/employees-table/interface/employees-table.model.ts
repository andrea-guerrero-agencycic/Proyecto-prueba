export class EmployeesTable {
    id?: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    time_in_company: string;
    position_employe: string;
    contract_type: string;
    employe_activate?: boolean;

    constructor(employee: any) {
        this.id = employee.id;
        this.name = employee.name;
        this.phone = employee.phone;
        this.email = employee.email;
        this.address = employee.address;
        this.time_in_company = employee.time_in_company;
        this.position_employe = employee.position_employe;
        this.contract_type = employee.contract_type;
        this.employe_activate = employee.employe_activate;
    }
}
