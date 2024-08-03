import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { NotificationService } from './core/services/notification.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    constructor(
        private primengConfig: PrimeNGConfig,
        private notificationService: NotificationService) { }

    ngOnInit() {
        this.primengConfig.ripple = true;
    }
}
