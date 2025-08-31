import { Component, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ContactService } from '../../../../services/contact.service';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
  template: `
    <div *ngIf="contactService.selectedContact(); else noContact">
      <form [formGroup]="detailForm">
        <div>
          <label>Nom:</label>
          <input formControlName="name" />
        </div>
        <div>
          <label>Email:</label>
          <input formControlName="email" type="email" />
        </div>
        <div>
          <label>Téléphone:</label>
          <input formControlName="phone" />
        </div>
        <div class="button-group">
          <button mat-raised-button color="primary" (click)="saveDetail()" [disabled]="detailForm.invalid">
            {{ contactService.selectedContact()?.id ? 'Modifier' : 'Ajouter' }}
          </button>
          <button mat-raised-button color="warn" (click)="deleteContact()" *ngIf="contactService.selectedContact()?.id">
            Supprimer
          </button>
          <button mat-raised-button (click)="resetForm()" *ngIf="contactService.selectedContact()?.id">
            Annuler
          </button>
        </div>
      </form>
    </div>
    <ng-template #noContact>
      <p>Aucun contact sélectionné.</p>
    </ng-template>
  `,
  styles: [`
    .button-group { margin-top: 1rem; gap: 0.5rem; display: flex; }
  `]
})
export class ContactDetailComponent implements OnInit {
  detailForm: FormGroup;
  private fb = inject(FormBuilder);
  contactService = inject(ContactService);

  constructor( ) {
    this.detailForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
    });

    effect(() => {
      const id = this.contactService.selectedContactIdSignal();
      console.log('Selected contact ID changed:', id);

      // Guard : Met à jour le formulaire uniquement si un contact est sélectionné (id non null)
      if (id !== null) {
        this.updateForm();
      } else {
        // Réinitialise le formulaire si aucun contact n'est sélectionné
        this.detailForm.reset();
      }
    });
  }

   updateForm(): void {
    const contact = this.contactService.selectedContact();
    if (contact) {
      this.detailForm.patchValue(contact);
    } else {
      this.detailForm.reset();
    }
  }

  ngOnInit(): void {
    // Restaure l'état du formulaire depuis le service
    const savedState = this.contactService.getDetailFormState();
    console.log("restaure detailForm", savedState);
    if (savedState) {
      this.detailForm.patchValue(savedState);
    }

    // Sauvegarde l'état à chaque changement
    this.detailForm.valueChanges.subscribe(state => {
      this.contactService.setDetailFormState(state);
    });
  }

  saveDetail(): void {
    if (this.detailForm.valid) {
      const contact = this.contactService.selectedContact();
      if (contact?.id) {
        this.contactService.updateContact({ ...contact, ...this.detailForm.value });
      } else {
        this.contactService.addContact(this.detailForm.value);
      }
    }
  }

  deleteContact(): void {
    const contact = this.contactService.selectedContact();
    if (contact?.id) {
      this.contactService.deleteContact(contact.id);
    }
  }

  resetForm(): void {
    const contact = this.contactService.selectedContact();
    if (contact) {
      this.detailForm.patchValue(contact);
    }
  }
}
