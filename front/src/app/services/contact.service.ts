import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contact, Address } from '../models/contact.model';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);
  private apiUrl = 'http://localhost:4400/contacts';
   private apiUrladdress = 'http://localhost:4400/api/Addresses';

  // État réactif des contacts
  private contacts = signal<Contact[]>([]);
  private selectedContactId = signal<number | null>(null);

  // État des formulaires (pour conserver les données entre les onglets)
  detailFormState = signal<Partial<Contact> | null>(null);
  addressFormState = signal<Partial<Address> | null>(null);

  // État dérivé
  selectedContact = computed(() => {
    const id = this.selectedContactId();
     console.log("selectedContact", id);
    return this.contacts().find(contact => contact.id === id) ?? null;
  });

  // Expose les signaux en lecture seule
  contactsList = this.contacts.asReadonly();
  selectedContactIdSignal = this.selectedContactId.asReadonly();

  constructor() {
    // Chargement initial (optionnel, peut être appelé depuis contact-list)
  }

  // Met à jour la liste des contacts
  setContacts(contacts: Contact[]): void {
    this.contacts.set(contacts);
  }

  // Sélectionne un contact
  selectContact(id: number | null): void {
    this.selectedContactId.set(id);
  }

  // Sauvegarde l'état du formulaire de détails
  setDetailFormState(state: Partial<Contact> | null): void {
    this.detailFormState.set(state);
  }

  // Récupère l'état du formulaire de détails
  getDetailFormState(): Partial<Contact> | null {
    return this.detailFormState();
  }

  // Sauvegarde l'état du formulaire d'adresse
  setAddressFormState(state: Partial<Address> | null): void {
    this.addressFormState.set(state);
  }

  // Récupère l'état du formulaire d'adresse
  getAddressFormState(): Partial<Address> | null {
    return this.addressFormState();
  }

  // Appel HTTP : Ajoute un contact
  addContact(newContact: Omit<Contact, 'id'>): void {
    this.http.post<Contact>(this.apiUrl, newContact).subscribe({
      next: (contact) => {
        this.contacts.update(contacts => [...contacts, contact]);
        this.selectedContactId.set(contact.id);
        this.notificationService.showSuccess('Contact ajouté !');
      },
      error: () => this.notificationService.showError("Erreur lors de l'ajout du contact.")
    });
  }

  // Appel HTTP : Met à jour un contact
  updateContact(updatedContact: Contact): void {
    this.http.put<Contact>(`${this.apiUrl}/${updatedContact.id}`, updatedContact).subscribe({
      next: () => {
        this.contacts.update(contacts =>
          contacts.map(contact =>
            contact.id === updatedContact.id ? updatedContact : contact
          )
        );
        this.notificationService.showSuccess('Contact mis à jour !');
      },
      error: () => this.notificationService.showError("Erreur lors de la mise à jour du contact.")
    });
  }

  // Appel HTTP : Supprime un contact
  deleteContact(id: number): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.contacts.update(contacts =>
          contacts.filter(contact => contact.id !== id)
        );
        this.selectedContactId.set(null);
        this.notificationService.showSuccess('Contact supprimé !');
      },
      error: () => this.notificationService.showError("Erreur lors de la suppression du contact.")
    });
  }

  // Appel HTTP : Met à jour l'adresse
  updateAddress(id: number, address: Address): void {
    this.http.put<Contact>(`${this.apiUrladdress}/by-contact/${id}`, { address }).subscribe({
      next: () => {
        this.contacts.update(contacts =>
          contacts.map(contact =>
            contact.id === id ? { ...contact, address } : contact
          )
        );
        this.notificationService.showSuccess('Adresse mise à jour !');
      },
      error: () => this.notificationService.showError("Erreur lors de la mise à jour de l'adresse.")
    });
  }
}
