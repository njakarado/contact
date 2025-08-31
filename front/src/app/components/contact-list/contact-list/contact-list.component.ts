import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ContactService } from '../../../services/contact.service';
import { NotificationService } from '../../../services/notification.service';
import { Contact } from '../../../models/contact.model';
import { AppContactComponent } from '../app-contact/app-contact.component';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, AppContactComponent],
  template: `
    <div>
      <h2>Liste des Contacts</h2>
      <button mat-raised-button color="primary" (click)="addNewContact()">Nouveau Contact</button>
      <ul>
        <li
          *ngFor="let contact of contactService.contactsList()"
          (click)="onclick(contact.id)"
          [class.selected]="contactService.selectedContactIdSignal() === contact.id"
        >
          {{ contact.name }}
        </li>
      </ul>
    </div>
    <app-contact />
  `,
  styles: [
    `
      li {
        cursor: pointer;
        padding: 0.5rem;
      }
      li:hover {
        background-color: #f5f5f5;
      }
      li.selected {
        background-color: #e3f2fd;
        font-weight: 500;
      }
    `,
  ],
})
export class ContactListComponent {
  onclick(contactid: number) {
    console.log("click contactid", contactid);
    this.contactService.selectContact(contactid);
  }
  private http = inject(HttpClient);
  contactService = inject(ContactService);
  private notificationService = inject(NotificationService);
  private apiUrl = 'http://localhost:4400/api/Contacts';

  constructor() {
    this.loadContacts();
  }

  // Charge les contacts depuis l'API
  loadContacts(): void {
    this.http.get<Contact[]>(this.apiUrl).subscribe({
      next: (contacts) => this.contactService.setContacts(contacts),
      error: () => this.notificationService.showError('Erreur lors du chargement des contacts.'),
    });
  }

  // Ajoute un nouveau contact
  addNewContact(): void {
    this.contactService.selectContact(null);
    this.contactService.setDetailFormState(null);
    this.contactService.setAddressFormState(null);
  }
}
