import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { ContactService } from '../../../services/contact.service';
import { ContactAddressComponent } from './contact-address/contact-address.component';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, MatTabsModule, ContactDetailComponent, ContactAddressComponent],
  template: `
    <mat-tab-group [preserveContent]="true">
      <mat-tab label="Détails">
        <app-contact-detail />
      </mat-tab>
      <mat-tab label="Adresse" [disabled]="!contactService.selectedContactIdSignal()">
        <app-contact-address />
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [`
    mat-tab-group { margin-top: 1rem; }
  `]
})
export class AppContactComponent {
  contactService = inject(ContactService);
}
