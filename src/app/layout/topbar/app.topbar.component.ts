import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { LayoutService } from "../service/app.layout.service";
import { OverlayPanel } from 'primeng/overlaypanel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AppNotificationModel } from 'src/app/modules/generated-clients/api-service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styleUrls: ['./app.topbar.component.scss']
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
    @ViewChild('topbarmenu') menu!: ElementRef;
    @ViewChild('notifPanel') notifPanel!: OverlayPanel;

    initialLoaded = false;
    notifications: AppNotificationModel[] = [];
    unseenMsgCount = 0;

    private readonly apiUrl = `${environment.API_BASE_URL}/api/AppNotifications/GetByUser`;
    private readonly httpOptions = {
        observe: 'body' as const,
        withCredentials: true,
        headers: new HttpHeaders({
            'Accept': 'application/json'
        })
    };

    constructor(
        public layoutService: LayoutService,
        private http: HttpClient,
        private notificationService: NotificationService,
        private messageService: MessageService
    ) {
        this.initializeNotifications();
        this.handleNewNotification();
    }

    private initializeNotifications(): void {
        setTimeout(() => {
            if (!this.initialLoaded) {
                this.fetchNotifications();
            }
        }, 5000);
    }

    toggleNotifPanel(event: Event): void {
        if (this.initialLoaded) {
            this.notifPanel.toggle(event);
        } else {
            this.fetchNotifications(event);
        }
    }

    private fetchNotifications(event?: Event): void {
        this.http.get<AppNotificationModel[]>(this.apiUrl, this.httpOptions).subscribe({
            next: (data) => {
                this.notifications = data;
                this.unseenMsgCount = this.notifications.filter(n => !n.isSeen).length;
                this.initialLoaded = true;

                if (event) {
                    this.notifPanel.toggle(event);
                }
            },
            error: (err) => {
                console.error('Error fetching notifications', err);
            }
        });
    }

    private handleNewNotification(){
        this.notificationService.newNotification.subscribe({
            next: (notify: AppNotificationModel) => {
                this.notifications.unshift(notify);
                this.unseenMsgCount += 1;
                this.messageService.add({ key: 'notification', severity: 'info', summary: notify.description });
            }
        });
    }
}
