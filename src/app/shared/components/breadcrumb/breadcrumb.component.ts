import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { map, filter } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  providers: [Router, ActivatedRoute]
})
export class BreadcrumbComponent implements OnInit {

  menuItems: MenuItem[] = []
  home: MenuItem | undefined;

  private router: Router = inject(Router);
  private activateRoute: ActivatedRoute = inject(ActivatedRoute);


  ngOnInit(): void {
    this.home = { icon: 'pi pi-home', routerLink: '/' };
      this.router.events
        .pipe(
          filter(event => event instanceof NavigationEnd),
          map(() => this.buildBreadcrumbs(this.activateRoute.root))
        );
  }

  buildBreadcrumbs(route: ActivatedRoute, url: string = '', menuItems: MenuItem[] = []): MenuItem[] {
    const label = route.routeConfig?.data?.['breadcrumb'];
    const path = route.routeConfig?.path;
    const nextUrl = `${url}${path ? `/${path}` : ''}`;

    const breadcrumb: MenuItem = {
      label: label || 'Home',
      url: nextUrl
    };

    const newBreadcrumbs = label ? [...menuItems, breadcrumb] : menuItems;

    if (route.firstChild) {
      return this.buildBreadcrumbs(route.firstChild, nextUrl, newBreadcrumbs);
    }

    return newBreadcrumbs;
  }

}
