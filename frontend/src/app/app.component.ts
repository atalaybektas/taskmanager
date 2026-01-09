import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>
  `,
  styles: []
})
export class AppComponent {
  title = 'Task Manager';
}


