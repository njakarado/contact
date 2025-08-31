import { Component, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ContactService } from '../../../../services/contact.service';

@Component({
  selector: 'app-contact-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule],
  template: `
    <div *ngIf="contactService.selectedContact(); else noAddress">
      <form [formGroup]="addressForm">
        <fieldset>
          <legend>Adresse</legend>
          <div>
            <label>Rue:</label>
            <input formControlName="street" />
          </div>
          <div>
            <label>Ville:</label>
            <input formControlName="city" />
          </div>
          <div>
            <label>Code Postal:</label>
            <input formControlName="postalCode" />
          </div>
          <div>
            <label>Pays:</label>
            <input formControlName="country" />
          </div>
          <div class="button-group">
            <button mat-raised-button color="primary" (click)="saveAddress()" [disabled]="addressForm.invalid">
              Enregistrer
            </button>
          </div>
        </fieldset>
      </form>
    </div>
    <ng-template #noAddress>
      <p>Sélectionnez un contact pour gérer son adresse.</p>
    </ng-template>
  `,
  styles: [`
    fieldset { border: 1px solid #ccc; border-radius: 4px; padding: 0.5rem; margin: 1rem 0; }
    .button-group { margin-top: 1rem; }
  `]
})
export class ContactAddressComponent implements OnInit {
  addressForm: FormGroup;
  private fb = inject(FormBuilder);
    contactService = inject(ContactService);

  constructor() {
    this.addressForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
    });
    // Utilise `effect` avec un guard pour réagir aux changements du Signal
    effect(() => {
      const id = this.contactService.selectedContactIdSignal();
      console.log('Selected contact ID changed (address):', id);

      // Guard : Met à jour le formulaire uniquement si un contact est sélectionné (id non null)
      if (id !== null) {
        this.updateForm();
      } else {
        // Réinitialise le formulaire si aucun contact n'est sélectionné
        this.addressForm.reset();
      }
    });
  }
   updateForm(): void {
    const contact = this.contactService.selectedContact();
    if (contact && contact.address) {
         console.log("selectedContact addressForm", contact.address);
      this.addressForm.patchValue(contact.address);
    } else {
      this.addressForm.reset();
    }
  }


  ngOnInit(): void {
    // Restaure l'état du formulaire depuis le service
    const savedState = this.contactService.getAddressFormState();
    console.log("restaure addressForm", savedState);
    if (savedState) {
      this.addressForm.patchValue(savedState);
    }

    // Sauvegarde l'état à chaque changement
    this.addressForm.valueChanges.subscribe(state => {
    
        console.log("sauve addressForm", state);
      this.contactService.setAddressFormState(state);
    });
  }

  saveAddress(): void {
    if (this.addressForm.valid) {
      const contact = this.contactService.selectedContact();
      if (contact?.id) {
        this.contactService.updateAddress(contact.id, this.addressForm.value);
      }
    }
  }
}
