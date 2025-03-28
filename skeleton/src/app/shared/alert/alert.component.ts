import { Component } from '@angular/core';
import { AlertService } from './alert.service';

@Component({
  selector: 'vex-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent {
  constructor(private alertService: AlertService) { }

  ngOnInit() { }

  openSnackBar() {
    this.alertService.openSnackBar('This is an alert message.');
  }
}
