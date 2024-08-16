import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'About',
        icon: 'pi pi-home',
        command: () => {

        }
      },
      {
        label: 'Change Password',
        icon: 'pi pi-chart-line',
        command: () => {
        }
      },
      {
        label: 'Change Photo',
        icon: 'pi pi-image',
        command: () => {

        }
      },
      {
        label: 'Messages',
        icon: 'pi pi-inbox',
        command: () => {
          alert('Hello 4')
        }
      }
    ];

    this.activeItem = this.items[0];
  }

  onActiveItemChange(event: MenuItem) {
    this.activeItem = event;
  }

}




