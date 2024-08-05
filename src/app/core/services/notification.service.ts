import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr'
import { Subject } from 'rxjs';
import { AppNotificationModel } from 'src/app/modules/generated-clients/api-service';
import { environment } from 'src/environments/environment';

@Injectable()
export class NotificationService {
  private hubConnection: signalR.HubConnection;
  public newNotification: Subject<AppNotificationModel> = new Subject<AppNotificationModel>();

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.API_BASE_URL}/notificationHub`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();

    this.hubConnection.on('ReceiveNotification', (notification: AppNotificationModel) => {
      console.log(`Notification received: ${notification}`);
      this.newNotification.next(notification);
    });

    this.startConnection();
  }

  private startConnection() {
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch((error) => console.log('Error while starting connection: ', error));
  }

  public sendNotification(userId: string, message: any) {
    this.hubConnection.invoke('SendNotification', userId, message)
      .catch(err => console.log(err));
  }
}
