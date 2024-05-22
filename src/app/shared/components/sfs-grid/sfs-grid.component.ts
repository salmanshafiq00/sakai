import { Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Customer, Representative } from 'src/app/demo/api/customer';
import { CustomerService } from 'src/app/demo/service/customer.service';
import { ProductService } from 'src/app/demo/service/product.service';

@Component({
  selector: 'app-sfs-grid',
  templateUrl: './sfs-grid.component.html',
  styleUrl: './sfs-grid.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class SfsGridComponent implements OnInit {

  customers1: Customer[] = [];
  loading: boolean = true;
  representatives: Representative[] = [];
  statuses: any[] = [];

  activityValues: number[] = [0, 100];

  @Input() title: string = '';

  @ViewChild('filter') filter!: ElementRef;

  private customerService: CustomerService = inject(CustomerService);
  private productService: ProductService = inject(ProductService);

  ngOnInit(): void {

    this.customerService.getCustomersLarge().then(customers => {
      this.customers1 = customers;
      console.log(customers)
      this.loading = false;

      // @ts-ignore
      this.customers1.forEach(customer => customer.date = new Date(customer.date));
  });

    this.representatives = [
      { name: 'Amy Elsner', image: 'amyelsner.png' },
      { name: 'Anna Fali', image: 'annafali.png' },
      { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
      { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
      { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
      { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
      { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
      { name: 'Onyama Limba', image: 'onyamalimba.png' },
      { name: 'Stephen Shaw', image: 'stephenshaw.png' },
      { name: 'XuXue Feng', image: 'xuxuefeng.png' }
    ];

    this.statuses = [
      { label: 'Unqualified', value: 'unqualified' },
      { label: 'Qualified', value: 'qualified' },
      { label: 'New', value: 'new' },
      { label: 'Negotiation', value: 'negotiation' },
      { label: 'Renewal', value: 'renewal' },
      { label: 'Proposal', value: 'proposal' }
    ];
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
}



