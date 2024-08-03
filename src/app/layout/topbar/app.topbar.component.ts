import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "../service/app.layout.service";
import { OverlayPanel } from 'primeng/overlaypanel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AppNotificationModel } from 'src/app/modules/generated-clients/api-service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrl: './app.topbar.component.scss'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    @ViewChild('notifPanel') notifPanel: OverlayPanel;

    initialLoaded: boolean = false;
    notifications: AppNotificationModel[] = [];

    constructor(public layoutService: LayoutService, private http: HttpClient) { }

    toggleNotifPanel(event: Event){
        if(this.initialLoaded){
            this.notifPanel.toggle(event)
        } else {
            this.getByUser(event);
            this.initialLoaded = true;
        }
    }

    private getByUser(event: Event) {
        const url = environment.API_BASE_URL + "/api/AppNotifications/GetByUser";
        const options = {
            observe: 'body' as 'body', 
            withCredentials: true,
            headers: new HttpHeaders({
              'Accept': 'application/json'
            })
          };

        return this.http.get<AppNotificationModel[]>(url, options).subscribe({
            next: (data) => {
                this.notifications = data;
                this.notifPanel.toggle(event)
            },
            error: (err) => {
                console.error('Error fetching notifications', err);
            }
        });
    }
}
