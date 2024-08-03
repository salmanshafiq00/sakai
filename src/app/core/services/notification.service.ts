import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr'
import { environment } from 'src/environments/environment';

@Injectable()
export class NotificationService {
  private hubConnection: signalR.HubConnection;

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.API_BASE_URL}/notificationHub`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();

    this.hubConnection.on('ReceiveNotification', (message: string) => {
      console.log(`Notification received: ${message}`);
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
